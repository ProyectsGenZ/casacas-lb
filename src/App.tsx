import React from 'react';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { UIProvider, useUI } from './context/UIContext';
import { ProductManagementProvider } from './context/ProductManagementContext';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import { brandConfig } from './config/brandConfig';

import { StoreSettingsProvider, useStoreSettings } from './context/StoreSettingsContext';
import { ReviewsProvider } from './context/ReviewsContext';

// Layout
import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';
import { Footer } from './components/layout/Footer';

// Home Sections
import { Hero } from './components/home/Hero';
import { CategoryBanners } from './components/home/CategoryBanners';
import { FeaturedProducts } from './components/home/FeaturedProducts';
import { CustomizationSection } from './components/home/CustomizationSection';
import { OpinionsSection } from './components/home/OpinionsSection';
import { LocalSection } from './components/home/LocalSection';
import { CraftsmanshipSection } from './components/home/CraftsmanshipSection';
import { NewsletterSection } from './components/home/NewsletterSection';

// Catalog & Product Detail
import { CatalogView } from './components/catalog/CatalogView';
import { ProductDetailView } from './components/product/ProductDetailView';

// Admin Views
import { AdminLoginView } from './components/admin/AdminLoginView';
import { AdminDashboardView } from './components/admin/AdminDashboardView';

// Modals & Drawers
import { CartDrawer } from './components/cart/CartDrawer';
import { SearchModal } from './components/search/SearchModal';
import { SizeGuideModal } from './components/modals/SizeGuideModal';
import { BrandStoryModal } from './components/modals/BrandStoryModal';
import { WishlistModal } from './components/modals/WishlistModal';
import { ToastContainer } from './components/ui/Toast';
import { MessageCircle } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeView } = useUI();

  return (
    <main id="main-content" className="flex-1">
      {activeView === 'home' && (
        <>
          <Hero />
          <CategoryBanners />
          <FeaturedProducts />
          <CustomizationSection />
          <OpinionsSection />
          <LocalSection />
          <CraftsmanshipSection />
          <NewsletterSection />
        </>
      )}

      {activeView === 'catalog' && <CatalogView />}

      {activeView === 'product-detail' && <ProductDetailView />}
    </main>
  );
};

const AppContent: React.FC = () => {
  const { activeView } = useUI();
  const { isAuthenticated } = useAdminAuth();

  // If in Admin Login View
  if (activeView === 'admin-login') {
    return (
      <>
        <AdminLoginView />
        <ToastContainer />
      </>
    );
  }

  // If in Admin Dashboard View
  if (activeView === 'admin-dashboard') {
    if (!isAuthenticated) {
      return (
        <>
          <AdminLoginView />
          <ToastContainer />
        </>
      );
    }

    return (
      <>
        <AdminDashboardView />
        <ToastContainer />
      </>
    );
  }

  const { settings } = useStoreSettings();

  // Storefront Public View
  return (
    <div className="min-h-screen flex flex-col bg-[#0E0E0E] text-[#F8F7F4] relative">
      {/* Skip to Content for Screen Readers (WCAG 2.2 AA) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#C8102E] focus:text-white font-semibold text-xs uppercase"
      >
        Saltar al contenido principal
      </a>

      <AnnouncementBar />
      <Header />
      <MainContent />
      <Footer />

      {/* Floating WhatsApp Button */}
      <a
        href={`https://wa.me/${settings.contact.whatsapp}?text=${encodeURIComponent(
          `Hola! Te escribo desde la tienda online de ${settings.brandName}.`
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 px-4 py-3 bg-[#25D366] hover:bg-[#20BA5A] text-[#121212] font-bold text-xs uppercase tracking-wider rounded-full shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95 focus-ring"
        aria-label={`Abrir chat de WhatsApp con ${settings.brandName}`}
      >
        <MessageCircle className="w-5 h-5 text-[#121212] fill-current" />
        <span className="hidden sm:inline">WhatsApp directo</span>
      </a>

      {/* Floating Drawers & Modals */}
      <CartDrawer />
      <MobileNav />
      <SearchModal />
      <SizeGuideModal />
      <BrandStoryModal />
      <WishlistModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <UIProvider>
      <StoreSettingsProvider>
        <ProductManagementProvider>
          <ReviewsProvider>
            <AdminAuthProvider>
              <CartProvider>
                <WishlistProvider>
                  <AppContent />
                </WishlistProvider>
              </CartProvider>
            </AdminAuthProvider>
          </ReviewsProvider>
        </ProductManagementProvider>
      </StoreSettingsProvider>
    </UIProvider>
  );
}
