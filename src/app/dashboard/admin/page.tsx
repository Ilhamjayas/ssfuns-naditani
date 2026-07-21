'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/ui/StatCard';
import { Activity, Users, Database, ShieldCheck, ArrowRight } from 'lucide-react';
import { analyticsService } from '@/lib/services/analytics.service';
import { Skeleton } from '@/components/ui/skeleton';
import { NationalStats } from '@/lib/types';
import { toast } from 'sonner';

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<NationalStats | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await analyticsService.getNationalStats();
        setStats(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Sistem Administrasi</h1>
          <p className="text-slate-500">Ringkasan status ekosistem NADI-TANI</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Pengguna"
          value={stats ? new Intl.NumberFormat('id-ID').format(stats.totalPetaniAktif + 500) : '0'}
          icon={Users}
          trend="+5.2%"
          color="text-primary-600"
        />
        <StatCard
          title="Sistem DAI Aktif"
          value="12"
          icon={Database}
          trend="+2"
          color="text-info"
        />
        <StatCard
          title="Transaksi Harian"
          value="1,432"
          icon={Activity}
          trend="+12%"
          color="text-success"
        />
        <StatCard
          title="Status Keamanan"
          value="Aman"
          icon={ShieldCheck}
          description="Semua sistem berjalan normal"
          color="text-gold-dark"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {[
                { time: '10 menit lalu', action: 'Penambahan mesin DAI di Ngawi', user: 'System' },
                { time: '1 jam lalu', action: 'Update harga HPP', user: 'Pemerintah' },
                { time: '2 jam lalu', action: 'Registrasi 50 petani baru', user: 'Operator' }
              ].map((act, i) => (
                <li key={i} className="flex justify-between items-center border-b border-slate-100 pb-3 last:border-0">
                  <div>
                    <p className="font-medium text-sm">{act.action}</p>
                    <p className="text-xs text-slate-500">Oleh: {act.user}</p>
                  </div>
                  <span className="text-xs text-slate-400">{act.time}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status Server</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Database</span>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">99.9% Uptime</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">API Gateway</span>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Optimal</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Storage (Blob)</span>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">68% Kapasitas</span>
              </div>
            </div>
            <button onClick={() => toast.info('Memuat log sistem lengkap...')} className="w-full mt-6 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center justify-center">
              Lihat Detail Log <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
