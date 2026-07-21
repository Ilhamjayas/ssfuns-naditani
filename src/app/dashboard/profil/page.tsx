import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export default function ProfilPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Profil Pengguna</h1>
      <Card>
        <CardContent className="p-6 flex flex-col items-center justify-center min-h-[300px]">
          <h2 className="text-xl font-bold text-slate-800">Segera Hadir</h2>
          <p className="text-slate-500 mt-2">Halaman manajemen profil sedang dalam tahap pengembangan.</p>
        </CardContent>
      </Card>
    </div>
  );
}
