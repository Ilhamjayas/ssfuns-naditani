'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/ui/StatCard';
import { Activity, Users, Database, ShieldCheck, Search, ChevronDown, ChevronUp, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { analyticsService } from '@/lib/services/analytics.service';
import { Skeleton } from '@/components/ui/skeleton';
import { NationalStats } from '@/lib/types';
import { toast } from 'sonner';
import { authService } from '@/lib/services/auth.service';

type AdminUser = {
  id: string;
  name: string;
  username?: string;
  role: string;
  status: 'Aktif' | 'Nonaktif';
  date: string;
  registered?: boolean;
};

const initialUsers: AdminUser[] = [
  { id: 'demo-1', name: 'Budi Santoso', role: 'Petani', status: 'Aktif', date: '2023-01-15' },
  { id: 'demo-2', name: 'Siti Aminah', role: 'Penyuluh', status: 'Aktif', date: '2023-02-20' },
  { id: 'demo-3', name: 'Agus Pratama', role: 'Petani', status: 'Nonaktif', date: '2023-03-10' },
  { id: 'demo-4', name: 'PT. Pangan Nusantara', role: 'Mitra', status: 'Aktif', date: '2023-04-05' },
  { id: 'demo-5', name: 'Dinas Pertanian Ngawi', role: 'Pemerintah', status: 'Aktif', date: '2023-05-12' },
  { id: 'demo-6', name: 'KUD Tani Makmur', role: 'Mitra', status: 'Aktif', date: '2023-06-18' },
  { id: 'demo-7', name: 'Joko Widodo', role: 'Petani', status: 'Aktif', date: '2023-07-22' },
  { id: 'demo-8', name: 'Rini Sugiarti', role: 'Petani', status: 'Nonaktif', date: '2023-08-30' },
];

const roleLabels: Record<string, string> = {
  petani: 'Petani',
  operator_atm: 'Operator ATM',
  pengelola_dai: 'Pengelola DAI',
  pemerintah: 'Pemerintah',
  mitra: 'Mitra',
  admin: 'Admin',
};

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<NationalStats | null>(null);
  const [searchUser, setSearchUser] = useState('');
  const [showFullLogs, setShowFullLogs] = useState(false);

  const [mockUsers, setMockUsers] = useState<AdminUser[]>(initialUsers);

  const toggleUserStatus = (id: string) => {
    const selectedUser = mockUsers.find(user => user.id === id);
    if (!selectedUser) return;
    const nextStatus = selectedUser.status === 'Aktif' ? 'Nonaktif' : 'Aktif';
    try {
      if (selectedUser.registered) authService.setRegisteredAccountActive(id, nextStatus === 'Aktif');
      setMockUsers(current => current.map(user => user.id === id ? { ...user, status: nextStatus } : user));
      toast.success(`Akun ${nextStatus === 'Aktif' ? 'diaktifkan' : 'dinonaktifkan'}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Status pengguna gagal diubah');
    }
  };

  const filteredUsers = mockUsers.filter(user => user.name.toLowerCase().includes(searchUser.toLowerCase()) || user.role.toLowerCase().includes(searchUser.toLowerCase()) || user.username?.toLowerCase().includes(searchUser.toLowerCase()));

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
    const registeredUsers: AdminUser[] = authService.getRegisteredAccountSummaries().map(account => ({
      id: account.id,
      name: account.name,
      username: account.username,
      role: roleLabels[account.role] || account.role,
      status: account.isActive ? 'Aktif' : 'Nonaktif',
      date: new Date(account.createdAt).toLocaleDateString('id-ID'),
      registered: true,
    }));
    const hydrateUsers = window.setTimeout(() => setMockUsers([...initialUsers, ...registeredUsers]), 0);

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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Sistem Administrasi</h1>
          <p className="text-slate-500">Ringkasan status ekosistem NADI-TANI</p>
        </div>
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

        <Card>
          <CardHeader>
            <CardTitle>Status Server</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Database</span>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">99.9% Uptime</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">API Gateway</span>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Optimal</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Storage (Blob)</span>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">68% Kapasitas</span>
              </div>
            </div>
            <button onClick={() => setShowFullLogs(!showFullLogs)} className="w-full mt-6 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center justify-center">
              {showFullLogs ? 'Tutup Detail Log' : 'Lihat Detail Log'}
              {showFullLogs ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
            </button>

            {showFullLogs && (
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                <h4 className="text-sm font-semibold mb-2">Log Sistem Lengkap</h4>
                {mockLogs.map((log, i) => (
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
            <CardHeader className="flex flex-col items-stretch gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle>Pengguna Terdaftar</CardTitle>
              <div className="relative w-full sm:w-auto">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari pengguna..."
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 sm:w-56"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="min-w-[760px] w-full text-left text-sm">
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
                            user.status === 'Aktif' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => toggleUserStatus(user.id)}
                            className={`text-xs px-3 py-1.5 rounded font-medium transition-colors ${
                              user.status === 'Aktif'
                                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                : 'bg-green-50 text-green-600 hover:bg-green-100'
                            }`}
                          >
                            {user.status === 'Aktif' ? 'Nonaktifkan' : 'Aktifkan'}
                          </button>
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
                  <div key={i} className="flex flex-col items-center gap-2 flex-1 group">
                    <div className="relative w-full flex justify-center h-48 items-end">
                      <div
                        className="w-full max-w-[32px] bg-primary-100 group-hover:bg-primary-200 transition-colors rounded-t-sm relative"
                        style={{ height: `${data.value}%` }}
                      >
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-slate-800 text-white text-xs px-2 py-1 rounded pointer-events-none transition-opacity">
                          {data.value}
                        </div>
                        <div
                          className="absolute bottom-0 w-full bg-primary-500 rounded-t-sm"
                          style={{ height: `${data.value * 0.6}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">{data.day}</span>
                  </div>
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
    </div>
  );
}
