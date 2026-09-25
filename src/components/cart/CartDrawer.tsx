import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useUI } from '../../context/UIContext';
import { brandConfig } from '../../config/brandConfig';
import { X, Trash2, Plus, Minus, ArrowRight, Truck, Tag, ShoppingBag, Check } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    discountAmount,
    shippingCost,
    total,
    freeShippingProgress,
    remainingForFreeShipping,
    couponCode,
    applyCoupon,
    removeCoupon
  } = useCart();

  const { navigateToCatalog, showToast } = useUI();
  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartOpen) {
        setIsCartOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, setIsCartOpen]);

  if (!isCartOpen) return null;

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const result = applyCoupon(couponInput);
    setCouponFeedback(result);
    if (result.success) {
      showToast(result.message, 'success');
      setCouponInput('');
    }
  };

  const handleCheckout = () => {
    // Generate WhatsApp checkout message or simulated checkout
    const itemsSummary = cart
      .map((item) => `- ${item.quantity}x ${item.product.name} (Talle: ${item.selectedSize}, Color: ${item.selectedColor.name}) = ${formatPrice(item.product.price * item.quantity)}`)
      .join('\n');
    
    const message = `*NUEVO PEDIDO DESDE LA TIENDA WEB - ${brandConfig.name}*\n\n*Detalle de prendas:*\n${itemsSummary}\n\n*Subtotal:* ${formatPrice(subtotal)}${discountAmount > 0 ? `\n*Descuento cupón:* -${formatPrice(discountAmount)}` : ''}\n*Costo de envío:* ${shippingCost === 0 ? 'GRATIS' : formatPrice(shippingCost)}\n*TOTAL FINAL:* ${formatPrice(total)}\n\n¿Cómo continuamos con el pago y la entrega?`;

    const waUrl = `https://wa.me/${brandConfig.contact.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Carrito de compras"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer Container */}
      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-[#121212] border-l border-[#242424] shadow-2xl flex flex-col justify-between">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#202020]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#C85A32]" />
              <h2 className="font-display font-bold text-lg text-[#F8F7F4] uppercase tracking-wide">
                Tu Carrito ({cart.length})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-[#9E9D99] hover:text-white rounded-[2px] focus-ring"
              aria-label="Cerrar carrito"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="mt-4 p-3 bg-[#181818] border border-[#262626] rounded-[2px]">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="flex items-center gap-1.5 text-[#E0DDD5] font-medium">
                <Truck className="w-3.5 h-3.5 text-[#C85A32]" />
                {remainingForFreeShipping === 0 ? (
                  <strong className="text-[#4CAF50]">¡Tenés ENVÍO GRATIS a todo el país!</strong>
                ) : (
                  <span>
                    Te faltan <strong className="text-white">{formatPrice(remainingForFreeShipping)}</strong> para envío gratis
                  </span>
                )}
              </span>
              <span className="font-mono text-[11px] text-[#A09D96]">
                {freeShippingProgress}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-[#2B2B2B] rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  remainingForFreeShipping === 0 ? 'bg-[#4CAF50]' : 'bg-[#C85A32]'
                }`}
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length > 0 ? (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-3.5 p-3 bg-[#161616] border border-[#222] rounded-[2px] relative"
              >
                {/* Thumb */}
                <div className="w-20 h-24 bg-[#1F1F1F] rounded-[2px] overflow-hidden shrink-0">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display font-bold text-sm text-[#F8F7F4] leading-tight line-clamp-1">
                      {item.product.name}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-[#8E8B84] mt-1">
                      <span>Talle: <strong className="text-[#CCC]">{item.selectedSize}</strong></span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        Color:
                        <span
                          className="w-2.5 h-2.5 rounded-full inline-block border border-[#444]"
                          style={{ backgroundColor: item.selectedColor.hex }}
                        />
                        <strong className="text-[#CCC]">{item.selectedColor.name}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Quantity and Price */}
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#202020]">
                    <div className="flex items-center border border-[#333] bg-[#101010] rounded-[2px]">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, -1)}
                        className="px-2 py-1 text-[#888] hover:text-white"
                        aria-label="Disminuir unidad"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-7 text-center text-xs font-bold text-white">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, 1)}
                        className="px-2 py-1 text-[#888] hover:text-white"
                        aria-label="Aumentar unidad"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="font-bold text-sm text-[#F8F7F4]">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => removeFromCart(item.id)}
                  className="absolute top-2 right-2 p-1 text-[#666] hover:text-[#D32F2F] transition-colors focus-ring"
                  aria-label={`Eliminar ${item.product.name} del carrito`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          ) : (
            /* Empty State */
            <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#181818] border border-[#2A2A2A] flex items-center justify-center text-[#666]">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-white">
                  Tu carrito está vacío
                </h3>
                <p className="text-xs text-[#8E8B84] mt-1 max-w-xs">
                  Todavía no agregaste ninguna prenda. Explorá nuestro catálogo de casacas, camperas y buzos.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsCartOpen(false);
                  navigateToCatalog('Todos');
                }}
                className="px-6 py-3 bg-[#F8F7F4] hover:bg-white text-[#121212] font-semibold text-xs uppercase tracking-wider rounded-[2px] transition-all"
              >
                Explorar catálogo
              </button>
            </div>
          )}
        </div>

        {/* Drawer Footer with Subtotal, Coupon and Checkout */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-[#222] bg-[#0E0E0E] space-y-3.5">
            
            {/* Coupon Code Input */}
            <form onSubmit={handleApplyCoupon} className="space-y-1.5">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#777]" />
                  <input
                    type="text"
                    placeholder="Cupón de descuento (ej: CASACAS10)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="w-full bg-[#161616] border border-[#2E2E2E] text-xs text-white pl-9 pr-3 py-2 rounded-[2px] uppercase placeholder:normal-case placeholder:text-[#555] focus:outline-none focus:border-[#C85A32]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-2 bg-[#222] hover:bg-[#333] text-xs font-semibold text-white uppercase rounded-[2px]"
                >
                  Aplicar
                </button>
              </div>

              {couponCode && (
                <div className="flex items-center justify-between text-xs text-[#4CAF50] font-medium bg-[#1B2E1D] p-2 rounded-[2px]">
                  <span className="flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Cupón <strong>{couponCode}</strong> activo
                  </span>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-[#E57373] text-[11px] underline"
                  >
                    Quitar
                  </button>
                </div>
              )}

              {couponFeedback && !couponFeedback.success && (
                <p className="text-[11px] text-[#E57373]">
                  {couponFeedback.message}
                </p>
              )}
            </form>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-[#9E9D99] pt-2 border-t border-[#1C1C1C]">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="text-white font-medium">{formatPrice(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-[#4CAF50]">
                  <span>Descuento aplicado:</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Envío:</span>
                <span className={shippingCost === 0 ? 'text-[#4CAF50] font-bold' : 'text-white'}>
                  {shippingCost === 0 ? 'GRATIS' : formatPrice(shippingCost)}
                </span>
              </div>
              <div className="flex justify-between text-sm sm:text-base font-bold text-white pt-2 border-t border-[#222]">
                <span>Total:</span>
                <span className="text-[#C85A32]">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              type="button"
              onClick={handleCheckout}
              className="w-full py-4 bg-[#C85A32] hover:bg-[#DF683B] text-white font-semibold text-xs uppercase tracking-wider rounded-[2px] transition-all flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] focus-ring"
            >
              <span>Continuar compra por WhatsApp</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-[11px] text-center text-[#666]">
              Coordinás el pago seguro (tarjeta o transferencia) y la entrega directamente con nosotros.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
