import { Product, BuyerOrder } from '../types';
import { getDemoState, updateDemoState } from '../demo/demo-store';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const marketplaceService = {
  async getProducts(category?: string): Promise<Product[]> {
    await delay(400);
    if (category) {
      return getDemoState().products.filter(p => p.category === category);
    }
    return [...getDemoState().products];
  },

  async getProductById(id: string): Promise<Product> {
    await delay(300);
    const product = getDemoState().products.find(p => p.id === id);
    if (!product) throw new Error('Produk tidak ditemukan');
    return product;
  },

  async getOrders(buyerId?: string): Promise<BuyerOrder[]> {
    await delay(500);
    if (buyerId) {
      const acceptedIds = buyerId === 'user-mitra-1' ? ['user-mitra-1', 'mitra-1'] : [buyerId];
      return getDemoState().orders.filter(o => acceptedIds.includes(o.buyerId));
    }
    return [...getDemoState().orders];
  },

  async createOrder(data: Partial<BuyerOrder>): Promise<BuyerOrder> {
    await delay(800);
    if (!data.items?.length) throw new Error('Keranjang masih kosong');
    if (!data.shippingAddress?.trim()) throw new Error('Alamat pengiriman wajib diisi');

    const products = getDemoState().products;
    const items = data.items.map(item => {
      const product = products.find(productItem => productItem.id === item.productId);
      if (!product) throw new Error('Salah satu produk tidak ditemukan');
      if (!Number.isInteger(item.quantity) || item.quantity < product.minOrder) {
        throw new Error(`Minimal pesanan ${product.name} adalah ${product.minOrder}`);
      }
      if (item.quantity > product.stock) throw new Error(`Stok ${product.name} hanya tersisa ${product.stock}`);
      return { productId: product.id, quantity: item.quantity, price: product.price };
    });
    const totalAmount = items.reduce((total, item) => total + item.price * item.quantity, 0);
    const order: BuyerOrder = {
      id: `ORD-${Date.now()}`,
      buyerId: data.buyerId || 'mitra-1',
      daiId: products.find(product => product.id === items[0].productId)?.daiId || data.daiId || 'DAI-NGW-01',
      items,
      totalAmount,
      status: 'pending',
      orderDate: new Date().toISOString(),
      shippingAddress: data.shippingAddress.trim(),
    };
    updateDemoState(state => {
      state.orders.unshift(order);
      order.items.forEach(item => {
        const product = state.products.find(productItem => productItem.id === item.productId);
        if (product) product.stock = Math.max(0, product.stock - item.quantity);
      });
      state.auditLogs.unshift({
        id: `AUD-${Date.now()}`,
        userId: order.buyerId,
        action: 'CREATE_ORDER',
        entityType: 'BuyerOrder',
        entityId: order.id,
        details: `Pesanan senilai ${order.totalAmount} dibuat`,
        timestamp: new Date().toISOString(),
      });
    });
    return order;
  },

  async updateOrderStatus(id: string, status: BuyerOrder['status'], buyerId?: string): Promise<BuyerOrder> {
    await delay(250);
    let updated: BuyerOrder | undefined;
    const acceptedIds = buyerId === 'user-mitra-1' ? ['user-mitra-1', 'mitra-1'] : buyerId ? [buyerId] : [];
    updateDemoState(state => {
      const order = state.orders.find(item => item.id === id);
      if (!order || (acceptedIds.length > 0 && !acceptedIds.includes(order.buyerId))) return;
      order.status = status;
      updated = { ...order, items: order.items.map(item => ({ ...item })) };
      state.auditLogs.unshift({
        id: `AUD-${Date.now()}`,
        userId: buyerId || order.buyerId,
        action: 'UPDATE_ORDER_STATUS',
        entityType: 'BuyerOrder',
        entityId: order.id,
        details: `Status pesanan diubah menjadi ${status}`,
        timestamp: new Date().toISOString(),
      });
    });
    if (!updated) throw new Error('Pesanan tidak ditemukan');
    return updated;
  }
};
