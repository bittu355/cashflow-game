<<<<<<< HEAD
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
=======
export const RAT_RACE_SPACES = [
  { id: 0, label: "START", type: "START", color: "#6c757d" },
  { id: 1, label: "OPPORTUNITY", type: "OPPORTUNITY", color: "#28a745" },
  { id: 2, label: "DOODAD", type: "DOODAD", color: "#dc3545" },
  { id: 3, label: "OPPORTUNITY", type: "OPPORTUNITY", color: "#28a745" },
  { id: 4, label: "CHARITY", type: "CHARITY", color: "#17a2b8" },
  { id: 5, label: "OPPORTUNITY", type: "OPPORTUNITY", color: "#28a745" },
  { id: 6, label: "PAYDAY", type: "PAYDAY", color: "#ffd700" },
  { id: 7, label: "OPPORTUNITY", type: "OPPORTUNITY", color: "#28a745" },
  { id: 8, label: "MARKET", type: "MARKET", color: "#007bff" },
  { id: 9, label: "OPPORTUNITY", type: "OPPORTUNITY", color: "#28a745" },
  { id: 10, label: "DOODAD", type: "DOODAD", color: "#dc3545" },
  { id: 11, label: "OPPORTUNITY", type: "OPPORTUNITY", color: "#28a745" },
  { id: 12, label: "BABY", type: "BABY", color: "#e83e8c" },
  { id: 13, label: "OPPORTUNITY", type: "OPPORTUNITY", color: "#28a745" },
  { id: 14, label: "PAYDAY", type: "PAYDAY", color: "#ffd700" },
  { id: 15, label: "OPPORTUNITY", type: "OPPORTUNITY", color: "#28a745" },
  { id: 16, label: "MARKET", type: "MARKET", color: "#007bff" },
  { id: 17, label: "OPPORTUNITY", type: "OPPORTUNITY", color: "#28a745" },
  { id: 18, label: "DOODAD", type: "DOODAD", color: "#dc3545" },
  { id: 19, label: "OPPORTUNITY", type: "OPPORTUNITY", color: "#28a745" },
  { id: 20, label: "DOWNSIZED", type: "DOWNSIZED", color: "#6c757d" },
  { id: 21, label: "OPPORTUNITY", type: "OPPORTUNITY", color: "#28a745" },
  { id: 22, label: "PAYDAY", type: "PAYDAY", color: "#ffd700" },
  { id: 23, label: "OPPORTUNITY", type: "OPPORTUNITY", color: "#28a745" }
>>>>>>> 6b18c4090941a97b1a58427d5a8a172d4e257aa5
];
