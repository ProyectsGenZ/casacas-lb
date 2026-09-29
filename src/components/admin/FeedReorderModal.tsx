import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import { X, ArrowUp, ArrowDown, ArrowUpDown, Sparkles, Check, Search } from 'lucide-react';

interface FeedReorderModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSaveOrder: (orderedIds: string[]) => Promise<void>;
}

export const FeedReorderModal: React.FC<FeedReorderModalProps> = ({
  isOpen,
  onClose,
  products,
  onSaveOrder
}) => {
  const [orderedList, setOrderedList] = useState<Product[]>([]);
  const [filterQuery, setFilterQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setOrderedList([...products]);
      setFilterQuery('');
    }
  }, [isOpen, products]);

  if (!isOpen) return null;

  const moveItem = (index: number, direction: 'up' | 'down' | 'top') => {
    const list = [...orderedList];
    if (direction === 'top') {
      if (index === 0) return;
      const [item] = list.splice(index, 1);
      list.unshift(item);
    } else if (direction === 'up') {
      if (index === 0) return;
      const temp = list[index - 1];
      list[index - 1] = list[index];
      list[index] = temp;
    } else if (direction === 'down') {
      if (index === list.length - 1) return;
      const temp = list[index + 1];
      list[index + 1] = list[index];
      list[index] = temp;
    }
    setOrderedList(list);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSaveOrder(orderedList.map((p) => p.id));
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  const displayedList = filterQuery.trim()
    ? orderedList.filter((p) =>
        p.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(filterQuery.toLowerCase()) ||
        (p.sku && p.sku.toLowerCase().includes(filterQuery.toLowerCase()))
      )
    : orderedList;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-2xl bg-[#141414] border border-[#2B2B2B] rounded-[4px] shadow-2xl my-8 overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#222] bg-[#111] shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-[#C8102E]" />
              <h2 className="font-display font-extrabold text-lg sm:text-xl text-[#F8F7F4] tracking-tight">
                Organizar Orden del Feed de la Página
              </h2>
            </div>
            <p className="text-xs text-[#8E8B84] mt-0.5">
              Definí qué prendas aparecen primero en la portada principal y en el catálogo.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#999] hover:text-white hover:bg-[#222] rounded-[2px] transition-colors focus-ring cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice Info */}
        <div className="px-6 py-3 bg-[#1A1515] border-b border-[#301818] flex items-center justify-between text-xs text-[#E0D8D0] shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C8102E] shrink-0" />
            <span>
              Los primeros <strong className="text-white font-bold">8 productos (#1 al #8)</strong> son los que se muestran en el carrusel/grilla de la portada principal.
            </span>
          </div>
        </div>

        {/* Filter bar if list is long */}
        <div className="px-6 py-2.5 bg-[#161616] border-b border-[#242424] shrink-0">
          <div className="relative">
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Buscar prenda para ubicarla rápido..."
              className="w-full bg-[#1F1F1F] border border-[#333] focus:border-[#C8102E] rounded-[2px] pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#666] focus:outline-none"
            />
            <Search className="w-3.5 h-3.5 text-[#666] absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Product List */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-2 flex-1 divide-y divide-[#1F1F1F]">
          {displayedList.map((product) => {
            const actualIndex = orderedList.findIndex((p) => p.id === product.id);
            const isTopEight = actualIndex < 8;

            return (
              <div
                key={product.id}
                className="pt-2 first:pt-0 flex items-center justify-between gap-3 p-2 rounded-[2px] hover:bg-[#1A1A1A] transition-colors"
              >
                {/* Left: Position Rank & Info */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-[2px] flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                      isTopEight
                        ? 'bg-[#C8102E] text-white shadow-md shadow-[#C8102E]/30'
                        : 'bg-[#222] text-[#888] border border-[#333]'
                    }`}
                    title={isTopEight ? 'Visible en portada de inicio' : `Posición #${actualIndex + 1}`}
                  >
                    #{actualIndex + 1}
                  </div>

                  <div className="w-10 h-10 rounded-[2px] bg-[#1C1C1C] border border-[#2D2D2D] overflow-hidden shrink-0 flex items-center justify-center">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-contain p-0.5"
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs truncate">
                        {product.name}
                      </span>
                      {isTopEight && (
                        <span className="px-1.5 py-0.2 bg-[#C8102E]/20 text-[#FF6B6B] border border-[#C8102E]/30 text-[9px] font-bold uppercase rounded-[2px] hidden sm:inline-block">
                          En Portada
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-[#777] block font-mono">
                      {product.category} • ${Number(product.priceBase || product.price).toLocaleString('es-AR')}
                    </span>
                  </div>
                </div>

                {/* Right: Reorder Action Buttons */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {actualIndex > 0 && (
                    <button
                      type="button"
                      onClick={() => moveItem(actualIndex, 'top')}
                      className="px-2 py-1 bg-[#222] hover:bg-[#C8102E] hover:text-white text-[#CCC] border border-[#333] hover:border-[#C8102E] text-[10px] font-bold uppercase rounded-[2px] transition-colors cursor-pointer flex items-center gap-1"
                      title="Poner en la primera posición (#1) de la portada"
                    >
                      <span>1° Lugar</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => moveItem(actualIndex, 'up')}
                    disabled={actualIndex === 0}
                    className="p-1.5 bg-[#202020] hover:bg-[#2E2E2E] border border-[#333] text-white disabled:opacity-20 disabled:cursor-not-allowed rounded-[2px] transition-colors cursor-pointer"
                    title="Subir una posición"
                    aria-label="Subir"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => moveItem(actualIndex, 'down')}
                    disabled={actualIndex === orderedList.length - 1}
                    className="p-1.5 bg-[#202020] hover:bg-[#2E2E2E] border border-[#333] text-white disabled:opacity-20 disabled:cursor-not-allowed rounded-[2px] transition-colors cursor-pointer"
                    title="Bajar una posición"
                    aria-label="Bajar"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#111] border-t border-[#222] flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#222] hover:bg-[#2A2A2A] text-[#BBB] hover:text-white text-xs font-semibold rounded-[2px] transition-colors cursor-pointer"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2.5 bg-[#C8102E] hover:bg-[#E01837] text-white text-xs font-bold uppercase tracking-wider rounded-[2px] transition-all flex items-center gap-2 shadow-lg shadow-[#C8102E]/20 cursor-pointer disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            <span>{isSaving ? 'Guardando...' : 'Aplicar Orden al Feed'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
