'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { transactionService } from '@/lib/services/transaction.service';
import { DepositTransaction, PickupSchedule } from '@/lib/types';
import { CalendarDays, CheckCircle2, MapPin, Truck } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { scheduleService } from '@/lib/services/schedule.service';
import { useAuth } from '@/lib/auth/AuthContext';

export default function PenerimaanPage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<DepositTransaction[]>([]);
  const [schedules, setSchedules] = useState<PickupSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [data, scheduleData] = await Promise.all([
          transactionService.getTransactions(),
          scheduleService.getSchedules(),
        ]);
        setTransactions(data);
        setSchedules(scheduleData);
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

  const handleVerifikasi = async (id: string) => {
    const verified = await transactionService.verifyTransaction(id, user?.id);
    if (!verified) {
      toast.error('Transaksi tidak ditemukan');
      return;
    }
    setTransactions(current => current.map(transaction => transaction.id === id ? verified : transaction));
    toast.success('Verifikasi tersimpan. Dompet petani dan stok DAI telah diperbarui');
  };

  const handleTolak = async (id: string) => {
    const rejected = await transactionService.rejectTransaction(id, user?.id);
    if (rejected) {
      setTransactions(current => current.map(transaction => transaction.id === id ? rejected : transaction));
      toast.error('Transaksi ditolak dan statusnya tersimpan');
    }
  };

  const handleConfirmSchedule = async (id: string) => {
    const updated = await scheduleService.updateStatus(id, 'confirmed');
    if (updated) {
      setSchedules(current => current.map(schedule => schedule.id === id ? updated : schedule));
      toast.success('Jadwal telah dikonfirmasi dan dapat dilihat oleh petani');
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-2xl font-bold text-hijau-tua">Penerimaan Gabah</h1>
        <p className="text-gray-500 mt-1">Daftar transaksi masuk yang memerlukan verifikasi dari ATM Gabah Mandiri.</p>
      </motion.div>

      <Card className="overflow-hidden border-emerald-100">
        <CardHeader className="border-b border-emerald-100 bg-emerald-50/60">
          <CardTitle className="flex items-center gap-2 text-lg text-slate-800">
            <CalendarDays className="h-5 w-5 text-emerald-700" /> Permintaan Jadwal Setoran
          </CardTitle>
          <CardDescription>Jadwal dari akun petani masuk ke sini untuk dikonfirmasi operator DAI.</CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          {schedules.length === 0 ? (
            <p className="py-4 text-center text-sm text-slate-500">Belum ada permintaan jadwal.</p>
          ) : (
            <div className="grid gap-3 lg:grid-cols-2">
              {schedules.slice(0, 4).map(schedule => (
                <div key={schedule.id} className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="flex flex-col items-start justify-between gap-2 min-[400px]:flex-row min-[400px]:gap-3">
                    <div className="min-w-0">
                      <p className="break-all text-xs font-bold uppercase tracking-wide text-emerald-700">{schedule.id}</p>
                      <p className="mt-1 font-semibold text-slate-800">
                        {new Date(schedule.scheduledDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${schedule.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : schedule.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                      {schedule.status === 'confirmed' ? 'Dikonfirmasi' : schedule.status === 'cancelled' ? 'Dibatalkan' : schedule.status === 'completed' ? 'Selesai' : 'Menunggu'}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-600">
                    <span className="inline-flex items-center gap-1.5"><Truck className="h-3.5 w-3.5" />{schedule.method === 'jemput' ? 'Penjemputan' : 'Antar mandiri'}</span>
                    <span className="font-semibold">{schedule.estimatedWeight.toLocaleString('id-ID')} kg</span>
                  </div>
                  <p className="mt-2 flex items-start gap-1.5 text-xs text-slate-500"><MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />{schedule.pickupLocation || 'Lokasi sedang dikonfirmasi'}</p>
                  {schedule.status === 'pending' && (
                    <Button onClick={() => void handleConfirmSchedule(schedule.id)} size="sm" className="mt-4 w-full bg-emerald-700 hover:bg-emerald-800">
                      <CheckCircle2 className="mr-2 h-4 w-4" /> Konfirmasi Jadwal
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

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
                      <div className="mb-3 flex flex-wrap items-center gap-2 sm:gap-3">
                        <span className="break-all text-base font-bold text-slate-900 sm:text-lg">{trx.id}</span>
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
                        <p className="flex items-start gap-2 text-sm text-slate-500">
                          <span className="w-16 shrink-0">Tanggal</span>
                          <span className="min-w-0 text-slate-700">
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
                        <p className="break-words text-xl font-bold text-emas-padi sm:text-2xl">{formatCurrency(trx.nilai_transaksi)}</p>
                      </div>

                      <div className="flex gap-2 w-full md:w-auto">
                        <Button onClick={() => void handleTolak(trx.id)} disabled={trx.status === 'selesai' || trx.status === 'dibatalkan'} variant="outline" className="flex-1 md:flex-none border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
                          Tolak
                        </Button>
                        <Button onClick={() => void handleVerifikasi(trx.id)} disabled={trx.status === 'selesai' || trx.status === 'dibatalkan'} className="flex-1 md:flex-none bg-hijau-pertanian hover:bg-hijau-tua">
                          {trx.status === 'selesai' ? 'Terverifikasi' : trx.status === 'dibatalkan' ? 'Ditolak' : 'Verifikasi'}
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
