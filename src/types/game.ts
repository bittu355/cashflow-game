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
  id: string;
  name: string;
  amount: number;
  payment: number;
};

export type FinancialStatement = {
  salary: number;
  passiveIncome: number;
  totalIncome: number;
  taxes: number;
  homeMortgagePayment: number;
  schoolLoanPayment: number;
  carLoanPayment: number;
  creditCardPayment: number;
  retailPayment: number;
  otherExpenses: number;
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
