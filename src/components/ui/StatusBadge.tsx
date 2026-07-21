import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  let variant: "default" | "secondary" | "danger" | "outline" | "success" | "warning" = "default";
  let colorClasses = "";

  const statusLower = status.toLowerCase();

  switch (statusLower) {
    case 'selesai':
    case 'berhasil':
    case 'aktif':
    case 'siap panen':
      variant = "default";
      colorClasses = "bg-green-100 text-green-800 hover:bg-green-100/80 dark:bg-green-900/30 dark:text-green-400";
      break;
    case 'proses':
    case 'berjalan':
    case 'pending':
    case 'menunggu':
      variant = "secondary";
      colorClasses = "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80 dark:bg-yellow-900/30 dark:text-yellow-400";
      break;
    case 'gagal':
    case 'batal':
    case 'ditolak':
      variant = "danger";
      break;
    default:
      variant = "outline";
  }

  return (
    <Badge variant={variant} className={cn(colorClasses, className)}>
      {status}
    </Badge>
  );
}
