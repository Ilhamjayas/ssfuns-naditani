'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/ui/StatCard';
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CloudRain,
  History,
  MapPin,
  PlayCircle,
  Scale,
  Sprout,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import { farmerService } from '@/lib/services/farmer.service';
import { walletService } from '@/lib/services/wallet.service';
import { transactionService } from '@/lib/services/transaction.service';
import { formatRupiah } from '@/lib/utils/format';
import { useAuth } from '@/lib/auth/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { WalletAccount, FarmerDashboardData, DepositTransaction } from '@/lib/types';

export default function PetaniDashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<FarmerDashboardData | null>(null);
  const [walletData, setWalletData] = useState<WalletAccount | null>(null);
  const [latestTransaction, setLatestTransaction] = useState<DepositTransaction | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const farmerId = user?.id || 'PTN-240017';
        const [dashData, wallData, transactions] = await Promise.all([
          farmerService.getFarmerDashboard(farmerId),
          walletService.getWalletBalance(farmerId),
          transactionService.getTransactions(farmerId),
        ]);

        setDashboardData(dashData);
        setWalletData(wallData);
        setLatestTransaction(transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0] || null);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const farmerName = user?.name || dashboardData?.profile?.nama || 'Petani NADI-TANI';

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-nadi-tua">Dashboard Petani</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-nadi-tua">Halo, {farmerName}!</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Selamat datang di Dashboard Petani NADI-TANI. (Data Demo)
          </p>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
          Akun aktif dan terverifikasi
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-primary-800 via-primary-700 to-emerald-600 text-white shadow-lg">
          <div className="absolute -right-14 -top-16 h-48 w-48 rounded-full bg-white/10" />
          <div className="absolute -bottom-20 right-20 h-40 w-40 rounded-full bg-amber-300/10" />
          <CardContent className="relative p-6 sm:p-7">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-primary-50">
                  <CalendarDays className="h-4 w-4" />
                  Persiapan panen berikutnya
                </div>
                <h2 className="text-2xl font-extrabold sm:text-3xl">Panen diperkirakan 25 Agustus</h2>
                <p className="mt-2 flex items-center gap-2 text-sm text-primary-50">
                  <MapPin className="h-4 w-4" />
                  {dashboardData?.profile?.lokasi || 'Ngawi, Jawa Timur'} • {dashboardData?.profile?.luas_lahan || 0} Ha
                </p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4 text-left backdrop-blur-sm sm:text-right">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary-100">Estimasi hasil</p>
                <p className="mt-1 text-2xl font-extrabold">{dashboardData?.expectedYield?.toLocaleString('id-ID') || 0} kg</p>
              </div>
            </div>
            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between text-xs font-semibold text-primary-50">
                <span>Kesiapan musim panen</span>
                <span>78%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-black/15">
                <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-amber-300 to-yellow-200" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Aksi Cepat</CardTitle>
            <p className="text-xs text-muted-foreground">Lanjutkan aktivitas utama tanpa mencari menu.</p>
          </CardHeader>
          <CardContent className="grid gap-2">
            {[
              { label: 'Jadwalkan setor gabah', href: '/dashboard/petani/setor-gabah', icon: Scale, primary: true },
              { label: 'Coba simulasi ATM', href: '/simulasi-atm', icon: PlayCircle },
              { label: 'Lihat riwayat setoran', href: '/dashboard/petani/riwayat-setor', icon: History },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.label}
                  href={action.href}
                  className={`group flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5 hover:shadow-md ${
                    action.primary
                      ? 'border-primary-600 bg-primary-600 text-white hover:bg-primary-700'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-primary-200 hover:text-primary-700'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    {action.label}
                  </span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Saldo Tersedia"
          value={walletData ? formatRupiah(walletData.balance) : 'Rp 0'}
          icon={Wallet}
          trend="+12%"
          description="Total saldo dari penjualan gabah"
        />

        <StatCard
          title="Estimasi Panen"
          value={`${dashboardData?.expectedYield?.toLocaleString('id-ID') || 0} Kg`}
          icon={Sprout}
          description={`Luas lahan: ${dashboardData?.profile?.luas_lahan || 0} Ha`}
        />

        <StatCard
          title="Total Pendapatan"
          value={formatRupiah(dashboardData?.totalIncome || 0)}
          icon={TrendingUp}
          description="Simulasi pendapatan musim ini"
        />

        <StatCard
          title="Info Cuaca"
          value="Hujan Ringan"
          icon={CloudRain}
          description={dashboardData?.weatherAlert || "Waspada genangan air"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informasi Lahan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Lokasi</span>
                <span className="font-medium text-right">{dashboardData?.profile?.lokasi}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Luas Lahan</span>
                <span className="font-medium">{dashboardData?.profile?.luas_lahan} Hektar</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Status Sertifikasi</span>
                <span className="font-medium">Dalam Proses</span>
              </div>
              <div className="flex justify-between pb-2">
                <span className="text-muted-foreground">Tanggal Panen (Estimasi)</span>
                <span className="font-medium text-nadi-tani">
                  {dashboardData?.nextHarvest ? new Date(dashboardData.nextHarvest).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  }) : 'Belum ditentukan'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-nadi-muda/30 border-nadi-tani/20">
          <CardHeader>
            <CardTitle className="text-lg text-nadi-tua">Pengumuman (Simulasi)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <h4 className="font-semibold text-sm mb-1">Jadwal Pengambilan Pupuk Subsidi</h4>
                <p className="text-xs text-muted-foreground mb-2">25 Agustus 2026</p>
                <p className="text-sm">Silakan datang ke DAI terdekat untuk mengambil jatah pupuk subsidi bulan ini.</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <h4 className="font-semibold text-sm mb-1">Harga Gabah Kering Panen Naik</h4>
                <p className="text-xs text-muted-foreground mb-2">Hari ini</p>
                <p className="text-sm">Harga GKP hari ini tercatat naik menjadi Rp 6.800/kg. Segera jadwalkan setor gabah Anda.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden border-slate-200 shadow-sm">
        <CardHeader className="flex flex-row items-start justify-between gap-4 border-b border-slate-100 bg-slate-50/70 p-4 sm:p-6">
          <div>
            <CardTitle className="text-lg">Perjalanan Setoran Terakhir</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              {latestTransaction
                ? `${latestTransaction.id} • ${latestTransaction.berat_bersih.toLocaleString('id-ID')} kg • Grade ${latestTransaction.grade}`
                : 'Belum ada setoran yang tercatat'}
            </p>
          </div>
          <Link href="/dashboard/petani/riwayat-setor" className="hidden items-center gap-1 text-sm font-semibold text-primary-700 hover:text-primary-900 sm:flex">
            Lihat detail <ArrowRight className="h-4 w-4" />
          </Link>
        </CardHeader>
        <CardContent className="px-4 pb-6 pt-6 sm:px-6 sm:pb-7 sm:pt-8">
          <div className="relative grid gap-7 sm:grid-cols-3 sm:gap-4">
            <div className="absolute bottom-5 left-5 top-5 w-px bg-emerald-100 sm:hidden" aria-hidden="true" />
            <div className="absolute left-5 right-[17%] top-5 hidden h-px bg-emerald-100 sm:block" aria-hidden="true" />
            {[
              {
                title: 'Gabah diterima',
                detail: latestTransaction
                  ? new Date(latestTransaction.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })
                  : 'Menunggu setoran pertama',
                complete: Boolean(latestTransaction),
              },
              {
                title: 'Mutu terverifikasi',
                detail: latestTransaction && latestTransaction.kadar_air > 0
                  ? `Kadar air ${latestTransaction.kadar_air}% • Grade ${latestTransaction.grade}`
                  : 'Menunggu pemeriksaan mutu',
                complete: latestTransaction?.status === 'selesai',
              },
              {
                title: 'Dana masuk dompet',
                detail: latestTransaction?.status === 'selesai' && latestTransaction.nilai_transaksi > 0
                  ? `+${formatRupiah(latestTransaction.nilai_transaksi)}`
                  : 'Menunggu verifikasi operator',
                complete: latestTransaction?.status === 'selesai',
              },
            ].map((step, index) => (
              <div key={step.title} className="relative flex gap-3 sm:px-2">
                <div className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ring-4 ring-white ${step.complete ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <p className={`text-xs font-bold uppercase tracking-wider ${step.complete ? 'text-emerald-700' : 'text-slate-400'}`}>Tahap {index + 1}</p>
                  <p className="mt-1 font-bold text-slate-800">{step.title}</p>
                  <p className="mt-1 text-xs text-slate-500">{step.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
