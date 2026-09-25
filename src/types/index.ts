export type ProductCategory = 
  | 'Indumentaria'
  | 'Accesorios'
  | 'UV & vinilo'
  | 'Banderas';

export interface ProductColor {
  name: string;
  hex: string;
}

export interface SizeMeasurement {
  size: string;
  chest: number; // Pecho (cm)
  length: number; // Largo (cm)
  shoulder?: number; // Hombros (cm)
  sleeve?: number; // Manga (cm)
  waist?: number;
}

export type OfferType = 'none' | 'discount_percent' | '2x1' | 'free_customization' | 'sale_price' | 'custom_badge';

export interface ProductOffer {
  active: boolean;
  type: OfferType;
  discountPercent?: number; // e.g., 10 for 10%
  salePrice?: number;
  badgeText?: string;
}

export interface Product {
  id: string;
  numericId: number;
  name: string;
  category: ProductCategory;
  price: number; // priceBase or discounted price
  priceBase: number;
  priceCustom: number | null;
  minQuantity: number;
  sku: string;
  customizable: boolean;
  shortDescription: string;
  description: string;
  originalPrice?: number;
  offer?: ProductOffer;
  tag?: 'Nuevo' | 'Más vendido' | 'Personalizable' | 'Para Equipos';
  fit?: string;
  material?: string;
  composition?: string;
  careInstructions?: string[];
  colors: ProductColor[];
  sizes: ('S' | 'M' | 'L' | 'XL' | 'XXL' | 'Único')[];
  images: string[];
  measurements?: SizeMeasurement[];
  isFeatured?: boolean;
  stock: number;
}

export interface CategoryItem {
  name: ProductCategory;
  slug: ProductCategory;
  count: number;
  image: string;
  images: string[];
  description: string;
}

export interface CartItem {
  id: string;
  product: Product;
  selectedColor: ProductColor;
  selectedSize: string;
  quantity: number;
  isCustomized?: boolean;
}

export type SortOption = 'destacados' | 'recientes' | 'precio-asc' | 'precio-desc';

export interface FilterState {
  category: ProductCategory | 'Todos';
  sizes: string[];
  colors: string[];
  maxPrice: number;
  sort: SortOption;
  searchQuery: string;
  customizableOnly?: boolean;
}

export type ActiveView = 'home' | 'catalog' | 'product-detail' | 'admin-login' | 'admin-dashboard';

export interface CustomerReview {
  id: string;
  author: string;
  origin?: string;
  stars: number;
  text: string;
  image?: string; // foto de la prenda comprada
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  isAnonymous?: boolean;
  userEmail?: string;
  userPhoto?: string;
  featured?: boolean;
}
