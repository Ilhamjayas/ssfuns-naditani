'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/ui/StatCard';
import { ShoppingBag, Truck, PackageCheck, CircleDollarSign, X, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { formatRupiah } from '@/lib/utils/format';
import { toast } from 'sonner';
import { marketplaceService } from '@/lib/services/marketplace.service';
import { BuyerOrder, Product } from '@/lib/types';
import { useAuth } from '@/lib/auth/AuthContext';

export default function MitraDashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<BuyerOrder[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [showOrderModal, setShowOrderModal] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [selectedTrendIndex, setSelectedTrendIndex] = useState(5);
  const [orderForm, setOrderForm] = useState({ productId: '', qty: '', recipientName: '', phone: '', address: '', paymentMethod: 'Transfer Bank', note: '' });

  const loadMarketplaceData = async () => {
    const [productData, orderData] = await Promise.all([
      marketplaceService.getProducts(),
      marketplaceService.getOrders(user?.id),
    ]);
    setProducts(productData);
    setOrders(orderData);
    setOrderForm(current => ({ ...current, productId: current.productId || productData[0]?.id || '', recipientName: current.recipientName || user?.name || '' }));
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const product = products.find(item => item.id === orderForm.productId);
    const quantity = Number(orderForm.qty);
    if (!product || !Number.isInteger(quantity) || quantity < product.minOrder || !orderForm.recipientName.trim() || !orderForm.phone.trim() || !orderForm.address.trim()) {
      toast.error('Mohon lengkapi form pesanan');
      return;
    }
    setIsSubmittingOrder(true);
    try {
      const newOrder = await marketplaceService.createOrder({
        buyerId: user?.id || 'mitra-1',
        daiId: product.daiId,
        items: [{ productId: product.id, quantity, price: product.price }],
        totalAmount: product.price * quantity,
        shippingAddress: orderForm.address,
        recipientName: orderForm.recipientName,
        recipientPhone: orderForm.phone,
        paymentMethod: orderForm.paymentMethod,
        notes: orderForm.note,
      });
      await loadMarketplaceData();
      setShowOrderModal(false);
      setOrderForm({ productId: products[0]?.id || '', qty: '', recipientName: user?.name || '', phone: '', address: '', paymentMethod: 'Transfer Bank', note: '' });
      toast.success(`Pesanan ${newOrder.id} berhasil dibuat`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Pesanan gagal dibuat');
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const paymentHistory = [
    { invoice: 'INV-2026-08-01', date: '01 Agt 2026', amount: 45000000, status: 'Lunas', method: 'Transfer Bank - Mandiri' },
    { invoice: 'INV-2026-08-05', date: '05 Agt 2026', amount: 12500000, status: 'Lunas', method: 'Credit Term (30 Hari)' },
    { invoice: 'INV-2026-08-12', date: '12 Agt 2026', amount: 24000000, status: 'Pending', method: 'Transfer Bank - BCA' },
    { invoice: 'INV-2026-08-15', date: '15 Agt 2026', amount: 8500000, status: 'Gagal', method: 'Virtual Account' },
    { invoice: 'INV-2026-08-18', date: '18 Agt 2026', amount: 72500000, status: 'Pending', method: 'Credit Term (30 Hari)' },
  ];

  const trendData = [
    { month: 'Mar', value: 45 },
    { month: 'Apr', value: 62 },
    { month: 'Mei', value: 58 },
    { month: 'Jun', value: 85 },
    { month: 'Jul', value: 110 },
    { month: 'Agt', value: 145 },
  ];

  useEffect(() => {
    const initialLoad = window.setTimeout(() => {
      void loadMarketplaceData().catch(error => {
        console.error(error);
        toast.error('Data pesanan gagal dimuat');
      }).finally(() => setLoading(false));
    }, 0);
    return () => window.clearTimeout(initialLoad);
  // loadMarketplaceData intentionally follows the active account.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  useEffect(() => {
    if (!showOrderModal) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setShowOrderModal(false);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [showOrderModal]);

  const productName = (productId: string) => products.find(product => product.id === productId)?.name || productId;
  const totalPurchases = orders.reduce((total, order) => total + order.totalAmount, 0);
  const activeOrders = orders.filter(order => ['pending', 'paid', 'processing'].includes(order.status)).length;
  const shippedOrders = orders.filter(order => order.status === 'shipped').length;
  const deliveredOrders = orders.filter(order => order.status === 'delivered').length;
  const selectedProduct = products.find(product => product.id === orderForm.productId);
  const orderQuantity = Number(orderForm.qty) || 0;
  const orderSubtotal = selectedProduct ? selectedProduct.price * orderQuantity : 0;
  const estimatedShipping = orderSubtotal === 0 ? 0 : orderSubtotal >= 500000 ? 0 : 25000;

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Dashboard Mitra</h1>
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
          <h1 className="text-2xl font-bold text-slate-800">Dashboard Mitra Industri</h1>
          <p className="text-slate-500">Kelola pesanan dan pembelian hasil pascapanen NADI-TANI</p>
        </div>
        <button
          type="button"
          onClick={() => setShowOrderModal(true)}
          className="w-full rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 sm:w-auto"
        >
          + Buat Pesanan Baru
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Pembelian Tersimpan"
          value={formatRupiah(totalPurchases)}
          icon={CircleDollarSign}
          trend="+15%"
          color="text-primary-600"
        />
        <StatCard
          title="Pesanan Aktif"
          value={String(activeOrders)}
          icon={ShoppingBag}
          description="Pesanan sedang diproses"
          color="text-info"
        />
        <StatCard
          title="Dalam Pengiriman"
          value={String(shippedOrders)}
          icon={Truck}
          color="text-warning"
        />
        <StatCard
          title="Selesai Dikirim"
          value={String(deliveredOrders)}
          icon={PackageCheck}
          description="Dalam 30 hari terakhir"
          color="text-success"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Daftar Pesanan Terbaru</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-[780px] w-full text-left text-sm text-slate-500">
                  <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 rounded-tl-lg">ID Pesanan</th>
                      <th className="px-4 py-3">Produk</th>
                      <th className="px-4 py-3">Jumlah</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Total</th>
                      <th className="px-4 py-3 rounded-tr-lg text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order, idx) => (
                      <tr key={idx} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 font-medium text-slate-900">{order.id}</td>
                        <td className="px-4 py-3">{order.items.map(item => productName(item.productId)).join(', ')}</td>
                        <td className="px-4 py-3">{order.items.reduce((total, item) => total + item.quantity, 0)} item</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium
                            ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                              order.status === 'shipped' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-blue-100 text-blue-700'}`}>
                            {order.status === 'delivered' ? 'Selesai' : order.status === 'shipped' ? 'Dikirim' : 'Diproses'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-slate-800">{formatRupiah(order.totalAmount)}</td>
                        <td className="px-4 py-3 text-center">
                          {order.status === 'shipped' ? (
                            <button
                              type="button"
                              onClick={() => {
                                void marketplaceService.updateOrderStatus(order.id, 'delivered', user?.id).then(() => {
                                  setOrders(current => current.map(item => item.id === order.id ? { ...item, status: 'delivered' } : item));
                                  toast.success(`Pesanan ${order.id} berhasil diterima`);
                                }).catch(error => toast.error(error instanceof Error ? error.message : 'Status pesanan gagal diubah'));
                              }}
                              className="text-xs bg-primary-50 text-primary-600 hover:bg-primary-100 px-3 py-1.5 rounded font-semibold transition-colors"
                            >
                              Terima Pesanan
                            </button>
                          ) : (
                            <span className="text-xs font-semibold text-slate-400">{order.status === 'delivered' ? 'Tuntas' : 'Menunggu'}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Profil Kemitraan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <h4 className="text-sm font-semibold text-slate-800">{user?.name || 'Mitra NADI-TANI'}</h4>
                  <p className="text-xs text-slate-500 mt-1">Mitra B2B Terverifikasi</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Level Kemitraan</span>
                    <span className="font-semibold text-gold-dark">Platinum</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Batas Kredit</span>
                    <span className="font-semibold text-slate-700">{formatRupiah(500000000)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Tempo Pembayaran</span>
                    <span className="font-semibold text-slate-700">30 Hari</span>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100">
                  <h4 className="text-sm font-semibold text-slate-800 mb-3">Produk Favorit</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs px-2 py-1 bg-primary-50 text-primary-700 rounded-md">Beras Premium</span>
                    <span className="text-xs px-2 py-1 bg-primary-50 text-primary-700 rounded-md">Briket Sekam</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Riwayat Pembayaran</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="min-w-[760px] w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600">
                    <tr>
                      <th className="px-6 py-3 font-medium">No. Invoice</th>
                      <th className="px-6 py-3 font-medium">Tanggal</th>
                      <th className="px-6 py-3 font-medium">Jumlah</th>
                      <th className="px-6 py-3 font-medium">Metode</th>
                      <th className="px-6 py-3 font-medium text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paymentHistory.map((payment, i) => (
                      <tr key={i} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4 font-medium text-slate-800">{payment.invoice}</td>
                        <td className="px-6 py-4 text-slate-500">{payment.date}</td>
                        <td className="px-6 py-4 font-medium">{formatRupiah(payment.amount)}</td>
                        <td className="px-6 py-4 text-slate-500">{payment.method}</td>
                        <td className="px-6 py-4 text-center">
                          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                            payment.status === 'Lunas' ? 'bg-green-100 text-green-700' :
                            payment.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {payment.status === 'Lunas' && <CheckCircle2 className="w-3.5 h-3.5" />}
                            {payment.status === 'Pending' && <Clock className="w-3.5 h-3.5" />}
                            {payment.status === 'Gagal' && <AlertCircle className="w-3.5 h-3.5" />}
                            {payment.status}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Tren Pembelian</CardTitle>
              <p className="text-sm text-slate-500 mt-1">Volume 6 Bulan Terakhir (Ton)</p>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between gap-2 pt-4">
                {trendData.map((data, i) => (
                  <button type="button" aria-label={`${data.month}: ${data.value} ton`} onClick={() => setSelectedTrendIndex(i)} key={i} className="group flex flex-1 flex-col items-center gap-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500">
                    <div className="relative w-full flex justify-center h-48 items-end">
                      <div
                        className={`relative w-full max-w-[40px] rounded-t-md transition-colors ${selectedTrendIndex === i ? 'bg-primary-200 ring-2 ring-primary-300' : 'bg-primary-100 group-hover:bg-primary-200'}`}
                        style={{ height: `${(data.value / 150) * 100}%` }}
                      >
                        <div className={`pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 rounded bg-slate-800 px-2 py-1 text-xs text-white transition-opacity ${selectedTrendIndex === i ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                          {data.value}T
                        </div>
                        <div
                          className="absolute bottom-0 w-full bg-primary-600 rounded-t-md"
                          style={{ height: `100%` }}
                        />
                      </div>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">{data.month}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AnimatePresence>
        {showOrderModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="mitra-order-title"
              className="flex max-h-[calc(100dvh-2rem)] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
            >
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 id="mitra-order-title" className="font-semibold text-lg text-slate-800">Buat Pesanan Baru</h3>
                <button
                  aria-label="Tutup formulir pesanan"
                  onClick={() => setShowOrderModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleOrderSubmit} className="space-y-4 overflow-y-auto p-4 sm:p-6">
                <div className="space-y-2">
                  <label htmlFor="mitra-product" className="text-sm font-medium text-slate-700">Pilih Produk</label>
                  <select
                    id="mitra-product"
                    value={orderForm.productId}
                    onChange={e => setOrderForm({...orderForm, productId: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                  >
                    {products.map(product => <option key={product.id} value={product.id}>{product.name} · stok {product.stock}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="mitra-quantity" className="text-sm font-medium text-slate-700">Kuantitas (Item)</label>
                  <input
                    id="mitra-quantity"
                    type="number"
                    min={products.find(product => product.id === orderForm.productId)?.minOrder || 1}
                    max={products.find(product => product.id === orderForm.productId)?.stock}
                    step="1"
                    required
                    placeholder="Contoh: 10"
                    value={orderForm.qty}
                    onChange={e => setOrderForm({...orderForm, qty: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  {selectedProduct && <p className="text-xs text-slate-500">Minimum {selectedProduct.minOrder} {selectedProduct.unit || 'item'} • stok {selectedProduct.stock.toLocaleString('id-ID')}</p>}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="mitra-recipient" className="text-sm font-medium text-slate-700">Nama Penerima</label>
                    <input id="mitra-recipient" required value={orderForm.recipientName} onChange={e => setOrderForm({ ...orderForm, recipientName: e.target.value })} placeholder="Nama penerima" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="mitra-phone" className="text-sm font-medium text-slate-700">Nomor Telepon</label>
                    <input id="mitra-phone" type="tel" required value={orderForm.phone} onChange={e => setOrderForm({ ...orderForm, phone: e.target.value })} placeholder="08xxxxxxxxxx" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="mitra-address" className="text-sm font-medium text-slate-700">Alamat Pengiriman</label>
                  <textarea
                    id="mitra-address"
                    required
                    placeholder="Alamat lengkap gudang/penerima..."
                    value={orderForm.address}
                    onChange={e => setOrderForm({...orderForm, address: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 h-24 resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="mitra-payment" className="text-sm font-medium text-slate-700">Metode Pembayaran</label>
                  <select id="mitra-payment" value={orderForm.paymentMethod} onChange={e => setOrderForm({ ...orderForm, paymentMethod: e.target.value })} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option>Transfer Bank</option>
                    <option>Virtual Account</option>
                    <option>Termin 30 Hari</option>
                    <option>Bayar di Tempat</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="mitra-note" className="text-sm font-medium text-slate-700">Catatan (Opsional)</label>
                  <textarea
                    id="mitra-note"
                    placeholder="Instruksi khusus pengiriman..."
                    value={orderForm.note}
                    onChange={e => setOrderForm({...orderForm, note: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 h-16 resize-none"
                  />
                </div>
                <div className="rounded-xl border border-primary-100 bg-primary-50 p-3 text-sm">
                  <div className="flex justify-between text-slate-600"><span>Subtotal</span><strong>{formatRupiah(orderSubtotal)}</strong></div>
                  <div className="mt-2 flex justify-between text-slate-600"><span>Estimasi ongkir</span><strong>{estimatedShipping === 0 ? 'Gratis' : formatRupiah(estimatedShipping)}</strong></div>
                  <div className="mt-3 flex justify-between border-t border-primary-100 pt-3 font-extrabold text-primary-800"><span>Total</span><span>{formatRupiah(orderSubtotal + estimatedShipping)}</span></div>
                </div>
                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowOrderModal(false)}
                    className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingOrder}
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmittingOrder ? 'Menyimpan...' : 'Konfirmasi Pesanan'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
