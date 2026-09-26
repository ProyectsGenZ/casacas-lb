import React, { useState } from 'react';
import { useStoreSettings } from '../../context/StoreSettingsContext';
import { useUI } from '../../context/UIContext';
import { SiteSettings, CategoryConfig, HeroSlideConfig } from '../../types/settings';
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
  Upload,
  Image as ImageIcon,
  Sparkles,
  ChevronRight
} from 'lucide-react';

const compressAndReadFile = (file: File, maxWidth = 1200, maxHeight = 1200): Promise<string> => {
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
        const dataUrl = elem.toDataURL('image/jpeg', 0.85);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

export const StoreSettingsTab: React.FC = () => {
  const { settings, updateSettings } = useStoreSettings();
  const { showToast } = useUI();

  const [formData, setFormData] = useState<SiteSettings>(settings);
  const [activeSection, setActiveSection] = useState<'identity' | 'hero' | 'categories' | 'contact' | 'shipping'>('identity');
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Handle general changes
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

  // Upload file helper
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      showToast('Procesando imagen...', 'info');
      const base64Url = await compressAndReadFile(file);
      callback(base64Url);
      showToast('Imagen cargada con éxito. Recuerda guardar cambios.', 'success');
    } catch (err) {
      console.error(err);
      showToast('Error al procesar el archivo de imagen.', 'error');
    }
  };

  // Hero Slide management
  const handleSlideChange = (index: number, field: keyof HeroSlideConfig, value: string) => {
    setFormData((prev) => {
      const slides = [...(prev.hero?.slides || [])];
      if (slides[index]) {
        slides[index] = { ...slides[index], [field]: value };
      }
      return {
        ...prev,
        hero: {
          ...prev.hero,
          slides
        }
      };
    });
  };

  // Category management
  const handleCategoryFieldChange = (id: string, field: keyof CategoryConfig, value: any) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.map((c) =>
        c.id === id ? { ...c, [field]: value } : c
      )
    }));
  };

  const handleCategoryToggle = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.map((cat) =>
        cat.id === id ? { ...cat, enabled: !cat.enabled } : cat
      )
    }));
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    const slug = newCategoryName.trim();
    const newCat: CategoryConfig = {
      id: `cat-${Date.now()}`,
      name: newCategoryName.trim(),
      slug: slug,
      enabled: true,
      description: `Productos y prendas de ${newCategoryName}.`,
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=80'
    };

    setFormData((prev) => ({
      ...prev,
      categories: [...prev.categories, newCat]
    }));
    setNewCategoryName('');
    showToast(`Categoría "${newCat.name}" agregada. Recuerda guardar cambios.`, 'info');
  };

  const handleDeleteCategory = (id: string, name: string) => {
    if (window.confirm(`¿Estás seguro de eliminar la categoría "${name}"?`)) {
      setFormData((prev) => ({
        ...prev,
        categories: prev.categories.filter((c) => c.id !== id)
      }));
      showToast(`Categoría "${name}" eliminada. Guarda cambios para aplicar.`, 'info');
    }
  };

  // Save all settings to Firebase
  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      await updateSettings(formData);
      showToast('¡Configuración guardada en Firebase y actualizada en vivo!', 'success');
    } catch (e) {
      console.error(e);
      showToast('Error al guardar en la nube. Revisa tu conexión.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const currentSlides = formData.hero?.slides || [];

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
            Modifica textos, las fotos de los 3 banners de portada, fotos de categorías y datos de contacto sin tocar código.
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
          <span>Identidad & Anuncios</span>
        </button>

        <button
          onClick={() => setActiveSection('hero')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-t-[2px] transition-colors whitespace-nowrap flex items-center gap-2 border-b-2 ${
            activeSection === 'hero'
              ? 'border-[#C8102E] text-white bg-[#181818]'
              : 'border-transparent text-[#888] hover:text-white hover:bg-[#141414]'
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#C8102E]" />
          <span>Portada Principal ({currentSlides.length} Banners)</span>
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
          <span>Categorías & Fotos</span>
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
          <span>Envíos y Promos</span>
        </button>
      </div>

      {/* Tab 1: Identidad y Anuncios */}
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
                  Logo Oficial de la Marca
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-16 h-16 bg-[#181818] border border-[#333] rounded-[2px] flex items-center justify-center p-2 shrink-0 overflow-hidden">
                    <img
                      src={formData.logoUrl || '/media/logo-casacas-oficial.png'}
                      alt="Logo preview"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="flex-1 w-full space-y-2">
                    <input
                      type="text"
                      placeholder="Pega la URL del logo o usa el botón para subir desde tu PC"
                      value={formData.logoUrl}
                      onChange={(e) => handleInputChange('logoUrl', e.target.value)}
                      className="w-full bg-[#181818] border border-[#333] rounded-[2px] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#C8102E]"
                    />
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#252525] hover:bg-[#333] border border-[#444] text-[#DDD] text-xs font-semibold rounded-[2px] cursor-pointer">
                      <Upload className="w-3.5 h-3.5 text-[#C8102E]" />
                      <span>Subir logo desde PC / Celular</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, (url) => handleInputChange('logoUrl', url))}
                      />
                    </label>
                  </div>
                </div>
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

      {/* Tab 2: Portada Principal (Los 3 Slides) */}
      {activeSection === 'hero' && (
        <div className="space-y-6">
          <div className="p-6 bg-[#121212] border border-[#222] rounded-[4px] space-y-4">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                Banners Rotativos de la Portada
              </h3>
              <p className="text-xs text-[#888] mt-1">
                Selecciona cuál de los 3 slides quieres editar. Puedes cambiar el título, el texto en rojo, la foto de fondo o cargar una foto nueva desde tu dispositivo.
              </p>
            </div>

            {/* Slide Selector Buttons */}
            <div className="flex gap-2 pt-2 border-b border-[#222] pb-3">
              {currentSlides.map((slide, idx) => (
                <button
                  key={slide.id || idx}
                  type="button"
                  onClick={() => setActiveSlideIndex(idx)}
                  className={`px-4 py-2 text-xs font-bold uppercase rounded-[2px] transition-colors cursor-pointer ${
                    activeSlideIndex === idx
                      ? 'bg-[#C8102E] text-white'
                      : 'bg-[#1C1C1C] text-[#888] hover:text-white hover:bg-[#252525]'
                  }`}
                >
                  Slide #{idx + 1}
                </button>
              ))}
            </div>

            {/* Edit Active Slide */}
            {currentSlides[activeSlideIndex] && (
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#BBB] mb-1">
                      Etiqueta Superior (Badge)
                    </label>
                    <input
                      type="text"
                      value={currentSlides[activeSlideIndex].badge}
                      onChange={(e) => handleSlideChange(activeSlideIndex, 'badge', e.target.value)}
                      className="w-full bg-[#181818] border border-[#333] rounded-[2px] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#C8102E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#BBB] mb-1">
                      Texto del Botón
                    </label>
                    <input
                      type="text"
                      value={currentSlides[activeSlideIndex].primaryCtaText}
                      onChange={(e) => handleSlideChange(activeSlideIndex, 'primaryCtaText', e.target.value)}
                      className="w-full bg-[#181818] border border-[#333] rounded-[2px] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#C8102E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#BBB] mb-1">
                      Título (Línea 1)
                    </label>
                    <input
                      type="text"
                      value={currentSlides[activeSlideIndex].title}
                      onChange={(e) => handleSlideChange(activeSlideIndex, 'title', e.target.value)}
                      className="w-full bg-[#181818] border border-[#333] rounded-[2px] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#C8102E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#BBB] mb-1">
                      Palabra Destacada en Rojo
                    </label>
                    <input
                      type="text"
                      value={currentSlides[activeSlideIndex].highlightWord}
                      onChange={(e) => handleSlideChange(activeSlideIndex, 'highlightWord', e.target.value)}
                      className="w-full bg-[#181818] border border-[#333] rounded-[2px] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#C8102E]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-[#BBB] mb-1">
                      Subtítulo / Bajada descriptiva
                    </label>
                    <textarea
                      rows={2}
                      value={currentSlides[activeSlideIndex].subtitle}
                      onChange={(e) => handleSlideChange(activeSlideIndex, 'subtitle', e.target.value)}
                      className="w-full bg-[#181818] border border-[#333] rounded-[2px] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#C8102E]"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-2">
                    <label className="block text-xs font-semibold text-[#BBB]">
                      Foto de Fondo del Slide #{activeSlideIndex + 1}
                    </label>

                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      {/* Thumbnail preview */}
                      <div className="w-32 h-20 bg-[#181818] border border-[#333] rounded-[2px] overflow-hidden shrink-0 relative group">
                        <img
                          src={currentSlides[activeSlideIndex].bgImage}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* URL input & upload button */}
                      <div className="flex-1 w-full space-y-2">
                        <input
                          type="text"
                          placeholder="URL de la imagen o presiona subir desde tu dispositivo"
                          value={currentSlides[activeSlideIndex].bgImage}
                          onChange={(e) => handleSlideChange(activeSlideIndex, 'bgImage', e.target.value)}
                          className="w-full bg-[#181818] border border-[#333] rounded-[2px] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#C8102E]"
                        />

                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#252525] hover:bg-[#333] border border-[#444] text-[#DDD] text-xs font-semibold rounded-[2px] cursor-pointer">
                          <Upload className="w-3.5 h-3.5 text-[#C8102E]" />
                          <span>Subir foto desde PC o Celular</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, (url) => handleSlideChange(activeSlideIndex, 'bgImage', url))}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Categorías y Fotos */}
      {activeSection === 'categories' && (
        <div className="space-y-6">
          <div className="p-6 bg-[#121212] border border-[#222] rounded-[4px] space-y-4">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                Gestión de Categorías y Fotos
              </h3>
              <p className="text-xs text-[#888] mt-1">
                Aquí puedes cambiar las fotos de cada categoría, modificar su nombre, descripción o desactivarlas del menú y de la tienda con un clic.
              </p>
            </div>

            {/* Categories List */}
            <div className="space-y-4 pt-2">
              {formData.categories.map((cat) => (
                <div
                  key={cat.id}
                  className={`p-5 rounded-[4px] border space-y-4 transition-colors ${
                    cat.enabled
                      ? 'bg-[#161616] border-[#333]'
                      : 'bg-[#101010] border-[#222] opacity-60'
                  }`}
                >
                  {/* Top Bar of Category Card */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222] pb-3">
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
                          <span className="font-bold text-base text-white">{cat.name}</span>
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
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
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

                  {/* Category Details Form */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                    {/* Category Photo with Preview */}
                    <div className="space-y-2">
                      <span className="block text-xs font-semibold text-[#BBB]">
                        Foto de la Categoría
                      </span>
                      <div className="w-full h-36 bg-[#121212] border border-[#2A2A2A] rounded-[2px] overflow-hidden relative group">
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <label className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#222] hover:bg-[#333] border border-[#3A3A3A] text-white text-xs font-semibold rounded-[2px] cursor-pointer">
                        <Upload className="w-3.5 h-3.5 text-[#C8102E]" />
                        <span>Subir foto desde PC / Celular</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, (url) => handleCategoryFieldChange(cat.id, 'image', url))}
                        />
                      </label>
                    </div>

                    {/* Inputs */}
                    <div className="md:col-span-2 space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-[#BBB] mb-1">
                          Nombre visible de la Categoría
                        </label>
                        <input
                          type="text"
                          value={cat.name}
                          onChange={(e) => handleCategoryFieldChange(cat.id, 'name', e.target.value)}
                          className="w-full bg-[#181818] border border-[#333] rounded-[2px] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#C8102E]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#BBB] mb-1">
                          Descripción (texto que aparece en las tarjetas de la portada)
                        </label>
                        <textarea
                          rows={2}
                          value={cat.description}
                          onChange={(e) => handleCategoryFieldChange(cat.id, 'description', e.target.value)}
                          className="w-full bg-[#181818] border border-[#333] rounded-[2px] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#C8102E]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#BBB] mb-1">
                          URL directa de la imagen (o pega un link externo)
                        </label>
                        <input
                          type="text"
                          value={cat.image}
                          onChange={(e) => handleCategoryFieldChange(cat.id, 'image', e.target.value)}
                          className="w-full bg-[#181818] border border-[#333] rounded-[2px] px-3 py-1.5 text-xs text-[#AAA] focus:outline-none focus:border-[#C8102E]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add new category inline */}
            <form onSubmit={handleAddCategory} className="pt-4 border-t border-[#222] flex gap-3">
              <input
                type="text"
                placeholder="Nombre de nueva categoría (ej: Camperas, Buzos, Banderas...)"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="flex-1 bg-[#181818] border border-[#333] rounded-[2px] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#C8102E]"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#222] hover:bg-[#333] border border-[#444] text-white text-xs font-bold uppercase rounded-[2px] cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#C8102E]" />
                <span>Agregar Categoría</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tab 4: Contacto, WhatsApp y Redes */}
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

      {/* Tab 5: Envíos y Promociones */}
      {activeSection === 'shipping' && (
        <div className="space-y-6">
          <div className="p-6 bg-[#121212] border border-[#222] rounded-[4px] space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#222] pb-4">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                  Modalidad de Entrega y Envíos
                </h3>
                <p className="text-xs text-[#888] mt-1">
                  Controla si aceptas envíos a domicilio a todo el país o si la tienda opera únicamente con retiros por el taller.
                </p>
              </div>

              {/* Delivery Enabled Toggle */}
              <label className="inline-flex items-center gap-3 px-4 py-2 bg-[#1A1A1A] border border-[#333] rounded-[2px] cursor-pointer hover:border-[#444] transition-colors">
                <input
                  type="checkbox"
                  checked={Boolean(formData.shipping.deliveryEnabled)}
                  onChange={(e) => handleNestedChange('shipping', 'deliveryEnabled', e.target.checked)}
                  className="w-4 h-4 accent-[#C8102E] rounded cursor-pointer"
                />
                <span className="text-xs font-bold text-white">
                  {formData.shipping.deliveryEnabled ? 'Envíos a Domicilio: HABILITADOS' : 'Solo Retiro en Local (Envíos Deshabilitados)'}
                </span>
              </label>
            </div>

            {/* Status explanation alert */}
            {!formData.shipping.deliveryEnabled ? (
              <div className="p-4 bg-amber-950/30 border border-amber-800/50 rounded-[2px] flex items-start gap-3">
                <Truck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-200/90 space-y-1">
                  <p className="font-bold text-amber-300">
                    Modo Activo: Solo Retiro en Local Comercial (Las Breñas)
                  </p>
                  <p>
                    El carrito de compras y los mensajes de WhatsApp indicarán automáticamente que el pedido es para retirar en el local comercial sin costo de envío adicional ($0).
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-emerald-950/30 border border-emerald-800/50 rounded-[2px] flex items-start gap-3">
                <Truck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-200/90">
                  <p className="font-bold text-emerald-300">
                    Envíos a Domicilio Habilitados a Todo el País
                  </p>
                  <p>
                    Se cobrará el costo de envío estándar o se bonificará automáticamente si la compra supera el monto mínimo configurado.
                  </p>
                </div>
              </div>
            )}

            {/* Pickup Note input */}
            <div>
              <label className="block text-xs font-semibold text-[#BBB] mb-1">
                Aviso / Instrucciones de Retiro en el Local
              </label>
              <input
                type="text"
                value={formData.shipping.pickupOnlyMessage || ''}
                onChange={(e) => handleNestedChange('shipping', 'pickupOnlyMessage', e.target.value)}
                placeholder="ej: Solo retiros en nuestro local en Las Breñas (Chaco). Horarios: Lun a Sáb 9 a 13 y 17 a 21hs."
                className="w-full bg-[#181818] border border-[#333] rounded-[2px] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#C8102E]"
              />
            </div>

            {formData.shipping.deliveryEnabled && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#222]">
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
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Bottom Bar for Quick Save */}
      <div className="sticky bottom-4 z-30 p-4 bg-[#181818]/95 backdrop-blur-md border border-[#333] rounded-[4px] shadow-2xl flex items-center justify-between">
        <span className="text-xs text-[#AAA] hidden sm:inline">
          Los cambios se guardan y sincronizan en vivo en <b>Firebase Firestore</b> al hacer clic en guardar.
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
