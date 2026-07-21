"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import DaiMapDynamic from '@/components/maps/DaiMapDynamic';
import { analyticsService } from '@/lib/services/analytics.service';
import { ProvinceData } from '@/lib/types';
import { Factory, Search, CheckCircle2, ArrowRight } from 'lucide-react';

export default function DepoDaiPage() {
  const [provinces, setProvinces] = useState<ProvinceData[]>([]);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const data = await analyticsService.getProvinceData();
        setProvinces(data);
      } catch (error) {
        console.error("Failed to fetch locations", error);
      }
    };
    fetchProvinces();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pt-20">
      <div className="bg-primary-900 text-white py-16 px-4 lg:px-8">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-display font-bold mb-6">Depo Agroindustri Integrasi (DAI)</h1>
          <p className="text-primary-100 text-lg max-w-2xl mx-auto mb-8">
            Pusat pengolahan pascapanen modern yang menjamin kualitas beras premium dan memproses hasil samping padi secara terpadu.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-16 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-h2 font-bold text-slate-800 mb-6">Fasilitas Modern dalam Setiap Depo</h2>
            <p className="text-slate-600 mb-8">
              Setiap DAI dilengkapi dengan fasilitas berteknologi tinggi untuk memastikan tidak ada penurunan kualitas (losses) yang signifikan dari sejak gabah diterima hingga menjadi beras.
            </p>
            
            <ul className="space-y-4">
              {[
                { title: 'Mesin Bed Dryer', desc: 'Pengeringan gabah dengan suhu terkontrol untuk menjaga rendemen.' },
                { title: 'Color Sorter', desc: 'Memisahkan beras menir atau cacat warna secara otomatis.' },
                { title: 'ATM Gabah Mandiri', desc: 'Sistem penerimaan terintegrasi digital dan transparan.' },
                { title: 'Unit Pengolah Hasil Samping', desc: 'Mesin pirolisis dan pencacah untuk zero waste.' }
              ].map((item, idx) => (
                <li key={idx} className="flex">
                  <CheckCircle2 className="w-6 h-6 text-success mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-slate-800">{item.title}</h4>
                    <p className="text-sm text-slate-500">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-slate-200 rounded-3xl aspect-square flex items-center justify-center relative overflow-hidden">
            {/* Visual representation placeholder */}
            <Factory className="w-32 h-32 text-slate-400" />
            <div className="absolute bottom-6 right-6">
              <Badge className="bg-white/90 text-primary-800 border-none px-4 py-2 shadow-sm text-sm">
                Standar Mutu SNI
              </Badge>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-slate-100">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Peta Lokasi DAI Nasional</h2>
              <p className="text-slate-500">Temukan Depo terdekat di wilayah Anda.</p>
            </div>
          </div>
          
          {/* We reuse the province map here to show DAI coverage conceptually */}
          {provinces.length > 0 && (
             <div className="h-[500px] w-full rounded-xl overflow-hidden border border-slate-200">
               <DaiMapDynamic provinces={provinces} zoom={5} />
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
