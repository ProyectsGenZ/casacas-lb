import React from 'react';
import { brandConfig } from '../../config/brandConfig';
import { useUI } from '../../context/UIContext';
import { MessageCircle, CheckCircle2, ArrowRight, Palette, Layers, Shirt } from 'lucide-react';

export const CustomizationSection: React.FC = () => {
  const { navigateToCatalog } = useUI();

  const steps = [
    {
      num: '01',
      title: 'Elegís la prenda o artículo',
      description: 'Remeras SPUM o algodón, chombas, gorras trucker, parches bordados o calcos UV para tu equipo o proyecto.'
    },
    {
      num: '02',
      title: 'Nos pasás tu diseño y colores',
      description: 'Si ya tenés logo o escudo lo adaptamos; si no, te asesoramos en tipografía, números y combinación de colores.'
    },
    {
      num: '03',
      title: 'Producción y entrega en Las Breñas',
      description: 'Lo confeccionamos con control de calidad estricto y retirás en nuestro local o te lo enviamos a cualquier punto del país.'
    }
  ];

  return (
    <section id="personaliza" className="py-20 lg:py-28 bg-[#121212] border-b border-[#222] scroll-mt-16" aria-labelledby="custom-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Visual Badge & Identity */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs uppercase tracking-widest font-semibold text-[#C8102E] flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Personalización sin límites
            </span>

            <h2 id="custom-heading" className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[#F8F7F4] leading-[1.05]">
              Del idea <br />
              <span className="text-[#C8102E]">al equipo.</span>
            </h2>

            <p className="text-sm sm:text-base text-[#B5B2AA] leading-relaxed">
              No importa si es una remera para salir, el juego completo para tu club o indumentaria corporativa: te asesoramos en cortes, estampas y durabilidad.
            </p>

            <div className="pt-2 flex flex-wrap gap-2.5">
              <span className="px-3 py-1 bg-[#1A1A1A] border border-[#2E2E2E] text-xs text-[#E0DDD5] rounded-[2px] flex items-center gap-1.5">
                <Shirt className="w-3.5 h-3.5 text-[#C8102E]" />
                Sublimación Integral
              </span>
              <span className="px-3 py-1 bg-[#1A1A1A] border border-[#2E2E2E] text-xs text-[#E0DDD5] rounded-[2px] flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#C8102E]" />
                Stickers UV con Barniz
              </span>
              <span className="px-3 py-1 bg-[#1A1A1A] border border-[#2E2E2E] text-xs text-[#E0DDD5] rounded-[2px] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C8102E]" />
                Parches Bordados
              </span>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <a
                href={`https://wa.me/${brandConfig.contact.whatsapp}?text=${encodeURIComponent('Hola Leo! Quiero consultar para armar indumentaria personalizada para mi equipo/marca.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#C8102E] hover:bg-[#E01E37] text-white text-xs font-semibold uppercase tracking-wider rounded-[2px] transition-all focus-ring active:scale-[0.98]"
              >
                <MessageCircle className="w-4 h-4 text-white" />
                <span>Pedir presupuesto con Leo</span>
              </a>

              <button
                onClick={() => navigateToCatalog('Indumentaria')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#1C1C1C] hover:bg-[#282828] border border-[#333] text-[#F8F7F4] text-xs font-semibold uppercase tracking-wider rounded-[2px] transition-all focus-ring"
              >
                <span>Ver prendas base</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Column: 3 Steps Cards */}
          <div className="lg:col-span-7 space-y-4">
            {steps.map((step) => (
              <div
                key={step.num}
                className="p-6 bg-[#161616] border border-[#262626] hover:border-[#383838] rounded-[2px] transition-colors flex items-start gap-5"
              >
                <div className="w-12 h-12 rounded-[2px] bg-[#1F1F1F] border border-[#333] text-[#C8102E] font-display font-extrabold text-xl flex items-center justify-center shrink-0">
                  {step.num}
                </div>
                <div>
                  <h3 className="font-display font-bold text-base sm:text-lg text-[#F8F7F4]">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#9E9D99] mt-1.5 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
