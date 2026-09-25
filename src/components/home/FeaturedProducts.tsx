import React, { useState } from 'react';
import { useProductManagement } from '../../context/ProductManagementContext';
import { useStoreSettings } from '../../context/StoreSettingsContext';
import { ProductCard } from '../product/ProductCard';
import { useUI } from '../../context/UIContext';
import { ProductCategory } from '../../types';
import { ArrowRight } from 'lucide-react';

export const FeaturedProducts: React.FC = () => {
  const { navigateToCatalog } = useUI();
  const { products } = useProductManagement();
  const { enabledCategories, isCategoryEnabled } = useStoreSettings();
  const [selectedFilter, setSelectedFilter] = useState<string>('Todos');

  const filterTabs = ['Todos', ...enabledCategories.map((c) => c.name)];

  const displayedProducts = products
    .filter((p) => isCategoryEnabled(p.category))
    .filter((p) => {
      if (selectedFilter === 'Todos') return true;
      return p.category.toLowerCase() === selectedFilter.toLowerCase();
    });

  return (
    <section className="py-20 bg-[#0E0E0E] border-b border-[#1E1E1E]" aria-labelledby="featured-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Title and Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="text-xs uppercase tracking-widest font-semibold text-[#C8102E]">
              Selección oficial
            </span>
            <h2 id="featured-heading" className="font-display font-bold text-3xl sm:text-4xl text-[#F8F7F4] mt-1">
              Productos Destacados
            </h2>
          </div>

          {/* Quick Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none" role="tablist">
            {filterTabs.map((tab) => {
              const isActive = selectedFilter === tab;
              return (
                <button
                  key={tab}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setSelectedFilter(tab)}
                  className={`px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-[2px] transition-all whitespace-nowrap focus-ring ${
                    isActive
                      ? 'bg-[#F8F7F4] text-[#121212]'
                      : 'bg-[#181818] text-[#9E9D99] hover:text-white hover:bg-[#222222]'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Grid (2 cols on mobile, 3 on tablet, 4 on desktop) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {displayedProducts.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Bottom CTA to Full Catalog */}
        <div className="mt-14 text-center">
          <button
            onClick={() => navigateToCatalog('Todos')}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#1C1C1C] hover:bg-[#252525] border border-[#333] text-[#F8F7F4] text-xs font-semibold uppercase tracking-wider rounded-[2px] transition-all focus-ring active:scale-[0.98]"
          >
            <span>Ver toda la colección ({products.length} prendas)</span>
            <ArrowRight className="w-4 h-4 text-[#C85A32]" />
          </button>
        </div>

      </div>
    </section>
  );
};
