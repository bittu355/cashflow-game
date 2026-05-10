import type { FinancialStatement, Profession } from '../types/game';

<<<<<<< HEAD
/**
 * Re-calculates all derived totals on a financial statement to ensure perfect math sync.
 * This should be called whenever an asset, liability, or child is added/removed.
 */
=======
>>>>>>> 6b18c4090941a97b1a58427d5a8a172d4e257aa5
export const recalculateStatement = (
  statement: FinancialStatement, 
  profession: Profession | null
): FinancialStatement => {
  if (!profession) return statement;

<<<<<<< HEAD
  // 1. Calculate Passive Income from Assets
  const passiveIncome = statement.assets.reduce((sum, asset) => {
    // Only add cashflow if it's real estate or business. Stocks use dividends.
=======
  const passiveIncome = statement.assets.reduce((sum, asset) => {
>>>>>>> 6b18c4090941a97b1a58427d5a8a172d4e257aa5
    if (asset.type === 'REAL_ESTATE' || asset.type === 'BUSINESS') {
      return sum + (asset.cashflow || 0);
    }
    if (asset.type === 'STOCK' && asset.shares && asset.dividend) {
      return sum + (asset.shares * asset.dividend);
    }
    return sum;
  }, 0);

  const totalIncome = statement.salary + passiveIncome;
  
<<<<<<< HEAD
  // 2. Calculate Expenses from Liabilities
=======
>>>>>>> 6b18c4090941a97b1a58427d5a8a172d4e257aa5
  const bankLoanPayment = statement.liabilities
    .filter(l => l.name === 'Bank Loan')
    .reduce((sum, l) => sum + l.payment, 0);
  
<<<<<<< HEAD
  // Dynamic liability payments based on what's left in the statement.liabilities
=======
>>>>>>> 6b18c4090941a97b1a58427d5a8a172d4e257aa5
  const mortgagePayment = statement.liabilities.find(l => l.id === 'mortgage')?.payment || 0;
  const schoolLoanPayment = statement.liabilities.find(l => l.id === 'school')?.payment || 0;
  const carLoanPayment = statement.liabilities.find(l => l.id === 'car')?.payment || 0;
  const creditCardPayment = statement.liabilities.find(l => l.id === 'credit')?.payment || 0;
  const retailPayment = statement.liabilities.find(l => l.id === 'retail')?.payment || 0;

  const childExpenses = statement.children * profession.perChildExpense;
  
<<<<<<< HEAD
  // Total Expenses = Taxes + Other + Child + All Liability Payments
  // Note: taxes and otherExpenses are now taken from the statement itself to allow for Macro Events
=======
>>>>>>> 6b18c4090941a97b1a58427d5a8a172d4e257aa5
  const totalExpenses = 
    statement.taxes + 
    statement.otherExpenses + 
    childExpenses + 
    mortgagePayment +
    schoolLoanPayment +
    carLoanPayment +
    creditCardPayment +
    retailPayment +
    bankLoanPayment;

<<<<<<< HEAD
  // 3. Calculate Cash Flow
=======
>>>>>>> 6b18c4090941a97b1a58427d5a8a172d4e257aa5
  const monthlyCashFlow = totalIncome - totalExpenses;

  return {
    ...statement,
    passiveIncome,
    totalIncome,
    childExpenses,
    bankLoanPayment,
    homeMortgagePayment: mortgagePayment,
    schoolLoanPayment,
    carLoanPayment,
    creditCardPayment,
    retailPayment,
    totalExpenses,
    monthlyCashFlow,
  };
};

<<<<<<< HEAD
/**
 * Calculates the Fast Track starting income.
 * Rule: Fast Track income is Rat Race Passive Income * 100, rounded to nearest thousand.
 */
export const calculateFastTrackIncome = (passiveIncome: number): number => {
  const multiplied = passiveIncome * 100;
  return Math.round(multiplied / 1000) * 1000;
=======
export const calculateFastTrackIncome = (passiveIncome: number): number => {
  return Math.round((passiveIncome * 100) / 1000) * 1000;
>>>>>>> 6b18c4090941a97b1a58427d5a8a172d4e257aa5
};
