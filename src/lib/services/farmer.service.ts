import { FarmerProfile } from '../types';
import { mockFarmers } from '../data/farmers';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const farmerService = {
  async getFarmerProfile(id: string): Promise<FarmerProfile> {
    await delay(400);
    const farmer = mockFarmers.find(f => f.id === id || f.userId === id);
    if (!farmer) throw new Error('Petani tidak ditemukan');
    return farmer;
  },
  
  async getFarmerDashboard(userId: string) {
    await delay(600);
    const farmer = await this.getFarmerProfile(userId);
    
    // Aggregate some simulated data
    return {
      profile: farmer,
      totalIncome: 12500000, // Simulasi total pendapatan musim ini
      expectedYield: farmer.luas_lahan * 6000, // Simulasi 6 ton/ha
      nextHarvest: farmer.estimasi_panen,
      weatherAlert: 'Waspada hujan lebat pada 25 Juli 2026',
    };
  }
};
