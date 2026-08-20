'use client';

import {
  AuditLog,
  BuyerOrder,
  DepositTransaction,
  DryingProcess,
  Notification,
  PickupSchedule,
  Product,
  WalletAccount,
  WalletTransaction,
  WarehouseStock,
} from '@/lib/types';
import { mockTransactions } from '@/lib/data/transactions';
import { mockWallets, mockWalletTransactions } from '@/lib/data/wallet';
import { mockWarehouseStock } from '@/lib/data/warehouse';
import { mockOrders } from '@/lib/data/orders';
import { mockProducts } from '@/lib/data/products';
import { mockNotifications } from '@/lib/data/notifications';
import { mockDryingProcesses } from '@/lib/data/batches';

export interface DemoUserProfile {
  avatarUrl?: string;
  personal: {
    nama: string;
    email: string;
    telepon: string;
    alamat: string;
  };
  farm?: {
    luasLahan: string;
    jenisTanaman: string;
    lokasiSawah: string;
    tahunMulai: string;
  };
  bank?: {
    namaBank: string;
    noRekening: string;
    atasNama: string;
  };
}

export interface DemoState {
  version: number;
  transactions: DepositTransaction[];
  schedules: PickupSchedule[];
  wallets: WalletAccount[];
  walletTransactions: WalletTransaction[];
  warehouseStock: WarehouseStock[];
  orders: BuyerOrder[];
  products: Product[];
  dryingProcesses: DryingProcess[];
  notifications: Notification[];
  profiles: Record<string, DemoUserProfile>;
  learningProgress: Record<string, number[]>;
  auditLogs: AuditLog[];
}

const STORAGE_KEY = 'nadi_demo_state_v2';
export const DEMO_UPDATE_EVENT = 'nadi-demo-update';

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const createInitialState = (): DemoState => ({
  version: 2,
  transactions: clone(mockTransactions),
  schedules: [
    {
      id: 'SCH-2026-00041',
      farmerId: 'PTN-240017',
      daiId: 'DAI-NGW-01',
      scheduledDate: '2026-08-23T08:00:00.000Z',
      estimatedWeight: 1800,
      status: 'confirmed',
      method: 'antar',
      pickupLocation: 'DAI Ngawi Barat',
      notes: 'Estimasi panen Blok Sawah Timur',
      createdAt: '2026-08-18T09:00:00.000Z',
    },
  ],
  wallets: clone(mockWallets),
  walletTransactions: clone(mockWalletTransactions),
  warehouseStock: clone(mockWarehouseStock),
  orders: clone(mockOrders),
  products: clone(mockProducts),
  dryingProcesses: clone(mockDryingProcesses),
  notifications: clone(mockNotifications),
  profiles: {},
  learningProgress: {},
  auditLogs: [],
});

let memoryState = createInitialState();

export function getDemoState(): DemoState {
  if (typeof window === 'undefined') return clone(memoryState);

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(memoryState));
    return clone(memoryState);
  }

  try {
    const parsed = JSON.parse(stored) as DemoState;
    if (parsed.version !== memoryState.version) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(memoryState));
      return clone(memoryState);
    }
    parsed.learningProgress ||= {};
    parsed.dryingProcesses ||= clone(mockDryingProcesses);
    parsed.products = mockProducts.map(canonicalProduct => {
      const savedProduct = parsed.products?.find(product => product.id === canonicalProduct.id);
      return savedProduct
        ? { ...canonicalProduct, stock: savedProduct.stock }
        : clone(canonicalProduct);
    });
    const generatedNotifications = (parsed.notifications || [])
      .filter(notification => !mockNotifications.some(item => item.id === notification.id))
      .map(notification => notification.link === '/dashboard'
        ? {
            ...notification,
            link: notification.userId.includes('mitra') ? '/dashboard/mitra' : '/dashboard/petani',
          }
        : notification);
    parsed.notifications = [
      ...mockNotifications.map(canonicalNotification => {
        const savedNotification = parsed.notifications?.find(notification => notification.id === canonicalNotification.id);
        return savedNotification ? { ...canonicalNotification, isRead: savedNotification.isRead } : clone(canonicalNotification);
      }),
      ...generatedNotifications,
    ];
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    memoryState = parsed;
    return clone(parsed);
  } catch {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(memoryState));
    return clone(memoryState);
  }
}

export function saveDemoState(state: DemoState): DemoState {
  memoryState = clone(state);
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(memoryState));
    window.dispatchEvent(new CustomEvent(DEMO_UPDATE_EVENT));
  }
  return clone(memoryState);
}

export function updateDemoState(mutator: (draft: DemoState) => void): DemoState {
  const draft = getDemoState();
  mutator(draft);
  return saveDemoState(draft);
}

export function resetDemoState(): DemoState {
  memoryState = createInitialState();
  return saveDemoState(memoryState);
}

export function canonicalFarmerId(id?: string): string {
  if (!id || id === 'user-petani-1' || id === 'user-1') return 'PTN-240017';
  return id;
}

export function farmerUserId(farmerId: string): string {
  return farmerId === 'PTN-240017' ? 'user-petani-1' : farmerId;
}

export function walletOwnerId(userOrFarmerId: string): string {
  return farmerUserId(canonicalFarmerId(userOrFarmerId));
}

export function walletBelongsToUser(wallet: WalletAccount, userOrFarmerId: string): boolean {
  if (wallet.id === userOrFarmerId) return true;
  return walletOwnerId(wallet.userId) === walletOwnerId(userOrFarmerId);
}

export function walletIdForUser(userOrFarmerId: string): string {
  const ownerId = walletOwnerId(userOrFarmerId)
    .replace(/^user-/, '')
    .replace(/[^a-zA-Z0-9-]/g, '-')
    .toUpperCase();
  return `WAL-${ownerId}`;
}
