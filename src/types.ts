export type UmkmCategory = 'kuliner' | 'jasa' | 'kerajinan' | 'sembako';

export type PriceTier = 'ekonomis' | 'menengah' | 'premium';

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
  isCustomAdded?: boolean;
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
