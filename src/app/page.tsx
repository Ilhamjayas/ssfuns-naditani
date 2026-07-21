"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Leaf, ShieldCheck, TrendingUp, UserCheck, Droplets, Package, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 pb-24 lg:pt-32 lg:pb-40 overflow-hidden bg-krem text-slate-900">
        <div className="absolute inset-0 bg-gradient-to-br from-krem via-white to-green-100/80 opacity-90 z-0"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 z-0 mix-blend-multiply"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-green-300/20 rounded-full blur-3xl z-0"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-yellow-300/20 rounded-full blur-3xl z-0"></div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="text-display font-extrabold mb-6 leading-tight tracking-tight text-slate-800 drop-shadow-sm flex flex-col items-center">
                <div className="relative h-24 sm:h-32 md:h-40 w-full max-w-md sm:max-w-2xl mx-auto mb-8">
                  <Image src="/logo/logo-text-v2.png" alt="NADI-TANI Logo" fill className="object-contain" priority />
                </div>
                <span>Menjembatani Swasembada Pangan dan Kesejahteraan Petani</span>
              </h1>
            </motion.div>
            
            <motion.p 
              className="text-h4 text-slate-600 mb-10 font-medium max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              Ekosistem digital dan fisik yang menghubungkan petani, ATM Gabah Mandiri, Depo Agroindustri Integrasi, pasar, dan pengolahan hasil samping dalam satu rantai pasok yang transparan.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            >
              <Link href="/setor-gabah" className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-green-600/30 transition-all hover:-translate-y-1 flex items-center justify-center border border-green-500/30">
                Mulai Setor Gabah
                <ArrowRight className="ml-3 w-6 h-6" />
              </Link>
              <Link href="/ekosistem" className="w-full sm:w-auto px-10 py-5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-2xl font-bold text-lg shadow-md transition-all hover:-translate-y-1 flex items-center justify-center">
                Lihat Alur Ekosistem
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. Ringkasan Masalah */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-h2 text-slate-800 font-extrabold mb-6">Mengapa NADI-TANI Diperlukan?</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">Sistem pertanian kita menghadapi tantangan besar antara produksi yang meningkat dan kesejahteraan petani yang masih tertinggal.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Package className="w-6 h-6" />,
                title: "Produksi Padi Meningkat",
                color: "info",
                items: [
                  "Luas panen 2025: 11,32 juta hektare.",
                  "Produksi GKG: 60,21 juta ton.",
                  "Produksi beras: 34,69 juta ton."
                ]
              },
              {
                icon: <TrendingUp className="w-6 h-6" />,
                title: "Kesejahteraan Tertinggal",
                color: "warning",
                items: [
                  "NTP Tanaman Pangan: 117.",
                  "NTP Perkebunan Rakyat: 159,77.",
                  <span key="1" className="font-medium text-warning">Selisih: 42,77 poin.</span>
                ]
              },
              {
                icon: <MapPin className="w-6 h-6" />,
                title: "Tren NTP Tidak Merata",
                color: "danger",
                items: [
                  "NTP nasional meningkat.",
                  <span key="2" className="font-medium text-danger">NTP Tanaman Pangan tahun 2024 turun 0,14%.</span>
                ]
              },
              {
                icon: <UserCheck className="w-6 h-6" />,
                title: "Regenerasi Petani",
                color: "gold-dark",
                items: [
                  "Usia 19–39 tahun: 21,93%.",
                  <span key="3" className="font-medium text-gold-dark">Usia di atas 40 tahun: 78,07%.</span>
                ]
              }
            ].map((card, idx) => (
              <motion.div 
                key={idx}
                className={`card p-8 border-t-4 border-t-${card.color} hover:shadow-xl transition-shadow duration-300 bg-white rounded-2xl`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <div className={`w-14 h-14 rounded-full bg-${card.color}-light flex items-center justify-center text-${card.color} mb-6 shadow-inner`}>
                  {card.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-4 leading-tight">{card.title}</h3>
                <ul className="text-base text-slate-600 space-y-3">
                  {card.items.map((item, i) => (
                    <li key={i} className="flex items-start">
                      <span className="mr-3 text-slate-400">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Alur Ekosistem Utama */}
      <section className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-h2 text-slate-800 font-extrabold mb-6">Alur Ekosistem NADI-TANI</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">Sistem terintegrasi dari hulu ke hilir untuk memastikan transparansi dan efisiensi rantai pasok.</p>
          </motion.div>

          {/* Desktop Horizontal Flow */}
          <div className="hidden md:flex items-center justify-between w-full max-w-6xl mx-auto px-4">
            {['Petani', 'NADI-TANI App', 'ATM Gabah', 'Depo DAI', 'Distribusi', 'Dompet Petani'].map((step, idx) => (
              <React.Fragment key={step}>
                <motion.div 
                  className="flex flex-col items-center flex-1"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <div className="w-20 h-20 rounded-full bg-white shadow-xl border-4 border-primary-500 flex items-center justify-center text-primary-600 font-extrabold text-2xl mb-4 z-10 transition-transform hover:scale-110">
                    {idx + 1}
                  </div>
                  <span className="font-bold text-slate-700 text-center text-base">{step}</span>
                </motion.div>
                {idx < 5 && (
                  <motion.div 
                    className="flex-1 h-2 bg-gradient-to-r from-primary-200 to-primary-500 mx-2 -mt-10 rounded-full"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5, delay: idx * 0.1 + 0.2 }}
                    style={{ transformOrigin: "left" }}
                  ></motion.div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Mobile Vertical Flow */}
          <div className="md:hidden flex flex-col space-y-8 max-w-xs mx-auto relative">
            <div className="absolute left-10 top-10 bottom-10 w-2 bg-gradient-to-b from-primary-200 to-primary-500 z-0 rounded-full"></div>
            {[
              { title: 'Petani & NADI-TANI App', desc: 'Jadwal setor atau penjemputan' },
              { title: 'ATM Gabah Mandiri', desc: 'Timbang & cek kualitas otomatis' },
              { title: 'Depo DAI', desc: 'Pengeringan & penggilingan' },
              { title: 'Hilirisasi & Pasar', desc: 'Beras premium & hasil samping' },
              { title: 'Dompet Petani', desc: 'Pendapatan langsung masuk' }
            ].map((step, idx) => (
              <motion.div 
                key={idx} 
                className="flex items-start z-10 relative"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <div className="w-20 h-20 rounded-full bg-white shadow-xl border-4 border-primary-500 flex-shrink-0 flex items-center justify-center text-primary-600 font-extrabold text-2xl mr-6">
                  {idx + 1}
                </div>
                <div className="pt-4">
                  <h4 className="text-lg font-bold text-slate-800">{step.title}</h4>
                  <p className="text-base text-slate-500">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Dampak Program */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-h2 text-slate-800 font-extrabold mb-4">Dampak Ekosistem Terpadu</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {[
              { icon: <Leaf className="w-7 h-7" />, title: "Budidaya Tepat Sasaran", desc: "Pengelolaan budidaya lebih tepat berbasis data, cuaca, dan kalender tanam.", color: "green", bg: "green-light", text: "green-farm" },
              { icon: <ShieldCheck className="w-7 h-7" />, title: "Transparansi Kualitas", desc: "Harga dan kualitas gabah lebih transparan dengan ATM Gabah Mandiri.", color: "info", bg: "info-light", text: "info" },
              { icon: <TrendingUp className="w-7 h-7" />, title: "Nilai Tambah Petani", desc: "Peluang nilai tambah hasil panen lebih besar melalui pengolahan pascapanen terpadu.", color: "gold", bg: "gold-light", text: "gold-dark" },
              { icon: <Package className="w-7 h-7" />, title: "Stok Pangan Terpantau", desc: "Stok dan distribusi pangan lebih terpantau secara real-time untuk pemerintah.", color: "primary", bg: "primary-100", text: "primary-600" },
              { icon: <Droplets className="w-7 h-7" />, title: "Hilirisasi Hasil Samping", desc: "Hasil samping padi dimanfaatkan secara lebih optimal menjadi produk bernilai guna.", color: "warning", bg: "warning-light", text: "warning" },
              { icon: <MapPin className="w-7 h-7" />, title: "Distribusi Terlacak", desc: "Pelacakan (traceability) gabah dan beras dari petani hingga ke tangan konsumen.", color: "slate", bg: "slate-100", text: "slate-700" }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                className="flex items-start space-x-5 p-6 rounded-2xl hover:bg-slate-50 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <div className={`w-16 h-16 rounded-2xl bg-${item.bg} flex items-center justify-center text-${item.text} flex-shrink-0 shadow-sm`}>
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-800 mb-2">{item.title}</h4>
                  <p className="text-base text-slate-600">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Call to Action */}
      <section className="py-32 bg-primary-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary-900 to-green-900 z-0"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 z-0 mix-blend-overlay"></div>
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-6xl text-white font-extrabold mb-8 leading-tight drop-shadow-lg">
              Gabah aman, transaksi transparan, <br className="hidden md:block" /> nilai tambah kembali kepada petani.
            </h2>
            <p className="text-xl text-primary-100 mb-12 max-w-2xl mx-auto font-medium">Bergabunglah dengan ekosistem NADI-TANI dan jadilah bagian dari transformasi agroindustri modern Indonesia.</p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/masuk" className="w-full sm:w-auto px-10 py-4 bg-white text-primary-900 rounded-2xl font-extrabold text-lg shadow-xl hover:bg-slate-100 transition-transform hover:-translate-y-1">
                Daftar sebagai Petani
              </Link>
              <Link href="/masuk" className="w-full sm:w-auto px-10 py-4 border-2 border-primary-300 text-white hover:bg-white/10 backdrop-blur-sm rounded-2xl font-extrabold text-lg transition-transform hover:-translate-y-1">
                Daftar sebagai Mitra
              </Link>
              <Link href="/depo-dai" className="w-full sm:w-auto px-10 py-4 border-2 border-primary-300 text-white hover:bg-white/10 backdrop-blur-sm rounded-2xl font-extrabold text-lg transition-transform hover:-translate-y-1">
                Temukan DAI Terdekat
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
