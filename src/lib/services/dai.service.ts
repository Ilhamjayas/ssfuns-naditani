import { DaiLocation, ProductionBatch, DryingProcess, MillingProcess, WarehouseStock } from '../types';
import { mockDaiLocations } from '../data/dai-locations';
import { mockBatches, mockDryingProcesses, mockMillingProcesses } from '../data/batches';
import { mockMachines } from '../data/machines';
import { getDemoState } from '../demo/demo-store';

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
