import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { GameState, Player, Profession, Asset } from '../types/game';
import { recalculateStatement } from '../utils/finance';
import { SMALL_DEALS, BIG_DEALS, DOODADS, MARKET } from '../data/cards';
import { FAST_TRACK_SPACES, DREAMS } from '../data/fastTrack';
import { gameAudio } from '../utils/audio';

const initialPlayers: Player[] = [];

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      players: initialPlayers,
      currentPlayerIndex: 0,
      turnPhase: 'ROLL',
      diceRoll: [1],
      activeCard: null,
      pendingPaydays: 0,
      winner: null,
      history: [],
      isRolling: false,
      lastAIAction: null,
      turnCount: 0,
      activeMacroEvent: null,

      setRolling: (rolling) => set({ isRolling: rolling }),
      setAIAction: (action) => set({ lastAIAction: action }),

      addHistory: (record) => {
        set((state) => ({
          history: [
            { ...record, id: `hist-${Date.now()}-${Math.random()}`, timestamp: Date.now() },
            ...state.history.slice(0, 49) // Keep last 50 records
          ]
        }));
      },

      addPlayer: (name: string, color: string, profession: Profession, dreamId: string = 'yacht', isBot: boolean = false) => {
        const newPlayer: Player = {
          id: `player-${Date.now()}`,
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
          isBot,
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
        // Validation: Charity allows up to 2 dice, Fast Track allows up to 3, normal is 1
        const rolls = Array.from({ length: numDice }, () => Math.floor(Math.random() * 6) + 1);
        const totalRoll = rolls.reduce((sum, val) => sum + val, 0);

        set((state) => {
          const currentPlayer = state.players[state.currentPlayerIndex];
          if (!currentPlayer) return state;

          const oldPosition = currentPlayer.position;
          const isFastTrack = currentPlayer.phase === 'FAST_TRACK';
          const maxSpaces = isFastTrack ? 38 : 24;
          const newPosition = (oldPosition + totalRoll) % maxSpaces;
          
          let passedPaydays = 0;
          for (let i = 1; i <= totalRoll; i++) {
            const pos = (oldPosition + i) % maxSpaces;
            if (!isFastTrack) {
              if (pos === 0 || pos === 8 || pos === 16) {
                passedPaydays++;
              }
            } else {
              const space = FAST_TRACK_SPACES[pos];
              if (space && space.type === 'CASHFLOW_DAY') {
                passedPaydays++;
              }
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
          const payAmount = currentPlayer.phase === 'FAST_TRACK'
            ? ((currentPlayer.statement.fastTrackStartingIncome || 0) + currentPlayer.fastTrackCashflow) * state.pendingPaydays
            : currentPlayer.statement.monthlyCashFlow * state.pendingPaydays;
          
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
          
          gameAudio.playSFX('cash');
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
            pendingPaydays: 0,
            turnCount: state.turnCount + 1
          };
        });

        // Handle Macro Event turn countdown
        const activeEvent = get().activeMacroEvent;
        if (activeEvent) {
          const newTurns = activeEvent.turnsRemaining - 1;
          if (newTurns <= 0) {
            // Revert effects if needed (e.g., Inflation is permanent, but maybe Recession isn't?)
            // For simplicity, we'll just clear the indicator.
            set({ activeMacroEvent: null });
          } else {
            set({ activeMacroEvent: { ...activeEvent, turnsRemaining: newTurns } });
          }
        }

        // 3-Step Integrity Audit
        const finalPlayers = get().players.map(p => ({
          ...p,
          statement: recalculateStatement(p.statement, p.profession)
        }));
        
        set({ players: finalPlayers });

        // Trigger Macro Economic event every 10 turns
        const currentCount = get().turnCount;
        if (currentCount > 0 && currentCount % 10 === 0) {
          const events: ('BOOM' | 'RECESSION' | 'INFLATION')[] = ['BOOM', 'RECESSION', 'INFLATION'];
          const randomEvent = events[Math.floor(Math.random() * events.length)];
          gameAudio.playSFX('news');
          get().handleMacroEconomicEvent(randomEvent);
        }
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
          gameAudio.playSFX('cash');
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
          gameAudio.playSFX('cash');
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
          get().addHistory({ playerId, type: 'BUY', description: `Bought ${asset.name}`, amount: asset.downPayment, cashflowChange: asset.cashflow });
          gameAudio.playSFX('cash');
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
          gameAudio.playSFX('cash');
          return { players };
        });
      },

      declareBankruptcy: (playerId: string) => {
        set((state) => {
          const players = state.players.map(p => {
            if (p.id !== playerId) return p;

            // 1. Sell all assets for 1/2 of their down payment (High Fidelity Rule)
            let cashGenerated = 0;
            p.statement.assets.forEach(asset => {
              cashGenerated += (asset.downPayment / 2);
            });

            let newCash = p.statement.cash + cashGenerated;
            let remainingLiabilities = [...p.statement.liabilities];

            // 2. Clear all bank loans if possible
            const currentBankLoan = p.statement.liabilities.find(l => l.id === 'bank_loan');
            if (currentBankLoan && newCash >= 1000) {
              const affordablePayoff = Math.floor(newCash / 1000) * 1000;
              const actualPayoff = Math.min(affordablePayoff, currentBankLoan.amount);
              newCash -= actualPayoff;
              
              if (actualPayoff === currentBankLoan.amount) {
                remainingLiabilities = remainingLiabilities.filter(l => l.id !== 'bank_loan');
              } else {
                remainingLiabilities = remainingLiabilities.map(l => 
                  l.id === 'bank_loan' ? { ...l, amount: l.amount - actualPayoff, payment: l.payment - (actualPayoff * 0.1) } : l
                );
              }
            }

            const draftStatement = {
              ...p.statement,
              cash: newCash,
              assets: [], 
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
          gameAudio.playSFX('cash');
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
              phase: 'FAST_TRACK' as const,
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
            const dream = DREAMS.find(d => d.id === p.dreamId);
            const cost = dream ? dream.cost : 50000; 
            
            if (p.statement.cash < cost) return p;
            
            winner = p.name; // First to buy their dream wins!
            
            return {
              ...p,
              hasBoughtDream: true,
              statement: {
                ...p.statement,
                cash: p.statement.cash - cost
              }
            };
          });
          gameAudio.playSFX('win');
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
          gameAudio.playSFX('cash');
          return { players, winner };
        });
      },

      handleMarketEvent: (event: { type: 'STOCK_SPLIT' | 'REVERSE_SPLIT', symbol: string }) => {
        set((state) => {
          const players = state.players.map(p => {
            const updatedAssets = p.statement.assets.map(asset => {
              if (asset.type === 'STOCK' && (asset.name === event.symbol || asset.name.includes(event.symbol))) {
                const multiplier = event.type === 'STOCK_SPLIT' ? 2 : 0.5;
                const newShares = Math.floor((asset.shares || 0) * multiplier);
                const newCost = asset.cost / multiplier; 
                // total holding cashflow remains the same, but per-share dividend halves
                const newDividend = (asset.dividend || 0) / multiplier;
                
                return { 
                  ...asset, 
                  shares: newShares, 
                  cost: newCost,
                  downPayment: newCost, // For stocks, downPayment = cost
                  dividend: newDividend
                };
              }
              return asset;
            });

            return {
              ...p,
              statement: recalculateStatement({ ...p.statement, assets: updatedAssets }, p.profession)
            };
          });
          return { players };
        });
      },

      transferDeal: (fromId, toId, card, fee, isPartnership) => {
        set((state) => {
          const seller = state.players.find(p => p.id === fromId);
          const buyer = state.players.find(p => p.id === toId);
          
          if (!seller || !buyer) return state;
          
          const downPayment = card.downPayment || card.cost || 0;
          
          if (isPartnership) {
            // Partnership: Both split the down payment and the cashflow
            const halfDown = downPayment / 2;
            const halfCashflow = (card.cashflow || 0) / 2;

            if (seller.statement.cash < halfDown || buyer.statement.cash < halfDown) return state;

            const newAsset: Asset = {
              id: `asset-${Date.now()}`,
              name: `PARTNER: ${card.title}`,
              type: card.assetType || 'REAL_ESTATE',
              cost: (card.cost || 0) / 2,
              downPayment: halfDown,
              cashflow: halfCashflow
            };

            const players = state.players.map(p => {
              if (p.id === fromId || p.id === toId) {
                const draftStatement = {
                  ...p.statement,
                  cash: p.statement.cash - halfDown,
                  assets: [...p.statement.assets, newAsset]
                };
                return { ...p, statement: recalculateStatement(draftStatement, p.profession) };
              }
              return p;
            });

            get().addHistory({
              playerId: fromId,
              type: 'BUY',
              description: `Entered Partnership with ${buyer.name} for ${card.title}`,
              amount: halfDown,
              cashflowChange: halfCashflow
            });
            gameAudio.playSFX('cash');

            return { players, activeCard: null };
          } else {
            // Standard Sale
            const totalCostForBuyer = fee + downPayment;
            if (buyer.statement.cash < totalCostForBuyer) return state;

            const newAsset: Asset = {
              id: `asset-${Date.now()}`,
              name: card.assetType === 'STOCK' ? `${card.title.split(':')[1]?.trim() || card.title} (${card.shares || 10})` : card.title,
              type: card.assetType || 'BUSINESS',
              cost: card.cost || 0,
              downPayment: card.downPayment || card.cost || 0,
              cashflow: card.cashflow || 0,
              shares: card.assetType === 'STOCK' ? (card.shares || 10) : undefined,
              dividend: card.assetType === 'STOCK' ? card.cashflow : undefined
            };

            const players = state.players.map(p => {
              if (p.id === fromId) {
                return { ...p, statement: { ...p.statement, cash: p.statement.cash + fee } };
              }
              if (p.id === toId) {
                const draftStatement = {
                  ...p.statement,
                  cash: p.statement.cash - totalCostForBuyer,
                  assets: [...p.statement.assets, newAsset]
                };
                return { ...p, statement: recalculateStatement(draftStatement, p.profession) };
              }
              return p;
            });

            get().addHistory({
              playerId: toId,
              type: 'BUY',
              description: `Bought deal from ${seller.name} for $${fee} fee`,
              amount: totalCostForBuyer,
              cashflowChange: card.cashflow || 0
            });
            
            return { players, activeCard: null };
          }
        });
      },

      donateToCharity: (playerId: string) => {
        set((state) => {
          const players = state.players.map(p => {
            if (p.id !== playerId) return p;
            const charityCost = p.statement.totalIncome * 0.1;
            if (p.statement.cash < charityCost) return p;

            const draftStatement = {
              ...p.statement,
              cash: p.statement.cash - charityCost
            };

            get().addHistory({
              playerId,
              type: 'CHARITY',
              description: `Donated to charity ($${charityCost.toLocaleString()})`,
              amount: charityCost,
              cashflowChange: 0
            });

            return { 
              ...p, 
              charityTurnsRemaining: 3,
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
            const penalty = p.statement.totalExpenses;
            
            get().addHistory({
              playerId,
              type: 'BANKRUPTCY',
              description: `Downsized! Paid $${penalty.toLocaleString()} and lost 2 turns`,
              amount: penalty,
              cashflowChange: 0
            });

            return {
              ...p,
              lostTurns: 2,
              statement: {
                ...p.statement,
                cash: Math.max(0, p.statement.cash - penalty)
              }
            };
          });
          return { players };
        });
      },

      borrowMoney: (playerId: string, amount: number) => {
        set((state) => {
          const players = state.players.map(p => {
            if (p.id !== playerId) return p;
            
            const newLiability: Liability = {
              id: `loan-${Date.now()}-${Math.random()}`,
              name: 'Bank Loan',
              amount: amount,
              payment: amount * 0.1
            };

            const draftStatement = {
              ...p.statement,
              cash: p.statement.cash + amount,
              liabilities: [...p.statement.liabilities, newLiability]
            };

            return { ...p, statement: recalculateStatement(draftStatement, p.profession) };
          });

          get().addHistory({
            playerId,
            type: 'LOAN',
            description: `Borrowed $${amount.toLocaleString()} from bank`,
            amount: amount,
            cashflowChange: -(amount * 0.1)
          });

          return { players };
        });
      },

      payLoan: (playerId: string, liabilityId: string) => {
        set((state) => {
          const players = state.players.map(p => {
            if (p.id !== playerId) return p;
            const liability = p.statement.liabilities.find(l => l.id === liabilityId);
            if (!liability || p.statement.cash < liability.amount) return p;

            const draftStatement = {
              ...p.statement,
              cash: p.statement.cash - liability.amount,
              liabilities: p.statement.liabilities.filter(l => l.id !== liabilityId)
            };

            get().addHistory({
              playerId,
              type: 'SELL',
              description: `Paid off ${liability.name} ($${liability.amount.toLocaleString()})`,
              amount: liability.amount,
              cashflowChange: liability.payment
            });

            return { ...p, statement: recalculateStatement(draftStatement, p.profession) };
          });
          return { players };
        });
      },

      declareBankruptcy: (playerId: string) => {
        set((state) => {
          const players = state.players.map(p => {
            if (p.id !== playerId) return p;
            
            const totalSaleValue = p.statement.assets.reduce((sum, a) => sum + (a.downPayment * 0.5), 0);
            
            const draftStatement = {
              ...p.statement,
              cash: p.statement.cash + totalSaleValue,
              assets: [],
              liabilities: p.statement.liabilities.filter(l => l.name !== 'Bank Loan'),
              children: Math.min(p.statement.children, 1)
            };

            get().addHistory({
              playerId,
              type: 'BANKRUPTCY',
              description: 'DECLARED BANKRUPTCY: Assets liquidated at 50%',
              amount: totalSaleValue,
              cashflowChange: -p.statement.passiveIncome
            });

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

      buyFastTrackBusiness: (playerId, cashflow, cost) => {
        set((state) => {
          const players = state.players.map(p => {
            if (p.id !== playerId) return p;
            if (p.statement.cash < cost) return p;

            const newCashflow = p.fastTrackCashflow + cashflow;
            const won = newCashflow >= (p.fastTrackTarget || 0);

            get().addHistory({
              playerId,
              type: 'BUY',
              description: `Purchased Fast Track Business: +$${cashflow.toLocaleString()} cashflow`,
              amount: cost,
              cashflowChange: cashflow
            });

            return {
              ...p,
              fastTrackCashflow: newCashflow,
              winner: won ? p.id : undefined,
              statement: {
                ...p.statement,
                cash: p.statement.cash - cost
              }
            };
          });
          return { players };
        });
      },

      buyDream: (playerId) => {
        set((state) => {
          const players = state.players.map(p => {
            if (p.id !== playerId) return p;
            // Winning by landing on your dream and buying it is handled in component/store
            // For now, any dream purchase on Fast Track is a win condition if it's the player's target
            // But usually you just win immediately if you land on YOUR specific dream.
            // We'll simplify: Land on Dream + Buy = WIN.
            
            get().addHistory({
              playerId,
              type: 'BUY',
              description: "PURCHASED DREAM: YOU WIN THE GAME!",
              amount: 0,
              cashflowChange: 0
            });

            return {
              ...p,
              winner: p.id
            };
          });
          return { players, winner: playerId };
        });
      resolveFastTrackPenalty: (playerId, type) => {
        set((state) => {
          const players = state.players.map(p => {
            if (p.id !== playerId) return p;
            let penaltyAmount = 0;
            let description = "";

            if (type === 'TAX_AUDIT' || type === 'LAWSUIT') {
              penaltyAmount = Math.floor(p.statement.cash * 0.5);
              description = `Settled ${type === 'TAX_AUDIT' ? 'Tax Audit' : 'Lawsuit'} for $${penaltyAmount.toLocaleString()}`;
            } else if (type === 'DIVORCE') {
              penaltyAmount = p.statement.cash;
              description = `Divorce Settlement: Lost all cash ($${penaltyAmount.toLocaleString()})`;
            }

            get().addHistory({
              playerId,
              type: 'BANKRUPTCY',
              description,
              amount: penaltyAmount,
              cashflowChange: 0
            });

            return {
              ...p,
              statement: {
                ...p.statement,
                cash: p.statement.cash - penaltyAmount
              }
            };
          });
          return { players };
        });
      },

      handleMacroEconomicEvent: (event) => {
        set((state) => {
          const players = state.players.map(p => {
            let description = "";
            let draftStatement = { ...p.statement };

            if (event === 'BOOM') {
              description = "ECONOMIC BOOM: Real Estate values increased!";
              // In this engine, we'll represent this as a one-time cash bonus or just a log for now
              // as we don't have a dynamic 'Current Market Value' field on assets yet.
            } else if (event === 'RECESSION') {
              description = "RECESSION: Business cashflow dropped by 20%!";
              draftStatement.assets = p.statement.assets.map(a => 
                a.type === 'BUSINESS' ? { ...a, cashflow: Math.floor(a.cashflow * 0.8) } : a
              );
            } else if (event === 'INFLATION') {
              description = "INFLATION: Living expenses increased by 10%!";
              draftStatement.otherExpenses = Math.floor(p.statement.otherExpenses * 1.1);
            }

            get().addHistory({
              playerId: p.id,
              type: 'MARKET',
              description,
              amount: 0,
              cashflowChange: 0
            });

            return {
              ...p,
              statement: recalculateStatement(draftStatement, p.profession)
            };
          });
          return { players, activeMacroEvent: { type: event, turnsRemaining: 5 } };
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
          history: []
        });
      },

      runAITurn: () => {
        const { players, currentPlayerIndex } = get();
        const currentPlayer = players[currentPlayerIndex];
        if (!currentPlayer || !currentPlayer.isBot || currentPlayer.isBankrupt || currentPlayer.lostTurns > 0) {
          if (currentPlayer && (currentPlayer.isBankrupt || currentPlayer.lostTurns > 0)) {
             setTimeout(() => get().endTurn(), 1000);
          }
          return;
        }

        console.log(`AI ${currentPlayer.name} is thinking...`);

        // 1. Roll Dice
        setTimeout(() => {
          get().setRolling(true);
          const numDice = (currentPlayer.phase === 'RAT_RACE' && currentPlayer.charityTurnsRemaining > 0) ? 2 : 
                         (currentPlayer.phase === 'FAST_TRACK') ? 2 : 1;
          
          setTimeout(() => {
            get().rollDice(numDice);
            get().setRolling(false);
          }, 1000);

          // 2. Action Phase
          setTimeout(() => {
            const state = get();
            
            // Collect Payday if pending
            if (state.pendingPaydays > 0) {
              get().collectPayday();
            }

            // Fast Track Phase Logic
            if (currentPlayer.phase === 'FAST_TRACK') {
              const currentSpace = FAST_TRACK_SPACES[currentPlayer.position];
              
              if (currentSpace.type === 'BUSINESS' && currentSpace.business) {
                if (currentPlayer.statement.cash >= currentSpace.business.cost) {
                  get().setAIAction({ name: 'Fast Track Business', description: `AI bought ${currentSpace.business.name}` });
                  get().buyFastTrackBusiness(currentPlayer.id, currentSpace.business.cashflow, currentSpace.business.cost);
                } else {
                  get().setAIAction({ name: 'Passing', description: `AI couldn't afford ${currentSpace.business.name}` });
                }
              } else if (currentSpace.type === 'DREAM') {
                if (currentPlayer.statement.cash >= 100000) { // Assume AI buys any dream they land on if they have cash
                  get().setAIAction({ name: 'Winner!', description: `AI achieved a dream and wins!` });
                  get().buyDream(currentPlayer.id);
                }
              } else if (['TAX_AUDIT', 'LAWSUIT', 'DIVORCE'].includes(currentSpace.type)) {
                get().setAIAction({ name: 'Settlement', description: `AI resolved ${currentSpace.type}` });
                get().resolveFastTrackPenalty(currentPlayer.id, currentSpace.type as any);
              }
            } else if (state.activeCard) {
              // Rat Race Phase Logic
              const card = state.activeCard;
              let actionTaken = false;
              // ... existing rat race logic ...

              if (card.asset) {
                const asset = card.asset;
                const roi = (asset.cashflow * 12) / asset.downPayment;
                const canAfford = currentPlayer.statement.cash >= asset.downPayment;
                
                if (roi >= 0.15) {
                  if (canAfford) {
                    get().setAIAction({ name: 'Investment', description: `AI bought ${asset.name} (ROI: ${Math.round(roi * 100)}%)` });
                    get().buyAsset(currentPlayer.id, asset);
                    actionTaken = true;
                  } else if (roi >= 0.20 && (currentPlayer.statement.cash + 5000 >= asset.downPayment)) {
                    const needed = Math.ceil((asset.downPayment - currentPlayer.statement.cash) / 1000) * 1000;
                    get().borrowMoney(currentPlayer.id, needed);
                    get().setAIAction({ name: 'Leverage', description: `AI borrowed $${needed} to buy ${asset.name}` });
                    get().buyAsset(currentPlayer.id, asset);
                    actionTaken = true;
                  }
                }
              } else if (card.type === 'DOODAD') {
                get().setAIAction({ name: 'Spending', description: `AI paid for ${card.title}` });
                actionTaken = true;
                get().resolveCard();
              }

              if (!actionTaken) {
                get().setAIAction({ name: 'Passing', description: `AI declined the deal` });
                get().resolveCard();
              }
            }

            // 3. End Turn
            setTimeout(() => {
              get().setAIAction(null);
              get().endTurn();
            }, 2000);
          }, 1500);
        }, 1000);
      }
    }),
    {
      name: 'cashflow-game-storage', // Auto-save persistence key
      storage: createJSONStorage(() => localStorage),
    }
  )
);
