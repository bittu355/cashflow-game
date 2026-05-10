import type { FinancialStatement, Profession } from '../types/game';

/**
 * Re-calculates all derived totals on a financial statement to ensure perfect math sync.
 * This should be called whenever an asset, liability, or child is added/removed.
 */
export const recalculateStatement = (
  statement: FinancialStatement, 
  profession: Profession | null
): FinancialStatement => {
  if (!profession) return statement;

  // 1. Calculate Passive Income from Assets
  const passiveIncome = statement.assets.reduce((sum, asset) => {
    // Only add cashflow if it's real estate or business. Stocks use dividends.
    if (asset.type === 'REAL_ESTATE' || asset.type === 'BUSINESS') {
      return sum + (asset.cashflow || 0);
    }
    if (asset.type === 'STOCK' && asset.shares && asset.dividend) {
      return sum + (asset.shares * asset.dividend);
    }
    return sum;
  }, 0);

  const totalIncome = statement.salary + passiveIncome;
  
  // 2. Calculate Expenses from Liabilities
  const bankLoanPayment = statement.liabilities
    .filter(l => l.name === 'Bank Loan' || l.id === 'bank_loan')
    .reduce((sum, l) => sum + l.payment, 0);
  
  // Dynamic liability payments based on what's left in the statement.liabilities
  const mortgagePayment = statement.liabilities.find(l => l.id === 'mortgage')?.payment || 0;
  const schoolLoanPayment = statement.liabilities.find(l => l.id === 'school')?.payment || 0;
  const carLoanPayment = statement.liabilities.find(l => l.id === 'car')?.payment || 0;
  const creditCardPayment = statement.liabilities.find(l => l.id === 'credit')?.payment || 0;
  const retailPayment = statement.liabilities.find(l => l.id === 'retail')?.payment || 0;

  const childExpenses = statement.children * profession.perChildExpense;
  
  // Total Expenses = Taxes + Other + Child + All Liability Payments
  // Note: taxes and otherExpenses are now taken from the statement itself to allow for Macro Events
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

  // 3. Calculate Cash Flow
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

/**
 * Calculates the Fast Track starting income.
 * Rule: Fast Track income is Rat Race Passive Income * 100, rounded to nearest thousand.
 */
export const calculateFastTrackIncome = (passiveIncome: number): number => {
  const multiplied = passiveIncome * 100;
  return Math.round(multiplied / 1000) * 1000;
};
