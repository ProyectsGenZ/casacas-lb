import React, { useEffect } from 'react';
import { useUI } from '../../context/UIContext';
import { X, Ruler, HelpCircle, Info } from 'lucide-react';

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

  const tShirtSizes = [
    { size: 'S', width: '44 cm', length: '66 cm' },
    { size: 'M', width: '47 cm', length: '68 cm' },
    { size: 'L', width: '49 cm', length: '71 cm' },
    { size: 'XL', width: '53 cm', length: '73 cm' },
    { size: 'XXL', width: '57 cm', length: '74 cm' }
  ];

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
            <Ruler className="w-5 h-5 text-[#C8102E]" />
            <div>
              <h2 className="font-display font-bold text-xl text-[#F8F7F4]">
                Guía de Talles y Medidas
              </h2>
              <p className="text-[11px] text-[#A09D96] font-mono mt-0.5">
                Remeras Negras de Algodón / SPUM
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsSizeGuideOpen(false)}
            className="p-1 text-[#888] hover:text-white rounded-[2px] transition-colors"
            aria-label="Cerrar guía de talles"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Visual Guide Graphic + Notice */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center bg-[#1A1A1A] p-4 border border-[#282828] rounded-[2px]">
          <div className="relative rounded overflow-hidden border border-[#333] bg-[#111] flex items-center justify-center p-2">
            <img
              src="/guia-talles-remeras.jpg"
              alt="Esquema técnico de medidas para remeras - Casacas LB"
              className="max-h-52 object-contain rounded"
            />
          </div>
          <div className="space-y-2 text-xs text-[#BBB]">
            <p className="font-bold text-white text-sm flex items-center gap-1.5">
              <Info className="w-4 h-4 text-[#C8102E]" />
              ¿Cómo medir tu remera?
            </p>
            <p className="leading-relaxed">
              1. Apoyá una remera tuya que te quede cómoda sobre una superficie plana (mesa o cama).
            </p>
            <p className="leading-relaxed">
              2. Medí el <strong className="text-white">ANCHO</strong> de costura a costura por debajo de las mangas (sisa a sisa).
            </p>
            <p className="leading-relaxed">
              3. Medí el <strong className="text-white">LARGO</strong> desde el hombro junto al cuello hasta el borde inferior.
            </p>
          </div>
        </div>

        {/* Table Remeras Negras de Algodon */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C8102E]">
              Tabla Oficial de Medidas (en cm)
            </span>
            <span className="text-[11px] text-[#888] font-mono">Tolerancia aprox. ± 1 a 2 cm</span>
          </div>

          <div className="overflow-x-auto border border-[#262626] rounded-[2px]">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#1F1F1F] text-[#E0DDD5] uppercase font-mono tracking-wider">
                <tr>
                  <th className="p-3 text-center w-24">Talle</th>
                  <th className="p-3 text-center">Ancho (Sisa a Sisa)</th>
                  <th className="p-3 text-center">Largo (Cuello a Base)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222] text-[#CCC]">
                {tShirtSizes.map((row) => (
                  <tr key={row.size} className="hover:bg-[#1C1C1C] transition-colors text-center">
                    <td className="p-3.5 font-bold font-mono text-white text-sm bg-[#161616]">
                      {row.size}
                    </td>
                    <td className="p-3.5 font-mono text-[#F8F7F4] font-semibold text-sm">
                      {row.width}
                    </td>
                    <td className="p-3.5 font-mono text-[#F8F7F4] font-semibold text-sm">
                      {row.length}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recommendation tip */}
        <div className="p-3.5 bg-[#181818] border border-[#282828] rounded-[2px] flex items-start gap-3 text-xs text-[#9E9D99]">
          <HelpCircle className="w-4 h-4 text-[#C8102E] shrink-0 mt-0.5" />
          <p>
            <strong className="text-white">Consejo de calce:</strong> Si estás entre dos talles y te gusta un calce entallado/al cuerpo elegí el menor; si preferís un calce más relajado o look streetwear holgado, optá por el mayor.
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={() => setIsSizeGuideOpen(false)}
          className="w-full py-3 bg-[#C8102E] hover:bg-[#E01837] text-white font-bold text-xs uppercase tracking-wider rounded-[2px] transition-colors cursor-pointer"
        >
          Entendido
        </button>

      </div>
    </div>
  );
};
