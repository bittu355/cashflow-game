export type SpaceType = 'OPPORTUNITY' | 'DOODAD' | 'MARKET' | 'PAYDAY' | 'CHARITY' | 'BABY' | 'DOWNSIZED';

export interface BoardSpace {
  id: number;
  type: SpaceType;
  label: string;
  color: string;
}

// Cashflow Rat Race has 24 spaces.
export const RAT_RACE_SPACES: BoardSpace[] = [
  { id: 0, type: 'PAYDAY', label: 'Payday', color: '#ffd700' }, // Gold
  { id: 1, type: 'OPPORTUNITY', label: 'Opportunity', color: '#28a745' }, // Green
  { id: 2, type: 'DOODAD', label: 'Doodad', color: '#dc3545' }, // Red
  { id: 3, type: 'OPPORTUNITY', label: 'Opportunity', color: '#28a745' },
  { id: 4, type: 'MARKET', label: 'Market', color: '#007bff' }, // Blue
  { id: 5, type: 'OPPORTUNITY', label: 'Opportunity', color: '#28a745' },
  { id: 6, type: 'DOODAD', label: 'Doodad', color: '#dc3545' },
  { id: 7, type: 'OPPORTUNITY', label: 'Opportunity', color: '#28a745' },
  { id: 8, type: 'PAYDAY', label: 'Payday', color: '#ffd700' },
  { id: 9, type: 'OPPORTUNITY', label: 'Opportunity', color: '#28a745' },
  { id: 10, type: 'MARKET', label: 'Market', color: '#007bff' },
  { id: 11, type: 'OPPORTUNITY', label: 'Opportunity', color: '#28a745' },
  { id: 12, type: 'BABY', label: 'Baby', color: '#e83e8c' }, // Pink
  { id: 13, type: 'OPPORTUNITY', label: 'Opportunity', color: '#28a745' },
  { id: 14, type: 'DOODAD', label: 'Doodad', color: '#dc3545' },
  { id: 15, type: 'OPPORTUNITY', label: 'Opportunity', color: '#28a745' },
  { id: 16, type: 'PAYDAY', label: 'Payday', color: '#ffd700' },
  { id: 17, type: 'OPPORTUNITY', label: 'Opportunity', color: '#28a745' },
  { id: 18, type: 'MARKET', label: 'Market', color: '#007bff' },
  { id: 19, type: 'OPPORTUNITY', label: 'Opportunity', color: '#28a745' },
  { id: 20, type: 'DOWNSIZED', label: 'Downsized', color: '#6c757d' }, // Grey
  { id: 21, type: 'OPPORTUNITY', label: 'Opportunity', color: '#28a745' },
  { id: 22, type: 'DOODAD', label: 'Doodad', color: '#dc3545' },
  { id: 23, type: 'CHARITY', label: 'Charity', color: '#17a2b8' }, // Teal
];
