export type UmkmCategory = 'kuliner' | 'jasa' | 'kerajinan' | 'sembako';

export type PriceTier = 'ekonomis' | 'menengah' | 'premium';

export interface UmkmReview {
  id: string;
  umkmId: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
}

export interface UmkmProduct {
  name: string;
  price: number;
  unit?: string;
  description?: string;
}

export interface UmkmItem {
  id: string;
  name: string;
  category: UmkmCategory;
  description: string;
  location: string;
  priceRange: string;
  priceTier: PriceTier;
  whatsapp: string;
  imageUrl: string;
  operatingHours: string;
  specialtyTag: string;
  featuredBadge?: string;
  isCustomAdded?: boolean;
  authorId?: string;
  authorName?: string;
  averageRating?: number;
  reviewCount?: number;
  menuHighlights?: string[];
  products?: UmkmProduct[];
  distance?: string;
  isOpenNow?: boolean;
  createdAt: string;
}

export interface PancasilaValue {
  id: string;
  silaNumber: number;
  silaTitle: string;
  principleName: string;
  iconName: string;
  badgeColor: string;
  summary: string;
  concreteActions: string[];
}
