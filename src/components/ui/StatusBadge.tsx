import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle2, Clock3, XCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  let variant: "default" | "secondary" | "danger" | "outline" | "success" | "warning" = "default";
  let colorClasses = "";
  let Icon = Clock3;

  const statusLower = status.toLowerCase();
  const label = status
    .replaceAll('_', ' ')
    .replace(/\b\w/g, character => character.toUpperCase());

  switch (statusLower) {
    case 'selesai':
    case 'berhasil':
    case 'aktif':
    case 'siap panen':
      variant = "success";
      Icon = CheckCircle2;
      colorClasses = "border-emerald-200 bg-emerald-50 text-emerald-800 shadow-sm hover:bg-emerald-100 dark:border-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300";
      break;
    case 'proses':
    case 'berjalan':
    case 'pending':
    case 'menunggu':
    case 'sedang_diproses':
    case 'menunggu_pembayaran':
      variant = "warning";
      Icon = Clock3;
      colorClasses = "border-amber-200 bg-amber-50 text-amber-800 shadow-sm hover:bg-amber-100 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-300";
      break;
    case 'gagal':
    case 'batal':
    case 'ditolak':
    case 'dibatalkan':
      variant = "danger";
      Icon = XCircle;
      colorClasses = "border-red-200 bg-red-50 text-red-800 shadow-sm hover:bg-red-100 dark:border-red-700 dark:bg-red-900/30 dark:text-red-300";
      break;
    default:
      variant = "outline";
      Icon = AlertCircle;
      colorClasses = "border-slate-200 bg-white text-slate-700";
  }

  return (
    <Badge variant={variant} className={cn("gap-1.5 whitespace-nowrap px-2.5 py-1 font-bold", colorClasses, className)}>
      <Icon aria-hidden="true" className="h-3.5 w-3.5" />
      {label}
    </Badge>
  );
}
