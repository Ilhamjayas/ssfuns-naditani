export type UserRole = 'petani' | 'operator_atm' | 'pengelola_dai' | 'pemerintah' | 'mitra' | 'admin';

export interface User {
  id: string;
  name: string;
  username?: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  phoneNumber?: string;
  createdAt: string;
}

export interface FarmerProfile {
  id: string; // e.g., PTN-240017
  userId: string;
  nama: string;
  lokasi: string;
  luas_lahan: number; // in hectares
  komoditas: string;
  varietas: string;
  estimasi_panen: string; // ISO date
  dai_terdekat: string; // DAI ID
  kelompok_tani?: string;
  foto?: string;
}

export interface Farm {
  id: string;
  farmerId: string;
  name: string;
  location: string;
  coordinates: [number, number]; // [lat, lng]
  size: number;
  soilType?: string;
}

export interface DaiLocation {
  id: string;
  name: string;
  location: string;
  coordinates: [number, number];
  capacity: number; // in tons
  services: string[];
  stockLevels: {
    gabah: number;
    beras: number;
    sekam: number;
    bekatul: number;
  };
  managerId: string;
}

export interface AtmGabahDevice {
  id: string;
  daiId: string;
  status: 'online' | 'offline' | 'maintenance';
  lastMaintenance: string;
}

export type TransactionStatus = 'menunggu_pembayaran' | 'sedang_diproses' | 'selesai' | 'dibatalkan';
export type QualityGrade = 'A' | 'B' | 'C' | 'D' | 'REJECT';

export interface DepositTransaction {
  id: string; // e.g., TRX-GAB-2026-00182
  farmerId: string;
  daiId: string;
  date: string;
  berat_kotor: number; // kg
  berat_bersih: number; // kg
  kadar_air: number; // percentage
  gabah_hampa: number; // percentage
  grade: QualityGrade;
  harga_per_kg: number;
  nilai_transaksi: number;
  status: TransactionStatus;
  notes?: string;
}

export interface QualityMeasurement {
  id: string;
  transactionId: string;
  kadarAir: number;
  hampa: number;
  kotoran: number;
  butirHijau: number;
  butirPatah: number;
  grade: QualityGrade;
  timestamp: string;
  measuredBy: string; // operator ID
}

export interface PickupSchedule {
  id: string;
  farmerId: string;
  daiId: string;
  scheduledDate: string;
  estimatedWeight: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  driverId?: string;
  method?: 'antar' | 'jemput';
  pickupLocation?: string;
  notes?: string;
  createdAt?: string;
}

export interface ProductionBatch {
  id: string;
  daiId: string;
  transactionIds: string[];
  startDate: string;
  endDate?: string;
  initialWeight: number; // kg GKP
  finalWeight?: number; // kg GKG
  status: 'pending' | 'drying' | 'milling' | 'completed' | 'cancelled';
}

export interface DryingProcess {
  id: string;
  batchId: string;
  machineId: string;
  startTime: string;
  endTime?: string;
  initialMoisture: number;
  targetMoisture: number;
  currentMoisture: number;
  temperature: number; // celsius
  status: 'running' | 'completed' | 'paused' | 'error';
}

export interface MillingProcess {
  id: string;
  batchId: string;
  machineId: string;
  startTime: string;
  endTime?: string;
  inputWeight: number; // GKG
  results: {
    berasKepala: number;
    berasPatah: number;
    menir: number;
    sekam: number;
    bekatul: number;
  };
  status: 'running' | 'completed' | 'error';
}

export interface WarehouseStock {
  id: string;
  daiId: string;
  itemType: 'gabah' | 'beras_premium' | 'beras_medium' | 'sekam' | 'bekatul' | 'kompos';
  quantity: number; // kg
  lastUpdated: string;
  minThreshold: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: 'beras' | 'byproduct' | 'pupuk' | 'pakan';
  price: number;
  stock: number;
  minOrder: number;
  grade?: QualityGrade;
  certification?: string[];
  images: string[];
  daiId: string;
}

export interface Byproduct {
  id: string;
  name: string;
  sourceItem: 'sekam' | 'bekatul' | 'jerami';
  processingMethod: string;
  outputProduct: string;
  valuePerKg: number;
}

export interface ZeroWasteProcess {
  id: string;
  daiId: string;
  inputType: 'sekam' | 'bekatul' | 'jerami';
  inputWeight: number;
  outputType: string;
  outputWeight: number;
  date: string;
  revenueGenerated: number;
}

export type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface BuyerOrder {
  id: string;
  buyerId: string;
  daiId: string;
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  status: OrderStatus;
  orderDate: string;
  shippingAddress: string;
}

export interface WalletAccount {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  isActive: boolean;
}

export type WalletTransactionType = 'deposit' | 'withdrawal' | 'payment' | 'transfer' | 'revenue_share' | 'subsidy';

export interface WalletTransaction {
  id: string;
  walletId: string;
  amount: number;
  type: WalletTransactionType;
  referenceId?: string; // e.g., DepositTransaction ID or Order ID
  description: string;
  date: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface SubsidyAllocation {
  id: string;
  farmerId: string;
  type: 'pupuk' | 'benih' | 'alat';
  name: string;
  quota: number;
  unit: string;
  status: 'tersedia' | 'sudah_diambil' | 'belum_tersedia';
  expiryDate: string;
  distributedBy?: string; // DAI or Distributor ID
}

export interface TrainingContent {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'module' | 'article';
  url: string;
  thumbnailUrl?: string;
  author: string;
  publishedAt: string;
  tags: string[];
}

export type NotificationType = 'info' | 'success' | 'warning' | 'error';
export type NotificationCategory = 'transaksi' | 'pertanian' | 'cuaca' | 'subsidi' | 'edukasi' | 'sistem';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  category: NotificationCategory;
  isRead: boolean;
  createdAt: string;
  link?: string;
}

export interface MachineMaintenance {
  id: string;
  machineId: string;
  type: 'routine' | 'repair';
  description: string;
  cost: number;
  date: string;
  performedBy: string;
  nextScheduled?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
}

export interface WeatherData {
  date: string;
  temperature: { min: number; max: number; current: number };
  humidity: number;
  rainfall: number; // mm
  windSpeed: number; // km/h
  condition: 'cerah' | 'berawan' | 'hujan_ringan' | 'hujan_lebat' | 'badai';
  alerts?: string[];
}

export interface PriceData {
  date: string;
  commodity: 'GKP' | 'GKG' | 'Beras Premium' | 'Beras Medium';
  grade?: QualityGrade;
  price: number;
  trend: 'up' | 'down' | 'stable';
  source: 'DAI' | 'Pasar' | 'HPP';
}

export interface NTPData {
  month: string; // e.g., '2025-01'
  ntp: number;
  ntup: number;
  category: 'Tanaman Pangan' | 'Hortikultura' | 'Perkebunan' | 'Peternakan' | 'Umum';
  isProjection?: boolean;
}

export interface NTPProjection extends NTPData {
  nilai_proyeksi?: number;
  batas_atas?: number;
  batas_bawah?: number;
  periode?: string;
}

export interface GTWRData {
  province: string;
  index: number;
  weight: number; // contribution to national
  year: number;
}

export interface ProvinceData {
  id: string;
  name: string;
  coordinates: [number, number];
  ntp: number;
  production: number; // tons
  activeFarmers: number;
  daiCount: number;
}

export interface NationalStats {
  totalPetaniAktif: number;
  luasLahan: number;
  produksiGKG: number;
  produksiBeras: number;
  demografiUmur: {
    '19-39': number;
    '40+': number;
  };
}

export interface FarmerDashboardData {
  profile: FarmerProfile;
  totalIncome: number;
  expectedYield: number;
  nextHarvest: string;
  weatherAlert: string;
}
