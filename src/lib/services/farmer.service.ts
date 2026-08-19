import { FarmerProfile } from '../types';
import { mockFarmers } from '../data/farmers';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const farmerService = {
  async getFarmerProfile(id: string): Promise<FarmerProfile> {
    await delay(100);
    const farmer = mockFarmers.find(f => f.id === id || f.userId === id);
    return farmer || mockFarmers[0];
  },

  async getFarmerDashboard(userId: string) {
    await delay(150);
    const farmer = await this.getFarmerProfile(userId);

    // Aggregate some simulated data
    return {
      profile: farmer,
      totalIncome: 12500000, // Simulasi total pendapatan musim ini
      expectedYield: (farmer?.luas_lahan || 1.8) * 6000, // Simulasi 6 ton/ha
      nextHarvest: farmer?.estimasi_panen || '2026-08-25T00:00:00.000Z',
      weatherAlert: 'Waspada genangan air di sawah dataran rendah',
    };
  }
};
