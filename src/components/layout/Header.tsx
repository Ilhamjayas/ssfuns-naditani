"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bell, Menu, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth/AuthContext';
import { useRouter } from 'next/navigation';

export function Header() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/masuk');
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
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
        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button variant="ghost" size="icon" className="hover:bg-slate-100 rounded-full">
            <Bell className="h-5 w-5 text-slate-600" />
            <span className="sr-only">Notifications</span>
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full bg-slate-100 text-slate-600">
            <User className="h-5 w-5" />
            <span className="sr-only">User Profile</span>
          </Button>
          <Button variant="danger" size="sm" onClick={handleLogout} className="ml-2 hidden sm:flex font-semibold">
            <LogOut className="h-4 w-4 mr-2" />
            Keluar
          </Button>
        </div>
      </div>
    </header>
  );
}
