"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export function RootHeader() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // If we are in a dashboard or auth page, we don't show the public navbar
  if (pathname?.startsWith('/dashboard') || pathname?.startsWith('/masuk')) {
    return null;
  }

  const navLinks = [
    { name: 'Beranda', href: '/' },
    { name: 'Ekosistem', href: '/ekosistem' },
    { name: 'Depo DAI', href: '/depo-dai' },
    { name: 'Zero Waste', href: '/zero-waste' },
    { name: 'Marketplace', href: '/marketplace' },
    { name: 'Edukasi', href: '/edukasi' },
    { name: 'Insight', href: '/insight' },
  ];

  return (
    <header 
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled 
          ? 'bg-white/80 backdrop-blur-lg border-b border-white/20 shadow-sm' 
          : 'bg-transparent border-transparent'
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className={`flex items-center justify-between transition-all duration-300 ${scrolled ? 'h-16' : 'h-20'}`}>
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative h-10 w-10 sm:h-12 sm:w-12"
              >
                <Image 
                  src="/logo/logo-bulat-v2.png" 
                  alt="NADI-TANI" 
                  fill 
                  className={`object-contain transition-all duration-300 ${!scrolled ? 'drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]' : ''}`}
                  priority
                />
              </motion.div>
              <span className={`font-bold text-xl tracking-tight hidden sm:block ${scrolled ? 'text-slate-800' : 'text-slate-800'}`}>
                NADI-TANI
              </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.href} 
                  href={link.href}
                  className="relative px-4 py-2 rounded-full text-sm font-semibold transition-colors group"
                >
                  <span className={`relative z-10 ${isActive ? 'text-primary-700' : 'text-slate-600 group-hover:text-primary-600'}`}>
                    {link.name}
                  </span>
                  
                  {/* Hover Background */}
                  <div className="absolute inset-0 bg-primary-50 rounded-full opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-200 z-0"></div>
                  
                  {/* Active Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 bg-primary-50 border border-primary-100 rounded-full z-0"
                      initial={false}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <Link href={
                ['operator_atm', 'pengelola_dai', 'operator_dai'].includes(user.role) 
                  ? '/dashboard/operator-dai' 
                  : `/dashboard/${user.role.replace('_', '-')}`
              }>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button className="bg-primary-600 hover:bg-primary-700 text-white rounded-full px-6 font-semibold shadow-sm hover:shadow-md transition-all">
                    Dashboard
                  </Button>
                </motion.div>
              </Link>
            ) : (
              <Link href="/masuk">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="hidden sm:block">
                  <Button className="bg-primary-600 hover:bg-primary-700 text-white rounded-full px-6 font-semibold shadow-sm hover:shadow-md transition-all flex items-center">
                    <User className="w-4 h-4 mr-2" /> Masuk
                  </Button>
                </motion.div>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <motion.button 
              whileTap={{ scale: 0.9 }}
              className="lg:hidden p-2 text-slate-700 bg-white/50 backdrop-blur-sm rounded-full border border-slate-200/50"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="lg:hidden absolute top-full left-0 w-full overflow-hidden bg-white/95 backdrop-blur-xl border-b border-slate-200/50 shadow-xl"
          >
            <div className="p-4 flex flex-col gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link 
                    key={link.href} 
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-xl font-medium flex items-center transition-all ${
                      isActive 
                        ? 'bg-primary-50 text-primary-700 shadow-inner' 
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {isActive && <motion.div layoutId="mobileIndicator" className="w-1 h-4 bg-primary-500 rounded-full mr-3" />}
                    <span className={isActive ? '' : 'ml-4'}>{link.name}</span>
                  </Link>
                );
              })}
              {!user && (
                <Link href="/masuk" onClick={() => setIsMobileMenuOpen(false)} className="mt-4">
                  <Button className="w-full bg-primary-600 hover:bg-primary-700 text-white rounded-xl py-6 font-bold shadow-md">
                    <User className="w-5 h-5 mr-2" /> Masuk ke Sistem
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
