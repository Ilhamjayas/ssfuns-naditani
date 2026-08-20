'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { daiService } from '@/lib/services/dai.service';
import { DryingProcess } from '@/lib/types';
import { Sun, Thermometer, Clock, CheckCircle2, Play, Pause } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';

export default function PengeringanPage() {
  const { user } = useAuth();
  const [processes, setProcesses] = useState<DryingProcess[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await daiService.getDryingProcesses();
        setProcesses(data);
      } catch (error) {
        console.error('Failed to load drying processes:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Memuat data pengeringan...</div>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress':
      case 'running': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Selesai';
      case 'in_progress':
      case 'running': return 'Sedang Berjalan';
      case 'pending': return 'Menunggu';
      case 'paused': return 'Dijeda';
      default: return status;
    }
  };

  const handleStartNewBatch = async () => {
    const newProcess: DryingProcess = {
      id: `DRY-${Date.now()}`,
      batchId: `BATCH-${new Date().toISOString().slice(0, 10)}-${String(processes.length + 1).padStart(3, '0')}`,
      machineId: `MAC-DRY-${String((processes.length % 5) + 1).padStart(2, '0')}`,
      startTime: new Date().toISOString(),
      initialMoisture: Math.floor(Math.random() * 10) + 18,
      targetMoisture: 14,
      currentMoisture: Math.floor(Math.random() * 10) + 18,
      temperature: 45,
      status: 'running'
    };
    setProcessingId('new');
    try {
      const saved = await daiService.startDryingProcess(newProcess, user?.id || 'operator-dai');
      setProcesses(current => [saved, ...current]);
      toast.success("Batch pengeringan baru berhasil dimulai");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Batch gagal dimulai');
    } finally {
      setProcessingId(null);
    }
  };

  const updateProcessStatus = async (id: string, status: DryingProcess['status'], successMessage: string) => {
    setProcessingId(id);
    try {
      const updated = await daiService.updateDryingStatus(id, status, user?.id || 'operator-dai');
      setProcesses(current => current.map(process => process.id === id ? updated : process));
      toast.success(successMessage);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Status pengeringan gagal diperbarui');
    } finally {
      setProcessingId(null);
    }
  };

  const handlePauseProcess = (id: string) => void updateProcessStatus(id, 'paused', 'Proses pengeringan dijeda sementara');

  const handleResumeProcess = (id: string) => void updateProcessStatus(id, 'running', 'Proses pengeringan dilanjutkan');

  const handleCompleteProcess = (id: string) => void updateProcessStatus(id, 'completed', 'Proses pengeringan telah selesai');

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-hijau-tua">Proses Pengeringan</h1>
          <p className="text-gray-500 mt-1">Pemantauan dan kontrol mesin pengering gabah (Bed Dryer).</p>
        </div>
        <Button onClick={() => void handleStartNewBatch()} disabled={processingId === 'new'} className="w-full bg-hijau-pertanian hover:bg-hijau-tua sm:w-auto">
          {processingId === 'new' ? 'Memulai Batch...' : 'Mulai Batch Baru'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {processes.length === 0 ? (
          <div className="col-span-full p-8 text-center text-gray-500 border rounded-lg bg-white">
            Tidak ada proses pengeringan yang tercatat.
          </div>
        ) : (
          processes.map(process => {
            // Mocking progress for visual purposes if not available
            const moistureRange = Math.max(0.1, process.initialMoisture - process.targetMoisture);
            const moistureReduced = Math.max(0, process.initialMoisture - process.currentMoisture);
            const progress = process.status === 'completed' ? 100 : Math.min(99, Math.round((moistureReduced / moistureRange) * 100));

            return (
              <Card key={process.id} className="overflow-hidden border-t-4 border-t-emas-padi">
                <CardHeader className="bg-gray-50 pb-4">
                  <div className="flex flex-col gap-2 min-[400px]:flex-row min-[400px]:items-start min-[400px]:justify-between">
                    <div>
                      <CardTitle className="text-lg">{process.id}</CardTitle>
                      <CardDescription>Batch: {process.batchId}</CardDescription>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(process.status)}`}>
                      {getStatusText(process.status)}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="p-5">
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Mesin ID</span>
                      <span className="font-semibold">{process.machineId}</span>
                    </div>

                    <div className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-2 sm:gap-4">
                      <div className="bg-orange-50 p-3 rounded-lg flex items-center gap-3 border border-orange-100">
                        <Thermometer className="h-5 w-5 text-orange-500" />
                        <div>
                          <p className="text-xs text-orange-700">Kadar Air Awal</p>
                          <p className="font-bold text-orange-900">{process.initialMoisture}%</p>
                        </div>
                      </div>
                      <div className="bg-hijau-muda p-3 rounded-lg flex items-center gap-3 border border-green-200">
                        <Sun className="h-5 w-5 text-hijau-pertanian" />
                        <div>
                          <p className="text-xs text-green-700">Target (Akhir)</p>
                          <p className="font-bold text-green-900">{process.targetMoisture || '14'}%</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-500">Progres Pengeringan</span>
                        <span className="font-bold text-hijau-pertanian">{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-hijau-pertanian h-2 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col gap-2 border-t pt-2 text-xs text-gray-500 min-[400px]:flex-row min-[400px]:justify-between">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Mulai: {new Date(process.startTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      {process.endTime && (
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Selesai: {new Date(process.endTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      )}
                    </div>

                    {process.status === 'running' && (
                      <div className="flex gap-2 pt-2">
                        <Button disabled={processingId === process.id} onClick={() => handlePauseProcess(process.id)} variant="outline" className="flex-1 border-red-200 text-red-600 hover:bg-red-50" size="sm">
                          <Pause className="h-4 w-4 mr-2" />
                          Jeda
                        </Button>
                        <Button disabled={processingId === process.id} onClick={() => handleCompleteProcess(process.id)} className="flex-1 bg-hijau-pertanian hover:bg-hijau-tua" size="sm">
                          Selesai
                        </Button>
                      </div>
                    )}
                    {process.status === 'paused' && (
                      <Button disabled={processingId === process.id} onClick={() => handleResumeProcess(process.id)} className="w-full bg-hijau-pertanian hover:bg-hijau-tua" size="sm">
                        <Play className="h-4 w-4 mr-2" />
                        Mulai Proses
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
