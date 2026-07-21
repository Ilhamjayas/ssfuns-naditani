import { ProtectedRoute } from '@/lib/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function OperatorDAILayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={['operator_dai', 'pengelola_dai', 'operator_atm']}>
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
