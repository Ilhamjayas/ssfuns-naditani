"use client";

import React, { useMemo, useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Search,
  Filter,
  ShoppingCart,
  MapPin,
  Package,
  ShieldCheck,
  X,
  Plus,
  Minus,
  Heart,
  ClipboardList,
  RotateCcw,
  Star,
  Truck,
  Clock3,
  CheckCircle2,
  PackageCheck,
  CreditCard,
  Store,
  ChevronRight,
  Trash2,
} from 'lucide-react';
import { BuyerOrder, Product } from '@/lib/types';
import { marketplaceService } from '@/lib/services/marketplace.service';
import { formatRupiah } from '@/lib/utils/format';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth/AuthContext';

interface CartItem {
  product: Product;
  quantity: number;
}

const categories = [
  { value: 'Semua', label: 'Semua Produk', icon: Store },
  { value: 'beras', label: 'Beras', icon: PackageCheck },
  { value: 'byproduct', label: 'Produk Samping', icon: RotateCcw },
  { value: 'pakan', label: 'Pakan Ternak', icon: Package },
  { value: 'pupuk', label: 'Pupuk Organik', icon: ShieldCheck },
] as const;

const orderStatus = {
  pending: { label: 'Menunggu konfirmasi', className: 'bg-amber-100 text-amber-700', step: 1 },
  paid: { label: 'Pembayaran diterima', className: 'bg-blue-100 text-blue-700', step: 2 },
  processing: { label: 'Sedang diproses', className: 'bg-blue-100 text-blue-700', step: 2 },
  shipped: { label: 'Dalam pengiriman', className: 'bg-violet-100 text-violet-700', step: 3 },
  delivered: { label: 'Pesanan diterima', className: 'bg-emerald-100 text-emerald-700', step: 4 },
  cancelled: { label: 'Dibatalkan', className: 'bg-red-100 text-red-700', step: 0 },
} as const;

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
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  // Cart States
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [orders, setOrders] = useState<BuyerOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<BuyerOrder | null>(null);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [preferencesOwner, setPreferencesOwner] = useState<string | null>(null);

  // Modal States
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalQuantity, setModalQuantity] = useState(1);

  // Checkout States
  const [checkoutForm, setCheckoutForm] = useState({
    name: '',
    phone: '',
    address: '',
    paymentMethod: 'COD',
    notes: '',
  });

  const buyerId = user?.id || 'marketplace-guest';
  const cartStorageKey = `nadi_marketplace_cart_${buyerId}`;
  const favoriteStorageKey = `nadi_marketplace_favorites_${buyerId}`;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await marketplaceService.getProducts();
        setProducts(data);
        const [orderData] = await Promise.all([marketplaceService.getOrders(buyerId)]);
        setOrders(orderData);

        try {
          const savedCart = JSON.parse(localStorage.getItem(cartStorageKey) || '[]') as { productId: string; quantity: number }[];
          const hydratedCart = savedCart.flatMap(item => {
            const product = data.find(productItem => productItem.id === item.productId);
            if (!product || product.stock <= 0) return [];
            return [{ product, quantity: Math.min(product.stock, Math.max(product.minOrder, item.quantity)) }];
          });
          setCartItems(hydratedCart);
          setFavoriteIds(JSON.parse(localStorage.getItem(favoriteStorageKey) || '[]') as string[]);
        } catch {
          localStorage.removeItem(cartStorageKey);
          localStorage.removeItem(favoriteStorageKey);
        }
        setPreferencesOwner(buyerId);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [buyerId, cartStorageKey, favoriteStorageKey]);

  useEffect(() => {
    if (preferencesOwner !== buyerId) return;
    localStorage.setItem(cartStorageKey, JSON.stringify(cartItems.map(item => ({ productId: item.product.id, quantity: item.quantity }))));
  }, [buyerId, cartItems, cartStorageKey, preferencesOwner]);

  useEffect(() => {
    if (preferencesOwner !== buyerId) return;
    localStorage.setItem(favoriteStorageKey, JSON.stringify(favoriteIds));
  }, [buyerId, favoriteIds, favoriteStorageKey, preferencesOwner]);

  useEffect(() => {
    if (!isCartOpen && !selectedProduct && !isCheckoutOpen && !isOrdersOpen && !selectedOrder) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (selectedOrder) setSelectedOrder(null);
      else if (isCheckoutOpen) setIsCheckoutOpen(false);
      else if (selectedProduct) setSelectedProduct(null);
      else if (isOrdersOpen) setIsOrdersOpen(false);
      else setIsCartOpen(false);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isCartOpen, isCheckoutOpen, isOrdersOpen, selectedOrder, selectedProduct]);

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();
    const result = products.filter(product => {
      const matchesSearch = !normalizedSearch || [product.name, product.description, product.category, product.daiId]
        .some(value => value.toLowerCase().includes(normalizedSearch));
      const matchesCategory = categoryFilter === 'Semua' || product.category === categoryFilter;
      const matchesFavorite = !showFavoritesOnly || favoriteIds.includes(product.id);
      const matchesPrice = priceFilter === 'Semua Harga'
        || (priceFilter === 'Di bawah Rp 50.000' && product.price < 50000)
        || (priceFilter === 'Rp 50.000 - Rp 100.000' && product.price >= 50000 && product.price <= 100000)
        || (priceFilter === 'Di atas Rp 100.000' && product.price > 100000);
      return matchesSearch && matchesCategory && matchesFavorite && matchesPrice;
    });

    return [...result].sort((a, b) => {
      if (sortOption === 'Harga Terendah') return a.price - b.price;
      if (sortOption === 'Harga Tertinggi') return b.price - a.price;
      if (sortOption === 'Terlaris') return (b.sold || 0) - (a.sold || 0);
      if (sortOption === 'Rating Tertinggi') return (b.rating || 0) - (a.rating || 0);
      return b.id.localeCompare(a.id);
    });
  }, [categoryFilter, favoriteIds, priceFilter, products, searchQuery, showFavoritesOnly, sortOption]);

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

  const toggleFavorite = (product: Product) => {
    const isFavorite = favoriteIds.includes(product.id);
    setFavoriteIds(current => isFavorite ? current.filter(id => id !== product.id) : [...current, product.id]);
    toast.success(isFavorite ? `${product.name} dihapus dari favorit` : `${product.name} disimpan ke favorit`);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setCategoryFilter('Semua');
    setPriceFilter('Semua Harga');
    setSortOption('Terbaru');
    setShowFavoritesOnly(false);
    toast.info('Filter Marketplace direset');
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

  const setCartQuantity = (productId: string, quantity: number) => {
    setCartItems(current => current.map(item => item.product.id === productId
      ? { ...item, quantity: Math.min(item.product.stock, Math.max(item.product.minOrder, Math.floor(quantity) || item.product.minOrder)) }
      : item));
  };

  const cartTotal = cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const cartItemCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  const shippingCost = cartTotal >= 500000 ? 0 : 25000;
  const grandTotal = cartTotal + shippingCost;

  const openCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('Keranjang masih kosong');
      return;
    }
    setCheckoutForm(current => ({ ...current, name: current.name || user?.name || '' }));
    setIsCheckoutOpen(true);
  };

  const loadOrders = async () => {
    const data = await marketplaceService.getOrders(buyerId);
    setOrders(data);
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutForm.name.trim() || !checkoutForm.phone.trim() || !checkoutForm.address.trim()) {
      toast.error('Mohon lengkapi data pengiriman');
      return;
    }
    if (!/^[0-9+\-\s]{9,16}$/.test(checkoutForm.phone.trim())) {
      toast.error('Nomor telepon belum valid');
      return;
    }
    setIsSubmittingOrder(true);
    try {
      const order = await marketplaceService.createOrder({
        buyerId: user?.id || 'mitra-guest',
        daiId: cartItems[0]?.product.daiId || 'DAI-NGW-01',
        items: cartItems.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
        })),
        totalAmount: grandTotal,
        shippingAddress: checkoutForm.address,
        recipientName: checkoutForm.name,
        recipientPhone: checkoutForm.phone,
        paymentMethod: checkoutForm.paymentMethod,
        notes: checkoutForm.notes,
      });
      setProducts(await marketplaceService.getProducts());
      await loadOrders();
      toast.success(`Pesanan ${order.id} berhasil disimpan`);
      setCartItems([]);
      setIsCheckoutOpen(false);
      setIsCartOpen(false);
      setSelectedOrder(order);
      setCheckoutForm({ name: user?.name || '', phone: '', address: '', paymentMethod: 'COD', notes: '' });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Pesanan gagal dibuat');
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const handleCancelOrder = async (order: BuyerOrder) => {
    try {
      await marketplaceService.cancelOrder(order.id, buyerId);
      await Promise.all([loadOrders(), marketplaceService.getProducts().then(setProducts)]);
      setSelectedOrder(null);
      toast.success(`Pesanan ${order.id} berhasil dibatalkan`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Pesanan gagal dibatalkan');
    }
  };

  const handleReorder = (order: BuyerOrder) => {
    let addedCount = 0;
    order.items.forEach(orderItem => {
      const product = products.find(item => item.id === orderItem.productId);
      if (product?.stock) {
        addToCart(product, Math.min(orderItem.quantity, product.stock));
        addedCount += 1;
      }
    });
    if (addedCount > 0) {
      setSelectedOrder(null);
      setIsOrdersOpen(false);
      setIsCartOpen(true);
    } else {
      toast.error('Produk pada pesanan ini sedang tidak tersedia');
    }
  };

  const productById = (id: string) => products.find(product => product.id === id);

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

        {/* Marketplace actions */}
        <div className="absolute right-4 top-5 z-20 flex gap-2 sm:right-8 sm:top-8">
          <Button
            aria-label={`Tampilkan favorit, ${favoriteIds.length} produk`}
            variant="outline"
            className={`relative h-11 w-11 rounded-full border-white/20 p-0 text-white sm:h-12 sm:w-12 ${showFavoritesOnly ? 'bg-white text-primary-800 hover:bg-white' : 'bg-white/10 hover:bg-white/20'}`}
            onClick={() => {
              setShowFavoritesOnly(current => !current);
              window.requestAnimationFrame(() => document.getElementById('marketplace-catalog')?.scrollIntoView({ behavior: 'smooth' }));
            }}
          >
            <Heart className={`h-5 w-5 ${showFavoritesOnly ? 'fill-current' : ''}`} />
            {favoriteIds.length > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-primary-900">{favoriteIds.length}</span>}
          </Button>
          <Button
            aria-label={`Buka pesanan saya, ${orders.length} pesanan`}
            variant="outline"
            className="relative h-11 w-11 rounded-full border-white/20 bg-white/10 p-0 text-white hover:bg-white/20 sm:h-12 sm:w-12"
            onClick={() => setIsOrdersOpen(true)}
          >
            <ClipboardList className="h-5 w-5" />
            {orders.length > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-primary-900">{orders.length}</span>}
          </Button>
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
          <div className="max-w-3xl pt-12 sm:pt-0 sm:pr-0">
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
                  aria-label="Cari produk Marketplace"
                  placeholder="Cari beras premium, biochar, bekatul..."
                  className="h-14 rounded-2xl border-none bg-white/95 pl-12 pr-12 text-lg text-slate-900 shadow-lg backdrop-blur-sm focus-visible:ring-2 focus-visible:ring-primary-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button type="button" aria-label="Hapus pencarian" onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <Button aria-expanded={showFilters} aria-controls="marketplace-filter-panel" onClick={() => setShowFilters(!showFilters)} variant="outline" className={`h-12 w-full rounded-2xl border-2 border-white/20 px-6 font-bold text-white shadow-lg backdrop-blur-md sm:h-14 sm:w-auto sm:px-8 sm:text-lg ${showFilters ? 'bg-primary-600' : 'bg-white/10 hover:bg-white/20'}`}>
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
                  id="marketplace-filter-panel"
                  className="mt-4 grid grid-cols-1 gap-5 overflow-hidden rounded-2xl bg-white p-5 text-slate-800 shadow-xl md:grid-cols-3 sm:p-6"
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
                      {['Terbaru', 'Harga Terendah', 'Harga Tertinggi', 'Terlaris', 'Rating Tertinggi'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="md:col-span-3 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                    <p className="text-xs font-medium text-slate-500">Filter aktif langsung diterapkan pada katalog.</p>
                    <Button type="button" variant="ghost" size="sm" onClick={resetFilters} className="text-primary-700 hover:bg-primary-50">
                      <RotateCcw className="mr-2 h-4 w-4" /> Reset Filter
                    </Button>
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
              <p className="font-extrabold">{products.length || 6} produk</p>
              <p className="text-xs text-slate-500">siap dipesan</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div id="marketplace-catalog" className="container mx-auto max-w-6xl scroll-mt-20 px-4 py-10 sm:py-16 lg:px-8">
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map(category => {
            const Icon = category.icon;
            const active = categoryFilter === category.value;
            return (
              <button
                key={category.value}
                type="button"
                onClick={() => setCategoryFilter(category.value)}
                className={`flex min-h-14 items-center gap-2 rounded-2xl border px-3 py-3 text-left text-xs font-bold transition-all sm:text-sm ${active ? 'border-primary-200 bg-primary-50 text-primary-700 shadow-sm' : 'border-slate-200 bg-white text-slate-600 hover:border-primary-200 hover:bg-primary-50/50'}`}
              >
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${active ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-500'}`}><Icon className="h-4 w-4" /></span>
                {category.label}
              </button>
            );
          })}
        </div>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 sm:mb-10">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-800">Katalog Produk</h2>
            <div className="h-1 w-12 bg-primary-500 mt-4 rounded-full"></div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {showFavoritesOnly && <span className="rounded-full bg-rose-50 px-3 py-2 text-xs font-bold text-rose-600"><Heart className="mr-1 inline h-3.5 w-3.5 fill-current" /> Favorit saja</span>}
            <span className="rounded-full bg-slate-200 px-4 py-2 text-sm font-medium text-slate-500">{filteredProducts.length} Produk ditemukan</span>
          </div>
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
                <Card className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                  <div className="h-56 bg-slate-100 relative flex items-center justify-center overflow-hidden">
                    <button type="button" aria-label={`Lihat detail ${product.name}`} onClick={() => { setSelectedProduct(product); setModalQuantity(product.minOrder); }} className="absolute inset-0 z-10">
                      <Image src={product.images[0]} alt={product.name} fill priority={index === 0} className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                    </button>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent z-0"></div>
                    <button
                      type="button"
                      aria-label={favoriteIds.includes(product.id) ? `Hapus ${product.name} dari favorit` : `Simpan ${product.name} ke favorit`}
                      onClick={() => toggleFavorite(product)}
                      className={`absolute left-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full shadow-md transition-colors ${favoriteIds.includes(product.id) ? 'bg-rose-500 text-white' : 'bg-white/95 text-slate-500 hover:text-rose-500'}`}
                    >
                      <Heart className={`h-5 w-5 ${favoriteIds.includes(product.id) ? 'fill-current' : ''}`} />
                    </button>
                    <div className="absolute top-4 right-4 z-20">
                      <Badge variant={product.grade === 'A' ? 'success' : 'secondary'} className={`px-3 py-1 font-bold shadow-sm ${product.grade === 'A' ? 'bg-green-500 text-white border-none' : 'bg-white text-slate-700'}`}>
                        {product.grade ? `Grade ${product.grade}` : 'Produk hilir'}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-6 flex flex-col flex-1 bg-white">
                    <div className="mb-4">
                      <h3 className="font-extrabold text-xl text-slate-800 line-clamp-2">{product.name}</h3>
                      <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-slate-500">
                        <span className="capitalize">{categories.find(category => category.value === product.category)?.label || product.category}</span>
                        <span>•</span>
                        <span className="flex items-center text-amber-600"><Star className="mr-1 h-3.5 w-3.5 fill-current" /> {product.rating?.toFixed(1) || '4.5'}</span>
                        <span>• {product.sold || 0} terjual</span>
                      </div>
                      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-500">{product.description}</p>
                    </div>

                    <div className="text-sm text-slate-500 space-y-3 mb-6 flex-1">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-3 text-slate-400" />
                        <span className="font-medium text-slate-600">{product.location || product.daiId}</span>
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
                          <p className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Harga per {product.unit || 'paket'}</p>
                          <p className="font-black text-2xl text-primary-700">{formatRupiah(product.price)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Stok</p>
                          <p className="font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg">{product.stock.toLocaleString('id-ID')} {product.unit || 'paket'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-[0.9fr_1.1fr] gap-2">
                      <Button type="button" variant="outline" onClick={() => { setSelectedProduct(product); setModalQuantity(product.minOrder); }} className="h-12 rounded-xl border-primary-200 font-bold text-primary-700 hover:bg-primary-50">
                        Detail
                      </Button>
                      <Button
                        type="button"
                        disabled={product.stock <= 0}
                        onClick={() => addToCart(product, product.minOrder)}
                        className="h-12 rounded-xl bg-primary-600 font-bold text-white shadow-md shadow-primary-600/20 transition-all hover:bg-primary-700 hover:shadow-lg"
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" /> {product.stock > 0 ? 'Tambah' : 'Stok Habis'}
                      </Button>
                    </div>
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
            <p className="mb-6 text-lg text-slate-500">Coba ubah kata kunci atau reset filter Marketplace.</p>
            <Button type="button" onClick={resetFilters} variant="outline" className="border-primary-200 text-primary-700">
              <RotateCcw className="mr-2 h-4 w-4" /> Tampilkan Semua Produk
            </Button>
          </motion.div>
        )}
      </div>

      {/* Orders panel */}
      <AnimatePresence>
        {isOrdersOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Tutup pesanan saya"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm"
              onClick={() => setIsOrdersOpen(false)}
            />
            <motion.aside
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="orders-title"
              className="fixed bottom-0 right-0 top-0 z-50 flex w-full max-w-lg flex-col bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-100 p-5 sm:p-6">
                <div>
                  <h2 id="orders-title" className="flex items-center text-xl font-extrabold text-slate-800"><ClipboardList className="mr-3 h-6 w-6 text-primary-600" /> Pesanan Saya</h2>
                  <p className="mt-1 text-xs text-slate-500">Pantau dan kelola transaksi Marketplace.</p>
                </div>
                <button aria-label="Tutup pesanan saya" onClick={() => setIsOrdersOpen(false)} className="rounded-full bg-slate-100 p-2 hover:bg-slate-200"><X className="h-5 w-5 text-slate-500" /></button>
              </div>

              <div className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-6">
                {orders.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
                    <ClipboardList className="mx-auto h-14 w-14 text-slate-200" />
                    <h3 className="mt-4 font-bold text-slate-700">Belum ada pesanan</h3>
                    <p className="mt-2 text-sm text-slate-500">Produk yang selesai di-checkout akan muncul di sini.</p>
                    <Button type="button" onClick={() => setIsOrdersOpen(false)} className="mt-6">Mulai Belanja</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map(order => {
                      const status = orderStatus[order.status];
                      const firstItem = order.items[0];
                      const firstProduct = productById(firstItem.productId);
                      return (
                        <article key={order.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                          <div className="flex items-start justify-between gap-3 border-b border-slate-100 p-4">
                            <div>
                              <p className="text-xs font-bold text-primary-700">{order.id}</p>
                              <p className="mt-1 text-xs text-slate-400">{new Date(order.orderDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                            </div>
                            <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${status.className}`}>{status.label}</span>
                          </div>
                          <div className="flex gap-3 p-4">
                            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                              {firstProduct ? <Image src={firstProduct.images[0]} alt={firstProduct.name} fill sizes="64px" className="object-cover" /> : <Package className="m-5 h-6 w-6 text-slate-300" />}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-bold text-slate-800">{firstProduct?.name || firstItem.productId}</p>
                              <p className="mt-1 text-xs text-slate-500">{order.items.length} jenis produk • {order.items.reduce((total, item) => total + item.quantity, 0)} item</p>
                              <p className="mt-2 font-extrabold text-primary-700">{formatRupiah(order.totalAmount)}</p>
                            </div>
                          </div>
                          <button type="button" onClick={() => { setSelectedOrder(order); setIsOrdersOpen(false); }} className="flex w-full items-center justify-between border-t border-slate-100 px-4 py-3 text-sm font-bold text-primary-700 hover:bg-primary-50">
                            Lihat detail dan pelacakan <ChevronRight className="h-4 w-4" />
                          </button>
                        </article>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

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
                <div className="flex items-center gap-2">
                  {cartItems.length > 0 && <button type="button" onClick={() => { setCartItems([]); toast.info('Keranjang dikosongkan'); }} className="rounded-lg px-2 py-1 text-xs font-bold text-red-500 hover:bg-red-50">Kosongkan</button>}
                  <button aria-label="Tutup keranjang" onClick={() => setIsCartOpen(false)} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>
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
                              <input
                                aria-label={`Jumlah ${item.product.name}`}
                                type="number"
                                min={item.product.minOrder}
                                max={item.product.stock}
                                value={item.quantity}
                                onChange={event => setCartQuantity(item.product.id, Number(event.target.value))}
                                className="h-8 w-12 bg-transparent text-center text-sm font-semibold outline-none"
                              />
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
                  <div className="mb-5 rounded-xl border border-primary-100 bg-primary-50 p-3 text-xs text-primary-800">
                    {cartTotal >= 500000 ? (
                      <p className="flex items-center font-bold"><CheckCircle2 className="mr-2 h-4 w-4" /> Anda mendapatkan gratis ongkir</p>
                    ) : (
                      <>
                        <p className="font-semibold">Tambah {formatRupiah(500000 - cartTotal)} lagi untuk gratis ongkir.</p>
                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-primary-100"><div className="h-full rounded-full bg-primary-600" style={{ width: `${Math.min(100, (cartTotal / 500000) * 100)}%` }} /></div>
                      </>
                    )}
                  </div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-slate-500 font-medium">Subtotal</span>
                    <span className="text-2xl font-black text-slate-800">{formatRupiah(cartTotal)}</span>
                  </div>
                  <Button
                    onClick={openCheckout}
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
                  <button aria-label="Tutup detail produk" onClick={() => setSelectedProduct(null)} className="absolute left-4 top-4 z-20 rounded-full bg-white p-2 shadow-sm md:hidden">
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
                      <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-slate-500">
                        <span className="capitalize">{categories.find(category => category.value === selectedProduct.category)?.label}</span>
                        <span>•</span>
                        <span className="flex items-center text-amber-600"><Star className="mr-1 h-4 w-4 fill-current" /> {selectedProduct.rating?.toFixed(1)}</span>
                        <span>• {selectedProduct.sold || 0} terjual</span>
                      </div>
                    </div>
                    <button aria-label="Tutup detail produk" onClick={() => setSelectedProduct(null)} className="hidden md:block p-2 bg-slate-100 rounded-full hover:bg-slate-200">
                      <X className="w-5 h-5 text-slate-500" />
                    </button>
                  </div>

                  <div className="mt-6 space-y-4">
                    <p className="text-3xl font-black text-primary-700">{formatRupiah(selectedProduct.price)} <span className="text-sm font-medium text-slate-500">/ {selectedProduct.unit || 'paket'}</span></p>

                    <div>
                      <h3 className="text-sm font-bold text-slate-800">Deskripsi produk</h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">{selectedProduct.description}</p>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 flex items-center"><MapPin className="w-4 h-4 mr-2" /> Asal DAI</span>
                        <span className="text-right font-bold text-slate-800">{selectedProduct.location || selectedProduct.daiId}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 flex items-center"><Package className="w-4 h-4 mr-2" /> Stok Tersedia</span>
                        <span className="font-bold text-slate-800">{selectedProduct.stock.toLocaleString('id-ID')} {selectedProduct.unit || 'paket'}</span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="flex items-center text-slate-500"><Clock3 className="mr-2 h-4 w-4" /> Estimasi</span>
                        <span className="font-bold text-slate-800">{selectedProduct.leadTime || 'Dikirim 2–3 hari'}</span>
                      </div>
                      {selectedProduct.certification && selectedProduct.certification.length > 0 && (
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 flex items-center"><ShieldCheck className="w-4 h-4 mr-2" /> Sertifikasi</span>
                          <span className="font-bold text-green-600">{selectedProduct.certification.join(', ')}</span>
                        </div>
                      )}
                    </div>

                    {selectedProduct.highlights && (
                      <div className="grid gap-2 sm:grid-cols-2">
                        {selectedProduct.highlights.map(highlight => (
                          <div key={highlight} className="flex items-start gap-2 rounded-xl border border-primary-100 bg-primary-50 p-3 text-xs font-semibold text-primary-800">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary-600" /> {highlight}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-8 pt-8 border-t border-slate-100">
                    <div className="flex items-center gap-4 mb-6">
                      <span className="font-bold text-slate-700">Jumlah:</span>
                      <div className="flex items-center bg-slate-100 rounded-xl">
                        <button aria-label="Kurangi jumlah" disabled={modalQuantity <= selectedProduct.minOrder} onClick={() => setModalQuantity(Math.max(selectedProduct.minOrder, modalQuantity - 1))} className="p-3 text-slate-600 hover:text-primary-600 disabled:opacity-40"><Minus className="w-5 h-5" /></button>
                        <span className="w-12 text-center font-bold text-lg">{modalQuantity}</span>
                        <button aria-label="Tambah jumlah" disabled={modalQuantity >= selectedProduct.stock} onClick={() => setModalQuantity(Math.min(selectedProduct.stock, modalQuantity + 1))} className="p-3 text-slate-600 hover:text-primary-600 disabled:opacity-40"><Plus className="w-5 h-5" /></button>
                      </div>
                      <span className="text-slate-500">{selectedProduct.unit || 'paket'}</span>
                    </div>

                    <p className="mb-4 text-xs text-slate-500">Minimum pemesanan {selectedProduct.minOrder} {selectedProduct.unit || 'paket'}.</p>

                    <button type="button" onClick={() => toggleFavorite(selectedProduct)} className={`mb-3 flex h-11 w-full items-center justify-center rounded-xl border text-sm font-bold transition-colors ${favoriteIds.includes(selectedProduct.id) ? 'border-rose-200 bg-rose-50 text-rose-600' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                      <Heart className={`mr-2 h-4 w-4 ${favoriteIds.includes(selectedProduct.id) ? 'fill-current' : ''}`} />
                      {favoriteIds.includes(selectedProduct.id) ? 'Tersimpan di Favorit' : 'Simpan ke Favorit'}
                    </button>

                    <Button
                      onClick={() => {
                        addToCart(selectedProduct, modalQuantity);
                        setSelectedProduct(null);
                        setIsCartOpen(true);
                      }}
                      disabled={selectedProduct.stock <= 0}
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

      {/* Order detail and tracking */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
            <motion.button
              type="button"
              aria-label="Tutup detail pesanan"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 h-full w-full bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setSelectedOrder(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 18 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="order-detail-title"
              className="relative z-10 flex max-h-[calc(100dvh-2rem)] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
            >
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 bg-slate-50 p-5 sm:p-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-primary-700">Detail Pesanan</p>
                  <h2 id="order-detail-title" className="mt-1 break-all text-xl font-extrabold text-slate-800">{selectedOrder.id}</h2>
                  <p className="mt-1 text-xs text-slate-500">Dibuat {new Date(selectedOrder.orderDate).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                </div>
                <button aria-label="Tutup detail pesanan" onClick={() => setSelectedOrder(null)} className="shrink-0 rounded-full bg-white p-2 shadow-sm hover:bg-slate-100"><X className="h-5 w-5 text-slate-500" /></button>
              </div>

              <div className="overflow-y-auto p-5 sm:p-6">
                <div className={`mb-6 rounded-2xl p-4 ${orderStatus[selectedOrder.status].className}`}>
                  <p className="text-xs font-bold uppercase tracking-wider">Status terkini</p>
                  <p className="mt-1 text-lg font-extrabold">{orderStatus[selectedOrder.status].label}</p>
                </div>

                {selectedOrder.status !== 'cancelled' && (
                  <div className="mb-7 grid grid-cols-4 gap-1" aria-label="Tahapan pesanan">
                    {[
                      { label: 'Dibuat', icon: ClipboardList },
                      { label: 'Diproses', icon: PackageCheck },
                      { label: 'Dikirim', icon: Truck },
                      { label: 'Diterima', icon: CheckCircle2 },
                    ].map((step, index) => {
                      const Icon = step.icon;
                      const active = index + 1 <= orderStatus[selectedOrder.status].step;
                      return (
                        <div key={step.label} className="relative flex flex-col items-center text-center">
                          {index < 3 && <div className={`absolute left-1/2 top-5 h-0.5 w-full ${index + 1 < orderStatus[selectedOrder.status].step ? 'bg-primary-500' : 'bg-slate-200'}`} />}
                          <span className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 ${active ? 'border-primary-600 bg-primary-600 text-white' : 'border-slate-200 bg-white text-slate-300'}`}><Icon className="h-4 w-4" /></span>
                          <span className={`mt-2 text-[10px] font-bold sm:text-xs ${active ? 'text-primary-700' : 'text-slate-400'}`}>{step.label}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="space-y-3">
                  <h3 className="font-bold text-slate-800">Produk dipesan</h3>
                  {selectedOrder.items.map(item => {
                    const product = productById(item.productId);
                    return (
                      <div key={item.productId} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3">
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                          {product ? <Image src={product.images[0]} alt={product.name} fill sizes="56px" className="object-cover" /> : <Package className="m-4 h-6 w-6 text-slate-300" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-slate-800">{product?.name || item.productId}</p>
                          <p className="text-xs text-slate-500">{item.quantity} {product?.unit || 'item'} × {formatRupiah(item.price)}</p>
                        </div>
                        <p className="text-sm font-bold text-slate-800">{formatRupiah(item.quantity * item.price)}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="flex items-center text-xs font-bold uppercase tracking-wider text-slate-500"><MapPin className="mr-2 h-4 w-4" /> Pengiriman</p>
                    <p className="mt-3 text-sm font-bold text-slate-800">{selectedOrder.recipientName || user?.name || 'Penerima'}</p>
                    {selectedOrder.recipientPhone && <p className="mt-1 text-xs text-slate-500">{selectedOrder.recipientPhone}</p>}
                    <p className="mt-2 text-xs leading-relaxed text-slate-600">{selectedOrder.shippingAddress}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="flex items-center text-xs font-bold uppercase tracking-wider text-slate-500"><CreditCard className="mr-2 h-4 w-4" /> Pembayaran</p>
                    <p className="mt-3 text-sm font-bold text-slate-800">{selectedOrder.paymentMethod || 'Pembayaran demo'}</p>
                    <div className="mt-3 space-y-1.5 text-xs">
                      <div className="flex justify-between"><span className="text-slate-500">Subtotal</span><span className="font-semibold">{formatRupiah(selectedOrder.subtotal || selectedOrder.items.reduce((sum, item) => sum + item.price * item.quantity, 0))}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Ongkir</span><span className="font-semibold">{selectedOrder.shippingCost ? formatRupiah(selectedOrder.shippingCost) : 'Gratis'}</span></div>
                      <div className="flex justify-between border-t border-slate-200 pt-2 text-sm"><span className="font-bold">Total</span><span className="font-extrabold text-primary-700">{formatRupiah(selectedOrder.totalAmount)}</span></div>
                    </div>
                  </div>
                </div>

                {selectedOrder.notes && <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50 p-3 text-xs text-amber-800"><strong>Catatan:</strong> {selectedOrder.notes}</div>}
              </div>

              <div className="grid gap-2 border-t border-slate-100 bg-white p-4 sm:grid-cols-2 sm:p-5">
                {selectedOrder.status === 'pending' ? (
                  <Button type="button" variant="outline" onClick={() => void handleCancelOrder(selectedOrder)} className="border-red-200 text-red-600 hover:bg-red-50">
                    <Trash2 className="mr-2 h-4 w-4" /> Batalkan Pesanan
                  </Button>
                ) : (
                  <Button type="button" variant="outline" onClick={() => setSelectedOrder(null)}>Tutup</Button>
                )}
                <Button type="button" onClick={() => handleReorder(selectedOrder)}>
                  <RotateCcw className="mr-2 h-4 w-4" /> Pesan Lagi
                </Button>
              </div>
            </motion.div>
          </div>
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
                    <label htmlFor="checkout-phone" className="block text-sm font-bold text-slate-700 mb-2">Nomor Telepon</label>
                    <Input
                      id="checkout-phone"
                      required
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="Contoh: 081234567890"
                      className="h-12 bg-slate-50"
                      value={checkoutForm.phone}
                      onChange={e => setCheckoutForm({...checkoutForm, phone: e.target.value})}
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
                  <div>
                    <label htmlFor="checkout-notes" className="block text-sm font-bold text-slate-700 mb-2">Catatan Pesanan <span className="font-normal text-slate-400">(Opsional)</span></label>
                    <textarea
                      id="checkout-notes"
                      placeholder="Contoh: hubungi penerima sebelum pengiriman"
                      className="h-20 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm outline-none focus:ring-2 focus:ring-primary-500"
                      value={checkoutForm.notes}
                      onChange={e => setCheckoutForm({...checkoutForm, notes: e.target.value})}
                    />
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
                    <span className="text-sm text-slate-600">Subtotal</span>
                    <span className="font-bold text-slate-800">{formatRupiah(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Ongkos kirim</span>
                    <span className={`font-bold ${shippingCost === 0 ? 'text-primary-700' : 'text-slate-800'}`}>{shippingCost === 0 ? 'Gratis' : formatRupiah(shippingCost)}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-200 pt-4">
                    <span className="font-bold text-slate-800">Total Pembayaran</span>
                    <span className="text-xl font-black text-primary-700">{formatRupiah(grandTotal)}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 bg-white p-4 sm:p-6">
                <Button
                  type="submit"
                  form="checkout-form"
                  disabled={isSubmittingOrder || cartItems.length === 0}
                  className="w-full h-14 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-lg shadow-lg"
                >
                  {isSubmittingOrder ? 'Menyimpan Pesanan...' : 'Konfirmasi Pesanan'}
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
