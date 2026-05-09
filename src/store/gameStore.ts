import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { GameState, Player, Profession, Asset } from '../types/game';
import { recalculateStatement } from '../utils/finance';
import { SMALL_DEALS, BIG_DEALS, DOODADS, MARKET } from '../data/cards';

const initialPlayers: Player[] = [];

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      players: initialPlayers,
      currentPlayerIndex: 0,
      turnPhase: 'ROLL',
      diceRoll: [],
      activeCard: null,
      pendingPaydays: 0,
      winner: null,

      addPlayer: (name: string, color: string, profession: Profession, dreamId: string = 'yacht') => {
        const newPlayer: Player = {
          id: Math.random().toString(36).substring(7),
          name,
          color,
          profession,
          dreamId,
          phase: 'RAT_RACE',
          position: 0,
          isBankrupt: false,
          lostTurns: 0,
          fastTrackCashflow: 0,
          fastTrackTarget: 0,
          hasBoughtDream: false,
          charityTurnsRemaining: 0,
          statement: {
            salary: profession.salary,
            passiveIncome: 0,
            totalIncome: profession.salary,
            taxes: profession.taxes,
            homeMortgagePayment: profession.mortgagePayment,
            schoolLoanPayment: profession.schoolLoanPayment,
            carLoanPayment: profession.carLoanPayment,
            creditCardPayment: profession.creditCardPayment,
            retailPayment: profession.retailDebtPayment,
            otherExpenses: profession.otherExpenses,
            childExpenses: 0,
            bankLoanPayment: 0,
            totalExpenses: 0, // Recalculated below
            monthlyCashFlow: 0, // Recalculated below
            cash: profession.savings,
            children: 0,
            assets: [],
            liabilities: [
              { id: 'mortgage', name: 'Home Mortgage', amount: profession.mortgage, payment: profession.mortgagePayment },
              { id: 'school', name: 'School Loans', amount: profession.schoolLoan, payment: profession.schoolLoanPayment },
              { id: 'car', name: 'Car Loans', amount: profession.carLoan, payment: profession.carLoanPayment },
              { id: 'credit', name: 'Credit Card', amount: profession.creditCard, payment: profession.creditCardPayment },
              { id: 'retail', name: 'Retail Debt', amount: profession.retailDebt, payment: profession.retailDebtPayment },
            ].filter(l => l.amount > 0)
          }
        };

        // Ensure perfect starting math
        newPlayer.statement = recalculateStatement(newPlayer.statement, profession);

        set((state) => ({
          players: [...state.players, newPlayer]
        }));
      },

      rollDice: (numDice: number) => {
        const rolls = Array.from({ length: numDice }, () => Math.floor(Math.random() * 6) + 1);
        const totalRoll = rolls.reduce((sum, val) => sum + val, 0);

        set((state) => {
          const currentPlayer = state.players[state.currentPlayerIndex];
          if (!currentPlayer) return state;

          const oldPosition = currentPlayer.position;
          const newPosition = (oldPosition + totalRoll) % 24;
          
          // Check if passed Payday (Space 0, 8, 16). 
          // If the player moved past one of these numbers, they get a payday.
          // Since it's a circle, we check if old -> new crosses them.
          let passedPaydays = 0;
          for (let i = 1; i <= totalRoll; i++) {
            const pos = (oldPosition + i) % 24;
            if (pos === 0 || pos === 8 || pos === 16) {
              passedPaydays++;
            }
          }

          const players = state.players.map((p, idx) => {
            if (idx !== state.currentPlayerIndex) return p;
            return {
              ...p,
              position: newPosition,
              charityTurnsRemaining: p.charityTurnsRemaining > 0 ? p.charityTurnsRemaining - 1 : 0
            };
          });

          return { 
            diceRoll: rolls, 
            turnPhase: 'ACTION',
            players,
            pendingPaydays: state.pendingPaydays + passedPaydays
          };
        });
      },

      collectPayday: () => {
        set((state) => {
          if (state.pendingPaydays === 0) return state;
          
          const currentPlayer = state.players[state.currentPlayerIndex];
          const payAmount = currentPlayer.statement.monthlyCashFlow * state.pendingPaydays;
          
          const players = state.players.map((p, idx) => {
            if (idx !== state.currentPlayerIndex) return p;
            return {
              ...p,
              statement: {
                ...p.statement,
                cash: p.statement.cash + payAmount
              }
            };
          });
          
          return { players, pendingPaydays: 0 };
        });
      },

      drawCard: (type) => {
        let card = null;
        if (type === 'SMALL_DEAL') {
          // For now, randomly pick a small deal
          card = SMALL_DEALS[Math.floor(Math.random() * SMALL_DEALS.length)];
        } else if (type === 'BIG_DEAL') {
          card = BIG_DEALS[Math.floor(Math.random() * BIG_DEALS.length)];
        } else if (type === 'DOODAD') {
          card = DOODADS[Math.floor(Math.random() * DOODADS.length)];
        } else if (type === 'MARKET') {
          card = MARKET[Math.floor(Math.random() * MARKET.length)];
        } else {
          // Fallback placeholder
          card = { type, title: 'Market Event', description: 'Placeholder market event.', actionText: 'OK' };
        }
        set({ activeCard: card });
      },

      resolveCard: () => {
        set({ activeCard: null });
      },

      endTurn: () => {
        set((state) => {
          let nextPlayerIndex = (state.currentPlayerIndex + 1) % Math.max(state.players.length, 1);
          let players = [...state.players];

          // Skip bankrupt players and decrement their lostTurns
          let attempts = 0;
          while (players[nextPlayerIndex]?.isBankrupt && attempts < players.length) {
            players[nextPlayerIndex] = {
              ...players[nextPlayerIndex],
              lostTurns: players[nextPlayerIndex].lostTurns - 1
            };
            
            if (players[nextPlayerIndex].lostTurns <= 0) {
              players[nextPlayerIndex].isBankrupt = false;
            } else {
              nextPlayerIndex = (nextPlayerIndex + 1) % Math.max(state.players.length, 1);
            }
            attempts++;
          }

          return {
            players,
            currentPlayerIndex: nextPlayerIndex,
            turnPhase: 'ROLL',
            diceRoll: [],
            pendingPaydays: 0 // If you didn't collect, you lose it! (Strict rules)
          };
        });
      },

      takeLoan: (playerId: string, amount: number) => {
        if (amount % 1000 !== 0) return; // Must be multiples of 1000
        
        set((state) => {
          const players = state.players.map(p => {
            if (p.id !== playerId) return p;
            
            const existingLoan = p.statement.liabilities.find(l => l.id === 'bank_loan');
            const newPayment = (amount * 0.10);
            
            const newLiabilities = existingLoan 
              ? p.statement.liabilities.map(l => l.id === 'bank_loan' ? { ...l, amount: l.amount + amount, payment: l.payment + newPayment } : l)
              : [...p.statement.liabilities, { id: 'bank_loan', name: 'Bank Loan', amount, payment: newPayment }];

            const draftStatement = {
              ...p.statement,
              cash: p.statement.cash + amount,
              liabilities: newLiabilities
            };

            return {
              ...p,
              statement: recalculateStatement(draftStatement, p.profession)
            };
          });
          return { players };
        });
      },

      payDebt: (playerId: string, liabilityId: string, amount?: number) => {
        set((state) => {
          const players = state.players.map(p => {
            if (p.id !== playerId) return p;
            
            const targetLiability = p.statement.liabilities.find(l => l.id === liabilityId);
            if (!targetLiability) return p;
            
            // If paying bank loan, amount might be partial. Otherwise it's the full amount.
            const payoffAmount = amount || targetLiability.amount;
            
            if (p.statement.cash < payoffAmount) return p; // Not enough cash
            if (liabilityId === 'bank_loan' && payoffAmount % 1000 !== 0) return p; // Bank loans must be $1000 increments
            
            let newLiabilities;
            if (payoffAmount === targetLiability.amount) {
              // Full payoff
              newLiabilities = p.statement.liabilities.filter(l => l.id !== liabilityId);
            } else {
              // Partial payoff (Bank Loan)
              const paymentReduction = payoffAmount * 0.10; // 10% interest rule for bank loans
              newLiabilities = p.statement.liabilities.map(l => 
                l.id === liabilityId 
                  ? { ...l, amount: l.amount - payoffAmount, payment: l.payment - paymentReduction }
                  : l
              );
            }
            
            const draftStatement = {
              ...p.statement,
              cash: p.statement.cash - payoffAmount,
              liabilities: newLiabilities
            };

            return {
              ...p,
              statement: recalculateStatement(draftStatement, p.profession)
            };
          });
          return { players };
        });
      },

      buyAsset: (playerId: string, asset: Asset, force?: boolean) => {
        set((state) => {
          const players = state.players.map(p => {
            if (p.id !== playerId) return p;
            if (!force && p.statement.cash < asset.downPayment) return p; // Not enough cash

            const draftStatement = {
              ...p.statement,
              cash: p.statement.cash - asset.downPayment,
              assets: [...p.statement.assets, asset]
            };

            return {
              ...p,
              statement: recalculateStatement(draftStatement, p.profession)
            };
          });
          return { players };
        });
      },

      sellAsset: (playerId: string, assetId: string, salePrice: number) => {
        set((state) => {
          const players = state.players.map(p => {
            if (p.id !== playerId) return p;
            
            const targetAsset = p.statement.assets.find(a => a.id === assetId);
            if (!targetAsset) return p;

            // When selling an asset, you receive the sale price MINUS the underlying mortgage.
            // Mortgage = Cost - DownPayment
            const mortgage = targetAsset.cost - targetAsset.downPayment;
            const netCashReceived = salePrice - mortgage;

            const newAssets = p.statement.assets.filter(a => a.id !== assetId);

            const draftStatement = {
              ...p.statement,
              cash: p.statement.cash + netCashReceived,
              assets: newAssets
            };

            return {
              ...p,
              statement: recalculateStatement(draftStatement, p.profession)
            };
          });
          return { players };
        });
      },

      declareBankruptcy: (playerId: string) => {
        set((state) => {
          const players = state.players.map(p => {
            if (p.id !== playerId) return p;

            // 1. Sell all assets for 1/2 of their down payment
            let cashGenerated = 0;
            p.statement.assets.forEach(asset => {
              cashGenerated += (asset.downPayment / 2);
            });

            let newCash = p.statement.cash + cashGenerated;
            let currentBankLoan = p.statement.liabilities.find(l => l.id === 'bank_loan');
            let remainingLiabilities = [...p.statement.liabilities];

            // 2. Pay off bank loans with available cash
            if (currentBankLoan && newCash >= 1000) {
              const affordablePayoff = Math.floor(newCash / 1000) * 1000;
              const actualPayoff = Math.min(affordablePayoff, currentBankLoan.amount);
              
              newCash -= actualPayoff;
              
              if (actualPayoff === currentBankLoan.amount) {
                remainingLiabilities = remainingLiabilities.filter(l => l.id !== 'bank_loan');
              } else {
                remainingLiabilities = remainingLiabilities.map(l => 
                  l.id === 'bank_loan' 
                    ? { ...l, amount: l.amount - actualPayoff, payment: l.payment - (actualPayoff * 0.1) }
                    : l
                );
              }
            }

            const draftStatement = {
              ...p.statement,
              cash: newCash,
              assets: [], // All assets sold
              liabilities: remainingLiabilities
            };

            return {
              ...p,
              isBankrupt: true,
              lostTurns: 3,
              statement: recalculateStatement(draftStatement, p.profession)
            };
          });
          return { players };
        });
      },

      haveChild: (playerId: string) => {
        set((state) => {
          const players = state.players.map(p => {
            if (p.id !== playerId) return p;
            if (p.statement.children >= 3) return p; // Max 3 children

            const draftStatement = {
              ...p.statement,
              children: p.statement.children + 1
            };

            return {
              ...p,
              statement: recalculateStatement(draftStatement, p.profession)
            };
          });
          return { players };
        });
      },

      payday: (playerId: string) => {
        set((state) => {
          const players = state.players.map(p => {
            if (p.id !== playerId) return p;
            return {
              ...p,
              statement: {
                ...p.statement,
                cash: p.statement.cash + p.statement.monthlyCashFlow
              }
            };
          });
          return { players };
        });
      },

      enterFastTrack: (playerId: string) => {
        set((state) => {
          const players = state.players.map(p => {
            if (p.id !== playerId) return p;
            
            // Fast track target = Day Job Passive Income + $50,000
            const startingPassive = p.statement.passiveIncome;
            const target = startingPassive + 50000;
            
            // Give them 100x their passive income in cash to start fast track
            const fastTrackStartingCash = startingPassive * 100;
            
            return {
              ...p,
              phase: 'FAST_TRACK',
              position: 0, // Reset board position for fast track board
              fastTrackCashflow: startingPassive,
              fastTrackTarget: target,
              statement: {
                ...p.statement,
                cash: p.statement.cash + fastTrackStartingCash,
                fastTrackStartingIncome: startingPassive
              }
            };
          });
          return { players };
        });
      },

      buyDream: (playerId: string) => {
        set((state) => {
          let winner = state.winner;
          const players = state.players.map(p => {
            if (p.id !== playerId) return p;
            if (p.statement.cash < 50000) return p; // Dreams usually cost 50k+
            
            winner = p.name; // First to buy their dream wins!
            
            return {
              ...p,
              hasBoughtDream: true,
              statement: {
                ...p.statement,
                cash: p.statement.cash - 50000
              }
            };
          });
          return { players, winner };
        });
      },

      buyFastTrackBusiness: (playerId: string, cashflowIncrease: number, cost: number) => {
        set((state) => {
          let winner = state.winner;
          const players = state.players.map(p => {
            if (p.id !== playerId) return p;
            if (p.statement.cash < cost) return p;
            
            const newCashflow = p.fastTrackCashflow + cashflowIncrease;
            if (newCashflow >= p.fastTrackTarget) {
              winner = p.name; // Alternate win condition
            }
            
            return {
              ...p,
              fastTrackCashflow: newCashflow,
              statement: {
                ...p.statement,
                cash: p.statement.cash - cost
              }
            };
          });
          return { players, winner };
        });
      },

      donateToCharity: (playerId: string) => {
        set((state) => {
          const players = state.players.map(p => {
            if (p.id !== playerId) return p;
            
            // Donate 10% of total income
            const donationAmount = p.statement.totalIncome * 0.10;
            
            const draftStatement = {
              ...p.statement,
              cash: p.statement.cash - donationAmount
            };

            return {
              ...p,
              charityTurnsRemaining: 3, // Gets 2 dice for next 3 turns
              statement: recalculateStatement(draftStatement, p.profession)
            };
          });
          return { players };
        });
      },

      goDownsized: (playerId: string) => {
        set((state) => {
          const players = state.players.map(p => {
            if (p.id !== playerId) return p;
            
            // Pay total expenses
            const penalty = p.statement.totalExpenses;
            
            const draftStatement = {
              ...p.statement,
              cash: p.statement.cash - penalty
            };

            return {
              ...p,
              lostTurns: 2, // Lose 2 turns
              statement: recalculateStatement(draftStatement, p.profession)
            };
          });
          return { players };
        });
      },

      resetGame: () => {
        set({
          players: [],
          currentPlayerIndex: 0,
          turnPhase: 'ROLL',
          diceRoll: [],
          activeCard: null,
          pendingPaydays: 0,
          winner: null,
        });
      }
    }),
    {
      name: 'cashflow-game-storage', // Auto-save persistence key
      storage: createJSONStorage(() => localStorage),
    }
  )
);
