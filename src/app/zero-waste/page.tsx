"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Droplets, Flame, Leaf, Wheat, Calculator, ArrowRight, Wallet } from 'lucide-react';
import { formatRupiah, formatWeight } from '@/lib/utils/format';
import { motion } from 'framer-motion';

export default function ZeroWastePage() {
  const [gabahBerat, setGabahBerat] = useState<number>(1000);
  const [persentaseSekam, setPersentaseSekam] = useState<number>(20);
  const [persentaseBekatul, setPersentaseBekatul] = useState<number>(10);
  
  // Asumsi harga per kg (simulasi)
  const hargaSekam = 500;
  const hargaBekatul = 2000;
  
  // Kalkulasi
  const estimasiSekam = gabahBerat * (persentaseSekam / 100);
  const estimasiBekatul = gabahBerat * (persentaseBekatul / 100);
  const omzetSekam = estimasiSekam * hargaSekam;
  const omzetBekatul = estimasiBekatul * hargaBekatul;
  const totalOmzet = omzetSekam + omzetBekatul;
  
  // Simulasi biaya pengolahan 40%
  const biayaPengolahan = totalOmzet * 0.4;
  const pendapatanBersih = totalOmzet - biayaPengolahan;
  
  // Simulasi pembagian hasil ke petani 30% dari pendapatan bersih
  const bagianPetani = pendapatanBersih * 0.3;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pt-20 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-full h-96 bg-gradient-to-bl from-green-900 via-primary-900 to-primary-800 z-0 opacity-10"></div>
      
      <div className="container mx-auto px-4 lg:px-8 py-20 relative z-10">
        <motion.div 
          className="max-w-4xl mx-auto text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full font-bold text-sm mb-6 uppercase tracking-wider">
            Sirkularitas Ekonomi
          </div>
          <h1 className="text-display text-slate-800 font-extrabold mb-6 tracking-tight">Mengubah Hasil Samping Menjadi <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-yellow-500">Nilai Ekonomi</span></h1>
          <p className="text-xl text-slate-600 font-medium leading-relaxed max-w-3xl mx-auto">
            Sekam, bekatul, jerami, dan limbah cair tidak hanya dipandang sebagai sisa produksi, tetapi sebagai sumber daya yang masih dapat diolah menjadi produk bernilai guna tinggi.
          </p>
        </motion.div>

        {/* 4 Alur Hilirisasi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-24">
          {[
            {
              title: "Sekam Padi",
              icon: <Flame className="w-6 h-6" />,
              color: "warning",
              bg: "bg-warning-light",
              text: "text-warning",
              flow: ["Sekam", "Proses Pirolisis", "Biochar & Briket"],
              desc: "Membantu mengurangi bahan sisa dan membuka peluang produk turunan bernilai jual seperti bahan bakar briket atau pembenah tanah."
            },
            {
              title: "Bekatul",
              icon: <Wheat className="w-6 h-6" />,
              color: "gold-dark",
              bg: "bg-gold-light",
              text: "text-gold-dark",
              flow: ["Bekatul", "Stabilisasi Panas", "Pangan & Pakan"],
              desc: "Kaya akan nutrisi, bekatul yang distabilisasi berpotensi menjadi bahan baku pangan bergizi atau campuran pakan ternak berkualitas."
            },
            {
              title: "Jerami",
              icon: <Leaf className="w-6 h-6" />,
              color: "success",
              bg: "bg-success-light",
              text: "text-success",
              flow: ["Jerami", "Pencacahan", "Kompos Organik"],
              desc: "Mendukung praktik agroindustri berkelanjutan dengan mengembalikan nutrisi ke lahan pertanian sebagai pupuk atau media tanam."
            },
            {
              title: "Limbah Cair",
              icon: <Droplets className="w-6 h-6" />,
              color: "info",
              bg: "bg-info-light",
              text: "text-info",
              flow: ["Limbah Cair", "Pengolahan", "Pupuk Cair"],
              desc: "Air sisa proses dapat diolah lebih lanjut menjadi pupuk cair nabati atau biogas, sesuai kelayakan teknis di lapangan."
            }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Card className={`h-full hover:shadow-xl transition-all duration-300 border-t-8 border-t-${item.color} rounded-2xl`}>
                <CardHeader className="pb-3 pt-6 px-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl ${item.bg} ${item.text} flex items-center justify-center shadow-inner`}>
                      {item.icon}
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-800">{item.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="px-6 pb-6 pt-4">
                  <div className="flex items-center flex-wrap gap-2 text-sm text-slate-600 mb-6 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="font-bold text-slate-800">{item.flow[0]}</span>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                    <span className="font-medium">{item.flow[1]}</span>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                    <span className="font-bold text-primary-600">{item.flow[2]}</span>
                  </div>
                  <p className="text-base text-slate-600 leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Kalkulator Simulasi */}
        <motion.div 
          className="max-w-4xl mx-auto mb-12"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <Card className="shadow-2xl border-0 overflow-hidden rounded-3xl bg-white">
            <CardHeader className="bg-gradient-to-r from-primary-900 to-primary-800 text-white p-8">
              <div className="flex items-center gap-4 mb-2">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Calculator className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-3xl font-extrabold">Kalkulator Potensi Hasil Samping</CardTitle>
              </div>
              <p className="text-primary-100 mt-2 text-lg">
                Simulasikan nilai tambah yang dapat dihasilkan dari pengolahan hasil samping gabah.
              </p>
            </CardHeader>
            <CardContent className="p-8 md:p-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Inputs */}
                <div className="space-y-8">
                  <div>
                    <Label htmlFor="gabahBerat" className="text-slate-700 text-base font-bold mb-2 block">Total Gabah Diproses (kg)</Label>
                    <Input 
                      id="gabahBerat"
                      type="number"
                      value={gabahBerat}
                      onChange={(e) => setGabahBerat(Number(e.target.value))}
                      className="text-lg py-6 border-slate-300 focus:border-primary-500 rounded-xl"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="persentaseSekam" className="text-slate-700 text-sm font-bold mb-2 block">Persentase Sekam (%)</Label>
                      <Input 
                        id="persentaseSekam"
                        type="number"
                        value={persentaseSekam}
                        onChange={(e) => setPersentaseSekam(Number(e.target.value))}
                        className="text-lg py-6 border-slate-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <Label htmlFor="persentaseBekatul" className="text-slate-700 text-sm font-bold mb-2 block">Persentase Bekatul (%)</Label>
                      <Input 
                        id="persentaseBekatul"
                        type="number"
                        value={persentaseBekatul}
                        onChange={(e) => setPersentaseBekatul(Number(e.target.value))}
                        className="text-lg py-6 border-slate-300 rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                {/* Outputs */}
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-8 rounded-3xl border border-slate-200 shadow-inner">
                  <h4 className="font-extrabold text-slate-800 text-xl mb-6 flex items-center justify-between">
                    <span>Proyeksi Nilai Ekonomi</span>
                  </h4>
                  
                  <div className="space-y-4 text-base">
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                      <span className="text-slate-600 font-medium">Potensi Sekam:</span>
                      <span className="font-bold text-slate-800">{formatWeight(estimasiSekam)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                      <span className="text-slate-600 font-medium">Potensi Bekatul:</span>
                      <span className="font-bold text-slate-800">{formatWeight(estimasiBekatul)}</span>
                    </div>
                    
                    <div className="h-px bg-slate-200 my-4"></div>
                    
                    <div className="flex justify-between items-center px-2">
                      <span className="text-slate-600 font-medium">Estimasi Omzet:</span>
                      <span className="font-bold text-slate-800">{formatRupiah(totalOmzet)}</span>
                    </div>
                    <div className="flex justify-between items-center px-2 text-danger">
                      <span className="font-medium">Biaya Operasional (40%):</span>
                      <span className="font-bold">-{formatRupiah(biayaPengolahan)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-4 bg-primary-100 rounded-xl mt-4 border border-primary-200">
                      <span className="font-extrabold text-primary-900">Pendapatan Bersih:</span>
                      <span className="font-black text-xl text-primary-700">{formatRupiah(pendapatanBersih)}</span>
                    </div>
                  </div>

                  <motion.div 
                    className="mt-6 bg-gradient-to-r from-yellow-50 to-amber-100 p-6 rounded-2xl border border-amber-200 shadow-md relative overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Wallet className="w-16 h-16 text-amber-600" />
                    </div>
                    <p className="text-sm font-bold text-amber-800 mb-2 relative z-10 uppercase tracking-wide">Tambahan ke Dompet Petani (30%)</p>
                    <p className="text-4xl font-black text-amber-600 relative z-10">{formatRupiah(bagianPetani)}</p>
                  </motion.div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

      </div>
    </div>
  );
}
