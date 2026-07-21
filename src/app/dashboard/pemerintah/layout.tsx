import React from 'react';
import { ProtectedRoute } from '@/lib/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function PemerintahLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['pemerintah', 'admin']}>
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
