'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, CheckCircle2, Scale, Droplets, Microscope, Calculator, Receipt, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

type Step = 'SCAN' | 'VERIFIKASI' | 'TIMBANG' | 'KADAR_AIR' | 'KUALITAS' | 'HITUNG' | 'SELESAI';

const steps: { id: Step; label: string; icon: React.ElementType }[] = [
  { id: 'SCAN', label: 'Scan Kartu', icon: CreditCard },
  { id: 'VERIFIKASI', label: 'Verifikasi', icon: CheckCircle2 },
  { id: 'TIMBANG', label: 'Timbang', icon: Scale },
  { id: 'KADAR_AIR', label: 'Kadar Air', icon: Droplets },
  { id: 'KUALITAS', label: 'Cek Kualitas', icon: Microscope },
  { id: 'HITUNG', label: 'Hitung Harga', icon: Calculator },
  { id: 'SELESAI', label: 'Selesai', icon: Receipt },
];

export default function ATMSimulationPage() {
  const [currentStep, setCurrentStep] = useState<Step>('SCAN');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Simulation Data
  const [farmerData, setFarmerData] = useState<{name: string, id: string} | null>(null);
  const [beratKotor, setBeratKotor] = useState<number>(0);
  const [kadarAir, setKadarAir] = useState<number>(0);
  const [kualitas, setKualitas] = useState<string>('');
  const [potonganKadarAir, setPotonganKadarAir] = useState<number>(0);
  const [beratBersih, setBeratBersih] = useState<number>(0);
  const [hargaPerKg, setHargaPerKg] = useState<number>(0);
  const [totalHarga, setTotalHarga] = useState<number>(0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  const simulateProcess = (nextStep: Step, duration: number, onComplete?: () => void) => {
    setIsProcessing(true);
    setTimeout(() => {
      if (onComplete) onComplete();
      setCurrentStep(nextStep);
      setIsProcessing(false);
    }, duration);
  };

  const handleScanCard = () => {
    simulateProcess('VERIFIKASI', 1500, () => {
      setFarmerData({ name: 'Budi Santoso', id: 'PTN-2024-001' });
    });
  };

  const handleVerifikasi = () => {
    simulateProcess('TIMBANG', 1000);
  };

  const handleTimbang = () => {
    simulateProcess('KADAR_AIR', 2000, () => {
      setBeratKotor(1250);
    });
  };

  const handleKadarAir = () => {
    simulateProcess('KUALITAS', 2500, () => {
      setKadarAir(22);
    });
  };

  const handleKualitas = () => {
    simulateProcess('HITUNG', 3000, () => {
      setKualitas('Grade B (Sedang)');
    });
  };

  const handleHitung = () => {
    simulateProcess('SELESAI', 2000, () => {
      // Calculation logic
      // Base: 1250 kg. Moisture: 22%. Standard moisture: 14%. Diff: 8%.
      // Deduction rule: e.g., 1.5% deduction per 1% excess moisture
      const excess = 22 - 14;
      const deductionPercent = excess * 1.5; // 12%
      const deductionAmount = 1250 * (deductionPercent / 100);
      const bersih = 1250 - deductionAmount;
      
      const hargaBase = 6500; // Harga dasar Gabah Kering Panen
      const total = bersih * hargaBase;

      setPotonganKadarAir(deductionAmount);
      setBeratBersih(bersih);
      setHargaPerKg(hargaBase);
      setTotalHarga(total);
    });
  };

  const resetSimulation = () => {
    setCurrentStep('SCAN');
    setFarmerData(null);
    setBeratKotor(0);
    setKadarAir(0);
    setKualitas('');
    setPotonganKadarAir(0);
    setBeratBersih(0);
    setHargaPerKg(0);
    setTotalHarga(0);
  };

  return (
    <div className="min-h-screen bg-[#F7F3E8] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-hijau-tua tracking-tight">
            ATM Gabah Mandiri
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Simulasi interaktif setoran gabah NADI-TANI (Data Demo)
          </p>
        </div>

        {/* Stepper */}
        <div className="hidden md:flex justify-between items-center mb-8 relative">
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 z-0"></div>
          <div 
            className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-hijau-pertanian z-0 transition-all duration-500 ease-in-out"
            style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
          ></div>
          
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStepIndex;
            const isPast = index < currentStepIndex;
            
            return (
              <div key={step.id} className="relative z-10 flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-colors duration-300 ${
                  isActive ? 'bg-white border-hijau-pertanian text-hijau-pertanian shadow-lg' : 
                  isPast ? 'bg-hijau-pertanian border-hijau-pertanian text-white' : 
                  'bg-white border-gray-200 text-gray-400'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`mt-2 text-xs font-semibold ${isActive ? 'text-hijau-tua' : isPast ? 'text-hijau-pertanian' : 'text-gray-400'}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Main Machine Screen */}
        <Card className="w-full max-w-2xl mx-auto shadow-2xl rounded-2xl overflow-hidden border-0 ring-1 ring-black/5 bg-[#1E293B]">
          <div className="h-12 bg-[#0F172A] flex items-center justify-between px-6 border-b border-gray-700">
            <span className="text-gray-400 text-xs font-mono">NADI-TANI TERMINAL V1.0</span>
            <span className="text-green-400 text-xs font-mono animate-pulse">ONLINE</span>
          </div>
          
          <CardContent className="p-8 min-h-[400px] flex flex-col items-center justify-center text-white relative">
            
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
            
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="z-10 w-full flex flex-col items-center justify-center min-h-[300px]"
              >
                {currentStep === 'SCAN' && (
                  <div className="text-center space-y-6">
                    <div className="w-32 h-32 mx-auto bg-gray-800 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-600 animate-pulse">
                      <CreditCard className="w-16 h-16 text-gray-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Silakan Tap Kartu Petani</h2>
                      <p className="text-gray-400">Tempelkan kartu NADI-TANI Anda pada area pemindai</p>
                    </div>
                    <Button 
                      size="lg" 
                      className="bg-hijau-pertanian hover:bg-hijau-tua text-white mt-4 rounded-full px-8"
                      onClick={handleScanCard}
                      disabled={isProcessing}
                    >
                      {isProcessing ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Simulasikan Tap Kartu"}
                    </Button>
                  </div>
                )}

                {currentStep === 'VERIFIKASI' && (
                  <div className="text-center space-y-6 w-full">
                    {isProcessing ? (
                      <div className="flex flex-col items-center">
                        <Loader2 className="w-16 h-16 text-hijau-pertanian animate-spin mb-4" />
                        <h2 className="text-xl">Memverifikasi Data...</h2>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="w-20 h-20 mx-auto bg-green-500/20 rounded-full flex items-center justify-center">
                          <CheckCircle2 className="w-10 h-10 text-green-400" />
                        </div>
                        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 w-full max-w-sm mx-auto text-left">
                          <p className="text-xs text-gray-400 mb-1">ID Petani</p>
                          <p className="font-mono text-lg mb-3">{farmerData?.id}</p>
                          <p className="text-xs text-gray-400 mb-1">Nama</p>
                          <p className="text-xl font-semibold text-emas-padi">{farmerData?.name}</p>
                        </div>
                        <Button onClick={handleVerifikasi} className="bg-hijau-pertanian hover:bg-hijau-tua rounded-full px-8">
                          Lanjut <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {currentStep === 'TIMBANG' && (
                  <div className="text-center space-y-6 w-full">
                    {isProcessing ? (
                      <div className="flex flex-col items-center">
                        <Scale className="w-16 h-16 text-hijau-pertanian animate-pulse mb-4" />
                        <h2 className="text-xl">Menimbang Gabah...</h2>
                        <p className="text-gray-400 text-sm mt-2">Mohon tuangkan gabah ke dalam hopper</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="w-48 h-48 mx-auto bg-gray-800 rounded-full flex items-center justify-center border-4 border-hijau-pertanian relative overflow-hidden">
                          <div className="text-center">
                            <p className="text-4xl font-bold text-white">{beratKotor}</p>
                            <p className="text-gray-400">KG</p>
                          </div>
                        </div>
                        <h2 className="text-2xl font-bold text-emas-padi">Berat Kotor Tercatat</h2>
                        <Button onClick={handleTimbang} className="bg-hijau-pertanian hover:bg-hijau-tua rounded-full px-8">
                          Lanjut Cek Kadar Air <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {currentStep === 'KADAR_AIR' && (
                  <div className="text-center space-y-6 w-full">
                    {isProcessing ? (
                      <div className="flex flex-col items-center">
                        <Droplets className="w-16 h-16 text-blue-400 animate-bounce mb-4" />
                        <h2 className="text-xl">Menganalisis Kadar Air...</h2>
                        <div className="w-48 h-2 bg-gray-700 rounded-full mt-4 overflow-hidden">
                          <div className="h-full bg-blue-500 animate-pulse w-full"></div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                         <div className="w-40 h-40 mx-auto bg-blue-900/30 rounded-full flex items-center justify-center border-2 border-blue-500">
                          <div className="text-center">
                            <p className="text-5xl font-bold text-blue-400">{kadarAir}<span className="text-2xl">%</span></p>
                          </div>
                        </div>
                        <div>
                          <h2 className="text-xl font-bold">Kadar Air (Moisture)</h2>
                          <p className="text-gray-400 mt-1">Batas standar: 14%</p>
                        </div>
                        <Button onClick={handleKadarAir} className="bg-hijau-pertanian hover:bg-hijau-tua rounded-full px-8">
                          Lanjut Cek Kualitas <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {currentStep === 'KUALITAS' && (
                  <div className="text-center space-y-6 w-full">
                    {isProcessing ? (
                      <div className="flex flex-col items-center">
                        <Microscope className="w-16 h-16 text-purple-400 animate-pulse mb-4" />
                        <h2 className="text-xl">Memindai Kualitas (AI Vision)...</h2>
                        <p className="text-gray-400 text-sm mt-2">Mendeteksi gabah hampa & kotoran</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 w-full max-w-sm mx-auto">
                          <Microscope className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                          <h2 className="text-2xl font-bold text-white mb-2">Hasil Analisis AI</h2>
                          <div className="inline-block px-4 py-2 bg-purple-500/20 border border-purple-500/50 rounded-lg text-purple-300 font-semibold text-lg">
                            {kualitas}
                          </div>
                          <div className="mt-4 text-sm text-gray-400 flex justify-between">
                            <span>Gabah Hampa: 3%</span>
                            <span>Kotoran: 1.5%</span>
                          </div>
                        </div>
                        <Button onClick={handleKualitas} className="bg-hijau-pertanian hover:bg-hijau-tua rounded-full px-8">
                          Hitung Harga <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {currentStep === 'HITUNG' && (
                  <div className="text-center w-full">
                    {isProcessing ? (
                      <div className="flex flex-col items-center py-12">
                        <Calculator className="w-16 h-16 text-emas-padi animate-pulse mb-4" />
                        <h2 className="text-xl">Mengkalkulasi Nilai...</h2>
                      </div>
                    ) : (
                      <div className="space-y-6 text-left w-full max-w-md mx-auto bg-gray-800 p-6 rounded-xl border border-gray-700">
                        <h2 className="text-xl font-bold border-b border-gray-700 pb-3 mb-4 flex items-center">
                          <Receipt className="w-5 h-5 mr-2" /> Rincian Kalkulasi
                        </h2>
                        
                        <div className="space-y-3 font-mono text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Berat Kotor:</span>
                            <span className="text-white">{beratKotor} kg</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Kadar Air ({kadarAir}%):</span>
                            <span className="text-red-400">-{potonganKadarAir.toFixed(1)} kg</span>
                          </div>
                          <div className="flex justify-between border-t border-gray-700 pt-2">
                            <span className="text-gray-400">Berat Bersih:</span>
                            <span className="text-green-400 font-bold">{beratBersih.toFixed(1)} kg</span>
                          </div>
                          <div className="flex justify-between pt-2">
                            <span className="text-gray-400">Harga Dasar (Grade B):</span>
                            <span className="text-white">{formatCurrency(hargaPerKg)}/kg</span>
                          </div>
                        </div>

                        <div className="mt-6 pt-4 border-t-2 border-dashed border-gray-600">
                          <p className="text-sm text-gray-400 mb-1">Total Nilai Transaksi</p>
                          <p className="text-3xl font-bold text-emas-padi">{formatCurrency(totalHarga)}</p>
                        </div>

                        <Button onClick={handleHitung} className="w-full bg-hijau-pertanian hover:bg-hijau-tua mt-6 h-12">
                          Konfirmasi & Terbitkan Struk
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {currentStep === 'SELESAI' && (
                  <div className="text-center space-y-6 w-full">
                    <div className="w-24 h-24 mx-auto bg-green-500/20 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-12 h-12 text-green-500" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-2">Transaksi Berhasil!</h2>
                      <p className="text-gray-400">Struk digital telah dikirim ke aplikasi petani.</p>
                      <p className="text-emas-padi font-bold text-xl mt-4">Dana masuk ke NadiPay: {formatCurrency(totalHarga)}</p>
                    </div>
                    
                    <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
                      <Button onClick={resetSimulation} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                        Simulasi Transaksi Baru
                      </Button>
                      <Link href="/">
                        <Button className="bg-hijau-pertanian hover:bg-hijau-tua w-full sm:w-auto">
                          Kembali ke Beranda
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
