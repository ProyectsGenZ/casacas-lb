import React from 'react';
import { Layers, Droplets, CheckCircle, ShieldCheck } from 'lucide-react';
import { EditableText } from '../admin/EditableText';

export const CraftsmanshipSection: React.FC = () => {
  const specs = [
    {
      icon: Layers,
      titleKey: 'home.craft.spec0.title',
      title: 'Gramaje Pesado y Caída Estructurada',
      subKey: 'home.craft.spec0.subtitle',
      subtitle: 'Algodón 24/1 & Frisa 380g',
      descKey: 'home.craft.spec0.desc',
      description: 'Seleccionamos hilos peinados de fibra larga. Las remeras y buzos tienen cuerpo propio y no pierden la forma ni se deforman en los hombros tras múltiples lavados.'
    },
    {
      icon: CheckCircle,
      titleKey: 'home.craft.spec1.title',
      title: 'Costuras Reforzadas de 4 Hilos',
      subKey: 'home.craft.spec1.subtitle',
      subtitle: 'Resistencia a la tracción urbana',
      descKey: 'home.craft.spec1.desc',
      description: 'Remalle interior de cuatro hilos y pespunte de refuerzo en cuello, sisas y dobladillos. Cada unión está pensada para acompañar el movimiento activo diario.'
    },
    {
      icon: Droplets,
      titleKey: 'home.craft.spec2.title',
      title: 'Teñido Reactivo y Fijación de Color',
      subKey: 'home.craft.spec2.subtitle',
      subtitle: 'Lavados sostenibles',
      descKey: 'home.craft.spec2.desc',
      description: 'Proceso de tintorería industrial con fijación térmica. Los negros y crudos se mantienen firmes y no manchan otras prendas durante el lavado en casa.'
    },
    {
      icon: ShieldCheck,
      titleKey: 'home.craft.spec3.title',
      title: 'Guía de Cuidado Simple',
      subKey: 'home.craft.spec3.subtitle',
      subtitle: 'Durabilidad garantizada',
      descKey: 'home.craft.spec3.desc',
      description: 'Recomendamos agua fría (30°C), secado a la sombra en percha y plancha tibia del revés. Así extendés la vida útil de tus prendas por años.'
    }
  ];

  return (
    <section className="py-20 bg-[#121212] border-b border-[#1E1E1E]" aria-labelledby="materials-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <EditableText
            contentKey="home.craft.eyebrow"
            defaultValue="Transparencia y Calidad"
            label="Subtítulo sección materiales"
            as="span"
            className="text-xs uppercase tracking-widest font-semibold text-[#C85A32]"
          />
          <div className="mt-1.5">
            <EditableText
              contentKey="home.craft.heading"
              defaultValue="Materiales y Confección"
              label="Título sección materiales"
              as="h2"
              className="font-display font-bold text-3xl sm:text-4xl text-[#F8F7F4]"
            />
          </div>
          <div className="mt-3 leading-relaxed">
            <EditableText
              contentKey="home.craft.description"
              defaultValue="Sin promesas exageradas ni fórmulas secretas: telas de alto gramaje, molderías probadas y terminaciones que se sienten desde el primer contacto."
              label="Bajada sección materiales"
              multiline
              as="p"
              className="text-xs sm:text-sm text-[#9E9D99]"
            />
          </div>
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
                    <EditableText
                      contentKey={item.titleKey}
                      defaultValue={item.title}
                      label={`Material ${index + 1} - Título`}
                      as="span"
                    />
                  </h3>
                  <div className="mt-1">
                    <EditableText
                      contentKey={item.subKey}
                      defaultValue={item.subtitle}
                      label={`Material ${index + 1} - Subtítulo`}
                      as="span"
                      className="inline-block text-[11px] font-mono text-[#C85A32] uppercase tracking-wide"
                    />
                  </div>
                  <div className="mt-3 leading-relaxed">
                    <EditableText
                      contentKey={item.descKey}
                      defaultValue={item.description}
                      label={`Material ${index + 1} - Detalle`}
                      multiline
                      as="p"
                      className="text-xs text-[#9E9D99]"
                    />
                  </div>
                </div>

                <div className="pt-5 mt-5 border-t border-[#202020] text-[11px] text-[#6E6C67] flex items-center gap-1.5 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C85A32]"></span>
                  <EditableText
                    contentKey="home.craft.standard_label"
                    defaultValue="Estándar VORÁGINE STUDIO"
                    label="Sello estándar taller"
                    as="span"
                  />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
