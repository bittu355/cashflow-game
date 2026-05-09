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

  // 2. Calculate Expenses from Liabilities + Fixed Expenses
  const liabilitiesPayment = statement.liabilities.reduce((sum, liability) => sum + liability.payment, 0);
  const childExpenses = statement.children * profession.perChildExpense;
  
  // Total Expenses = Taxes + Other Expenses + Child Expenses + Liability Payments
  const totalExpenses = 
    profession.taxes + 
    profession.otherExpenses + 
    childExpenses + 
    liabilitiesPayment;

  // 3. Calculate Cash Flow
  const monthlyCashFlow = totalIncome - totalExpenses;

  // If passive income strictly exceeds total expenses, they are ready for the Fast Track

  return {
    ...statement,
    passiveIncome,
    totalIncome,
    childExpenses,
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
