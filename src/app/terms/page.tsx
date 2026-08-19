import React from 'react';

export default function TermsPage() {
  return (
      <div className="flex flex-1 flex-col pb-16 pt-24">
          <div className="container max-w-4xl mx-auto px-4">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-8">Persyaratan Layanan</h1>
            <div className="prose prose-slate max-w-none">
              <p className="text-lg text-slate-600 mb-6">Terakhir diperbarui: Juli 2026</p>
              
              <div className="bg-primary-50 p-6 rounded-2xl border border-primary-100 mb-8">
                <p className="text-primary-800 font-medium">Ini adalah halaman Persyaratan Layanan dari purwarupa aplikasi NADI-TANI. Dokumen ini hanya bersifat demonstrasi dan belum mengikat secara hukum sesungguhnya.</p>
              </div>
              
              <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">1. Penerimaan Persyaratan</h2>
              <p className="text-slate-600 mb-4">Dengan mengakses dan menggunakan platform NADI-TANI, Anda menyetujui untuk terikat oleh persyaratan layanan ini.</p>
              
              <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">2. Layanan Platform</h2>
              <p className="text-slate-600 mb-4">NADI-TANI menyediakan ekosistem terpadu untuk digitalisasi dan hilirisasi padi yang menghubungkan petani, DAI, mitra, dan pemerintah.</p>
            </div>
          </div>
      </div>
  );
}
