import React, { useEffect } from 'react';
import { useUI } from '../../context/UIContext';
import { X, Ruler, HelpCircle } from 'lucide-react';

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
      className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 lg:p-12 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Guía de talles y medidas"
    >
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsSizeGuideOpen(false)} />

      <div className="relative max-w-2xl w-full bg-[#141414] border border-[#2A2A2A] rounded-[2px] shadow-2xl p-6 sm:p-8 z-10 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#242424]">
          <div className="flex items-center gap-2.5">
            <Ruler className="w-5 h-5 text-[#C85A32]" />
            <h2 className="font-display font-bold text-xl text-[#F8F7F4]">
              Guía de Talles y Medidas
            </h2>
          </div>
          <button
            onClick={() => setIsSizeGuideOpen(false)}
            className="p-1 text-[#888] hover:text-white"
            aria-label="Cerrar guía de talles"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Intro */}
        <p className="text-xs sm:text-sm text-[#9E9D99] leading-relaxed">
          Nuestras prendas tienen una moldería <strong className="text-white">Relaxed y Boxy</strong> (ligeramente holgada). Para saber tu talle exacto, compará estas medidas tomadas sobre una prenda propia apoyada en plano.
        </p>

        {/* Table Casacas, Camperas y Buzos */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#C85A32]">
            Casacas, Camperas & Buzos (cm)
          </span>
          <div className="overflow-x-auto border border-[#262626] rounded-[2px]">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#1C1C1C] text-[#DDD]">
                <tr>
                  <th className="p-3">Talle</th>
                  <th className="p-3">Ancho Pecho</th>
                  <th className="p-3">Largo Total</th>
                  <th className="p-3">Hombro a Hombro</th>
                  <th className="p-3">Largo Manga</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222] text-[#AAA]">
                <tr className="hover:bg-[#181818]"><td className="p-3 font-bold text-white">S</td><td className="p-3">58 cm</td><td className="p-3">66 cm</td><td className="p-3">50 cm</td><td className="p-3">63 cm</td></tr>
                <tr className="hover:bg-[#181818]"><td className="p-3 font-bold text-white">M</td><td className="p-3">61 cm</td><td className="p-3">68 cm</td><td className="p-3">52 cm</td><td className="p-3">64 cm</td></tr>
                <tr className="hover:bg-[#181818]"><td className="p-3 font-bold text-white">L</td><td className="p-3">64 cm</td><td className="p-3">70 cm</td><td className="p-3">54 cm</td><td className="p-3">65 cm</td></tr>
                <tr className="hover:bg-[#181818]"><td className="p-3 font-bold text-white">XL</td><td className="p-3">67 cm</td><td className="p-3">72 cm</td><td className="p-3">56 cm</td><td className="p-3">66 cm</td></tr>
                <tr className="hover:bg-[#181818]"><td className="p-3 font-bold text-white">XXL</td><td className="p-3">70 cm</td><td className="p-3">74 cm</td><td className="p-3">58 cm</td><td className="p-3">67 cm</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* How to measure tips */}
        <div className="p-4 bg-[#181818] border border-[#262626] rounded-[2px] flex items-start gap-3 text-xs text-[#9E9D99]">
          <HelpCircle className="w-5 h-5 text-[#C85A32] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-white">¿Dudas entre dos talles?</span>
            <p>
              Si te gusta el calce más al cuerpo elegí el menor; si buscás el look streetwear oversize auténtico, optá por el mayor. O consultanos por WhatsApp con tus medidas corporales.
            </p>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => setIsSizeGuideOpen(false)}
          className="w-full py-3 bg-[#F8F7F4] text-[#121212] font-semibold text-xs uppercase tracking-wider rounded-[2px] hover:bg-white transition-colors"
        >
          Entendido
        </button>

      </div>
    </div>
  );
};
