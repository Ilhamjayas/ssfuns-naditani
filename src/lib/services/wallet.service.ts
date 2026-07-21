import { WalletAccount, WalletTransaction } from '../types';
import { mockWallets, mockWalletTransactions } from '../data/wallet';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const walletService = {
  async getWalletBalance(userId: string): Promise<WalletAccount> {
    await delay(300);
    const wallet = mockWallets.find(w => w.userId === userId);
    if (!wallet) {
      // Return empty wallet for demo if not found
      return {
        id: `WAL-${Math.random().toString(36).substr(2, 6)}`,
        userId,
        balance: 0,
        currency: 'IDR',
        isActive: true,
      };
    }
    return wallet;
  },
  
  async getWalletHistory(walletId: string): Promise<WalletTransaction[]> {
    await delay(400);
    return mockWalletTransactions
      .filter(t => t.walletId === walletId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },
  
  async requestWithdrawal(walletId: string, amount: number, bankInfo: string): Promise<WalletTransaction> {
    await delay(1000); // Simulate network request
    
    return {
      id: `WT-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000) + 1000}`,
      walletId,
      amount: -amount,
      type: 'withdrawal',
      description: `Penarikan ke ${bankInfo}`,
      date: new Date().toISOString(),
      status: 'pending' // Usually requires manual approval or bank process
    };
  }
};
