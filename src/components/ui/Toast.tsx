import React from 'react';
import { useUI } from '../../context/UIContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useUI();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-4 bg-[#181818] border text-[#F8F7F4] shadow-2xl transition-all duration-200 transform translate-y-0 ${
            toast.type === 'error'
              ? 'border-[#D32F2F]'
              : toast.type === 'info'
              ? 'border-[#2E7D32]'
              : 'border-[#C85A32]'
          }`}
          style={{ borderRadius: 'var(--radius-xs)' }}
          role="status"
        >
          {toast.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-[#D32F2F] shrink-0 mt-0.5" />
          ) : toast.type === 'info' ? (
            <Info className="w-5 h-5 text-[#2E7D32] shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-[#C85A32] shrink-0 mt-0.5" />
          )}
          <div className="flex-1 text-sm font-medium leading-snug">
            {toast.message}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-[#9E9D99] hover:text-white transition-colors focus-ring p-1 -mr-1 -mt-1"
            aria-label="Cerrar notificación"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
