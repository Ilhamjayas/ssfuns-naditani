import { ProductionBatch, DryingProcess, MillingProcess } from '../types';

export const mockBatches: ProductionBatch[] = [
  {
    id: 'BATCH-2026-07-001',
    daiId: 'DAI-NGW-01',
    transactionIds: ['TRX-GAB-2026-00182', 'TRX-GAB-2026-00183'],
    startDate: '2026-07-20T10:00:00.000Z',
    initialWeight: 2055, // 1220 + 835
    status: 'drying',
  },
  {
    id: 'BATCH-2026-07-002',
    daiId: 'DAI-NGW-01',
    transactionIds: ['TRX-GAB-2026-00170', 'TRX-GAB-2026-00175'],
    startDate: '2026-07-19T08:00:00.000Z',
    initialWeight: 3500,
    status: 'milling',
  },
  {
    id: 'BATCH-2026-07-003',
    daiId: 'DAI-MDN-01',
    transactionIds: ['TRX-GAB-2026-00184'],
    startDate: '2026-07-19T15:00:00.000Z',
    initialWeight: 2040,
    status: 'drying',
  },
  {
    id: 'BATCH-2026-07-004',
    daiId: 'DAI-NGW-01',
    transactionIds: ['TRX-GAB-2026-00150', 'TRX-GAB-2026-00151'],
    startDate: '2026-07-18T08:00:00.000Z',
    endDate: '2026-07-19T16:00:00.000Z',
    initialWeight: 4000,
    finalWeight: 3400, // GKG
    status: 'completed',
  }
];

export const mockDryingProcesses: DryingProcess[] = [
  {
    id: 'DRY-2026-07-001',
    batchId: 'BATCH-2026-07-001',
    machineId: 'MAC-DRY-01',
    startTime: '2026-07-20T10:30:00.000Z',
    initialMoisture: 18.4,
    targetMoisture: 14.0,
    currentMoisture: 16.5,
    temperature: 45,
    status: 'running',
  },
  {
    id: 'DRY-2026-07-002',
    batchId: 'BATCH-2026-07-002',
    machineId: 'MAC-DRY-02',
    startTime: '2026-07-19T08:30:00.000Z',
    endTime: '2026-07-19T18:30:00.000Z',
    initialMoisture: 22.0,
    targetMoisture: 14.0,
    currentMoisture: 14.0,
    temperature: 0,
    status: 'completed',
  }
];

export const mockMillingProcesses: MillingProcess[] = [
  {
    id: 'MIL-2026-07-001',
    batchId: 'BATCH-2026-07-002',
    machineId: 'MAC-MIL-01',
    startTime: '2026-07-20T08:00:00.000Z',
    inputWeight: 2975, // Assuming 15% weight loss from drying
    results: {
      berasKepala: 1487, // ~50%
      berasPatah: 446,   // ~15%
      menir: 148,        // ~5%
      sekam: 595,        // ~20%
      bekatul: 297,      // ~10%
    },
    status: 'running',
  },
  {
    id: 'MIL-2026-07-002',
    batchId: 'BATCH-2026-07-004',
    machineId: 'MAC-MIL-01',
    startTime: '2026-07-19T10:00:00.000Z',
    endTime: '2026-07-19T16:00:00.000Z',
    inputWeight: 3400,
    results: {
      berasKepala: 1768, // 52%
      berasPatah: 442,   // 13%
      menir: 170,        // 5%
      sekam: 680,        // 20%
      bekatul: 340,      // 10%
    },
    status: 'completed',
  }
];
