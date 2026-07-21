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
  Factory,
  CheckCircle2,
  ThermometerSun,
  BarChart3,
  Map,
  TrendingUp,
  User,
  LogOut
} from 'lucide-react';
import { useRouter } from 'next/navigation';

type NavItem = {
  name: string;
  href: string;
  icon: React.ElementType;
  isAction?: boolean;
};

export function BottomNav() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await logout();
    router.push('/masuk');
  };

  // Dynamic mobile navigation based on role
  const getNavItems = () => {
    if (!user) return [];

    if (user.role === 'petani') {
      return [
        { name: 'Dashboard', href: '/dashboard/petani', icon: Home },
        { name: 'Dompet', href: '/dashboard/petani/dompet', icon: Wallet },
        { name: 'Riwayat', href: '/dashboard/petani/riwayat-setor', icon: History },
      ];
    }
    
    if (user.role === 'operator_atm' || user.role === 'pengelola_dai') {
      return [
        { name: 'Dashboard', href: '/dashboard/operator-dai', icon: Factory },
        { name: 'Terima', href: '/dashboard/operator-dai/penerimaan', icon: CheckCircle2 },
        { name: 'Kering', href: '/dashboard/operator-dai/pengeringan', icon: ThermometerSun },
      ];
    }
    
    if (user.role === 'pemerintah' || user.role === 'admin') {
      return [
        { name: 'Nasional', href: '/dashboard/pemerintah', icon: BarChart3 },
        { name: 'Peta', href: '/dashboard/pemerintah/peta-pasokan', icon: Map },
        { name: 'Proyeksi', href: '/dashboard/pemerintah/proyeksi-ntp', icon: TrendingUp },
      ];
    }

    return [{ name: 'Dashboard', href: `/dashboard/${user.role}`, icon: Home }];
  };

  const mobileNavItems = getNavItems();

  // Don't show bottom nav if not logged in or array is empty
  if (!user || mobileNavItems.length === 0) {
    return null;
  }

  const finalNavItems: NavItem[] = [
    ...mobileNavItems, 
    { name: 'Profil', href: '/dashboard/profil', icon: User },
    { name: 'Keluar', href: '#', icon: LogOut, isAction: true }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 z-50 w-full h-16 bg-white/95 backdrop-blur-xl border-t border-slate-200/50 pb-safe shadow-[0_-4px_24px_rgba(0,0,0,0.05)]">
      <div className={`grid h-full max-w-lg mx-auto font-medium ${
        finalNavItems.length === 4 ? 'grid-cols-4' : 
        finalNavItems.length === 5 ? 'grid-cols-5' : 
        finalNavItems.length === 6 ? 'grid-cols-6' : 
        'grid-cols-3'
      }`}>
        {finalNavItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = pathname === item.href && !item.isAction;

          return (
            <Link
              key={index}
              href={item.href}
              onClick={item.isAction ? handleLogout : undefined}
              className="relative inline-flex flex-col items-center justify-center group outline-none"
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="flex flex-col items-center relative z-10"
              >
                <div className={cn(
                  "p-1.5 rounded-full mb-1 transition-colors", 
                  isActive ? "bg-primary-100 text-primary-700" : "text-slate-500 group-hover:text-primary-600 group-hover:bg-primary-50"
                )}>
                  <Icon className={cn("w-5 h-5", isActive ? "fill-primary-100" : "")} />
                </div>
                <span className={cn(
                  "text-[10px] sm:text-xs font-semibold transition-colors mt-0.5",
                  isActive ? "text-primary-700" : (item.isAction ? "text-red-500 group-hover:text-red-600" : "text-slate-500 group-hover:text-primary-600")
                )}>
                  {item.name}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
