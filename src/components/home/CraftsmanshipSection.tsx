import React from 'react';
import { Layers, Droplets, CheckCircle, ShieldCheck } from 'lucide-react';

export const CraftsmanshipSection: React.FC = () => {
  const specs = [
    {
      icon: Layers,
      title: 'Gramaje Pesado y Caída Estructurada',
      subtitle: 'Algodón 24/1 & Frisa 380g',
      description: 'Seleccionamos hilos peinados de fibra larga. Las remeras y buzos tienen cuerpo propio y no pierden la forma ni se deforman en los hombros tras múltiples lavados.'
    },
    {
      icon: CheckCircle,
      title: 'Costuras Reforzadas de 4 Hilos',
      subtitle: 'Resistencia a la tracción urbana',
      description: 'Remalle interior de cuatro hilos y pespunte de refuerzo en cuello, sisas y dobladillos. Cada unión está pensada para acompañar el movimiento activo diario.'
    },
    {
      icon: Droplets,
      title: 'Teñido Reactivo y Fijación de Color',
      subtitle: 'Lavados sostenibles',
      description: 'Proceso de tintorería industrial con fijación térmica. Los negros y crudos se mantienen firmes y no manchan otras prendas durante el lavado en casa.'
    },
    {
      icon: ShieldCheck,
      title: 'Guía de Cuidado Simple',
      subtitle: 'Durabilidad garantizada',
      description: 'Recomendamos agua fría (30°C), secado a la sombra en percha y plancha tibia del revés. Así extendés la vida útil de tus prendas por años.'
    }
  ];

  return (
    <section className="py-20 bg-[#121212] border-b border-[#1E1E1E]" aria-labelledby="materials-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-widest font-semibold text-[#C85A32]">
            Transparencia y Calidad
          </span>
          <h2 id="materials-heading" className="font-display font-bold text-3xl sm:text-4xl text-[#F8F7F4] mt-1.5">
            Materiales y Confección
          </h2>
          <p className="text-xs sm:text-sm text-[#9E9D99] mt-3 leading-relaxed">
            Sin promesas exageradas ni fórmulas secretas: telas de alto gramaje, molderías probadas y terminaciones que se sienten desde el primer contacto.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {specs.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="p-6 bg-[#161616] border border-[#242424] hover:border-[#383838] rounded-[2px] transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-[2px] bg-[#1E1E1E] border border-[#2D2D2D] flex items-center justify-center text-[#C85A32] mb-5">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-bold text-base text-[#F8F7F4] leading-snug">
                    {item.title}
                  </h3>
                  <span className="inline-block text-[11px] font-mono text-[#C85A32] mt-1 uppercase tracking-wide">
                    {item.subtitle}
                  </span>
                  <p className="text-xs text-[#9E9D99] mt-3 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-5 mt-5 border-t border-[#202020] text-[11px] text-[#6E6C67] flex items-center gap-1.5 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C85A32]"></span>
                  <span>Estándar VORÁGINE STUDIO</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
