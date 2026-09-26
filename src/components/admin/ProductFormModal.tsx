import React, { useState, useEffect } from 'react';
import { Product, ProductCategory, OfferType, ProductOffer, ProductColor } from '../../types';
import { X, Image as ImageIcon, Save, Plus, Trash2, Upload, Flame, Sparkles } from 'lucide-react';

const compressAndReadFile = (file: File, maxWidth = 1000, maxHeight = 1000): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const elem = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        elem.width = width;
        elem.height = height;
        const ctx = elem.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        const dataUrl = elem.toDataURL('image/jpeg', 0.82);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

const CATEGORIES: ProductCategory[] = ['Indumentaria', 'Accesorios', 'UV & vinilo', 'Banderas'];

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: any) => void;
  initialProduct?: Product | null;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialProduct
}) => {
  const isEditing = Boolean(initialProduct);

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'Indumentaria' as ProductCategory,
    priceBase: 8500,
    priceCustom: '' as string | number,
    priceWholesale: '' as string | number,
    wholesaleMinUnits: 10,
    stock: 20,
    minQuantity: 1,
    customizable: false,
    isFeatured: false,
    tag: '' as '' | 'Nuevo' | 'Más vendido' | 'Personalizable' | 'Para Equipos',
    offerActive: false,
    offerType: 'discount_percent' as OfferType,
    offerDiscountPercent: 10,
    offerSalePrice: 7650,
    offerBadgeText: '10% OFF',
    shortDescription: '',
    description: '',
    fit: '',
    material: '',
    images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1000&q=80'],
    sizes: ['S', 'M', 'L', 'XL'] as ('S' | 'M' | 'L' | 'XL' | 'XXL' | 'Único')[],
    colors: [
      { name: 'Negro Carbón', hex: '#1C1C1C' },
      { name: 'Rojo Señal', hex: '#C8102E' }
    ] as ProductColor[]
  });

  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#1C1C1C');

  useEffect(() => {
    if (initialProduct) {
      const basePrice = initialProduct.priceBase || initialProduct.price;
      setFormData({
        name: initialProduct.name,
        sku: initialProduct.sku || '',
        category: initialProduct.category,
        priceBase: basePrice,
        priceCustom: initialProduct.priceCustom ?? '',
        priceWholesale: initialProduct.priceWholesale ?? '',
        wholesaleMinUnits: initialProduct.wholesaleMinUnits ?? 10,
        stock: initialProduct.stock ?? 15,
        minQuantity: initialProduct.minQuantity || 1,
        customizable: initialProduct.customizable,
        isFeatured: Boolean(initialProduct.isFeatured),
        tag: initialProduct.tag || '',
        offerActive: Boolean(initialProduct.offer?.active),
        offerType: initialProduct.offer?.type || 'discount_percent',
        offerDiscountPercent: initialProduct.offer?.discountPercent ?? 10,
        offerSalePrice: initialProduct.offer?.salePrice ?? Math.round(basePrice * 0.9),
        offerBadgeText: initialProduct.offer?.badgeText || '10% OFF',
        shortDescription: initialProduct.shortDescription || '',
        description: initialProduct.description || '',
        fit: initialProduct.fit || '',
        material: initialProduct.material || '',
        images: initialProduct.images.length > 0 ? initialProduct.images : [''],
        sizes: initialProduct.sizes || ['Único'],
        colors: initialProduct.colors && initialProduct.colors.length > 0
          ? initialProduct.colors
          : [
              { name: 'Negro Carbón', hex: '#1C1C1C' },
              { name: 'Rojo Señal', hex: '#C8102E' }
            ]
      });
    } else {
      // Default new product values
      setFormData({
        name: '',
        sku: 'IND-NEW-01',
        category: 'Indumentaria',
        priceBase: 8500,
        priceCustom: '',
        priceWholesale: '',
        wholesaleMinUnits: 10,
        stock: 25,
        minQuantity: 1,
        customizable: false,
        isFeatured: false,
        tag: 'Nuevo',
        offerActive: false,
        offerType: 'discount_percent',
        offerDiscountPercent: 10,
        offerSalePrice: 7650,
        offerBadgeText: '10% OFF',
        shortDescription: 'Prenda oficial diseñada para máxima durabilidad y calce urbano.',
        description: 'Confección de alta calidad con terminaciones reforzadas.',
        fit: 'Regular fit',
        material: '100% Algodón peinado 24/1',
        images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80'],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: [
          { name: 'Negro Carbón', hex: '#1C1C1C' },
          { name: 'Rojo Señal', hex: '#C8102E' }
        ]
      });
    }
  }, [initialProduct, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const priceBaseNum = Number(formData.priceBase);
    const priceCustomNum = formData.priceCustom !== '' ? Number(formData.priceCustom) : null;
    const stockNum = Math.max(0, Number(formData.stock));

    // Offer computation
    let finalPrice = priceBaseNum;
    let originalPriceVal: number | undefined = undefined;
    let offerObj: ProductOffer | undefined = undefined;

    if (formData.offerActive) {
      originalPriceVal = priceBaseNum;
      let badge = formData.offerBadgeText || 'OFERTA';

      if (formData.offerType === 'discount_percent') {
        const percent = Math.min(99, Math.max(1, Number(formData.offerDiscountPercent) || 10));
        finalPrice = Math.round(priceBaseNum * (1 - percent / 100));
        badge = `${percent}% OFF`;
      } else if (formData.offerType === 'sale_price') {
        finalPrice = Math.max(0, Number(formData.offerSalePrice) || priceBaseNum);
        badge = 'OFERTA';
      } else if (formData.offerType === '2x1') {
        badge = '2x1 FLASH';
      } else if (formData.offerType === 'free_customization') {
        badge = 'ESTAMPA GRATIS';
      }

      offerObj = {
        active: true,
        type: formData.offerType,
        discountPercent: Number(formData.offerDiscountPercent) || 10,
        salePrice: Number(formData.offerSalePrice) || finalPrice,
        badgeText: badge
      };
    }

    const priceWholesaleNum = formData.priceWholesale !== '' && Number(formData.priceWholesale) > 0
      ? Number(formData.priceWholesale)
      : undefined;
    const wholesaleMinUnitsNum = priceWholesaleNum
      ? Math.max(2, Number(formData.wholesaleMinUnits) || 10)
      : undefined;

    const finalProduct = {
      ...formData,
      price: finalPrice,
      priceBase: priceBaseNum,
      priceCustom: priceCustomNum,
      priceWholesale: priceWholesaleNum,
      wholesaleMinUnits: wholesaleMinUnitsNum,
      originalPrice: originalPriceVal,
      offer: offerObj,
      stock: stockNum,
      minQuantity: Math.max(1, Number(formData.minQuantity)),
      images: formData.images.filter((img) => img.trim() !== ''),
      colors: formData.colors.length > 0 ? formData.colors : [
        { name: 'Negro Carbón', hex: '#1C1C1C' },
        { name: 'Rojo Señal', hex: '#C8102E' }
      ]
    };

    onSave(finalProduct);
    onClose();
  };

  const handleImageUrlChange = (index: number, val: string) => {
    const updated = [...formData.images];
    updated[index] = val;
    setFormData({ ...formData, images: updated });
  };

  const handleImageFileUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await compressAndReadFile(file);
      handleImageUrlChange(index, base64);
    } catch (err) {
      console.error('Error al procesar imagen:', err);
    }
  };

  const handleAddNewImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await compressAndReadFile(file);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images.filter((img) => img.trim() !== ''), base64]
      }));
    } catch (err) {
      console.error('Error al procesar imagen:', err);
    }
  };

  const addImageField = () => {
    setFormData({ ...formData, images: [...formData.images, ''] });
  };

  const removeImageField = (index: number) => {
    if (formData.images.length <= 1) return;
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    });
  };

  const toggleSize = (size: 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'Único') => {
    if (formData.sizes.includes(size)) {
      if (formData.sizes.length > 1) {
        setFormData({ ...formData, sizes: formData.sizes.filter((s) => s !== size) });
      }
    } else {
      setFormData({ ...formData, sizes: [...formData.sizes, size] });
    }
  };

  const handleAddColor = () => {
    const nameTrimmed = newColorName.trim();
    if (!nameTrimmed) return;
    if (formData.colors.some((c) => c.name.toLowerCase() === nameTrimmed.toLowerCase())) return;
    setFormData({
      ...formData,
      colors: [...formData.colors, { name: nameTrimmed, hex: newColorHex }]
    });
    setNewColorName('');
  };

  const handleRemoveColor = (index: number) => {
    if (formData.colors.length <= 1) return;
    setFormData({
      ...formData,
      colors: formData.colors.filter((_, i) => i !== index)
    });
  };

  const handleQuickColorAdd = (name: string, hex: string) => {
    if (formData.colors.some((c) => c.name.toLowerCase() === name.toLowerCase())) return;
    setFormData({
      ...formData,
      colors: [...formData.colors, { name, hex }]
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-3xl bg-[#141414] border border-[#2B2B2B] rounded-[4px] shadow-2xl my-8 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#222] bg-[#111]">
          <div>
            <h2 className="font-display font-extrabold text-xl text-[#F8F7F4] tracking-tight">
              {isEditing ? `Editar: ${initialProduct?.name}` : 'Añadir Nuevo Producto'}
            </h2>
            <p className="text-xs text-[#8E8B84]">
              {isEditing
                ? 'Modificá precios, stock, imágenes y datos de la prenda.'
                : 'Completá los datos para incorporar el artículo al catálogo en vivo.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#999] hover:text-white hover:bg-[#222] rounded-[2px] transition-colors focus-ring"
            aria-label="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs">
          
          {/* Main Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-bold uppercase tracking-wider text-[#C5C2BA] mb-1">
                Nombre del Producto *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="ej: Casaca Titular Rayada"
                className="w-full bg-[#1C1C1C] border border-[#333] focus:border-[#C8102E] rounded-[2px] px-3 py-2.5 text-sm text-[#F8F7F4] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-[#C5C2BA] mb-1">
                Código SKU *
              </label>
              <input
                type="text"
                required
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
                placeholder="ej: IND-CAS-001"
                className="w-full bg-[#1C1C1C] border border-[#333] focus:border-[#C8102E] rounded-[2px] px-3 py-2.5 text-sm font-mono text-[#F8F7F4] focus:outline-none"
              />
            </div>
          </div>

          {/* Category & Tag */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold uppercase tracking-wider text-[#C5C2BA] mb-1">
                Categoría *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                className="w-full bg-[#1C1C1C] border border-[#333] focus:border-[#C8102E] rounded-[2px] px-3 py-2.5 text-sm text-[#F8F7F4] focus:outline-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-[#C5C2BA] mb-1">
                Etiqueta / Badge (Opcional)
              </label>
              <select
                value={formData.tag}
                onChange={(e) => setFormData({ ...formData, tag: e.target.value as any })}
                className="w-full bg-[#1C1C1C] border border-[#333] focus:border-[#C8102E] rounded-[2px] px-3 py-2.5 text-sm text-[#F8F7F4] focus:outline-none"
              >
                <option value="">Sin etiqueta</option>
                <option value="Nuevo">Nuevo</option>
                <option value="Más vendido">Más vendido</option>
                <option value="Personalizable">Personalizable</option>
                <option value="Para Equipos">Para Equipos</option>
              </select>
            </div>
          </div>

          {/* Pricing & Stock Controls */}
          <div className="p-4 bg-[#181818] border border-[#282828] rounded-[2px] space-y-4">
            <h3 className="font-bold uppercase tracking-wider text-[#C8102E] text-[11px]">
              Precios y Control de Inventario
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block font-semibold text-[#BBB] mb-1">Precio Base ($) *</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={formData.priceBase}
                  onChange={(e) => setFormData({ ...formData, priceBase: Number(e.target.value) })}
                  className="w-full bg-[#121212] border border-[#333] focus:border-[#C8102E] rounded-[2px] px-3 py-2 text-sm font-mono text-[#F8F7F4] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#BBB] mb-1">Precio Custom ($)</label>
                <input
                  type="number"
                  min={0}
                  placeholder="Opcional"
                  value={formData.priceCustom}
                  onChange={(e) => setFormData({ ...formData, priceCustom: e.target.value })}
                  className="w-full bg-[#121212] border border-[#333] focus:border-[#C8102E] rounded-[2px] px-3 py-2 text-sm font-mono text-[#F8F7F4] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#BBB] mb-1">Stock Disponible *</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                  className="w-full bg-[#121212] border border-[#333] focus:border-[#C8102E] rounded-[2px] px-3 py-2 text-sm font-mono text-[#F8F7F4] focus:outline-none font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#BBB] mb-1">Pedido Mínimo (u.)</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={formData.minQuantity}
                  onChange={(e) => setFormData({ ...formData, minQuantity: Number(e.target.value) })}
                  className="w-full bg-[#121212] border border-[#333] focus:border-[#C8102E] rounded-[2px] px-3 py-2 text-sm font-mono text-[#F8F7F4] focus:outline-none"
                />
              </div>
            </div>

            {/* Wholesale Pricing Tier */}
            <div className="pt-3 border-t border-[#262626]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37]">
                  Tarifa Mayorista (Venta por Cantidad)
                </span>
                <span className="text-[10px] text-[#888]">Opcional</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#BBB] mb-1">
                    Precio Mayorista por Unidad ($)
                  </label>
                  <input
                    type="number"
                    min={0}
                    placeholder="Ej: 6500 (dejar vacío si no aplica)"
                    value={formData.priceWholesale}
                    onChange={(e) => setFormData({ ...formData, priceWholesale: e.target.value })}
                    className="w-full bg-[#121212] border border-[#333] focus:border-[#D4AF37] rounded-[2px] px-3 py-2 text-sm font-mono text-[#F8F7F4] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#BBB] mb-1">
                    Mínimo de unidades para aplicar mayorista
                  </label>
                  <input
                    type="number"
                    min={2}
                    placeholder="Ej: 10"
                    value={formData.wholesaleMinUnits}
                    onChange={(e) => setFormData({ ...formData, wholesaleMinUnits: Number(e.target.value) })}
                    className="w-full bg-[#121212] border border-[#333] focus:border-[#D4AF37] rounded-[2px] px-3 py-2 text-sm font-mono text-[#F8F7F4] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Toggles */}
            <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-[#222]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.customizable}
                  onChange={(e) => setFormData({ ...formData, customizable: e.target.checked })}
                  className="w-4 h-4 accent-[#C8102E] rounded-[2px]"
                />
                <span className="font-semibold text-[#DDD]">Admite Personalización (Estampas / DTF)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="w-4 h-4 accent-[#C8102E] rounded-[2px]"
                />
                <span className="font-semibold text-[#DDD]">Destacar en Inicio (Hero / Destacados)</span>
              </label>
            </div>
          </div>

          {/* Section: Ofertas y Promociones Especiales */}
          <div className="p-4 bg-[#1A1414] border border-[#3E2020] rounded-[2px] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#C8102E]" />
                <h3 className="font-bold uppercase tracking-wider text-white text-xs">
                  Oferta & Promoción Especial
                </h3>
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-white bg-[#2A1616] px-3 py-1.5 rounded-[2px] border border-[#4E2424] hover:border-[#C8102E] transition-colors">
                <input
                  type="checkbox"
                  checked={formData.offerActive}
                  onChange={(e) => setFormData({ ...formData, offerActive: e.target.checked })}
                  className="w-4 h-4 accent-[#C8102E] rounded cursor-pointer"
                />
                <span>Activar Oferta</span>
              </label>
            </div>

            {formData.offerActive && (
              <div className="space-y-4 pt-2 border-t border-[#331818]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#BBB] mb-1">
                      Tipo de Promoción
                    </label>
                    <select
                      value={formData.offerType}
                      onChange={(e) => setFormData({ ...formData, offerType: e.target.value as OfferType })}
                      className="w-full bg-[#121212] border border-[#444] focus:border-[#C8102E] rounded-[2px] px-3 py-2 text-xs text-white focus:outline-none"
                    >
                      <option value="discount_percent">Porcentaje de Descuento (ej: 10% OFF)</option>
                      <option value="2x1">Promoción 2x1 Flash</option>
                      <option value="free_customization">Personalización GRATIS (Estampa sin cargo)</option>
                      <option value="sale_price">Precio Rebajado Fijo</option>
                      <option value="custom_badge">Etiqueta Personalizada</option>
                    </select>
                  </div>

                  {formData.offerType === 'discount_percent' && (
                    <div>
                      <label className="block text-xs font-semibold text-[#BBB] mb-1">
                        Porcentaje a Descontar (%)
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={99}
                        value={formData.offerDiscountPercent}
                        onChange={(e) => setFormData({ ...formData, offerDiscountPercent: Number(e.target.value) })}
                        className="w-full bg-[#121212] border border-[#444] focus:border-[#C8102E] rounded-[2px] px-3 py-2 text-xs text-white focus:outline-none font-bold text-[#C8102E]"
                      />
                    </div>
                  )}

                  {formData.offerType === 'sale_price' && (
                    <div>
                      <label className="block text-xs font-semibold text-[#BBB] mb-1">
                        Precio Rebajado Final ($)
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={formData.offerSalePrice}
                        onChange={(e) => setFormData({ ...formData, offerSalePrice: Number(e.target.value) })}
                        className="w-full bg-[#121212] border border-[#444] focus:border-[#C8102E] rounded-[2px] px-3 py-2 text-xs text-white focus:outline-none font-bold text-[#C8102E]"
                      />
                    </div>
                  )}

                  {(formData.offerType === '2x1' || formData.offerType === 'free_customization' || formData.offerType === 'custom_badge') && (
                    <div>
                      <label className="block text-xs font-semibold text-[#BBB] mb-1">
                        Texto del Badge / Distintivo
                      </label>
                      <input
                        type="text"
                        value={formData.offerBadgeText}
                        onChange={(e) => setFormData({ ...formData, offerBadgeText: e.target.value })}
                        placeholder="ej: 2x1 FLASH, PERSONALIZACIÓN GRATIS"
                        className="w-full bg-[#121212] border border-[#444] focus:border-[#C8102E] rounded-[2px] px-3 py-2 text-xs text-white focus:outline-none"
                      />
                    </div>
                  )}
                </div>

                {/* Live Preview Box */}
                <div className="p-3 bg-[#121212] border border-[#333] rounded-[2px] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[#888]">Vista previa cliente:</span>
                    <span className="line-through text-[#777]">${Number(formData.priceBase).toLocaleString('es-AR')}</span>
                    <span className="font-bold text-[#F8F7F4]">
                      ${formData.offerType === 'discount_percent'
                        ? Math.round(Number(formData.priceBase) * (1 - (Number(formData.offerDiscountPercent) || 0) / 100)).toLocaleString('es-AR')
                        : formData.offerType === 'sale_price'
                        ? Number(formData.offerSalePrice).toLocaleString('es-AR')
                        : Number(formData.priceBase).toLocaleString('es-AR')}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 bg-[#C8102E] text-white font-bold text-[10px] uppercase rounded-[2px]">
                    {formData.offerType === 'discount_percent'
                      ? `${formData.offerDiscountPercent}% OFF`
                      : formData.offerType === '2x1'
                      ? '2x1 FLASH'
                      : formData.offerType === 'free_customization'
                      ? 'ESTAMPA GRATIS'
                      : formData.offerBadgeText || 'OFERTA'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Descriptions */}
          <div className="space-y-3">
            <div>
              <label className="block font-bold uppercase tracking-wider text-[#C5C2BA] mb-1">
                Descripción Corta (Vista en Tarjeta)
              </label>
              <input
                type="text"
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                placeholder="Breve resumen de 1 línea"
                className="w-full bg-[#1C1C1C] border border-[#333] focus:border-[#C8102E] rounded-[2px] px-3 py-2 text-sm text-[#F8F7F4] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-[#C5C2BA] mb-1">
                Descripción Detallada (Ficha de Producto)
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detalle completo de materiales, usos y calce."
                className="w-full bg-[#1C1C1C] border border-[#333] focus:border-[#C8102E] rounded-[2px] px-3 py-2 text-sm text-[#F8F7F4] focus:outline-none"
              />
            </div>
          </div>

          {/* Sizes */}
          <div>
            <label className="block font-bold uppercase tracking-wider text-[#C5C2BA] mb-2">
              Talles Disponibles
            </label>
            <div className="flex flex-wrap gap-2">
              {(['S', 'M', 'L', 'XL', 'XXL', 'Único'] as const).map((s) => {
                const isSelected = formData.sizes.includes(s);
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleSize(s)}
                    className={`px-3.5 py-1.5 rounded-[2px] font-mono font-bold text-xs uppercase transition-colors cursor-pointer border ${
                      isSelected
                        ? 'bg-[#C8102E] border-[#C8102E] text-white'
                        : 'bg-[#1C1C1C] border-[#333] text-[#888] hover:text-white'
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Colors Management Section */}
          <div className="p-4 bg-[#181818] border border-[#2A2A2A] rounded-[2px] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="block font-bold uppercase tracking-wider text-[#C5C2BA] text-xs">
                  Colores Ofrecidos para este Producto
                </label>
                <p className="text-[11px] text-[#888] mt-0.5">
                  El cliente podrá seleccionar entre estos colores al comprar.
                </p>
              </div>
              <span className="text-[11px] font-mono text-[#AAA]">
                {formData.colors.length} {formData.colors.length === 1 ? 'color' : 'colores'}
              </span>
            </div>

            {/* Current colors list */}
            <div className="flex flex-wrap gap-2.5">
              {formData.colors.map((c, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 px-3 py-1.5 bg-[#121212] border border-[#333] rounded-[2px] text-xs"
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-[#555] shrink-0"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span className="text-white font-medium">{c.name}</span>
                  <span className="text-[10px] text-[#666] font-mono">{c.hex}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveColor(idx)}
                    className="ml-1 text-[#666] hover:text-[#C8102E] transition-colors cursor-pointer"
                    title="Quitar color"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Quick add common colors */}
            <div className="space-y-1.5 pt-2 border-t border-[#262626]">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#777]">
                Paleta Rápida (Clic para añadir):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { name: 'Negro Carbón', hex: '#1C1C1C' },
                  { name: 'Blanco Puro', hex: '#FFFFFF' },
                  { name: 'Rojo Señal', hex: '#C8102E' },
                  { name: 'Azul Marino', hex: '#0B1B3D' },
                  { name: 'Azul Francia', hex: '#0047AB' },
                  { name: 'Gris Melange', hex: '#8C8C8C' },
                  { name: 'Verde Militar', hex: '#3E4F3E' },
                  { name: 'Amarillo', hex: '#FFD700' },
                  { name: 'Bordó', hex: '#58111A' },
                  { name: 'Rosa Pastel', hex: '#E8A598' }
                ].map((preset) => {
                  const alreadyAdded = formData.colors.some((c) => c.name.toLowerCase() === preset.name.toLowerCase());
                  return (
                    <button
                      key={preset.name}
                      type="button"
                      disabled={alreadyAdded}
                      onClick={() => handleQuickColorAdd(preset.name, preset.hex)}
                      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-[2px] border text-[11px] transition-colors cursor-pointer ${
                        alreadyAdded
                          ? 'border-[#222] bg-[#141414] text-[#555] opacity-50 cursor-not-allowed'
                          : 'border-[#333] bg-[#181818] text-[#CCC] hover:border-[#666] hover:text-white'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full border border-[#444]" style={{ backgroundColor: preset.hex }} />
                      <span>{preset.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom color adder */}
            <div className="pt-2 border-t border-[#262626]">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#777] block mb-2">
                O crear color personalizado:
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                <input
                  type="text"
                  placeholder="Nombre (ej: Verde Flúor)"
                  value={newColorName}
                  onChange={(e) => setNewColorName(e.target.value)}
                  className="bg-[#121212] border border-[#333] focus:border-[#C8102E] rounded-[2px] px-3 py-1.5 text-xs text-white focus:outline-none flex-1 min-w-[150px]"
                />
                <div className="flex items-center gap-1.5 bg-[#121212] border border-[#333] px-2 py-1 rounded-[2px]">
                  <input
                    type="color"
                    value={newColorHex}
                    onChange={(e) => setNewColorHex(e.target.value)}
                    className="w-6 h-6 border-0 bg-transparent cursor-pointer rounded"
                  />
                  <span className="text-[11px] font-mono text-[#AAA]">{newColorHex}</span>
                </div>
                <button
                  type="button"
                  onClick={handleAddColor}
                  disabled={!newColorName.trim()}
                  className="px-3.5 py-1.5 bg-[#252525] hover:bg-[#333] border border-[#444] text-white text-xs font-semibold rounded-[2px] transition-colors cursor-pointer disabled:opacity-40"
                >
                  + Agregar Color
                </button>
              </div>
            </div>
          </div>

          {/* Images Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-bold uppercase tracking-wider text-[#C5C2BA]">
                Fotografías del Producto
              </label>
              <div className="flex items-center gap-3">
                <label className="text-xs text-[#C8102E] hover:text-[#E01837] font-semibold flex items-center gap-1.5 cursor-pointer bg-[#C8102E]/10 hover:bg-[#C8102E]/20 px-2.5 py-1 rounded-[2px] transition-colors border border-[#C8102E]/30">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Subir foto desde PC</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAddNewImageUpload}
                  />
                </label>
                <button
                  type="button"
                  onClick={addImageField}
                  className="text-xs text-[#888] hover:text-white font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Pegar URL</span>
                </button>
              </div>
            </div>

            {formData.images.map((imgUrl, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-[2px] bg-[#1C1C1C] border border-[#333] overflow-hidden shrink-0 flex items-center justify-center">
                  {imgUrl ? (
                    <img src={imgUrl} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-4 h-4 text-[#555]" />
                  )}
                </div>
                <input
                  type="text"
                  required={i === 0}
                  value={imgUrl}
                  onChange={(e) => handleImageUrlChange(i, e.target.value)}
                  placeholder="Pega enlace de imagen o presiona Subir foto"
                  className="flex-1 bg-[#1C1C1C] border border-[#333] focus:border-[#C8102E] rounded-[2px] px-3 py-2 text-xs text-[#F8F7F4] focus:outline-none"
                />
                <label
                  className="px-2.5 py-2 bg-[#252525] hover:bg-[#333] border border-[#444] text-[#DDD] text-xs font-semibold rounded-[2px] cursor-pointer flex items-center gap-1.5 shrink-0"
                  title="Subir foto desde PC o Celular"
                >
                  <Upload className="w-3.5 h-3.5 text-[#C8102E]" />
                  <span className="hidden sm:inline">Subir foto</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageFileUpload(i, e)}
                  />
                </label>
                {formData.images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImageField(i)}
                    className="p-2 text-[#777] hover:text-[#FF6666] transition-colors cursor-pointer shrink-0"
                    title="Eliminar foto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Footer Controls */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#222]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-[#222] hover:bg-[#2A2A2A] text-[#DDD] font-semibold rounded-[2px] transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#C8102E] hover:bg-[#E01837] text-white font-display font-bold uppercase tracking-wider rounded-[2px] transition-colors flex items-center gap-2 shadow-lg shadow-[#C8102E]/20 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isEditing ? 'Guardar Cambios' : 'Crear Producto'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
