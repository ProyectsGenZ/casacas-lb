import React, { useState, useEffect, useRef } from 'react';
import { useUI } from '../../context/UIContext';
import { useProductManagement } from '../../context/ProductManagementContext';
import { Product } from '../../types';
import { Search, X, ArrowRight } from 'lucide-react';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, openProductDetail } = useUI();
  const { products } = useProductManagement();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const results: Product[] = query.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase()) ||
          p.colors.some((c) => c.name.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleSelectProduct = (product: Product) => {
    setIsSearchOpen(false);
    openProductDetail(product);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 lg:p-20"
      role="dialog"
      aria-modal="true"
      aria-label="Búsqueda de prendas"
    >
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsSearchOpen(false)} />

      <div className="relative max-w-2xl mx-auto bg-[#141414] border border-[#2A2A2A] rounded-[2px] shadow-2xl overflow-hidden z-10">
        
        {/* Search Bar */}
        <div className="flex items-center gap-3 p-4 border-b border-[#242424] bg-[#181818]">
          <Search className="w-5 h-5 text-[#C85A32] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Buscá por casacas, camperas, buzos, talle o color..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-[#F8F7F4] placeholder:text-[#666] focus:outline-none"
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1 text-[#888] hover:text-white"
            aria-label="Cerrar búsqueda"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {query.trim() === '' ? (
            <div className="py-8 text-center text-xs text-[#777] space-y-2">
              <p>Búsquedas populares:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {['Casacas', 'Buzo Heavyweight', 'Remera Boxy', 'Utility Tech', 'Negro'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-2.5 py-1 bg-[#1C1C1C] border border-[#2D2D2D] hover:border-[#444] rounded-[2px] text-white"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#777] px-2">
                {results.length} resultados encontrados
              </span>
              {results.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleSelectProduct(product)}
                  className="w-full flex items-center gap-3.5 p-2.5 hover:bg-[#1C1C1C] rounded-[2px] text-left transition-colors group"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-12 h-14 object-cover rounded-[2px] bg-[#222]"
                  />
                  <div className="flex-1">
                    <span className="text-[10px] uppercase font-bold text-[#C85A32]">{product.category}</span>
                    <h4 className="font-display font-bold text-sm text-white group-hover:text-[#C85A32] transition-colors">
                      {product.name}
                    </h4>
                    <span className="text-xs font-semibold text-[#B5B2AA]">{formatPrice(product.price)}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#555] group-hover:text-white group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-[#888]">
              No encontramos prendas que coincidan con "{query}".
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
