"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import DaiLocationMapDynamic from '@/components/maps/DaiLocationMapDynamic';
import { DaiLocation } from '@/lib/types';
import { CheckCircle2, ExternalLink, Gauge, MapPin, Package, Search, Warehouse, X } from 'lucide-react';
import { mockDaiLocations } from '@/lib/data/dai-locations';
import { Input } from '@/components/ui/input';

export default function DepoDaiPage() {
  const locations: DaiLocation[] = mockDaiLocations;
  const [search, setSearch] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<DaiLocation | null>(null);

  const filteredLocations = locations.filter(location =>
    `${location.name} ${location.location}`.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (!selectedLocation) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedLocation(null);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [selectedLocation]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 pt-16 sm:pt-20">
      <div className="bg-primary-900 px-4 py-12 text-white sm:py-16 lg:px-8">
        <div className="container mx-auto max-w-4xl text-center">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-emerald-100">
            <Warehouse className="h-4 w-4" /> Pusat pascapanen terpadu
          </span>
          <h1 className="text-display font-bold mb-6">Depo Agroindustri Integrasi (DAI)</h1>
          <p className="text-primary-100 text-lg max-w-2xl mx-auto mb-8">
            Pusat pengolahan pascapanen modern yang menjamin kualitas beras premium dan memproses hasil samping padi secara terpadu.
          </p>
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-3 text-left min-[430px]:grid-cols-3">
            {['Pengeringan terkontrol', 'Sortasi mutu digital', 'Pengolahan zero waste'].map(item => (
              <div key={item} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm font-semibold text-primary-50">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-300" /> {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-10 sm:py-16 lg:px-8">
        <div className="mb-12 grid items-center gap-8 md:grid-cols-2 lg:mb-20 lg:gap-12">
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

          <div className="relative aspect-square overflow-hidden rounded-3xl bg-slate-200 shadow-xl">
            <Image
              src="/images/dai/dai-facility-concept.png"
              alt="Visualisasi realistis fasilitas DAI dengan petani, timbangan digital, dan gudang gabah"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-3">
              <div className="text-white">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-200">Visualisasi konsep</p>
                <p className="mt-1 font-semibold">DAI sebagai pusat layanan pascapanen desa</p>
              </div>
              <Badge className="bg-white/90 text-primary-800 border-none px-4 py-2 shadow-sm text-sm">
                Standar Mutu SNI
              </Badge>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-8 lg:p-12">
          <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Peta Lokasi DAI Nasional</h2>
              <p className="text-slate-500">Temukan {locations.length} titik DAI demo beserta kapasitas dan layanannya.</p>
            </div>
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input value={search} onChange={event => setSearch(event.target.value)} placeholder="Cari kota atau kecamatan" className="h-11 bg-white pl-10" />
            </div>
          </div>

          {locations.length > 0 && (
             <div className="h-[360px] w-full overflow-hidden rounded-2xl border border-slate-200 sm:h-[440px] lg:h-[500px]">
               <DaiLocationMapDynamic locations={filteredLocations.length > 0 ? filteredLocations : locations} zoom={5} />
             </div>
          )}

          <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {filteredLocations.map(location => (
              <Card key={location.id} className="border-slate-200 shadow-none transition-colors hover:border-emerald-300">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">{location.id}</p>
                      <h3 className="mt-1 font-bold text-slate-800">{location.name}</h3>
                    </div>
                    <div className="rounded-xl bg-emerald-50 p-2 text-emerald-700"><Warehouse className="h-5 w-5" /></div>
                  </div>
                  <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-slate-500"><MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />{location.location}</p>
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                    <span className="text-slate-500">Kapasitas <strong className="text-slate-700">{location.capacity} ton</strong></span>
                    <span className="font-semibold text-emerald-700">{location.services.length} layanan</span>
                  </div>
                  <button type="button" onClick={() => setSelectedLocation(location)} className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-xl bg-emerald-700 text-sm font-bold text-white transition-colors hover:bg-emerald-800">Lihat Detail DAI</button>
                </CardContent>
              </Card>
            ))}
          </div>
          {filteredLocations.length === 0 && (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
              Lokasi yang dicari belum tersedia pada data demo.
            </div>
          )}
        </div>
      </div>

      {selectedLocation && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <button type="button" aria-label="Tutup detail DAI" onClick={() => setSelectedLocation(null)} className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm" />
          <div role="dialog" aria-modal="true" aria-labelledby="dai-detail-title" className="relative z-10 max-h-[calc(100dvh-2rem)] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="bg-gradient-to-r from-emerald-900 to-emerald-700 p-5 text-white sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-200">{selectedLocation.id}</p>
                  <h2 id="dai-detail-title" className="mt-1 text-2xl font-black">{selectedLocation.name}</h2>
                  <p className="mt-2 flex items-start gap-2 text-sm text-emerald-100"><MapPin className="mt-0.5 h-4 w-4 shrink-0" /> {selectedLocation.location}</p>
                </div>
                <button type="button" aria-label="Tutup detail DAI" onClick={() => setSelectedLocation(null)} className="rounded-full bg-white/10 p-2 hover:bg-white/20"><X className="h-5 w-5" /></button>
              </div>
            </div>
            <div className="space-y-6 p-5 sm:p-6">
              <div className="grid gap-3 min-[420px]:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="flex items-center text-xs font-bold uppercase tracking-wider text-slate-400"><Gauge className="mr-2 h-4 w-4" /> Kapasitas</p>
                  <p className="mt-2 text-2xl font-black text-slate-800">{selectedLocation.capacity} ton</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="flex items-center text-xs font-bold uppercase tracking-wider text-slate-400"><Package className="mr-2 h-4 w-4" /> Total stok tercatat</p>
                  <p className="mt-2 text-2xl font-black text-slate-800">{Object.values(selectedLocation.stockLevels).reduce((total, value) => total + value, 0).toLocaleString('id-ID')} ton</p>
                </div>
              </div>

              <div>
                <h3 className="font-extrabold text-slate-800">Layanan Tersedia</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedLocation.services.map(service => <span key={service} className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800"><CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> {service}</span>)}
                </div>
              </div>

              <div>
                <h3 className="font-extrabold text-slate-800">Stok Saat Ini</h3>
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {Object.entries(selectedLocation.stockLevels).map(([label, value]) => (
                    <div key={label} className="rounded-xl border border-slate-200 p-3 text-center">
                      <p className="text-xs font-semibold capitalize text-slate-500">{label}</p>
                      <p className="mt-1 font-black text-slate-800">{value.toLocaleString('id-ID')} t</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-5 min-[420px]:flex-row">
                <button type="button" onClick={() => setSelectedLocation(null)} className="h-11 flex-1 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50">Tutup</button>
                <a href={`https://www.google.com/maps/dir/?api=1&destination=${selectedLocation.coordinates[0]},${selectedLocation.coordinates[1]}`} target="_blank" rel="noreferrer" className="inline-flex h-11 flex-1 items-center justify-center rounded-xl bg-emerald-700 text-sm font-bold text-white hover:bg-emerald-800">Buka Petunjuk Arah <ExternalLink className="ml-2 h-4 w-4" /></a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
