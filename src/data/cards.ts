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
}

export const SMALL_DEALS: GameCard[] = [
  { id: 'sd_1', type: 'SMALL_DEAL', title: 'House for Sale - 3Br/2Ba', description: 'Bank foreclosed property. Needs some work but good rental potential.', cost: 50000, downPayment: 5000, cashflow: 160, assetType: 'REAL_ESTATE', roi: '38%', actionText: 'Buy' },
  { id: 'sd_2', type: 'SMALL_DEAL', title: 'Stock: OK4U', description: 'A stable company. Only you may buy at this price.', cost: 10, downPayment: 10, cashflow: 0, assetType: 'STOCK', actionText: 'Buy Shares' },
  { id: 'sd_3', type: 'SMALL_DEAL', title: 'Condo for Sale - 2Br/1Ba', description: 'Parents selling to help kids. Good neighborhood.', cost: 45000, downPayment: 4000, cashflow: 140, assetType: 'REAL_ESTATE', roi: '42%', actionText: 'Buy' },
  { id: 'sd_4', type: 'SMALL_DEAL', title: 'Stock: MYT4U', description: 'Tech startup stock splits 2-for-1 today.', cost: 5, downPayment: 5, cashflow: 0, assetType: 'STOCK', actionText: 'Buy Shares' },
  { id: 'sd_5', type: 'SMALL_DEAL', title: 'Mutual Fund: GRO4US', description: 'Steady growth mutual fund.', cost: 10, downPayment: 10, cashflow: 0, assetType: 'STOCK', actionText: 'Buy Shares' },
  { id: 'sd_6', type: 'SMALL_DEAL', title: 'House for Sale - 3Br/2Ba', description: 'Seller motivated, transferring out of town.', cost: 65000, downPayment: 3000, cashflow: -100, assetType: 'REAL_ESTATE', roi: '-40%', actionText: 'Buy (Capital Gains Only)' },
  { id: 'sd_7', type: 'SMALL_DEAL', title: 'Coin: 1oz Gold', description: 'Gold prices are low. Good hedge against inflation.', cost: 300, downPayment: 300, cashflow: 0, assetType: 'COIN', actionText: 'Buy Gold' },
  { id: 'sd_8', type: 'SMALL_DEAL', title: 'Stock: ON2U', description: 'Entertainment company stock.', cost: 30, downPayment: 30, cashflow: 0, assetType: 'STOCK', actionText: 'Buy Shares' },
  { id: 'sd_9', type: 'SMALL_DEAL', title: 'Start a Part-Time Business', description: 'Software company needs your help part-time.', cost: 3000, downPayment: 3000, cashflow: 150, assetType: 'BUSINESS', roi: '60%', actionText: 'Start Business' },
  { id: 'sd_10', type: 'SMALL_DEAL', title: 'House for Sale - 2Br/1Ba', description: 'Estate sale. Older house.', cost: 35000, downPayment: 2000, cashflow: 220, assetType: 'REAL_ESTATE', roi: '132%', actionText: 'Buy' },
  { id: 'sd_11', type: 'SMALL_DEAL', title: 'Stock: OK4U', description: 'Stock drops on bad news.', cost: 5, downPayment: 5, cashflow: 0, assetType: 'STOCK', actionText: 'Buy Shares' },
  { id: 'sd_12', type: 'SMALL_DEAL', title: 'Stock: MYT4U', description: 'Market rumors cause a spike.', cost: 40, downPayment: 40, cashflow: 0, assetType: 'STOCK', actionText: 'Buy Shares' },
  { id: 'sd_13', type: 'SMALL_DEAL', title: 'Condo for Sale - 2Br/2Ba', description: 'Divorce sale. Below market value.', cost: 55000, downPayment: 5000, cashflow: 160, assetType: 'REAL_ESTATE', roi: '38%', actionText: 'Buy' },
  { id: 'sd_14', type: 'SMALL_DEAL', title: 'Network Marketing', description: 'Start your own distribution network.', cost: 500, downPayment: 500, cashflow: 100, assetType: 'BUSINESS', roi: '240%', actionText: 'Start Business' },
  { id: 'sd_15', type: 'SMALL_DEAL', title: 'Rare Coin: Silver 1oz', description: 'Silver is undervalued.', cost: 10, downPayment: 10, cashflow: 0, assetType: 'COIN', actionText: 'Buy Silver' }
];

export const BIG_DEALS: GameCard[] = [
  { id: 'bd_1', type: 'BIG_DEAL', title: 'Apartment House - 8 Units', description: 'Excellent location, fully rented.', cost: 240000, downPayment: 40000, cashflow: 1700, assetType: 'REAL_ESTATE', roi: '51%', actionText: 'Buy' },
  { id: 'bd_2', type: 'BIG_DEAL', title: 'Car Wash for Sale', description: 'Owner retiring. Established clientele.', cost: 300000, downPayment: 50000, cashflow: 2500, assetType: 'BUSINESS', roi: '60%', actionText: 'Buy Business' },
  { id: 'bd_3', type: 'BIG_DEAL', title: 'Apartment House - 4 Units', description: 'Needs minor repairs, good tenants.', cost: 120000, downPayment: 20000, cashflow: 800, assetType: 'REAL_ESTATE', roi: '48%', actionText: 'Buy' },
  { id: 'bd_4', type: 'BIG_DEAL', title: 'Franchise Opportunity', description: 'Fast food franchise in a busy mall.', cost: 500000, downPayment: 100000, cashflow: 3500, assetType: 'BUSINESS', roi: '42%', actionText: 'Buy Franchise' },
  { id: 'bd_5', type: 'BIG_DEAL', title: 'Apartment House - 12 Units', description: 'Distressed property, but great potential.', cost: 300000, downPayment: 30000, cashflow: 1200, assetType: 'REAL_ESTATE', roi: '48%', actionText: 'Buy' },
  { id: 'bd_6', type: 'BIG_DEAL', title: 'Laundromat', description: 'Coin-operated laundry in high-density area.', cost: 150000, downPayment: 30000, cashflow: 1500, assetType: 'BUSINESS', roi: '60%', actionText: 'Buy Laundromat' },
  { id: 'bd_7', type: 'BIG_DEAL', title: 'Apartment House - 24 Units', description: 'Out of state owner selling cheap.', cost: 550000, downPayment: 50000, cashflow: 2800, assetType: 'REAL_ESTATE', roi: '67%', actionText: 'Buy' },
  { id: 'bd_8', type: 'BIG_DEAL', title: 'Mini-Storage', description: '100 unit storage facility.', cost: 400000, downPayment: 80000, cashflow: 3000, assetType: 'BUSINESS', roi: '45%', actionText: 'Buy Facility' },
  { id: 'bd_9', type: 'BIG_DEAL', title: 'Apartment House - 6 Units', description: 'Great condition, near university.', cost: 180000, downPayment: 30000, cashflow: 1100, assetType: 'REAL_ESTATE', roi: '44%', actionText: 'Buy' },
  { id: 'bd_10', type: 'BIG_DEAL', title: 'Software Company', description: 'Profitable SaaS business for sale.', cost: 1000000, downPayment: 200000, cashflow: 10000, assetType: 'BUSINESS', roi: '60%', actionText: 'Buy Business' }
];

export const DOODADS: GameCard[] = [
  { id: 'd_1', type: 'DOODAD', title: 'Buy a New Boat', description: 'You couldn\'t resist the boat show. Pay $1000 now.', cost: 1000, actionText: 'Pay $1000' },
  { id: 'd_2', type: 'DOODAD', title: 'New Tires', description: 'Your car failed inspection. Pay $400.', cost: 400, actionText: 'Pay $400' },
  { id: 'd_3', type: 'DOODAD', title: 'Family Vacation', description: 'Time for a break! Pay $2000 for a trip.', cost: 2000, actionText: 'Pay $2000' },
  { id: 'd_4', type: 'DOODAD', title: 'Buy a Big Screen TV', description: 'Must watch the game in style. Pay $800.', cost: 800, actionText: 'Pay $800' },
  { id: 'd_5', type: 'DOODAD', title: 'Dental Work', description: 'Root canal needed. Pay $600.', cost: 600, actionText: 'Pay $600' },
  { id: 'd_6', type: 'DOODAD', title: 'New Golf Clubs', description: 'Upgrade your swing. Pay $500.', cost: 500, actionText: 'Pay $500' },
  { id: 'd_7', type: 'DOODAD', title: 'Car Repairs', description: 'Transmission issues. Pay $1200.', cost: 1200, actionText: 'Pay $1200' },
  { id: 'd_8', type: 'DOODAD', title: 'Buy Art', description: 'Found a beautiful painting. Pay $1500.', cost: 1500, actionText: 'Pay $1500' },
  { id: 'd_9', type: 'DOODAD', title: 'Designer Shoes', description: 'You deserve it. Pay $300.', cost: 300, actionText: 'Pay $300' },
  { id: 'd_10', type: 'DOODAD', title: 'Home Improvement', description: 'Remodeling the bathroom. Pay $2500.', cost: 2500, actionText: 'Pay $2500' },
  { id: 'd_11', type: 'DOODAD', title: 'Speeding Ticket', description: 'Caught on camera. Pay $200.', cost: 200, actionText: 'Pay $200' },
  { id: 'd_12', type: 'DOODAD', title: 'Buy a Watch', description: 'Luxury timepiece. Pay $1200.', cost: 1200, actionText: 'Pay $1200' },
  { id: 'd_13', type: 'DOODAD', title: 'Kids Camp', description: 'Summer camp for the kids. Pay $800.', cost: 800, actionText: 'Pay $800' },
  { id: 'd_14', type: 'DOODAD', title: 'Wedding Gift', description: 'Friend is getting married. Pay $300.', cost: 300, actionText: 'Pay $300' },
  { id: 'd_15', type: 'DOODAD', title: 'New Smartphone', description: 'Upgraded to the latest model. Pay $1000.', cost: 1000, actionText: 'Pay $1000' }
];

export const MARKET: GameCard[] = [
  { id: 'm_1', type: 'MARKET', title: 'Real Estate Boom', description: 'Housing prices soar. You may sell any 3Br/2Ba house for $135,000.', cost: 135000, assetType: 'REAL_ESTATE', actionText: 'Check Assets' },
  { id: 'm_2', type: 'MARKET', title: 'Condo Buyers', description: 'Retirees looking for condos. You may sell any 2Br/1Ba condo for $65,000.', cost: 65000, assetType: 'REAL_ESTATE', actionText: 'Check Assets' },
  { id: 'm_3', type: 'MARKET', title: 'OK4U Stock Buyout', description: 'Company acquired. Everyone must sell OK4U shares for $50.', cost: 50, assetType: 'STOCK', actionText: 'Check Assets' },
  { id: 'm_4', type: 'MARKET', title: 'Apartment Buyers', description: 'Investors want multi-family. You may sell any Apartment House for $40,000 per unit.', cost: 40000, assetType: 'REAL_ESTATE', actionText: 'Check Assets' },
  { id: 'm_5', type: 'MARKET', title: 'Business Expansion', description: 'Corporate buyer wants your business. You may sell any Business for 3x its original cost.', cost: 3, assetType: 'BUSINESS', actionText: 'Check Assets' },
  { id: 'm_6', type: 'MARKET', title: 'Inflation', description: 'Gold prices hit record highs. You may sell 1oz Gold coins for $800 each.', cost: 800, assetType: 'COIN', actionText: 'Check Assets' },
  { id: 'm_7', type: 'MARKET', title: 'MYT4U Stock Crash', description: 'Tech bubble bursts. MYT4U shares drop. (No action needed, just market info)', cost: 0, assetType: 'STOCK', actionText: 'Check Assets' },
  { id: 'm_8', type: 'MARKET', title: 'Real Estate Crash', description: 'Market cools off. (No action needed, just market info)', cost: 0, assetType: 'REAL_ESTATE', actionText: 'Check Assets' },
  { id: 'm_9', type: 'MARKET', title: 'Plex Buyers', description: 'Demand for 4-Plexes. Sell any 4-Unit Apartment for $200,000.', cost: 200000, assetType: 'REAL_ESTATE', actionText: 'Check Assets' },
  { id: 'm_10', type: 'MARKET', title: 'ON2U Stock Surges', description: 'Hit movie release! Everyone may sell ON2U shares for $40.', cost: 40, assetType: 'STOCK', actionText: 'Check Assets' }
];

export const ALL_CARDS = { SMALL_DEALS, BIG_DEALS, DOODADS, MARKET };
