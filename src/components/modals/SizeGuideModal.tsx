import React, { useEffect } from 'react';
import { useUI } from '../../context/UIContext';
import { X, Ruler, Info } from 'lucide-react';

export const SizeGuideModal: React.FC = () => {
  const { isSizeGuideOpen, setIsSizeGuideOpen } = useUI();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSizeGuideOpen) {
        setIsSizeGuideOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSizeGuideOpen, setIsSizeGuideOpen]);

  if (!isSizeGuideOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto p-3 sm:p-6 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Guía de talles y medidas"
    >
      <div className="fixed inset-0 bg-black/85 backdrop-blur-sm" onClick={() => setIsSizeGuideOpen(false)} />

      <div className="relative max-w-lg w-full bg-[#121212] border border-[#2A2A2A] rounded-[4px] shadow-2xl p-5 sm:p-6 z-10 space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#242424]">
          <div className="flex items-center gap-2.5">
            <Ruler className="w-5 h-5 text-[#C8102E]" />
            <div>
              <h2 className="font-display font-bold text-lg sm:text-xl text-[#F8F7F4]">
                Guía de Talles y Medidas
              </h2>
              <p className="text-[11px] text-[#A09D96] font-mono">
                Remeras SPUM Premium / Algodón
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsSizeGuideOpen(false)}
            className="p-1.5 text-[#888] hover:text-white rounded-[2px] transition-colors cursor-pointer"
            aria-label="Cerrar guía de talles"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Technical Diagram Image */}
        <div className="relative rounded-[2px] overflow-hidden border border-[#262626] bg-black flex items-center justify-center p-2">
          <img
            src="/guia-talles-remeras.jpg"
            alt="Tabla oficial de medidas y esquema de remeras - Casacas LB"
            className="w-full max-h-[65vh] object-contain rounded-[2px]"
          />
        </div>

        {/* Measure recommendation tip */}
        <div className="p-3 bg-[#181818] border border-[#262626] rounded-[2px] flex items-start gap-2.5 text-xs text-[#A09D96] leading-relaxed">
          <Info className="w-4 h-4 text-[#C8102E] shrink-0 mt-0.5" />
          <p>
            <strong className="text-white">Tip de medición:</strong> Apoyá una remera que te quede cómoda sobre una superficie plana y medí ancho (sisa a sisa) y largo (hombro al borde inferior).
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={() => setIsSizeGuideOpen(false)}
          className="w-full py-2.5 bg-[#C8102E] hover:bg-[#E01837] text-white font-bold text-xs uppercase tracking-wider rounded-[2px] transition-colors cursor-pointer"
        >
          Cerrar Guía
        </button>

      </div>
    </div>
  );
};
