export const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const indonesianMonths = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  const day = d.getDate();
  const month = indonesianMonths[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
};

export const formatDateTime = (date: string | Date): string => {
  const d = new Date(date);
  const dateStr = formatDate(d);
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  return `${dateStr}, ${hours}:${minutes}`;
};

export const formatWeight = (kg: number): string => {
  return new Intl.NumberFormat('id-ID').format(kg) + ' kg';
};

export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value) + '%';
};

export const getRelativeTime = (date: string | Date): string => {
  const rtf = new Intl.RelativeTimeFormat('id', { numeric: 'auto' });
  const d = new Date(date);
  const now = new Date();
  const diffInSeconds = (d.getTime() - now.getTime()) / 1000;
  
  if (Math.abs(diffInSeconds) < 60) {
    return rtf.format(Math.round(diffInSeconds), 'second');
  }
  
  const diffInMinutes = diffInSeconds / 60;
  if (Math.abs(diffInMinutes) < 60) {
    return rtf.format(Math.round(diffInMinutes), 'minute');
  }
  
  const diffInHours = diffInMinutes / 60;
  if (Math.abs(diffInHours) < 24) {
    return rtf.format(Math.round(diffInHours), 'hour');
  }
  
  const diffInDays = diffInHours / 24;
  if (Math.abs(diffInDays) < 30) {
    return rtf.format(Math.round(diffInDays), 'day');
  }
  
  const diffInMonths = diffInDays / 30;
  if (Math.abs(diffInMonths) < 12) {
    return rtf.format(Math.round(diffInMonths), 'month');
  }
  
  return rtf.format(Math.round(diffInMonths / 12), 'year');
};

export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{4})(\d{4})(\d{4,5})$/);
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }
  return phone;
};

export const gradeColor = (grade: string): string => {
  switch (grade.toUpperCase()) {
    case 'A': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'B': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'C': return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'D': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'REJECT': return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const statusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'selesai':
    case 'completed':
    case 'delivered':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'sedang_diproses':
    case 'processing':
    case 'running':
    case 'shipped':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'menunggu_pembayaran':
    case 'pending':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'dibatalkan':
    case 'cancelled':
    case 'failed':
    case 'error':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};
