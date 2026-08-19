"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronDown, Smartphone, Scale, Factory, Recycle, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EkosistemPage() {
  const steps = [
    {
      id: 1,
      icon: <Smartphone className="w-8 h-8" />,
      title: "Aplikasi NADI-TANI & Petani",
      desc: "Petani mendaftarkan lahan dan mendapatkan pendampingan budidaya. Saat panen tiba, petani dapat menjadwalkan penyetoran gabah ke Depo DAI terdekat langsung dari aplikasi.",
      color: "primary",
      bg: "bg-primary-50",
      border: "border-primary-500",
      text: "text-primary-700"
    },
    {
      id: 2,
      icon: <Scale className="w-8 h-8" />,
      title: "ATM Gabah Mandiri",
      desc: "Fasilitas timbang otomatis di mana petani menyetorkan gabah. Mesin secara transparan mengukur berat, kadar air, dan persentase gabah hampa tanpa campur tangan tengkulak.",
      color: "info",
      bg: "bg-info-light",
      border: "border-info",
      text: "text-info",
      link: { text: "Coba Simulasi ATM Gabah", href: "/simulasi-atm" }
    },
    {
      id: 3,
      icon: <Factory className="w-8 h-8" />,
      title: "Depo Agroindustri Integrasi (DAI)",
      desc: "Gabah dikeringkan menggunakan bed dryer modern dan digiling menjadi beras premium. Kualitas dijaga ketat untuk meminimalisir kehilangan hasil pascapanen (food loss).",
      color: "gold",
      bg: "bg-gold-light",
      border: "border-gold-dark",
      text: "text-gold-dark"
    },
    {
      id: 4,
      icon: <Recycle className="w-8 h-8" />,
      title: "Hilirisasi Zero Waste",
      desc: "Sisa proses seperti sekam, bekatul, dan jerami tidak dibuang, melainkan diolah kembali menjadi biochar, briket, atau pakan ternak bernilai ekonomi.",
      color: "warning",
      bg: "bg-warning-light",
      border: "border-warning",
      text: "text-warning",
      link: { text: "Lihat Optimalisasi Hasil Samping", href: "/zero-waste" }
    },
    {
      id: 5,
      icon: <Wallet className="w-8 h-8" />,
      title: "Pasar & Pembagian Hasil",
      desc: "Beras premium dan produk sampingan dijual ke pasar atau BUMN. Pendapatan penjualan dikembalikan ke dompet digital petani dengan sistem bagi hasil yang adil.",
      color: "success",
      bg: "bg-success-light",
      border: "border-success",
      text: "text-success"
    }
  ];

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 pt-16 sm:pt-20">
      <div className="absolute top-0 left-0 right-0 h-96 bg-primary-900 z-0 opacity-5"></div>

      <div className="container relative z-10 mx-auto px-4 py-10 sm:py-16 lg:px-8 lg:py-20">
        <motion.div
          className="max-w-4xl mx-auto text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-display text-slate-800 font-extrabold mb-6 tracking-tight">Alur Ekosistem NADI-TANI</h1>
          <p className="text-xl text-slate-600 font-medium max-w-3xl mx-auto leading-relaxed">
            Bagaimana gabah dari sawah Anda diolah menjadi beras premium dan produk bernilai tambah, dengan transparansi penuh di setiap langkah.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto relative">
          {/* Connecting Line Desktop */}
          <div className="hidden md:block absolute left-12 top-10 bottom-10 w-2 bg-gradient-to-b from-primary-200 via-info to-success rounded-full opacity-30"></div>

          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              className={`card relative mb-8 ml-0 rounded-2xl border-l-4 bg-white p-5 shadow-xl transition-all duration-300 hover:shadow-2xl sm:p-8 md:mb-12 md:ml-20 md:rounded-3xl md:border-l-8 md:p-10 ${step.border}`}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                {/* Desktop Icon Overlay */}
                <div className={`hidden md:flex absolute -left-[7.5rem] w-20 h-20 rounded-full bg-white shadow-lg border-4 ${step.border} items-center justify-center z-10 ${step.text}`}>
                  {step.icon}
                </div>

                {/* Mobile Icon */}
                <div className={`md:hidden w-16 h-16 rounded-2xl ${step.bg} flex items-center justify-center ${step.text} flex-shrink-0 mb-4`}>
                  {step.icon}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <span className={`text-4xl font-black opacity-20 ${step.text}`}>0{step.id}</span>
                    <h3 className="text-2xl font-bold text-slate-800">{step.title}</h3>
                  </div>
                  <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                    {step.desc}
                  </p>

                  {step.link && (
                    <Link href={step.link.href} className={`inline-flex items-center px-6 py-3 rounded-xl font-bold transition-all ${step.bg} ${step.text} hover:opacity-80`}>
                      {step.link.text} <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                  )}
                </div>
              </div>

              {index < steps.length - 1 && (
                <div className="md:hidden absolute -bottom-10 left-12 flex items-center justify-center h-10 text-slate-300">
                  <ChevronDown className="w-8 h-8 animate-bounce" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
