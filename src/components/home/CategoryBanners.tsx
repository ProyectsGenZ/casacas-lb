import React, { useState, useEffect, useRef } from 'react';
import { useUI } from '../../context/UIContext';
import { useStoreSettings } from '../../context/StoreSettingsContext';
import { useProductManagement } from '../../context/ProductManagementContext';
import { ProductCategory, CategoryItem } from '../../types';
import { ArrowUpRight, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { EditableText } from '../admin/EditableText';
import { useLiveEditor } from '../../context/LiveEditContext';

interface CategoryCardProps {
  category: CategoryItem;
  onSelect: (category: ProductCategory) => void;
  isDraggingRef?: React.MutableRefObject<boolean>;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onSelect, isDraggingRef }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { isLiveEditMode, activeEditingKey } = useLiveEditor();

  const images = category.images && category.images.length > 0
    ? category.images
    : [category.image];

  // Cycle through example images when hovered
  useEffect(() => {
    if (!isHovered || images.length <= 1 || isLiveEditMode || Boolean(activeEditingKey)) {
      setActiveImageIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % images.length);
    }, 1300);

    return () => clearInterval(interval);
  }, [isHovered, images.length, isLiveEditMode, activeEditingKey]);

  return (
    <button
      onClick={(e) => {
        if (isDraggingRef?.current) {
          e.preventDefault();
          return;
        }
        onSelect(category.slug);
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative h-88 sm:h-96 w-[280px] sm:w-[320px] lg:w-[340px] shrink-0 rounded-[2px] overflow-hidden border text-left focus-ring cursor-pointer select-none transition-all duration-300 ${
        isHovered
          ? 'scale-[1.02] z-20 border-[#C8102E] shadow-2xl shadow-black/80'
          : 'border-[#222222] bg-[#141414] hover:border-[#444]'
      }`}
      aria-label={`Ver categoría ${category.name}`}
    >
      {/* Background Images Crossfade */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {images.map((imgUrl, idx) => (
          <img
            key={imgUrl}
            src={imgUrl}
            alt={`${category.name} - ejemplo ${idx + 1}`}
            className={`absolute inset-0 w-full h-full object-cover object-center filter transition-all duration-500 ease-out select-none ${
              idx === activeImageIndex
                ? 'opacity-100 scale-105 brightness-[0.80]'
                : 'opacity-0 scale-100 brightness-[0.70]'
            }`}
            draggable={false}
          />
        ))}
      </div>

      {/* Dark Vignette Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E0E] via-[#0E0E0E]/40 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0E0E0E]/60 via-transparent to-transparent pointer-events-none" />

      {/* Content Overlay */}
      <div className="absolute inset-0 p-5 flex flex-col justify-between z-10 pointer-events-none">
        
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

          <div className="hidden sm:block pointer-events-auto">
            <EditableText
              contentKey={`category.${category.slug}.description`}
              defaultValue={category.description}
              label={`Descripción ${category.name}`}
              multiline
              as="p"
              className="text-xs text-[#A8A59E] line-clamp-2 leading-relaxed"
            />
          </div>

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

  const sliderRef = useRef<HTMLDivElement>(null);
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const isDraggingRef = useRef(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [enabledCategories]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    isDownRef.current = true;
    isDraggingRef.current = false;
    startXRef.current = e.pageX - sliderRef.current.offsetLeft;
    scrollLeftRef.current = sliderRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDownRef.current || !sliderRef.current) return;
    const x = e.pageX - sliderRef.current.offsetLeft;
    const distance = Math.abs(x - startXRef.current);
    if (distance > 5) {
      isDraggingRef.current = true;
    }
    const walk = (x - startXRef.current) * 1.25;
    sliderRef.current.scrollLeft = scrollLeftRef.current - walk;
    checkScroll();
  };

  const handleMouseUpOrLeave = () => {
    isDownRef.current = false;
    setTimeout(() => {
      isDraggingRef.current = false;
    }, 60);
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return;
    const scrollAmount = 350;
    sliderRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
    setTimeout(checkScroll, 350);
  };

  return (
    <section className="py-20 bg-[#0E0E0E] border-b border-[#1E1E1E]" aria-labelledby="categories-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <EditableText
              contentKey="home.categories.eyebrow"
              defaultValue="Explorá por colecciones"
              label="Subtítulo sección colecciones"
              as="span"
              className="text-xs uppercase tracking-widest font-semibold text-[#C8102E]"
            />
            <div className="mt-1">
              <EditableText
                contentKey="home.categories.heading"
                defaultValue="Categorías Principales"
                label="Título sección colecciones"
                as="h2"
                className="font-display font-extrabold text-3xl sm:text-4xl text-[#F8F7F4] tracking-tight"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[11px] font-mono text-[#777] uppercase tracking-wider hidden sm:inline-block">
              ← Arrastrá o navegá →
            </span>

            <button
              onClick={() => navigateToCatalog('Todos')}
              className="text-xs font-semibold uppercase tracking-wider text-[#9E9D99] hover:text-[#F8F7F4] transition-colors flex items-center gap-1 focus-ring cursor-pointer"
            >
              <EditableText
                contentKey="home.categories.cta"
                defaultValue="Ver catálogo"
                label="Texto botón ver catálogo"
                as="span"
              />
              <ArrowUpRight className="w-4 h-4 text-[#C8102E]" />
            </button>

            {/* Slider Navigation Arrows */}
            <div className="flex items-center gap-1.5 border-l border-[#2B2B2B] pl-3">
              <button
                type="button"
                onClick={() => handleScroll('left')}
                disabled={!canScrollLeft}
                className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                  canScrollLeft
                    ? 'border-[#333] bg-[#161616] text-white hover:border-[#C8102E] hover:bg-[#222] cursor-pointer active:scale-95'
                    : 'border-[#222] bg-[#121212] text-[#444] cursor-not-allowed opacity-40'
                }`}
                aria-label="Ver categorías anteriores"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleScroll('right')}
                disabled={!canScrollRight}
                className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                  canScrollRight
                    ? 'border-[#333] bg-[#161616] text-white hover:border-[#C8102E] hover:bg-[#222] cursor-pointer active:scale-95'
                    : 'border-[#222] bg-[#121212] text-[#444] cursor-not-allowed opacity-40'
                }`}
                aria-label="Ver categorías siguientes"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Drag-to-Scroll Categories Container */}
        <div
          ref={sliderRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          onScroll={checkScroll}
          className="flex gap-5 sm:gap-6 overflow-x-auto pb-4 pt-1 cursor-grab active:cursor-grabbing select-none scrollbar-none"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {enabledCategories.map((category) => {
            const count = products.filter(
              (p) => p.category && p.category.toLowerCase() === category.slug.toLowerCase()
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
                isDraggingRef={isDraggingRef}
              />
            );
          })}
        </div>

      </div>
    </section>
  );
};

