import React from 'react';
import { Product } from '../../types';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  product: Product | null;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  product
}) => {
  if (!isOpen || !product) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md bg-[#161616] border border-[#333] rounded-[4px] p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
        
        <div className="flex items-start justify-between">
          <div className="w-10 h-10 rounded-full bg-[#D32F2F]/20 border border-[#D32F2F]/50 flex items-center justify-center text-[#FF5555]">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#888] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <h3 className="font-display font-bold text-lg text-[#F8F7F4] tracking-tight">
            ¿Eliminar este producto?
          </h3>
          <p className="text-xs text-[#9E9D99] mt-2 leading-relaxed">
            Estás a punto de borrar definitivamente{' '}
            <strong className="text-white">"{product.name}"</strong> (SKU:{' '}
            <span className="font-mono text-[#DDD]">{product.sku}</span>). Esta acción no se puede deshacer y el artículo se removerá de la tienda.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#262626]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#222] hover:bg-[#2C2C2C] text-[#CCC] font-semibold text-xs rounded-[2px] transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-5 py-2 bg-[#D32F2F] hover:bg-[#E53935] text-white font-bold text-xs uppercase tracking-wider rounded-[2px] transition-colors flex items-center gap-1.5 cursor-pointer shadow-lg shadow-[#D32F2F]/20"
          >
            <Trash2 className="w-4 h-4" />
            <span>Sí, eliminar producto</span>
          </button>
        </div>

      </div>
    </div>
  );
};
