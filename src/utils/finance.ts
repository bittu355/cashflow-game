import type { FinancialStatement, Profession } from '../types/game';

export const recalculateStatement = (
  statement: FinancialStatement, 
  profession: Profession | null
): FinancialStatement => {
  if (!profession) return statement;

  const passiveIncome = statement.assets.reduce((sum, asset) => {
    if (asset.type === 'REAL_ESTATE' || asset.type === 'BUSINESS') {
      return sum + (asset.cashflow || 0);
    }
    if (asset.type === 'STOCK' && asset.shares && asset.dividend) {
      return sum + (asset.shares * asset.dividend);
    }
    return sum;
  }, 0);

  const totalIncome = statement.salary + passiveIncome;
  
  const bankLoanPayment = statement.liabilities
    .filter(l => l.name === 'Bank Loan')
    .reduce((sum, l) => sum + l.payment, 0);
  
  const mortgagePayment = statement.liabilities.find(l => l.id === 'mortgage')?.payment || 0;
  const schoolLoanPayment = statement.liabilities.find(l => l.id === 'school')?.payment || 0;
  const carLoanPayment = statement.liabilities.find(l => l.id === 'car')?.payment || 0;
  const creditCardPayment = statement.liabilities.find(l => l.id === 'credit')?.payment || 0;
  const retailPayment = statement.liabilities.find(l => l.id === 'retail')?.payment || 0;

  const childExpenses = statement.children * profession.perChildExpense;
  
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

export const calculateFastTrackIncome = (passiveIncome: number): number => {
  return Math.round((passiveIncome * 100) / 1000) * 1000;
};
