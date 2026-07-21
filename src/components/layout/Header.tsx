"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bell, Menu, User, LogOut, CheckCircle2, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth/AuthContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/masuk');
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 w-full max-w-full">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-8 w-8">
              <Image src="/logo/logo-bulat-v2.png" alt="NADI-TANI Logo" fill className="object-contain" />
            </div>
            <span className="hidden font-bold sm:inline-block">
              NADI-TANI
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4 relative">
          
          {/* Notifications */}
          <div className="relative">
            <Button variant="ghost" size="icon" onClick={() => { setShowNotif(!showNotif); setShowProfile(false); }} className="hover:bg-slate-100 rounded-full relative cursor-pointer">
              <Bell className="h-5 w-5 text-slate-600 cursor-pointer" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border border-white"></span>
              <span className="sr-only">Notifications</span>
            </Button>

            <AnimatePresence>
              {showNotif && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden z-50"
                >
                  <div className="p-4 border-b border-slate-100 bg-slate-50">
                    <h3 className="font-bold text-sm text-slate-800">Notifikasi</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {[
                      { title: 'Sistem Terhubung', desc: 'Koneksi ke ATM Gabah Mandiri berhasil.', time: '10 menit yang lalu' },
                      { title: 'Pembaruan Harga', desc: 'Harga HPP gabah diperbarui.', time: '1 jam yang lalu' },
                      { title: 'Laporan Mingguan', desc: 'Laporan ringkasan minggu ini telah siap.', time: 'Kemarin' },
                    ].map((n, i) => (
                      <div key={i} className="p-4 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors flex gap-3">
                        <div className="mt-1"><CheckCircle2 className="h-5 w-5 text-green-500" /></div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{n.title}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{n.desc}</p>
                          <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Profile */}
          <div className="relative">
            <button 
              onClick={() => { setShowProfile(!showProfile); setShowNotif(false); }} 
              className="flex items-center gap-2 hover:bg-slate-50 p-1.5 rounded-full transition-colors focus:outline-none cursor-pointer"
            >
              <div className="bg-primary-100 text-primary-700 h-8 w-8 rounded-full flex items-center justify-center">
                <User className="h-4 w-4" />
              </div>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </button>

            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden z-50"
                >
                  <div className="p-4 border-b border-slate-100 bg-slate-50">
                    <p className="text-sm font-bold text-slate-800 truncate">{user?.name || 'Pengguna'}</p>
                    <p className="text-xs text-slate-500 capitalize truncate mt-0.5">{user?.role?.replace('_', ' ') || 'Guest'}</p>
                  </div>
                  <div className="p-2">
                    <Button variant="ghost" className="w-full justify-start text-sm text-slate-600 hover:text-primary-700 hover:bg-primary-50">
                      Pengaturan Akun
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-sm text-slate-600 hover:text-primary-700 hover:bg-primary-50">
                      Bantuan
                    </Button>
                    <div className="h-px bg-slate-100 my-2"></div>
                    <Button variant="danger" size="sm" onClick={handleLogout} className="w-full justify-start font-semibold">
                      <LogOut className="h-4 w-4 mr-2" />
                      Keluar
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </header>
  );
}
