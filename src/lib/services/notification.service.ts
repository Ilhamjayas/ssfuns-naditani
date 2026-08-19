import { Notification } from '../types';
import { getDemoState, updateDemoState } from '../demo/demo-store';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const notificationService = {
  async getNotifications(userId?: string): Promise<Notification[]> {
    await delay(300);
    if (!userId) return [];
    const acceptedIds = userId === 'user-petani-1' ? ['user-petani-1', 'user-1'] : [userId];
    return getDemoState().notifications.filter(n => acceptedIds.includes(n.userId))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getUnreadCount(userId: string): Promise<number> {
    await delay(200);
    const acceptedIds = userId === 'user-petani-1' ? ['user-petani-1', 'user-1'] : [userId];
    return getDemoState().notifications.filter(n => acceptedIds.includes(n.userId) && !n.isRead).length;
  },

  async markAsRead(id: string): Promise<void> {
    await delay(300);
    updateDemoState(state => {
      const notif = state.notifications.find(n => n.id === id);
      if (notif) notif.isRead = true;
    });
  },

  async markAllAsRead(userId: string): Promise<void> {
    await delay(400);
    const acceptedIds = userId === 'user-petani-1' ? ['user-petani-1', 'user-1'] : [userId];
    updateDemoState(state => {
      state.notifications.forEach(n => {
        if (acceptedIds.includes(n.userId)) n.isRead = true;
      });
    });
  }
};
