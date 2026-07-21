import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Video, FileText, PlayCircle } from 'lucide-react';

export default function EdukasiPage() {
  const modulList = [
    {
      title: "Teknik Pemupukan Berimbang",
      category: "Modul",
      icon: <BookOpen className="w-5 h-5" />,
      desc: "Panduan lengkap memberikan nutrisi yang tepat sesuai fase pertumbuhan padi untuk hasil optimal.",
      color: "text-primary-600",
      bgColor: "bg-primary-100"
    },
    {
      title: "Identifikasi Hama & Penyakit",
      category: "Video",
      icon: <Video className="w-5 h-5" />,
      desc: "Cara mengenali gejala serangan wereng, penggerek batang, dan hawar daun bakteri sejak dini.",
      color: "text-info",
      bgColor: "bg-info-light"
    },
    {
      title: "Persiapan Lahan Menjelang Tanam",
      category: "Artikel",
      icon: <FileText className="w-5 h-5" />,
      desc: "Langkah-langkah pengolahan tanah yang baik untuk memastikan perakaran padi tumbuh sempurna.",
      color: "text-gold-dark",
      bgColor: "bg-gold-light"
    },
    {
      title: "Panen Tepat Waktu",
      category: "Modul",
      icon: <BookOpen className="w-5 h-5" />,
      desc: "Ciri-ciri gabah siap panen untuk menekan angka kehilangan hasil (food loss) dan menjaga kualitas rendemen.",
      color: "text-warning",
      bgColor: "bg-warning-light"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pt-20">
      <div className="container mx-auto px-4 lg:px-8 py-12 max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-display font-bold text-slate-800 mb-4">Pusat Edukasi Pertanian</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Tingkatkan produktivitas lahan Anda melalui panduan praktis, video tutorial, dan modul budidaya padi berbasis praktik pertanian modern yang baik (GAP).
          </p>
        </div>

        {/* Featured Video */}
        <div className="mb-16">
          <h2 className="text-h3 font-bold text-slate-800 mb-6 flex items-center">
            <Video className="w-6 h-6 mr-2 text-primary-600" /> Video Pilihan
          </h2>
          <Card className="overflow-hidden border-none shadow-lg">
            <div className="relative aspect-video bg-slate-800 flex items-center justify-center group cursor-pointer">
              {/* This is a placeholder for an actual video thumbnail */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <img 
                src="https://images.unsplash.com/photo-1595804595807-6b0429711ee0?auto=format&fit=crop&q=80&w=1200" 
                alt="Pertanian Padi" 
                className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute z-10 w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-primary-600 transition-colors">
                <PlayCircle className="w-12 h-12 text-white" />
              </div>
              <div className="absolute bottom-6 left-6 z-10 text-white">
                <span className="bg-primary-600 text-xs px-2 py-1 rounded mb-2 inline-block font-medium">Praktik Terbaik</span>
                <h3 className="text-2xl font-bold">Teknologi Tanam Jajar Legowo</h3>
                <p className="text-slate-200 mt-1 max-w-lg line-clamp-2">Mengoptimalkan penyerapan sinar matahari dan sirkulasi udara untuk meningkatkan produktivitas hingga 15%.</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Module Grid */}
        <div>
          <h2 className="text-h3 font-bold text-slate-800 mb-6">Materi Terbaru</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {modulList.map((item, idx) => (
              <Card key={idx} className="hover:shadow-card-hover transition-shadow flex flex-col">
                <CardContent className="p-6 flex flex-col flex-1">
                  <div className={`w-12 h-12 rounded-lg ${item.bgColor} ${item.color} flex items-center justify-center mb-4`}>
                    {item.icon}
                  </div>
                  <div className="mb-2">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{item.category}</span>
                  </div>
                  <h3 className="font-bold text-slate-800 mb-3 text-lg leading-tight">{item.title}</h3>
                  <p className="text-sm text-slate-600 mb-6 flex-1 line-clamp-3">{item.desc}</p>
                  
                  <Button variant="outline" className="w-full text-primary-700 border-primary-200 hover:bg-primary-50">
                    Pelajari Sekarang
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
