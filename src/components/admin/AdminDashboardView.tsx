import React, { useState, useMemo } from 'react';
import { useProductManagement } from '../../context/ProductManagementContext';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useUI } from '../../context/UIContext';
import { Product, ProductCategory } from '../../types';
import { ProductFormModal } from './ProductFormModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { StoreSettingsTab } from './StoreSettingsTab';
import { AdminReviewsTab } from './AdminReviewsTab';
import { useReviews } from '../../context/ReviewsContext';
import {
  Package,
  Plus,
  Search,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Edit2,
  Trash2,
  ExternalLink,
  LogOut,
  RotateCcw,
  Sparkles,
  ArrowUpDown,
  Filter,
  Store,
  Star
} from 'lucide-react';
import { brandConfig } from '../../config/brandConfig';

export const AdminDashboardView: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, updateStock, resetToDefault } = useProductManagement();
  const { logout, adminUser } = useAdminAuth();
  const { navigateToHome, showToast } = useUI();
  const { pendingReviews } = useReviews();

  // Main Tab State (Products vs CMS Store Settings vs Reviews Moderation)
  const [mainTab, setMainTab] = useState<'products' | 'cms' | 'reviews'>('products');

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ProductCategory | 'Todas'>('Todas');
  const [stockStatusFilter, setStockStatusFilter] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all');

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // KPIs
  const totalProducts = products.length;
  const lowStockProducts = products.filter((p) => (p.stock ?? 0) > 0 && (p.stock ?? 0) < 5).length;
  const outOfStockProducts = products.filter((p) => (p.stock ?? 0) === 0).length;
  const customizableCount = products.filter((p) => p.customizable).length;

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.sku && product.sku.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        categoryFilter === 'Todas' || product.category === categoryFilter;

      const stock = product.stock ?? 0;
      let matchesStock = true;
      if (stockStatusFilter === 'in_stock') matchesStock = stock >= 5;
      else if (stockStatusFilter === 'low_stock') matchesStock = stock > 0 && stock < 5;
      else if (stockStatusFilter === 'out_of_stock') matchesStock = stock === 0;

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, searchQuery, categoryFilter, stockStatusFilter]);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setIsFormModalOpen(true);
  };

  const handleOpenDeleteModal = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleSaveProduct = (productData: any) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
    } else {
      addProduct(productData);
    }
  };

  const handleConfirmDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete.id);
      setProductToDelete(null);
    }
  };

  const handleStockChange = (id: string, currentStock: number, delta: number) => {
    const updated = Math.max(0, currentStock + delta);
    updateStock(id, updated);
  };

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-[#F8F7F4] flex flex-col">
      
      {/* Admin Top Navigation */}
      <header className="sticky top-0 z-40 bg-[#141414] border-b border-[#242424] px-4 sm:px-6 lg:px-8 py-3.5 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Brand & Badge */}
          <div className="flex items-center gap-4">
            <button
              onClick={navigateToHome}
              className="flex items-center gap-2 group text-left cursor-pointer focus-ring"
              title="Volver a la tienda"
            >
              <img
                src="/media/logo-casacas-oficial.png"
                alt={brandConfig.name}
                className="h-8 w-auto object-contain"
              />
            </button>
            <span className="hidden sm:inline-block h-4 w-px bg-[#333]" />
            <span className="px-2.5 py-0.5 bg-[#C8102E]/20 border border-[#C8102E]/50 text-[#F8F7F4] text-[10px] font-mono uppercase tracking-wider rounded-[2px] font-bold">
              Panel de Control
            </span>
          </div>

          {/* Admin User & Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={navigateToHome}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1E1E1E] hover:bg-[#282828] border border-[#333] text-xs font-semibold text-[#DDD] rounded-[2px] transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#C8102E]" />
              <span>Ver Tienda Pública</span>
            </button>

            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-bold text-white leading-none">
                {adminUser?.name || 'Administrador'}
              </span>
              <span className="text-[10px] text-[#888] font-mono">
                {adminUser?.email || 'admin@casacaslb.com.ar'}
              </span>
            </div>

            <button
              onClick={() => {
                logout();
                showToast('Sesión cerrada correctamente.', 'info');
                navigateToHome();
              }}
              className="p-2 text-[#999] hover:text-[#FF6666] hover:bg-[#222] rounded-[2px] transition-colors cursor-pointer focus-ring"
              title="Cerrar sesión"
              aria-label="Cerrar sesión"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      {/* Main Admin Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Main Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-3 border-b border-[#262626] pb-5">
          <button
            onClick={() => setMainTab('products')}
            className={`px-5 py-3 text-xs font-bold uppercase tracking-wider rounded-[2px] transition-all flex items-center gap-2 cursor-pointer ${
              mainTab === 'products'
                ? 'bg-[#C8102E] text-white shadow-lg shadow-[#C8102E]/20'
                : 'bg-[#181818] text-[#888] hover:text-white hover:bg-[#222]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Productos y Stock</span>
          </button>

          <button
            onClick={() => setMainTab('cms')}
            className={`px-5 py-3 text-xs font-bold uppercase tracking-wider rounded-[2px] transition-all flex items-center gap-2 cursor-pointer ${
              mainTab === 'cms'
                ? 'bg-[#C8102E] text-white shadow-lg shadow-[#C8102E]/20'
                : 'bg-[#181818] text-[#888] hover:text-white hover:bg-[#222]'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Personalización y Contenido (CMS)</span>
          </button>

          <button
            onClick={() => setMainTab('reviews')}
            className={`px-5 py-3 text-xs font-bold uppercase tracking-wider rounded-[2px] transition-all flex items-center gap-2 cursor-pointer relative ${
              mainTab === 'reviews'
                ? 'bg-[#C8102E] text-white shadow-lg shadow-[#C8102E]/20'
                : 'bg-[#181818] text-[#888] hover:text-white hover:bg-[#222]'
            }`}
          >
            <Star className="w-4 h-4" />
            <span>Moderación de Reseñas</span>
            {pendingReviews.length > 0 && (
              <span className="px-1.5 py-0.5 bg-amber-400 text-black text-[10px] font-black rounded-full leading-none">
                {pendingReviews.length}
              </span>
            )}
          </button>
        </div>

        {mainTab === 'cms' ? (
          <StoreSettingsTab />
        ) : mainTab === 'reviews' ? (
          <AdminReviewsTab />
        ) : (
          <>
            {/* Header Title & Quick Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#C8102E] font-bold">
                  Inventario & Catálogo
                </span>
                <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#F8F7F4] tracking-tight">
              Gestión de Productos
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={resetToDefault}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1A1A1A] hover:bg-[#242424] border border-[#333] text-xs font-semibold text-[#AAA] hover:text-white rounded-[2px] transition-colors cursor-pointer"
              title="Restaura los 27 productos originales oficiales"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Restablecer Originales</span>
            </button>

            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#C8102E] hover:bg-[#E01837] active:scale-[0.98] text-white font-display font-bold text-xs uppercase tracking-wider rounded-[2px] transition-all shadow-lg shadow-[#C8102E]/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Añadir Producto</span>
            </button>
          </div>
        </div>

        {/* Metric KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-5 bg-[#141414] border border-[#262626] rounded-[2px]">
            <div className="flex items-center justify-between text-[#888] mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Productos</span>
              <Package className="w-4 h-4 text-[#DDD]" />
            </div>
            <span className="font-display font-extrabold text-3xl text-white">
              {totalProducts}
            </span>
            <span className="block text-[11px] text-[#777] mt-1">Activos en catálogo</span>
          </div>

          <div className="p-5 bg-[#141414] border border-[#262626] rounded-[2px]">
            <div className="flex items-center justify-between text-[#888] mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Poco Stock (&lt; 5)</span>
              <AlertCircle className="w-4 h-4 text-[#ED6C02]" />
            </div>
            <span className="font-display font-extrabold text-3xl text-[#ED6C02]">
              {lowStockProducts}
            </span>
            <span className="block text-[11px] text-[#777] mt-1">Requieren reposición</span>
          </div>

          <div className="p-5 bg-[#141414] border border-[#262626] rounded-[2px]">
            <div className="flex items-center justify-between text-[#888] mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Agotados (0)</span>
              <XCircle className="w-4 h-4 text-[#D32F2F]" />
            </div>
            <span className="font-display font-extrabold text-3xl text-[#D32F2F]">
              {outOfStockProducts}
            </span>
            <span className="block text-[11px] text-[#777] mt-1">Sin unidades disponibles</span>
          </div>

          <div className="p-5 bg-[#141414] border border-[#262626] rounded-[2px]">
            <div className="flex items-center justify-between text-[#888] mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Personalizables</span>
              <Sparkles className="w-4 h-4 text-[#C8102E]" />
            </div>
            <span className="font-display font-extrabold text-3xl text-white">
              {customizableCount}
            </span>
            <span className="block text-[11px] text-[#777] mt-1">Con cotización especial</span>
          </div>

        </div>

        {/* Filters and Search Toolbar */}
        <div className="p-4 bg-[#141414] border border-[#262626] rounded-[2px] flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre o código SKU..."
              className="w-full bg-[#1A1A1A] border border-[#333] focus:border-[#C8102E] rounded-[2px] pl-10 pr-4 py-2.5 text-xs text-[#F8F7F4] placeholder-[#666] focus:outline-none"
            />
            <Search className="w-4 h-4 text-[#666] absolute left-3.5 top-3" />
          </div>

          {/* Filter Selects */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[#888] uppercase font-mono">Categoría:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as any)}
                className="bg-[#1A1A1A] border border-[#333] text-xs text-[#DDD] rounded-[2px] px-3 py-2 focus:outline-none focus:border-[#C8102E]"
              >
                <option value="Todas">Todas las categorías</option>
                <option value="Indumentaria">Indumentaria</option>
                <option value="Accesorios">Accesorios</option>
                <option value="UV & vinilo">UV & vinilo</option>
                <option value="Banderas">Banderas</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[#888] uppercase font-mono">Stock:</span>
              <select
                value={stockStatusFilter}
                onChange={(e) => setStockStatusFilter(e.target.value as any)}
                className="bg-[#1A1A1A] border border-[#333] text-xs text-[#DDD] rounded-[2px] px-3 py-2 focus:outline-none focus:border-[#C8102E]"
              >
                <option value="all">Todos los estados</option>
                <option value="in_stock">En stock (5+ u.)</option>
                <option value="low_stock">Poco stock (1 a 4 u.)</option>
                <option value="out_of_stock">Agotado (0 u.)</option>
              </select>
            </div>
          </div>

        </div>

        {/* Products Table */}
        <div className="bg-[#141414] border border-[#242424] rounded-[2px] overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#181818] border-b border-[#282828] text-[10px] uppercase font-mono tracking-wider text-[#8E8B84]">
                  <th className="py-3 px-4">Producto</th>
                  <th className="py-3 px-3">SKU</th>
                  <th className="py-3 px-3">Categoría</th>
                  <th className="py-3 px-3">Precio Base</th>
                  <th className="py-3 px-3">Precio Custom</th>
                  <th className="py-3 px-4">Control de Stock</th>
                  <th className="py-3 px-3">Estado</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#202020]">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-[#777]">
                      No se encontraron productos que coincidan con la búsqueda o filtros.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => {
                    const stock = product.stock ?? 0;
                    const isOutOfStock = stock === 0;
                    const isLowStock = stock > 0 && stock < 5;

                    return (
                      <tr
                        key={product.id}
                        className="hover:bg-[#1A1A1A] transition-colors"
                      >
                        {/* Image & Title */}
                        <td className="py-3.5 px-4 flex items-center gap-3">
                          <div className="w-11 h-11 rounded-[2px] bg-[#1E1E1E] border border-[#333] overflow-hidden shrink-0">
                            <img
                              src={product.images[0] || 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=200&q=80'}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <span className="font-bold text-white text-sm block">
                              {product.name}
                            </span>
                            {product.tag && (
                              <span className="text-[9px] uppercase tracking-wider text-[#C8102E] font-bold font-mono">
                                • {product.tag}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* SKU */}
                        <td className="py-3.5 px-3">
                          <span className="font-mono text-[11px] text-[#A8A59E] bg-[#1E1E1E] px-2 py-0.5 rounded-[2px] border border-[#333]">
                            {product.sku || 'N/A'}
                          </span>
                        </td>

                        {/* Category */}
                        <td className="py-3.5 px-3 text-[#BBB]">
                          {product.category}
                        </td>

                        {/* Price Base */}
                        <td className="py-3.5 px-3 font-mono font-bold text-white">
                          $ {Number(product.priceBase || product.price).toLocaleString('es-AR')}
                        </td>

                        {/* Price Custom */}
                        <td className="py-3.5 px-3 font-mono text-[#AAA]">
                          {product.priceCustom
                            ? `$ ${Number(product.priceCustom).toLocaleString('es-AR')}`
                            : '—'}
                        </td>

                        {/* Quick Stock Control */}
                        <td className="py-3.5 px-4">
                          <div className="inline-flex items-center border border-[#333] rounded-[2px] bg-[#181818]">
                            <button
                              type="button"
                              onClick={() => handleStockChange(product.id, stock, -1)}
                              disabled={stock <= 0}
                              className="w-7 h-7 flex items-center justify-center text-[#AAA] hover:text-white hover:bg-[#282828] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                              title="Restar 1 unidad"
                            >
                              −
                            </button>
                            <input
                              type="number"
                              min={0}
                              value={stock}
                              onChange={(e) => updateStock(product.id, Number(e.target.value))}
                              className="w-12 h-7 bg-transparent text-center font-mono font-bold text-xs text-white focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => handleStockChange(product.id, stock, 1)}
                              className="w-7 h-7 flex items-center justify-center text-[#AAA] hover:text-white hover:bg-[#282828] transition-colors"
                              title="Sumar 1 unidad"
                            >
                              +
                            </button>
                          </div>
                        </td>

                        {/* Stock Badge */}
                        <td className="py-3.5 px-3">
                          {isOutOfStock ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] bg-[#D32F2F]/20 text-[#FF6B6B] border border-[#D32F2F]/40 font-mono text-[10px] font-bold">
                              Agotado
                            </span>
                          ) : isLowStock ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] bg-[#ED6C02]/20 text-[#FFA94D] border border-[#ED6C02]/40 font-mono text-[10px] font-bold">
                              Quedan {stock}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] bg-[#2E7D32]/20 text-[#69DB7C] border border-[#2E7D32]/40 font-mono text-[10px] font-bold">
                              {stock} u.
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(product)}
                              className="p-1.5 bg-[#1F1F1F] hover:bg-[#2C2C2C] text-[#DDD] hover:text-white rounded-[2px] transition-colors cursor-pointer"
                              title="Editar producto"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenDeleteModal(product)}
                              className="p-1.5 bg-[#1F1F1F] hover:bg-[#3D1418] text-[#999] hover:text-[#FF6666] rounded-[2px] transition-colors cursor-pointer"
                              title="Eliminar producto"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="p-4 bg-[#181818] border-t border-[#262626] flex items-center justify-between text-xs text-[#888]">
            <span>
              Mostrando <strong className="text-white">{filteredProducts.length}</strong> de{' '}
              <strong className="text-white">{totalProducts}</strong> productos
            </span>
            <span className="text-[11px] font-mono text-[#666]">
              Cambios guardados localmente en tiempo real
            </span>
          </div>

        </div>

        </>
      )}

      </main>

      {/* Modals */}
      <ProductFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveProduct}
        initialProduct={editingProduct}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        product={productToDelete}
      />

    </div>
  );
};
