import { Product, BuyerOrder } from '../types';
import { mockProducts } from '../data/products';
import { mockOrders } from '../data/orders';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const marketplaceService = {
  async getProducts(category?: string): Promise<Product[]> {
    await delay(400);
    if (category) {
      return mockProducts.filter(p => p.category === category);
    }
    return [...mockProducts];
  },
  
  async getProductById(id: string): Promise<Product> {
    await delay(300);
    const product = mockProducts.find(p => p.id === id);
    if (!product) throw new Error('Produk tidak ditemukan');
    return product;
  },
  
  async getOrders(buyerId?: string): Promise<BuyerOrder[]> {
    await delay(500);
    if (buyerId) {
      return mockOrders.filter(o => o.buyerId === buyerId);
    }
    return [...mockOrders];
  },
  
  async createOrder(data: Partial<BuyerOrder>): Promise<BuyerOrder> {
    await delay(800);
    const order: BuyerOrder = {
      id: `ORD-${new Date().toISOString().slice(0,7)}-${Math.floor(Math.random() * 900) + 100}`,
      buyerId: data.buyerId || 'mitra-1',
      daiId: data.daiId || 'DAI-NGW-01',
      items: data.items || [],
      totalAmount: data.totalAmount || 0,
      status: 'pending',
      orderDate: new Date().toISOString(),
      shippingAddress: data.shippingAddress || '',
    };
    return order;
  }
};
