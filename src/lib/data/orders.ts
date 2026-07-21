import { BuyerOrder } from '../types';

export const mockOrders: BuyerOrder[] = [
  {
    id: 'ORD-2026-07-001',
    buyerId: 'mitra-1',
    daiId: 'DAI-NGW-01',
    items: [
      { productId: 'PRD-BER-002', quantity: 50, price: 315000 }, // Beras Medium 25kg x 50
    ],
    totalAmount: 15750000,
    status: 'shipped',
    orderDate: '2026-07-18T10:00:00.000Z',
    shippingAddress: 'Gudang Mitra, Jl. Pahlawan No.45, Surabaya, Jawa Timur'
  },
  {
    id: 'ORD-2026-07-002',
    buyerId: 'mitra-2',
    daiId: 'DAI-NGW-01',
    items: [
      { productId: 'PRD-BYP-001', quantity: 100, price: 25000 }, // Biochar x 100
      { productId: 'PRD-PUP-001', quantity: 50, price: 45000 },  // Kompos x 50
    ],
    totalAmount: 4750000,
    status: 'processing',
    orderDate: '2026-07-19T14:30:00.000Z',
    shippingAddress: 'Toko Tani Subur, Jl. Raya Solo-Ngawi KM 15, Ngawi'
  },
  {
    id: 'ORD-2026-07-003',
    buyerId: 'mitra-1',
    daiId: 'DAI-MDN-01',
    items: [
      { productId: 'PRD-BER-001', quantity: 100, price: 75000 }, // Beras Premium 5kg x 100
    ],
    totalAmount: 7500000,
    status: 'pending',
    orderDate: '2026-07-20T09:15:00.000Z',
    shippingAddress: 'Gudang Mitra, Jl. Pahlawan No.45, Surabaya, Jawa Timur'
  }
];
