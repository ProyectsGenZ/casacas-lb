import React, { useState, useMemo } from 'react';
import { useProductManagement } from '../../context/ProductManagementContext';
import { useStoreSettings } from '../../context/StoreSettingsContext';
import { ProductCard } from '../product/ProductCard';
import { useUI } from '../../context/UIContext';
import { ProductCategory, SortOption } from '../../types';
import { Filter, RotateCcw, SlidersHorizontal, ArrowUpDown, X, Sparkles } from 'lucide-react';

export const CatalogView: React.FC = () => {
  const { catalogCategoryFilter, setCatalogCategoryFilter } = useUI();
  const { products } = useProductManagement();
  const { enabledCategories, isCategoryEnabled } = useStoreSettings();

  const [selectedCategory, setSelectedCategory] = useState<string>(catalogCategoryFilter);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [onlyCustomizable, setOnlyCustomizable] = useState<boolean>(false);
  const [maxPrice, setMaxPrice] = useState<number>(55000);
  const [sortOption, setSortOption] = useState<SortOption>('destacados');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  React.useEffect(() => {
    setSelectedCategory(catalogCategoryFilter);
  }, [catalogCategoryFilter]);

  const allSizes = ['S', 'M', 'L', 'XL', 'XXL', 'Único'];

  // Filter logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => isCategoryEnabled(p.category))
      .filter((p) => {
        // Category
        if (selectedCategory !== 'Todos' && p.category.toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }
        // Size
        if (selectedSizes.length > 0 && !selectedSizes.some((s) => p.sizes.includes(s as any))) {
          return false;
        }
        // Customizable toggle
        if (onlyCustomizable && !p.customizable) {
          return false;
        }
        // Max Price
        if (p.priceBase > maxPrice) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortOption === 'precio-asc') return a.priceBase - b.priceBase;
        if (sortOption === 'precio-desc') return b.priceBase - a.priceBase;
        if (sortOption === 'recientes') return (b.tag === 'Nuevo' ? 1 : 0) - (a.tag === 'Nuevo' ? 1 : 0);
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [selectedCategory, selectedSizes, onlyCustomizable, maxPrice, sortOption]);

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const resetFilters = () => {
    setSelectedCategory('Todos');
    setCatalogCategoryFilter('Todos');
    setSelectedSizes([]);
    setOnlyCustomizable(false);
    setMaxPrice(55000);
    setSortOption('destacados');
  };

  const activeFiltersCount =
    (selectedCategory !== 'Todos' ? 1 : 0) +
    selectedSizes.length +
    (onlyCustomizable ? 1 : 0) +
    (maxPrice < 55000 ? 1 : 0);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="bg-[#0E0E0E] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Catalog Banner / Header */}
        <div className="mb-10 pb-8 border-b border-[#222222]">
          <span className="text-xs uppercase tracking-widest font-semibold text-[#C8102E]">
            Catálogo Oficial 2026
          </span>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-[#F8F7F4] mt-1.5 tracking-tight">
            {selectedCategory === 'Todos' ? 'Todas las Prendas y Artículos' : selectedCategory}
          </h1>
          <p className="text-sm text-[#9E9D99] mt-2 max-w-2xl leading-relaxed">
            Elegí la prenda o pieza base para tu equipo, marca o uso personal. Nosotros nos encargamos de que represente tu identidad.
          </p>
        </div>

        {/* Controls Bar */}
        <div className="flex items-center justify-between gap-4 pb-6 border-b border-[#1C1C1C] mb-8">
          
          {/* Mobile Filter Button */}
          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden inline-flex items-center gap-2 px-4 py-2.5 bg-[#181818] border border-[#2D2D2D] text-xs font-semibold text-[#F8F7F4] uppercase tracking-wider rounded-[2px] focus-ring"
          >
            <Filter className="w-4 h-4 text-[#C8102E]" />
            <span>Filtros</span>
            {activeFiltersCount > 0 && (
              <span className="w-5 h-5 bg-[#C8102E] text-white text-[11px] font-bold rounded-full flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Results count */}
          <div className="text-xs font-medium text-[#8E8B84]">
            Mostrando <span className="text-[#F8F7F4] font-bold">{filteredProducts.length}</span> {filteredProducts.length === 1 ? 'producto' : 'productos'}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <label htmlFor="catalog-sort" className="hidden sm:inline-flex items-center gap-1.5 text-xs text-[#9E9D99] font-medium">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#C8102E]" />
              <span>Ordenar:</span>
            </label>
            <select
              id="catalog-sort"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="bg-[#141414] border border-[#2A2A2A] text-xs font-medium text-[#F8F7F4] px-3 py-2 rounded-[2px] focus:outline-none focus:border-[#C8102E] focus-ring"
            >
              <option value="destacados">Destacados</option>
              <option value="recientes">Novedades</option>
              <option value="precio-asc">Precio: Menor a mayor</option>
              <option value="precio-desc">Precio: Mayor a menor</option>
            </select>
          </div>

        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block space-y-8 pr-6 border-r border-[#1C1C1C]">
            
            {/* Header / Clear */}
            <div className="flex items-center justify-between pb-4 border-b border-[#1E1E1E]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#F8F7F4] flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4 text-[#C8102E]" />
                Filtros
              </span>
              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-[11px] text-[#C8102E] hover:underline flex items-center gap-1 font-semibold"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Limpiar ({activeFiltersCount})</span>
                </button>
              )}
            </div>

            {/* Categories */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#9E9D99]">
                Categoría
              </h3>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('Todos');
                    setCatalogCategoryFilter('Todos');
                  }}
                  className={`w-full text-left py-2 px-2.5 text-xs font-semibold rounded-[2px] transition-colors flex items-center justify-between ${
                    selectedCategory === 'Todos'
                      ? 'bg-[#F8F7F4] text-[#121212]'
                      : 'text-[#9E9D99] hover:text-white hover:bg-[#1A1A1A]'
                  }`}
                >
                  <span>Todas las categorías</span>
                  <span className="text-[10px] opacity-70 font-mono">{products.length}</span>
                </button>

                {enabledCategories.map((cat) => {
                  const isSelected = selectedCategory.toLowerCase() === cat.slug.toLowerCase();
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat.slug as any);
                        setCatalogCategoryFilter(cat.slug as any);
                      }}
                      className={`w-full text-left py-2 px-2.5 text-xs font-semibold rounded-[2px] transition-colors flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#F8F7F4] text-[#121212]'
                          : 'text-[#9E9D99] hover:text-white hover:bg-[#1A1A1A]'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className="text-[10px] opacity-70 font-mono">
                        {products.filter((p) => p.category.toLowerCase() === cat.slug.toLowerCase()).length}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Customizable only toggle */}
            <div className="pt-6 border-t border-[#1C1C1C]">
              <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-[#E0DDD5]">
                <input
                  type="checkbox"
                  checked={onlyCustomizable}
                  onChange={(e) => setOnlyCustomizable(e.target.checked)}
                  className="rounded-[2px] accent-[#C8102E] w-4 h-4 cursor-pointer"
                />
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#C8102E]" />
                  Solo personalizables
                </span>
              </label>
            </div>

            {/* Sizes */}
            <div className="space-y-3 pt-6 border-t border-[#1C1C1C]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#9E9D99]">
                Talles
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {allSizes.map((size) => {
                  const isSelected = selectedSizes.includes(size);
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => toggleSize(size)}
                      className={`py-2 text-xs font-bold uppercase rounded-[2px] border transition-colors focus-ring ${
                        isSelected
                          ? 'bg-[#C8102E] text-white border-[#C8102E]'
                          : 'bg-[#141414] text-[#C8C5BD] border-[#2A2A2A] hover:border-[#444]'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Slider */}
            <div className="space-y-3 pt-6 border-t border-[#1C1C1C]">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold uppercase tracking-wider text-[#9E9D99]">Precio Máximo</span>
                <span className="font-bold text-[#F8F7F4]">{formatPrice(maxPrice)}</span>
              </div>
              <input
                type="range"
                min={1500}
                max={55000}
                step={2500}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#C8102E] cursor-pointer"
                aria-label="Filtrar por precio máximo"
              />
              <div className="flex justify-between text-[10px] text-[#696762]">
                <span>$1.500</span>
                <span>$55.000</span>
              </div>
            </div>

          </aside>

          {/* Product Grid */}
          <div className="lg:col-span-3">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="py-24 text-center border border-dashed border-[#262626] rounded-[2px] p-8 space-y-4">
                <div className="w-12 h-12 bg-[#1C1C1C] rounded-full flex items-center justify-center mx-auto text-[#C8102E]">
                  <Filter className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-xl text-[#F8F7F4]">
                  No se encontraron productos
                </h3>
                <p className="text-xs sm:text-sm text-[#8E8B84] max-w-md mx-auto leading-relaxed">
                  No hay artículos que coincidan con los filtros aplicados. Probá restableciendo los parámetros de búsqueda.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#F8F7F4] text-[#121212] font-semibold text-xs uppercase tracking-wider rounded-[2px] hover:bg-white transition-colors focus-ring"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Limpiar todos los filtros</span>
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Mobile Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Filtros del catálogo">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsMobileFilterOpen(false)} />
          <div className="fixed inset-y-0 right-0 max-w-sm w-full bg-[#121212] border-l border-[#262626] p-6 overflow-y-auto flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#222]">
                <h2 className="font-display font-bold text-lg text-[#F8F7F4]">
                  Filtros de Catálogo
                </h2>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 text-[#9E9D99] hover:text-white"
                  aria-label="Cerrar filtros"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Categories */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#9E9D99]">Categoría</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory('Todos');
                      setCatalogCategoryFilter('Todos');
                    }}
                    className={`py-2 px-3 text-xs font-semibold rounded-[2px] border ${
                      selectedCategory === 'Todos' ? 'bg-[#C8102E] text-white border-[#C8102E]' : 'bg-[#181818] border-[#2A2A2A] text-[#CCC]'
                    }`}
                  >
                    Todas
                  </button>
                  {enabledCategories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat.slug as any);
                        setCatalogCategoryFilter(cat.slug as any);
                      }}
                      className={`py-2 px-3 text-xs font-semibold rounded-[2px] border truncate ${
                        selectedCategory.toLowerCase() === cat.slug.toLowerCase() ? 'bg-[#C8102E] text-white border-[#C8102E]' : 'bg-[#181818] border-[#2A2A2A] text-[#CCC]'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customizable checkbox */}
              <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-[#E0DDD5]">
                <input
                  type="checkbox"
                  checked={onlyCustomizable}
                  onChange={(e) => setOnlyCustomizable(e.target.checked)}
                  className="rounded-[2px] accent-[#C8102E] w-4 h-4 cursor-pointer"
                />
                <span>Solo artículos personalizables</span>
              </label>

              {/* Price */}
              <div className="space-y-2 pt-4 border-t border-[#222]">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-[#9E9D99]">Precio Máx:</span>
                  <span className="font-bold text-white">{formatPrice(maxPrice)}</span>
                </div>
                <input
                  type="range"
                  min={1500}
                  max={55000}
                  step={2500}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#C8102E]"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-[#222] space-y-2">
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-3 bg-[#F8F7F4] text-[#121212] font-semibold text-xs uppercase tracking-wider rounded-[2px]"
              >
                Ver {filteredProducts.length} productos
              </button>
              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="w-full py-2.5 bg-transparent border border-[#333] text-[#9E9D99] text-xs font-semibold uppercase tracking-wider rounded-[2px]"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
