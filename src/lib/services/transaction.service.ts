import { DepositTransaction } from '../types';
import {
  canonicalFarmerId,
  farmerUserId,
  getDemoState,
  updateDemoState,
  walletBelongsToUser,
  walletIdForUser,
} from '../demo/demo-store';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const transactionService = {
  async getTransactions(farmerId?: string): Promise<DepositTransaction[]> {
    await delay(50);
    const transactions = getDemoState().transactions;
    if (farmerId) {
      const normalizedId = canonicalFarmerId(farmerId);
      return transactions.filter(t => t.farmerId === normalizedId);
    }
    return [...transactions];
  },

  async getTransactionById(id: string): Promise<DepositTransaction> {
    await delay(50);
    const trx = getDemoState().transactions.find(t => t.id === id);
    if (!trx) throw new Error('Transaksi tidak ditemukan');
    return trx;
  },

  async createDeposit(data: Partial<DepositTransaction>): Promise<DepositTransaction> {
    await delay(50);
    const grossWeight = Number(data.berat_kotor || 0);
    const netWeight = Number(data.berat_bersih || 0);
    if (grossWeight <= 0 || netWeight <= 0 || netWeight > grossWeight) {
      throw new Error('Berat setoran tidak valid');
    }

    const newTrx: DepositTransaction = {
      id: `TRX-GAB-${new Date().getFullYear()}-${Date.now()}`,
      farmerId: canonicalFarmerId(data.farmerId),
      daiId: data.daiId || 'DAI-NGW-01',
      date: new Date().toISOString(),
      berat_kotor: grossWeight,
      berat_bersih: netWeight,
      kadar_air: data.kadar_air || 0,
      gabah_hampa: data.gabah_hampa || 0,
      grade: data.grade || 'C',
      harga_per_kg: data.harga_per_kg || 0,
      nilai_transaksi: data.nilai_transaksi || 0,
      status: 'menunggu_pembayaran',
      notes: data.notes
    };

    updateDemoState(state => {
      state.transactions.unshift(newTrx);
      state.auditLogs.unshift({
        id: `AUD-${Date.now()}`,
        userId: newTrx.farmerId,
        action: 'CREATE_DEPOSIT',
        entityType: 'DepositTransaction',
        entityId: newTrx.id,
        details: `Setoran ${newTrx.berat_kotor} kg dibuat`,
        timestamp: new Date().toISOString(),
      });
    });
    return newTrx;
  },

  async verifyTransaction(id: string, operatorId = 'user-operator_atm-1'): Promise<DepositTransaction> {
    await delay(250);
    let verified: DepositTransaction | undefined;

    updateDemoState(state => {
      const trx = state.transactions.find(item => item.id === id);
      if (!trx) return;

      const wasCompleted = trx.status === 'selesai';
      trx.status = 'selesai';
      verified = { ...trx };

      if (!wasCompleted) {
        let wallet = state.wallets.find(item => walletBelongsToUser(item, trx.farmerId));
        if (!wallet) {
          wallet = {
            id: walletIdForUser(trx.farmerId),
            userId: farmerUserId(trx.farmerId),
            balance: 0,
            currency: 'IDR',
            isActive: true,
          };
          state.wallets.push(wallet);
        }
        const alreadyCredited = state.walletTransactions.some(item => item.referenceId === trx.id);
        if (wallet && !alreadyCredited && trx.nilai_transaksi > 0) {
          wallet.balance += trx.nilai_transaksi;
          state.walletTransactions.unshift({
            id: `WT-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`,
            walletId: wallet.id,
            amount: trx.nilai_transaksi,
            type: 'deposit',
            referenceId: trx.id,
            description: `Penjualan Gabah ${trx.berat_bersih.toLocaleString('id-ID')} kg Grade ${trx.grade}`,
            date: new Date().toISOString(),
            status: 'completed',
          });
        }

        const gabahStock = state.warehouseStock.find(item => item.daiId === trx.daiId && item.itemType === 'gabah');
        if (gabahStock) {
          gabahStock.quantity += trx.berat_bersih;
          gabahStock.lastUpdated = new Date().toISOString();
        }

        state.notifications.unshift({
          id: `NOTIF-${Date.now()}`,
          userId: farmerUserId(trx.farmerId),
          title: 'Setoran Berhasil Diverifikasi',
          message: trx.nilai_transaksi > 0
            ? `Setoran ${trx.id} telah diverifikasi dan dana masuk ke Dompet NADI-TANI.`
            : `Setoran ${trx.id} telah diverifikasi dan menunggu perhitungan pembayaran.`,
          type: 'success',
          category: 'transaksi',
          isRead: false,
          createdAt: new Date().toISOString(),
          link: '/dashboard/petani/riwayat-setor',
        });
      }

      state.auditLogs.unshift({
        id: `AUD-${Date.now()}`,
        userId: operatorId,
        action: 'VERIFY_DEPOSIT',
        entityType: 'DepositTransaction',
        entityId: trx.id,
        details: `Setoran ${trx.id} diverifikasi operator`,
        timestamp: new Date().toISOString(),
      });
    });

    if (!verified) throw new Error('Transaksi tidak ditemukan');
    return verified;
  },

  async rejectTransaction(id: string, operatorId = 'user-operator_atm-1'): Promise<DepositTransaction> {
    await delay(200);
    let rejected: DepositTransaction | undefined;
    updateDemoState(state => {
      const trx = state.transactions.find(item => item.id === id);
      if (!trx) return;
      trx.status = 'dibatalkan';
      rejected = { ...trx };
      state.notifications.unshift({
        id: `NOTIF-${Date.now()}`,
        userId: farmerUserId(trx.farmerId),
        title: 'Setoran Perlu Diperiksa',
        message: `Setoran ${trx.id} ditolak operator. Silakan hubungi DAI untuk pemeriksaan ulang.`,
        type: 'warning',
        category: 'transaksi',
        isRead: false,
        createdAt: new Date().toISOString(),
        link: '/dashboard/petani/riwayat-setor',
      });
      state.auditLogs.unshift({
        id: `AUD-${Date.now()}`,
        userId: operatorId,
        action: 'REJECT_DEPOSIT',
        entityType: 'DepositTransaction',
        entityId: id,
        details: `Setoran ${id} ditolak operator`,
        timestamp: new Date().toISOString(),
      });
    });
    if (!rejected) throw new Error('Transaksi tidak ditemukan');
    return rejected;
  }
};
