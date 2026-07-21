"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { NtpChart } from '@/components/charts/NtpChart';
import { analyticsService } from '@/lib/services/analytics.service';
import { NTPData, NTPProjection, NationalStats } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, Users, Map, Wheat, LineChart } from 'lucide-react';
import { formatWeight } from '@/lib/utils/format';
import { motion } from 'framer-motion';

export default function InsightPage() {
  const [loading, setLoading] = useState(true);
  const [ntpData, setNtpData] = useState<NTPData[]>([]);
  const [projectionData, setProjectionData] = useState<NTPProjection[]>([]);
  const [stats, setStats] = useState<NationalStats | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ntp, proj, natStats] = await Promise.all([
          analyticsService.getNTPData(),
          analyticsService.getNTPProjection(),
          analyticsService.getNationalStats()
        ]);
        setNtpData(ntp);
        setProjectionData(proj);
        setStats(natStats);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pt-20">
      {/* Header Section */}
      <div className="bg-primary-900 relative overflow-hidden text-white py-20 px-4 lg:px-8 mb-12">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary-900 to-green-900 z-0 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 z-0 mix-blend-overlay"></div>
        <motion.div 
          className="container mx-auto max-w-6xl text-center relative z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-block p-4 rounded-full bg-white/10 backdrop-blur-md mb-6">
            <LineChart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-display font-extrabold mb-6 leading-tight drop-shadow-md">Insight & Data NADI-TANI</h1>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto font-medium">
            Pantau pergerakan harga, kesejahteraan petani (NTP), dan statistik produksi nasional secara transparan untuk ketahanan pangan yang lebih baik.
          </p>
        </motion.div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 pb-20 max-w-6xl">
        {/* National Stats Grid */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-extrabold text-slate-800">Ringkasan Nasional</h2>
          <div className="h-1 w-12 bg-primary-500 mt-4 rounded-full"></div>
        </motion.div>
        
        {loading || !stats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-40 rounded-3xl" />)}
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {[
              { icon: <Users className="w-6 h-6" />, title: "Total Petani Aktif", value: new Intl.NumberFormat('id-ID').format(stats.totalPetaniAktif), color: "primary", bg: "bg-primary-100", text: "text-primary-700" },
              { icon: <Map className="w-6 h-6" />, title: "Luas Lahan Terdaftar", value: `${new Intl.NumberFormat('id-ID').format(stats.luasLahan)} ha`, color: "gold", bg: "bg-gold-light", text: "text-gold-dark" },
              { icon: <Wheat className="w-6 h-6" />, title: "Produksi GKG Nasional", value: formatWeight(stats.produksiGKG), color: "success", bg: "bg-success-light", text: "text-success" },
              { icon: <TrendingUp className="w-6 h-6" />, title: "NTP Tanaman Pangan", value: ntpData.length > 0 ? ntpData[ntpData.length - 1].ntp.toFixed(2) : "117.82", color: "info", bg: "bg-info-light", text: "text-info" }
            ].map((stat, idx) => (
              <motion.div key={idx} variants={itemVariants}>
                <Card className="rounded-3xl border-0 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white overflow-hidden group">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.text} flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
                        {stat.icon}
                      </div>
                    </div>
                    <p className="text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider">{stat.title}</p>
                    <h3 className="text-3xl font-black text-slate-800 line-clamp-1">
                      {stat.value}
                    </h3>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* NTP Chart Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-extrabold text-slate-800">Tren dan Proyeksi NTP (Nilai Tukar Petani)</h2>
          <div className="h-1 w-12 bg-primary-500 mt-4 rounded-full"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="mb-8 rounded-3xl border-0 shadow-lg bg-white overflow-hidden">
            <CardHeader className="bg-slate-50 border-b border-slate-100 p-8">
              <CardTitle className="text-2xl font-bold text-slate-800">Historis & Proyeksi Model LSTM (2025 - 2026)</CardTitle>
              <CardDescription className="text-base text-slate-500 mt-2">
                Menampilkan data historis NTP Nasional dan NTP Subsektor Tanaman Pangan, beserta hasil proyeksi (forecast) menggunakan model pembelajaran mesin (LSTM) untuk 6 bulan ke depan.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              {loading ? (
                <Skeleton className="w-full h-[400px] rounded-2xl bg-slate-100" />
              ) : (
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                  <NtpChart historicalData={ntpData} projectionData={projectionData} />
                </div>
              )}
              
              <div className="mt-8 bg-blue-50 p-6 rounded-2xl border border-blue-100 text-sm text-slate-700 shadow-inner">
                <p className="mb-3 font-bold text-blue-900 text-base">Catatan Proyeksi:</p>
                <ul className="list-disc pl-5 space-y-2 text-blue-800/80">
                  <li>Model memprediksi NTP Nasional dengan tingkat galat yang rendah (MAPE: 1,11% pada data pengujian).</li>
                  <li>Nilai proyeksi menunjukkan tren sedikit menurun namun tetap berada di atas batas kesejahteraan (indeks 100).</li>
                  <li>Garis proyeksi (area abu/kuning) merupakan hasil simulasi model statistik dan dapat berbeda dengan kondisi riil di lapangan.</li>
                  <li>NTP di atas 100 menunjukkan penerimaan petani lebih besar dari pengeluarannya secara rata-rata, namun tidak secara otomatis menjamin kesejahteraan mutlak di semua wilayah.</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>

      </div>
    </div>
  );
}
