import React from 'react';
import { RootHeader } from '@/components/layout/RootHeader';
import { RootFooter } from '@/components/layout/RootFooter';
import { PageTransition } from '@/components/layout/PageTransition';

export default function PrivacyPage() {
  return (
    <>
      <RootHeader />
      <main className="flex-1 flex flex-col pt-24 pb-16">
        <PageTransition>
          <div className="container max-w-4xl mx-auto px-4">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-8">Kebijakan Privasi</h1>
            <div className="prose prose-slate max-w-none">
              <p className="text-lg text-slate-600 mb-6">Terakhir diperbarui: Juli 2026</p>
              
              <div className="bg-primary-50 p-6 rounded-2xl border border-primary-100 mb-8">
                <p className="text-primary-800 font-medium">Ini adalah halaman Kebijakan Privasi dari purwarupa aplikasi NADI-TANI. Dokumen ini hanya bersifat demonstrasi dan belum mengikat secara hukum sesungguhnya.</p>
              </div>
              
              <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">1. Pengumpulan Data</h2>
              <p className="text-slate-600 mb-4">Platform NADI-TANI mengumpulkan data pribadi dan operasional yang berhubungan dengan manajemen panen dan logistik untuk memastikan berjalannya layanan secara efisien.</p>
              
              <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">2. Keamanan Data</h2>
              <p className="text-slate-600 mb-4">Kami menerapkan standar keamanan terkini untuk memastikan informasi profil, transaksi, dan aset finansial Anda tetap aman dan terenkripsi.</p>
            </div>
          </div>
        </PageTransition>
      </main>
      <RootFooter />
    </>
  );
}
