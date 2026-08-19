import { DaiLocation } from '../types';

export const mockDaiLocations: DaiLocation[] = [
  {
    id: 'DAI-NGW-01',
    name: 'DAI Ngawi Barat',
    location: 'Kecamatan Kedunggalar, Ngawi, Jawa Timur',
    coordinates: [-7.4475, 111.3734],
    capacity: 250, // tons
    services: ['ATM Gabah', 'Drying', 'Milling', 'Zero Waste Processing'],
    stockLevels: {
      gabah: 45.5,
      beras: 20.0,
      sekam: 5.2,
      bekatul: 2.1,
    },
    managerId: 'user-dai-1',
  },
  {
    id: 'DAI-MDN-01',
    name: 'DAI Madiun Selatan',
    location: 'Kecamatan Dolopo, Madiun, Jawa Timur',
    coordinates: [-7.7558, 111.5367],
    capacity: 150, // tons
    services: ['ATM Gabah', 'Drying', 'Milling'],
    stockLevels: {
      gabah: 30.2,
      beras: 15.5,
      sekam: 2.5,
      bekatul: 1.0,
    },
    managerId: 'user-dai-2',
  },
  {
    id: 'DAI-BJN-01',
    name: 'DAI Bojonegoro',
    location: 'Kecamatan Padangan, Bojonegoro, Jawa Timur',
    coordinates: [-7.1643, 111.6046],
    capacity: 200, // tons
    services: ['ATM Gabah', 'Drying', 'Milling', 'Packaging'],
    stockLevels: {
      gabah: 65.0,
      beras: 45.0,
      sekam: 8.5,
      bekatul: 4.2,
    },
    managerId: 'user-dai-3',
  },
  {
    id: 'DAI-TBN-01',
    name: 'DAI Tuban',
    location: 'Kecamatan Semanding, Tuban, Jawa Timur',
    coordinates: [-6.9157, 112.0620],
    capacity: 100, // tons
    services: ['ATM Gabah', 'Drying'],
    stockLevels: {
      gabah: 20.5,
      beras: 0,
      sekam: 1.2,
      bekatul: 0.5,
    },
    managerId: 'user-dai-4',
  },
  {
    id: 'DAI-LMG-01',
    name: 'DAI Lamongan',
    location: 'Kecamatan Babat, Lamongan, Jawa Timur',
    coordinates: [-7.1126, 112.1643],
    capacity: 300, // tons
    services: ['ATM Gabah', 'Drying', 'Milling', 'Zero Waste Processing', 'Seed Bank'],
    stockLevels: {
      gabah: 120.5,
      beras: 85.0,
      sekam: 15.5,
      bekatul: 8.0,
    },
    managerId: 'user-dai-5',
  },
  {
    id: 'DAI-SRG-01',
    name: 'DAI Sragen Timur',
    location: 'Kecamatan Sambungmacan, Sragen, Jawa Tengah',
    coordinates: [-7.3887, 111.0476],
    capacity: 220,
    services: ['ATM Gabah', 'Drying', 'Milling', 'Packaging'],
    stockLevels: { gabah: 72.4, beras: 38.5, sekam: 7.8, bekatul: 3.4 },
    managerId: 'user-dai-6',
  },
  {
    id: 'DAI-KRW-01',
    name: 'DAI Karawang Lumbung',
    location: 'Kecamatan Tempuran, Karawang, Jawa Barat',
    coordinates: [-6.2823, 107.4627],
    capacity: 350,
    services: ['ATM Gabah', 'Drying', 'Milling', 'Seed Bank'],
    stockLevels: { gabah: 138.0, beras: 92.0, sekam: 18.2, bekatul: 9.1 },
    managerId: 'user-dai-7',
  },
  {
    id: 'DAI-PRG-01',
    name: 'DAI Pringsewu',
    location: 'Kecamatan Gading Rejo, Pringsewu, Lampung',
    coordinates: [-5.3584, 104.9768],
    capacity: 180,
    services: ['ATM Gabah', 'Drying', 'Milling'],
    stockLevels: { gabah: 54.7, beras: 26.3, sekam: 5.8, bekatul: 2.7 },
    managerId: 'user-dai-8',
  },
  {
    id: 'DAI-BMS-01',
    name: 'DAI Banyuasin',
    location: 'Kecamatan Rantau Bayur, Banyuasin, Sumatera Selatan',
    coordinates: [-3.1928, 104.3216],
    capacity: 260,
    services: ['ATM Gabah', 'Drying', 'Milling', 'Zero Waste Processing'],
    stockLevels: { gabah: 95.6, beras: 48.4, sekam: 12.2, bekatul: 5.5 },
    managerId: 'user-dai-9',
  },
  {
    id: 'DAI-SDP-01',
    name: 'DAI Sidenreng Rappang',
    location: 'Kecamatan Panca Rijang, Sidrap, Sulawesi Selatan',
    coordinates: [-3.9275, 119.8184],
    capacity: 240,
    services: ['ATM Gabah', 'Drying', 'Milling', 'Packaging'],
    stockLevels: { gabah: 84.5, beras: 41.2, sekam: 9.4, bekatul: 4.6 },
    managerId: 'user-dai-10',
  }
];
