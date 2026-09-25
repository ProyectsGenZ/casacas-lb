import React, { useEffect } from 'react';
import { useWishlist } from '../../context/WishlistContext';
import { useUI } from '../../context/UIContext';
import { ProductCard } from '../product/ProductCard';
import { X, Heart, ArrowRight } from 'lucide-react';

export const WishlistModal: React.FC = () => {
  const { isWishlistModalOpen, setIsWishlistModalOpen, navigateToCatalog } = useUI();
  const { wishlistProducts, wishlistCount } = useWishlist();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isWishlistModalOpen) {
        setIsWishlistModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isWishlistModalOpen, setIsWishlistModalOpen]);

  if (!isWishlistModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 lg:p-12 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Tus prendas favoritas"
    >
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsWishlistModalOpen(false)} />

      <div className="relative max-w-4xl w-full bg-[#121212] border border-[#262626] rounded-[2px] shadow-2xl p-6 sm:p-8 z-10 space-y-6 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#202020]">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#C85A32] fill-current" />
            <h2 className="font-display font-bold text-xl text-[#F8F7F4]">
              Prendas Favoritas ({wishlistCount})
            </h2>
          </div>
          <button
            onClick={() => setIsWishlistModalOpen(false)}
            className="p-1 text-[#888] hover:text-white"
            aria-label="Cerrar favoritos"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {wishlistProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {wishlistProducts.map((product) => (
                <div key={product.id} onClick={() => setIsWishlistModalOpen(false)}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center space-y-3">
              <Heart className="w-12 h-12 text-[#333] mx-auto" />
              <p className="text-sm text-[#888]">No tenés prendas guardadas en favoritos.</p>
              <button
                onClick={() => {
                  setIsWishlistModalOpen(false);
                  navigateToCatalog('Todos');
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#F8F7F4] text-[#121212] font-semibold text-xs uppercase tracking-wider rounded-[2px]"
              >
                <span>Descubrir prendas</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
