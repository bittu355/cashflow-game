import type { Asset } from '../types/game';

export type CardType = 'SMALL_DEAL' | 'BIG_DEAL' | 'DOODAD' | 'MARKET';

export interface GameCard {
  id: string;
  type: CardType;
  title: string;
  description: string;
  cost?: number;
  downPayment?: number;
  cashflow?: number;
  assetType?: Asset['type'];
  roi?: string;
  actionText: string;
  isGlobal?: boolean;
  marketEvent?: {
    type: 'STOCK_SPLIT' | 'REVERSE_SPLIT';
    symbol: string;
  };
}

export const SMALL_DEALS: GameCard[] = [
  // Stocks
  { id: 'sd_1', type: 'SMALL_DEAL', title: 'Stock: OK4U', description: 'Pharmaceutical company stock. Only you may buy as many shares as you want at this price.', cost: 10, downPayment: 10, cashflow: 0, assetType: 'STOCK', actionText: 'Buy Shares' },
  { id: 'sd_2', type: 'SMALL_DEAL', title: 'Stock: OK4U', description: 'Stock price drops on rumors of a lawsuit.', cost: 5, downPayment: 5, cashflow: 0, assetType: 'STOCK', actionText: 'Buy Shares' },
  { id: 'sd_3', type: 'SMALL_DEAL', title: 'Stock: MYT4U', description: 'High-tech electronics company. High volatility.', cost: 1, downPayment: 1, cashflow: 0, assetType: 'STOCK', actionText: 'Buy Shares' },
  { id: 'sd_4', type: 'SMALL_DEAL', title: 'Stock: MYT4U', description: 'Tech company doing well.', cost: 20, downPayment: 20, cashflow: 0, assetType: 'STOCK', actionText: 'Buy Shares' },
  { id: 'sd_5', type: 'SMALL_DEAL', title: 'Stock: 2U4U', description: 'Information company. Solid dividends.', cost: 10, downPayment: 10, cashflow: 20, assetType: 'STOCK', actionText: 'Buy Shares' },
  { id: 'sd_6', type: 'SMALL_DEAL', title: 'Mutual Fund: GRO4US', description: 'Diversified fund. Low risk.', cost: 20, downPayment: 20, cashflow: 0, assetType: 'STOCK', actionText: 'Buy Shares' },
  
  // Real Estate
  { id: 'sd_house_1', type: 'SMALL_DEAL', title: 'House for Sale - 3Br/2Ba', description: 'Fixer-upper in a decent neighborhood. Seller needs cash fast.', cost: 50000, downPayment: 3000, cashflow: 100, assetType: 'REAL_ESTATE', roi: '40%', actionText: 'Buy' },
  { id: 'sd_house_2', type: 'SMALL_DEAL', title: 'Condo for Sale - 2Br/1Ba', description: 'Ideal rental for young professionals.', cost: 40000, downPayment: 4000, cashflow: 140, assetType: 'REAL_ESTATE', roi: '42%', actionText: 'Buy' },
  { id: 'sd_house_3', type: 'SMALL_DEAL', title: 'House for Sale - 3Br/2Ba', description: 'Bank foreclosure. Great price!', cost: 45000, downPayment: 2000, cashflow: 200, assetType: 'REAL_ESTATE', roi: '120%', actionText: 'Buy' },
  { id: 'sd_house_4', type: 'SMALL_DEAL', title: 'House for Sale - 2Br/1Ba', description: 'Small house, high demand for rentals.', cost: 35000, downPayment: 2000, cashflow: 220, assetType: 'REAL_ESTATE', roi: '132%', actionText: 'Buy' },
  
  // Land & Coins
  { id: 'sd_land_1', type: 'SMALL_DEAL', title: '10-Acre Plot', description: 'Undeveloped land. Good long-term investment.', cost: 5000, downPayment: 5000, cashflow: 0, assetType: 'REAL_ESTATE', actionText: 'Buy Land' },
  { id: 'sd_coin_1', type: 'SMALL_DEAL', title: 'Rare Coin: 1oz Gold', description: 'Gold prices are historicaly low.', cost: 500, downPayment: 500, cashflow: 0, assetType: 'COIN', actionText: 'Buy Gold' },
  
  // Small Businesses
  { id: 'sd_biz_1', type: 'SMALL_DEAL', title: 'Part-Time Business', description: 'Start a small distribution business.', cost: 1000, downPayment: 1000, cashflow: 100, assetType: 'BUSINESS', roi: '120%', actionText: 'Start Business' },
  { id: 'sd_biz_2', type: 'SMALL_DEAL', title: 'Network Marketing', description: 'Build your own team. High growth potential.', cost: 500, downPayment: 500, cashflow: 200, assetType: 'BUSINESS', roi: '480%', actionText: 'Join' },
  { id: 'sd_biz_3', type: 'SMALL_DEAL', title: 'Vending Machine Route', description: '6 machines in local offices. Steady cash.', cost: 3000, downPayment: 3000, cashflow: 150, assetType: 'BUSINESS', roi: '60%', actionText: 'Buy Route' },
  { id: 'sd_biz_4', type: 'SMALL_DEAL', title: 'Start a Blog', description: 'Monetize your expertise. Requires time and $500 setup.', cost: 500, downPayment: 500, cashflow: 50, assetType: 'BUSINESS', roi: '120%', actionText: 'Start Blog' },
  { id: 'sd_stock_7', type: 'SMALL_DEAL', title: 'Stock: ZRRO', description: 'Emerging biotech company. High risk!', cost: 5, downPayment: 5, cashflow: 0, assetType: 'STOCK', actionText: 'Buy Shares' },
  { id: 'sd_stock_8', type: 'SMALL_DEAL', title: 'Stock: ZRRO', description: 'Biotech company hits a breakthrough.', cost: 40, downPayment: 40, cashflow: 0, assetType: 'STOCK', actionText: 'Buy Shares' },
  { id: 'sd_house_5', type: 'SMALL_DEAL', title: 'Mobile Home - 2Br/1Ba', description: 'Cheap entry into real estate. High yield.', cost: 20000, downPayment: 2000, cashflow: 150, assetType: 'REAL_ESTATE', roi: '90%', actionText: 'Buy' },
  { id: 'sd_house_6', type: 'SMALL_DEAL', title: 'Duplex - 2 units', description: 'Both sides rented. Solid cashflow.', cost: 60000, downPayment: 6000, cashflow: 200, assetType: 'REAL_ESTATE', roi: '40%', actionText: 'Buy' },
  { id: 'sd_item_1', type: 'SMALL_DEAL', title: 'Rare Stamp Collection', description: 'Hobbyist selling his collection. Potential for appreciation.', cost: 1000, downPayment: 1000, cashflow: 0, assetType: 'COIN', actionText: 'Buy Stamps' }
];

export const BIG_DEALS: GameCard[] = [
  // Multi-Family
  { id: 'bd_1', type: 'BIG_DEAL', title: 'Apartment House - 8 Units', description: 'Fully occupied. Stable income.', cost: 160000, downPayment: 32000, cashflow: 1200, assetType: 'REAL_ESTATE', roi: '45%', actionText: 'Buy' },
  { id: 'bd_2', type: 'BIG_DEAL', title: 'Apartment House - 12 Units', description: 'Great location near downtown.', cost: 240000, downPayment: 48000, cashflow: 1800, assetType: 'REAL_ESTATE', roi: '45%', actionText: 'Buy' },
  { id: 'bd_3', type: 'BIG_DEAL', title: 'Apartment House - 24 Units', description: 'Large complex, needs professional management.', cost: 480000, downPayment: 80000, cashflow: 3000, assetType: 'REAL_ESTATE', roi: '45%', actionText: 'Buy' },
  { id: 'bd_3b', type: 'BIG_DEAL', title: 'Apartment Complex - 60 Units', description: 'Massive residential investment.', cost: 1200000, downPayment: 200000, cashflow: 7500, assetType: 'REAL_ESTATE', roi: '45%', actionText: 'Buy' },
  
  // Commercial
  { id: 'bd_4', type: 'BIG_DEAL', title: 'Shopping Mall', description: 'Anchor tenants secured. Excellent cashflow.', cost: 1200000, downPayment: 200000, cashflow: 8000, assetType: 'REAL_ESTATE', roi: '48%', actionText: 'Buy Mall' },
  { id: 'bd_4b', type: 'BIG_DEAL', title: 'Professional Building', description: 'Doctors and lawyers as tenants.', cost: 600000, downPayment: 100000, cashflow: 4000, assetType: 'REAL_ESTATE', roi: '48%', actionText: 'Buy Building' },
  { id: 'bd_5', type: 'BIG_DEAL', title: 'Mini-Storage Facility', description: 'High demand, low overhead.', cost: 300000, downPayment: 60000, cashflow: 2500, assetType: 'BUSINESS', roi: '50%', actionText: 'Buy Facility' },
  { id: 'bd_5b', type: 'BIG_DEAL', title: 'Industrial Warehouse', description: 'Logistics company leasing for 10 years.', cost: 800000, downPayment: 150000, cashflow: 6000, assetType: 'BUSINESS', roi: '48%', actionText: 'Buy Warehouse' },
  
  // Businesses
  { id: 'bd_6', type: 'BIG_DEAL', title: 'Automated Car Wash', description: 'Passive income machine.', cost: 250000, downPayment: 50000, cashflow: 2000, assetType: 'BUSINESS', roi: '48%', actionText: 'Buy Car Wash' },
  { id: 'bd_7', type: 'BIG_DEAL', title: 'Pizza Franchise', description: 'Established brand, busy location.', cost: 150000, downPayment: 30000, cashflow: 1200, assetType: 'BUSINESS', roi: '48%', actionText: 'Buy Franchise' },
  { id: 'bd_8', type: 'BIG_DEAL', title: 'Software Company', description: 'Tech startup with positive earnings.', cost: 500000, downPayment: 100000, cashflow: 4500, assetType: 'BUSINESS', roi: '54%', actionText: 'Buy Company' },
  { id: 'bd_9', type: 'BIG_DEAL', title: 'Bed & Breakfast', description: 'Historic home converted for tourists.', cost: 400000, downPayment: 80000, cashflow: 3500, assetType: 'BUSINESS', roi: '52%', actionText: 'Buy B&B' }
];

export const DOODADS: GameCard[] = [
  { id: 'd_1', type: 'DOODAD', title: 'Buy a New Phone', description: 'Latest model with 3 cameras. Pay $1000.', cost: 1000, actionText: 'Pay' },
  { id: 'd_2', type: 'DOODAD', title: 'Dinner Out', description: 'Fancy restaurant with friends. Pay $120.', cost: 120, actionText: 'Pay' },
  { id: 'd_3', type: 'DOODAD', title: 'New Shoes', description: 'Could not resist the sale. Pay $150.', cost: 150, actionText: 'Pay' },
  { id: 'd_4', type: 'DOODAD', title: 'Gym Membership', description: 'Time to get in shape. Pay $300 for a year.', cost: 300, actionText: 'Pay' },
  { id: 'd_5', type: 'DOODAD', title: 'Buy a Boat', description: 'Fun for the whole family. Pay $5000 down or take a loan.', cost: 5000, actionText: 'Pay' },
  { id: 'd_6', type: 'DOODAD', title: 'New Tires', description: 'Safety first. Pay $400.', cost: 400, actionText: 'Pay' },
  { id: 'd_7', type: 'DOODAD', title: 'Dental Work', description: 'Root canal needed. Pay $600.', cost: 600, actionText: 'Pay' },
  { id: 'd_8', type: 'DOODAD', title: 'Family Vacation', description: 'A week at the beach. Pay $2500.', cost: 2500, actionText: 'Pay' },
  { id: 'd_9', type: 'DOODAD', title: 'New Golf Clubs', description: 'Upgrade your swing. Pay $800.', cost: 800, actionText: 'Pay' },
  { id: 'd_10', type: 'DOODAD', title: 'Charity Gala', description: 'Support a good cause. Pay $500.', cost: 500, actionText: 'Pay' },
  { id: 'd_11', type: 'DOODAD', title: 'Luxury Watch', description: 'A reward for your hard work. Pay $2000.', cost: 2000, actionText: 'Pay' },
  { id: 'd_12', type: 'DOODAD', title: 'European Cruise', description: '14 days of luxury. Pay $6000.', cost: 6000, actionText: 'Pay' }
];

export const MARKET: GameCard[] = [
  { id: 'm_1', type: 'MARKET', title: 'Buyer for 3Br/2Ba', description: 'Buyer wants to live in this neighborhood. Sell your 3Br/2Ba house for $135,000.', cost: 135000, assetType: 'REAL_ESTATE', actionText: 'Sell Asset' },
  { id: 'm_2', type: 'MARKET', title: 'Condo Buyer', description: 'Retirees looking for condos. Sell any 2Br/1Ba condo for $65,000.', cost: 65000, assetType: 'REAL_ESTATE', actionText: 'Sell Asset' },
  { id: 'm_3', type: 'MARKET', title: 'Apartment House Buyer', description: 'Investor group buying multi-family. Sell any Apartment House for $35,000 per unit.', cost: 35000, assetType: 'REAL_ESTATE', actionText: 'Sell Asset' },
  { id: 'm_4', type: 'MARKET', title: 'Stock Buyout: OK4U', description: 'Company acquired by competitor. Everyone must sell OK4U shares for $50.', cost: 50, assetType: 'STOCK', actionText: 'Execute Sale', isGlobal: true },
  { id: 'm_5', type: 'MARKET', title: 'Stock Split: MYT4U', description: 'MYT4U splits 2-for-1. Everyone doubles their shares.', cost: 0, actionText: 'Execute Split', isGlobal: true, marketEvent: { type: 'STOCK_SPLIT', symbol: 'MYT4U' } },
  { id: 'm_6', type: 'MARKET', title: 'Reverse Split: OK4U', description: 'OK4U struggles. 1-for-10 reverse split.', cost: 0, actionText: 'Execute Split', isGlobal: true, marketEvent: { type: 'REVERSE_SPLIT', symbol: 'OK4U' } },
  { id: 'm_7', type: 'MARKET', title: 'Inflation', description: 'Cost of living increases. Other expenses go up by 10% for everyone.', cost: 0, actionText: 'Apply Inflation', isGlobal: true },
  { id: 'm_8', type: 'MARKET', title: 'Recession', description: 'Business income drops. All business cashflow reduced by 20%.', cost: 0, actionText: 'Apply Recession', isGlobal: true },
  { id: 'm_9', type: 'MARKET', title: 'Gold Prices Soar', description: 'Economic uncertainty drives gold up. Sell 1oz Gold for $800.', cost: 800, assetType: 'COIN', actionText: 'Sell Asset' },
  { id: 'm_10', type: 'MARKET', title: 'Land Developer', description: 'Shopping mall planned nearby. Sell 10-Acre Plot for $50,000.', cost: 50000, assetType: 'REAL_ESTATE', actionText: 'Sell Land' },
  { id: 'm_11', type: 'MARKET', title: 'Tech IPO: ZRRO', description: 'ZRRO goes public! Everyone must sell ZRRO shares for $60.', cost: 60, assetType: 'STOCK', actionText: 'Execute Sale', isGlobal: true },
  { id: 'm_12', type: 'MARKET', title: 'Real Estate Boom', description: 'Market is hot. Sell any Real Estate asset for 2x its original cost.', cost: 2, assetType: 'REAL_ESTATE', actionText: 'Sell Asset' }
];

export const ALL_CARDS = { SMALL_DEALS, BIG_DEALS, DOODADS, MARKET };
