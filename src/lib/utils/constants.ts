import { UserRole } from '../types';

export const APP_NAME = 'NADI-TANI';
export const TAGLINE = 'Modernisasi Pertanian, Sejahterakan Petani';

export const NAVIGATION_ITEMS: Record<UserRole, { label: string; href: string; icon: string }[]> = {
  petani: [
    { label: 'Dashboard', href: '/dashboard/petani', icon: 'home' },
    { label: 'Transaksi', href: '/dashboard/petani/transaksi', icon: 'file-text' },
    { label: 'Dompet', href: '/dashboard/petani/dompet', icon: 'wallet' },
    { label: 'Subsidi', href: '/dashboard/petani/subsidi', icon: 'package' },
    { label: 'Edukasi', href: '/dashboard/petani/edukasi', icon: 'book-open' },
  ],
  operator_atm: [
    { label: 'Dashboard', href: '/dashboard/operator', icon: 'home' },
    { label: 'Penerimaan', href: '/dashboard/operator/penerimaan', icon: 'inbox' },
    { label: 'Kualitas', href: '/dashboard/operator/kualitas', icon: 'check-square' },
    { label: 'Mesin ATM', href: '/dashboard/operator/mesin', icon: 'cpu' },
  ],
  pengelola_dai: [
    { label: 'Dashboard', href: '/dashboard/dai', icon: 'home' },
    { label: 'Gudang', href: '/dashboard/dai/gudang', icon: 'database' },
    { label: 'Produksi', href: '/dashboard/dai/produksi', icon: 'settings' },
    { label: 'Penjualan', href: '/dashboard/dai/penjualan', icon: 'shopping-cart' },
    { label: 'Petani', href: '/dashboard/dai/petani', icon: 'users' },
  ],
  pemerintah: [
    { label: 'Dashboard', href: '/dashboard/pemerintah', icon: 'home' },
    { label: 'Analitik NTP', href: '/dashboard/pemerintah/ntp', icon: 'bar-chart' },
    { label: 'Stok Nasional', href: '/dashboard/pemerintah/stok', icon: 'pie-chart' },
    { label: 'Sebaran Subsidi', href: '/dashboard/pemerintah/subsidi', icon: 'map' },
  ],
  mitra: [
    { label: 'Dashboard', href: '/dashboard/mitra', icon: 'home' },
    { label: 'Marketplace', href: '/dashboard/mitra/marketplace', icon: 'shopping-bag' },
    { label: 'Pesanan Saya', href: '/dashboard/mitra/pesanan', icon: 'package' },
  ],
  admin: [
    { label: 'Dashboard', href: '/dashboard/admin', icon: 'home' },
    { label: 'Manajemen Pengguna', href: '/dashboard/admin/pengguna', icon: 'users' },
    { label: 'Sistem', href: '/dashboard/admin/sistem', icon: 'server' },
  ],
};

export const DEMO_CREDENTIALS = [
  { role: 'petani' as UserRole, username: 'petani', email: 'petani@naditani.id', password: 'password123', name: 'Budi Santoso' },
  { role: 'operator_atm' as UserRole, username: 'operator', email: 'operator@naditani.id', password: 'password123', name: 'Agus Pratama' },
  { role: 'pengelola_dai' as UserRole, username: 'dai', email: 'dai@naditani.id', password: 'password123', name: 'Bambang Widjaja' },
  { role: 'pemerintah' as UserRole, username: 'pemerintah', email: 'gov@naditani.id', password: 'password123', name: 'Dinas Pertanian Jatim' },
  { role: 'mitra' as UserRole, username: 'mitra', email: 'mitra@naditani.id', password: 'password123', name: 'PT Beras Makmur' },
  { role: 'admin' as UserRole, username: 'admin', email: 'admin@naditani.id', password: 'password123', name: 'System Admin' },
];

export const QUALITY_GRADES = [
  { grade: 'A', description: 'Kualitas Sangat Baik (Kadar Air < 14%, Hampa < 3%)' },
  { grade: 'B', description: 'Kualitas Baik (Kadar Air 14-18%, Hampa 3-5%)' },
  { grade: 'C', description: 'Kualitas Cukup (Kadar Air 18-25%, Hampa 5-10%)' },
  { grade: 'D', description: 'Kualitas Kurang (Kadar Air > 25%, Hampa > 10%)' },
];

export const NOTIFICATION_CATEGORIES = [
  { id: 'transaksi', label: 'Transaksi' },
  { id: 'pertanian', label: 'Pertanian & Cuaca' },
  { id: 'subsidi', label: 'Subsidi' },
  { id: 'sistem', label: 'Sistem' },
];

export const COLOR_PALETTE = {
  hijauTua: '#064E3B',
  hijauPertanian: '#2E7D32',
  hijauMuda: '#EAF4E4',
  krem: '#F7F3E8',
  emasPadi: '#D8A528',
  putih: '#FFFFFF',
};

export const PROVINCE_LIST = [
  { id: '11', name: 'Aceh', coordinates: [4.6951, 96.7494] as [number, number] },
  { id: '12', name: 'Sumatera Utara', coordinates: [2.1154, 99.5451] as [number, number] },
  { id: '13', name: 'Sumatera Barat', coordinates: [-0.7399, 100.8000] as [number, number] },
  { id: '32', name: 'Jawa Barat', coordinates: [-6.9204, 107.6046] as [number, number] },
  { id: '33', name: 'Jawa Tengah', coordinates: [-7.1509, 110.1402] as [number, number] },
  { id: '35', name: 'Jawa Timur', coordinates: [-7.5360, 112.2384] as [number, number] },
  { id: '52', name: 'Nusa Tenggara Barat', coordinates: [-8.6529, 117.3616] as [number, number] },
  { id: '63', name: 'Kalimantan Selatan', coordinates: [-3.0926, 115.2838] as [number, number] },
  { id: '73', name: 'Sulawesi Selatan', coordinates: [-4.1449, 119.9066] as [number, number] },
];
