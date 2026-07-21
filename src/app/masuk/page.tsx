'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { DEMO_CREDENTIALS, COLOR_PALETTE } from '@/lib/utils/constants';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Shield, Tractor, Briefcase, Building, ShoppingBag, Database, Loader2, ArrowRight, ArrowLeft } from 'lucide-react';

const roleIcons: Record<string, React.ReactNode> = {
  petani: <Tractor className="h-6 w-6" />,
  operator_atm: <Database className="h-6 w-6" />,
  pengelola_dai: <Briefcase className="h-6 w-6" />,
  pemerintah: <Building className="h-6 w-6" />,
  mitra: <ShoppingBag className="h-6 w-6" />,
  admin: <Shield className="h-6 w-6" />,
};

const roleLabels: Record<string, string> = {
  petani: 'Petani',
  operator_atm: 'Operator ATM',
  pengelola_dai: 'Pengelola DAI',
  pemerintah: 'Pemerintah',
  mitra: 'Mitra',
  admin: 'Admin',
};

const roleDescriptions: Record<string, string> = {
  petani: 'Akses dashboard utama untuk petani',
  operator_atm: 'Kelola mesin ATM dan penerimaan',
  pengelola_dai: 'Manajemen gudang dan produksi',
  pemerintah: 'Pantau analitik dan stok nasional',
  mitra: 'Akses marketplace dan pesanan',
  admin: 'Manajemen sistem dan pengguna',
};

export default function MasukPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [isLoggingIn, setIsLoggingIn] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (role: string) => {
    try {
      setIsLoggingIn(role);
      setError(null);
      
      const cred = DEMO_CREDENTIALS.find(c => c.role === role);
      if (!cred) throw new Error('Kredensial tidak ditemukan');

      await login(cred.email, cred.password);

      // Redirect to respective dashboard
      switch (role) {
        case 'petani':
          router.push('/dashboard/petani');
          break;
        case 'operator_atm':
        case 'pengelola_dai':
        case 'operator_dai':
          router.push('/dashboard/operator-dai');
          break;
        case 'pemerintah':
          router.push('/dashboard/pemerintah');
          break;
        case 'mitra':
          router.push('/dashboard/mitra');
          break;
        case 'admin':
          router.push('/dashboard/admin');
          break;
        default:
          router.push('/');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat masuk');
      setIsLoggingIn(null);
    }
  };

  return (
    <div className="min-h-screen bg-krem flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative">
      <div className="absolute top-4 left-4 sm:top-8 sm:left-8">
        <Link href="/" className="inline-flex items-center gap-2 text-hijau-tua hover:text-hijau-pertanian transition-colors font-medium">
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>
      <div className="w-full max-w-4xl space-y-8 mt-12 sm:mt-0">
        
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="relative h-20 w-20 mb-4 drop-shadow-[0_0_12px_rgba(40,167,69,0.3)]">
              <Image src="/logo/logo-bulat-v2.png" alt="NADI-TANI Logo" fill className="object-contain" priority />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-hijau-tua sm:text-4xl">
              Selamat Datang di NADI-TANI
            </h1>
          </div>
          <p className="text-lg text-hijau-tua/80 max-w-2xl mx-auto">
            Pilih Peran untuk Masuk
          </p>
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm max-w-md mx-auto border border-red-200">
              {error}
            </div>
          )}
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 pt-6">
          {DEMO_CREDENTIALS.map((cred) => {
            const isLoading = isLoggingIn === cred.role;
            const isDisabled = isLoggingIn !== null && isLoggingIn !== cred.role;

            return (
              <button
                key={cred.role}
                onClick={() => handleLogin(cred.role)}
                disabled={isLoading || isDisabled}
                className={`
                  group relative flex flex-col items-start p-6 
                  bg-putih rounded-2xl shadow-sm border border-hijauMuda
                  transition-all duration-200 ease-in-out
                  hover:shadow-md hover:border-hijauPertanian
                  focus:outline-none focus:ring-2 focus:ring-hijauPertanian focus:ring-offset-2
                  disabled:opacity-60 disabled:cursor-not-allowed
                  text-left
                `}
              >
                <div className={`
                  p-3 rounded-xl mb-4 
                  bg-hijauMuda/50 text-hijauPertanian
                  group-hover:bg-hijauPertanian group-hover:text-putih
                  transition-colors duration-200
                `}>
                  {roleIcons[cred.role]}
                </div>
                
                <h3 className="text-lg font-semibold text-hijauTua mb-1">
                  {roleLabels[cred.role]}
                </h3>
                
                <p className="text-sm text-gray-500 mb-6 flex-grow">
                  {roleDescriptions[cred.role]}
                </p>

                <div className="flex items-center w-full justify-between text-sm font-medium text-hijauPertanian mt-auto">
                  <span>Masuk sebagai {cred.name.split(' ')[0]}</span>
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-12 text-center text-sm text-gray-500">
          <p className="max-w-lg mx-auto">
            Dengan masuk ke sistem, Anda menyetujui <Link href="/terms" className="text-hijauPertanian hover:underline font-medium">Persyaratan Layanan</Link> dan <Link href="/privacy" className="text-hijauPertanian hover:underline font-medium">Kebijakan Penggunaan Data</Link> NADI-TANI (Data Demo).
          </p>
        </div>
      </div>
    </div>
  );
}
