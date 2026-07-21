'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth/AuthContext';
import { 
  Home, 
  Wallet, 
  History, 
  CreditCard,
  Factory,
  CheckCircle2,
  ThermometerSun,
  BarChart3,
  Map,
  LogOut,
  TrendingUp
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/masuk');
  };

  // Dynamic navigation based on role
  const getNavItems = () => {
    if (!user) return [];

    if (user.role === 'petani') {
      return [
        { name: 'Ringkasan', href: '/dashboard/petani', icon: Home },
        { name: 'Dompet Digital', href: '/dashboard/petani/dompet', icon: Wallet },
        { name: 'Riwayat Setor', href: '/dashboard/petani/riwayat-setor', icon: History },
      ];
    }
    
    if (user.role === 'operator_atm' || user.role === 'pengelola_dai') {
      return [
        { name: 'Ringkasan DAI', href: '/dashboard/operator-dai', icon: Factory },
        { name: 'Penerimaan', href: '/dashboard/operator-dai/penerimaan', icon: CheckCircle2 },
        { name: 'Pengeringan', href: '/dashboard/operator-dai/pengeringan', icon: ThermometerSun },
      ];
    }
    
    if (user.role === 'pemerintah' || user.role === 'admin') {
      return [
        { name: 'Ringkasan Nasional', href: '/dashboard/pemerintah', icon: BarChart3 },
        { name: 'Peta Pasokan', href: '/dashboard/pemerintah/peta-pasokan', icon: Map },
        { name: 'Proyeksi NTP', href: '/dashboard/pemerintah/proyeksi-ntp', icon: TrendingUp },
      ];
    }

    return [{ name: 'Dashboard', href: `/dashboard/${user.role}`, icon: Home }];
  };

  const navItems = getNavItems();

  return (
    <div className="hidden border-r bg-white/50 backdrop-blur-md md:block md:w-64 lg:w-72 shadow-sm">
      <div className="flex h-full max-h-screen flex-col gap-2 pt-6">
        <div className="px-6 mb-4">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Menu Utama</h2>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-4 text-sm font-medium gap-1">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={index}
                  href={item.href}
                  className="relative group outline-none"
                >
                  <motion.div
                    whileHover={{ scale: 1.02, x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-4 py-3 transition-colors relative z-10",
                      isActive 
                        ? "text-primary-700 font-semibold" 
                        : "text-slate-600 hover:text-primary-600"
                    )}
                  >
                    <Icon className={cn("h-5 w-5 transition-transform", isActive ? "scale-110" : "group-hover:scale-110")} />
                    {item.name}
                  </motion.div>

                  {/* Active Indicator Background */}
                  {isActive && (
                    <motion.div
                      layoutId="sidebarActive"
                      className="absolute inset-0 bg-primary-50 rounded-xl border border-primary-100 z-0"
                      initial={false}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  
                  {/* Hover Background */}
                  {!isActive && (
                    <div className="absolute inset-0 bg-slate-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity z-0" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
        
        {/* Logout Button */}
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors font-medium"
          >
            <LogOut className="h-5 w-5" />
            Keluar
          </button>
        </div>
      </div>
    </div>
  );
}
