import { WarehouseStock } from '../types';

export const mockWarehouseStock: WarehouseStock[] = [
  {
    id: 'STK-NGW-GAB-01',
    daiId: 'DAI-NGW-01',
    itemType: 'gabah',
    quantity: 45500, // 45.5 ton
    lastUpdated: '2026-07-20T10:00:00.000Z',
    minThreshold: 10000,
  },
  {
    id: 'STK-NGW-BER-01',
    daiId: 'DAI-NGW-01',
    itemType: 'beras_premium',
    quantity: 12000, // 12 ton
    lastUpdated: '2026-07-20T08:00:00.000Z',
    minThreshold: 5000,
  },
  {
    id: 'STK-NGW-BER-02',
    daiId: 'DAI-NGW-01',
    itemType: 'beras_medium',
    quantity: 8000, // 8 ton
    lastUpdated: '2026-07-19T17:00:00.000Z',
    minThreshold: 5000,
  },
  {
    id: 'STK-NGW-SEK-01',
    daiId: 'DAI-NGW-01',
    itemType: 'sekam',
    quantity: 5200, // 5.2 ton
    lastUpdated: '2026-07-19T17:00:00.000Z',
    minThreshold: 1000,
  },
  {
    id: 'STK-NGW-BEK-01',
    daiId: 'DAI-NGW-01',
    itemType: 'bekatul',
    quantity: 2100, // 2.1 ton
    lastUpdated: '2026-07-19T17:00:00.000Z',
    minThreshold: 500,
  },
  {
    id: 'STK-NGW-KOM-01',
    daiId: 'DAI-NGW-01',
    itemType: 'kompos',
    quantity: 3000, // 3 ton
    lastUpdated: '2026-07-18T10:00:00.000Z',
    minThreshold: 1000,
  }
];
