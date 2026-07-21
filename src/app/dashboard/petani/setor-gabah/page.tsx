'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle2, Truck, MapPin } from 'lucide-react';

export default function SetorGabahPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [method, setMethod] = useState('antar'); // antar or jemput

  const [formData, setFormData] = useState({
    berat: '',
    tanggal: '',
    lokasi: 'Sawah Blok A, Ngawi', // Default
    catatan: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  const resetForm = () => {
    setIsSuccess(false);
    setFormData({
      berat: '',
      tanggal: '',
      lokasi: 'Sawah Blok A, Ngawi',
      catatan: ''
    });
  };

  if (isSuccess) {
    return (
      <div className="max-w-md mx-auto mt-12">
        <Card className="text-center border-nadi-tani/30 shadow-sm">
          <CardContent className="pt-10 pb-8 flex flex-col items-center">
            <CheckCircle2 className="w-16 h-16 text-nadi-tani mb-4" />
            <h2 className="text-2xl font-bold text-nadi-tua mb-2">Jadwal Berhasil Dibuat</h2>
            <p className="text-muted-foreground mb-6">
              {method === 'jemput' 
                ? 'Tim DAI akan menjemput gabah Anda sesuai jadwal. (Simulasi)' 
                : 'Silakan antar gabah Anda ke DAI terdekat sesuai jadwal. (Simulasi)'}
            </p>
            <div className="bg-nadi-muda/30 w-full p-4 rounded-lg mb-6 text-sm text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Metode</span>
                <span className="font-medium">{method === 'jemput' ? 'Penjemputan' : 'Antar Mandiri'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estimasi Berat</span>
                <span className="font-medium">{formData.berat} Kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tanggal</span>
                <span className="font-medium">
                  {formData.tanggal ? new Date(formData.tanggal).toLocaleDateString('id-ID') : '-'}
                </span>
              </div>
            </div>
            <Button onClick={resetForm} className="w-full bg-nadi-tani hover:bg-nadi-tua text-white">
              Buat Jadwal Baru
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-nadi-tua">Setor Gabah</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Jadwalkan penyetoran gabah Anda ke DAI.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Formulir Penyetoran</CardTitle>
          <CardDescription>Pilih metode yang paling memudahkan Anda.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="antar" onValueChange={setMethod} className="w-full mb-6">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="antar" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Antar Mandiri
              </TabsTrigger>
              <TabsTrigger value="jemput" className="flex items-center gap-2">
                <Truck className="w-4 h-4" /> Penjemputan
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="antar" className="text-sm text-muted-foreground p-3 bg-slate-50 rounded-md border border-slate-100">
              Anda akan mengantar sendiri gabah ke lokasi DAI Ngawi.
            </TabsContent>
            <TabsContent value="jemput" className="text-sm text-muted-foreground p-3 bg-nadi-muda/30 rounded-md border border-nadi-tani/20 text-nadi-tua">
              Truk DAI akan menjemput gabah langsung ke lokasi lahan/rumah Anda.
            </TabsContent>
          </Tabs>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="berat">Estimasi Berat (Kg)</Label>
              <Input 
                id="berat" 
                name="berat"
                type="number" 
                placeholder="Contoh: 2500" 
                required 
                value={formData.berat}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tanggal">Tanggal {method === 'jemput' ? 'Penjemputan' : 'Pengantaran'}</Label>
              <Input 
                id="tanggal" 
                name="tanggal"
                type="date" 
                required 
                value={formData.tanggal}
                onChange={handleChange}
              />
            </div>

            {method === 'jemput' && (
              <div className="space-y-2">
                <Label htmlFor="lokasi">Lokasi Penjemputan</Label>
                <Input 
                  id="lokasi" 
                  name="lokasi"
                  type="text" 
                  required={method === 'jemput'}
                  value={formData.lokasi}
                  onChange={handleChange}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="catatan">Catatan Tambahan (Opsional)</Label>
              <Input 
                id="catatan" 
                name="catatan"
                type="text" 
                placeholder="Contoh: Akses jalan sempit, mohon bawa pick up kecil"
                value={formData.catatan}
                onChange={handleChange}
              />
            </div>

            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full bg-nadi-tani hover:bg-nadi-tua text-white" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Memproses...' : 'Jadwalkan Sekarang'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
