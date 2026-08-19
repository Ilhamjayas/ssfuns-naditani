'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarDays, CheckCircle2, MapPin, Truck, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth/AuthContext';
import { scheduleService } from '@/lib/services/schedule.service';
import { PickupSchedule } from '@/lib/types';
import { canonicalFarmerId } from '@/lib/demo/demo-store';

export default function SetorGabahPage() {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [method, setMethod] = useState('antar'); // antar or jemput
  const [schedules, setSchedules] = useState<PickupSchedule[]>([]);
  const [createdSchedule, setCreatedSchedule] = useState<PickupSchedule | null>(null);
  const minimumScheduleDate = new Date().toLocaleDateString('en-CA');

  const [formData, setFormData] = useState({
    berat: '',
    tanggal: '',
    lokasi: 'Sawah Blok A, Ngawi', // Default
    catatan: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const loadSchedules = useCallback(async () => {
    const data = await scheduleService.getSchedules(user?.id);
    setSchedules(data);
  }, [user?.id]);

  useEffect(() => {
    const initialLoad = window.setTimeout(() => void loadSchedules(), 0);
    return () => window.clearTimeout(initialLoad);
  }, [loadSchedules]);

  const handleShowSchedules = () => {
    setIsSuccess(false);
    window.requestAnimationFrame(() => {
      document.getElementById('jadwal-saya')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const submittedForm = new FormData(e.currentTarget as HTMLFormElement);
    const selectedDate = String(submittedForm.get('tanggal') || formData.tanggal);
    const estimatedWeight = Number(submittedForm.get('berat') || formData.berat);

    try {
      if (!selectedDate) throw new Error('Pilih tanggal penyetoran terlebih dahulu');
      if (!Number.isFinite(estimatedWeight) || estimatedWeight <= 0) throw new Error('Estimasi berat harus lebih dari 0 kg');
      const schedule = await scheduleService.createSchedule({
        farmerId: canonicalFarmerId(user?.id),
        daiId: 'DAI-NGW-01',
        scheduledDate: new Date(`${selectedDate}T08:00:00+07:00`).toISOString(),
        estimatedWeight,
        method: method as 'antar' | 'jemput',
        pickupLocation: method === 'jemput' ? formData.lokasi : 'DAI Ngawi Barat',
        notes: formData.catatan,
      });
      setCreatedSchedule(schedule);
      await loadSchedules();
      setIsSuccess(true);
      toast.success("Jadwal setor gabah berhasil disimpan");
    } catch (error) {
      console.error('Gagal menyimpan jadwal setor gabah:', error);
      toast.error(error instanceof Error ? error.message : 'Gagal menyimpan jadwal setor gabah');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelSchedule = async (id: string) => {
    await scheduleService.updateStatus(id, 'cancelled');
    await loadSchedules();
    toast.success('Jadwal berhasil dibatalkan');
  };

  const resetForm = () => {
    setIsSuccess(false);
    setCreatedSchedule(null);
    toast.info("Membuat formulir jadwal baru");
    setFormData({
      berat: '',
      tanggal: '',
      lokasi: 'Sawah Blok A, Ngawi',
      catatan: ''
    });
  };

  if (isSuccess) {
    return (
      <div className="max-w-lg mx-auto mt-12">
        <Card className="text-center border-nadi-tani/30 shadow-sm">
          <CardContent className="pt-10 pb-8 flex flex-col items-center">
            <CheckCircle2 className="w-16 h-16 text-nadi-tani mb-4" />
            <h2 className="text-2xl font-bold text-nadi-tua mb-2">Jadwal Berhasil Dibuat</h2>
            <p className="text-muted-foreground mb-6">
              {method === 'jemput'
                ? 'Tim DAI akan menjemput gabah Anda sesuai jadwal. (Simulasi)'
                : 'Silakan antar gabah Anda ke DAI terdekat sesuai jadwal. (Simulasi)'}
            </p>
            <div className="bg-nadi-muda/30 w-full p-4 rounded-lg mb-6 text-sm text-left space-y-2">
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">ID Jadwal</span>
                <span className="font-semibold text-right">{createdSchedule?.id || 'Sedang dibuat'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Metode</span>
                <span className="font-medium">{method === 'jemput' ? 'Penjemputan' : 'Antar Mandiri'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estimasi Berat</span>
                <span className="font-medium">{createdSchedule?.estimatedWeight.toLocaleString('id-ID') || formData.berat} Kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tanggal</span>
                <span className="font-medium">
                  {createdSchedule?.scheduledDate
                    ? new Date(createdSchedule.scheduledDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
                    : 'Belum ditentukan'}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Status</span>
                <span className="rounded-full bg-amber-100 px-2 py-0.5 font-semibold text-amber-700">Menunggu konfirmasi</span>
              </div>
            </div>
            <div className="grid w-full gap-2 sm:grid-cols-2">
              <Button onClick={handleShowSchedules} variant="outline" className="w-full border-primary-200 text-primary-700">
                Lihat Jadwal Saya
              </Button>
              <Button onClick={resetForm} className="w-full bg-nadi-tani hover:bg-nadi-tua text-white">
                Buat Jadwal Baru
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-nadi-tua">Setor Gabah</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Jadwalkan penyetoran gabah Anda ke DAI.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Formulir Penyetoran</CardTitle>
            <CardDescription>Pilih metode yang paling memudahkan Anda.</CardDescription>
          </CardHeader>
          <CardContent>
          <Tabs defaultValue="antar" onValueChange={setMethod} className="w-full mb-6">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="antar" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Antar Mandiri
              </TabsTrigger>
              <TabsTrigger value="jemput" className="flex items-center gap-2">
                <Truck className="w-4 h-4" /> Penjemputan
              </TabsTrigger>
            </TabsList>

            <TabsContent value="antar" className="text-sm text-muted-foreground p-3 bg-slate-50 rounded-md border border-slate-100">
              Anda akan mengantar sendiri gabah ke lokasi DAI Ngawi.
            </TabsContent>
            <TabsContent value="jemput" className="text-sm text-muted-foreground p-3 bg-nadi-muda/30 rounded-md border border-nadi-tani/20 text-nadi-tua">
              Truk DAI akan menjemput gabah langsung ke lokasi lahan/rumah Anda.
            </TabsContent>
          </Tabs>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="berat">Estimasi Berat (Kg)</Label>
              <Input
                id="berat"
                name="berat"
                type="number"
                min="1"
                step="1"
                placeholder="Contoh: 2500"
                required
                value={formData.berat}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tanggal">Tanggal {method === 'jemput' ? 'Penjemputan' : 'Pengantaran'}</Label>
              <Input
                id="tanggal"
                name="tanggal"
                type="date"
                min={minimumScheduleDate}
                required
                value={formData.tanggal}
                onChange={handleChange}
              />
            </div>

            {method === 'jemput' && (
              <div className="space-y-2">
                <Label htmlFor="lokasi">Lokasi Penjemputan</Label>
                <Input
                  id="lokasi"
                  name="lokasi"
                  type="text"
                  required={method === 'jemput'}
                  value={formData.lokasi}
                  onChange={handleChange}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="catatan">Catatan Tambahan (Opsional)</Label>
              <Input
                id="catatan"
                name="catatan"
                type="text"
                placeholder="Contoh: Akses jalan sempit, mohon bawa pick up kecil"
                value={formData.catatan}
                onChange={handleChange}
              />
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full bg-nadi-tani hover:bg-nadi-tua text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Memproses...' : 'Jadwalkan Sekarang'}
              </Button>
            </div>
          </form>
          </CardContent>
        </Card>

        <Card id="jadwal-saya" className="h-fit overflow-hidden border-slate-200 shadow-sm">
          <CardHeader className="border-b border-slate-100 bg-slate-50/70">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CalendarDays className="h-5 w-5 text-primary-600" /> Jadwal Saya
            </CardTitle>
            <CardDescription>Jadwal tersimpan dan tetap terlihat setelah halaman dimuat ulang.</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            {schedules.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center">
                <CalendarDays className="mx-auto h-8 w-8 text-slate-300" />
                <p className="mt-3 text-sm font-semibold text-slate-700">Belum ada jadwal</p>
                <p className="mt-1 text-xs text-slate-500">Jadwal baru akan muncul di bagian ini.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {schedules.map(schedule => {
                  const statusLabel = {
                    pending: 'Menunggu konfirmasi',
                    confirmed: 'Dikonfirmasi DAI',
                    completed: 'Selesai',
                    cancelled: 'Dibatalkan',
                  }[schedule.status];
                  const statusClass = schedule.status === 'confirmed' || schedule.status === 'completed'
                    ? 'bg-emerald-100 text-emerald-700'
                    : schedule.status === 'cancelled'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-amber-100 text-amber-700';

                  return (
                    <div key={schedule.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-primary-700">{schedule.id}</p>
                          <p className="mt-1 font-bold text-slate-800">
                            {new Date(schedule.scheduledDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </p>
                        </div>
                        <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${statusClass}`}>{statusLabel}</span>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3 text-xs">
                        <div>
                          <p className="text-slate-500">Metode</p>
                          <p className="mt-1 font-semibold text-slate-700">{schedule.method === 'jemput' ? 'Penjemputan' : 'Antar mandiri'}</p>
                        </div>
                        <div>
                          <p className="text-slate-500">Estimasi</p>
                          <p className="mt-1 font-semibold text-slate-700">{schedule.estimatedWeight.toLocaleString('id-ID')} kg</p>
                        </div>
                      </div>

                      <p className="mt-3 flex items-start gap-2 text-xs text-slate-500">
                        <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        {schedule.pickupLocation || 'Lokasi sedang dikonfirmasi'}
                      </p>

                      {(schedule.status === 'pending' || schedule.status === 'confirmed') && (
                        <button
                          onClick={() => void handleCancelSchedule(schedule.id)}
                          className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700"
                        >
                          <XCircle className="h-4 w-4" /> Batalkan jadwal
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
