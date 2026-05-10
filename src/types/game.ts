<<<<<<< HEAD
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
=======
export type Profession = {
  name: string;
  salary: number;
  savings: number;
  taxes: number;
  mortgagePayment: number;
  schoolLoanPayment: number;
  carLoanPayment: number;
  creditCardPayment: number;
  retailPayment: number;
  otherExpenses: number;
  perChildExpense: number;
  liabilities: Liability[];
};

export type Asset = {
  id: string;
  name: string;
  type: 'STOCK' | 'REAL_ESTATE' | 'BUSINESS' | 'PRECIOUS_METALS' | 'OTHER';
  cost: number;
  downPayment?: number;
  shares?: number;
  dividend?: number;
  cashflow?: number;
  symbol?: string;
};

export type Liability = {
>>>>>>> 6b18c4090941a97b1a58427d5a8a172d4e257aa5
  id: string;
  name: string;
  amount: number;
  payment: number;
<<<<<<< HEAD
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
=======
};

export type FinancialStatement = {
  salary: number;
  passiveIncome: number;
  totalIncome: number;
>>>>>>> 6b18c4090941a97b1a58427d5a8a172d4e257aa5
  taxes: number;
  homeMortgagePayment: number;
  schoolLoanPayment: number;
  carLoanPayment: number;
  creditCardPayment: number;
  retailPayment: number;
  otherExpenses: number;
<<<<<<< HEAD
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
  
  // Fast track specific properties
  fastTrackCashflow: number; 
  fastTrackTarget: number;
  fastTrackBusinesses: { name: string, cashflow: number }[];
  hasBoughtDream: boolean;
  
  charityTurnsRemaining: number;
  isBot?: boolean;
}

export interface TransactionRecord {
  id: string;
  playerId: string;
  timestamp: number;
  type: 'BUY' | 'SELL' | 'PAYDAY' | 'LOAN' | 'SPLIT' | 'CHARITY' | 'CHILD' | 'BANKRUPTCY' | 'MARKET';
  description: string;
  amount: number;
  cashflowChange: number;
}

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  turnPhase: 'ROLL' | 'ACTION' | 'PAYDAY' | 'END';
  diceRoll: number[];
  activeCard: any | null; 
  pendingPaydays: number;
  winner: string | null;
  history: TransactionRecord[];
  isRolling: boolean;
  
  // Helpers
  addPlayer: (name: string, color: string, profession: Profession, dreamId?: string, isBot?: boolean, customId?: string) => void;
  setRolling: (rolling: boolean) => void;
  rollDice: (numDice: number) => void;
  collectPayday: () => void;
  drawCard: (type: 'SMALL_DEAL' | 'BIG_DEAL' | 'DOODAD' | 'MARKET') => void;
  resolveCard: () => void;
  endTurn: () => void;
  addHistory: (record: Omit<TransactionRecord, 'id' | 'timestamp'>) => void;
  
  // Financial Actions
  takeLoan: (playerId: string, amount: number) => void;
  payDebt: (playerId: string, liabilityId: string, amount?: number) => void;
  buyAsset: (playerId: string, asset: Asset, force?: boolean) => void;
  sellAsset: (playerId: string, assetId: string, salePrice: number) => void;
  haveChild: (playerId: string) => void;
  payday: (playerId: string) => void;
  declareBankruptcy: (playerId: string) => void;
  donateToCharity: (playerId: string) => void;
  goDownsized: (playerId: string) => void;
  resetGame: () => void;
  
  // Fast Track Actions
  enterFastTrack: (playerId: string) => void;
  buyDream: (playerId: string, cost?: number) => void;
  buyFastTrackBusiness: (playerId: string, name: string, cashflow: number, cost: number, roll?: number) => void;

  // Digital Classic Features & Multiplayer
  handleMarketEvent: (event: { type: 'STOCK_SPLIT' | 'REVERSE_SPLIT', symbol: string }) => void;
  transferDeal: (fromPlayerId: string, toPlayerId: string, card: any, fee: number, isPartnership?: boolean) => void;
  borrowMoney: (playerId: string, amount: number) => void;
  payLoan: (playerId: string, liabilityId: string) => void;
  resolveFastTrackPenalty: (playerId: string, type: 'TAX_AUDIT' | 'LAWSUIT' | 'DIVORCE') => void;
  handleMacroEconomicEvent: (event: 'BOOM' | 'RECESSION' | 'INFLATION') => void;
  
  turnCount: number;
  activeMacroEvent: { type: 'BOOM' | 'RECESSION' | 'INFLATION', turnsRemaining: number } | null;
  lastAIAction: { name: string, description: string } | null;
  setAIAction: (action: { name: string, description: string } | null) => void;
  
  // AI Logic
  runAITurn: () => void;
  
  // Local Player Identity (Multiplayer)
  myPlayerId: string | null;
  setMyPlayerId: (id: string | null) => void;
  
  // Canonical payCash utility
  payCash: (playerId: string, amount: number) => void;
}
=======
  bankLoanPayment: number;
  childExpenses: number;
  totalExpenses: number;
  monthlyCashFlow: number;
  savings: number;
  assets: Asset[];
  liabilities: Liability[];
  children: number;
};

export type Player = {
  id: string;
  name: string;
  profession: Profession | null;
  statement: FinancialStatement;
  position: number;
  isFastTrack: boolean;
  color: string;
};

export type GameState = {
  players: Player[];
  currentPlayerIndex: number;
  turnPhase: 'ROLL' | 'ACTION' | 'FINALIZE' | 'WAITING';
  diceRoll: number[];
  activeCard: any | null;
  pendingPaydays: number;
  winner: string | null;
  history: string[];
  turnCount: number;
  activeMacroEvent: any | null;
};
>>>>>>> 6b18c4090941a97b1a58427d5a8a172d4e257aa5
