import { Notification } from '../types';
import { mockNotifications } from '../data/notifications';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const notificationService = {
  async getNotifications(userId?: string): Promise<Notification[]> {
    await delay(300);
    if (userId) {
      return mockNotifications.filter(n => n.userId === userId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return [...mockNotifications].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },
  
  async getUnreadCount(userId: string): Promise<number> {
    await delay(200);
    return mockNotifications.filter(n => n.userId === userId && !n.isRead).length;
  },
  
  async markAsRead(id: string): Promise<void> {
    await delay(300);
    // In a real app, we would update the backend
    const notif = mockNotifications.find(n => n.id === id);
    if (notif) {
      notif.isRead = true;
    }
  },
  
  async markAllAsRead(userId: string): Promise<void> {
    await delay(400);
    mockNotifications.forEach(n => {
      if (n.userId === userId) {
        n.isRead = true;
      }
    });
  }
};
