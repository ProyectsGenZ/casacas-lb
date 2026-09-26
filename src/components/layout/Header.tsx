import React, { useState, useEffect, useRef } from 'react';
import { brandConfig } from '../../config/brandConfig';
import { useStoreSettings, defaultHeaderNav } from '../../context/StoreSettingsContext';
import { useUI } from '../../context/UIContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { HeaderNavItem } from '../../types/settings';
import { Search, ShoppingBag, Heart, Menu, ChevronDown, ArrowRight, Ruler, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeView,
    navigateToHome,
    navigateToCatalog,
    catalogCategoryFilter,
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
  const [isCatalogMenuOpen, setIsCatalogMenuOpen] = useState(false);
  const catalogMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close catalog menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (catalogMenuRef.current && !catalogMenuRef.current.contains(e.target as Node)) {
        setIsCatalogMenuOpen(false);
      }
    };
    if (isCatalogMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isCatalogMenuOpen]);

  // Dynamic header navigation items from CMS
  const navItems: HeaderNavItem[] = (settings.headerNav && settings.headerNav.length > 0
    ? settings.headerNav
    : defaultHeaderNav
  ).filter((item) => item.enabled);

  const handleNavClick = (item: HeaderNavItem) => {
    if (item.type === 'home') {
      navigateToHome();
    } else if (item.type === 'catalog') {
      navigateToCatalog(item.target as any || 'Todos');
    } else if (item.type === 'category') {
      navigateToCatalog(item.target as any);
    } else if (item.type === 'modal') {
      if (item.target === 'size_guide') {
        setIsSizeGuideOpen(true);
      } else if (item.target === 'story') {
        setIsStoryModalOpen(true);
      }
    } else if (item.type === 'scroll') {
      const hash = item.target.startsWith('#') ? item.target.slice(1) : item.target;
      if (activeView !== 'home') {
        navigateToHome();
        setTimeout(() => {
          document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
        }, 120);
      } else {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (item.type === 'url') {
      if (item.target.startsWith('http')) {
        window.open(item.target, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = item.target;
      }
    }
  };

  const isItemActive = (item: HeaderNavItem) => {
    if (item.type === 'home') {
      return activeView === 'home';
    }
    if (item.type === 'catalog') {
      return activeView === 'catalog' && (catalogCategoryFilter === 'Todos' || !catalogCategoryFilter);
    }
    if (item.type === 'category') {
      return activeView === 'catalog' && catalogCategoryFilter === item.target;
    }
    return false;
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 border-b ${
        isScrolled
          ? 'bg-[#0E0E0E]/80 backdrop-blur-md border-[#262626] shadow-lg py-2.5 sm:py-3'
          : 'bg-[#0E0E0E] border-[#1C1C1C] py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 sm:gap-6 lg:gap-8">
          
          {/* Left section: Mobile Nav Toggle OR Desktop Dropdown Menu + Brand Logo */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            
            {/* Mobile Drawer Trigger (Only on mobile / small screens) */}
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(true)}
              className="lg:hidden p-2 -ml-2 text-[#F8F7F4] hover:text-[#C8102E] focus-ring cursor-pointer"
              aria-label="Abrir menú de navegación"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Extra Dropdown Menu Trigger (Desktop 3-lines menu next to Logo) */}
            <div className="relative hidden lg:block" ref={catalogMenuRef}>
              <button
                type="button"
                onClick={() => setIsCatalogMenuOpen(!isCatalogMenuOpen)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-[2px] transition-all focus-ring cursor-pointer border ${
                  isCatalogMenuOpen
                    ? 'bg-[#1C1C1C] border-[#C8102E] text-[#C8102E]'
                    : 'bg-[#141414] hover:bg-[#1E1E1E] border-[#2A2A2A] text-[#DDD] hover:text-white'
                }`}
                aria-label="Abrir menú rápido de categorías"
                aria-expanded={isCatalogMenuOpen}
                title="Desplegar categorías de catálogo"
              >
                <Menu className="w-4 h-4 text-[#C8102E]" />
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isCatalogMenuOpen ? 'rotate-180 text-[#C8102E]' : 'text-[#888]'}`} />
              </button>

              {/* Dropdown Menu Card */}
              {isCatalogMenuOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-[#141414] border border-[#2B2B2B] rounded-[4px] shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3.5 py-1.5 border-b border-[#222] mb-1 flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#888]">
                      Catálogo y Categorías
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 bg-[#C8102E]/20 text-[#C8102E] rounded font-bold font-mono">LB</span>
                  </div>

                  <button
                    onClick={() => {
                      navigateToCatalog('Todos');
                      setIsCatalogMenuOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-colors cursor-pointer ${
                      activeView === 'catalog' && catalogCategoryFilter === 'Todos'
                        ? 'bg-[#C8102E]/15 text-[#C8102E]'
                        : 'text-[#DDD] hover:bg-[#1E1E1E] hover:text-white'
                    }`}
                  >
                    <span>Ver Toda la Tienda</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="my-1 border-t border-[#202020]" />

                  {enabledCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        navigateToCatalog(cat.slug as any);
                        setIsCatalogMenuOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                        activeView === 'catalog' && catalogCategoryFilter === cat.slug
                          ? 'bg-[#C8102E]/15 text-[#C8102E] font-bold'
                          : 'text-[#BBB] hover:bg-[#1E1E1E] hover:text-white'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className="text-[10px] text-[#666] font-mono">→</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Official Logo */}
            <button
              onClick={navigateToHome}
              className="flex items-center group text-left focus-ring shrink-0 py-1 cursor-pointer"
              aria-label={`Ir a inicio de ${settings.brandName}`}
            >
              <img
                src={settings.logoUrl || "/media/logo-casacas-oficial.png"}
                alt={settings.brandName}
                className="h-8 sm:h-9 md:h-10 w-auto object-contain transition-transform group-hover:scale-[1.02]"
              />
            </button>
          </div>

          {/* Desktop Navigation - Configurable from Admin CMS */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8" aria-label="Navegación principal">
            {navItems.map((item) => {
              const active = isItemActive(item);
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  className={`text-xs uppercase tracking-widest font-bold transition-colors focus-ring py-1 whitespace-nowrap cursor-pointer ${
                    active
                      ? 'text-[#C8102E] border-b-2 border-[#C8102E]'
                      : 'text-[#D0CDC6] hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            
            {/* Search */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="p-2 sm:p-2.5 text-[#E0DDD5] hover:text-white hover:bg-[#1E1E1E] transition-colors rounded-[2px] focus-ring cursor-pointer"
              aria-label="Buscar producto"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <button
              type="button"
              onClick={() => setIsWishlistModalOpen(true)}
              className="relative p-2 sm:p-2.5 text-[#E0DDD5] hover:text-white hover:bg-[#1E1E1E] transition-colors rounded-[2px] focus-ring cursor-pointer"
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
              className="relative flex items-center gap-2 px-3 py-2 bg-[#1C1C1C] hover:bg-[#262626] border border-[#2F2F2F] text-[#F8F7F4] transition-all rounded-[2px] focus-ring ml-1 cursor-pointer"
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
