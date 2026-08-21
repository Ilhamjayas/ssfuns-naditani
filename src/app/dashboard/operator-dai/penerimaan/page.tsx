'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { transactionService } from '@/lib/services/transaction.service';
import { DepositTransaction, PickupSchedule } from '@/lib/types';
import { CalendarDays, CheckCircle2, FileCheck2, MapPin, Truck, X } from 'lucide-react';
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
  const [selectedTransaction, setSelectedTransaction] = useState<DepositTransaction | null>(null);

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

  useEffect(() => {
    if (!selectedTransaction) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedTransaction(null);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [selectedTransaction]);

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

                      {trx.status === 'selesai' || trx.status === 'dibatalkan' ? (
                        <Button
                          type="button"
                          onClick={() => setSelectedTransaction(trx)}
                          variant={trx.status === 'dibatalkan' ? 'outline' : 'primary'}
                          className={`w-full md:w-auto ${trx.status === 'dibatalkan' ? 'border-red-200 text-red-700 hover:bg-red-50' : 'bg-emerald-700 text-white hover:bg-emerald-800'}`}
                        >
                          <FileCheck2 className="mr-2 h-4 w-4" />
                          {trx.status === 'selesai' ? 'Lihat Bukti Verifikasi' : 'Lihat Rincian Penolakan'}
                        </Button>
                      ) : (
                        <div className="flex gap-2 w-full md:w-auto">
                          <Button type="button" onClick={() => void handleTolak(trx.id)} variant="outline" className="flex-1 md:flex-none border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
                            Tolak
                          </Button>
                          <Button type="button" onClick={() => void handleVerifikasi(trx.id)} className="flex-1 md:flex-none bg-hijau-pertanian hover:bg-hijau-tua">
                            Verifikasi
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {selectedTransaction && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <button type="button" aria-label="Tutup rincian transaksi" onClick={() => setSelectedTransaction(null)} className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm" />
          <div role="dialog" aria-modal="true" aria-labelledby="transaction-detail-title" className="relative z-10 max-h-[calc(100dvh-2rem)] w-full max-w-xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className={`rounded-t-3xl p-5 text-white sm:p-6 ${selectedTransaction.status === 'selesai' ? 'bg-gradient-to-r from-emerald-900 to-emerald-700' : 'bg-gradient-to-r from-red-800 to-rose-700'}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/75">{selectedTransaction.status === 'selesai' ? 'Bukti Verifikasi Digital' : 'Rincian Penolakan'}</p>
                  <h2 id="transaction-detail-title" className="mt-1 break-all text-xl font-black sm:text-2xl">{selectedTransaction.id}</h2>
                  <p className="mt-2 text-sm text-white/80">{new Date(selectedTransaction.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <button type="button" aria-label="Tutup rincian transaksi" onClick={() => setSelectedTransaction(null)} className="shrink-0 rounded-full bg-white/10 p-2 hover:bg-white/20"><X className="h-5 w-5" /></button>
              </div>
            </div>

            <div className="space-y-5 p-5 sm:p-6">
              <div className={`flex items-center gap-3 rounded-2xl border p-4 ${selectedTransaction.status === 'selesai' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-red-200 bg-red-50 text-red-800'}`}>
                <CheckCircle2 className="h-6 w-6 shrink-0" />
                <div>
                  <p className="text-sm font-extrabold">{selectedTransaction.status === 'selesai' ? 'Transaksi telah terverifikasi' : 'Transaksi tidak diterima'}</p>
                  <p className="mt-0.5 text-xs opacity-80">Status tersimpan dan terhubung dengan riwayat akun petani.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {[
                  { label: 'ID Petani', value: selectedTransaction.farmerId },
                  { label: 'DAI', value: selectedTransaction.daiId },
                  { label: 'Grade', value: selectedTransaction.grade },
                  { label: 'Berat Kotor', value: `${selectedTransaction.berat_kotor.toLocaleString('id-ID')} kg` },
                  { label: 'Berat Bersih', value: `${selectedTransaction.berat_bersih.toLocaleString('id-ID')} kg` },
                  { label: 'Kadar Air', value: `${selectedTransaction.kadar_air}%` },
                ].map(item => (
                  <div key={item.label} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{item.label}</p>
                    <p className="mt-1 break-words text-sm font-extrabold text-slate-800">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-semibold text-amber-900">Nilai Transaksi</span>
                  <strong className="text-lg text-amber-900 sm:text-xl">{formatCurrency(selectedTransaction.nilai_transaksi)}</strong>
                </div>
                <p className="mt-2 text-xs text-amber-800">Harga acuan {formatCurrency(selectedTransaction.harga_per_kg)} per kg.</p>
              </div>

              {selectedTransaction.notes && (
                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Catatan Operator</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{selectedTransaction.notes}</p>
                </div>
              )}

              <Button type="button" onClick={() => setSelectedTransaction(null)} className="h-11 w-full bg-slate-800 text-white hover:bg-slate-900">Tutup Rincian</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
