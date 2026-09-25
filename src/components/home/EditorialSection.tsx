import React from 'react';
import { useUI } from '../../context/UIContext';
import { ArrowRight, Scissors, Sparkles } from 'lucide-react';

export const EditorialSection: React.FC = () => {
  const { setIsStoryModalOpen, navigateToCatalog } = useUI();

  return (
    <section className="py-20 lg:py-28 bg-[#0E0E0E] border-b border-[#1E1E1E] overflow-hidden" aria-labelledby="editorial-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Asymmetrical 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Visual Column (7 cols) */}
          <div className="lg:col-span-7 relative">
            <div className="relative aspect-[4/3] sm:aspect-[16/10] overflow-hidden rounded-[2px] border border-[#262626] bg-[#161616]">
              <img
                src="https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1400&q=85"
                alt="Detalle editorial de prenda y textura textil urbana de VORÁGINE STUDIO"
                className="w-full h-full object-cover object-center filter brightness-[0.8] contrast-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E0E]/80 via-transparent to-transparent" />
            </div>

            {/* Overlapping Floating Element */}
            <div className="hidden sm:block absolute -bottom-6 -right-6 p-6 bg-[#161616] border border-[#2F2F2F] rounded-[2px] shadow-2xl max-w-xs">
              <div className="flex items-center gap-2 text-[#C85A32] mb-1.5">
                <Scissors className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  Moldería Propia
                </span>
              </div>
              <p className="text-xs text-[#C8C5BD] leading-relaxed">
                Cada moldería se prueba en múltiples tipos de cuerpos para asegurar una caída limpia, cómoda y con presencia.
              </p>
            </div>
          </div>

          {/* Copy Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#C85A32] flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                Manifiesto Urbano
              </span>
              <h2 id="editorial-heading" className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#F8F7F4] mt-2 leading-[1.1]">
                Diseñada para moverte.
              </h2>
            </div>

            <p className="text-sm sm:text-base text-[#B5B2AA] leading-relaxed">
              Creamos prendas versátiles, cómodas y con carácter para acompañarte en la ciudad, en tus días intensos y en los momentos que elegís bajar un cambio.
            </p>

            <p className="text-xs sm:text-sm text-[#82807B] leading-relaxed">
              Priorizamos tejidos de gramaje alto que mantienen su estructura tras cada lavado, costuras reforzadas con 4 hilos y avíos metálicos durables. No hacemos ropa descartable; construimos tu uniforme de todos los días.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => setIsStoryModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#F8F7F4] hover:bg-white text-[#121212] text-xs font-semibold uppercase tracking-wider rounded-[2px] transition-all focus-ring active:scale-[0.98]"
              >
                <span>Conocé nuestra historia</span>
                <ArrowRight className="w-4 h-4 text-[#121212]" />
              </button>

              <button
                type="button"
                onClick={() => navigateToCatalog('Indumentaria')}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-transparent hover:bg-[#1A1A1A] border border-[#333] text-[#F8F7F4] text-xs font-semibold uppercase tracking-wider rounded-[2px] transition-all focus-ring"
              >
                <span>Ver indumentaria</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
