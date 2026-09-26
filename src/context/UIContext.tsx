import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ActiveView, Product, ProductCategory } from '../types';
import { productsData } from '../data/products';

export interface ToastData {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface UIContextType {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  openProductDetail: (product: Product) => void;
  catalogCategoryFilter: ProductCategory | 'Todos';
  setCatalogCategoryFilter: (category: ProductCategory | 'Todos') => void;
  
  // Modals
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isSizeGuideOpen: boolean;
  setIsSizeGuideOpen: (open: boolean) => void;
  isStoryModalOpen: boolean;
  setIsStoryModalOpen: (open: boolean) => void;
  isWishlistModalOpen: boolean;
  setIsWishlistModalOpen: (open: boolean) => void;
  isMobileNavOpen: boolean;
  setIsMobileNavOpen: (open: boolean) => void;

  // Toast
  toasts: ToastData[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;

  // Navigation helpers
  navigateToHome: () => void;
  navigateToCatalog: (category?: ProductCategory | 'Todos') => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

// URL slug helpers
const categoryToSlug = (cat: ProductCategory | 'Todos'): string => {
  switch (cat) {
    case 'Indumentaria':
      return 'indumentaria';
    case 'Accesorios':
      return 'accesorios';
    case 'UV & vinilo':
      return 'uv-vinilo';
    case 'Banderas':
      return 'banderas';
    default:
      return '';
  }
};

const slugToCategory = (slug?: string): ProductCategory | 'Todos' => {
  if (!slug) return 'Todos';
  const clean = slug.toLowerCase().trim();
  if (clean === 'indumentaria') return 'Indumentaria';
  if (clean === 'accesorios') return 'Accesorios';
  if (clean === 'uv-vinilo' || clean === 'uv' || clean === 'vinilo') return 'UV & vinilo';
  if (clean === 'banderas') return 'Banderas';
  return 'Todos';
};

const getStoredProducts = (): Product[] => {
  try {
    const saved = localStorage.getItem('casacas_lb_managed_products');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return productsData;
};

const findProductBySlug = (slug: string): Product | undefined => {
  const clean = slug.toLowerCase().trim();
  const all = getStoredProducts();
  return all.find(
    (p) =>
      p.sku?.toLowerCase() === clean ||
      p.id.toLowerCase() === clean ||
      String(p.numericId) === clean
  );
};

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveViewRaw] = useState<ActiveView>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(() => {
    return getStoredProducts()[0] || null;
  });
  const [catalogCategoryFilter, setCatalogCategoryFilter] = useState<ProductCategory | 'Todos'>('Todos');

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [isWishlistModalOpen, setIsWishlistModalOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync route from URL location
  const syncRouteFromLocation = useCallback(() => {
    const path = window.location.pathname.toLowerCase().replace(/\/+$/, '') || '/';

    if (path === '/' || path === '') {
      setActiveViewRaw('home');
      return;
    }

    if (path === '/admin' || path === '/admin/login') {
      setActiveViewRaw('admin-login');
      return;
    }

    if (path === '/admin/panel' || path === '/admin/dashboard') {
      setActiveViewRaw('admin-dashboard');
      return;
    }

    if (path.startsWith('/catalogo') || path.startsWith('/catalogos')) {
      const parts = path.split('/').filter(Boolean);
      const catSlug = parts[1];
      const cat = slugToCategory(catSlug);
      setCatalogCategoryFilter(cat);
      setActiveViewRaw('catalog');
      return;
    }

    if (path.startsWith('/producto/') || path.startsWith('/productos/')) {
      const parts = path.split('/').filter(Boolean);
      const prodSlug = parts[1];
      if (prodSlug) {
        const found = findProductBySlug(prodSlug);
        if (found) {
          setSelectedProduct(found);
        }
      }
      setActiveViewRaw('product-detail');
      return;
    }

    // Default fallback
    setActiveViewRaw('home');
  }, []);

  // Popstate listener (Browser Back & Forward buttons)
  useEffect(() => {
    // Initial sync
    syncRouteFromLocation();

    // Ensure initial entry has state
    if (!window.history.state) {
      window.history.replaceState({ initial: true }, '', window.location.href);
    }

    const handlePopState = (e: PopStateEvent) => {
      if (e.state && e.state.view) {
        const state = e.state;
        if (state.view === 'home') {
          setActiveViewRaw('home');
        } else if (state.view === 'catalog') {
          setCatalogCategoryFilter(state.category || 'Todos');
          setActiveViewRaw('catalog');
        } else if (state.view === 'product-detail') {
          if (state.sku || state.productId) {
            const found = findProductBySlug(state.sku || state.productId);
            if (found) setSelectedProduct(found);
          }
          setActiveViewRaw('product-detail');
        } else if (state.view === 'admin-login') {
          setActiveViewRaw('admin-login');
        } else if (state.view === 'admin-dashboard') {
          setActiveViewRaw('admin-dashboard');
        }
      } else {
        syncRouteFromLocation();
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [syncRouteFromLocation]);

  // Navigation methods that push history and update URL
  const navigateToHome = () => {
    setActiveViewRaw('home');
    if (window.location.pathname !== '/') {
      window.history.pushState({ view: 'home' }, '', '/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToCatalog = (category: ProductCategory | 'Todos' = 'Todos') => {
    setCatalogCategoryFilter(category);
    setActiveViewRaw('catalog');
    const slug = categoryToSlug(category);
    const targetPath = slug ? `/catalogo/${slug}` : '/catalogo';
    if (window.location.pathname !== targetPath) {
      window.history.pushState({ view: 'catalog', category }, '', targetPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openProductDetail = (product: Product) => {
    setSelectedProduct(product);
    setActiveViewRaw('product-detail');
    const slug = (product.sku || product.id).toLowerCase();
    const targetPath = `/producto/${slug}`;
    if (window.location.pathname !== targetPath) {
      window.history.pushState(
        { view: 'product-detail', productId: product.id, sku: product.sku },
        '',
        targetPath
      );
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setActiveView = (view: ActiveView) => {
    if (view === 'home') {
      navigateToHome();
    } else if (view === 'catalog') {
      navigateToCatalog(catalogCategoryFilter);
    } else if (view === 'admin-login') {
      setActiveViewRaw('admin-login');
      if (window.location.pathname !== '/admin') {
        window.history.pushState({ view: 'admin-login' }, '', '/admin');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (view === 'admin-dashboard') {
      setActiveViewRaw('admin-dashboard');
      if (window.location.pathname !== '/admin/panel') {
        window.history.pushState({ view: 'admin-dashboard' }, '', '/admin/panel');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setActiveViewRaw(view);
    }
  };

  return (
    <UIContext.Provider
      value={{
        activeView,
        setActiveView,
        selectedProduct,
        setSelectedProduct,
        openProductDetail,
        catalogCategoryFilter,
        setCatalogCategoryFilter,
        isSearchOpen,
        setIsSearchOpen,
        isSizeGuideOpen,
        setIsSizeGuideOpen,
        isStoryModalOpen,
        setIsStoryModalOpen,
        isWishlistModalOpen,
        setIsWishlistModalOpen,
        isMobileNavOpen,
        setIsMobileNavOpen,
        toasts,
        showToast,
        removeToast,
        navigateToHome,
        navigateToCatalog
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};
