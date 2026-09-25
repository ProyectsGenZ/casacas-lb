export interface CategoryConfig {
  id: string;
  name: string;
  slug: string;
  enabled: boolean;
  description: string;
  image: string;
  images?: string[];
}

export interface HeroSlideConfig {
  id: string;
  badge: string;
  title: string;
  highlightWord: string;
  subtitle: string;
  bgImage: string;
  primaryCtaText: string;
}

export interface SiteSettings {
  brandName: string;
  brandShortName: string;
  tagline: string;
  logoUrl: string;
  announcement: {
    enabled: boolean;
    badge: string;
    text: string;
    linkText?: string;
  };
  hero: {
    badge?: string;
    title?: string;
    highlightWord?: string;
    subtitle?: string;
    bgImage?: string;
    primaryCtaText?: string;
    slides: HeroSlideConfig[];
  };
  categories: CategoryConfig[];
  contact: {
    whatsapp: string;
    whatsappFormatted: string;
    whatsappMessage: string;
    email: string;
    address: string;
    addressDetail: string;
    hours: string;
    mapsUrl: string;
    mapsEmbedUrl: string;
    instagram: string;
    instagramHandle: string;
    tiktok: string;
  };
  shipping: {
    freeShippingThreshold: number;
    standardShippingCost: number;
    installmentsCount: number;
  };
  validCoupons: Record<string, number>;
}
