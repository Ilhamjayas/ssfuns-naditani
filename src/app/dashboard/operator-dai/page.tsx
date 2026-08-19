'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { daiService } from '@/lib/services/dai.service';
import { WarehouseStock, ProductionBatch } from '@/lib/types';
import { Package, Inbox, Activity, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { transactionService } from '@/lib/services/transaction.service';
import { StatCard } from '@/components/ui/StatCard';

export default function OperatorDAIDashboard() {
  const { user } = useAuth();
  const [stock, setStock] = useState<WarehouseStock[]>([]);
  const [batches, setBatches] = useState<ProductionBatch[]>([]);
  const [incomingCount, setIncomingCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const daiId = user?.id || 'DAI-01'; // Defaulting to DAI-01 for demo purposes
        const [fetchedStock, fetchedBatches, fetchedTransactions] = await Promise.all([
          daiService.getWarehouseStock(daiId),
          daiService.getBatches(daiId),
          transactionService.getTransactions()
        ]);

        const daiTransactions = fetchedTransactions.filter(t => t.daiId === daiId || t.daiId === 'DAI-NGW-01');
        const activeCount = daiTransactions.filter(t => t.status === 'menunggu_pembayaran' || t.status === 'sedang_diproses').length;

        setStock(fetchedStock);
        setBatches(fetchedBatches);
        setIncomingCount(activeCount);
      } catch (error) {
        console.error('Failed to load DAI dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [user?.id]);

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Memuat data...</div>;
  }

  const activeBatches = batches.filter(b => b.status !== 'completed' && b.status !== 'cancelled');
  const totalStockKg = stock.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-hijau-tua">Dashboard Operator DAI</h1>
          <p className="mt-1 text-sm text-slate-500">Pantau penerimaan, stok gudang, dan proses produksi dalam satu tampilan.</p>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700">
          <span className="h-2 w-2 rounded-full bg-emerald-500" /> Operasional aktif
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Stok Gudang" value={`${totalStockKg.toLocaleString('id-ID')} kg`} icon={Package} description="Total berat semua stok" color="text-emerald-700" />
        <StatCard title="Batch Aktif" value={activeBatches.length} icon={Activity} description="Sedang diproses" color="text-blue-700" />
        <StatCard title="Gabah Masuk" value={incomingCount} icon={Inbox} description="Menunggu verifikasi" color="text-amber-700" />
        <StatCard title="Batch Selesai" value={batches.filter(b => b.status === 'completed').length} icon={CheckCircle2} description="Total batch selesai" color="text-violet-700" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="overflow-hidden border-slate-200 shadow-sm">
          <CardHeader className="border-b border-slate-100 bg-slate-50/70">
            <CardTitle>Batch Produksi Terkini</CardTitle>
          </CardHeader>
          <CardContent>
            {activeBatches.length === 0 ? (
              <p className="text-sm text-gray-500">Tidak ada batch aktif.</p>
            ) : (
              <div className="space-y-4">
                {activeBatches.map(batch => (
                  <div key={batch.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-emerald-300">
                    <div className="min-w-0">
                      <p className="font-semibold text-sm">{batch.id}</p>
                      <span className="mt-1 inline-flex rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-700">
                        {batch.status === 'drying' ? 'Pengeringan' : batch.status === 'milling' ? 'Penggilingan' : batch.status}
                      </span>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-medium">{batch.initialWeight.toLocaleString('id-ID')} Kg</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-slate-200 shadow-sm">
          <CardHeader className="border-b border-slate-100 bg-slate-50/70">
            <CardTitle>Rincian Stok Gudang</CardTitle>
          </CardHeader>
          <CardContent>
            {stock.length === 0 ? (
              <p className="text-sm text-gray-500">Gudang kosong.</p>
            ) : (
              <div className="space-y-4">
                {stock.map(item => (
                  <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-emerald-300">
                    <div className="min-w-0">
                      <p className="font-semibold text-sm">{item.itemType === 'gabah' ? 'Gabah Kering Panen' : item.itemType === 'beras_premium' ? 'Beras Premium' : item.itemType === 'beras_medium' ? 'Beras Medium' : item.itemType}</p>
                      <p className="text-xs text-gray-500">Item: {item.itemType}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{item.quantity.toLocaleString('id-ID')} kg</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
