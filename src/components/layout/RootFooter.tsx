"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export function RootFooter() {
  const pathname = usePathname();

  // If we are in a dashboard or auth page, we don't show the public footer
  if (pathname?.startsWith('/dashboard') || pathname?.startsWith('/masuk')) {
    return null;
  }

  return (
    <footer className="bg-primary-900 text-slate-300 py-12 border-t border-primary-800">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="relative h-10 w-40">
                <Image src="/logo/logo-text-v2.png" alt="NADI-TANI Logo" fill className="object-contain object-left" />
              </div>
            </Link>
            <p className="text-sm max-w-sm mb-6 text-primary-200">
              Ekosistem digital dan fisik agroindustri padi. Memutus rantai tengkulak, mengamankan hasil panen, dan mengembalikan nilai tambah kepada petani.
            </p>
            <p className="text-xs text-primary-400">
              &copy; {new Date().getFullYear()} NADI-TANI. All rights reserved.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4">Ekosistem</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/ekosistem" className="hover:text-white transition-colors">Alur Proses</Link></li>
              <li><Link href="/depo-dai" className="hover:text-white transition-colors">Depo DAI</Link></li>
              <li><Link href="/simulasi-atm" className="hover:text-white transition-colors">ATM Gabah</Link></li>
              <li><Link href="/zero-waste" className="hover:text-white transition-colors">Zero Waste</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4">Informasi</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/marketplace" className="hover:text-white transition-colors">Marketplace</Link></li>
              <li><Link href="/insight" className="hover:text-white transition-colors">Data Nasional</Link></li>
              <li><Link href="/edukasi" className="hover:text-white transition-colors">Pusat Edukasi</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
