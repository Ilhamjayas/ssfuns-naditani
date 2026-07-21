import { SubsidyAllocation } from '../types';

export const mockSubsidies: SubsidyAllocation[] = [
  {
    id: 'SUB-2026-PUP-01',
    farmerId: 'PTN-240017',
    type: 'pupuk',
    name: 'Urea Bersubsidi',
    quota: 150,
    unit: 'kg',
    status: 'tersedia',
    expiryDate: '2026-12-31T23:59:59.000Z',
    distributedBy: 'Kios Tani Makmur (Ngawi)',
  },
  {
    id: 'SUB-2026-PUP-02',
    farmerId: 'PTN-240017',
    type: 'pupuk',
    name: 'NPK Phonska Bersubsidi',
    quota: 0,
    unit: 'kg',
    status: 'sudah_diambil',
    expiryDate: '2026-12-31T23:59:59.000Z',
    distributedBy: 'Kios Tani Makmur (Ngawi)',
  },
  {
    id: 'SUB-2026-BEN-01',
    farmerId: 'PTN-240017',
    type: 'benih',
    name: 'Benih Padi Inpari 32',
    quota: 25,
    unit: 'kg',
    status: 'belum_tersedia',
    expiryDate: '2026-10-31T23:59:59.000Z',
  }
];
