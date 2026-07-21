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
  }
];
