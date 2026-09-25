import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, ProductColor } from '../types';
import { brandConfig } from '../config/brandConfig';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, size: 'S' | 'M' | 'L' | 'XL' | 'XXL', color: ProductColor, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  couponCode: string;
  discountPercentage: number;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  subtotal: number;
  discountAmount: number;
  shippingCost: number;
  total: number;
  totalItems: number;
  freeShippingProgress: number;
  remainingForFreeShipping: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('voragine_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [couponCode, setCouponCode] = useState<string>(() => {
    try {
      return localStorage.getItem('voragine_coupon') || '';
    } catch {
      return '';
    }
  });

  const [discountPercentage, setDiscountPercentage] = useState<number>(() => {
    try {
      const code = localStorage.getItem('voragine_coupon') || '';
      return brandConfig.validCoupons[code.toUpperCase()] || 0;
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('voragine_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Error saving cart to localStorage', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      if (couponCode) {
        localStorage.setItem('voragine_coupon', couponCode);
      } else {
        localStorage.removeItem('voragine_coupon');
      }
    } catch (e) {
      console.error('Error saving coupon to localStorage', e);
    }
  }, [couponCode]);

  const addToCart = (
    product: Product,
    size: 'S' | 'M' | 'L' | 'XL' | 'XXL',
    color: ProductColor,
    quantity = 1
  ) => {
    const itemId = `${product.id}-${size}-${color.name}`;
    setCart((prev) => {
      const index = prev.findIndex((item) => item.id === itemId);
      if (index > -1) {
        const next = [...prev];
        next[index] = {
          ...next[index],
          quantity: next[index].quantity + quantity
        };
        return next;
      }
      return [
        ...prev,
        {
          id: itemId,
          product,
          selectedSize: size,
          selectedColor: color,
          quantity
        }
      ];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === itemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (!clean) {
      return { success: false, message: 'Ingresá un código de cupón.' };
    }
    const discount = brandConfig.validCoupons[clean];
    if (discount) {
      setCouponCode(clean);
      setDiscountPercentage(discount);
      return { success: true, message: `Cupón ${clean} aplicado: ${discount}% OFF en tu compra.` };
    }
    return { success: false, message: 'El cupón ingresado no es válido o ha expirado.' };
  };

  const removeCoupon = () => {
    setCouponCode('');
    setDiscountPercentage(0);
  };

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountAmount = Math.round(subtotal * (discountPercentage / 100));
  const freeShipping = subtotal >= brandConfig.freeShippingThreshold;
  const shippingCost = cart.length === 0 ? 0 : freeShipping ? 0 : brandConfig.standardShippingCost;
  const total = Math.max(0, subtotal - discountAmount + shippingCost);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  
  const freeShippingProgress = Math.min(100, Math.round((subtotal / brandConfig.freeShippingThreshold) * 100));
  const remainingForFreeShipping = Math.max(0, brandConfig.freeShippingThreshold - subtotal);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        couponCode,
        discountPercentage,
        applyCoupon,
        removeCoupon,
        subtotal,
        discountAmount,
        shippingCost,
        total,
        totalItems,
        freeShippingProgress,
        remainingForFreeShipping
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
