'use client';

import React, { useEffect, useState } from 'react';
import { NtpChart } from '@/components/charts/NtpChart';
import { analyticsService } from '@/lib/services/analytics.service';
import { ArrowLeft, Info } from 'lucide-react';
import Link from 'next/link';
import { NTPData } from '@/lib/types';

export default function ProyeksiNTPPage() {
  const [data, setData] = useState<NTPData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const ntp = await analyticsService.getNTPData();
        setData(ntp.filter(d => d.category === 'Tanaman Pangan'));
      } catch (error) {
        console.error("Failed to load NTP data", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 sm:items-center sm:gap-4">
        <Link href="/dashboard/pemerintah" className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-input bg-white hover:bg-slate-100">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-hijauTua">Proyeksi NTP & NTUP</h1>
          <p className="text-muted-foreground text-sm">Prediksi menggunakan model LSTM (Simulasi)</p>
        </div>
      </div>

      <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-slate-100">
        <h3 className="font-bold text-lg mb-4">Tren Nilai Tukar Petani (Tanaman Pangan)</h3>
        {loading ? (
          <div className="flex h-[300px] items-center justify-center rounded-lg bg-slate-50 animate-pulse sm:h-[400px]">
            Memuat grafik...
          </div>
        ) : (
          <NtpChart historicalData={data} />
        )}
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-blue-100 bg-blue-50/50 p-4 sm:flex-row sm:gap-4 sm:p-6">
        <Info className="h-6 w-6 text-blue-600 shrink-0" />
        <div className="text-sm text-blue-900 space-y-2">
          <p>
            <strong>Penjelasan Model (Simulasi):</strong> Grafik di atas menampilkan proyeksi Nilai Tukar Petani (NTP) dan Nilai Tukar Usaha Pertanian (NTUP) untuk beberapa bulan ke depan berdasarkan data historis.
          </p>
          <p>
            Model ini menggunakan algoritma Long Short-Term Memory (LSTM) dengan Mean Absolute Percentage Error (MAPE) simulasi sekitar 2.4%, menunjukkan tingkat akurasi yang baik pada data latih. Area dengan latar belakang kuning menandai periode proyeksi.
          </p>
          <p className="font-medium text-red-600/80 mt-2">
            Penting: Data ini bersifat proyeksi (prediksi) untuk keperluan pengambilan kebijakan dan tidak menjamin keuntungan atau kepastian kondisi di masa mendatang.
          </p>
        </div>
      </div>
    </div>
  );
}
