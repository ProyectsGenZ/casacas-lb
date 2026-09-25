import React, { useState, useEffect } from 'react';
import { brandConfig } from '../../config/brandConfig';
import { useStoreSettings } from '../../context/StoreSettingsContext';
import { useUI } from '../../context/UIContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { Search, ShoppingBag, Heart, Menu } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeView,
    navigateToHome,
    navigateToCatalog,
    setIsSearchOpen,
    setIsSizeGuideOpen,
    setIsStoryModalOpen,
    setIsWishlistModalOpen,
    setIsMobileNavOpen
  } = useUI();

  const { enabledCategories, settings } = useStoreSettings();
  const { totalItems, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 border-b ${
        isScrolled
          ? 'bg-[#0E0E0E]/45 hover:bg-[#0E0E0E]/95 backdrop-blur-md hover:backdrop-blur-xl border-[#262626]/40 hover:border-[#262626] shadow-lg py-2.5 sm:py-3'
          : 'bg-[#0E0E0E] border-[#1C1C1C] py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 sm:gap-6 lg:gap-8">
          
          {/* Mobile Menu Toggle & Official Brand Logo */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(true)}
              className="lg:hidden p-2 -ml-2 text-[#F8F7F4] hover:text-[#C8102E] focus-ring"
              aria-label="Abrir menú de navegación"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Official Logo */}
            <button
              onClick={navigateToHome}
              className="flex items-center group text-left focus-ring shrink-0 py-1"
              aria-label={`Ir a inicio de ${settings.brandName}`}
            >
              <img
                src={settings.logoUrl || "/media/logo-casacas-oficial.png"}
                alt={settings.brandName}
                className="h-8 sm:h-9 md:h-10 w-auto object-contain transition-transform group-hover:scale-[1.02]"
              />
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7 xl:gap-9" aria-label="Navegación principal">
            <button
              onClick={navigateToHome}
              className={`text-xs uppercase tracking-widest font-bold transition-colors focus-ring py-1 whitespace-nowrap ${
                activeView === 'home'
                  ? 'text-[#C8102E] border-b-2 border-[#C8102E]'
                  : 'text-[#D0CDC6] hover:text-white'
              }`}
            >
              Inicio
            </button>

            <button
              onClick={() => navigateToCatalog('Todos')}
              className={`text-xs uppercase tracking-widest font-bold transition-colors focus-ring py-1 whitespace-nowrap ${
                activeView === 'catalog'
                  ? 'text-[#C8102E] border-b-2 border-[#C8102E]'
                  : 'text-[#D0CDC6] hover:text-white'
              }`}
            >
              Catálogo
            </button>

            {enabledCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => navigateToCatalog(cat.slug as any)}
                className="text-xs uppercase tracking-widest font-bold text-[#D0CDC6] hover:text-white transition-colors focus-ring py-1 whitespace-nowrap"
              >
                {cat.name}
              </button>
            ))}

            <a
              href="#personaliza"
              onClick={(e) => {
                if (activeView !== 'home') {
                  e.preventDefault();
                  navigateToHome();
                  setTimeout(() => {
                    document.getElementById('personaliza')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }
              }}
              className="text-xs uppercase tracking-widest font-bold text-[#D0CDC6] hover:text-[#C8102E] transition-colors focus-ring py-1 whitespace-nowrap"
            >
              Personalizá
            </a>
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            
            {/* Search */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="p-2 sm:p-2.5 text-[#E0DDD5] hover:text-white hover:bg-[#1E1E1E] transition-colors rounded-[2px] focus-ring"
              aria-label="Buscar producto"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <button
              type="button"
              onClick={() => setIsWishlistModalOpen(true)}
              className="relative p-2 sm:p-2.5 text-[#E0DDD5] hover:text-white hover:bg-[#1E1E1E] transition-colors rounded-[2px] focus-ring"
              aria-label={`Ver favoritos (${wishlistCount} guardados)`}
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#C8102E] text-white font-bold text-[10px] flex items-center justify-center rounded-full leading-none">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Trigger */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-3 py-2 bg-[#1C1C1C] hover:bg-[#262626] border border-[#2F2F2F] text-[#F8F7F4] transition-all rounded-[2px] focus-ring ml-1"
              aria-label={`Abrir carrito de compras (${totalItems} artículos)`}
            >
              <ShoppingBag className="w-5 h-5 text-[#C8102E]" />
              <span className="hidden sm:inline text-xs font-bold tracking-wider uppercase">
                Carrito
              </span>
              <span className="w-5 h-5 bg-[#C8102E] text-white font-bold text-[11px] flex items-center justify-center rounded-full leading-none">
                {totalItems}
              </span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
