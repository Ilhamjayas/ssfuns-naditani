import { PriceData } from '../types';

export const mockPrices: PriceData[] = [
  { date: '2026-07-20', commodity: 'GKP', grade: 'A', price: 7200, trend: 'stable', source: 'DAI' },
  { date: '2026-07-20', commodity: 'GKP', grade: 'B', price: 6500, trend: 'up', source: 'DAI' },
  { date: '2026-07-20', commodity: 'GKP', grade: 'C', price: 5800, trend: 'down', source: 'DAI' },
  
  { date: '2026-07-20', commodity: 'GKP', grade: 'A', price: 7000, trend: 'stable', source: 'Pasar' },
  { date: '2026-07-20', commodity: 'GKP', grade: 'B', price: 6200, trend: 'stable', source: 'Pasar' },
  { date: '2026-07-20', commodity: 'GKP', grade: 'C', price: 5500, trend: 'down', source: 'Pasar' },
  
  { date: '2026-07-20', commodity: 'GKP', price: 6000, trend: 'stable', source: 'HPP' },
  
  { date: '2026-07-20', commodity: 'Beras Premium', price: 14500, trend: 'stable', source: 'DAI' },
  { date: '2026-07-20', commodity: 'Beras Medium', price: 12500, trend: 'stable', source: 'DAI' },
  
  // Previous days
  { date: '2026-07-19', commodity: 'GKP', grade: 'B', price: 6450, trend: 'up', source: 'DAI' },
  { date: '2026-07-18', commodity: 'GKP', grade: 'B', price: 6400, trend: 'up', source: 'DAI' },
  { date: '2026-07-17', commodity: 'GKP', grade: 'B', price: 6400, trend: 'stable', source: 'DAI' },
  { date: '2026-07-16', commodity: 'GKP', grade: 'B', price: 6400, trend: 'stable', source: 'DAI' },
];
