import React, { useState, useEffect } from 'react';
import { useUI } from '../../context/UIContext';
import { useStoreSettings } from '../../context/StoreSettingsContext';
import { useProductManagement } from '../../context/ProductManagementContext';
import { ProductCategory, CategoryItem } from '../../types';
import { ArrowUpRight, Sparkles } from 'lucide-react';

interface CategoryCardProps {
  category: CategoryItem;
  onSelect: (category: ProductCategory) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const images = category.images && category.images.length > 0
    ? category.images
    : [category.image];

  // Cycle through example images when hovered
  useEffect(() => {
    if (!isHovered || images.length <= 1) {
      setActiveImageIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % images.length);
    }, 1300);

    return () => clearInterval(interval);
  }, [isHovered, images.length]);

  return (
    <button
      onClick={() => onSelect(category.slug)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative h-84 sm:h-96 rounded-[2px] overflow-hidden border text-left focus-ring cursor-pointer transition-all duration-300 ${
        isHovered
          ? 'scale-[1.03] z-20 border-[#C8102E] shadow-2xl shadow-black/80'
          : 'border-[#222222] bg-[#141414] hover:border-[#444]'
      }`}
      aria-label={`Ver categoría ${category.name}`}
    >
      {/* Background Images Crossfade */}
      <div className="absolute inset-0 overflow-hidden">
        {images.map((imgUrl, idx) => (
          <img
            key={imgUrl}
            src={imgUrl}
            alt={`${category.name} - ejemplo ${idx + 1}`}
            className={`absolute inset-0 w-full h-full object-cover object-center filter transition-all duration-500 ease-out ${
              idx === activeImageIndex
                ? 'opacity-100 scale-105 brightness-[0.80]'
                : 'opacity-0 scale-100 brightness-[0.70]'
            }`}
          />
        ))}
      </div>

      {/* Dark Vignette Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E0E] via-[#0E0E0E]/40 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0E0E0E]/60 via-transparent to-transparent pointer-events-none" />

      {/* Content Overlay */}
      <div className="absolute inset-0 p-5 flex flex-col justify-between z-10">
        
        {/* Top Header: Image counter dots and Arrow button */}
        <div className="flex items-center justify-between">
          {/* Example dots */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#121212]/80 backdrop-blur-md border border-[#2B2B2B] rounded-full">
            <Sparkles className="w-3 h-3 text-[#C8102E]" />
            <div className="flex items-center gap-1">
              {images.map((_, dotIdx) => (
                <span
                  key={dotIdx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    dotIdx === activeImageIndex
                      ? 'w-4 bg-[#C8102E]'
                      : 'w-1.5 bg-[#666]'
                  }`}
                />
              ))}
            </div>
            <span className="text-[9px] font-mono text-[#AAA] ml-0.5">
              {activeImageIndex + 1}/{images.length}
            </span>
          </div>

          <span
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
              isHovered
                ? 'bg-[#C8102E] text-white scale-110 shadow-lg'
                : 'bg-[#161616]/80 backdrop-blur-sm border border-[#333] text-[#E0DDD5]'
            }`}
          >
            <ArrowUpRight className="w-4 h-4" />
          </span>
        </div>

        {/* Bottom Details */}
        <div className="space-y-1.5">
          <span className="text-[10px] uppercase tracking-widest font-mono text-[#C8102E] font-bold block">
            {category.count} artículos en catálogo
          </span>

          <h3
            className={`font-display font-extrabold text-2xl sm:text-3xl tracking-tight transition-colors leading-none ${
              isHovered ? 'text-white' : 'text-[#F8F7F4]'
            }`}
          >
            {category.name}
          </h3>

          <p className="text-xs text-[#A8A59E] line-clamp-2 hidden sm:block leading-relaxed">
            {category.description}
          </p>

          <div className="pt-1 flex items-center gap-2">
            <span
              className={`text-[11px] font-bold uppercase tracking-wider transition-colors border-b pb-0.5 ${
                isHovered
                  ? 'text-[#C8102E] border-[#C8102E]'
                  : 'text-[#D8D4CA] border-[#444]'
              }`}
            >
              Explorar categoría →
            </span>
          </div>
        </div>

      </div>
    </button>
  );
};

export const CategoryBanners: React.FC = () => {
  const { navigateToCatalog } = useUI();
  const { enabledCategories } = useStoreSettings();
  const { products } = useProductManagement();

  return (
    <section className="py-20 bg-[#0E0E0E] border-b border-[#1E1E1E]" aria-labelledby="categories-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs uppercase tracking-widest font-semibold text-[#C8102E]">
              Explorá por colecciones
            </span>
            <h2 id="categories-heading" className="font-display font-extrabold text-3xl sm:text-4xl text-[#F8F7F4] mt-1 tracking-tight">
              Categorías Principales
            </h2>
          </div>
          <button
            onClick={() => navigateToCatalog('Todos')}
            className="text-xs font-semibold uppercase tracking-wider text-[#9E9D99] hover:text-[#F8F7F4] transition-colors flex items-center gap-1 focus-ring cursor-pointer"
          >
            <span>Ver todo el catálogo</span>
            <ArrowUpRight className="w-4 h-4 text-[#C8102E]" />
          </button>
        </div>

        {/* Categories Grid with Zoom and Crossfading Multi-Example Preview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {enabledCategories.map((category) => {
            const count = products.filter(
              (p) => p.category.toLowerCase() === category.slug.toLowerCase()
            ).length;

            const categoryItem: CategoryItem = {
              name: category.name as ProductCategory,
              slug: category.slug as ProductCategory,
              count: count > 0 ? count : 1,
              image: category.image,
              images: category.images && category.images.length > 0 ? category.images : [category.image],
              description: category.description
            };

            return (
              <CategoryCard
                key={category.id}
                category={categoryItem}
                onSelect={(cat) => navigateToCatalog(cat)}
              />
            );
          })}
        </div>

      </div>
    </section>
  );
};
