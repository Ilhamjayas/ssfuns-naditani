"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { Bell, Menu, User, LogOut, CheckCircle2, ChevronDown, HelpCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth/AuthContext';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { getDashboardNavItems } from '@/lib/navigation/dashboard';
import { cn } from '@/lib/utils';
import { notificationService } from '@/lib/services/notification.service';
import { DEMO_UPDATE_EVENT } from '@/lib/demo/demo-store';
import { Notification } from '@/lib/types';
import { getRelativeTime } from '@/lib/utils/format';

export function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const headerRef = React.useRef<HTMLElement>(null);
  const mobileNavItems = getDashboardNavItems(user?.role);

  useEffect(() => {
    const mountPortal = window.setTimeout(() => setMounted(true), 0);
    return () => window.clearTimeout(mountPortal);
  }, []);

  useEffect(() => {
    if (!user?.id) {
      return;
    }
    const loadNotifications = () => {
      void notificationService.getNotifications(user.id).then(setNotifications).catch(console.error);
    };
    loadNotifications();
    window.addEventListener(DEMO_UPDATE_EVENT, loadNotifications);
    return () => window.removeEventListener(DEMO_UPDATE_EVENT, loadNotifications);
  }, [user?.id]);

  useEffect(() => {
    if (!showMobileMenu) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setShowMobileMenu(false);
    };

    window.addEventListener('keydown', handleEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleEscape);
    };
  }, [showMobileMenu]);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setShowNotif(false);
        setShowProfile(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/masuk');
  };

  const unreadCount = notifications.filter(notification => !notification.isRead).length;

  const handleNotificationRead = async (notification: Notification) => {
    if (!notification.isRead) await notificationService.markAsRead(notification.id);
    setNotifications(current => current.map(item => item.id === notification.id ? { ...item, isRead: true } : item));
    if (notification.link) router.push(notification.link);
    setShowNotif(false);
  };

  return (
    <header ref={headerRef} className="sticky top-0 z-30 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 w-full max-w-full items-center justify-between px-3 sm:px-5 lg:px-8">
        <div className="flex min-w-0 items-center gap-2 sm:gap-4">
          <Button variant="ghost" size="icon" className="shrink-0 lg:hidden" onClick={() => setShowMobileMenu(current => !current)} aria-expanded={showMobileMenu} aria-controls="dashboard-mobile-menu">
            {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
          <Link href="/" className="flex min-w-0 items-center gap-2">
            <div className="relative h-8 w-8 shrink-0">
              <Image src="/logo/logo-bulat-v2.png" alt="NADI-TANI Logo" fill sizes="32px" className="object-contain" priority />
            </div>
            <span className="truncate text-sm font-bold min-[360px]:inline-block sm:text-base">
              NADI-TANI
            </span>
          </Link>
        </div>
        <div className="relative flex flex-1 items-center justify-end gap-1 sm:gap-3">

          {/* Notifications */}
          <div className="relative">
            <Button aria-label={`Notifikasi, ${unreadCount} belum dibaca`} aria-expanded={showNotif} variant="ghost" size="icon" onClick={() => { setShowNotif(!showNotif); setShowProfile(false); }} className="hover:bg-slate-100 rounded-full relative cursor-pointer">
              <Bell className="h-5 w-5 text-slate-600 cursor-pointer" />
              {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border border-white"></span>}
            </Button>

            <AnimatePresence>
              {showNotif && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="fixed left-3 right-3 top-16 z-50 mt-2 overflow-hidden rounded-xl border border-slate-100 bg-white shadow-lg sm:absolute sm:left-auto sm:right-0 sm:top-auto sm:w-80"
                >
                  <div className="p-4 border-b border-slate-100 bg-slate-50">
                    <h3 className="font-bold text-sm text-slate-800">Notifikasi</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.slice(0, 4).map((n) => (
                      <button type="button" onClick={() => void handleNotificationRead(n)} key={n.id} className={`flex w-full gap-3 border-b border-slate-50 p-4 text-left transition-colors hover:bg-slate-50 ${n.isRead ? 'bg-white' : 'bg-primary-50/60'}`}>
                        <div className="mt-1"><CheckCircle2 className="h-5 w-5 text-green-500" /></div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{n.title}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{n.message}</p>
                          <p className="text-[10px] text-slate-400 mt-1">{getRelativeTime(n.createdAt)}</p>
                        </div>
                      </button>
                    ))}
                    {notifications.length === 0 && <p className="p-5 text-center text-sm text-slate-500">Belum ada notifikasi.</p>}
                  </div>
                  <Link href="/notifikasi" onClick={() => setShowNotif(false)} className="block border-t border-slate-100 px-4 py-3 text-center text-xs font-bold text-primary-700 hover:bg-primary-50">Lihat semua notifikasi</Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Profile */}
          <div className="relative">
            <button
              aria-label="Buka menu profil"
              aria-expanded={showProfile}
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
                  className="fixed left-3 right-3 top-16 z-50 mt-2 overflow-hidden rounded-xl border border-slate-100 bg-white shadow-lg sm:absolute sm:left-auto sm:right-0 sm:top-auto sm:w-56"
                >
                  <div className="p-4 border-b border-slate-100 bg-slate-50">
                    <p className="text-sm font-bold text-slate-800 truncate">{user?.name || 'Pengguna'}</p>
                    <p className="text-xs text-slate-500 capitalize truncate mt-0.5">{user?.role?.replace('_', ' ') || 'Guest'}</p>
                  </div>
                  <div className="p-2">
                    <Button onClick={() => { router.push('/dashboard/profil'); setShowProfile(false); }} variant="ghost" className="w-full justify-start text-sm text-slate-600 hover:text-primary-700 hover:bg-primary-50">
                      Pengaturan Akun
                    </Button>
                    <Button onClick={() => { setShowHelp(true); setShowProfile(false); }} variant="ghost" className="w-full justify-start text-sm text-slate-600 hover:text-primary-700 hover:bg-primary-50">
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

      {mounted && typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {showMobileMenu && (
            <div id="dashboard-mobile-menu" className="fixed inset-0 z-[200] lg:hidden">
              <motion.button
                type="button"
                aria-label="Tutup menu"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 h-full w-full bg-slate-950/45 backdrop-blur-[2px]"
                onClick={() => setShowMobileMenu(false)}
              />
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                className="relative flex h-[100dvh] w-[min(20rem,86vw)] flex-col overflow-hidden border-r border-slate-200 bg-white shadow-2xl"
                aria-label="Menu akun"
              >
                <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-100 px-4">
                  <Link href="/" onClick={() => setShowMobileMenu(false)} className="flex min-w-0 items-center gap-2.5">
                    <div className="relative h-8 w-8 shrink-0">
                      <Image src="/logo/logo-bulat-v2.png" alt="NADI-TANI Logo" fill sizes="32px" className="object-contain" />
                    </div>
                    <span className="truncate text-base font-bold text-slate-800">NADI-TANI</span>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => setShowMobileMenu(false)} aria-label="Tutup menu">
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
                  <div className="mb-4 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                    <p className="truncate font-bold text-slate-800">{user?.name || 'Pengguna'}</p>
                    <p className="mt-1 text-xs capitalize text-emerald-700">{user?.role?.replace('_', ' ') || 'Akun demo'}</p>
                  </div>
                  <nav className="space-y-1" aria-label="Menu dashboard">
                    {mobileNavItems.map(item => {
                      const Icon = item.icon;
                      const active = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setShowMobileMenu(false)}
                          className={cn('flex min-h-12 items-center gap-3 rounded-xl px-4 text-sm font-semibold transition-colors', active ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50')}
                        >
                          <Icon className="h-5 w-5 shrink-0" />
                          {item.name}
                        </Link>
                      );
                    })}
                    <Link href="/dashboard/profil" onClick={() => setShowMobileMenu(false)} className={cn('flex min-h-12 items-center gap-3 rounded-xl px-4 text-sm font-semibold transition-colors', pathname === '/dashboard/profil' ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50')}>
                      <User className="h-5 w-5 shrink-0" /> Profil & Akun
                    </Link>
                  </nav>
                  <div className="mt-auto border-t border-slate-100 pt-4">
                    <Button variant="danger" onClick={handleLogout} className="h-11 w-full justify-center">
                      <LogOut className="mr-2 h-4 w-4" /> Keluar dari Akun
                    </Button>
                  </div>
                </div>
              </motion.aside>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Help Modal using React Portal */}
      {mounted && typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {showHelp && (
            <div
              className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
              onClick={() => setShowHelp(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="help-title"
                className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 w-full max-w-lg relative z-[10000] max-h-[85vh] flex flex-col"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary-50 text-primary-600">
                      <HelpCircle className="w-5 h-5" />
                    </div>
                    <h3 id="help-title" className="text-lg font-bold text-slate-800">Pusat Bantuan & FAQ</h3>
                  </div>
                  <button
                    aria-label="Tutup pusat bantuan"
                    onClick={() => setShowHelp(false)}
                    className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 overflow-y-auto pr-1 flex-1">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="font-semibold text-slate-800 text-sm">Q: Bagaimana cara masuk/login?</p>
                    <p className="text-sm text-slate-600 mt-1">A: Masukkan username atau email dan kata sandi Anda. Untuk demonstrasi, pilih salah satu akun demo agar data login terisi otomatis.</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="font-semibold text-slate-800 text-sm">Q: Apakah data transaksi & dompet ini nyata?</p>
                    <p className="text-sm text-slate-600 mt-1">A: Tidak, semua data bersifat simulasi interaktif untuk keperluan demonstrasi ekosistem NADI-TANI.</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="font-semibold text-slate-800 text-sm">Q: Bagaimana cara menghubungi layanan darurat/admin?</p>
                    <p className="text-sm text-slate-600 mt-1">A: Anda dapat mengirimkan pesan ke helpdesk@naditani.id atau melalui narahubung resmi.</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="font-semibold text-slate-800 text-sm">Q: Di mana saya bisa mencoba mesin ATM Gabah?</p>
                    <p className="text-sm text-slate-600 mt-1">A: Buka menu &quot;Simulasi ATM&quot; pada navbar publik untuk mencoba alur penimbangan dan penetapan mutu gabah.</p>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
                  <Button onClick={() => setShowHelp(false)} className="bg-primary-600 hover:bg-primary-700 text-white font-medium px-5">
                    Tutup
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </header>
  );
}
