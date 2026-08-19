import { PickupSchedule } from '@/lib/types';
import { canonicalFarmerId, farmerUserId, getDemoState, updateDemoState } from '@/lib/demo/demo-store';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const scheduleService = {
  async getSchedules(farmerId?: string): Promise<PickupSchedule[]> {
    await delay(80);
    const normalizedId = canonicalFarmerId(farmerId);
    return getDemoState().schedules
      .filter(item => !farmerId || item.farmerId === normalizedId)
      .sort((a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime());
  },

  async createSchedule(data: Partial<PickupSchedule>): Promise<PickupSchedule> {
    await delay(350);
    const now = new Date();
    const scheduledDate = data.scheduledDate ? new Date(data.scheduledDate) : null;
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (!scheduledDate || Number.isNaN(scheduledDate.getTime())) throw new Error('Tanggal jadwal tidak valid');
    if (scheduledDate < startOfToday) throw new Error('Tanggal jadwal tidak boleh di masa lalu');
    if (!Number.isFinite(data.estimatedWeight) || Number(data.estimatedWeight) <= 0) {
      throw new Error('Estimasi berat harus lebih dari 0 kg');
    }
    if (data.method === 'jemput' && !data.pickupLocation?.trim()) {
      throw new Error('Lokasi penjemputan wajib diisi');
    }
    const schedule: PickupSchedule = {
      id: `SCH-${now.getFullYear()}-${String(now.getTime()).slice(-5)}`,
      farmerId: canonicalFarmerId(data.farmerId),
      daiId: data.daiId || 'DAI-NGW-01',
      scheduledDate: scheduledDate.toISOString(),
      estimatedWeight: Number(data.estimatedWeight),
      status: 'pending',
      method: data.method || 'antar',
      pickupLocation: data.pickupLocation?.trim(),
      notes: data.notes?.trim(),
      createdAt: now.toISOString(),
    };

    updateDemoState(state => {
      state.schedules.unshift(schedule);
      state.notifications.unshift({
        id: `NOTIF-${now.getTime()}`,
        userId: 'user-operator_atm-1',
        title: 'Jadwal Setoran Baru',
        message: `Jadwal ${schedule.id} untuk ${schedule.estimatedWeight.toLocaleString('id-ID')} kg gabah menunggu konfirmasi.`,
        type: 'info',
        category: 'transaksi',
        isRead: false,
        createdAt: now.toISOString(),
        link: '/dashboard/operator-dai/penerimaan',
      });
    });
    return schedule;
  },

  async updateStatus(id: string, status: PickupSchedule['status']): Promise<PickupSchedule> {
    await delay(150);
    let updated: PickupSchedule | undefined;
    updateDemoState(state => {
      const schedule = state.schedules.find(item => item.id === id);
      if (!schedule) return;
      schedule.status = status;
      updated = { ...schedule };
      if (status === 'confirmed') {
        state.notifications.unshift({
          id: `NOTIF-${Date.now()}`,
          userId: farmerUserId(schedule.farmerId),
          title: 'Jadwal Setoran Dikonfirmasi',
          message: `Jadwal ${schedule.id} telah dikonfirmasi oleh DAI.`,
          type: 'success',
          category: 'transaksi',
          isRead: false,
          createdAt: new Date().toISOString(),
          link: '/dashboard/petani/setor-gabah',
        });
      }
    });
    if (!updated) throw new Error('Jadwal tidak ditemukan');
    return updated;
  },
};
