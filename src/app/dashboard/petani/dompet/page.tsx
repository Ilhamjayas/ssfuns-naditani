'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { walletService } from '@/lib/services/wallet.service';
import { formatRupiah } from '@/lib/utils/format';
import { WalletAccount, WalletTransaction } from '@/lib/types';
import { Wallet, ArrowDownRight, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/lib/auth/AuthContext';
import { toast } from 'sonner';

export default function DompetPage() {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<WalletAccount | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [bankInfo, setBankInfo] = useState('');
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  useEffect(() => {
    const fetchWalletData = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const balance = await walletService.getWalletBalance(user.id);
        const history = await walletService.getWalletHistory(balance.id);

        setWallet(balance);
        setTransactions(history);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, [user]);

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet) return;

    setIsWithdrawing(true);
    try {
      const amount = parseInt(withdrawAmount, 10);
      await walletService.requestWithdrawal(wallet.id, amount, bankInfo);
      setWithdrawSuccess(true);
      toast.success(`Berhasil menarik Rp ${formatRupiah(amount)}`);

      // Wait a bit, then refresh the list (mock behavior will just append locally or reset)
      setTimeout(async () => {
        setWithdrawSuccess(false);
        setWithdrawAmount('');
        setBankInfo('');
        if (user) {
          const balance = await walletService.getWalletBalance(user.id);
          const history = await walletService.getWalletHistory(balance.id);
          setWallet(balance);
          setTransactions(history);
        }
      }, 2500);
    } catch (error) {
      console.error('Withdrawal failed', error);
      toast.error(error instanceof Error ? error.message : 'Penarikan gagal diproses');
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary-800">Dompet NADI-TANI</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Kelola saldo pendapatan dari hasil panen Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 bg-gradient-to-br from-primary-600 to-primary-800 text-white border-none shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white/10 blur-2xl"></div>
          <CardHeader>
            <CardTitle className="text-sm font-medium opacity-90 flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              Saldo Aktif
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-10 w-3/4 bg-white/20" />
            ) : (
              <div className="break-words text-2xl font-bold tracking-tight min-[400px]:text-3xl">
                {wallet ? formatRupiah(wallet.balance) : 'Rp 0'}
              </div>
            )}
            <p className="text-xs opacity-75 mt-2">Update terakhir: Hari ini</p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg text-nadi-tua">Tarik Tunai (Simulasi)</CardTitle>
            <CardDescription>Pindahkan saldo ke rekening bank Anda.</CardDescription>
          </CardHeader>
          <CardContent>
            {withdrawSuccess ? (
              <div className="flex flex-col items-center justify-center py-4">
                <CheckCircle2 className="w-12 h-12 text-nadi-tani mb-2" />
                <p className="font-medium">Permintaan penarikan berhasil dikirim.</p>
                <p className="text-sm text-muted-foreground">Dana akan masuk ke rekening Anda maksimal 1x24 jam.</p>
              </div>
            ) : (
              <form onSubmit={handleWithdraw} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Jumlah Penarikan (Rp)</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="Minimal 50000"
                      min="50000"
                      max={wallet?.balance || 0}
                      required
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bank">Rekening Tujuan</Label>
                    <Input
                      id="bank"
                      type="text"
                      placeholder="Contoh: BRI 1234xxxx a.n Budi"
                      required
                      value={bankInfo}
                      onChange={(e) => setBankInfo(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className="w-full bg-primary-600 text-white hover:bg-primary-700 sm:w-auto"
                    disabled={isWithdrawing || !wallet || wallet.balance < 50000}
                    onClick={() => {
                      if (!wallet || wallet.balance < 50000) {
                        toast.error("Saldo tidak mencukupi atau dompet belum siap");
                      }
                    }}
                  >
                    {isWithdrawing ? 'Memproses...' : 'Tarik Dana'}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Riwayat Transaksi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border border-slate-100">
            <Table className="min-w-[640px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>Nominal</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                    </TableRow>
                  ))
                ) : transactions.length > 0 ? (
                  transactions.map((trx) => (
                    <TableRow key={trx.id}>
                      <TableCell className="text-sm">
                        {new Date(trx.date).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </TableCell>
                      <TableCell className="text-sm">
                        <div className="flex items-center gap-2">
                          {trx.amount > 0 ? (
                            <div className="p-1 rounded-full bg-nadi-muda text-nadi-tani">
                              <ArrowDownRight className="w-3 h-3" />
                            </div>
                          ) : (
                            <div className="p-1 rounded-full bg-orange-100 text-orange-600">
                              <ArrowUpRight className="w-3 h-3" />
                            </div>
                          )}
                          {trx.description}
                        </div>
                      </TableCell>
                      <TableCell className={`text-sm font-medium ${trx.amount > 0 ? 'text-nadi-tani' : 'text-foreground'}`}>
                        {trx.amount > 0 ? '+' : ''}{formatRupiah(trx.amount)}
                      </TableCell>
                      <TableCell>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          trx.status === 'completed' ? 'bg-nadi-muda text-nadi-tua' :
                          trx.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {trx.status === 'completed' ? 'Berhasil' :
                           trx.status === 'pending' ? 'Diproses' : 'Gagal'}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      Belum ada riwayat transaksi.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
