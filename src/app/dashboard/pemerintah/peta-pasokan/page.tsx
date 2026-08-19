'use client';

import React, { useEffect, useState } from 'react';
import DaiMapDynamic from '@/components/maps/DaiMapDynamic';
import { analyticsService } from '@/lib/services/analytics.service';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { ProvinceData } from '@/lib/types';

export default function PetaPasokanPage() {
  const [data, setData] = useState<ProvinceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const provinces = await analyticsService.getProvinceData();
        setData(provinces);
      } catch (error) {
        console.error("Failed to load map data", error);
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
          <h1 className="text-2xl font-bold text-hijauTua">Peta Pasokan & Distribusi</h1>
          <p className="text-muted-foreground text-sm">Visualisasi sebaran petani, produksi, dan titik DAI (Data Demo)</p>
        </div>
      </div>

      <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-slate-100">
        {loading ? (
          <div className="flex h-[340px] items-center justify-center rounded-lg bg-slate-50 animate-pulse sm:h-[420px] lg:h-[500px]">
            Memuat peta...
          </div>
        ) : (
          <div className="h-[340px] w-full overflow-hidden rounded-lg border border-slate-200 sm:h-[420px] lg:h-[500px]">
            <DaiMapDynamic provinces={data} />
          </div>
        )}
      </div>

      <div className="bg-krem/30 p-4 rounded-lg text-sm text-slate-700">
        <strong>Catatan Simulasi:</strong> Data di atas merupakan simulasi atau data demo untuk menggambarkan kemampuan analitik geospasial platform NADI-TANI dan bukan merupakan data riil lapangan.
      </div>
    </div>
  );
}
