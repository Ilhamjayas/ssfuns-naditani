import { Notification } from '../types';

export const mockNotifications: Notification[] = [
  {
    id: 'NOTIF-2026-001',
    userId: 'user-1',
    title: 'Pembayaran Gabah Berhasil',
    message: 'Dana sebesar Rp7.930.000 telah masuk ke dompet Anda dari penjualan 1.220 kg gabah (TRX-GAB-2026-00182).',
    type: 'success',
    category: 'transaksi',
    isRead: false,
    createdAt: '2026-07-20T08:36:00.000Z',
    link: '/dashboard/petani/dompet'
  },
  {
    id: 'NOTIF-2026-002',
    userId: 'user-1',
    title: 'Peringatan Cuaca',
    message: 'Potensi hujan sedang hingga lebat disertai angin kencang diprediksi terjadi di wilayah Ngawi pada 25 Juli 2026.',
    type: 'warning',
    category: 'cuaca',
    isRead: false,
    createdAt: '2026-07-20T07:00:00.000Z',
    link: '/notifikasi?filter=cuaca'
  },
  {
    id: 'NOTIF-2026-003',
    userId: 'user-1',
    title: 'Kuota Subsidi Tersedia',
    message: 'Kuota pupuk Urea bersubsidi (150kg) Anda sudah dapat diambil di Kios Tani Makmur.',
    type: 'info',
    category: 'subsidi',
    isRead: true,
    createdAt: '2026-07-15T09:00:00.000Z',
    link: '/notifikasi?filter=subsidi'
  },
  {
    id: 'NOTIF-2026-004',
    userId: 'user-1',
    title: 'Bagi Hasil Produk Sampingan',
    message: 'Bagi hasil dari pengolahan sekam dan bekatul periode Juni 2026 sebesar Rp450.000 telah masuk ke dompet Anda.',
    type: 'success',
    category: 'transaksi',
    isRead: true,
    createdAt: '2026-07-05T10:05:00.000Z',
    link: '/dashboard/petani/dompet'
  },
  {
    id: 'NOTIF-2026-005',
    userId: 'user-1',
    title: 'Materi Edukasi Baru',
    message: 'Video panduan pemupukan berimbang untuk varietas Inpari 32 telah ditambahkan.',
    type: 'info',
    category: 'edukasi',
    isRead: true,
    createdAt: '2026-07-01T14:00:00.000Z',
    link: '/edukasi'
  }
];
