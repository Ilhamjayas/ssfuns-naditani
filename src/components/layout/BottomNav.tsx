'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth/AuthContext';
import { User } from 'lucide-react';
import { getDashboardNavItems } from '@/lib/navigation/dashboard';

type NavItem = {
  name: string;
  href: string;
  icon: React.ElementType;
};

export function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const mobileNavItems = getDashboardNavItems(user?.role);

  // Don't show bottom nav if not logged in or array is empty
  if (!user || mobileNavItems.length === 0) {
    return null;
  }

  const finalNavItems: NavItem[] = [
    ...mobileNavItems.map(item => ({ ...item, name: item.shortName })),
    { name: 'Profil', href: '/dashboard/profil', icon: User }
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200/70 bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_24px_rgba(0,0,0,0.06)] backdrop-blur-xl lg:hidden" aria-label="Navigasi dashboard ponsel">
      <div className="mx-auto grid h-16 max-w-lg grid-flow-col auto-cols-fr px-1 font-medium">
        {finalNavItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={index}
              href={item.href}
              className="group relative inline-flex min-w-0 flex-col items-center justify-center px-0.5 outline-none"
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="flex flex-col items-center relative z-10"
              >
                <div className={cn(
                  "rounded-full p-1.5 transition-colors",
                  isActive ? "bg-primary-100 text-primary-700" : "text-slate-500 group-hover:text-primary-600 group-hover:bg-primary-50"
                )}>
                  <Icon className={cn("w-5 h-5", isActive ? "fill-primary-100" : "")} />
                </div>
                <span className={cn(
                  "max-w-full truncate text-[9px] font-semibold leading-tight transition-colors min-[360px]:text-[10px]",
                  isActive ? "text-primary-700" : "text-slate-500 group-hover:text-primary-600"
                )}>
                  {item.name}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
