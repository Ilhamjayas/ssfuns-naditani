'use client';

import React, { useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        // Not authenticated, redirect to login page
        router.push('/masuk');
      } else if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Role not allowed, redirect to respective dashboard
        switch (user.role) {
          case 'petani':
            router.push('/dashboard/petani');
            break;
          case 'operator_atm':
          case 'pengelola_dai':
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
      }
    }
  }, [user, isLoading, allowedRoles, router]);

  // If loading or not authenticated (and about to be redirected), show loading
  if (isLoading || !user || (allowedRoles && !allowedRoles.includes(user.role))) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-krem/30">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative h-16 w-16 animate-pulse">
            <Image src="/logo/logo-bulat-v2.png" alt="Loading" fill className="object-contain" />
          </div>
          <p className="text-sm font-medium text-hijauTua animate-pulse">Memuat halaman...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
