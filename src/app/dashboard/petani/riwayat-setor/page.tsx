'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { transactionService } from '@/lib/services/transaction.service';
import { DepositTransaction } from '@/lib/types';
import { formatRupiah } from '@/lib/utils/format';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

export default function RiwayatSetorPage() {
  const [transactions, setTransactions] = useState<DepositTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await transactionService.getTransactions('PTN-240017');
        setTransactions(data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-2xl font-bold text-hijauTua">Riwayat Setor Gabah</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Pantau status transaksi penyetoran gabah Anda ke DAI.
        </p>
      </motion.div>

      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="p-4 rounded-xl border border-slate-100 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex gap-4 w-full sm:w-auto">
                  <div className="space-y-2 flex-1 sm:flex-none">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="space-y-2 flex-1 sm:flex-none text-right">
                    <Skeleton className="h-6 w-24 ml-auto rounded-full" />
                    <Skeleton className="h-5 w-24 ml-auto" />
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : transactions.length > 0 ? (
          transactions.map((trx, index) => (
            <motion.div
              key={trx.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="p-4 md:p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6">
                  <div className="w-full md:w-1/3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-slate-900">{trx.id}</span>
                      <StatusBadge status={trx.status} />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(trx.date).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </div>
                  </div>

                  <div className="w-full md:w-2/3 flex flex-row flex-wrap sm:flex-nowrap items-center justify-between gap-4 md:gap-8 bg-slate-50/50 p-3 rounded-lg border border-slate-100/50">
                    <div className="flex-1 min-w-[100px]">
                      <p className="text-xs text-slate-500 mb-1">Berat Kotor</p>
                      <p className="text-sm font-semibold text-slate-700">{trx.berat_kotor} Kg</p>
                    </div>
                    <div className="flex-1 min-w-[80px]">
                      <p className="text-xs text-slate-500 mb-1">Grade</p>
                      <p className="text-sm font-semibold text-slate-700">{trx.grade || '-'}</p>
                    </div>
                    <div className="flex-1 min-w-[120px] text-right">
                      <p className="text-xs text-slate-500 mb-1">Nilai Transaksi</p>
                      <p className="text-sm font-bold text-emasPadi">
                        {trx.nilai_transaksi > 0 ? formatRupiah(trx.nilai_transaksi) : '-'}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        ) : (
          <Card className="p-8 text-center border border-dashed border-slate-200">
            <p className="text-muted-foreground">Belum ada riwayat transaksi.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
