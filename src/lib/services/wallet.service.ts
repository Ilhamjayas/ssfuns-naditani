import { WalletAccount, WalletTransaction } from '../types';
import {
  getDemoState,
  updateDemoState,
  walletBelongsToUser,
  walletIdForUser,
  walletOwnerId,
} from '../demo/demo-store';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const walletService = {
  async getWalletBalance(userId: string): Promise<WalletAccount> {
    await delay(100);
    const existing = getDemoState().wallets.find(wallet => walletBelongsToUser(wallet, userId));
    if (existing) return existing;

    const wallet: WalletAccount = {
      id: walletIdForUser(userId),
      userId: walletOwnerId(userId),
      balance: 0,
      currency: 'IDR',
      isActive: true,
    };
    updateDemoState(state => {
      state.wallets.push(wallet);
    });
    return wallet;
  },

  async getWalletHistory(walletId: string): Promise<WalletTransaction[]> {
    await delay(100);
    return getDemoState().walletTransactions.filter(transaction => transaction.walletId === walletId);
  },

  async requestWithdrawal(walletId: string, amount: number, bankInfo: string): Promise<WalletTransaction> {
    await delay(1000); // Simulate network request

    if (!Number.isFinite(amount) || amount < 50000) {
      throw new Error('Jumlah penarikan minimal Rp 50.000');
    }
    if (!bankInfo.trim()) {
      throw new Error('Rekening tujuan wajib diisi');
    }

    const transaction: WalletTransaction = {
      id: `WT-${new Date().getFullYear()}-${Date.now()}`,
      walletId,
      amount: -amount,
      type: 'withdrawal',
      description: `Penarikan ke ${bankInfo.trim()}`,
      date: new Date().toISOString(),
      status: 'pending' // Usually requires manual approval or bank process
    };
    updateDemoState(state => {
      const wallet = state.wallets.find(item => item.id === walletId);
      if (!wallet || !wallet.isActive) throw new Error('Dompet tidak aktif atau tidak ditemukan');
      if (amount > wallet.balance) throw new Error('Saldo tidak mencukupi');

      wallet.balance -= amount;
      state.walletTransactions.unshift(transaction);
      state.auditLogs.unshift({
        id: `AUD-${Date.now()}`,
        userId: walletOwnerId(wallet.userId),
        action: 'REQUEST_WITHDRAWAL',
        entityType: 'WalletTransaction',
        entityId: transaction.id,
        details: `Permintaan penarikan Rp ${amount.toLocaleString('id-ID')}`,
        timestamp: new Date().toISOString(),
      });
    });
    return transaction;
  }
};
