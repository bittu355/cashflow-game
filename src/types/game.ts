export type GamePhase = 'RAT_RACE' | 'FAST_TRACK';

export interface Asset {
  id: string;
  name: string;
  type: 'REAL_ESTATE' | 'STOCK' | 'BUSINESS' | 'COIN';
  cost: number;
  downPayment: number;
  cashflow: number;
  shares?: number; // For stocks
  dividend?: number; // For stocks
}

export interface Liability {
  id: string;
  name: string;
  amount: number;
  payment: number;
}

export interface Profession {
  name: string;
  salary: number;
  taxes: number;
  mortgage: number;
  mortgagePayment: number;
  schoolLoan: number;
  schoolLoanPayment: number;
  carLoan: number;
  carLoanPayment: number;
  creditCard: number;
  creditCardPayment: number;
  retailDebt: number;
  retailDebtPayment: number;
  otherExpenses: number;
  perChildExpense: number;
  savings: number;
}

export interface FinancialStatement {
  // Income
  salary: number;
  passiveIncome: number;
  totalIncome: number;

  // Expenses
  taxes: number;
  homeMortgagePayment: number;
  schoolLoanPayment: number;
  carLoanPayment: number;
  creditCardPayment: number;
  retailPayment: number;
  otherExpenses: number;
  childExpenses: number;
  bankLoanPayment: number;
  totalExpenses: number;

  // Monthly Cash Flow (Payday)
  monthlyCashFlow: number;

  // Balance Sheet
  cash: number;
  children: number; // Max 3

  assets: Asset[];
  liabilities: Liability[];

  // Fast Track
  fastTrackStartingIncome?: number;
}

export interface Player {
  id: string;
  name: string;
  color: string;
  profession: Profession | null;
  dreamId: string | null; // The chosen dream to win the game
  statement: FinancialStatement;
  phase: GamePhase;
  position: number; // Index on the board track
  isBankrupt: boolean;
  lostTurns: number;
}

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  turnPhase: 'ROLL' | 'ACTION' | 'PAYDAY' | 'END';
  diceRoll: number[];
  activeCard: any | null; // Placeholder
  pendingPaydays: number;
  
  // Helpers
  addPlayer: (name: string, color: string, profession: Profession) => void;
  rollDice: (numDice: number) => void;
  collectPayday: () => void;
  drawCard: (type: 'OPPORTUNITY' | 'DOODAD' | 'MARKET') => void;
  resolveCard: () => void;
  endTurn: () => void;
  
  // Financial Actions
  takeLoan: (playerId: string, amount: number) => void;
  payDebt: (playerId: string, liabilityId: string, amount?: number) => void;
  buyAsset: (playerId: string, asset: Asset) => void;
  sellAsset: (playerId: string, assetId: string, salePrice: number) => void;
  haveChild: (playerId: string) => void;
  payday: (playerId: string) => void;
  declareBankruptcy: (playerId: string) => void;
}
