import type { ReactNode } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProtectedRoute } from '@/lib/auth/ProtectedRoute';

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['petani', 'operator_atm', 'pengelola_dai', 'pemerintah', 'mitra', 'admin']}>
      <DashboardLayout>{children}</DashboardLayout>
    </ProtectedRoute>
  );
}
