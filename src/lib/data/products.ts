import { Product } from '../types';

export const mockProducts: Product[] = [
  {
    id: 'PRD-BER-001',
    name: 'Beras Premium Ngawi (5kg)',
    description: 'Beras kualitas premium dari petani lokal Ngawi. Diproses dengan teknologi modern menghasilkan beras putih, pulen, dan tanpa pengawet.',
    category: 'beras',
    price: 75000,
    stock: 500, // bags
    minOrder: 1,
    grade: 'A',
    certification: ['Halal', 'Kementan RI'],
    images: ['/images/products/beras-premium-5kg.jpg'],
    daiId: 'DAI-NGW-01',
  },
  {
    id: 'PRD-BER-002',
    name: 'Beras Medium Ngawi (25kg)',
    description: 'Beras kualitas medium cocok untuk warung makan dan konsumsi harian. Kualitas terjamin langsung dari pabrik DAI.',
    category: 'beras',
    price: 315000,
    stock: 120, // bags
    minOrder: 1,
    grade: 'B',
    images: ['/images/products/beras-medium-25kg.jpg'],
    daiId: 'DAI-NGW-01',
  },
  {
    id: 'PRD-BYP-001',
    name: 'Biochar Sekam Padi (10kg)',
    description: 'Arang sekam padi (biochar) kualitas tinggi. Sangat baik untuk pembenah tanah, menyimpan air, dan rumah bagi mikoriza.',
    category: 'byproduct',
    price: 25000,
    stock: 300, // bags
    minOrder: 5,
    images: ['/images/products/biochar.jpg'],
    daiId: 'DAI-NGW-01',
  },
  {
    id: 'PRD-BYP-002',
    name: 'Briket Sekam Padi (5kg)',
    description: 'Bahan bakar alternatif ramah lingkungan dari sekam padi. Panas stabil dan abu sisa bisa untuk pupuk.',
    category: 'byproduct',
    price: 35000,
    stock: 150,
    minOrder: 2,
    images: ['/images/products/briket.jpg'],
    daiId: 'DAI-NGW-01',
  },
  {
    id: 'PRD-PAK-001',
    name: 'Bekatul Stabil - Pakan Ternak (50kg)',
    description: 'Bekatul kaya nutrisi untuk pakan ternak unggas dan ruminansia. Diproses untuk mencegah ketengikan.',
    category: 'pakan',
    price: 150000,
    stock: 40,
    minOrder: 1,
    images: ['/images/products/bekatul-pakan.jpg'],
    daiId: 'DAI-NGW-01',
  },
  {
    id: 'PRD-PUP-001',
    name: 'Kompos Jerami & Kotoran Sapi (25kg)',
    description: 'Pupuk organik padat hasil fermentasi jerami padi dan kotoran sapi. Memperbaiki struktur tanah dan menyuburkan tanaman.',
    category: 'pupuk',
    price: 45000,
    stock: 200,
    minOrder: 10,
    certification: ['Organik INOFICE'],
    images: ['/images/products/kompos.jpg'],
    daiId: 'DAI-NGW-01',
  }
];
