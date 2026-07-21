'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/ui/StatCard';
import { Wallet, Sprout, TrendingUp, CloudRain } from 'lucide-react';
import { farmerService } from '@/lib/services/farmer.service';
import { walletService } from '@/lib/services/wallet.service';
import { formatRupiah } from '@/lib/utils/format';
import { Skeleton } from '@/components/ui/skeleton';
import { FarmerProfile, WalletAccount, FarmerDashboardData } from '@/lib/types';

export default function PetaniDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<FarmerDashboardData | null>(null);
  const [walletData, setWalletData] = useState<WalletAccount | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Hardcoded simulation user ID for now
        const farmerId = 'PTN-240017';
        const [dashData, wallData] = await Promise.all([
          farmerService.getFarmerDashboard(farmerId),
          walletService.getWalletBalance(farmerId)
        ]);
        
        setDashboardData(dashData);
        setWalletData(wallData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-nadi-tua">Dashboard Petani</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
          <h1 className="text-2xl font-bold text-nadi-tua">Halo, {dashboardData?.profile?.nama}!</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Selamat datang di Dashboard Petani NADI-TANI. (Data Demo)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  }) : '-'}
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
                <p className="text-xs text-muted-foreground mb-2">25 Juli 2026</p>
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
    </div>
  );
}
