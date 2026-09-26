import React, { useState } from 'react';
import { useUI } from '../../context/UIContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useProductManagement } from '../../context/ProductManagementContext';
import { ProductCard } from './ProductCard';
import { Accordion } from '../ui/Accordion';
import { Badge } from '../ui/Badge';
import { brandConfig } from '../../config/brandConfig';
import { ProductColor } from '../../types';
import {
  Heart,
  Ruler,
  MapPin,
  RotateCcw,
  ShieldCheck,
  Plus,
  Minus,
  ArrowLeft,
  Share2,
  Sparkles,
  MessageCircle,
  Flame
} from 'lucide-react';

export const ProductDetailView: React.FC = () => {
  const { selectedProduct, navigateToCatalog, setIsSizeGuideOpen, showToast } = useUI();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { products } = useProductManagement();

  if (!selectedProduct) {
    return (
      <div className="py-24 text-center">
        <p className="text-sm text-[#9E9D99]">No se ha seleccionado ningún producto.</p>
        <button
          onClick={() => navigateToCatalog('Todos')}
          className="mt-4 px-6 py-2.5 bg-[#F8F7F4] text-[#121212] font-semibold text-xs uppercase"
        >
          Volver a la tienda
        </button>
      </div>
    );
  }

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<ProductColor>(selectedProduct.colors[0] || { name: 'Único', hex: '#C8102E' });
  const [selectedSize, setSelectedSize] = useState<string>(selectedProduct.sizes[0] || 'Único');
  const [quantity, setQuantity] = useState(selectedProduct.minQuantity || 1);
  const [isCustomVersion, setIsCustomVersion] = useState(false);

  const isFavorite = isInWishlist(selectedProduct.id);
  const isWholesaleApplicable = Boolean(
    selectedProduct.priceWholesale &&
    !isCustomVersion &&
    quantity >= (selectedProduct.wholesaleMinUnits || 10)
  );

  const currentPrice = isCustomVersion && selectedProduct.priceCustom
    ? selectedProduct.priceCustom
    : isWholesaleApplicable && selectedProduct.priceWholesale
    ? selectedProduct.priceWholesale
    : selectedProduct.price;

  const formatMoney = (val: number | null) =>
    val == null ? '—' : `$ ${new Intl.NumberFormat('es-AR').format(val)}`;

  const handleAddToCart = () => {
    addToCart(selectedProduct, selectedSize as any, selectedColor, quantity);
    showToast(`Agregaste ${quantity}x ${selectedProduct.name} (${selectedSize} / ${selectedColor.name}) al carrito.`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: selectedProduct.name,
        text: selectedProduct.description,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Enlace copiado al portapapeles', 'info');
    }
  };

  // WhatsApp consultation
  const waConsultationUrl = `https://wa.me/${brandConfig.contact.whatsapp}?text=${encodeURIComponent(
    `Hola Leo, quiero consultar por ${quantity} unidad(es) de ${selectedProduct.name}${
      isCustomVersion ? ' con personalización' : ' versión base'
    }.`
  )}`;

  // Related products from same category
  const relatedProducts = products
    .filter((p) => p.category === selectedProduct.category && p.id !== selectedProduct.id)
    .slice(0, 4);

  // Accordion Items
  const accordionItems = [
    {
      id: 'details',
      title: 'Descripción y Especificaciones',
      content: (
        <div className="space-y-3 text-xs leading-relaxed">
          <p>{selectedProduct.description}</p>
          {selectedProduct.material && <p><strong className="text-white">Material:</strong> {selectedProduct.material}</p>}
          {selectedProduct.composition && <p><strong className="text-white">Composición:</strong> {selectedProduct.composition}</p>}
          {selectedProduct.fit && <p><strong className="text-white">Calce / Formato:</strong> {selectedProduct.fit}</p>}
          <p><strong className="text-white">Cantidad mínima:</strong> {selectedProduct.minQuantity} unidad(es)</p>
        </div>
      ),
      defaultOpen: true
    },
    {
      id: 'customization',
      title: 'Opciones de Personalización',
      content: (
        <div className="space-y-2 text-xs leading-relaxed">
          {selectedProduct.customizable ? (
            <>
              <p className="text-[#C8102E] font-semibold">
                ✓ Este producto permite personalización con nombres, logos, escudos o estampas.
              </p>
              <p>
                El precio personalizado sugerido es de <strong className="text-white">{formatMoney(selectedProduct.priceCustom)}</strong>. El diseño final, las muestras digitales y las opciones de estampa se coordinan directamente por WhatsApp con Leo.
              </p>
            </>
          ) : (
            <p className="text-[#999]">Este producto se entrega en su versión estándar oficial sin personalizaciones adicionales.</p>
          )}
        </div>
      )
    },
    {
      id: 'shipping',
      title: 'Modalidad de Entrega y Retiro',
      content: (
        <div className="space-y-2 text-xs leading-relaxed">
          <p>
            <strong className="text-white">Retiro gratuito en nuestro local:</strong> Av. General Jones (entre Mercante y Gral. Vedia), Las Breñas, Chaco.
          </p>
          <p>
            <strong className="text-white">Coordinación de entrega:</strong> Una vez confirmado tu pedido, te avisamos de inmediato por WhatsApp para que pases a retirarlo cuando te quede más cómodo.
          </p>
          <p>
            <strong className="text-white">Tiempo de producción:</strong> Para prendas personalizadas o pedidos en cantidad, coordinamos la fecha exacta de entrega de forma previa.
          </p>
        </div>
      )
    }
  ];

  return (
    <div className="bg-[#0E0E0E] min-h-screen py-8 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <button
          onClick={() => navigateToCatalog(selectedProduct.category)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#9E9D99] hover:text-white mb-8 transition-colors focus-ring cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#C8102E]" />
          <span>Volver a {selectedProduct.category}</span>
        </button>

        {/* Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          
          {/* Gallery Column (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#141414] border border-[#222] rounded-[2px]">
              <img
                src={selectedProduct.images[activeImageIndex] || selectedProduct.images[0]}
                alt={`${selectedProduct.name} - Vista ${activeImageIndex + 1}`}
                className="w-full h-full object-cover object-center"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                {selectedProduct.customizable && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#C8102E] text-white rounded-[2px]">
                    <Sparkles className="w-3 h-3" />
                    Personalizable
                  </span>
                )}
                {selectedProduct.tag && (
                  <Badge variant="subtle">{selectedProduct.tag}</Badge>
                )}
              </div>

              {/* Favorite & Share */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleShare}
                  className="w-10 h-10 rounded-full bg-[#141414]/80 text-[#C8C5BE] hover:text-white flex items-center justify-center transition-colors focus-ring"
                  aria-label="Compartir prenda"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => toggleWishlist(selectedProduct.id)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors focus-ring ${
                    isFavorite
                      ? 'bg-[#C8102E] text-white shadow-md'
                      : 'bg-[#141414]/80 text-[#C8C5BE] hover:text-white'
                  }`}
                  aria-label={isFavorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current text-white' : ''}`} />
                </button>
              </div>
            </div>

            {/* Thumbnail Selectors */}
            {selectedProduct.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {selectedProduct.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-24 shrink-0 rounded-[2px] overflow-hidden border transition-all ${
                      activeImageIndex === idx
                        ? 'border-[#C8102E] ring-1 ring-[#C8102E] opacity-100'
                        : 'border-[#262626] opacity-60 hover:opacity-100'
                    }`}
                    aria-label={`Ver imagen ${idx + 1}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details & Actions Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Header info */}
            <div className="space-y-2 border-b border-[#222] pb-6">
              <div className="flex items-center justify-between text-xs text-[#9E9D99]">
                <span className="uppercase tracking-widest font-semibold text-[#C8102E]">
                  {selectedProduct.category}
                </span>
                <span className="font-mono">Mínimo: {selectedProduct.minQuantity} u.</span>
              </div>

              <h1 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#F8F7F4] leading-tight">
                {selectedProduct.name}
              </h1>

              {/* Price Mode Toggle if product is customizable */}
              {selectedProduct.customizable && selectedProduct.priceCustom && (
                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCustomVersion(false)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-[2px] border transition-all ${
                      !isCustomVersion
                        ? 'bg-[#F8F7F4] text-[#121212] border-white'
                        : 'bg-[#161616] text-[#AAA] border-[#2C2C2C]'
                    }`}
                  >
                    Versión Base ({formatMoney(selectedProduct.priceBase)})
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCustomVersion(true)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-[2px] border transition-all ${
                      isCustomVersion
                        ? 'bg-[#C8102E] text-white border-[#C8102E]'
                        : 'bg-[#161616] text-[#AAA] border-[#2C2C2C]'
                    }`}
                  >
                    Personalizado ({formatMoney(selectedProduct.priceCustom)})
                  </button>
                </div>
              )}

              {/* Price display */}
              <div className="pt-3">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="font-bold text-3xl text-[#F8F7F4]">
                    {formatMoney(currentPrice)}
                  </span>
                  {selectedProduct.originalPrice && selectedProduct.originalPrice > currentPrice && (
                    <span className="line-through text-base text-[#777]">
                      {formatMoney(selectedProduct.originalPrice)}
                    </span>
                  )}
                  {selectedProduct.offer?.active && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#C8102E] text-white text-xs font-bold uppercase rounded-[2px] shadow-sm">
                      <Flame className="w-3 h-3 fill-current" />
                      {selectedProduct.offer.badgeText || (selectedProduct.offer.type === 'discount_percent' ? `${selectedProduct.offer.discountPercent}% OFF` : 'OFERTA')}
                    </span>
                  )}
                  <span className="text-xs text-[#888]">
                    {isCustomVersion ? 'por unidad con personalización' : 'precio base unitario'}
                  </span>
                </div>

                {selectedProduct.priceWholesale && (
                  <div
                    className={`mt-2.5 p-2.5 rounded-[2px] border flex items-center justify-between text-xs transition-all ${
                      isWholesaleApplicable
                        ? 'bg-[#1D1707] border-[#D4AF37] text-[#F5E6B3]'
                        : 'bg-[#151515] border-[#2C2C2C] text-[#BBB]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        isWholesaleApplicable
                          ? 'bg-[#D4AF37] text-black'
                          : 'bg-[#2A2A2A] text-[#D4AF37]'
                      }`}>
                        {isWholesaleApplicable ? 'Mayorista Aplicado' : 'Tarifa Mayorista'}
                      </span>
                      <span>
                        Desde <strong>{selectedProduct.wholesaleMinUnits || 10} unidades</strong>
                      </span>
                    </div>
                    <span className="font-mono font-bold text-sm text-[#F8F7F4]">
                      {formatMoney(selectedProduct.priceWholesale)} <span className="text-[10px] font-normal text-[#888]">c/u</span>
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Short description */}
            <p className="text-sm text-[#B5B2AA] leading-relaxed">
              {selectedProduct.shortDescription}
            </p>

            {/* Color Selector */}
            {selectedProduct.colors.length > 1 && (
              <div className="space-y-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-[#9E9D99]">
                  Color: <strong className="text-white">{selectedColor.name}</strong>
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.colors.map((color) => {
                    const isSelected = selectedColor.name === color.name;
                    return (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-[2px] border text-xs transition-all focus-ring ${
                          isSelected
                            ? 'border-[#C8102E] bg-[#1C1C1C] text-white ring-1 ring-[#C8102E]'
                            : 'border-[#2D2D2D] bg-[#141414] text-[#AAA] hover:border-[#444]'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-[#444]"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span>{color.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size Selector for Apparel */}
            {selectedProduct.category === 'Indumentaria' && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold uppercase tracking-wider text-[#9E9D99]">
                    Talle: <strong className="text-white">{selectedSize}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="text-xs text-[#C8102E] hover:underline flex items-center gap-1 font-semibold focus-ring"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Guía de talles</span>
                  </button>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {selectedProduct.sizes.map((size) => {
                    const isSelected = selectedSize === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`py-3 text-sm font-bold uppercase rounded-[2px] border transition-all focus-ring ${
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
            )}

            {/* Quantity Selector & CTAs */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                {/* Quantity Controls */}
                <div className="flex items-center border border-[#2F2F2F] bg-[#141414] rounded-[2px] h-12">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(selectedProduct.minQuantity || 1, q - 1))}
                    className="px-3.5 h-full text-[#AAA] hover:text-white focus-ring"
                    aria-label="Reducir cantidad"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center text-sm font-bold text-white select-none">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-3.5 h-full text-[#AAA] hover:text-white focus-ring"
                    aria-label="Aumentar cantidad"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Primary Add to Cart */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 h-12 bg-[#F8F7F4] hover:bg-white text-[#121212] font-semibold text-xs uppercase tracking-wider rounded-[2px] transition-all shadow-md active:scale-[0.98] focus-ring"
                >
                  Agregar al carrito ({formatMoney(currentPrice * quantity)})
                </button>
              </div>

              {/* Direct WhatsApp Consultation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href={waConsultationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-12 bg-[#1F1F1F] hover:bg-[#282828] border border-[#333] text-[#F8F7F4] font-semibold text-xs uppercase tracking-wider rounded-[2px] transition-all flex items-center justify-center gap-2 focus-ring"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  <span>Consultar por WhatsApp</span>
                </a>

                {/* Direct Wholesale Consultation */}
                <a
                  href={`https://wa.me/${brandConfig.contact.whatsapp}?text=${encodeURIComponent(
                    `Hola Leo! Me gustaría consultar precio mayorista para comprar en cantidad el producto: ${selectedProduct.name}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-12 bg-[#1A1812] hover:bg-[#252219] border border-[#D4AF37]/60 hover:border-[#D4AF37] text-[#D4AF37] hover:text-[#FFF] font-bold text-xs uppercase tracking-wider rounded-[2px] transition-all flex items-center justify-center gap-2 focus-ring shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  <span>Consultar Mayorista</span>
                </a>
              </div>
            </div>

            {/* Trust Points */}
            <div className="pt-4 border-t border-[#222] space-y-2.5 text-xs text-[#9E9D99]">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#C8102E] shrink-0" />
                <span>Retiro en nuestro local comercial en Las Breñas sin cargo</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[#C8102E] shrink-0" />
                <span>Cambios rápidos y atención directa de taller</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C8102E] shrink-0" />
                <span>Garantía de confección y estampa CASACAS LB</span>
              </div>
            </div>

            {/* Accordions */}
            <div className="pt-4">
              <Accordion items={accordionItems} />
            </div>

          </div>

        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-12 border-t border-[#1C1C1C]">
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#F8F7F4] mb-8">
              Otras opciones de {selectedProduct.category}
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
