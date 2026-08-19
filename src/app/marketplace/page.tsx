"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, ShoppingCart, MapPin, Package, ShieldCheck, X, Plus, Minus } from 'lucide-react';
import { Product } from '@/lib/types';
import { marketplaceService } from '@/lib/services/marketplace.service';
import { formatRupiah, formatWeight } from '@/lib/utils/format';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth/AuthContext';

interface CartItem {
  product: Product;
  quantity: number;
}

export default function MarketplacePage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter & Sort States
  const [showFilters, setShowFilters] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('Semua');
  const [priceFilter, setPriceFilter] = useState('Semua Harga');
  const [sortOption, setSortOption] = useState('Terbaru');

  // Cart States
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Modal States
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalQuantity, setModalQuantity] = useState(1);

  // Checkout States
  const [checkoutForm, setCheckoutForm] = useState({
    name: '',
    address: '',
    paymentMethod: 'COD'
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await marketplaceService.getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (!isCartOpen && !selectedProduct && !isCheckoutOpen) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (isCheckoutOpen) setIsCheckoutOpen(false);
      else if (selectedProduct) setSelectedProduct(null);
      else setIsCartOpen(false);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isCartOpen, isCheckoutOpen, selectedProduct]);

  // Filtering Logic
  let filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (categoryFilter !== 'Semua') {
    filteredProducts = filteredProducts.filter(p => p.category === categoryFilter);
  }

  if (priceFilter !== 'Semua Harga') {
    if (priceFilter === 'Di bawah Rp 50.000') filteredProducts = filteredProducts.filter(p => p.price < 50000);
    else if (priceFilter === 'Rp 50.000 - Rp 100.000') filteredProducts = filteredProducts.filter(p => p.price >= 50000 && p.price <= 100000);
    else if (priceFilter === 'Di atas Rp 100.000') filteredProducts = filteredProducts.filter(p => p.price > 100000);
  }

  // Sorting Logic
  if (sortOption === 'Harga Terendah') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortOption === 'Harga Tertinggi') {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortOption === 'Terbaru') {
    // mock sort by ID desc as 'Terbaru'
    filteredProducts.sort((a, b) => b.id.localeCompare(a.id));
  } else if (sortOption === 'Terlaris') {
    // mock sort by stock desc just as a dummy logic
    filteredProducts.sort((a, b) => b.stock - a.stock);
  }

  const addToCart = (product: Product, quantity = 1) => {
    if (product.stock <= 0) {
      toast.error(`Stok ${product.name} sedang habis`);
      return;
    }
    const requestedQuantity = Math.max(product.minOrder, quantity);
    const existing = cartItems.find(item => item.product.id === product.id);
    const nextQuantity = Math.min(product.stock, (existing?.quantity || 0) + requestedQuantity);
    if (existing && existing.quantity >= product.stock) {
      toast.info(`Jumlah sudah mencapai stok tersedia (${product.stock})`);
      return;
    }
    setCartItems(prev => {
      const current = prev.find(item => item.product.id === product.id);
      if (current) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: nextQuantity }
            : item
        );
      }
      return [...prev, { product, quantity: Math.min(product.stock, requestedQuantity) }];
    });
    toast.success(`Produk ${product.name} ditambahkan ke keranjang!`);
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQuantity = Math.min(item.product.stock, Math.max(item.product.minOrder, item.quantity + delta));
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const cartTotal = cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const cartItemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutForm.name || !checkoutForm.address) {
      toast.error('Mohon lengkapi data pengiriman');
      return;
    }
    try {
      const order = await marketplaceService.createOrder({
        buyerId: user?.id || 'mitra-guest',
        daiId: cartItems[0]?.product.daiId || 'DAI-NGW-01',
        items: cartItems.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
        })),
        totalAmount: cartTotal,
        shippingAddress: checkoutForm.address,
      });
      setProducts(await marketplaceService.getProducts());
      toast.success(`Pesanan ${order.id} berhasil disimpan`);
      setCartItems([]);
      setIsCheckoutOpen(false);
      setIsCartOpen(false);
      setCheckoutForm({ name: '', address: '', paymentMethod: 'COD' });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Pesanan gagal dibuat');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 pt-16 sm:pt-20">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-primary-900 px-4 py-12 text-white sm:py-16 lg:px-8 lg:py-20">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary-900 to-green-900 z-0 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 z-0 mix-blend-overlay"></div>

        {/* Cart Icon Top Right */}
        <div className="absolute top-8 right-8 z-20">
          <Button aria-label={`Buka keranjang, ${cartItemCount} barang`} variant="outline" className="relative bg-white/10 border-white/20 hover:bg-white/20 text-white rounded-full p-3 h-12 w-12" onClick={() => setIsCartOpen(true)}>
            <ShoppingCart className="w-6 h-6" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {cartItemCount}
              </span>
            )}
          </Button>
        </div>

        <motion.div
          className="container relative z-10 mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.35fr_0.65fr]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-3xl pr-10 sm:pr-0">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-emerald-100 backdrop-blur-sm">
              <ShieldCheck className="h-4 w-4" /> Produk DAI terverifikasi
            </span>
            <h1 className="text-display font-extrabold mb-6 leading-tight drop-shadow-md">Marketplace DAI</h1>
            <p className="text-xl text-primary-100 mb-10 font-medium">
              Pesan beras premium, medium, dan produk hilirisasi langsung dari Depo Agroindustri Integrasi (DAI). Terjamin kualitas dan transparansi asal-usulnya.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl">
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                <Input
                  placeholder="Cari beras premium, biochar, bekatul..."
                  className="pl-12 h-14 text-lg bg-white/95 backdrop-blur-sm text-slate-900 border-none rounded-2xl shadow-lg focus-visible:ring-2 focus-visible:ring-primary-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button onClick={() => setShowFilters(!showFilters)} variant="outline" className={`h-12 w-full rounded-2xl border-2 border-white/20 px-6 font-bold text-white shadow-lg backdrop-blur-md sm:h-14 sm:w-auto sm:px-8 sm:text-lg ${showFilters ? 'bg-primary-600' : 'bg-white/10 hover:bg-white/20'}`}>
                <Filter className="w-5 h-5 mr-3" /> Filter
              </Button>
            </div>

            {/* Filter Panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="bg-white rounded-2xl p-6 text-slate-800 shadow-xl overflow-hidden mt-4 grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                  <div>
                    <label htmlFor="marketplace-category" className="block text-sm font-bold text-slate-500 mb-2">Kategori</label>
                    <select
                      id="marketplace-category"
                      className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-primary-500 outline-none"
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                      <option value="Semua">Semua kategori</option>
                      <option value="beras">Beras</option>
                      <option value="byproduct">Produk samping</option>
                      <option value="pakan">Pakan ternak</option>
                      <option value="pupuk">Pupuk organik</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="marketplace-price" className="block text-sm font-bold text-slate-500 mb-2">Harga</label>
                    <select
                      id="marketplace-price"
                      className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-primary-500 outline-none"
                      value={priceFilter}
                      onChange={(e) => setPriceFilter(e.target.value)}
                    >
                      {['Semua Harga', 'Di bawah Rp 50.000', 'Rp 50.000 - Rp 100.000', 'Di atas Rp 100.000'].map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="marketplace-sort" className="block text-sm font-bold text-slate-500 mb-2">Urutkan</label>
                    <select
                      id="marketplace-sort"
                      className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-primary-500 outline-none"
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                    >
                      {['Terbaru', 'Harga Terendah', 'Harga Tertinggi', 'Terlaris'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative hidden min-h-[310px] lg:block" aria-hidden="true">
            <div className="absolute inset-y-0 right-4 w-[78%] overflow-hidden rounded-[2rem] border border-white/20 bg-white/10 shadow-2xl shadow-black/20 backdrop-blur-sm">
              <Image src="/images/products/beras-premium-5kg.jpg" alt="" fill className="object-cover" sizes="360px" />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-200">Pilihan petani</p>
                <p className="mt-1 text-xl font-extrabold text-white">Beras Premium DAI</p>
                <p className="mt-1 text-sm text-white/75">Asal produk dan mutu terlacak</p>
              </div>
            </div>
            <div className="absolute left-0 top-24 w-44 overflow-hidden rounded-2xl border-4 border-primary-900 bg-white shadow-xl">
              <div className="relative h-28"><Image src="/images/products/biochar.jpg" alt="" fill className="object-cover" sizes="176px" /></div>
              <div className="p-3 text-slate-800"><p className="text-xs font-bold">Produk hilirisasi</p><p className="text-[11px] text-slate-500">Bernilai dan berkelanjutan</p></div>
            </div>
            <div className="absolute right-0 top-5 rounded-2xl border border-white/20 bg-white/95 p-4 text-slate-800 shadow-xl">
              <Package className="mb-2 h-5 w-5 text-emerald-700" />
              <p className="font-extrabold">6 produk</p>
              <p className="text-xs text-slate-500">siap dipesan</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-6xl px-4 py-10 sm:py-16 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 sm:mb-10">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-800">Katalog Produk</h2>
            <div className="h-1 w-12 bg-primary-500 mt-4 rounded-full"></div>
          </div>
          <span className="text-sm font-medium text-slate-500 bg-slate-200 px-4 py-2 rounded-full">{filteredProducts.length} Produk ditemukan</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Card key={i} className="overflow-hidden rounded-3xl border-0 shadow-sm">
                <Skeleton className="h-56 w-full rounded-none bg-slate-200" />
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-4 bg-slate-200" />
                  <Skeleton className="h-4 w-1/2 mb-6 bg-slate-200" />
                  <Skeleton className="h-10 w-1/3 mb-6 bg-slate-200" />
                  <Skeleton className="h-12 w-full rounded-xl bg-slate-200" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {filteredProducts.map((product, index) => (
              <motion.div key={product.id} variants={itemVariants}>
                <Card className="overflow-hidden flex flex-col h-full rounded-3xl border border-slate-200 shadow-md hover:shadow-2xl transition-all duration-300 group hover:-translate-y-1 cursor-pointer" onClick={() => { setSelectedProduct(product); setModalQuantity(product.minOrder); }}>
                  <div className="h-56 bg-slate-100 relative flex items-center justify-center overflow-hidden">
                    <Image src={product.images[0]} alt={product.name} fill priority={index === 0} className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent z-0"></div>
                    <div className="absolute top-4 right-4 z-20">
                      <Badge variant={product.grade === 'A' ? 'success' : 'secondary'} className={`px-3 py-1 font-bold shadow-sm ${product.grade === 'A' ? 'bg-green-500 text-white border-none' : 'bg-white text-slate-700'}`}>
                        {product.grade ? `Grade ${product.grade}` : 'Produk hilir'}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-6 flex flex-col flex-1 bg-white">
                    <div className="mb-4">
                      <h3 className="font-extrabold text-xl text-slate-800 line-clamp-2">{product.name}</h3>
                      <p className="text-sm text-slate-500 mt-1">{product.category}</p>
                    </div>

                    <div className="text-sm text-slate-500 space-y-3 mb-6 flex-1">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-3 text-slate-400" />
                        <span className="font-medium text-slate-600">{product.daiId}</span>
                      </div>
                      {product.certification && product.certification.length > 0 && (
                        <div className="flex items-center text-green-600 font-medium">
                          <ShieldCheck className="w-4 h-4 mr-3" />
                          <span>Tersertifikasi ({product.certification[0]})</span>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-slate-100 pt-5 mb-6">
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Harga per kg</p>
                          <p className="font-black text-2xl text-primary-700">{formatRupiah(product.price)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Stok</p>
                          <p className="font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg">{formatWeight(product.stock)}</p>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product, product.minOrder);
                      }}
                      className="w-full h-12 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold shadow-md shadow-primary-600/20 transition-all hover:shadow-lg hover:shadow-primary-600/30"
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" /> Pesan Sekarang
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <motion.div
            className="text-center py-24 bg-white rounded-3xl border border-slate-200 shadow-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Package className="w-20 h-20 text-slate-300 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-slate-700 mb-2">Produk tidak ditemukan</h3>
            <p className="text-lg text-slate-500">Coba ubah kata kunci pencarian Anda.</p>
          </motion.div>
        )}
      </div>

      {/* Slide-out Cart Panel */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/50 z-40 backdrop-blur-sm"
              onClick={() => setIsCartOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="cart-title"
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <h2 id="cart-title" className="text-xl font-extrabold text-slate-800 flex items-center">
                  <ShoppingCart className="mr-3 w-6 h-6 text-primary-600" /> Keranjang Belanja
                </h2>
                <button aria-label="Tutup keranjang" onClick={() => setIsCartOpen(false)} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {cartItems.length === 0 ? (
                  <div className="text-center py-20">
                    <ShoppingCart className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-500 text-lg">Keranjang Anda masih kosong</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {cartItems.map(item => (
                      <div key={item.product.id} className="flex gap-4 border-b border-slate-100 pb-6">
                        <div className="relative w-20 h-20 bg-slate-100 rounded-xl overflow-hidden shrink-0">
                          <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" sizes="80px" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-800 line-clamp-1">{item.product.name}</h4>
                          <p className="text-primary-600 font-bold mt-1">{formatRupiah(item.product.price)}</p>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center bg-slate-100 rounded-lg">
                              <button aria-label={`Kurangi jumlah ${item.product.name}`} disabled={item.quantity <= item.product.minOrder} onClick={() => updateCartQuantity(item.product.id, -1)} className="p-1.5 text-slate-600 hover:text-primary-600 disabled:opacity-40"><Minus className="w-4 h-4" /></button>
                              <span className="w-8 text-center font-semibold text-sm">{item.quantity}</span>
                              <button aria-label={`Tambah jumlah ${item.product.name}`} disabled={item.quantity >= item.product.stock} onClick={() => updateCartQuantity(item.product.id, 1)} className="p-1.5 text-slate-600 hover:text-primary-600 disabled:opacity-40"><Plus className="w-4 h-4" /></button>
                            </div>
                            <button onClick={() => removeFromCart(item.product.id)} className="text-sm text-red-500 font-medium hover:underline">Hapus</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cartItems.length > 0 && (
                <div className="p-6 border-t border-slate-100 bg-slate-50">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-slate-500 font-medium">Subtotal</span>
                    <span className="text-2xl font-black text-slate-800">{formatRupiah(cartTotal)}</span>
                  </div>
                  <Button
                    onClick={() => setIsCheckoutOpen(true)}
                    className="w-full h-14 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-lg shadow-lg"
                  >
                    Lanjut Checkout
                  </Button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 z-50 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setSelectedProduct(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="product-detail-title"
                className="flex max-h-[calc(100dvh-2rem)] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl md:max-h-[90vh] md:flex-row md:rounded-3xl"
              >
                <div className="relative min-h-72 bg-slate-100 md:min-h-full md:w-2/5">
                  <button aria-label="Tutup detail produk" onClick={() => setSelectedProduct(null)} className="absolute top-4 left-4 p-2 bg-white rounded-full shadow-sm md:hidden">
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                  <Image src={selectedProduct.images[0]} alt={selectedProduct.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 40vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent" />
                  <Badge variant={selectedProduct.grade === 'A' ? 'success' : 'secondary'} className={`absolute top-4 right-4 px-3 py-1 font-bold shadow-sm ${selectedProduct.grade === 'A' ? 'bg-green-500 text-white border-none' : 'bg-white text-slate-700'}`}>
                    {selectedProduct.grade ? `Grade ${selectedProduct.grade}` : 'Produk hilir'}
                  </Badge>
                </div>
                <div className="md:w-3/5 p-8 overflow-y-auto">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 id="product-detail-title" className="text-2xl font-extrabold text-slate-800 mb-2">{selectedProduct.name}</h2>
                      <p className="text-slate-500 font-medium">{selectedProduct.category}</p>
                    </div>
                    <button aria-label="Tutup detail produk" onClick={() => setSelectedProduct(null)} className="hidden md:block p-2 bg-slate-100 rounded-full hover:bg-slate-200">
                      <X className="w-5 h-5 text-slate-500" />
                    </button>
                  </div>

                  <div className="mt-6 space-y-4">
                    <p className="text-3xl font-black text-primary-700">{formatRupiah(selectedProduct.price)} <span className="text-sm font-medium text-slate-500">/ kg</span></p>

                    <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 flex items-center"><MapPin className="w-4 h-4 mr-2" /> Asal DAI</span>
                        <span className="font-bold text-slate-800">{selectedProduct.daiId}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 flex items-center"><Package className="w-4 h-4 mr-2" /> Stok Tersedia</span>
                        <span className="font-bold text-slate-800">{formatWeight(selectedProduct.stock)}</span>
                      </div>
                      {selectedProduct.certification && selectedProduct.certification.length > 0 && (
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 flex items-center"><ShieldCheck className="w-4 h-4 mr-2" /> Sertifikasi</span>
                          <span className="font-bold text-green-600">{selectedProduct.certification.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-8 pt-8 border-t border-slate-100">
                    <div className="flex items-center gap-4 mb-6">
                      <span className="font-bold text-slate-700">Jumlah:</span>
                      <div className="flex items-center bg-slate-100 rounded-xl">
                        <button aria-label="Kurangi jumlah" disabled={modalQuantity <= selectedProduct.minOrder} onClick={() => setModalQuantity(Math.max(selectedProduct.minOrder, modalQuantity - 1))} className="p-3 text-slate-600 hover:text-primary-600 disabled:opacity-40"><Minus className="w-5 h-5" /></button>
                        <span className="w-12 text-center font-bold text-lg">{modalQuantity}</span>
                        <button aria-label="Tambah jumlah" disabled={modalQuantity >= selectedProduct.stock} onClick={() => setModalQuantity(Math.min(selectedProduct.stock, modalQuantity + 1))} className="p-3 text-slate-600 hover:text-primary-600 disabled:opacity-40"><Plus className="w-5 h-5" /></button>
                      </div>
                      <span className="text-slate-500">kg</span>
                    </div>

                    <Button
                      onClick={() => {
                        addToCart(selectedProduct, modalQuantity);
                        setSelectedProduct(null);
                        setIsCartOpen(true);
                      }}
                      className="w-full h-14 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-lg shadow-lg"
                    >
                      Tambah ke Keranjang - {formatRupiah(selectedProduct.price * modalQuantity)}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Checkout Modal */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 z-[60] backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setIsCheckoutOpen(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="checkout-title"
              className="fixed left-1/2 top-1/2 z-[70] flex max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:rounded-3xl"
            >
              <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 p-4 sm:p-6">
                <h2 id="checkout-title" className="text-2xl font-extrabold text-slate-800">Checkout</h2>
                <button aria-label="Tutup checkout" onClick={() => setIsCheckoutOpen(false)} className="p-2 bg-white rounded-full hover:bg-slate-100 shadow-sm">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="overflow-y-auto p-4 sm:p-6">
                <form id="checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="checkout-name" className="block text-sm font-bold text-slate-700 mb-2">Nama Penerima</label>
                    <Input
                      id="checkout-name"
                      required
                      placeholder="Masukkan nama lengkap"
                      className="h-12 bg-slate-50"
                      value={checkoutForm.name}
                      onChange={e => setCheckoutForm({...checkoutForm, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label htmlFor="checkout-address" className="block text-sm font-bold text-slate-700 mb-2">Alamat Pengiriman</label>
                    <textarea
                      id="checkout-address"
                      required
                      placeholder="Masukkan alamat lengkap..."
                      className="w-full h-24 p-4 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                      value={checkoutForm.address}
                      onChange={e => setCheckoutForm({...checkoutForm, address: e.target.value})}
                    />
                  </div>
                  <div>
                    <label htmlFor="checkout-payment" className="block text-sm font-bold text-slate-700 mb-2">Metode Pembayaran</label>
                    <select
                      id="checkout-payment"
                      className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-primary-500 outline-none font-medium"
                      value={checkoutForm.paymentMethod}
                      onChange={e => setCheckoutForm({...checkoutForm, paymentMethod: e.target.value})}
                    >
                      <option value="COD">Bayar di Tempat (COD)</option>
                      <option value="Transfer Bank">Transfer Bank</option>
                      <option value="E-Wallet">E-Wallet (GoPay, OVO, dll)</option>
                    </select>
                  </div>
                </form>

                <div className="mt-8 bg-slate-50 rounded-xl p-5 border border-slate-100">
                  <h3 className="font-bold text-slate-700 mb-4">Ringkasan Pesanan</h3>
                  <div className="space-y-2 mb-4">
                    {cartItems.map(item => (
                      <div key={item.product.id} className="flex justify-between text-sm">
                        <span className="text-slate-600">{item.product.name} (x{item.quantity})</span>
                        <span className="font-medium text-slate-800">{formatRupiah(item.product.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                    <span className="font-bold text-slate-800">Total Pembayaran</span>
                    <span className="text-xl font-black text-primary-700">{formatRupiah(cartTotal)}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 bg-white p-4 sm:p-6">
                <Button
                  type="submit"
                  form="checkout-form"
                  className="w-full h-14 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-lg shadow-lg"
                >
                  Konfirmasi Pesanan
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
