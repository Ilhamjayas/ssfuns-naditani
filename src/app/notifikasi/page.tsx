"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { notificationService } from '@/lib/services/notification.service';
import { Notification } from '@/lib/types';
import { getRelativeTime } from '@/lib/utils/format';
import { Bell, Check, Info, AlertTriangle, CheckCircle, ArrowRight, X } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/lib/auth/AuthContext';
import { useRouter } from 'next/navigation';

const notificationFilters = [
  { label: 'Semua', value: 'semua' },
  { label: 'Transaksi', value: 'transaksi' },
  { label: 'Pertanian', value: 'pertanian' },
  { label: 'Cuaca', value: 'cuaca' },
  { label: 'Subsidi', value: 'subsidi' },
  { label: 'Edukasi', value: 'edukasi' },
  { label: 'Sistem', value: 'sistem' },
] as const;

export default function NotificationPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('semua');
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const requestedFilter = new URLSearchParams(window.location.search).get('filter');
      if (requestedFilter && notificationFilters.some(item => item.value === requestedFilter)) setFilter(requestedFilter);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await notificationService.getNotifications(user?.id);
        setNotifications(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (!isAuthLoading) void fetchData();
  }, [isAuthLoading, user?.id]);

  const handleMarkAsRead = async (id: string) => {
    await notificationService.markAsRead(id);
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const openRelatedInformation = (notification: Notification) => {
    void handleMarkAsRead(notification.id);
    setSelectedNotification(null);
    if (!notification.link) return;
    if (notification.link.startsWith('/notifikasi?')) {
      const requestedFilter = new URLSearchParams(notification.link.split('?')[1]).get('filter');
      if (requestedFilter && notificationFilters.some(item => item.value === requestedFilter)) setFilter(requestedFilter);
    }
    router.push(notification.link);
  };

  const filteredNotifs = filter === 'semua'
    ? notifications
    : notifications.filter(n => n.category === filter);

  const getIcon = (type: string) => {
    switch(type) {
      case 'info': return <Info className="w-5 h-5 text-info" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-warning" />;
      case 'success': return <CheckCircle className="w-5 h-5 text-success" />;
      case 'error': return <AlertTriangle className="w-5 h-5 text-danger" />;
      default: return <Bell className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 pt-16 sm:pt-20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-h2 font-bold text-slate-800">Notifikasi</h1>
            <p className="text-slate-500">Pusat informasi dan pemberitahuan penting</p>
          </div>
        </div>

        <Card className="mb-6">
          <CardContent className="p-0 border-b border-slate-100 overflow-x-auto">
            <div className="flex p-2 gap-2 min-w-max">
              {notificationFilters.map(cat => (
                <Button
                  key={cat.value}
                  variant={filter === cat.value ? 'primary' : 'ghost'}
                  onClick={() => setFilter(cat.value)}
                  className={`rounded-full px-4 h-9 ${filter === cat.value ? 'bg-primary-600 text-white hover:bg-primary-700' : 'text-slate-600'}`}
                >
                  {cat.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <Card key={i}>
                <CardContent className="p-4 flex items-start gap-4">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-1/3 mb-2" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotifs.length > 0 ? (
              filteredNotifs.map((notif) => (
                <Card
                  key={notif.id}
                  className={`transition-colors ${notif.isRead ? 'bg-white' : 'bg-primary-50 border-primary-200'}`}
                >
                  <CardContent className="p-4 sm:p-6 flex gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${notif.isRead ? 'bg-slate-100' : 'bg-white shadow-sm'}`}>
                        {getIcon(notif.type)}
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className={`font-bold ${notif.isRead ? 'text-slate-700' : 'text-slate-900'}`}>
                          {notif.title}
                        </h3>
                        <span className="text-xs text-slate-500 whitespace-nowrap ml-4">
                          {getRelativeTime(notif.createdAt)}
                        </span>
                      </div>
                      <p className={`text-sm mb-3 ${notif.isRead ? 'text-slate-500' : 'text-slate-700'}`}>
                        {notif.message}
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <Badge variant="outline" className="text-xs bg-white text-slate-500 capitalize">
                          {notif.category}
                        </Badge>

                        <div className="flex items-center gap-1">
                          {!notif.isRead && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMarkAsRead(notif.id)}
                              className="h-8 text-primary-600 hover:text-primary-800 hover:bg-primary-50 px-2"
                            >
                              <Check className="w-4 h-4 mr-1" /> Tandai Dibaca
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" onClick={() => setSelectedNotification(notif)} className="h-8 px-2 font-bold text-slate-600 hover:bg-slate-100">
                            Lihat Detail <ArrowRight className="ml-1 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-20 bg-white rounded-xl border border-slate-200 border-dashed">
                <Bell className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-700 mb-1">Tidak ada notifikasi</h3>
                <p className="text-slate-500">Anda belum memiliki notifikasi untuk kategori ini.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {selectedNotification && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <button type="button" aria-label="Tutup detail notifikasi" onClick={() => setSelectedNotification(null)} className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm" />
          <div role="dialog" aria-modal="true" aria-labelledby="notification-detail-title" className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 bg-slate-50 p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">{getIcon(selectedNotification.type)}</div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-primary-700">{selectedNotification.category}</p>
                  <h2 id="notification-detail-title" className="mt-1 text-xl font-extrabold text-slate-800">{selectedNotification.title}</h2>
                  <p className="mt-1 text-xs text-slate-500">{getRelativeTime(selectedNotification.createdAt)}</p>
                </div>
              </div>
              <button type="button" aria-label="Tutup detail notifikasi" onClick={() => setSelectedNotification(null)} className="rounded-full bg-white p-2 text-slate-500 shadow-sm hover:bg-slate-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-5 sm:p-6">
              <p className="text-sm leading-7 text-slate-600">{selectedNotification.message}</p>
              <div className="mt-6 flex flex-col-reverse gap-2 min-[420px]:flex-row">
                <Button variant="outline" onClick={() => setSelectedNotification(null)} className="flex-1">Tutup</Button>
                {selectedNotification.link && (
                  <Button onClick={() => openRelatedInformation(selectedNotification)} className="flex-1 bg-primary-700 text-white hover:bg-primary-800">
                    Buka Informasi Terkait <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
