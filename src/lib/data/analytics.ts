import { NTPData, GTWRData, ProvinceData } from '../types';

export const mockNationalStats = {
  totalPetaniAktif: 2854000, // 2.8 million
  luasLahan: 11320000, // 11.32M ha (Luas Panen Padi)
  produksiGKG: 60210000, // 60.21M ton
  produksiBeras: 34690000, // 34.69M ton
  demografiUmur: {
    '19-39': 21.93,
    '40+': 78.07,
  }
};

export const mockNTPData: NTPData[] = [
  // Historical 2025
  { month: '2025-07', ntp: 110.82, ntup: 111.45, category: 'Tanaman Pangan' },
  { month: '2025-08', ntp: 111.85, ntup: 112.50, category: 'Tanaman Pangan' },
  { month: '2025-09', ntp: 112.43, ntup: 113.10, category: 'Tanaman Pangan' },
  { month: '2025-10', ntp: 113.55, ntup: 114.20, category: 'Tanaman Pangan' },
  { month: '2025-11', ntp: 114.92, ntup: 115.65, category: 'Tanaman Pangan' },
  { month: '2025-12', ntp: 115.20, ntup: 116.00, category: 'Tanaman Pangan' },
  // Historical 2026
  { month: '2026-01', ntp: 116.16, ntup: 116.89, category: 'Tanaman Pangan' },
  { month: '2026-02', ntp: 116.85, ntup: 117.40, category: 'Tanaman Pangan' },
  { month: '2026-03', ntp: 117.02, ntup: 117.65, category: 'Tanaman Pangan' },
  { month: '2026-04', ntp: 116.50, ntup: 117.15, category: 'Tanaman Pangan' },
  { month: '2026-05', ntp: 116.20, ntup: 116.80, category: 'Tanaman Pangan' },
  { month: '2026-06', ntp: 117.05, ntup: 117.75, category: 'Tanaman Pangan' },
  // Projection (LSTM Simulation)
  { month: '2026-07', ntp: 117.30, ntup: 118.00, category: 'Tanaman Pangan', isProjection: true },
  { month: '2026-08', ntp: 117.85, ntup: 118.60, category: 'Tanaman Pangan', isProjection: true },
  { month: '2026-09', ntp: 118.42, ntup: 119.15, category: 'Tanaman Pangan', isProjection: true },
  { month: '2026-10', ntp: 119.10, ntup: 119.80, category: 'Tanaman Pangan', isProjection: true },
  { month: '2026-11', ntp: 119.85, ntup: 120.65, category: 'Tanaman Pangan', isProjection: true },
  { month: '2026-12', ntp: 120.35, ntup: 121.20, category: 'Tanaman Pangan', isProjection: true },
  
  // Perkebunan for comparison (July 2026)
  { month: '2026-07', ntp: 159.77, ntup: 161.20, category: 'Perkebunan' },
];

export const mockGTWRData: GTWRData[] = [
  { province: 'Jawa Timur', index: 0.85, weight: 18.5, year: 2026 },
  { province: 'Jawa Tengah', index: 0.82, weight: 16.2, year: 2026 },
  { province: 'Jawa Barat', index: 0.79, weight: 15.8, year: 2026 },
  { province: 'Sulawesi Selatan', index: 0.75, weight: 8.5, year: 2026 },
  { province: 'Sumatera Selatan', index: 0.71, weight: 5.2, year: 2026 },
  { province: 'Lampung', index: 0.68, weight: 4.8, year: 2026 },
  { province: 'Sumatera Utara', index: 0.65, weight: 4.5, year: 2026 },
  { province: 'Kalimantan Selatan', index: 0.58, weight: 2.1, year: 2026 },
];

export const mockProvinceMapData: ProvinceData[] = [
  { id: '35', name: 'Jawa Timur', coordinates: [-7.5360, 112.2384], ntp: 118.5, production: 9850000, activeFarmers: 450000, daiCount: 12 },
  { id: '33', name: 'Jawa Tengah', coordinates: [-7.1509, 110.1402], ntp: 116.8, production: 9500000, activeFarmers: 420000, daiCount: 10 },
  { id: '32', name: 'Jawa Barat', coordinates: [-6.9204, 107.6046], ntp: 115.2, production: 9100000, activeFarmers: 380000, daiCount: 8 },
  { id: '73', name: 'Sulawesi Selatan', coordinates: [-4.1449, 119.9066], ntp: 112.4, production: 5200000, activeFarmers: 210000, daiCount: 5 },
  { id: '11', name: 'Aceh', coordinates: [4.6951, 96.7494], ntp: 108.5, production: 1800000, activeFarmers: 120000, daiCount: 2 },
];
