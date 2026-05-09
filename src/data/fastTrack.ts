export type FastTrackSpaceType = 'CASHFLOW_DAY' | 'BUSINESS' | 'DREAM' | 'CHARITY' | 'TAX_AUDIT' | 'LAWSUIT' | 'DIVORCE';

export interface FastTrackSpace {
  id: number;
  type: FastTrackSpaceType;
  label: string;
  color: string;
  business?: {
    name: string;
    cost: number;
    cashflow: number;
  };
}

export interface Dream {
  id: string;
  name: string;
  cost: number;
  description: string;
}

export const DREAMS: Dream[] = [
  { id: 'dream_jet', name: 'Private Jet', cost: 150000, description: 'Travel the world in your own private jet.' },
  { id: 'dream_mayor', name: 'Run for Mayor', cost: 50000, description: 'Fund your own campaign and run for mayor of your city.' },
  { id: 'dream_island', name: 'Private Island', cost: 200000, description: 'Buy a secluded tropical island in the Pacific.' },
  { id: 'dream_rainforest', name: 'Save the Rainforest', cost: 100000, description: 'Purchase and protect 100,000 acres of rainforest.' },
  { id: 'dream_yacht', name: 'Luxury Yacht', cost: 120000, description: 'A 100-foot luxury yacht fully staffed.' },
  { id: 'dream_panda', name: 'Panda Reserve', cost: 150000, description: 'Fund a sanctuary for endangered pandas.' },
  { id: 'dream_space', name: 'Space Trip', cost: 250000, description: 'Buy a ticket for a sub-orbital space flight.' },
  { id: 'dream_golf', name: 'Golf Course', cost: 150000, description: 'Own and operate a championship golf course.' },
];

export const FAST_TRACK_SPACES: FastTrackSpace[] = [
  { id: 0, type: 'CASHFLOW_DAY', label: 'Cashflow Day', color: '#ffd700' },
  { id: 1, type: 'BUSINESS', label: 'Software Co.', color: '#28a745', business: { name: 'Software Co.', cost: 150000, cashflow: 5000 } },
  { id: 2, type: 'DREAM', label: 'Dream', color: '#e83e8c' },
  { id: 3, type: 'BUSINESS', label: 'Laundromat', color: '#28a745', business: { name: 'Laundromat', cost: 50000, cashflow: 1500 } },
  { id: 4, type: 'CASHFLOW_DAY', label: 'Cashflow Day', color: '#ffd700' },
  { id: 5, type: 'TAX_AUDIT', label: 'Tax Audit', color: '#dc3545' },
  { id: 6, type: 'BUSINESS', label: 'Car Wash', color: '#28a745', business: { name: 'Car Wash', cost: 75000, cashflow: 2500 } },
  { id: 7, type: 'DREAM', label: 'Dream', color: '#e83e8c' },
  { id: 8, type: 'BUSINESS', label: 'Burger Chain', color: '#28a745', business: { name: 'Burger Chain', cost: 300000, cashflow: 10000 } },
  { id: 9, type: 'CHARITY', label: 'Charity', color: '#17a2b8' },
  { id: 10, type: 'CASHFLOW_DAY', label: 'Cashflow Day', color: '#ffd700' },
  { id: 11, type: 'BUSINESS', label: 'Apartments', color: '#28a745', business: { name: 'Apartment Complex', cost: 200000, cashflow: 6000 } },
  { id: 12, type: 'DREAM', label: 'Dream', color: '#e83e8c' },
  { id: 13, type: 'DIVORCE', label: 'Divorce', color: '#dc3545' },
  { id: 14, type: 'BUSINESS', label: 'Storage Units', color: '#28a745', business: { name: 'Storage Units', cost: 100000, cashflow: 3000 } },
  { id: 15, type: 'CASHFLOW_DAY', label: 'Cashflow Day', color: '#ffd700' },
  { id: 16, type: 'DREAM', label: 'Dream', color: '#e83e8c' },
  { id: 17, type: 'BUSINESS', label: 'Pizza Franchise', color: '#28a745', business: { name: 'Pizza Franchise', cost: 120000, cashflow: 4000 } },
  { id: 18, type: 'CHARITY', label: 'Charity', color: '#17a2b8' },
  { id: 19, type: 'CASHFLOW_DAY', label: 'Cashflow Day', color: '#ffd700' },
  { id: 20, type: 'BUSINESS', label: 'Marina', color: '#28a745', business: { name: 'Marina', cost: 250000, cashflow: 8000 } },
  { id: 21, type: 'DREAM', label: 'Dream', color: '#e83e8c' },
  { id: 22, type: 'LAWSUIT', label: 'Lawsuit', color: '#dc3545' },
  { id: 23, type: 'BUSINESS', label: 'Shopping Mall', color: '#28a745', business: { name: 'Shopping Mall', cost: 500000, cashflow: 15000 } },
  { id: 24, type: 'CASHFLOW_DAY', label: 'Cashflow Day', color: '#ffd700' },
  { id: 25, type: 'DREAM', label: 'Dream', color: '#e83e8c' },
  { id: 26, type: 'BUSINESS', label: 'Gold Mine', color: '#28a745', business: { name: 'Gold Mine', cost: 400000, cashflow: 12000 } },
  { id: 27, type: 'CHARITY', label: 'Charity', color: '#17a2b8' },
  { id: 28, type: 'BUSINESS', label: 'Auto Dealer', color: '#28a745', business: { name: 'Auto Dealer', cost: 180000, cashflow: 5000 } },
  { id: 29, type: 'CASHFLOW_DAY', label: 'Cashflow Day', color: '#ffd700' },
  { id: 30, type: 'DREAM', label: 'Dream', color: '#e83e8c' },
  { id: 31, type: 'TAX_AUDIT', label: 'Tax Audit', color: '#dc3545' },
  { id: 32, type: 'BUSINESS', label: 'BioTech StartUp', color: '#28a745', business: { name: 'BioTech StartUp', cost: 350000, cashflow: 10000 } },
  { id: 33, type: 'CASHFLOW_DAY', label: 'Cashflow Day', color: '#ffd700' },
  { id: 34, type: 'DREAM', label: 'Dream', color: '#e83e8c' },
  { id: 35, type: 'BUSINESS', label: 'Oil Well', color: '#28a745', business: { name: 'Oil Well', cost: 220000, cashflow: 7000 } },
  { id: 36, type: 'CHARITY', label: 'Charity', color: '#17a2b8' },
  { id: 37, type: 'BUSINESS', label: 'Pro Sports Team', color: '#28a745', business: { name: 'Pro Sports Team', cost: 1000000, cashflow: 25000 } }
];
