'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/lib/auth/AuthContext';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Map, Sprout, Calendar, CreditCard, Landmark, Lock, Save, Camera, ShieldCheck, Factory, BarChart3 } from 'lucide-react';
import { profileService } from '@/lib/services/profile.service';
import { authService } from '@/lib/services/auth.service';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

export default function ProfilPage() {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState('');

  // Form State: Informasi Pribadi
  const [personalInfo, setPersonalInfo] = useState({
    nama: '',
    email: '',
    telepon: '',
    alamat: ''
  });

  // Form State: Informasi Pertanian
  const [farmInfo, setFarmInfo] = useState({
    luasLahan: '',
    jenisTanaman: '',
    lokasiSawah: '',
    tahunMulai: ''
  });

  // Form State: Informasi Rekening
  const [bankInfo, setBankInfo] = useState({
    namaBank: 'BRI',
    noRekening: '',
    atasNama: ''
  });

  // Form State: Keamanan Akun
  const [securityInfo, setSecurityInfo] = useState({
    passwordLama: '',
    passwordBaru: '',
    konfirmasiPassword: ''
  });

  useEffect(() => {
    if (!user) return;
    const initializeProfile = window.setTimeout(() => {
      const defaults = {
        personal: {
          nama: user.name || 'Pengguna',
          email: user.email || 'pengguna@naditani.id',
          telepon: '081234567890',
          alamat: 'Jl. Pertanian No. 1, Desa Makmur, Jawa Timur'
        },
        farm: user.role === 'petani' ? {
          luasLahan: '2.5',
          jenisTanaman: 'Padi IR64',
          lokasiSawah: 'Blok Sawah Timur',
          tahunMulai: '2015'
        } : undefined,
        bank: user.role === 'petani' ? {
          namaBank: 'BRI',
          noRekening: '1234567890',
          atasNama: user.name || 'Petani'
        } : user.role === 'mitra' ? {
          namaBank: 'Mandiri',
          noRekening: '0987654321',
          atasNama: user.name || 'Mitra'
        } : undefined,
      };
      const saved = profileService.getProfile(user.id);
      setAvatarUrl(saved?.avatarUrl || '');
      setPersonalInfo(saved?.personal || defaults.personal);

      if (saved?.farm || defaults.farm) setFarmInfo(saved?.farm || defaults.farm!);
      if (saved?.bank || defaults.bank) setBankInfo(saved?.bank || defaults.bank!);
    }, 0);
    return () => window.clearTimeout(initializeProfile);
  }, [user]);

  const profileCompleteness = (() => {
    const values = [...Object.values(personalInfo), avatarUrl];
    if (user?.role === 'petani') values.push(...Object.values(farmInfo), ...Object.values(bankInfo));
    if (user?.role === 'mitra') values.push(...Object.values(bankInfo));
    const filled = values.filter(value => String(value).trim().length > 0).length;
    return values.length > 0 ? Math.round((filled / values.length) * 100) : 0;
  })();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'petani':
        return <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-xs font-medium border border-primary-200 flex items-center gap-1"><Sprout className="w-3 h-3"/> Petani</span>;
      case 'investor':
        return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium border border-blue-200 flex items-center gap-1"><Landmark className="w-3 h-3"/> Investor</span>;
      case 'mitra':
        return <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-medium border border-amber-200 flex items-center gap-1"><CreditCard className="w-3 h-3"/> Mitra</span>;
      case 'admin':
        return <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-medium border border-slate-200 flex items-center gap-1"><ShieldCheck className="w-3 h-3"/> Admin</span>;
      case 'operator_atm':
      case 'pengelola_dai':
        return <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium border border-emerald-200 flex items-center gap-1"><Factory className="w-3 h-3"/> Operator DAI</span>;
      case 'pemerintah':
        return <span className="bg-violet-100 text-violet-700 px-3 py-1 rounded-full text-xs font-medium border border-violet-200 flex items-center gap-1"><BarChart3 className="w-3 h-3"/> Pemerintah</span>;
      default:
        return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium border border-gray-200">Pengguna</span>;
    }
  };

  const handleSavePersonalInfo = (e: React.FormEvent) => {
    e.preventDefault();
    profileService.saveProfile(user!.id, { avatarUrl, personal: personalInfo, farm: farmInfo, bank: bankInfo });
    toast.success('Informasi pribadi tersimpan pada data demo');
  };

  const handleSaveFarmInfo = (e: React.FormEvent) => {
    e.preventDefault();
    profileService.saveProfile(user!.id, { avatarUrl, personal: personalInfo, farm: farmInfo, bank: bankInfo });
    toast.success('Informasi pertanian tersimpan pada data demo');
  };

  const handleSaveBankInfo = (e: React.FormEvent) => {
    e.preventDefault();
    profileService.saveProfile(user!.id, { avatarUrl, personal: personalInfo, farm: farmInfo, bank: bankInfo });
    toast.success('Informasi rekening tersimpan pada data demo');
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('File foto harus berupa gambar');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Ukuran foto maksimal 2 MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const nextAvatar = typeof reader.result === 'string' ? reader.result : '';
      if (!nextAvatar) return;
      setAvatarUrl(nextAvatar);
      profileService.saveProfile(user!.id, { avatarUrl: nextAvatar, personal: personalInfo, farm: farmInfo, bank: bankInfo });
      toast.success('Foto profil berhasil diperbarui');
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const handleSaveSecurityInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!securityInfo.passwordLama || !securityInfo.passwordBaru || !securityInfo.konfirmasiPassword) {
      toast.error('Lengkapi seluruh kolom password');
      return;
    }
    if (securityInfo.passwordBaru !== securityInfo.konfirmasiPassword) {
      toast.error('Konfirmasi password tidak cocok!');
      return;
    }
    try {
      await authService.changePassword(user!, securityInfo.passwordLama, securityInfo.passwordBaru);
      toast.success('Password berhasil diperbarui');
      setSecurityInfo({ passwordLama: '', passwordBaru: '', konfirmasiPassword: '' });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Password gagal diperbarui');
    }
  };

  if (!user) return <div className="p-8 text-center">Memuat data profil...</div>;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <motion.div initial="hidden" animate="visible" variants={fadeIn}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-2 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Profil Pengguna</h1>
            <p className="text-slate-500 mt-1">Kelola informasi pribadi dan pengaturan akun Anda.</p>
          </div>
        </div>
      </motion.div>

      {/* Profile Header */}
      <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ delay: 0.1 }}>
        <Card className="border-slate-200 shadow-sm overflow-hidden">
          <div className="h-24 w-full bg-gradient-to-r from-primary-700 via-emerald-600 to-primary-500 sm:h-28"></div>
          <CardContent className="relative flex flex-col items-center gap-4 p-4 pb-6 pt-0 sm:gap-6 sm:p-6 sm:pb-8 sm:pt-0 md:flex-row md:items-end">
            <div className="relative -mt-12 rounded-full bg-white p-1.5 shadow-md sm:-mt-16">
              <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-primary-100 text-2xl font-bold text-primary-700 shadow-inner sm:h-28 sm:w-28 sm:text-3xl">
                {avatarUrl ? <Image src={avatarUrl} alt={`Foto profil ${user.name}`} fill unoptimized className="object-cover" sizes="112px" /> : getInitials(user.name)}
                <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={handleAvatarUpload} className="sr-only" />
                <button type="button" aria-label="Ubah foto profil" onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 z-10 flex w-full cursor-pointer items-center justify-center bg-black/55 py-1.5 text-xs text-white opacity-100 transition-opacity sm:opacity-0 sm:hover:opacity-100">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                <h2 className="break-words text-xl font-bold text-slate-800 sm:text-2xl">{user.name}</h2>
                {getRoleBadge(user.role)}
              </div>
              <p className="mt-1 flex min-w-0 items-center justify-center gap-2 break-all text-sm text-slate-500 sm:text-base md:justify-start">
                <Mail className="w-4 h-4" /> {user.email}
              </p>
            </div>
            <div className="w-full rounded-2xl border border-emerald-100 bg-emerald-50 p-4 md:w-56">
              <div className="flex items-center justify-between text-xs font-semibold text-emerald-800"><span>Kelengkapan profil</span><span>{profileCompleteness}%</span></div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-emerald-100"><div className="h-full rounded-full bg-emerald-600 transition-all" style={{ width: `${profileCompleteness}%` }} /></div>
              <p className="mt-2 text-[11px] leading-relaxed text-emerald-700">Lengkapi data untuk mempercepat layanan DAI.</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Form: Informasi Pribadi */}
          <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ delay: 0.2 }}>
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-5 h-5 text-primary-600" /> Informasi Pribadi
                </CardTitle>
                <CardDescription>Perbarui data diri dan kontak Anda</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSavePersonalInfo} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nama">Nama Lengkap</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          id="nama"
                          value={personalInfo.nama}
                          onChange={(e) => setPersonalInfo({...personalInfo, nama: e.target.value})}
                          className="pl-9"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Alamat Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          id="email"
                          type="email"
                          value={personalInfo.email}
                          onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
                          className="pl-9"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telepon">No. Telepon / WhatsApp</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          id="telepon"
                          value={personalInfo.telepon}
                          onChange={(e) => setPersonalInfo({...personalInfo, telepon: e.target.value})}
                          className="pl-9"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="alamat">Alamat Lengkap</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="alamat"
                        value={personalInfo.alamat}
                        onChange={(e) => setPersonalInfo({...personalInfo, alamat: e.target.value})}
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <div className="pt-4 flex justify-end">
                    <Button type="submit" className="flex items-center gap-2">
                      <Save className="w-4 h-4" /> Simpan Perubahan
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Form: Informasi Pertanian (Only for Petani) */}
          {user.role === 'petani' && (
            <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ delay: 0.3 }}>
              <Card className="border-slate-200 shadow-sm border-t-4 border-t-green-500">
                <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sprout className="w-5 h-5 text-green-600" /> Profil Pertanian
                  </CardTitle>
                  <CardDescription>Informasi detail mengenai lahan dan aktivitas bertani Anda</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={handleSaveFarmInfo} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="luasLahan">Luas Lahan (Hektar)</Label>
                        <div className="relative">
                          <Map className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <Input
                            id="luasLahan"
                            type="number"
                            step="0.1"
                            value={farmInfo.luasLahan}
                            onChange={(e) => setFarmInfo({...farmInfo, luasLahan: e.target.value})}
                            className="pl-9"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="jenisTanaman">Jenis Tanaman Utama</Label>
                        <div className="relative">
                          <Sprout className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <Input
                            id="jenisTanaman"
                            value={farmInfo.jenisTanaman}
                            onChange={(e) => setFarmInfo({...farmInfo, jenisTanaman: e.target.value})}
                            className="pl-9"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lokasiSawah">Lokasi Sawah / Blok</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <Input
                            id="lokasiSawah"
                            value={farmInfo.lokasiSawah}
                            onChange={(e) => setFarmInfo({...farmInfo, lokasiSawah: e.target.value})}
                            className="pl-9"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tahunMulai">Tahun Mulai Bertani</Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <Input
                            id="tahunMulai"
                            type="number"
                            value={farmInfo.tahunMulai}
                            onChange={(e) => setFarmInfo({...farmInfo, tahunMulai: e.target.value})}
                            className="pl-9"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="pt-4 flex justify-end">
                      <Button type="submit" variant="outline" className="flex items-center gap-2 border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800">
                        <Save className="w-4 h-4" /> Simpan Info Pertanian
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        <div className="space-y-6">
          {/* Form: Informasi Rekening (Petani & Mitra) */}
          {(user.role === 'petani' || user.role === 'mitra') && (
            <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ delay: 0.4 }}>
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Landmark className="w-5 h-5 text-amber-600" /> Data Rekening
                  </CardTitle>
                  <CardDescription>Untuk keperluan pencairan dana & transaksi</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={handleSaveBankInfo} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="namaBank">Nama Bank</Label>
                      <select
                        id="namaBank"
                        value={bankInfo.namaBank}
                        onChange={(e) => setBankInfo({...bankInfo, namaBank: e.target.value})}
                        className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="BRI">Bank Rakyat Indonesia (BRI)</option>
                        <option value="BNI">Bank Negara Indonesia (BNI)</option>
                        <option value="Mandiri">Bank Mandiri</option>
                        <option value="BCA">Bank Central Asia (BCA)</option>
                        <option value="BSI">Bank Syariah Indonesia (BSI)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="noRekening">Nomor Rekening</Label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          id="noRekening"
                          value={bankInfo.noRekening}
                          onChange={(e) => setBankInfo({...bankInfo, noRekening: e.target.value})}
                          className="pl-9"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="atasNama">Atas Nama</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          id="atasNama"
                          value={bankInfo.atasNama}
                          onChange={(e) => setBankInfo({...bankInfo, atasNama: e.target.value})}
                          className="pl-9"
                        />
                      </div>
                    </div>
                    <div className="pt-2">
                      <Button type="submit" variant="secondary" className="w-full flex items-center justify-center gap-2">
                        <Save className="w-4 h-4" /> Simpan Rekening
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Form: Keamanan Akun */}
          <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ delay: 0.5 }}>
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
                <CardTitle className="text-lg flex items-center gap-2 text-red-600">
                  <Lock className="w-5 h-5" /> Keamanan Akun
                </CardTitle>
                <CardDescription>Ubah kata sandi untuk keamanan</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSaveSecurityInfo} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="passwordLama">Password Saat Ini</Label>
                    <Input
                      id="passwordLama"
                      type="password"
                      required
                      autoComplete="current-password"
                      value={securityInfo.passwordLama}
                      onChange={(e) => setSecurityInfo({...securityInfo, passwordLama: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="passwordBaru">Password Baru</Label>
                    <Input
                      id="passwordBaru"
                      type="password"
                      required
                      minLength={8}
                      autoComplete="new-password"
                      value={securityInfo.passwordBaru}
                      onChange={(e) => setSecurityInfo({...securityInfo, passwordBaru: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="konfirmasiPassword">Konfirmasi Password Baru</Label>
                    <Input
                      id="konfirmasiPassword"
                      type="password"
                      required
                      minLength={8}
                      autoComplete="new-password"
                      value={securityInfo.konfirmasiPassword}
                      onChange={(e) => setSecurityInfo({...securityInfo, konfirmasiPassword: e.target.value})}
                    />
                  </div>
                  <div className="pt-2">
                    <Button type="submit" variant="danger" className="w-full flex items-center justify-center gap-2">
                      <Lock className="w-4 h-4" /> Perbarui Password
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
