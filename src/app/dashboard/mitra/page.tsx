'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/ui/StatCard';
import { ShoppingBag, Truck, PackageCheck, CircleDollarSign } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { formatRupiah } from '@/lib/utils/format';

export default function MitraDashboardPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading mock data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Dashboard Mitra</h1>
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
          <h1 className="text-2xl font-bold text-slate-800">Dashboard Mitra Industri</h1>
          <p className="text-slate-500">Kelola pesanan dan pembelian hasil pascapanen NADI-TANI</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Pembelian (Bulan Ini)"
          value={formatRupiah(145000000)}
          icon={CircleDollarSign}
          trend="+15%"
          color="text-primary-600"
        />
        <StatCard
          title="Pesanan Aktif"
          value="4"
          icon={ShoppingBag}
          description="Pesanan sedang diproses"
          color="text-info"
        />
        <StatCard
          title="Dalam Pengiriman"
          value="2"
          icon={Truck}
          color="text-warning"
        />
        <StatCard
          title="Selesai Dikirim"
          value="18"
          icon={PackageCheck}
          description="Dalam 30 hari terakhir"
          color="text-success"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Daftar Pesanan Terbaru</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500">
                  <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 rounded-tl-lg">ID Pesanan</th>
                      <th className="px-4 py-3">Produk</th>
                      <th className="px-4 py-3">Jumlah</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 rounded-tr-lg text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { id: 'ORD-0921', product: 'Beras Premium Ngawi', qty: '5 Ton', status: 'processing', total: 72500000 },
                      { id: 'ORD-0922', product: 'Briket Sekam Padi', qty: '1 Ton', status: 'shipped', total: 4500000 },
                      { id: 'ORD-0918', product: 'Bekatul Stabil', qty: '500 Kg', status: 'delivered', total: 2000000 },
                      { id: 'ORD-0915', product: 'Beras Medium', qty: '2 Ton', status: 'delivered', total: 24000000 }
                    ].map((order, idx) => (
                      <tr key={idx} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 font-medium text-slate-900">{order.id}</td>
                        <td className="px-4 py-3">{order.product}</td>
                        <td className="px-4 py-3">{order.qty}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium
                            ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : 
                              order.status === 'shipped' ? 'bg-yellow-100 text-yellow-700' : 
                              'bg-blue-100 text-blue-700'}`}>
                            {order.status === 'delivered' ? 'Selesai' : order.status === 'shipped' ? 'Dikirim' : 'Diproses'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-medium">{formatRupiah(order.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Profil Kemitraan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <h4 className="text-sm font-semibold text-slate-800">PT. Pangan Nusantara</h4>
                  <p className="text-xs text-slate-500 mt-1">Mitra B2B Terverifikasi</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Level Kemitraan</span>
                    <span className="font-semibold text-gold-dark">Platinum</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Batas Kredit</span>
                    <span className="font-semibold text-slate-700">{formatRupiah(500000000)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Tempo Pembayaran</span>
                    <span className="font-semibold text-slate-700">30 Hari</span>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100">
                  <h4 className="text-sm font-semibold text-slate-800 mb-3">Produk Favorit</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs px-2 py-1 bg-primary-50 text-primary-700 rounded-md">Beras Premium</span>
                    <span className="text-xs px-2 py-1 bg-primary-50 text-primary-700 rounded-md">Briket Sekam</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
