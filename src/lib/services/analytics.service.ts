import { mockNationalStats, mockNTPData, mockGTWRData, mockProvinceMapData } from '../data/analytics';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const analyticsService = {
  async getNationalStats() {
    await delay(300);
    return mockNationalStats;
  },
  
  async getNTPData() {
    await delay(400);
    return mockNTPData.filter(d => !d.isProjection && d.category === 'Tanaman Pangan');
  },

  async getNTPProjection() {
    await delay(400);
    return mockNTPData.filter(d => d.isProjection && d.category === 'Tanaman Pangan');
  },
  
  async getGTWRData() {
    await delay(400);
    return mockGTWRData;
  },
  
  async getProvinceData() {
    await delay(500);
    return mockProvinceMapData;
  }
};
