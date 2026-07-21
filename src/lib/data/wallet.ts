import { WalletAccount, WalletTransaction } from '../types';

export const mockWallets: WalletAccount[] = [
  {
    id: 'WAL-240017',
    userId: 'user-1', // Budi Santoso
    balance: 4850000,
    currency: 'IDR',
    isActive: true,
  }
];

export const mockWalletTransactions: WalletTransaction[] = [
  {
    id: 'WT-2026-1001',
    walletId: 'WAL-240017',
    amount: 7930000,
    type: 'deposit',
    referenceId: 'TRX-GAB-2026-00182',
    description: 'Penjualan Gabah - 1.220 kg (Grade B)',
    date: '2026-07-20T08:35:00.000Z',
    status: 'completed'
  },
  {
    id: 'WT-2026-1002',
    walletId: 'WAL-240017',
    amount: 450000,
    type: 'revenue_share',
    description: 'Bagi Hasil Produk Sampingan (Sekam & Bekatul) - Periode Juni 2026',
    date: '2026-07-05T10:00:00.000Z',
    status: 'completed'
  },
  {
    id: 'WT-2026-1003',
    walletId: 'WAL-240017',
    amount: -3500000,
    type: 'withdrawal',
    description: 'Penarikan Tunai ke Rekening BRI',
    date: '2026-07-01T14:20:00.000Z',
    status: 'completed'
  },
  {
    id: 'WT-2026-1004',
    walletId: 'WAL-240017',
    amount: -1200000,
    type: 'payment',
    description: 'Pembelian Pupuk NPK Phonska Subsidi (100 kg)',
    date: '2026-06-15T09:15:00.000Z',
    status: 'completed'
  },
  {
    id: 'WT-2026-1005',
    walletId: 'WAL-240017',
    amount: 9472000,
    type: 'deposit',
    referenceId: 'TRX-GAB-2026-00185',
    description: 'Penjualan Gabah - 1.480 kg (Grade B)',
    date: '2026-03-15T09:10:00.000Z',
    status: 'completed'
  },
  {
    id: 'WT-2026-1006',
    walletId: 'WAL-240017',
    amount: -8352000,
    type: 'withdrawal',
    description: 'Penarikan Tunai ke Rekening BRI',
    date: '2026-03-16T11:00:00.000Z',
    status: 'completed'
  }
];
