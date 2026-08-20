import { DaiLocation, ProductionBatch, DryingProcess, MillingProcess, WarehouseStock } from '../types';
import { mockDaiLocations } from '../data/dai-locations';
import { mockBatches, mockMillingProcesses } from '../data/batches';
import { mockMachines } from '../data/machines';
import { getDemoState, updateDemoState } from '../demo/demo-store';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const daiService = {
  async getDaiInfo(id: string): Promise<DaiLocation> {
    await delay(50);
    const dai = mockDaiLocations.find(d => d.id === id);
    return dai || mockDaiLocations[0];
  },

  async getBatches(daiId: string): Promise<ProductionBatch[]> {
    await delay(50);
    const batches = mockBatches.filter(b => b.daiId === daiId);
    return batches.length > 0 ? batches : mockBatches;
  },

  async getDryingProcesses(batchId?: string): Promise<DryingProcess[]> {
    await delay(50);
    const dryingProcesses = getDemoState().dryingProcesses;
    if (batchId) {
      return dryingProcesses.filter(d => d.batchId === batchId);
    }
    return [...dryingProcesses].sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
  },

  async startDryingProcess(process: DryingProcess, userId: string): Promise<DryingProcess> {
    await delay(150);
    updateDemoState(state => {
      state.dryingProcesses.unshift(process);
      state.auditLogs.unshift({
        id: `AUD-${Date.now()}`,
        userId,
        action: 'START_DRYING',
        entityType: 'DryingProcess',
        entityId: process.id,
        details: `Pengeringan ${process.batchId} dimulai pada ${process.machineId}`,
        timestamp: new Date().toISOString(),
      });
    });
    return { ...process };
  },

  async updateDryingStatus(id: string, status: DryingProcess['status'], userId: string): Promise<DryingProcess> {
    await delay(120);
    let updated: DryingProcess | undefined;
    updateDemoState(state => {
      const process = state.dryingProcesses.find(item => item.id === id);
      if (!process) return;
      process.status = status;
      if (status === 'completed') {
        process.endTime = new Date().toISOString();
        process.currentMoisture = process.targetMoisture;
        process.temperature = 0;
      }
      updated = { ...process };
      state.auditLogs.unshift({
        id: `AUD-${Date.now()}`,
        userId,
        action: 'UPDATE_DRYING_STATUS',
        entityType: 'DryingProcess',
        entityId: id,
        details: `Status pengeringan diubah menjadi ${status}`,
        timestamp: new Date().toISOString(),
      });
    });
    if (!updated) throw new Error('Proses pengeringan tidak ditemukan');
    return updated;
  },

  async getMillingProcesses(batchId?: string): Promise<MillingProcess[]> {
    await delay(50);
    if (batchId) {
      return mockMillingProcesses.filter(m => m.batchId === batchId);
    }
    return [...mockMillingProcesses];
  },

  async getWarehouseStock(daiId: string): Promise<WarehouseStock[]> {
    await delay(50);
    const allStock = getDemoState().warehouseStock;
    const stock = allStock.filter(w => w.daiId === daiId);
    return stock.length > 0 ? stock : allStock;
  },

  async getMachines(daiId: string) {
    await delay(50);
    const machines = mockMachines.filter(m => m.daiId === daiId);
    return machines.length > 0 ? machines : mockMachines;
  }
};
