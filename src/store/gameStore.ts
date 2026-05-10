import { create } from 'zustand';
import type { GameState, Player, FinancialStatement } from '../types/game';
import { recalculateStatement } from '../utils/finance';

interface GameActions {
  addPlayer: (name: string, color: string) => void;
  rollDice: (count?: number) => void;
  movePlayer: (spaces: number) => void;
  nextTurn: () => void;
  takeLoan: (amount: number) => void;
  payLoan: (id: string) => void;
  buyAsset: (asset: any) => void;
  sellAsset: (assetId: string) => void;
  addHistory: (msg: string) => void;
}

export const useGameStore = create<GameState & GameActions>((set) => ({
  players: [],
  currentPlayerIndex: 0,
  turnPhase: 'ROLL',
  diceRoll: [1],
  activeCard: null,
  pendingPaydays: 0,
  winner: null,
  history: [],
  turnCount: 0,
  activeMacroEvent: null,

  addPlayer: (name, color) => set((state) => ({
    players: [...state.players, {
      id: Math.random().toString(36).substring(7),
      name,
      color,
      position: 0,
      isFastTrack: false,
      profession: null,
      statement: {
        salary: 0,
        passiveIncome: 0,
        totalIncome: 0,
        taxes: 0,
        homeMortgagePayment: 0,
        schoolLoanPayment: 0,
        carLoanPayment: 0,
        creditCardPayment: 0,
        retailPayment: 0,
        otherExpenses: 0,
        bankLoanPayment: 0,
        childExpenses: 0,
        totalExpenses: 0,
        monthlyCashFlow: 0,
        savings: 0,
        assets: [],
        liabilities: [],
        children: 0,
      }
    }]
  })),

  rollDice: (count = 1) => set(() => {
    const rolls = Array.from({ length: count }, () => Math.floor(Math.random() * 6) + 1);
    return { diceRoll: rolls, turnPhase: 'ACTION' };
  }),

  movePlayer: (spaces) => set((state) => {
    const players = [...state.players];
    const player = players[state.currentPlayerIndex];
    player.position = (player.position + spaces) % 24;
    return { players };
  }),

  nextTurn: () => set((state) => ({
    currentPlayerIndex: (state.currentPlayerIndex + 1) % state.players.length,
    turnPhase: 'ROLL',
    activeCard: null,
    turnCount: state.turnCount + 1
  })),

  takeLoan: (amount) => set((state) => {
    const players = [...state.players];
    const player = players[state.currentPlayerIndex];
    player.statement.savings += amount;
    player.statement.liabilities.push({
      id: `loan-${Date.now()}`,
      name: 'Bank Loan',
      amount,
      payment: Math.floor(amount * 0.1)
    });
    player.statement = recalculateStatement(player.statement, player.profession);
    return { players };
  }),

  payLoan: (id) => set((state) => {
    const players = [...state.players];
    const player = players[state.currentPlayerIndex];
    const liability = player.statement.liabilities.find(l => l.id === id);
    if (liability && player.statement.savings >= liability.amount) {
      player.statement.savings -= liability.amount;
      player.statement.liabilities = player.statement.liabilities.filter(l => l.id !== id);
      player.statement = recalculateStatement(player.statement, player.profession);
    }
    return { players };
  }),

  buyAsset: (asset) => set((state) => {
    const players = [...state.players];
    const player = players[state.currentPlayerIndex];
    if (player.statement.savings >= (asset.downPayment || asset.cost)) {
      player.statement.savings -= (asset.downPayment || asset.cost);
      player.statement.assets.push(asset);
      if (asset.liability) {
        player.statement.liabilities.push(asset.liability);
      }
      player.statement = recalculateStatement(player.statement, player.profession);
    }
    return { players };
  }),

  sellAsset: (assetId) => set((state) => {
    const players = [...state.players];
    const player = players[state.currentPlayerIndex];
    const asset = player.statement.assets.find(a => a.id === assetId);
    if (asset) {
      player.statement.savings += (asset.salePrice || asset.cost);
      player.statement.assets = player.statement.assets.filter(a => a.id !== assetId);
      player.statement = recalculateStatement(player.statement, player.profession);
    }
    return { players };
  }),

  addHistory: (msg) => set((state) => ({
    history: [msg, ...state.history].slice(0, 50)
  }))
}));
