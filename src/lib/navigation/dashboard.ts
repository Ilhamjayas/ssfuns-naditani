import type { LucideIcon } from 'lucide-react';
import {
  BarChart3,
  CheckCircle2,
  Factory,
  History,
  Home,
  Map,
  Scale,
  ShieldCheck,
  ThermometerSun,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import type { UserRole } from '@/lib/types';

export interface DashboardNavItem {
  name: string;
  shortName: string;
  href: string;
  icon: LucideIcon;
}

export function getDashboardNavItems(role?: UserRole): DashboardNavItem[] {
  if (role === 'petani') {
    return [
      { name: 'Ringkasan', shortName: 'Beranda', href: '/dashboard/petani', icon: Home },
      { name: 'Setor Gabah', shortName: 'Setor', href: '/dashboard/petani/setor-gabah', icon: Scale },
      { name: 'Dompet Digital', shortName: 'Dompet', href: '/dashboard/petani/dompet', icon: Wallet },
      { name: 'Riwayat Setor', shortName: 'Riwayat', href: '/dashboard/petani/riwayat-setor', icon: History },
    ];
  }

  if (role === 'operator_atm' || role === 'pengelola_dai') {
    return [
      { name: 'Ringkasan DAI', shortName: 'DAI', href: '/dashboard/operator-dai', icon: Factory },
      { name: 'Penerimaan', shortName: 'Terima', href: '/dashboard/operator-dai/penerimaan', icon: CheckCircle2 },
      { name: 'Pengeringan', shortName: 'Kering', href: '/dashboard/operator-dai/pengeringan', icon: ThermometerSun },
    ];
  }

  if (role === 'pemerintah') {
    return [
      { name: 'Ringkasan Nasional', shortName: 'Nasional', href: '/dashboard/pemerintah', icon: BarChart3 },
      { name: 'Peta Pasokan', shortName: 'Peta', href: '/dashboard/pemerintah/peta-pasokan', icon: Map },
      { name: 'Proyeksi NTP', shortName: 'Proyeksi', href: '/dashboard/pemerintah/proyeksi-ntp', icon: TrendingUp },
    ];
  }

  if (role === 'admin') {
    return [{ name: 'Administrasi Sistem', shortName: 'Admin', href: '/dashboard/admin', icon: ShieldCheck }];
  }

  if (role === 'mitra') {
    return [{ name: 'Dashboard Mitra', shortName: 'Mitra', href: '/dashboard/mitra', icon: Home }];
  }

  return [];
}
