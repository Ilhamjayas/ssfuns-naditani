"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, ShoppingCart, MapPin, Package, ShieldCheck } from 'lucide-react';
import { Product } from '@/lib/types';
import { marketplaceService } from '@/lib/services/marketplace.service';
import { formatRupiah, formatWeight } from '@/lib/utils/format';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

export default function MarketplacePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pt-20">
      {/* Header Section */}
      <div className="bg-primary-900 relative overflow-hidden text-white py-20 px-4 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary-900 to-green-900 z-0 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 z-0 mix-blend-overlay"></div>
        <motion.div 
          className="container mx-auto max-w-6xl relative z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-3xl">
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
              <Button variant="outline" className="h-14 px-8 rounded-2xl border-white/20 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border-2 font-bold text-lg shadow-lg">
                <Filter className="w-5 h-5 mr-3" /> Filter
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 lg:px-8 py-16 max-w-6xl">
        <div className="flex justify-between items-end mb-10">
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
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {filteredProducts.map((product) => (
              <motion.div key={product.id} variants={itemVariants}>
                <Card className="overflow-hidden flex flex-col h-full rounded-3xl border border-slate-200 shadow-md hover:shadow-2xl transition-all duration-300 group hover:-translate-y-1">
                  {/* Product Image Placeholder */}
                  <div className="h-56 bg-slate-100 relative flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-200/50 to-transparent z-0"></div>
                    <Package className="w-20 h-20 text-slate-300 opacity-80 group-hover:scale-110 transition-transform duration-500 relative z-10" />
                    <div className="absolute top-4 right-4 z-20">
                      <Badge variant={product.grade === 'A' ? 'success' : 'secondary'} className={`px-3 py-1 font-bold shadow-sm ${product.grade === 'A' ? 'bg-green-500 text-white border-none' : 'bg-white text-slate-700'}`}>
                        Grade {product.grade}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-6 flex flex-col flex-1 bg-white">
                    <div className="mb-4">
                      <h3 className="font-extrabold text-xl text-slate-800 line-clamp-2">{product.name}</h3>
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
                    
                    <Button className="w-full h-12 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold shadow-md shadow-primary-600/20 transition-all hover:shadow-lg hover:shadow-primary-600/30">
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
    </div>
  );
}
