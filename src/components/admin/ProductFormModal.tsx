import React, { useState, useEffect } from 'react';
import { Product, ProductCategory } from '../../types';
import { X, Image as ImageIcon, Save, Plus, Trash2 } from 'lucide-react';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: any) => void;
  initialProduct?: Product | null;
}

const CATEGORIES: ProductCategory[] = ['Indumentaria', 'Accesorios', 'UV & vinilo', 'Banderas'];

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
    stock: 20,
    minQuantity: 1,
    customizable: false,
    isFeatured: false,
    tag: '' as '' | 'Nuevo' | 'Más vendido' | 'Personalizable' | 'Para Equipos',
    shortDescription: '',
    description: '',
    fit: '',
    material: '',
    images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1000&q=80'],
    sizes: ['S', 'M', 'L', 'XL'] as ('S' | 'M' | 'L' | 'XL' | 'XXL' | 'Único')[]
  });

  useEffect(() => {
    if (initialProduct) {
      setFormData({
        name: initialProduct.name,
        sku: initialProduct.sku || '',
        category: initialProduct.category,
        priceBase: initialProduct.priceBase || initialProduct.price,
        priceCustom: initialProduct.priceCustom ?? '',
        stock: initialProduct.stock ?? 15,
        minQuantity: initialProduct.minQuantity || 1,
        customizable: initialProduct.customizable,
        isFeatured: Boolean(initialProduct.isFeatured),
        tag: initialProduct.tag || '',
        shortDescription: initialProduct.shortDescription || '',
        description: initialProduct.description || '',
        fit: initialProduct.fit || '',
        material: initialProduct.material || '',
        images: initialProduct.images.length > 0 ? initialProduct.images : [''],
        sizes: initialProduct.sizes || ['Único']
      });
    } else {
      // Default new product values
      setFormData({
        name: '',
        sku: 'IND-NEW-01',
        category: 'Indumentaria',
        priceBase: 8500,
        priceCustom: '',
        stock: 25,
        minQuantity: 1,
        customizable: false,
        isFeatured: false,
        tag: 'Nuevo',
        shortDescription: 'Prenda oficial diseñada para máxima durabilidad y calce urbano.',
        description: 'Confección de alta calidad con terminaciones reforzadas.',
        fit: 'Regular fit',
        material: '100% Algodón peinado 24/1',
        images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80'],
        sizes: ['S', 'M', 'L', 'XL']
      });
    }
  }, [initialProduct, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const priceBaseNum = Number(formData.priceBase);
    const priceCustomNum = formData.priceCustom !== '' ? Number(formData.priceCustom) : null;
    const stockNum = Math.max(0, Number(formData.stock));

    const finalProduct = {
      ...formData,
      price: priceBaseNum,
      priceBase: priceBaseNum,
      priceCustom: priceCustomNum,
      stock: stockNum,
      minQuantity: Math.max(1, Number(formData.minQuantity)),
      images: formData.images.filter((img) => img.trim() !== ''),
      colors: initialProduct?.colors || [
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

          {/* Images Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-bold uppercase tracking-wider text-[#C5C2BA]">
                Fotografías del Producto (URLs)
              </label>
              <button
                type="button"
                onClick={addImageField}
                className="text-xs text-[#C8102E] hover:text-[#E01837] font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Agregar otra foto</span>
              </button>
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
                  type="url"
                  required={i === 0}
                  value={imgUrl}
                  onChange={(e) => handleImageUrlChange(i, e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 bg-[#1C1C1C] border border-[#333] focus:border-[#C8102E] rounded-[2px] px-3 py-2 text-xs text-[#F8F7F4] focus:outline-none"
                />
                {formData.images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImageField(i)}
                    className="p-2 text-[#777] hover:text-[#FF6666] transition-colors cursor-pointer"
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
