import { DaiLocation, ProductionBatch, DryingProcess, MillingProcess, WarehouseStock } from '../types';
import { mockDaiLocations } from '../data/dai-locations';
import { mockBatches, mockDryingProcesses, mockMillingProcesses } from '../data/batches';
import { mockWarehouseStock } from '../data/warehouse';
import { mockMachines } from '../data/machines';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const daiService = {
  async getDaiInfo(id: string): Promise<DaiLocation> {
    await delay(50);
    const dai = mockDaiLocations.find(d => d.id === id);
    if (!dai) throw new Error('DAI tidak ditemukan');
    return dai;
  },
  
  async getBatches(daiId: string): Promise<ProductionBatch[]> {
    await delay(50);
    return mockBatches.filter(b => b.daiId === daiId);
  },
  
  async getDryingProcesses(batchId?: string): Promise<DryingProcess[]> {
    await delay(50);
    if (batchId) {
      return mockDryingProcesses.filter(d => d.batchId === batchId);
    }
    return [...mockDryingProcesses];
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
    return mockWarehouseStock.filter(w => w.daiId === daiId);
  },
  
  async getMachines(daiId: string) {
    await delay(50);
    return mockMachines.filter(m => m.daiId === daiId);
  }
};
