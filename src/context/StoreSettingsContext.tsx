import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { SiteSettings, CategoryConfig, HeaderNavItem } from '../types/settings';
import { brandConfig } from '../config/brandConfig';

export const defaultHeaderNav: HeaderNavItem[] = [
  { id: 'nav-home', label: 'Inicio', type: 'home', target: '/', enabled: true },
  { id: 'nav-tienda', label: 'Tienda', type: 'catalog', target: 'Todos', enabled: true },
  { id: 'nav-indumentaria', label: 'Indumentaria', type: 'category', target: 'Indumentaria', enabled: true },
  { id: 'nav-personaliza', label: 'Personalizá', type: 'scroll', target: '#personaliza', enabled: true },
  { id: 'nav-talles', label: 'Guía de Talles', type: 'modal', target: 'size_guide', enabled: true },
  { id: 'nav-nosotros', label: 'Sobre Nosotros', type: 'modal', target: 'story', enabled: true }
];

const defaultCategories: CategoryConfig[] = [
  {
    id: 'cat-indumentaria',
    name: 'Indumentaria',
    slug: 'Indumentaria',
    enabled: true,
    description: 'Remeras SPUM, algodón peinado, chombas deportivas y bombachas de campo.',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80'
    ]
  },
  {
    id: 'cat-accesorios',
    name: 'Accesorios',
    slug: 'Accesorios',
    enabled: true,
    description: 'Vasos chopp, vasos de aluminio, termos hoppy, gorras trucker y parches.',
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80'
    ]
  },
  {
    id: 'cat-uv-vinilo',
    name: 'UV & vinilo',
    slug: 'UV & vinilo',
    enabled: true,
    description: 'Stickers UV DTF con barniz en relieve, planchas y metros lineales para marcas.',
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1572025442646-866d16c84a54?auto=format&fit=crop&w=900&q=80'
    ]
  },
  {
    id: 'cat-banderas',
    name: 'Banderas',
    slug: 'Banderas',
    enabled: true,
    description: 'Banderas de cancha 1.40 x 0.90 y banderas con mástil para eventos.',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&w=900&q=80'
    ]
  }
];

export const defaultSettings: SiteSettings = {
  brandName: brandConfig.name,
  brandShortName: brandConfig.shortName,
  tagline: brandConfig.tagline,
  logoUrl: '/media/logo-casacas-oficial.png',
  headerNav: defaultHeaderNav,
  announcement: {
    enabled: true,
    badge: brandConfig.announcement.badge,
    text: brandConfig.announcement.text,
    linkText: brandConfig.announcement.linkText
  },
  hero: {
    badge: "COLECCIÓN OFICIAL 2026",
    title: "CASACAS &",
    highlightWord: "STREETWEAR",
    subtitle: "Indumentaria deportiva, personalización por catálogo y confección directa desde Las Breñas, Chaco.",
    bgImage: "https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?auto=format&fit=crop&w=1920&q=80",
    primaryCtaText: "Ver Catálogo Completo",
    slides: [
      {
        id: "slide-1",
        badge: "COLECCIÓN OFICIAL 2026",
        title: "HACÉ QUE",
        highlightWord: "TE VEAN.",
        subtitle: "Prendas, accesorios y estampas para equipos que salen a jugar, marcas que quieren hacerse notar y personas que visten lo que creen.",
        bgImage: "https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?auto=format&fit=crop&w=2000&q=85",
        primaryCtaText: "Explorar catálogo"
      },
      {
        id: "slide-2",
        badge: "EQUIPOS + MARCAS",
        title: "VESTÍ",
        highlightWord: "TU CÓDIGO.",
        subtitle: "Diseñamos prendas y piezas que hacen visible lo que une a tu equipo, tu marca y tu forma de moverte.",
        bgImage: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=2000&q=85",
        primaryCtaText: "Diseño para Equipos"
      },
      {
        id: "slide-3",
        badge: "HECHO EN LAS BREÑAS",
        title: "MOVERTE",
        highlightWord: "CON IDENTIDAD.",
        subtitle: "Del diseño a la entrega: una experiencia cercana para convertir tus ideas en piezas que representan.",
        bgImage: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=2000&q=85",
        primaryCtaText: "Consultar por WhatsApp"
      }
    ]
  },
  categories: defaultCategories,
  contact: {
    whatsapp: brandConfig.contact.whatsapp,
    whatsappFormatted: brandConfig.contact.whatsappFormatted,
    whatsappMessage: brandConfig.contact.whatsappMessage,
    email: brandConfig.contact.email,
    address: brandConfig.contact.address,
    addressDetail: brandConfig.contact.addressDetail,
    hours: brandConfig.contact.hours,
    mapsUrl: brandConfig.contact.mapsUrl,
    mapsEmbedUrl: brandConfig.contact.mapsEmbedUrl,
    instagram: brandConfig.social.instagram,
    instagramHandle: brandConfig.social.instagramHandle,
    tiktok: brandConfig.social.tiktok
  },
  shipping: {
    deliveryEnabled: false,
    pickupOnlyMessage: 'Solo retiros en nuestro local comercial en Las Breñas (Chaco). Envíos a domicilio deshabilitados por el momento.',
    freeShippingThreshold: brandConfig.freeShippingThreshold,
    standardShippingCost: brandConfig.standardShippingCost,
    installmentsCount: brandConfig.installmentsCount
  },
  validCoupons: brandConfig.validCoupons
};

interface StoreSettingsContextType {
  settings: SiteSettings;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<void>;
  toggleCategory: (categoryId: string, enabled: boolean) => Promise<void>;
  isCategoryEnabled: (categoryName: string) => boolean;
  enabledCategories: CategoryConfig[];
  isLoading: boolean;
}

const SETTINGS_DOC = 'site_settings/content';
const LOCAL_STORAGE_KEY = 'casacas_lb_site_settings';

const StoreSettingsContext = createContext<StoreSettingsContextType | undefined>(undefined);

export const StoreSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return { ...defaultSettings, ...JSON.parse(saved) };
      }
    } catch {
      // fallback
    }
    return defaultSettings;
  });

  const [isLoading, setIsLoading] = useState(true);

  // Sync with Firestore
  useEffect(() => {
    const docRef = doc(db, 'site_settings', 'content');

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as Partial<SiteSettings>;
          setSettings((prev) => {
            const merged: SiteSettings = {
              ...prev,
              ...data,
              hero: {
                ...prev.hero,
                ...(data.hero || {}),
                slides: data.hero?.slides && data.hero.slides.length > 0 ? data.hero.slides : defaultSettings.hero.slides
              },
              headerNav: data.headerNav && data.headerNav.length > 0 ? data.headerNav : (prev.headerNav || defaultHeaderNav)
            };
            try {
              localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
            } catch {
              // ignore
            }
            return merged;
          });
        } else {
          // Initialize doc in Firestore if it doesn't exist
          setDoc(docRef, defaultSettings).catch((err) => {
            console.error('Error initializing site_settings in Firestore:', err);
          });
        }
        setIsLoading(false);
      },
      (error) => {
        console.warn('Firestore offline or permission error, using local/default settings:', error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      const docRef = doc(db, 'site_settings', 'content');
      await setDoc(docRef, updated, { merge: true });
    } catch (e) {
      console.error('Error saving settings to Firestore:', e);
      throw e;
    }
  };

  const toggleCategory = async (categoryId: string, enabled: boolean) => {
    const updatedCategories = settings.categories.map((cat) =>
      cat.id === categoryId ? { ...cat, enabled } : cat
    );
    await updateSettings({ categories: updatedCategories });
  };

  const isCategoryEnabled = (categoryName: string): boolean => {
    if (categoryName === 'Todos') return true;
    const cat = settings.categories.find(
      (c) => c.name.toLowerCase() === categoryName.toLowerCase() || c.slug.toLowerCase() === categoryName.toLowerCase()
    );
    return cat ? cat.enabled : true;
  };

  const enabledCategories = settings.categories.filter((c) => c.enabled);

  return (
    <StoreSettingsContext.Provider
      value={{
        settings,
        updateSettings,
        toggleCategory,
        isCategoryEnabled,
        enabledCategories,
        isLoading
      }}
    >
      {children}
    </StoreSettingsContext.Provider>
  );
};

export const useStoreSettings = () => {
  const context = useContext(StoreSettingsContext);
  if (!context) {
    throw new Error('useStoreSettings must be used within a StoreSettingsProvider');
  }
  return context;
};
