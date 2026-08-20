'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/ui/StatCard';
import { Activity, Users, Database, ShieldCheck, Search, ChevronDown, ChevronUp, AlertCircle, Info, AlertTriangle, RefreshCw, Download, UserCheck, Server, HardDrive, Wifi, CheckCircle2, Clock3, Eye, X, FileCheck2, MapPinned, Cpu, Zap, Mail } from 'lucide-react';
import { analyticsService } from '@/lib/services/analytics.service';
import { Skeleton } from '@/components/ui/skeleton';
import { NationalStats } from '@/lib/types';
import { toast } from 'sonner';
import { authService } from '@/lib/services/auth.service';
import { DEMO_UPDATE_EVENT, getDemoState } from '@/lib/demo/demo-store';

type AdminUser = {
  id: string;
  name: string;
  username?: string;
  role: string;
  status: 'Aktif' | 'Nonaktif' | 'Menunggu' | 'Ditolak';
  date: string;
  registered?: boolean;
  email?: string;
};

const initialUsers: AdminUser[] = [
  { id: 'user-petani-1', name: 'Budi Santoso', username: 'petani', email: 'petani@naditani.id', role: 'Petani', status: 'Aktif', date: '15 Jan 2023' },
  { id: 'user-operator_atm-1', name: 'Agus Pratama', username: 'operator', email: 'operator@naditani.id', role: 'Operator ATM', status: 'Aktif', date: '20 Feb 2023' },
  { id: 'user-pengelola_dai-1', name: 'Bambang Widjaja', username: 'dai', email: 'dai@naditani.id', role: 'Pengelola DAI', status: 'Aktif', date: '10 Mar 2023' },
  { id: 'user-pemerintah-1', name: 'Dinas Pertanian Jatim', username: 'pemerintah', email: 'gov@naditani.id', role: 'Pemerintah', status: 'Aktif', date: '05 Apr 2023' },
  { id: 'user-mitra-1', name: 'PT Beras Makmur', username: 'mitra', email: 'mitra@naditani.id', role: 'Mitra', status: 'Aktif', date: '12 Mei 2023' },
  { id: 'user-admin-1', name: 'System Admin', username: 'admin', email: 'admin@naditani.id', role: 'Admin', status: 'Aktif', date: '18 Jun 2023' },
];

const roleLabels: Record<string, string> = {
  petani: 'Petani',
  operator_atm: 'Operator ATM',
  pengelola_dai: 'Pengelola DAI',
  pemerintah: 'Pemerintah',
  mitra: 'Mitra',
  admin: 'Admin',
};

type VerificationItem = {
  id: string;
  name: string;
  role: string;
  email: string;
  submittedAt: string;
};

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<NationalStats | null>(null);
  const [searchUser, setSearchUser] = useState('');
  const [showFullLogs, setShowFullLogs] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'Semua' | AdminUser['status']>('Semua');
  const [roleFilter, setRoleFilter] = useState('Semua');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState('Baru saja');
  const [verificationQueue, setVerificationQueue] = useState<VerificationItem[]>([]);
  const [selectedActivityIndex, setSelectedActivityIndex] = useState(5);
  const [liveLogs, setLiveLogs] = useState<Array<{ time: string; date: string; action: string; user: string; type: string }>>([]);

  const [mockUsers, setMockUsers] = useState<AdminUser[]>(initialUsers);

  const toggleUserStatus = (id: string) => {
    const selectedUser = mockUsers.find(user => user.id === id);
    if (!selectedUser) return;
    if (id === 'user-admin-1') {
      toast.info('Akun administrator utama tidak dapat dinonaktifkan dari sesi ini');
      return;
    }
    if (!['Aktif', 'Nonaktif'].includes(selectedUser.status)) {
      toast.info('Selesaikan verifikasi akun terlebih dahulu');
      return;
    }
    const nextStatus = selectedUser.status === 'Aktif' ? 'Nonaktif' : 'Aktif';
    try {
      authService.setAccountActive(id, nextStatus === 'Aktif');
      setMockUsers(current => current.map(user => user.id === id ? { ...user, status: nextStatus } : user));
      toast.success(`Akun ${nextStatus === 'Aktif' ? 'diaktifkan' : 'dinonaktifkan'}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Status pengguna gagal diubah');
    }
  };

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchUser.toLowerCase()) || user.role.toLowerCase().includes(searchUser.toLowerCase()) || user.username?.toLowerCase().includes(searchUser.toLowerCase());
    const matchesStatus = statusFilter === 'Semua' || user.status === statusFilter;
    const matchesRole = roleFilter === 'Semua' || user.role === roleFilter;
    return matchesSearch && matchesStatus && matchesRole;
  });
  const availableRoles = Array.from(new Set(mockUsers.map(user => user.role))).sort();
  const activeUsers = mockUsers.filter(user => user.status === 'Aktif').length;
  const inactiveUsers = mockUsers.filter(user => user.status === 'Nonaktif').length;

  const syncData = async () => {
    setIsSyncing(true);
    try {
      const data = await analyticsService.getNationalStats();
      setStats(data);
      await new Promise(resolve => window.setTimeout(resolve, 450));
      setLastSync(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
      toast.success('Data sistem berhasil disinkronkan');
    } catch {
      toast.error('Sinkronisasi data gagal');
    } finally {
      setIsSyncing(false);
    }
  };

  const downloadUserReport = () => {
    const rows = [
      ['Nama', 'Username', 'Peran', 'Status', 'Tanggal Daftar'],
      ...filteredUsers.map(user => [user.name, user.username || '-', user.role, user.status, user.date]),
    ];
    const csv = rows.map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `laporan-pengguna-nadi-tani-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success(`${filteredUsers.length} data pengguna berhasil diekspor`);
  };

  const handleVerification = (item: VerificationItem, approved: boolean) => {
    authService.setRegisteredAccountVerification(item.id, approved ? 'approved' : 'rejected');
    setVerificationQueue(current => current.filter(queueItem => queueItem.id !== item.id));
    setMockUsers(current => current.map(user => user.id === item.id ? { ...user, status: approved ? 'Aktif' : 'Ditolak' } : user));
    toast.success(`${item.name} ${approved ? 'berhasil diverifikasi' : 'dikembalikan untuk diperbaiki'}`);
  };

  const mockLogs = [
    { time: '10:45:22', date: '18 Agt', action: 'Gagal login: Password salah', user: 'budi_tani', type: 'error' },
    { time: '10:30:00', date: '18 Agt', action: 'Penambahan mesin DAI di Ngawi', user: 'System', type: 'info' },
    { time: '09:15:12', date: '18 Agt', action: 'Update harga HPP Beras', user: 'Pemerintah', type: 'info' },
    { time: '08:45:33', date: '18 Agt', action: 'Kapasitas storage melebihi 70%', user: 'System', type: 'warning' },
    { time: '08:00:00', date: '18 Agt', action: 'Backup database harian selesai', user: 'System', type: 'info' },
    { time: '23:45:12', date: '17 Agt', action: 'Registrasi 50 petani baru via batch', user: 'Operator', type: 'info' },
    { time: '20:12:05', date: '17 Agt', action: 'Transaksi gagal: Timeout payment gateway', user: 'PT. Pangan', type: 'error' },
    { time: '15:30:22', date: '17 Agt', action: 'Verifikasi KTP manual disetujui', user: 'Admin', type: 'info' },
    { time: '11:20:10', date: '17 Agt', action: 'Pengajuan pinjaman baru', user: 'KUD Tani', type: 'info' },
    { time: '09:05:00', date: '17 Agt', action: 'API Rate limit tercapai', user: 'System', type: 'warning' },
  ];
  const displayedLogs = [...liveLogs, ...mockLogs];

  const activityData = [
    { day: 'Sen', value: 45 },
    { day: 'Sel', value: 52 },
    { day: 'Rab', value: 38 },
    { day: 'Kam', value: 65 },
    { day: 'Jum', value: 48 },
    { day: 'Sab', value: 85 },
    { day: 'Min', value: 25 },
  ];

  useEffect(() => {
    const registeredAccounts = authService.getRegisteredAccountSummaries();
    const registeredUsers: AdminUser[] = registeredAccounts.map(account => ({
      id: account.id,
      name: account.name,
      username: account.username,
      email: account.email,
      role: roleLabels[account.role] || account.role,
      status: account.verificationStatus === 'pending'
        ? 'Menunggu'
        : account.verificationStatus === 'rejected'
          ? 'Ditolak'
          : account.isActive ? 'Aktif' : 'Nonaktif',
      date: new Date(account.createdAt).toLocaleDateString('id-ID'),
      registered: true,
    }));
    const pendingVerifications: VerificationItem[] = registeredAccounts
      .filter(account => account.verificationStatus === 'pending')
      .map(account => ({
        id: account.id,
        name: account.name,
        role: roleLabels[account.role] || account.role,
        email: account.email,
        submittedAt: new Date(account.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
      }));
    const hydratedDemoUsers = initialUsers.map(account => ({ ...account, status: authService.isAccountActive(account.id) ? 'Aktif' as const : 'Nonaktif' as const }));
    const hydrateUsers = window.setTimeout(() => {
      setMockUsers([...hydratedDemoUsers, ...registeredUsers]);
      setVerificationQueue(pendingVerifications);
    }, 0);

    async function fetchData() {
      try {
        const data = await analyticsService.getNationalStats();
        setStats(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    return () => window.clearTimeout(hydrateUsers);
  }, []);

  useEffect(() => {
    const hydrateLogs = () => {
      setLiveLogs(getDemoState().auditLogs.slice(0, 20).map(log => {
        const timestamp = new Date(log.timestamp);
        return {
          time: timestamp.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          date: timestamp.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
          action: log.details,
          user: log.userId,
          type: 'info',
        };
      }));
    };
    const timer = window.setTimeout(hydrateLogs, 0);
    window.addEventListener(DEMO_UPDATE_EVENT, hydrateLogs);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener(DEMO_UPDATE_EVENT, hydrateLogs);
    };
  }, []);

  useEffect(() => {
    if (!selectedUser) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedUser(null);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [selectedUser]);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Sistem Administrasi</h1>
          <p className="mt-1 text-sm text-slate-500">Pantau pengguna, keamanan, dan layanan ekosistem NADI-TANI dalam satu pusat kendali.</p>
        </div>
        <div className="flex flex-col gap-2 min-[420px]:flex-row">
          <button
            type="button"
            onClick={() => void syncData()}
            disabled={isSyncing}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-primary-200 bg-white px-4 text-sm font-bold text-primary-700 shadow-sm transition-colors hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Menyinkronkan' : 'Sinkronkan Data'}
          </button>
          <button
            type="button"
            onClick={downloadUserReport}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-primary-700 px-4 text-sm font-bold text-white shadow-sm transition-colors hover:bg-primary-800"
          >
            <Download className="mr-2 h-4 w-4" /> Unduh Laporan
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-amber-50 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-sm">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-extrabold text-slate-800">Seluruh layanan utama beroperasi normal</p>
              <span className="inline-flex items-center rounded-full border border-emerald-200 bg-white px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                <span className="mr-1.5 h-2 w-2 rounded-full bg-emerald-500" /> Terhubung
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">Sinkronisasi terakhir {lastSync} • 1 peringatan kapasitas perlu dipantau.</p>
          </div>
        </div>
        <button type="button" onClick={() => document.getElementById('status-server')?.scrollIntoView({ behavior: 'smooth', block: 'center' })} className="inline-flex h-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-700 hover:bg-slate-50">
          Tinjau Status Sistem
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Pengguna"
          value={stats ? new Intl.NumberFormat('id-ID').format(stats.totalPetaniAktif + 500) : '0'}
          icon={Users}
          trend="+5.2%"
          color="text-primary-600"
        />
        <StatCard
          title="Sistem DAI Aktif"
          value="12"
          icon={Database}
          trend="+2"
          color="text-info"
        />
        <StatCard
          title="Transaksi Harian"
          value="1,432"
          icon={Activity}
          trend="+12%"
          color="text-success"
        />
        <StatCard
          title="Status Keamanan"
          value="Aman"
          icon={ShieldCheck}
          description="Semua sistem berjalan normal"
          color="text-gold-dark"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card id="verification-queue" className="scroll-mt-5 overflow-hidden border-slate-200 shadow-sm lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 bg-slate-50/70">
            <div>
              <CardTitle className="flex items-center text-lg"><FileCheck2 className="mr-2 h-5 w-5 text-primary-700" /> Antrean Verifikasi Akun</CardTitle>
              <p className="mt-1 text-sm text-slate-500">Periksa pendaftaran baru sebelum memperoleh akses penuh.</p>
            </div>
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-extrabold text-amber-800">{verificationQueue.length} menunggu</span>
          </CardHeader>
          <CardContent className="p-0">
            {verificationQueue.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {verificationQueue.map(item => (
                  <div key={item.id} className="flex flex-col gap-4 p-4 transition-colors hover:bg-slate-50/70 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 font-extrabold text-primary-700">{item.name.slice(0, 1)}</div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-800">{item.name}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                          <span>{item.role}</span>
                          <span className="flex items-center"><Mail className="mr-1 h-3.5 w-3.5" /> {item.email}</span>
                          <span className="flex items-center"><Clock3 className="mr-1 h-3.5 w-3.5" /> {item.submittedAt}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-2 pl-13 sm:pl-0">
                      <button type="button" onClick={() => handleVerification(item, false)} className="h-9 rounded-lg border border-slate-200 px-3 text-xs font-bold text-slate-600 hover:bg-slate-100">Kembalikan</button>
                      <button type="button" onClick={() => handleVerification(item, true)} className="inline-flex h-9 items-center rounded-lg bg-primary-700 px-3 text-xs font-bold text-white hover:bg-primary-800"><UserCheck className="mr-1.5 h-4 w-4" /> Verifikasi</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center px-5 py-10 text-center">
                <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                <p className="mt-3 font-bold text-slate-800">Semua pendaftaran sudah diperiksa</p>
                <p className="mt-1 text-sm text-slate-500">Tidak ada akun yang menunggu verifikasi.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-gradient-to-br from-primary-800 to-emerald-700 text-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-lg text-white"><Zap className="mr-2 h-5 w-5 text-amber-300" /> Ringkasan Operasional</CardTitle>
            <p className="mt-1 text-sm text-emerald-100">Kondisi akun dan jangkauan sistem saat ini.</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: 'Pengguna aktif', value: activeUsers, icon: UserCheck },
              { label: 'Pengguna nonaktif', value: inactiveUsers, icon: Users },
              { label: 'Kabupaten terhubung', value: 8, icon: MapPinned },
              { label: 'Antrean verifikasi', value: verificationQueue.length, icon: Clock3 },
            ].map(item => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center justify-between rounded-xl border border-white/15 bg-white/10 px-3 py-3 backdrop-blur-sm">
                  <span className="flex items-center text-sm font-medium text-emerald-50"><Icon className="mr-2 h-4 w-4 text-amber-300" /> {item.label}</span>
                  <span className="text-lg font-black">{item.value}</span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {[
                { time: '10 menit lalu', action: 'Penambahan mesin DAI di Ngawi', user: 'System' },
                { time: '1 jam lalu', action: 'Update harga HPP', user: 'Pemerintah' },
                { time: '2 jam lalu', action: 'Registrasi 50 petani baru', user: 'Operator' }
              ].map((act, i) => (
                <li key={i} className="flex flex-col gap-2 border-b border-slate-100 pb-3 last:border-0 min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between">
                  <div>
                    <p className="font-medium text-sm">{act.action}</p>
                    <p className="text-xs text-slate-500">Oleh: {act.user}</p>
                  </div>
                  <span className="text-xs text-slate-400">{act.time}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card id="status-server" className="scroll-mt-5 border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center"><Server className="mr-2 h-5 w-5 text-primary-700" /> Status Server</CardTitle>
              <p className="mt-1 text-sm text-slate-500">Diperbarui {lastSync}</p>
            </div>
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">Operasional</span>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {[
                { label: 'Database Utama', detail: '99,9% uptime', value: 99, icon: Database, tone: 'bg-emerald-500' },
                { label: 'API Gateway', detail: '96 ms respons', value: 96, icon: Wifi, tone: 'bg-emerald-500' },
                { label: 'Penyimpanan Data', detail: '68% terpakai', value: 68, icon: HardDrive, tone: 'bg-amber-500' },
                { label: 'Pemrosesan Analitik', detail: '42% beban', value: 42, icon: Cpu, tone: 'bg-primary-600' },
              ].map(service => {
                const Icon = service.icon;
                return (
                  <div key={service.label}>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <span className="flex items-center text-sm font-semibold text-slate-700"><Icon className="mr-2 h-4 w-4 text-slate-500" /> {service.label}</span>
                      <span className="text-xs font-bold text-slate-500">{service.detail}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div className={`h-full rounded-full ${service.tone}`} style={{ width: `${service.value}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <button onClick={() => setShowFullLogs(!showFullLogs)} className="w-full mt-6 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center justify-center">
              {showFullLogs ? 'Tutup Detail Log' : 'Lihat Detail Log'}
              {showFullLogs ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
            </button>

            {showFullLogs && (
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                <h4 className="text-sm font-semibold mb-2">Log Sistem Lengkap</h4>
                {displayedLogs.map((log, i) => (
                  <div key={i} className="flex gap-3 items-start p-2 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="mt-0.5">
                      {log.type === 'error' && <AlertCircle className="w-4 h-4 text-red-500" />}
                      {log.type === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
                      {log.type === 'info' && <Info className="w-4 h-4 text-blue-500" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-700">{log.action}</p>
                      <div className="flex gap-2 text-xs text-slate-500 mt-1">
                        <span>{log.date} {log.time}</span>
                        <span>•</span>
                        <span>{log.user}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="border-b border-slate-100 pb-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Pengguna Terdaftar</CardTitle>
                  <p className="mt-1 text-sm text-slate-500">{filteredUsers.length} dari {mockUsers.length} akun ditampilkan</p>
                </div>
                {(searchUser || statusFilter !== 'Semua' || roleFilter !== 'Semua') && (
                  <button type="button" onClick={() => { setSearchUser(''); setStatusFilter('Semua'); setRoleFilter('Semua'); }} className="self-start text-xs font-bold text-primary-700 hover:text-primary-800 sm:self-auto">Reset Filter</button>
                )}
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="search"
                    aria-label="Cari pengguna"
                    placeholder="Cari nama atau username"
                    value={searchUser}
                    onChange={(e) => setSearchUser(e.target.value)}
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <select aria-label="Filter status pengguna" value={statusFilter} onChange={event => setStatusFilter(event.target.value as 'Semua' | AdminUser['status'])} className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="Semua">Semua status</option>
                  <option value="Aktif">Aktif</option>
                  <option value="Nonaktif">Nonaktif</option>
                  <option value="Menunggu">Menunggu verifikasi</option>
                  <option value="Ditolak">Perlu diperbaiki</option>
                </select>
                <select aria-label="Filter peran pengguna" value={roleFilter} onChange={event => setRoleFilter(event.target.value)} className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="Semua">Semua peran</option>
                  {availableRoles.map(role => <option key={role} value={role}>{role}</option>)}
                </select>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="min-w-[840px] w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600">
                    <tr>
                      <th className="px-6 py-3 font-medium">No</th>
                      <th className="px-6 py-3 font-medium">Nama</th>
                      <th className="px-6 py-3 font-medium">Role</th>
                      <th className="px-6 py-3 font-medium">Tanggal Daftar</th>
                      <th className="px-6 py-3 font-medium text-center">Status</th>
                      <th className="px-6 py-3 font-medium text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredUsers.length > 0 ? filteredUsers.map((user, i) => (
                      <tr key={user.id} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4 text-slate-500">{i + 1}</td>
                        <td className="px-6 py-4 font-medium text-slate-800">
                          {user.name}
                          {user.username && <span className="mt-0.5 block text-xs font-normal text-slate-400">@{user.username}</span>}
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-medium">
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500">{user.date}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.status === 'Aktif'
                              ? 'bg-green-100 text-green-700'
                              : user.status === 'Menunggu'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-red-100 text-red-700'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button type="button" onClick={() => setSelectedUser(user)} className="inline-flex h-8 items-center rounded-lg border border-slate-200 px-2.5 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-100">
                              <Eye className="mr-1.5 h-3.5 w-3.5" /> Detail
                            </button>
                            {user.id === 'user-admin-1' ? (
                              <span className="px-2 text-xs font-semibold text-slate-400">Akun utama</span>
                            ) : ['Aktif', 'Nonaktif'].includes(user.status) ? (
                              <button
                                type="button"
                                onClick={() => toggleUserStatus(user.id)}
                                className={`h-8 rounded-lg px-2.5 text-xs font-bold transition-colors ${
                                  user.status === 'Aktif'
                                    ? 'bg-red-50 text-red-700 hover:bg-red-100'
                                    : 'bg-green-50 text-green-700 hover:bg-green-100'
                                }`}
                              >
                                {user.status === 'Aktif' ? 'Nonaktifkan' : 'Aktifkan'}
                              </button>
                            ) : (
                              <span className="px-2 text-xs font-semibold text-slate-400">Perlu ditinjau</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                          Tidak ada pengguna yang cocok dengan pencarian
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Grafik Aktivitas Sistem</CardTitle>
              <p className="text-sm text-slate-500 mt-1">7 Hari Terakhir</p>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between gap-2 pt-4">
                {activityData.map((data, i) => (
                  <button type="button" aria-label={`${data.day}: ${data.value} aktivitas`} onClick={() => setSelectedActivityIndex(i)} key={i} className="group flex flex-1 flex-col items-center gap-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500">
                    <div className="relative w-full flex justify-center h-48 items-end">
                      <div
                        className={`relative w-full max-w-[32px] rounded-t-sm transition-colors ${selectedActivityIndex === i ? 'bg-primary-200 ring-2 ring-primary-300' : 'bg-primary-100 group-hover:bg-primary-200'}`}
                        style={{ height: `${data.value}%` }}
                      >
                        <div className={`pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 rounded bg-slate-800 px-2 py-1 text-xs text-white transition-opacity ${selectedActivityIndex === i ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                          {data.value}
                        </div>
                        <div
                          className="absolute bottom-0 w-full bg-primary-500 rounded-t-sm"
                          style={{ height: `${data.value * 0.6}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">{data.day}</span>
                  </button>
                ))}
              </div>
              <div className="mt-6 flex justify-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-primary-500 rounded-sm"></div>
                  <span className="text-slate-600">Jam Sibuk</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-primary-100 rounded-sm"></div>
                  <span className="text-slate-600">Normal</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <button type="button" aria-label="Tutup detail pengguna" onClick={() => setSelectedUser(null)} className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm" />
          <div role="dialog" aria-modal="true" aria-labelledby="admin-user-detail-title" className="relative z-10 max-h-[calc(100dvh-2rem)] w-full max-w-lg overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="rounded-t-3xl bg-gradient-to-r from-primary-800 to-emerald-700 px-6 pb-6 pt-5 text-white">
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-lg font-black ring-1 ring-white/25">
                    {selectedUser.name.split(' ').slice(0, 2).map(part => part[0]).join('').toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wider text-emerald-100">Detail Pengguna</p>
                    <h2 id="admin-user-detail-title" className="truncate text-xl font-black">{selectedUser.name}</h2>
                    <p className="mt-0.5 text-sm text-emerald-100">{selectedUser.username ? `@${selectedUser.username}` : selectedUser.id}</p>
                  </div>
                </div>
                <button type="button" aria-label="Tutup detail pengguna" onClick={() => setSelectedUser(null)} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"><X className="h-5 w-5" /></button>
              </div>
            </div>

            <div className="space-y-5 p-6">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Peran', value: selectedUser.role },
                  { label: 'Status akun', value: selectedUser.status },
                  { label: 'Tanggal daftar', value: selectedUser.date },
                  { label: 'Sumber akun', value: selectedUser.registered ? 'Pendaftaran mandiri' : 'Data demo sistem' },
                ].map(item => (
                  <div key={item.label} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{item.label}</p>
                    <p className="mt-1 text-sm font-bold text-slate-800">{item.value}</p>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="text-sm font-extrabold text-slate-800">Ringkasan Akses</h3>
                <div className="mt-3 space-y-3">
                  <div className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-3">
                    <span className="flex items-center text-sm font-medium text-slate-600"><ShieldCheck className="mr-2 h-4 w-4 text-primary-700" /> Hak akses sesuai peran</span>
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-3">
                    <span className="flex items-center text-sm font-medium text-slate-600"><Activity className="mr-2 h-4 w-4 text-primary-700" /> Aktivitas terakhir</span>
                    <span className="text-xs font-bold text-slate-500">Hari ini</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-5 min-[420px]:flex-row">
                <button type="button" onClick={() => setSelectedUser(null)} className="h-11 flex-1 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50">Tutup</button>
                {selectedUser.id === 'user-admin-1' ? (
                  <div className="flex h-11 flex-1 items-center justify-center rounded-xl bg-slate-100 text-sm font-bold text-slate-500">Akun utama dilindungi</div>
                ) : ['Aktif', 'Nonaktif'].includes(selectedUser.status) ? (
                  <button
                    type="button"
                    onClick={() => {
                      const nextStatus = selectedUser.status === 'Aktif' ? 'Nonaktif' : 'Aktif';
                      toggleUserStatus(selectedUser.id);
                      setSelectedUser({ ...selectedUser, status: nextStatus });
                    }}
                    className={`h-11 flex-1 rounded-xl text-sm font-bold ${selectedUser.status === 'Aktif' ? 'bg-red-50 text-red-700 hover:bg-red-100' : 'bg-primary-700 text-white hover:bg-primary-800'}`}
                  >
                    {selectedUser.status === 'Aktif' ? 'Nonaktifkan Akun' : 'Aktifkan Akun'}
                  </button>
                ) : selectedUser.status === 'Menunggu' ? (
                  <button type="button" onClick={() => { setSelectedUser(null); document.getElementById('verification-queue')?.scrollIntoView({ behavior: 'smooth' }); }} className="h-11 flex-1 rounded-xl bg-primary-700 text-sm font-bold text-white hover:bg-primary-800">Buka Antrean Verifikasi</button>
                ) : (
                  <div className="flex h-11 flex-1 items-center justify-center rounded-xl bg-red-50 text-sm font-bold text-red-700">Pendaftaran perlu diperbaiki</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
