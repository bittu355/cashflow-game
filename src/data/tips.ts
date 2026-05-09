export const WEALTH_TIPS = [
  "Rich people acquire assets. The poor and middle class acquire liabilities that they think are assets.",
  "Your boss's job is to give you a job, not to make you rich.",
  "Cash flow is the most important word in the world of money. The second most important word is leverage.",
  "Financial freedom is found when your passive income exceeds your expenses.",
  "The most important asset you have is your time. Don't trade it all for money.",
  "Taxes are the single biggest expense for most people. Learn how to legally minimize them through business and real estate.",
  "A 'Doodad' is anything that takes money out of your pocket without putting any back in.",
  "Real estate is the best investment for most people because of the tax advantages and the ability to use bank money (leverage).",
  "A stock split is usually a sign of a healthy, growing company, but it doesn't change the value of your underlying investment immediately.",
  "The Rat Race is a mental trap. Once you realize you are in it, you can begin to plan your escape."
];

export const getEventTip = (type: string) => {
  switch(type) {
    case 'DOODAD': return "Doodads are lifestyle expenses. The key is to buy assets first, then let the assets buy the doodads.";
    case 'MARKET': return "The market is where you turn your capital gains into cash flow.";
    case 'PAYDAY': return "Salary is your starting fuel. Passive income is your escape velocity.";
    default: return WEALTH_TIPS[Math.floor(Math.random() * WEALTH_TIPS.length)];
  }
};
