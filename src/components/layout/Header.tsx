import React, { useState, useEffect, useRef } from 'react';
import { brandConfig } from '../../config/brandConfig';
import { useStoreSettings } from '../../context/StoreSettingsContext';
import { useUI } from '../../context/UIContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
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
    setIsWishlistModalOpen
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
          
          {/* Left section: Catalog Dropdown Menu + Brand Logo */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            
            {/* Catalog Dropdown Menu Trigger */}
            <div className="relative" ref={catalogMenuRef}>
              <button
                type="button"
                onClick={() => setIsCatalogMenuOpen(!isCatalogMenuOpen)}
                className={`flex items-center gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-[2px] transition-all focus-ring cursor-pointer border ${
                  isCatalogMenuOpen
                    ? 'bg-[#1C1C1C] border-[#C8102E] text-[#C8102E]'
                    : activeView === 'catalog'
                    ? 'bg-[#181818] border-[#333] text-[#C8102E]'
                    : 'bg-[#141414] hover:bg-[#1E1E1E] border-[#2A2A2A] text-[#DDD] hover:text-white'
                }`}
                aria-label="Abrir menú de catálogo y categorías"
                aria-expanded={isCatalogMenuOpen}
                title="Desplegar categorías de catálogo"
              >
                <Menu className="w-5 h-5 text-[#C8102E]" />
                <span className="hidden md:inline text-xs font-bold uppercase tracking-wider">
                  Catálogo
                </span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 hidden sm:inline ${isCatalogMenuOpen ? 'rotate-180 text-[#C8102E]' : 'text-[#888]'}`} />
              </button>

              {/* Dropdown Menu Card */}
              {isCatalogMenuOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-[#141414] border border-[#2B2B2B] rounded-[4px] shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3.5 py-1.5 border-b border-[#222] mb-1 flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#888]">
                      Catálogo de Prendas
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
                    <span>Ver Todo el Catálogo</span>
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

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7 xl:gap-8" aria-label="Navegación principal">
            <button
              onClick={navigateToHome}
              className={`text-xs uppercase tracking-widest font-bold transition-colors focus-ring py-1 whitespace-nowrap cursor-pointer ${
                activeView === 'home'
                  ? 'text-[#C8102E] border-b-2 border-[#C8102E]'
                  : 'text-[#D0CDC6] hover:text-white'
              }`}
            >
              Inicio
            </button>

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
              Personalizá tu equipo
            </a>

            <button
              onClick={() => setIsSizeGuideOpen(true)}
              className="text-xs uppercase tracking-widest font-bold text-[#D0CDC6] hover:text-white transition-colors focus-ring py-1 whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
            >
              <Ruler className="w-3.5 h-3.5 text-[#C8102E]" />
              <span>Guía de Talles</span>
            </button>

            <button
              onClick={() => setIsStoryModalOpen(true)}
              className="text-xs uppercase tracking-widest font-bold text-[#D0CDC6] hover:text-white transition-colors focus-ring py-1 whitespace-nowrap cursor-pointer"
            >
              Sobre Nosotros
            </button>
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
