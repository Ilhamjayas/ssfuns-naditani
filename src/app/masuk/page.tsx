'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  AtSign,
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  ShieldCheck,
  Sprout,
  UserRound,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { DEMO_CREDENTIALS } from '@/lib/utils/constants';
import type { UserRole } from '@/lib/types';

const roleLabels: Record<UserRole, string> = {
  petani: 'Petani',
  operator_atm: 'Operator ATM',
  pengelola_dai: 'Pengelola DAI',
  pemerintah: 'Pemerintah',
  mitra: 'Mitra Industri',
  admin: 'Administrator',
};
const registrationRoles = ['petani', 'mitra'] as const;

function getDashboardPath(role: UserRole) {
  if (role === 'petani') return '/dashboard/petani';
  if (role === 'operator_atm' || role === 'pengelola_dai') return '/dashboard/operator-dai';
  if (role === 'pemerintah') return '/dashboard/pemerintah';
  if (role === 'mitra') return '/dashboard/mitra';
  return '/dashboard/admin';
}

export default function MasukPage() {
  const router = useRouter();
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState<string | null>(null);
  const [registerForm, setRegisterForm] = useState({
    name: '',
    username: '',
    email: '',
    role: 'petani' as UserRole,
    password: '',
    confirmPassword: '',
  });

  const switchMode = (nextMode: 'login' | 'register') => {
    setMode(nextMode);
    setError(null);
    if (nextMode === 'register') setRegistrationSuccess(null);
    setShowPassword(false);
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      if (params.get('mode') !== 'register') return;
      const requestedRole = params.get('role');
      const safeRole = registrationRoles.includes(requestedRole as (typeof registrationRoles)[number])
        ? requestedRole as (typeof registrationRoles)[number]
        : 'petani';
      setMode('register');
      setRegisterForm(current => ({ ...current, role: safeRole }));
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const user = await login(identifier, password);
      router.push(getDashboardPath(user.role));
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Tidak dapat masuk ke akun');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (registerForm.password.length < 8) {
      setError('Kata sandi minimal terdiri dari 8 karakter');
      return;
    }
    if (registerForm.password !== registerForm.confirmPassword) {
      setError('Konfirmasi kata sandi belum sama');
      return;
    }

    setIsSubmitting(true);
    try {
      await register({
        name: registerForm.name,
        username: registerForm.username,
        email: registerForm.email,
        password: registerForm.password,
        role: registerForm.role,
      });
      setIdentifier(registerForm.username);
      setPassword('');
      setRegistrationSuccess('Pendaftaran berhasil dikirim. Akun dapat digunakan setelah diverifikasi administrator.');
      setMode('login');
    } catch (registerError) {
      setError(registerError instanceof Error ? registerError.message : 'Pendaftaran belum dapat diproses');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemoAccount = (credential: (typeof DEMO_CREDENTIALS)[number]) => {
    switchMode('login');
    setIdentifier(credential.username);
    setPassword(credential.password);
  };

  return (
    <div className="relative min-h-[100svh] overflow-hidden bg-[#F7F3E8] p-3 sm:p-5 lg:p-7">
      <div className="pointer-events-none absolute -left-32 -top-36 h-96 w-96 rounded-full bg-emerald-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-36 -right-24 h-96 w-96 rounded-full bg-amber-200/30 blur-3xl" />

      <Link href="/" className="absolute left-5 top-5 z-20 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-4 py-2 text-sm font-bold text-emerald-900 shadow-sm backdrop-blur-md transition-colors hover:bg-white sm:left-8 sm:top-8">
        <ArrowLeft className="h-4 w-4" />
        <span className="hidden min-[390px]:inline">Kembali ke Beranda</span>
        <span className="min-[390px]:hidden">Kembali</span>
      </Link>

      <div className="relative z-10 mx-auto grid min-h-[calc(100svh-1.5rem)] max-w-6xl overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/75 shadow-2xl shadow-emerald-950/10 backdrop-blur-xl sm:min-h-[calc(100svh-2.5rem)] lg:grid-cols-[0.88fr_1.12fr]">
        <section className="relative hidden overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-800 to-lime-600 p-10 text-white lg:flex lg:flex-col xl:p-14">
          <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-lime-300/20 blur-3xl" />
          <Sprout className="absolute -bottom-16 -right-10 h-80 w-80 rotate-6 text-white/10" />

          <div className="relative mt-16 flex items-center gap-3">
            <div className="relative h-14 w-14 rounded-2xl bg-white p-2 shadow-lg">
              <Image src="/logo/logo-bulat-v2.png" alt="NADI-TANI" fill sizes="56px" className="object-contain p-1.5" priority />
            </div>
            <div>
              <p className="text-xl font-extrabold tracking-tight">NADI-TANI</p>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200">Ekosistem Pertanian Terpadu</p>
            </div>
          </div>

          <div className="relative my-auto py-12">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-emerald-100">
              <ShieldCheck className="h-4 w-4" /> Satu akun, semua terhubung
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-tight xl:text-5xl">Masuk ke ekosistem pangan yang lebih transparan.</h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-emerald-100">Kelola setoran, produksi, transaksi, pasar, dan data kebijakan sesuai peran Anda dalam satu sistem.</p>

            <div className="mt-8 space-y-4">
              {[
                'Data antarakun tersinkron dalam simulasi',
                'Proses setoran dan mutu dapat dilacak',
                'Dashboard disesuaikan dengan peran pengguna',
              ].map(item => (
                <div key={item} className="flex items-center gap-3 text-sm font-semibold text-white/90">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10"><CheckCircle2 className="h-4 w-4 text-lime-300" /></span>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <p className="relative text-xs text-emerald-200">Data demonstrasi untuk visualisasi ekosistem NADI-TANI.</p>
        </section>

        <section className="flex items-center justify-center px-4 pb-8 pt-24 sm:px-8 sm:pb-10 sm:pt-28 lg:px-12 lg:py-12 xl:px-16">
          <div className="w-full max-w-xl">
            <div className="mb-7 flex items-center gap-3 lg:hidden">
              <div className="relative h-12 w-12 shrink-0">
                <Image src="/logo/logo-bulat-v2.png" alt="NADI-TANI" fill sizes="48px" className="object-contain" priority />
              </div>
              <div>
                <p className="font-extrabold text-emerald-950">NADI-TANI</p>
                <p className="text-xs font-semibold text-emerald-700">Akun ekosistem pertanian</p>
              </div>
            </div>

            <div className="mb-7">
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">{mode === 'login' ? 'Selamat datang kembali' : 'Buat akun NADI-TANI'}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-500 sm:text-base">
                {mode === 'login' ? 'Masukkan username atau email dan kata sandi untuk melanjutkan.' : 'Daftarkan identitas dasar Anda untuk mencoba alur akun baru.'}
              </p>
            </div>

            <div className="mb-7 grid grid-cols-2 rounded-2xl bg-slate-100 p-1.5" role="tablist" aria-label="Pilihan autentikasi">
              <button type="button" role="tab" aria-selected={mode === 'login'} onClick={() => switchMode('login')} className={`rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${mode === 'login' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Masuk</button>
              <button type="button" role="tab" aria-selected={mode === 'register'} onClick={() => switchMode('register')} className={`rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${mode === 'register' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Daftar Akun</button>
            </div>

            {error && <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div>}
            {registrationSuccess && <div role="status" className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold leading-relaxed text-emerald-800"><CheckCircle2 className="mr-2 inline h-4 w-4" />{registrationSuccess}</div>}

            {mode === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label htmlFor="identifier" className="mb-2 block text-sm font-bold text-slate-700">Username atau Email</label>
                  <div className="relative">
                    <AtSign className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input id="identifier" value={identifier} onChange={event => setIdentifier(event.target.value)} autoComplete="username" required placeholder="Contoh: petani" className="h-13 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="mb-2 block text-sm font-bold text-slate-700">Kata Sandi</label>
                  <div className="relative">
                    <LockKeyhole className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={event => setPassword(event.target.value)} autoComplete="current-password" required placeholder="Masukkan kata sandi" className="h-13 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-12 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" />
                    <button type="button" onClick={() => setShowPassword(current => !current)} aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <button type="submit" disabled={isSubmitting} className="flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 text-sm font-extrabold text-white shadow-lg shadow-emerald-700/20 transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60">
                  {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Masuk ke Dashboard <ArrowRight className="h-4 w-4" /></>}
                </button>

                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm font-bold text-emerald-900">Isi akun demo otomatis</p>
                    <p className="text-[11px] font-semibold text-emerald-700">Kata sandi: password123</p>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {DEMO_CREDENTIALS.map(credential => (
                      <button key={credential.role} type="button" onClick={() => fillDemoAccount(credential)} className="rounded-lg border border-emerald-100 bg-white px-3 py-2 text-left transition hover:border-emerald-300 hover:shadow-sm">
                        <span className="block truncate text-xs font-bold text-slate-700">{roleLabels[credential.role]}</span>
                        <span className="mt-0.5 block truncate text-[10px] text-slate-400">@{credential.username}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="register-name" className="mb-2 block text-sm font-bold text-slate-700">Nama Lengkap</label>
                    <div className="relative"><UserRound className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input id="register-name" value={registerForm.name} onChange={event => setRegisterForm(current => ({ ...current, name: event.target.value }))} required placeholder="Nama Anda" className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" /></div>
                  </div>
                  <div>
                    <label htmlFor="register-username" className="mb-2 block text-sm font-bold text-slate-700">Username</label>
                    <div className="relative"><AtSign className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input id="register-username" value={registerForm.username} onChange={event => setRegisterForm(current => ({ ...current, username: event.target.value }))} autoComplete="username" required minLength={3} pattern="[a-zA-Z0-9._-]+" placeholder="username" className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" /></div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="register-email" className="mb-2 block text-sm font-bold text-slate-700">Email</label>
                    <input id="register-email" type="email" value={registerForm.email} onChange={event => setRegisterForm(current => ({ ...current, email: event.target.value }))} autoComplete="email" required placeholder="nama@email.com" className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" />
                  </div>
                  <div>
                    <label htmlFor="register-role" className="mb-2 block text-sm font-bold text-slate-700">Daftar Sebagai</label>
                    <div className="relative"><Building2 className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><select id="register-role" value={registerForm.role} onChange={event => setRegisterForm(current => ({ ...current, role: event.target.value as UserRole }))} className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100">{registrationRoles.map(role => <option key={role} value={role}>{roleLabels[role]}</option>)}</select></div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="register-password" className="mb-2 block text-sm font-bold text-slate-700">Kata Sandi</label>
                    <input id="register-password" type="password" value={registerForm.password} onChange={event => setRegisterForm(current => ({ ...current, password: event.target.value }))} autoComplete="new-password" required minLength={8} placeholder="Minimal 8 karakter" className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" />
                  </div>
                  <div>
                    <label htmlFor="register-confirm" className="mb-2 block text-sm font-bold text-slate-700">Konfirmasi</label>
                    <input id="register-confirm" type="password" value={registerForm.confirmPassword} onChange={event => setRegisterForm(current => ({ ...current, confirmPassword: event.target.value }))} autoComplete="new-password" required minLength={8} placeholder="Ulangi kata sandi" className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" />
                  </div>
                </div>

                <button type="submit" disabled={isSubmitting} className="mt-2 flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 text-sm font-extrabold text-white shadow-lg shadow-emerald-700/20 transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60">
                  {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Kirim Pendaftaran <ArrowRight className="h-4 w-4" /></>}
                </button>
                <p className="text-center text-xs leading-relaxed text-slate-400">Pendaftaran disimpan pada perangkat ini dan akan muncul pada antrean verifikasi Administrator.</p>
              </form>
            )}

            <p className="mt-7 text-center text-xs leading-relaxed text-slate-400">
              Dengan melanjutkan, Anda menyetujui <Link href="/terms" className="font-semibold text-emerald-700 hover:underline">Persyaratan Layanan</Link> dan <Link href="/privacy" className="font-semibold text-emerald-700 hover:underline">Kebijakan Data</Link>.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
