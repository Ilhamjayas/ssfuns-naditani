import { DepositTransaction } from '../types';
import { mockTransactions } from '../data/transactions';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const transactionService = {
  async getTransactions(farmerId?: string): Promise<DepositTransaction[]> {
    await delay(50);
    if (farmerId) {
      return mockTransactions.filter(t => t.farmerId === farmerId);
    }
    return [...mockTransactions];
  },
  
  async getTransactionById(id: string): Promise<DepositTransaction> {
    await delay(50);
    const trx = mockTransactions.find(t => t.id === id);
    if (!trx) throw new Error('Transaksi tidak ditemukan');
    return trx;
  },
  
  async createDeposit(data: Partial<DepositTransaction>): Promise<DepositTransaction> {
    await delay(50);
    const newTrx: DepositTransaction = {
      id: `TRX-GAB-2026-00${Math.floor(Math.random() * 900) + 100}`,
      farmerId: data.farmerId || 'PTN-240017',
      daiId: data.daiId || 'DAI-NGW-01',
      date: new Date().toISOString(),
      berat_kotor: data.berat_kotor || 0,
      berat_bersih: data.berat_bersih || 0,
      kadar_air: data.kadar_air || 0,
      gabah_hampa: data.gabah_hampa || 0,
      grade: data.grade || 'C',
      harga_per_kg: data.harga_per_kg || 0,
      nilai_transaksi: data.nilai_transaksi || 0,
      status: 'menunggu_pembayaran',
      notes: data.notes
    };
    
    // In a real app we would push this to db/array
    return newTrx;
  }
};
