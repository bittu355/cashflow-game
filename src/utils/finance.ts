import type { FinancialStatement, Profession } from '../types/game';

/**
 * Re-calculates all derived totals on a financial statement to ensure perfect math sync.
 * This should be called whenever an asset, liability, or child is added/removed.
 */
export const recalculateStatement = (
  statement: FinancialStatement, 
  profession: Profession | null,
  phase: 'RAT_RACE' | 'FAST_TRACK' = 'RAT_RACE'
): FinancialStatement => {
  if (!profession) return statement;

  if (phase === 'FAST_TRACK') {
    return {
      ...statement,
      salary: 0,
      passiveIncome: 0,
      totalIncome: statement.fastTrackStartingIncome || 0,
      taxes: 0,
      homeMortgagePayment: 0,
      schoolLoanPayment: 0,
      carLoanPayment: 0,
      creditCardPayment: 0,
      retailPayment: 0,
      otherExpenses: 0,
      childExpenses: 0,
      bankLoanPayment: 0,
      totalExpenses: 0,
      monthlyCashFlow: statement.fastTrackStartingIncome || 0
    };
  }

  // 1. Calculate Passive Income from Assets
  const passiveIncome = Math.round(statement.assets.reduce((sum, asset) => {
    // Only add cashflow if it's real estate or business. Stocks use dividends.
    if (asset.type === 'REAL_ESTATE' || asset.type === 'BUSINESS') {
      return sum + (asset.cashflow || 0);
    }
    if (asset.type === 'STOCK' && asset.shares && asset.dividend) {
      return sum + (asset.shares * asset.dividend);
    }
    return sum;
  }, 0));

  const totalIncome = Math.round(statement.salary + passiveIncome);
  
  // 2. Calculate Expenses from Liabilities
  const bankLoanPayment = Math.round(statement.liabilities
    .filter(l => l.name === 'Bank Loan' || l.id === 'bank_loan')
    .reduce((sum, l) => sum + l.payment, 0));
  
  // Dynamic liability payments based on what's left in the statement.liabilities
  const mortgagePayment = Math.round(statement.liabilities.find(l => l.id === 'mortgage')?.payment || 0);
  const schoolLoanPayment = Math.round(statement.liabilities.find(l => l.id === 'school')?.payment || 0);
  const carLoanPayment = Math.round(statement.liabilities.find(l => l.id === 'car')?.payment || 0);
  const creditCardPayment = Math.round(statement.liabilities.find(l => l.id === 'credit')?.payment || 0);
  const retailPayment = Math.round(statement.liabilities.find(l => l.id === 'retail')?.payment || 0);

  const childExpenses = Math.round(statement.children * profession.perChildExpense);
  
  // Total Expenses = Taxes + Other + Child + All Liability Payments
  const totalExpenses = Math.round(
    statement.taxes + 
    statement.otherExpenses + 
    childExpenses + 
    mortgagePayment +
    schoolLoanPayment +
    carLoanPayment +
    creditCardPayment +
    retailPayment + 
    bankLoanPayment
  );

  // 3. Calculate Cash Flow
  const monthlyCashFlow = Math.round(totalIncome - totalExpenses);

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
