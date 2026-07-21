"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { notificationService } from '@/lib/services/notification.service';
import { Notification } from '@/lib/types';
import { formatDateTime, getRelativeTime } from '@/lib/utils/format';
import { Bell, Check, Info, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function NotificationPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Semua');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await notificationService.getNotifications();
        setNotifications(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    await notificationService.markAsRead(id);
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const filteredNotifs = filter === 'Semua' 
    ? notifications 
    : notifications.filter(n => n.category === filter);

  const getIcon = (type: string) => {
    switch(type) {
      case 'info': return <Info className="w-5 h-5 text-info" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-warning" />;
      case 'success': return <CheckCircle className="w-5 h-5 text-success" />;
      case 'danger': return <AlertTriangle className="w-5 h-5 text-danger" />;
      default: return <Bell className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pt-20">
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
              {['Semua', 'Transaksi', 'Pertanian', 'Cuaca', 'Subsidi', 'Edukasi', 'Sistem'].map(cat => (
                <Button 
                  key={cat}
                  variant={filter === cat ? 'primary' : 'ghost'}
                  onClick={() => setFilter(cat)}
                  className={`rounded-full px-4 h-9 ${filter === cat ? 'bg-primary-600 text-white hover:bg-primary-700' : 'text-slate-600'}`}
                >
                  {cat}
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
                      
                      <div className="flex justify-between items-center">
                        <Badge variant="outline" className="text-xs bg-white text-slate-500 capitalize">
                          {notif.category}
                        </Badge>
                        
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
    </div>
  );
}
