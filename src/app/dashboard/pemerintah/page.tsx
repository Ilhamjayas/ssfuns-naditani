'use client';

import React, { useEffect, useState } from 'react';
import { analyticsService } from '@/lib/services/analytics.service';
import { StatCard } from '@/components/ui/StatCard';
import { Users, LandPlot, Wheat, PackageCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { NationalStats } from '@/lib/types';

export default function PemerintahDashboard() {
  const [stats, setStats] = useState<NationalStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await analyticsService.getNationalStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to load national stats", error);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-5 w-80" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!stats) {
    return <div className="p-8 text-center text-red-500">Gagal memuat data.</div>;
  }

  // format functions
  const formatNumber = (num: number) => new Intl.NumberFormat('id-ID').format(num);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-hijauTua sm:text-3xl">Dashboard Pemerintah</h1>
          <p className="text-muted-foreground mt-1">Ringkasan Statistik Pangan Nasional (Simulasi)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Petani Aktif"
          value={formatNumber(stats.totalPetaniAktif)}
          icon={Users}
          color="text-blue-600 bg-blue-100"
          description="Terdaftar di platform"
          index={0}
        />
        <StatCard
          title="Luas Lahan (Ha)"
          value={formatNumber(stats.luasLahan)}
          icon={LandPlot}
          color="text-emerald-700 bg-emerald-100"
          description="Total area panen"
          index={1}
        />
        <StatCard
          title="Produksi GKG (Ton)"
          value={formatNumber(stats.produksiGKG)}
          icon={Wheat}
          color="text-amber-700 bg-amber-100"
          description="Gabah Kering Giling"
          index={2}
        />
        <StatCard
          title="Produksi Beras (Ton)"
          value={formatNumber(stats.produksiBeras)}
          icon={PackageCheck}
          color="text-violet-700 bg-violet-100"
          description="Estimasi beras"
          index={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">Peta Pasokan & Distribusi</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Analisis geospasial pasokan beras, jumlah petani, dan distribusi DAI di berbagai provinsi (Data Demo).
            </p>
          </div>
          <Link href="/dashboard/pemerintah/peta-pasokan" className="inline-flex h-10 w-full items-center justify-center rounded-xl bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 sm:w-fit">
            Lihat Peta
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">Proyeksi NTP</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Nilai Tukar Petani dan prediksinya menggunakan model LSTM berbasis data historis (Simulasi).
            </p>
          </div>
          <Link href="/dashboard/pemerintah/proyeksi-ntp" className="inline-flex h-10 w-full items-center justify-center rounded-xl bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 sm:w-fit">
            Lihat Proyeksi
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
