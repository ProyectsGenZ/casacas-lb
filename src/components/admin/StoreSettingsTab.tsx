import React, { useState } from 'react';
import { useStoreSettings } from '../../context/StoreSettingsContext';
import { useUI } from '../../context/UIContext';
import { SiteSettings, CategoryConfig } from '../../types/settings';
import {
  Store,
  Layers,
  Phone,
  Truck,
  Save,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle,
  HelpCircle,
  Image as ImageIcon
} from 'lucide-react';

export const StoreSettingsTab: React.FC = () => {
  const { settings, updateSettings } = useStoreSettings();
  const { showToast } = useUI();

  const [formData, setFormData] = useState<SiteSettings>(settings);
  const [activeSection, setActiveSection] = useState<'identity' | 'categories' | 'contact' | 'shipping'>('identity');
  const [isSaving, setIsSaving] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Handle nested changes
  const handleInputChange = (field: keyof SiteSettings, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (parent: keyof SiteSettings, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...(prev[parent] as any),
        [field]: value
      }
    }));
  };

  // Category toggle on/off
  const handleCategoryToggle = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.map((cat) =>
        cat.id === id ? { ...cat, enabled: !cat.enabled } : cat
      )
    }));
  };

  // Add new category
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    const slug = newCategoryName.trim();
    const newCat: CategoryConfig = {
      id: `cat-${Date.now()}`,
      name: newCategoryName.trim(),
      slug: slug,
      enabled: true,
      description: `Productos y artículos de la categoría ${newCategoryName}.`,
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=80'
    };

    setFormData((prev) => ({
      ...prev,
      categories: [...prev.categories, newCat]
    }));
    setNewCategoryName('');
    showToast(`Categoría "${newCat.name}" agregada. Recuerda guardar cambios.`, 'info');
  };

  // Delete category
  const handleDeleteCategory = (id: string, name: string) => {
    if (window.confirm(`¿Estás seguro de eliminar la categoría "${name}"?`)) {
      setFormData((prev) => ({
        ...prev,
        categories: prev.categories.filter((c) => c.id !== id)
      }));
      showToast(`Categoría "${name}" removida. Guarda cambios para aplicar.`, 'info');
    }
  };

  // Save all settings to Firebase
  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      await updateSettings(formData);
      showToast('¡Configuración de la tienda guardada con éxito en Firebase!', 'success');
    } catch (e) {
      console.error(e);
      showToast('Error al guardar en la nube. Revisa tu conexión.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header & Save Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-[#141414] border border-[#222] rounded-[4px]">
        <div>
          <h2 className="text-xl font-display font-extrabold uppercase tracking-wide text-white flex items-center gap-2">
            <Store className="w-5 h-5 text-[#C8102E]" />
            Personalización de la Tienda (CMS)
          </h2>
          <p className="text-xs text-[#9E9D99] mt-1">
            Modifica textos, el nombre de la tienda, banners, oculta o activa categorías y datos de contacto sin tocar código.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          disabled={isSaving}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#C8102E] hover:bg-[#A00C24] text-white font-bold text-xs uppercase tracking-wider rounded-[2px] transition-all duration-150 active:scale-95 shadow-lg shadow-[#C8102E]/20 focus-ring cursor-pointer"
        >
          {isSaving ? (
            <span>Guardando en la nube...</span>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Guardar Cambios</span>
            </>
          )}
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-[#222] overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveSection('identity')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-t-[2px] transition-colors whitespace-nowrap flex items-center gap-2 border-b-2 ${
            activeSection === 'identity'
              ? 'border-[#C8102E] text-white bg-[#181818]'
              : 'border-transparent text-[#888] hover:text-white hover:bg-[#141414]'
          }`}
        >
          <Store className="w-4 h-4 text-[#C8102E]" />
          <span>Identidad y Portada</span>
        </button>

        <button
          onClick={() => setActiveSection('categories')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-t-[2px] transition-colors whitespace-nowrap flex items-center gap-2 border-b-2 ${
            activeSection === 'categories'
              ? 'border-[#C8102E] text-white bg-[#181818]'
              : 'border-transparent text-[#888] hover:text-white hover:bg-[#141414]'
          }`}
        >
          <Layers className="w-4 h-4 text-[#C8102E]" />
          <span>Categorías y Botones</span>
        </button>

        <button
          onClick={() => setActiveSection('contact')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-t-[2px] transition-colors whitespace-nowrap flex items-center gap-2 border-b-2 ${
            activeSection === 'contact'
              ? 'border-[#C8102E] text-white bg-[#181818]'
              : 'border-transparent text-[#888] hover:text-white hover:bg-[#141414]'
          }`}
        >
          <Phone className="w-4 h-4 text-[#C8102E]" />
          <span>WhatsApp y Redes</span>
        </button>

        <button
          onClick={() => setActiveSection('shipping')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-t-[2px] transition-colors whitespace-nowrap flex items-center gap-2 border-b-2 ${
            activeSection === 'shipping'
              ? 'border-[#C8102E] text-white bg-[#181818]'
              : 'border-transparent text-[#888] hover:text-white hover:bg-[#141414]'
          }`}
        >
          <Truck className="w-4 h-4 text-[#C8102E]" />
          <span>Envíos y Promociones</span>
        </button>
      </div>

      {/* Tab 1: Identidad y Portada */}
      {activeSection === 'identity' && (
        <div className="space-y-6">
          <div className="p-6 bg-[#121212] border border-[#222] rounded-[4px] space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-[#222] pb-3">
              Datos de la Marca
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#BBB] mb-1">
                  Nombre de la Tienda
                </label>
                <input
                  type="text"
                  value={formData.brandName}
                  onChange={(e) => handleInputChange('brandName', e.target.value)}
                  className="w-full bg-[#181818] border border-[#333] rounded-[2px] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#C8102E]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#BBB] mb-1">
                  Eslogan / Tagline
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => handleInputChange('tagline', e.target.value)}
                  className="w-full bg-[#181818] border border-[#333] rounded-[2px] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#C8102E]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#BBB] mb-1">
                  URL del Logo Oficial (imagen o svg)
                </label>
                <input
                  type="text"
                  value={formData.logoUrl}
                  onChange={(e) => handleInputChange('logoUrl', e.target.value)}
                  className="w-full bg-[#181818] border border-[#333] rounded-[2px] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#C8102E]"
                />
                <p className="text-[11px] text-[#777] mt-1">
                  Por defecto usa <code>/media/logo-casacas-oficial.png</code>. Puedes pegar cualquier URL pública de imagen.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-[#121212] border border-[#222] rounded-[4px] space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-[#222] pb-3">
              Portada Principal (Hero)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#BBB] mb-1">
                  Etiqueta Superior (Badge)
                </label>
                <input
                  type="text"
                  value={formData.hero.badge}
                  onChange={(e) => handleNestedChange('hero', 'badge', e.target.value)}
                  className="w-full bg-[#181818] border border-[#333] rounded-[2px] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#C8102E]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#BBB] mb-1">
                  Texto Botón Principal
                </label>
                <input
                  type="text"
                  value={formData.hero.primaryCtaText}
                  onChange={(e) => handleNestedChange('hero', 'primaryCtaText', e.target.value)}
                  className="w-full bg-[#181818] border border-[#333] rounded-[2px] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#C8102E]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#BBB] mb-1">
                  Título Grande
                </label>
                <input
                  type="text"
                  value={formData.hero.title}
                  onChange={(e) => handleNestedChange('hero', 'title', e.target.value)}
                  className="w-full bg-[#181818] border border-[#333] rounded-[2px] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#C8102E]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#BBB] mb-1">
                  Palabra Destacada (en rojo subrayado)
                </label>
                <input
                  type="text"
                  value={formData.hero.highlightWord}
                  onChange={(e) => handleNestedChange('hero', 'highlightWord', e.target.value)}
                  className="w-full bg-[#181818] border border-[#333] rounded-[2px] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#C8102E]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#BBB] mb-1">
                  Subtítulo / Bajada
                </label>
                <textarea
                  rows={2}
                  value={formData.hero.subtitle}
                  onChange={(e) => handleNestedChange('hero', 'subtitle', e.target.value)}
                  className="w-full bg-[#181818] border border-[#333] rounded-[2px] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#C8102E]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#BBB] mb-1">
                  URL Imagen de Fondo de Portada
                </label>
                <input
                  type="text"
                  value={formData.hero.bgImage}
                  onChange={(e) => handleNestedChange('hero', 'bgImage', e.target.value)}
                  className="w-full bg-[#181818] border border-[#333] rounded-[2px] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#C8102E]"
                />
              </div>
            </div>
          </div>

          <div className="p-6 bg-[#121212] border border-[#222] rounded-[4px] space-y-4">
            <div className="flex items-center justify-between border-b border-[#222] pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                Barra de Anuncios Superior
              </h3>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#BBB]">
                <input
                  type="checkbox"
                  checked={formData.announcement.enabled}
                  onChange={(e) => handleNestedChange('announcement', 'enabled', e.target.checked)}
                  className="w-4 h-4 accent-[#C8102E] rounded cursor-pointer"
                />
                <span>Mostrar barra</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#BBB] mb-1">
                  Etiqueta Roja (ej: RETIRO EN LOCAL)
                </label>
                <input
                  type="text"
                  value={formData.announcement.badge}
                  onChange={(e) => handleNestedChange('announcement', 'badge', e.target.value)}
                  className="w-full bg-[#181818] border border-[#333] rounded-[2px] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#C8102E]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#BBB] mb-1">
                  Texto del Anuncio
                </label>
                <input
                  type="text"
                  value={formData.announcement.text}
                  onChange={(e) => handleNestedChange('announcement', 'text', e.target.value)}
                  className="w-full bg-[#181818] border border-[#333] rounded-[2px] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#C8102E]"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Categorías y Botones */}
      {activeSection === 'categories' && (
        <div className="space-y-6">
          <div className="p-6 bg-[#121212] border border-[#222] rounded-[4px] space-y-4">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                Gestión de Categorías del Catálogo y Menú
              </h3>
              <p className="text-xs text-[#888] mt-1">
                Aquí puedes apagar una categoría (por ejemplo, si dejas de vender vinilos, apagas su interruptor y desaparecerá del menú, de los filtros y de la portada).
              </p>
            </div>

            {/* Categories List */}
            <div className="space-y-3 pt-2">
              {formData.categories.map((cat) => (
                <div
                  key={cat.id}
                  className={`p-4 rounded-[4px] border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                    cat.enabled
                      ? 'bg-[#181818] border-[#333]'
                      : 'bg-[#101010] border-[#222] opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleCategoryToggle(cat.id)}
                      className={`p-2 rounded-[2px] cursor-pointer transition-colors ${
                        cat.enabled
                          ? 'bg-[#C8102E]/20 text-[#C8102E] hover:bg-[#C8102E]/30'
                          : 'bg-[#222] text-[#666] hover:bg-[#333]'
                      }`}
                      title={cat.enabled ? 'Categoría activa (clic para desactivar)' : 'Categoría oculta (clic para activar)'}
                    >
                      {cat.enabled ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{cat.name}</span>
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-[2px] ${
                            cat.enabled
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-[#222] text-[#888]'
                          }`}
                        >
                          {cat.enabled ? 'Visible en tienda' : 'Oculto'}
                        </span>
                      </div>
                      <p className="text-xs text-[#888] mt-0.5">{cat.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => handleCategoryToggle(cat.id)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-[2px] border cursor-pointer ${
                        cat.enabled
                          ? 'border-[#444] text-[#DDD] hover:bg-[#252525]'
                          : 'border-[#C8102E] text-[#C8102E] hover:bg-[#C8102E]/10'
                      }`}
                    >
                      {cat.enabled ? 'Desactivar botón' : 'Activar botón'}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(cat.id, cat.name)}
                      className="p-1.5 text-[#666] hover:text-[#C8102E] transition-colors cursor-pointer"
                      title="Eliminar categoría"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add new category inline */}
            <form onSubmit={handleAddCategory} className="pt-4 border-t border-[#222] flex gap-3">
              <input
                type="text"
                placeholder="Nombre de nueva categoría (ej: Camperas, Banderas...)"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="flex-1 bg-[#181818] border border-[#333] rounded-[2px] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#C8102E]"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#222] hover:bg-[#333] border border-[#444] text-white text-xs font-bold uppercase rounded-[2px] cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#C8102E]" />
                <span>Agregar</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tab 3: Contacto, WhatsApp y Redes */}
      {activeSection === 'contact' && (
        <div className="space-y-6">
          <div className="p-6 bg-[#121212] border border-[#222] rounded-[4px] space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-[#222] pb-3">
              WhatsApp para Pedidos
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#BBB] mb-1">
                  Número con código de país (ej: 5493735549290)
                </label>
                <input
                  type="text"
                  value={formData.contact.whatsapp}
                  onChange={(e) => handleNestedChange('contact', 'whatsapp', e.target.value)}
                  className="w-full bg-[#181818] border border-[#333] rounded-[2px] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#C8102E]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#BBB] mb-1">
                  Número Formateado Visual (ej: +54 9 3735 549290)
                </label>
                <input
                  type="text"
                  value={formData.contact.whatsappFormatted}
                  onChange={(e) => handleNestedChange('contact', 'whatsappFormatted', e.target.value)}
                  className="w-full bg-[#181818] border border-[#333] rounded-[2px] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#C8102E]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#BBB] mb-1">
                  Mensaje predeterminado de consulta en WhatsApp
                </label>
                <input
                  type="text"
                  value={formData.contact.whatsappMessage}
                  onChange={(e) => handleNestedChange('contact', 'whatsappMessage', e.target.value)}
                  className="w-full bg-[#181818] border border-[#333] rounded-[2px] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#C8102E]"
                />
              </div>
            </div>
          </div>

          <div className="p-6 bg-[#121212] border border-[#222] rounded-[4px] space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-[#222] pb-3">
              Ubicación y Redes Sociales
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#BBB] mb-1">
                  Dirección del Local
                </label>
                <input
                  type="text"
                  value={formData.contact.address}
                  onChange={(e) => handleNestedChange('contact', 'address', e.target.value)}
                  className="w-full bg-[#181818] border border-[#333] rounded-[2px] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#C8102E]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#BBB] mb-1">
                  Detalle / Entre calles
                </label>
                <input
                  type="text"
                  value={formData.contact.addressDetail}
                  onChange={(e) => handleNestedChange('contact', 'addressDetail', e.target.value)}
                  className="w-full bg-[#181818] border border-[#333] rounded-[2px] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#C8102E]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#BBB] mb-1">
                  Usuario de Instagram (ej: @casacaslb)
                </label>
                <input
                  type="text"
                  value={formData.contact.instagramHandle}
                  onChange={(e) => handleNestedChange('contact', 'instagramHandle', e.target.value)}
                  className="w-full bg-[#181818] border border-[#333] rounded-[2px] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#C8102E]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#BBB] mb-1">
                  Enlace a Instagram
                </label>
                <input
                  type="text"
                  value={formData.contact.instagram}
                  onChange={(e) => handleNestedChange('contact', 'instagram', e.target.value)}
                  className="w-full bg-[#181818] border border-[#333] rounded-[2px] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#C8102E]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#BBB] mb-1">
                  Enlace a TikTok
                </label>
                <input
                  type="text"
                  value={formData.contact.tiktok}
                  onChange={(e) => handleNestedChange('contact', 'tiktok', e.target.value)}
                  className="w-full bg-[#181818] border border-[#333] rounded-[2px] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#C8102E]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#BBB] mb-1">
                  Horarios de Atención
                </label>
                <input
                  type="text"
                  value={formData.contact.hours}
                  onChange={(e) => handleNestedChange('contact', 'hours', e.target.value)}
                  className="w-full bg-[#181818] border border-[#333] rounded-[2px] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#C8102E]"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Envíos y Promociones */}
      {activeSection === 'shipping' && (
        <div className="space-y-6">
          <div className="p-6 bg-[#121212] border border-[#222] rounded-[4px] space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-[#222] pb-3">
              Costos y Reglas de Envío
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#BBB] mb-1">
                  Monto Mínimo Envío Gratis (ARS)
                </label>
                <input
                  type="number"
                  value={formData.shipping.freeShippingThreshold}
                  onChange={(e) => handleNestedChange('shipping', 'freeShippingThreshold', Number(e.target.value))}
                  className="w-full bg-[#181818] border border-[#333] rounded-[2px] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#C8102E]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#BBB] mb-1">
                  Costo de Envío Estándar (ARS)
                </label>
                <input
                  type="number"
                  value={formData.shipping.standardShippingCost}
                  onChange={(e) => handleNestedChange('shipping', 'standardShippingCost', Number(e.target.value))}
                  className="w-full bg-[#181818] border border-[#333] rounded-[2px] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#C8102E]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#BBB] mb-1">
                  Cantidad de Cuotas sin Interés
                </label>
                <input
                  type="number"
                  value={formData.shipping.installmentsCount}
                  onChange={(e) => handleNestedChange('shipping', 'installmentsCount', Number(e.target.value))}
                  className="w-full bg-[#181818] border border-[#333] rounded-[2px] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#C8102E]"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom Bar for Quick Save */}
      <div className="sticky bottom-4 z-30 p-4 bg-[#181818]/95 backdrop-blur-md border border-[#333] rounded-[4px] shadow-2xl flex items-center justify-between">
        <span className="text-xs text-[#AAA] hidden sm:inline">
          Los cambios se sincronizan en tiempo real en <b>Firebase Firestore</b> al hacer clic en guardar.
        </span>
        <button
          onClick={handleSaveAll}
          disabled={isSaving}
          className="ml-auto inline-flex items-center gap-2 px-6 py-2.5 bg-[#C8102E] hover:bg-[#A00C24] text-white font-bold text-xs uppercase tracking-wider rounded-[2px] shadow-lg transition-transform active:scale-95 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Guardando...' : 'Guardar Cambios'}</span>
        </button>
      </div>
    </div>
  );
};
