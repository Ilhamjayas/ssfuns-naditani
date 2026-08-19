import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, CalendarClock, Smartphone, ShieldCheck, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SetorGabahInfoPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 pt-16 sm:pt-20">
      <div className="bg-primary-900 px-4 py-12 text-white sm:py-16 lg:px-8">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-display font-bold mb-6">Mulai Setor Gabah</h1>
          <p className="text-primary-100 text-lg max-w-2xl mx-auto mb-8">
            NADI-TANI memberikan kebebasan kepada petani untuk menyetorkan gabah melalui ATM Gabah Mandiri dengan harga yang transparan dan proses yang cepat.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/masuk">
              <Button size="lg" variant="ghost" className="bg-white text-primary-800 hover:bg-slate-100 font-bold px-8 shadow-sm">
                Jadwalkan Setoran (Masuk)
              </Button>
            </Link>
            <Link href="/simulasi-atm">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8">
                Coba Simulasi ATM
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-4 py-10 sm:py-16 lg:px-8">
        <h2 className="text-h2 font-bold text-slate-800 text-center mb-12">Dua Cara Menyetorkan Gabah</h2>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="border-t-4 border-t-primary-500 hover:shadow-card-hover transition-all">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center mb-6">
                <MapPin className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Antar Mandiri ke DAI</h3>
              <p className="text-slate-600 mb-6">
                Bawa langsung gabah Anda ke Depo Agroindustri Integrasi (DAI) terdekat. Tidak perlu mengantre panjang karena Anda sudah menjadwalkan kedatangan lewat aplikasi.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-sm text-slate-600">
                  <ShieldCheck className="w-5 h-5 text-success mr-3" /> Transaksi langsung di ATM Gabah
                </li>
                <li className="flex items-center text-sm text-slate-600">
                  <ShieldCheck className="w-5 h-5 text-success mr-3" /> Bebas biaya penjemputan
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-gold-dark hover:shadow-card-hover transition-all">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-gold-light text-gold-dark rounded-2xl flex items-center justify-center mb-6">
                <CalendarClock className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Minta Penjemputan</h3>
              <p className="text-slate-600 mb-6">
                Tidak punya armada angkut? Jadwalkan penjemputan langsung dari sawah Anda. Tim logistik DAI akan datang mengambil gabah sesuai jadwal.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-sm text-slate-600">
                  <ShieldCheck className="w-5 h-5 text-success mr-3" /> Hemat waktu dan tenaga
                </li>
                <li className="flex items-center text-sm text-slate-600">
                  <ShieldCheck className="w-5 h-5 text-success mr-3" /> Armada resmi dengan timbangan portabel
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="rounded-2xl bg-slate-100 p-5 text-center sm:rounded-3xl sm:p-8 lg:p-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Langkah Penggunaan Aplikasi</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-10">
            {[
              { icon: <Smartphone className="w-6 h-6" />, title: "Buka Aplikasi", desc: "Masuk ke Dashboard Petani" },
              { icon: <CalendarClock className="w-6 h-6" />, title: "Pilih Jadwal", desc: "Tentukan tanggal dan cara setor" },
              { icon: <ArrowRight className="w-6 h-6" />, title: "Datang ke DAI", desc: "Sesuai dengan jadwal" },
              { icon: <ShieldCheck className="w-6 h-6" />, title: "Selesai", desc: "Dana masuk ke dompet digital" }
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-white text-primary-600 flex items-center justify-center shadow-sm mb-4">
                  {step.icon}
                </div>
                <h4 className="font-bold text-slate-800 text-sm mb-2">{step.title}</h4>
                <p className="text-xs text-slate-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
