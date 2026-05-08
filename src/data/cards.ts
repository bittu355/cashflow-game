import { Asset } from '../types/game';

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
  {
    id: 'sd_1',
    type: 'SMALL_DEAL',
    title: 'House for Sale - 3Br/2Ba',
    description: 'Bank foreclosed property. Needs some work but good rental potential.',
    cost: 50000,
    downPayment: 5000,
    cashflow: 160,
    assetType: 'REAL_ESTATE',
    roi: '38%',
    actionText: 'Buy'
  },
  {
    id: 'sd_2',
    type: 'SMALL_DEAL',
    title: 'Stock: OK4U',
    description: 'A stable company. Only you may buy at this price.',
    cost: 10, // Cost per share
    downPayment: 10, // Full price
    cashflow: 0,
    assetType: 'STOCK',
    actionText: 'Buy Shares'
  }
];

export const DOODADS: GameCard[] = [
  {
    id: 'd_1',
    type: 'DOODAD',
    title: 'Buy a New Boat',
    description: 'You couldn\'t resist the boat show. Pay $1000 now.',
    cost: 1000,
    actionText: 'Pay $1000'
  },
  {
    id: 'd_2',
    type: 'DOODAD',
    title: 'New Tires',
    description: 'Your car failed inspection. Pay $400.',
    cost: 400,
    actionText: 'Pay $400'
  }
];
