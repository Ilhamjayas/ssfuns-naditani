import { TrainingContent } from '../types';

export const mockTrainingContent: TrainingContent[] = [
  {
    id: 'TRN-001',
    title: 'Teknik Pemupukan Berimbang Padi Sawah',
    description: 'Panduan lengkap dosis dan waktu pemupukan yang tepat untuk meningkatkan hasil panen dan menjaga kesuburan tanah.',
    type: 'video',
    url: 'https://youtube.com/watch?v=example1',
    thumbnailUrl: '/images/training/pemupukan.jpg',
    author: 'Penyuluh Pertanian Lapangan (PPL)',
    publishedAt: '2026-05-10T08:00:00.000Z',
    tags: ['Pemupukan', 'Padi Sawah', 'Best Practice']
  },
  {
    id: 'TRN-002',
    title: 'Pengenalan Hama Wereng dan Cara Pengendaliannya',
    description: 'Mengenal siklus hidup wereng coklat dan metode pengendalian hama terpadu (PHT) yang ramah lingkungan.',
    type: 'article',
    url: '/edukasi/hama-wereng',
    thumbnailUrl: '/images/training/wereng.jpg',
    author: 'Balai Proteksi Tanaman Pertanian',
    publishedAt: '2026-06-15T10:00:00.000Z',
    tags: ['Hama', 'PHT', 'Wereng']
  },
  {
    id: 'TRN-003',
    title: 'Modul: Pertanian Presisi Menggunakan Data Cuaca',
    description: 'Cara membaca data cuaca NADI-TANI untuk menentukan jadwal tanam, pemupukan, dan panen yang optimal.',
    type: 'module',
    url: '/edukasi/modul/pertanian-presisi',
    author: 'Tim Ahli NADI-TANI',
    publishedAt: '2026-07-01T09:00:00.000Z',
    tags: ['Modul', 'Cuaca', 'Teknologi']
  }
];
