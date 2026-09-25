import React, { useEffect } from 'react';
import { useUI } from '../../context/UIContext';
import { brandConfig } from '../../config/brandConfig';
import { categoriesList } from '../../data/products';
import { ProductCategory } from '../../types';
import { X, ArrowRight, MessageCircle, Ruler, BookOpen, ShoppingBag } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const {
    isMobileNavOpen,
    setIsMobileNavOpen,
    navigateToHome,
    navigateToCatalog,
    setIsSizeGuideOpen,
    setIsStoryModalOpen
  } = useUI();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileNavOpen) {
        setIsMobileNavOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileNavOpen, setIsMobileNavOpen]);

  if (!isMobileNavOpen) return null;

  const handleCategoryClick = (cat: ProductCategory | 'Todos') => {
    navigateToCatalog(cat);
    setIsMobileNavOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menú principal de navegación">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={() => setIsMobileNavOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-[#121212] border-r border-[#262626] shadow-2xl flex flex-col justify-between p-6 overflow-y-auto">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-[#222222]">
            <div className="flex items-center gap-2">
              <img
                src="/media/logo-casacas-oficial.png"
                alt={brandConfig.name}
                className="h-8 w-auto object-contain"
              />
            </div>
            <button
              onClick={() => setIsMobileNavOpen(false)}
              className="p-2 text-[#9E9D99] hover:text-white focus-ring"
              aria-label="Cerrar menú"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation links */}
          <div className="py-6 space-y-1">
            <button
              onClick={() => {
                navigateToHome();
                setIsMobileNavOpen(false);
              }}
              className="w-full text-left py-3 text-base font-display font-bold uppercase tracking-wider text-[#F8F7F4] hover:text-[#C85A32] flex items-center justify-between border-b border-[#1E1E1E]"
            >
              <span>Inicio</span>
              <ArrowRight className="w-4 h-4 text-[#666]" />
            </button>

            <button
              onClick={() => handleCategoryClick('Todos')}
              className="w-full text-left py-3 text-base font-display font-bold uppercase tracking-wider text-[#F8F7F4] hover:text-[#C85A32] flex items-center justify-between border-b border-[#1E1E1E]"
            >
              <span>Toda la Tienda</span>
              <ShoppingBag className="w-4 h-4 text-[#C85A32]" />
            </button>

            <div className="pt-4 pb-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#77746F]">
                Categorías
              </span>
            </div>

            {categoriesList.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => handleCategoryClick(cat.slug as ProductCategory)}
                className="w-full text-left py-2.5 px-2 text-sm font-medium text-[#C8C5BD] hover:text-white hover:bg-[#1A1A1A] rounded-[2px] flex items-center justify-between transition-colors"
              >
                <span>{cat.name}</span>
                <span className="text-xs text-[#666] font-mono">({cat.count})</span>
              </button>
            ))}

            <div className="pt-6 space-y-1 border-t border-[#1E1E1E] mt-4">
              <button
                onClick={() => {
                  setIsSizeGuideOpen(true);
                  setIsMobileNavOpen(false);
                }}
                className="w-full text-left py-2.5 px-2 text-sm font-medium text-[#9E9D99] hover:text-white flex items-center gap-2.5"
              >
                <Ruler className="w-4 h-4 text-[#C85A32]" />
                <span>Guía de Talles y Medidas</span>
              </button>

              <button
                onClick={() => {
                  setIsStoryModalOpen(true);
                  setIsMobileNavOpen(false);
                }}
                className="w-full text-left py-2.5 px-2 text-sm font-medium text-[#9E9D99] hover:text-white flex items-center gap-2.5"
              >
                <BookOpen className="w-4 h-4 text-[#C85A32]" />
                <span>Nosotros y Manifiesto</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer in Drawer */}
        <div className="pt-6 border-t border-[#222222] space-y-3">
          <a
            href={`https://wa.me/${brandConfig.contact.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
              brandConfig.contact.whatsappMessage
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 bg-[#1F1F1F] hover:bg-[#282828] border border-[#333] text-[#F8F7F4] text-xs font-semibold uppercase tracking-wider rounded-[2px] transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-[#25D366]" />
            <span>Consultas por WhatsApp</span>
          </a>
          <p className="text-[11px] text-[#7A7873] text-center">
            {brandConfig.location}
          </p>
        </div>
      </div>
    </div>
  );
};
