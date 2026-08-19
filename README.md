# NADI-TANI (Nasional Digital Tani)

NADI-TANI adalah platform ekosistem pertanian terintegrasi yang dirancang untuk mendigitalisasi proses rantai pasok pertanian dari hulu ke hilir. Platform ini menghubungkan petani, pengepul (mitra), operator depo, hingga pemerintah dalam satu ekosistem yang transparan dan efisien.

## 🛠 Tech Stack

Proyek ini dibangun menggunakan teknologi modern:
- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Library UI:** [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Animasi:** [Framer Motion](https://www.framer.com/motion/)
- **Notifikasi/Toast:** [Sonner](https://sonner.emilkowal.ski/)
- **Ikon:** Lucide React

## ✨ Fitur & Halaman

Aplikasi ini mencakup berbagai modul dan peran, dengan lebih dari 29 halaman interaktif:

### Autentikasi & Profil
- Masuk / Login
- Pengaturan Profil Pengguna

### Dashboard Berbasis Peran
- **Dashboard Petani:** Ringkasan panen, pendapatan, dan edukasi.
- **Dashboard Mitra/Pengepul:** Manajemen inventaris gabah dan logistik.
- **Dashboard Operator DAI:** Pengawasan setoran, mesin ATM Gabah, dan kualitas.
- **Dashboard Pemerintah:** Analitik agregat ketahanan pangan daerah.
- **Dashboard Admin:** Manajemen sistem dan pengguna.

### Modul Utama
- **Simulasi ATM Gabah:** Simulasi mesin setor gabah mandiri dengan AI vision dan IoT.
- **Setor Gabah:** Formulir dan riwayat setoran gabah.
- **Depo DAI (Dapur Agrikultur Indonesia):** Manajemen fasilitas pengolahan pasca panen.
- **Ekosistem & Koperasi:** Manajemen kelompok tani dan simpan pinjam.
- **Marketplace (Pasar Tani):** Platform jual-beli produk turunan dan saprotan.
- **Zero Waste:** Manajemen limbah sekam untuk bio-pelet.
- **Edukasi:** Pusat artikel dan panduan bertani modern.
- **Insight & Laporan:** Analisis tren panen, cuaca, dan prediksi harga.
- **Notifikasi:** Sistem pemberitahuan real-time.
- **Privacy & Terms:** Kebijakan privasi dan syarat ketentuan.

## 🚀 Cara Menjalankan Lokal

Pastikan Anda memiliki Node.js terinstal di sistem Anda.

1. Clone repositori ini (atau buka folder proyek):
   ```bash
   cd nadi-tani
   ```

2. Instal dependensi:
   ```bash
   npm install
   ```

3. Jalankan development server:
   ```bash
   npm run dev
   ```

4. Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

## 🔑 Kredensial Demo

Gunakan kredensial berikut untuk masuk sebagai berbagai peran (password bebas / apa saja):

| Peran | Email Demo |
| --- | --- |
| Petani | `petani@demo.com` |
| Mitra / Pengepul | `mitra@demo.com` |
| Operator DAI | `operator@demo.com` |
| Pemerintah | `pemerintah@demo.com` |
| Admin | `admin@demo.com` |

## 📸 Screenshots

*(Tangkapan layar akan ditambahkan di sini)*

- **Halaman Beranda**
  ![Beranda](#)
- **Dashboard Petani**
  ![Dashboard Petani](#)
- **Simulasi ATM Gabah**
  ![Simulasi ATM Gabah](#)

## 👥 Tim / Kredit

Dikembangkan oleh Tim NADI-TANI untuk memajukan ekosistem pertanian digital di Indonesia.

## 📄 Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE).
