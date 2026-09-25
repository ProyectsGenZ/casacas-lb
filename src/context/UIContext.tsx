import React, { createContext, useContext, useState } from 'react';
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

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(productsData[0]);
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

  const openProductDetail = (product: Product) => {
    setSelectedProduct(product);
    setActiveView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToHome = () => {
    setActiveView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToCatalog = (category: ProductCategory | 'Todos' = 'Todos') => {
    setCatalogCategoryFilter(category);
    setActiveView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <UIContext.Provider
      value={{
        activeView,
        setActiveView,
        selectedProduct,
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
