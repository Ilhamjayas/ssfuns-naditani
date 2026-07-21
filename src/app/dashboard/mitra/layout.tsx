import React from 'react';
import { ProtectedRoute } from '@/lib/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function MitraLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['mitra', 'admin']}>
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
