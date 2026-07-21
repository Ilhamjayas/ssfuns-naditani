'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { daiService } from '@/lib/services/dai.service';
import { WarehouseStock, ProductionBatch } from '@/lib/types';
import { Package, Inbox, Activity, CheckCircle2 } from 'lucide-react';

export default function OperatorDAIDashboard() {
  const [stock, setStock] = useState<WarehouseStock[]>([]);
  const [batches, setBatches] = useState<ProductionBatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const daiId = 'DAI-01'; // Defaulting to DAI-01 for demo purposes
        const [fetchedStock, fetchedBatches] = await Promise.all([
          daiService.getWarehouseStock(daiId),
          daiService.getBatches(daiId),
        ]);
        setStock(fetchedStock);
        setBatches(fetchedBatches);
      } catch (error) {
        console.error('Failed to load DAI dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadData();
  }, []);

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Memuat data...</div>;
  }

  const activeBatches = batches.filter(b => b.status !== 'completed' && b.status !== 'cancelled');
  const totalStockKg = stock.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-hijau-tua">Dashboard Operator DAI</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stok Gudang</CardTitle>
            <Package className="h-4 w-4 text-hijau-pertanian" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStockKg.toLocaleString('id-ID')} kg</div>
            <p className="text-xs text-muted-foreground mt-1">Total berat semua stok</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Batch Aktif</CardTitle>
            <Activity className="h-4 w-4 text-hijau-pertanian" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeBatches.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Sedang diproses</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gabah Masuk</CardTitle>
            <Inbox className="h-4 w-4 text-hijau-pertanian" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Data Demo</div>
            <p className="text-xs text-muted-foreground mt-1">Menunggu verifikasi</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Batch Selesai</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-hijau-pertanian" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{batches.filter(b => b.status === 'completed').length}</div>
            <p className="text-xs text-muted-foreground mt-1">Total batch selesai</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Batch Produksi Terkini</CardTitle>
          </CardHeader>
          <CardContent>
            {activeBatches.length === 0 ? (
              <p className="text-sm text-gray-500">Tidak ada batch aktif.</p>
            ) : (
              <div className="space-y-4">
                {activeBatches.map(batch => (
                  <div key={batch.id} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-semibold text-sm">{batch.id}</p>
                      <p className="text-xs text-gray-500">Status: {batch.status}</p>
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

        <Card>
          <CardHeader>
            <CardTitle>Rincian Stok Gudang</CardTitle>
          </CardHeader>
          <CardContent>
            {stock.length === 0 ? (
              <p className="text-sm text-gray-500">Gudang kosong.</p>
            ) : (
              <div className="space-y-4">
                {stock.map(item => (
                  <div key={item.id} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
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
