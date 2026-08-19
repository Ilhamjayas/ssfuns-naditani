'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Video, FileText, PlayCircle, CheckCircle2, Clock, BarChart, X, CheckCircle, Award, Sprout, Sun, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth/AuthContext';
import { educationService } from '@/lib/services/education.service';

const modulData = [
  {
    id: 1,
    title: "Teknik Budidaya Padi Modern",
    category: "Modul",
    difficulty: "Pemula",
    duration: "15 menit",
    desc: "Panduan lengkap praktik budidaya padi dengan teknologi modern untuk meningkatkan hasil panen secara signifikan.",
    icon: <BookOpen className="w-6 h-6 text-white" />,
    gradient: "from-green-400 to-green-600",
    content: [
      "Budidaya padi modern menitikberatkan pada efisiensi penggunaan sumber daya dan peningkatan produktivitas melalui teknologi. Pendekatan ini mencakup pemilihan varietas unggul yang tahan hama dan penyakit, serta adaptif terhadap perubahan iklim. Selain itu, teknik tanam seperti jajar legowo terbukti mampu meningkatkan jumlah populasi tanaman dan sirkulasi udara.",
      "Penggunaan mekanisasi dalam persiapan lahan, penanaman, hingga panen dapat mengurangi biaya tenaga kerja dan menekan tingkat kehilangan hasil. Penggunaan traktor, transplanter, dan combine harvester menjadi standar baru dalam mewujudkan ketahanan pangan yang kompetitif.",
      "Penerapan teknologi digital seperti sensor tanah dan cuaca juga membantu petani mengambil keputusan yang tepat terkait waktu tanam, pemupukan, dan pengairan. Dengan demikian, risiko gagal panen dapat diminimalisir dan hasil panen lebih optimal."
    ],
    takeaways: [
      "Pilih varietas unggul yang sesuai dengan kondisi agroklimat setempat.",
      "Terapkan sistem tanam jajar legowo untuk optimalisasi ruang tumbuh.",
      "Gunakan mekanisasi pertanian untuk efisiensi waktu dan biaya."
    ],
    quiz: [
      {
        question: "Apa keuntungan utama sistem tanam jajar legowo?",
        options: [
          "Mempercepat umur panen",
          "Meningkatkan populasi tanaman dan sirkulasi udara",
          "Mengurangi kebutuhan air irigasi",
          "Mencegah gulma tumbuh"
        ],
        answer: 1
      },
      {
        question: "Teknologi apa yang paling membantu dalam menentukan waktu pemupukan yang tepat?",
        options: [
          "Traktor roda empat",
          "Combine harvester",
          "Sensor tanah dan cuaca",
          "Drone penyemprot"
        ],
        answer: 2
      }
    ]
  },
  {
    id: 2,
    title: "Pengelolaan Air Irigasi",
    category: "Video",
    difficulty: "Menengah",
    duration: "20 menit",
    desc: "Metode pengelolaan air efisien (AWD) untuk menghemat air dan mencegah emisi gas metana berlebih.",
    icon: <Video className="w-6 h-6 text-white" />,
    gradient: "from-blue-400 to-blue-600",
    content: [
      "Pengelolaan air irigasi yang efisien sangat krusial di tengah ancaman perubahan iklim dan kelangkaan air. Metode Alternate Wetting and Drying (AWD) atau pengairan berselang adalah teknik di mana sawah tidak selalu digenangi air, melainkan dibiarkan kering hingga tingkat tertentu sebelum diairi kembali.",
      "Selain menghemat penggunaan air hingga 30%, metode AWD terbukti efektif dalam mengurangi emisi gas metana dari sawah yang merupakan salah satu penyumbang pemanasan global. Sistem perakaran padi juga menjadi lebih kuat karena mendapatkan oksigen yang cukup selama fase kering.",
      "Untuk menerapkan AWD secara presisi, petani dapat menggunakan pipa pralon berlubang (pipa pantau) yang ditanam di lahan sawah untuk memantau ketinggian muka air tanah secara langsung."
    ],
    takeaways: [
      "Gunakan metode AWD untuk menghemat air dan mengurangi emisi gas rumah kaca.",
      "Gunakan pipa pantau untuk mengetahui tingkat kekeringan tanah dengan akurat.",
      "AWD memperkuat sistem perakaran tanaman padi."
    ],
    quiz: [
      {
        question: "Apa kepanjangan dari metode AWD dalam pengelolaan air?",
        options: [
          "Automatic Water Dispenser",
          "Alternate Wetting and Drying",
          "Advanced Water Drainage",
          "Always Wet and Deep"
        ],
        answer: 1
      },
      {
        question: "Alat sederhana apa yang dapat digunakan untuk memantau ketinggian air tanah pada metode AWD?",
        options: [
          "Pipa PVC berlubang (pipa pantau)",
          "Termometer tanah",
          "Tensiometer",
          "Anemometer"
        ],
        answer: 0
      }
    ]
  },
  {
    id: 3,
    title: "Pengendalian Hama Terpadu",
    category: "Modul",
    difficulty: "Menengah",
    duration: "25 menit",
    desc: "Pendekatan ramah lingkungan untuk mengelola populasi hama di bawah ambang batas ekonomi.",
    icon: <BookOpen className="w-6 h-6 text-white" />,
    gradient: "from-rose-400 to-rose-600",
    content: [
      "Pengendalian Hama Terpadu (PHT) adalah pendekatan ekologi dalam pengelolaan hama pertanian yang bertujuan untuk menekan populasi hama di bawah ambang batas yang merugikan secara ekonomi, sekaligus menjaga kelestarian lingkungan dan kesehatan manusia.",
      "PHT tidak menolak penggunaan pestisida kimiawi sepenuhnya, melainkan menjadikannya sebagai alternatif terakhir jika metode lain (seperti pengendalian biologi, mekanik, dan budidaya) tidak berhasil. Pemanfaatan musuh alami (predator dan parasitoid) sangat diutamakan dalam sistem ini.",
      "Monitoring rutin lahan sawah adalah kunci keberhasilan PHT. Petani harus rutin melakukan pengamatan untuk mengetahui dinamika populasi hama dan penyakit, sehingga keputusan tindakan pengendalian dapat diambil secara tepat dan akurat."
    ],
    takeaways: [
      "PHT mengutamakan keseimbangan ekosistem dan peran musuh alami.",
      "Pestisida kimiawi digunakan secara bijaksana dan sebagai opsi terakhir.",
      "Pengamatan rutin (monitoring) sangat penting untuk pengambilan keputusan yang tepat."
    ],
    quiz: [
      {
        question: "Dalam prinsip PHT, kapan pestisida kimiawi sebaiknya digunakan?",
        options: [
          "Sebagai tindakan pencegahan rutin setiap minggu",
          "Sebagai langkah pertama saat melihat satu ekor hama",
          "Sebagai alternatif terakhir ketika populasi hama melebihi ambang batas ekonomi",
          "Setiap kali setelah turun hujan"
        ],
        answer: 2
      },
      {
        question: "Apa komponen utama yang sangat diutamakan dalam pengendalian hama metode PHT?",
        options: [
          "Penggunaan pupuk kimia",
          "Pemanfaatan musuh alami (predator/parasitoid)",
          "Pembakaran jerami sisa panen",
          "Penyemprotan fungisida sistemik"
        ],
        answer: 1
      }
    ]
  },
  {
    id: 4,
    title: "Pasca Panen & Pengeringan Gabah",
    category: "Video",
    difficulty: "Pemula",
    duration: "15 menit",
    desc: "Teknik meminimalkan kehilangan hasil dan menjaga mutu beras pasca panen yang sesuai standar.",
    icon: <Video className="w-6 h-6 text-white" />,
    gradient: "from-amber-400 to-amber-600",
    content: [
      "Penanganan pasca panen padi merupakan tahapan kritis yang menentukan kualitas beras dan meminimalisir kehilangan hasil (food loss). Panen yang terlambat atau terlalu cepat akan mempengaruhi persentase beras kepala dan beras patah saat penggilingan.",
      "Pengeringan gabah harus segera dilakukan setelah perontokan untuk mencegah tumbuhnya jamur dan penurunan kualitas (gabah menguning/kusam). Kadar air gabah ideal untuk disimpan atau digiling adalah sekitar 14%.",
      "Penggunaan alat pengering mekanis (bed dryer atau sirculating dryer) lebih disarankan dibanding penjemuran di lantai jemur terbuka, terutama saat musim hujan, karena suhu dapat dikontrol dan hasilnya lebih seragam."
    ],
    takeaways: [
      "Panen pada waktu yang tepat sangat penting untuk kualitas rendemen beras.",
      "Segera keringkan gabah setelah dirontokkan hingga kadar air mencapai 14%.",
      "Pengering mekanis memberikan hasil pengeringan yang lebih stabil dan seragam."
    ],
    quiz: [
      {
        question: "Berapa persentase kadar air gabah yang ideal untuk disimpan atau digiling?",
        options: [
          "10%",
          "14%",
          "18%",
          "22%"
        ],
        answer: 1
      },
      {
        question: "Mengapa pengeringan mekanis lebih disarankan saat musim hujan?",
        options: [
          "Bisa menghasilkan gabah lebih berat",
          "Suhu dapat dikontrol dan hasil lebih seragam",
          "Membuat gabah cepat berkecambah",
          "Meningkatkan aroma beras"
        ],
        answer: 1
      }
    ]
  },
  {
    id: 5,
    title: "Pertanian Organik & Berkelanjutan",
    category: "Artikel",
    difficulty: "Lanjutan",
    duration: "30 menit",
    desc: "Sistem budidaya holistik untuk memperbaiki kesuburan tanah dan menghasilkan produk pertanian sehat.",
    icon: <FileText className="w-6 h-6 text-white" />,
    gradient: "from-teal-400 to-teal-600",
    content: [
      "Pertanian organik adalah sistem budidaya yang mengandalkan bahan-bahan alami dan menghindari penggunaan bahan kimia sintetis (pupuk dan pestisida kimia). Fokus utamanya adalah membangun kesehatan dan kesuburan tanah jangka panjang melalui penambahan bahan organik seperti kompos dan pupuk kandang.",
      "Selain menghasilkan produk pangan yang lebih sehat dan aman dari residu kimia, pertanian berkelanjutan juga menjaga biodiversitas lingkungan. Rotasi tanaman dan tumpang sari sering diterapkan untuk memutus siklus hidup hama serta mengoptimalkan penggunaan hara.",
      "Meskipun pada fase awal konversi (dari konvensional ke organik) produktivitas mungkin sedikit menurun, dalam jangka panjang tanah akan menjadi lebih subur, berdaya tahan terhadap cekaman lingkungan, dan nilai jual produk organik jauh lebih tinggi."
    ],
    takeaways: [
      "Fokus pada perbaikan dan pemeliharaan kesehatan biologis tanah.",
      "Hindari penggunaan input kimia sintetis dalam bentuk apapun.",
      "Produk organik memiliki nilai ekonomi tinggi dan aman bagi konsumen."
    ],
    quiz: [
      {
        question: "Apa fokus utama dari sistem pertanian organik?",
        options: [
          "Mendapatkan hasil panen terbesar dalam waktu tersingkat",
          "Menggunakan bibit transgenik (GMO)",
          "Membangun kesehatan dan kesuburan biologis tanah",
          "Membasmi seluruh serangga di lahan sawah"
        ],
        answer: 2
      },
      {
        question: "Mengapa rotasi tanaman penting dalam pertanian berkelanjutan?",
        options: [
          "Mempercepat waktu panen padi",
          "Memutus siklus hidup hama tertentu dan mengoptimalkan penyerapan hara",
          "Membuat sawah terlihat lebih indah",
          "Mengurangi tenaga kerja saat panen"
        ],
        answer: 1
      }
    ]
  },
  {
    id: 6,
    title: "Pemasaran Hasil Tani Digital",
    category: "Modul",
    difficulty: "Menengah",
    duration: "20 menit",
    desc: "Strategi menjual hasil panen melalui platform e-commerce dan media sosial untuk memutus rantai pasok.",
    icon: <BookOpen className="w-6 h-6 text-white" />,
    gradient: "from-indigo-400 to-indigo-600",
    content: [
      "Pemasaran digital membuka peluang bagi petani untuk menjangkau konsumen akhir secara langsung, memotong rantai pasok tradisional yang seringkali panjang dan merugikan margin keuntungan petani. Platform e-commerce dan media sosial adalah alat utama dalam strategi ini.",
      "Branding produk (seperti kemasan yang menarik, label sertifikasi, dan cerita di balik produk) sangat berpengaruh dalam menarik minat pembeli online. Transparansi proses budidaya juga menambah nilai kepercayaan (trust) dari konsumen.",
      "Kolaborasi dalam kelompok tani (Gapoktan) sangat disarankan untuk memenuhi kuota permintaan pasar online dan menekan biaya logistik pengiriman. Membangun basis pelanggan tetap melalui sistem berlangganan (subscription) juga bisa menjadi strategi jangka panjang yang menguntungkan."
    ],
    takeaways: [
      "Gunakan e-commerce untuk memutus rantai pasok dan menaikkan margin keuntungan.",
      "Kemasan yang menarik dan branding yang kuat adalah kunci penjualan online.",
      "Kolaborasi Gapoktan membantu dalam memenuhi skala ekonomi logistik."
    ],
    quiz: [
      {
        question: "Keuntungan utama memasarkan produk secara digital bagi petani adalah?",
        options: [
          "Terbebas dari pajak penjualan",
          "Tidak perlu mengurus perizinan",
          "Mampu menjangkau konsumen langsung dan memutus rantai pasok",
          "Harga jual selalu naik setiap hari"
        ],
        answer: 2
      },
      {
        question: "Mengapa petani disarankan berkolaborasi dalam Gapoktan saat memasuki pasar online?",
        options: [
          "Agar mendapat subsidi kuota internet",
          "Untuk memenuhi volume permintaan pasar dan menekan biaya logistik",
          "Karena diwajibkan oleh platform e-commerce",
          "Untuk menghindari persaingan harga antar petani"
        ],
        answer: 1
      }
    ]
  }
];

type EducationModule = (typeof modulData)[number];

export default function EdukasiPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [completedModules, setCompletedModules] = useState<number[]>([]);
  const [activeModule, setActiveModule] = useState<EducationModule | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});

  const progressPercentage = modulData.length > 0 ? (completedModules.length / modulData.length) * 100 : 0;

  useEffect(() => {
    if (isAuthLoading) return;
    const loadProgress = window.setTimeout(() => setCompletedModules(educationService.getCompletedModules(user?.id)), 0);
    return () => window.clearTimeout(loadProgress);
  }, [isAuthLoading, user?.id]);

  useEffect(() => {
    if (!activeModule) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveModule(null);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [activeModule]);

  const handleOpenModule = (modul: EducationModule) => {
    setActiveModule(modul);
    setQuizAnswers({});
  };

  const handleCloseModule = () => {
    setActiveModule(null);
  };

  const handleQuizChange = (qIndex: number, optionIndex: number) => {
    setQuizAnswers(prev => ({
      ...prev,
      [qIndex]: optionIndex
    }));
  };

  const handleFinishModule = () => {
    if (!activeModule) return;
    // Validate quiz
    let allCorrect = true;
    activeModule.quiz.forEach((q, idx: number) => {
      if (quizAnswers[idx] !== q.answer) {
        allCorrect = false;
      }
    });

    if (activeModule.quiz.length > 0 && !allCorrect) {
      toast.error('Jawaban kuis belum tepat', {
        description: 'Silakan periksa kembali jawaban kuis Anda sebelum menyelesaikan modul.'
      });
      return;
    }

    if (!completedModules.includes(activeModule.id)) {
      setCompletedModules(educationService.markModuleCompleted(activeModule.id, user?.id));
      toast.success('Modul Selesai!', {
        description: `Anda telah menyelesaikan modul ${activeModule.title}`
      });
    }
    handleCloseModule();
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 pt-16 sm:pt-20">
      <div className="container mx-auto max-w-6xl px-4 py-8 sm:py-12 lg:px-8">
        <div className="mb-10 text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
            <Sprout className="h-4 w-4" /> Belajar dan bertumbuh
          </span>
          <h1 className="text-display font-bold text-slate-800 mb-4">Pusat Edukasi Pertanian</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Tingkatkan produktivitas lahan Anda melalui panduan praktis, video tutorial, dan modul budidaya padi berbasis praktik pertanian modern yang baik (GAP).
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-10 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:mb-12 sm:p-6">
          <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="font-bold text-slate-800 flex items-center">
              <Award className="w-5 h-5 mr-2 text-primary-600" />
              Progres Pembelajaran Anda
            </h3>
            <span className="text-sm font-semibold text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
              {completedModules.length} dari {modulData.length} modul selesai
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-3 mb-1 overflow-hidden">
            <motion.div
              className="bg-primary-500 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Featured Video */}
        <div className="mb-16">
          <h2 className="text-h3 font-bold text-slate-800 mb-6 flex items-center">
            <Video className="w-6 h-6 mr-2 text-primary-600" /> Video Pilihan
          </h2>
          <Card className="overflow-hidden border-none shadow-xl shadow-emerald-900/10">
            <div className="group relative flex h-[340px] cursor-pointer items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-800 to-lime-600 sm:h-[420px]">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />
              <div className="absolute -right-16 -top-20 h-72 w-72 rounded-full bg-lime-300/20 blur-3xl" />
              <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl" />
              <Sprout className="absolute right-[12%] top-[14%] h-40 w-40 rotate-6 text-white/10 transition-transform duration-700 group-hover:scale-110 sm:h-56 sm:w-56" />
              <Sun className="absolute left-[10%] top-[14%] h-16 w-16 text-amber-300/40" />
              <div className="absolute left-[8%] top-1/2 hidden -translate-y-1/2 rounded-2xl border border-white/15 bg-white/10 p-4 text-white backdrop-blur-md sm:block">
                <TrendingUp className="mb-2 h-6 w-6 text-lime-300" />
                <p className="text-2xl font-extrabold">+15%</p>
                <p className="text-xs text-emerald-100">potensi produktivitas</p>
              </div>
              <div className="absolute z-10 w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-primary-600 transition-colors">
                <PlayCircle className="w-12 h-12 text-white" />
              </div>
              <div className="absolute bottom-6 left-6 z-10 text-white right-6">
                <span className="bg-primary-600 text-xs px-2 py-1 rounded mb-2 inline-block font-medium">Praktik Terbaik</span>
                <h3 className="text-lg font-bold sm:text-2xl">Teknologi Tanam Jajar Legowo</h3>
                <p className="mt-1 hidden max-w-2xl text-slate-200 min-[420px]:line-clamp-2">Mengoptimalkan penyerapan sinar matahari dan sirkulasi udara untuk meningkatkan produktivitas hingga 15%.</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Module Grid */}
        <div>
          <h2 className="text-h3 font-bold text-slate-800 mb-6">Modul Pembelajaran</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modulData.map((item) => {
              const isCompleted = completedModules.includes(item.id);

              return (
                <Card key={item.id} className={`hover:shadow-card-hover transition-all flex flex-col overflow-hidden border-2 ${isCompleted ? 'border-green-200' : 'border-transparent'}`}>
                  <div className={`h-24 bg-gradient-to-r ${item.gradient} p-4 relative overflow-hidden flex items-end justify-between`}>
                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm p-2 rounded-xl">
                      {item.icon}
                    </div>
                    {isCompleted && (
                      <div className="absolute top-4 left-4 bg-green-500 text-white px-2 py-1 rounded-md text-xs font-bold flex items-center shadow-sm">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Selesai
                      </div>
                    )}
                  </div>

                  <CardContent className="p-6 pt-5 flex flex-col flex-1 relative bg-white">
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-1 rounded flex items-center">
                        {item.category}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-1 rounded flex items-center">
                        <BarChart className="w-3 h-3 mr-1" /> {item.difficulty}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-1 rounded flex items-center">
                        <Clock className="w-3 h-3 mr-1" /> {item.duration}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-800 mb-2 text-lg leading-snug">{item.title}</h3>
                    <p className="text-sm text-slate-600 mb-6 flex-1 line-clamp-3">{item.desc}</p>

                    <Button
                      variant={isCompleted ? "outline" : "primary"}
                      className={`w-full ${isCompleted ? 'text-green-700 border-green-200 hover:bg-green-50' : 'bg-primary-600 hover:bg-primary-700 text-white'}`}
                      onClick={() => handleOpenModule(item)}
                    >
                      {isCompleted ? 'Ulangi Modul' : 'Pelajari Sekarang'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal / Expanded View for Module */}
      <AnimatePresence>
        {activeModule && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={handleCloseModule}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="education-module-title"
              className="relative z-10 flex max-h-[calc(100dvh-1.5rem)] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:max-h-[90vh]"
            >
              {/* Header */}
              <div className={`shrink-0 bg-gradient-to-r ${activeModule.gradient} p-6 sm:p-8 text-white relative`}>
                <button
                  aria-label="Tutup modul"
                  onClick={handleCloseModule}
                  className="absolute top-4 right-4 p-2 bg-black/10 hover:bg-black/20 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
                <div className="flex flex-wrap items-center gap-3 mb-4 pr-10">
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                    {activeModule.category}
                  </span>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm flex items-center">
                    <Clock className="w-4 h-4 mr-1" /> {activeModule.duration}
                  </span>
                </div>
                <h2 id="education-module-title" className="text-2xl sm:text-3xl font-bold leading-tight pr-10">{activeModule.title}</h2>
              </div>

              {/* Content */}
              <div className="overflow-y-auto p-6 sm:p-8 flex-1">
                <div className="prose prose-slate max-w-none">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">Materi Pembelajaran</h3>
                  <div className="space-y-4 text-slate-600 mb-8">
                    {activeModule.content.map((p: string, i: number) => (
                      <p key={i} className="leading-relaxed">{p}</p>
                    ))}
                  </div>

                  <div className="bg-amber-50 rounded-xl p-5 mb-8 border border-amber-100">
                    <h4 className="font-bold text-amber-900 flex items-center mb-3">
                      <Award className="w-5 h-5 mr-2" /> Poin Penting (Takeaways)
                    </h4>
                    <ul className="space-y-2">
                      {activeModule.takeaways.map((point: string, i: number) => (
                        <li key={i} className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-amber-600 mr-2 shrink-0 mt-0.5" />
                          <span className="text-amber-800">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {activeModule.quiz && activeModule.quiz.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Kuis Singkat</h3>
                      <div className="space-y-6">
                        {activeModule.quiz.map((q, qIdx: number) => (
                          <div key={qIdx} className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                            <p className="font-semibold text-slate-800 mb-3">{qIdx + 1}. {q.question}</p>
                            <div className="space-y-2">
                              {q.options.map((opt: string, optIdx: number) => (
                                <label
                                  key={optIdx}
                                  className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                                    quizAnswers[qIdx] === optIdx
                                      ? 'bg-primary-50 border-primary-300'
                                      : 'bg-white border-slate-200 hover:border-primary-200 hover:bg-slate-50'
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    name={`quiz-${qIdx}`}
                                    className="w-4 h-4 text-primary-600 border-slate-300 focus:ring-primary-500 mr-3"
                                    checked={quizAnswers[qIdx] === optIdx}
                                    onChange={() => handleQuizChange(qIdx, optIdx)}
                                  />
                                  <span className="text-slate-700">{opt}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex shrink-0 flex-col-reverse gap-2 rounded-b-2xl border-t bg-slate-50 p-3 min-[420px]:flex-row min-[420px]:justify-end sm:gap-3 sm:p-6">
                <Button variant="outline" onClick={handleCloseModule} className="w-full text-slate-600 min-[420px]:w-auto">
                  Kembali
                </Button>
                <Button
                  onClick={handleFinishModule}
                  className="w-full bg-primary-600 text-white hover:bg-primary-700 min-[420px]:w-auto"
                  disabled={activeModule.quiz && activeModule.quiz.length > 0 && Object.keys(quizAnswers).length !== activeModule.quiz.length}
                >
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Selesai & Tandai Berhasil
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
