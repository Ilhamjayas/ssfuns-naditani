'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth/AuthContext';
import { getDashboardNavItems } from '@/lib/navigation/dashboard';

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const navItems = getDashboardNavItems(user?.role);
  const roleLabel = {
    petani: 'Petani',
    operator_atm: 'Operator ATM',
    pengelola_dai: 'Pengelola DAI',
    pemerintah: 'Pemerintah',
    mitra: 'Mitra Industri',
    admin: 'Administrator',
  }[user?.role || 'petani'];
  const initials = user?.name
    ?.split(' ')
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toUpperCase() || 'NT';

  return (
    <aside className="hidden h-full min-h-0 w-64 shrink-0 overflow-hidden border-r border-slate-200/70 bg-white lg:block xl:w-72">
      <div className="flex h-full min-h-0 flex-col">
        <div className="shrink-0 px-6 pb-3 pt-7 [@media(max-height:720px)]:pt-4">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Menu Utama</h2>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-3">
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
                    <span className="truncate">{item.name}</span>
                  </motion.div>

                  {/* Active Indicator Background */}
                  {isActive && (
                    <div
                      className="absolute inset-0 bg-primary-50 rounded-xl border border-primary-100 z-0"
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
        <div className="mt-auto shrink-0 border-t border-slate-100 bg-white p-3 [@media(max-height:720px)]:p-2.5 xl:p-4">
          <Link
            href="/dashboard/profil"
            aria-label={`Buka profil akun ${user?.name || 'Pengguna'}`}
            className="group block rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
          >
            <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-3.5 shadow-sm transition duration-200 group-hover:-translate-y-0.5 group-hover:border-emerald-200 group-hover:shadow-md [@media(max-height:720px)]:p-2.5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-sm font-extrabold text-white shadow-sm">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-800">{user?.name || 'Pengguna'}</p>
                  <p className="mt-0.5 truncate text-xs font-medium text-emerald-700">{roleLabel}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 border-t border-emerald-100 pt-3 text-[11px] font-semibold text-slate-500 [@media(max-height:720px)]:hidden">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> Akun aktif dan terhubung
              </div>
            </div>
          </Link>
        </div>
      </div>
    </aside>
  );
}
