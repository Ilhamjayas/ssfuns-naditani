import { Byproduct, ZeroWasteProcess } from '../types';

export const mockByproducts: Byproduct[] = [
  {
    id: 'BYP-001',
    name: 'Biochar Sekam',
    sourceItem: 'sekam',
    processingMethod: 'Pirolisis',
    outputProduct: 'Biochar Padi',
    valuePerKg: 2500, // Rp 2.500/kg
  },
  {
    id: 'BYP-002',
    name: 'Briket Sekam',
    sourceItem: 'sekam',
    processingMethod: 'Pengepresan',
    outputProduct: 'Briket Bahan Bakar',
    valuePerKg: 7000, // Rp 7.000/kg
  },
  {
    id: 'BYP-003',
    name: 'Bekatul Pakan',
    sourceItem: 'bekatul',
    processingMethod: 'Stabilisasi & Pengemasan',
    outputProduct: 'Pakan Ternak',
    valuePerKg: 3000, // Rp 3.000/kg
  },
  {
    id: 'BYP-004',
    name: 'Kompos Jerami',
    sourceItem: 'jerami',
    processingMethod: 'Fermentasi',
    outputProduct: 'Pupuk Organik Padat',
    valuePerKg: 1800, // Rp 1.800/kg
  }
];

export const mockZeroWasteProcesses: ZeroWasteProcess[] = [
  {
    id: 'ZWP-2026-07-001',
    daiId: 'DAI-NGW-01',
    inputType: 'sekam',
    inputWeight: 1000, // 1 ton sekam
    outputType: 'Biochar Padi',
    outputWeight: 350, // 350 kg biochar (yield ~35%)
    date: '2026-07-15T08:00:00.000Z',
    revenueGenerated: 875000, // 350 * 2500
  },
  {
    id: 'ZWP-2026-07-002',
    daiId: 'DAI-NGW-01',
    inputType: 'bekatul',
    inputWeight: 500, // 500 kg bekatul
    outputType: 'Pakan Ternak',
    outputWeight: 480, // 480 kg pakan (yield 96%)
    date: '2026-07-16T10:00:00.000Z',
    revenueGenerated: 1440000, // 480 * 3000
  }
];
