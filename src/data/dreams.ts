export interface Dream {
  id: string;
  name: string;
  cost: number;
  description: string;
}

export const DREAMS: Dream[] = [
  { id: '1', name: 'Park Avenue Jewelry Shopping Spree', cost: 150000, description: 'Buy whatever your heart desires on Park Avenue.' },
  { id: '2', name: 'Yacht Racing in the Mediterranean', cost: 200000, description: 'Compete with the world\'s elite in the blue waters.' },
  { id: '3', name: 'Seven Wonders of the World Tour', cost: 100000, description: 'A luxury tour of all seven world wonders.' },
  { id: '4', name: 'Own Your Own Private Island', cost: 500000, description: 'Peace, quiet, and complete ownership of your island.' },
  { id: '5', name: 'Heli-Skiing in the Swiss Alps', cost: 75000, description: 'The ultimate adrenaline rush in pure luxury.' },
  { id: '6', name: 'Endow a Museum Wing', cost: 300000, description: 'Leave a lasting legacy for the arts.' }
];
