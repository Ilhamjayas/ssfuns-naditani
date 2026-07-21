'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { transactionService } from '@/lib/services/transaction.service';
import { DepositTransaction } from '@/lib/types';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

export default function PenerimaanPage() {
  const [transactions, setTransactions] = useState<DepositTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await transactionService.getTransactions();
        // Mock filtering for ones that need operator attention, 
        // e.g., anything that is pending or we just show all for demo
        setTransactions(data);
      } catch (error) {
        console.error('Failed to load transactions:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-6">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="w-full md:w-2/3">
                  <div className="flex items-center gap-2 mb-4">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-5 w-24 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-48 mb-2" />
                  <Skeleton className="h-4 w-64 mb-4" />
                  <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
                <div className="w-full md:w-1/3 flex flex-col justify-between items-end border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6">
                  <div className="text-right w-full flex flex-col items-end">
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-8 w-40" />
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Skeleton className="h-10 w-20" />
                    <Skeleton className="h-10 w-24" />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleVerifikasi = (id: string) => {
    setTransactions(transactions.map(t => t.id === id ? { ...t, status: 'selesai' as const } : t));
  };

  const handleTolak = (id: string) => {
    // For demo, we just remove it or change status. Let's remove it from view.
    setTransactions(transactions.filter(t => t.id !== id));
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-2xl font-bold text-hijau-tua">Penerimaan Gabah</h1>
        <p className="text-gray-500 mt-1">Daftar transaksi masuk yang memerlukan verifikasi dari ATM Gabah Mandiri.</p>
      </motion.div>
      
      <div className="grid grid-cols-1 gap-4">
        {transactions.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="p-8 text-center text-gray-500">
              Tidak ada data penerimaan saat ini.
            </CardContent>
          </Card>
        ) : (
          transactions.map((trx, index) => (
            <motion.div
              key={trx.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-md transition-shadow group border border-slate-100 rounded-xl overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="p-5 md:p-6 w-full md:w-2/3">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="font-bold text-lg text-slate-900">{trx.id}</span>
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                          trx.status === 'selesai' ? 'bg-green-100 text-green-700 border border-green-200' :
                          trx.status === 'menunggu_pembayaran' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                          'bg-blue-100 text-blue-700 border border-blue-200'
                        }`}>
                          {trx.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="space-y-1 mb-5">
                        <p className="text-sm text-slate-500 flex items-center gap-2">
                          <span className="w-16">ID Petani</span>
                          <span className="font-medium text-slate-700">{trx.farmerId}</span>
                        </p>
                        <p className="text-sm text-slate-500 flex items-center gap-2">
                          <span className="w-16">Tanggal</span>
                          <span className="text-slate-700">
                            {new Date(trx.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </p>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-100/60">
                        <div>
                          <p className="text-xs text-slate-500 mb-0.5">Berat Kotor</p>
                          <p className="font-semibold text-slate-700">{trx.berat_kotor} kg</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 mb-0.5">Kadar Air</p>
                          <p className="font-semibold text-slate-700">{trx.kadar_air}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 mb-0.5">Berat Bersih</p>
                          <p className="font-semibold text-slate-700">{trx.berat_bersih} kg</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 mb-0.5">Grade</p>
                          <p className="font-semibold text-hijau-pertanian">{trx.grade}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-5 md:p-6 w-full md:w-1/3 flex flex-col justify-between items-start md:items-end bg-slate-50/50 md:bg-transparent border-t md:border-t-0 md:border-l border-slate-100">
                      <div className="text-left md:text-right mb-5 w-full">
                        <p className="text-sm text-slate-500 mb-1">Nilai Transaksi</p>
                        <p className="text-2xl font-bold text-emas-padi">{formatCurrency(trx.nilai_transaksi)}</p>
                      </div>
                      
                      <div className="flex gap-2 w-full md:w-auto">
                        <Button onClick={() => handleTolak(trx.id)} variant="outline" className="flex-1 md:flex-none border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
                          Tolak
                        </Button>
                        <Button onClick={() => handleVerifikasi(trx.id)} className="flex-1 md:flex-none bg-hijau-pertanian hover:bg-hijau-tua">
                          Verifikasi
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
