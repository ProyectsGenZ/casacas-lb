import React, { useState } from 'react';
import { Product, ProductColor } from '../../types';
import { useUI } from '../../context/UIContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { brandConfig } from '../../config/brandConfig';
import { Heart, Plus, Check, Sparkles, Flame } from 'lucide-react';
import { Badge } from '../ui/Badge';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { openProductDetail, showToast } = useUI();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  const [isHovered, setIsHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0] || { name: 'Único', hex: '#C8102E' });
  const [isQuickAdding, setIsQuickAdding] = useState(false);

  const isFavorite = isInWishlist(product.id);
  const hasSecondImage = product.images.length > 1;
  const currentImage = isHovered && hasSecondImage ? product.images[1] : product.images[0];

  const installmentAmount = Math.round(product.priceBase / brandConfig.installmentsCount);

  // Format currency
  const formatMoney = (val: number | null) =>
    val == null ? '—' : `$ ${new Intl.NumberFormat('es-AR').format(val)}`;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultSize = (product.sizes[0] || 'Único') as any;
    addToCart(product, defaultSize, selectedColor, product.minQuantity || 1);
    setIsQuickAdding(true);
    showToast(`"${product.name}" agregado al carrito (${product.minQuantity || 1} u.).`, 'success');
    setTimeout(() => setIsQuickAdding(false), 1200);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
    showToast(
      isFavorite ? `Eliminado de favoritos` : `Guardado en favoritos`,
      'info'
    );
  };

  return (
    <article
      onClick={() => openProductDetail(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group flex flex-col h-full bg-[#121212] border border-[#202020] hover:border-[#383838] transition-all duration-200 cursor-pointer text-left select-none relative"
      style={{ borderRadius: 'var(--radius-xs)' }}
    >
      {/* Product Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#181818]">
        <img
          src={currentImage}
          alt={`Fotografía de ${product.name}`}
          className="w-full h-full object-cover object-center transition-all duration-500 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Badges / SKU */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          <Badge variant="dark" className="font-mono text-[10px]">
            {product.sku}
          </Badge>
          {product.offer?.active && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#C8102E] text-white rounded-[2px] shadow-md shadow-[#C8102E]/30">
              <Flame className="w-2.5 h-2.5 fill-current" />
              {product.offer.badgeText || (product.offer.type === 'discount_percent' ? `${product.offer.discountPercent}% OFF` : 'OFERTA')}
            </span>
          )}
          {product.customizable && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#1C1C1C] text-[#DDD] border border-[#333] rounded-[2px]">
              <Sparkles className="w-2.5 h-2.5 text-[#C8102E]" />
              Personalizable
            </span>
          )}
          {product.tag && product.tag !== 'Personalizable' && (
            <Badge variant="subtle">
              {product.tag}
            </Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleFavoriteClick}
          className={`absolute top-2.5 right-2.5 w-9 h-9 flex items-center justify-center rounded-full transition-colors z-10 focus-ring ${
            isFavorite
              ? 'bg-[#C8102E] text-white shadow-md'
              : 'bg-[#141414]/80 text-[#C8C5BE] hover:text-white hover:bg-black'
          }`}
          aria-label={isFavorite ? `Quitar ${product.name} de favoritos` : `Guardar ${product.name} en favoritos`}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current text-white' : ''}`} />
        </button>

        {/* Quick Add Overlay on desktop / Bottom bar on mobile */}
        <div className="absolute bottom-2.5 inset-x-2.5 z-10">
          <button
            type="button"
            onClick={handleQuickAdd}
            className={`w-full py-2.5 px-3 flex items-center justify-center gap-1.5 font-semibold text-xs uppercase tracking-wider rounded-[2px] transition-all duration-150 active:scale-[0.98] shadow-md focus-ring ${
              isQuickAdding
                ? 'bg-[#2E7D32] text-white'
                : 'bg-[#F8F7F4] hover:bg-white text-[#121212] sm:opacity-0 sm:group-hover:opacity-100 sm:translate-y-1 sm:group-hover:translate-y-0'
            }`}
            aria-label={`Agregar ${product.name} al carrito`}
          >
            {isQuickAdding ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Agregado</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5 text-[#121212]" />
                <span>Agregar rápido</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Product Details Info */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between gap-3">
        
        {/* Category & Minimum */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2 text-[10px] font-bold uppercase tracking-wider text-[#7A7873]">
            <span>{product.category}</span>
            <span className="font-mono">Mín. {product.minQuantity} u.</span>
          </div>

          {/* Product Name */}
          <h3 className="font-display font-bold text-sm sm:text-base text-[#F8F7F4] group-hover:text-[#C8102E] transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Short description */}
          <p className="text-[11px] text-[#888] line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>
        </div>

        {/* Pricing */}
        <div className="pt-2 border-t border-[#1C1C1C]">
          <div className="flex items-baseline gap-2 flex-wrap">
            {product.originalPrice && product.originalPrice > product.price ? (
              <>
                <span className="font-bold text-base sm:text-lg text-[#F8F7F4]">
                  {formatMoney(product.price)}
                </span>
                <span className="line-through text-xs text-[#7A7873]">
                  {formatMoney(product.originalPrice)}
                </span>
              </>
            ) : (
              <span className="font-bold text-base sm:text-lg text-[#F8F7F4]">
                {formatMoney(product.price)}
              </span>
            )}
            {product.priceCustom && (
              <span className="text-[11px] text-[#A09D96]">
                / {formatMoney(product.priceCustom)} <span className="text-[#C8102E] font-medium">personaliz.</span>
              </span>
            )}
          </div>
          {product.priceWholesale ? (
            <div className="mt-1.5 flex items-center justify-between text-[11px] bg-[#171511] border border-[#3E3218] px-2 py-0.5 rounded-[2px]">
              <span className="text-[#D4AF37] font-semibold">Mayorista ({product.wholesaleMinUnits || 10}+ u.):</span>
              <strong className="text-white font-mono">{formatMoney(product.priceWholesale)}</strong>
            </div>
          ) : null}
        </div>

      </div>
    </article>
  );
};
