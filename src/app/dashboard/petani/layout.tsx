'use client';

import React from 'react';
import { ProtectedRoute } from '@/lib/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Sprout, Wallet, History, Send } from 'lucide-react';

const petaniNavigation = [
  { name: 'Dashboard', href: '/dashboard/petani', icon: Sprout },
  { name: 'Setor Gabah', href: '/dashboard/petani/setor-gabah', icon: Send },
  { name: 'Riwayat Setor', href: '/dashboard/petani/riwayat-setor', icon: History },
  { name: 'Dompet', href: '/dashboard/petani/dompet', icon: Wallet },
];

export default function PetaniDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={['petani']}>
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
