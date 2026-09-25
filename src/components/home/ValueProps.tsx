import React from 'react';
import { Truck, RotateCcw, ShieldCheck, MessageSquare } from 'lucide-react';
import { brandConfig } from '../../config/brandConfig';

export const ValueProps: React.FC = () => {
  const benefits = [
    {
      icon: Truck,
      title: 'Envíos a todo el país',
      description: `Despachamos tu pedido por Andreani o Correo Argentino con código de seguimiento en tiempo real. Envío gratis superando los $80.000.`
    },
    {
      icon: RotateCcw,
      title: 'Cambios fáciles y sin vueltas',
      description: 'Tenés 30 días corridos para solicitar el cambio de talle o modelo. Gestionamos la logística de forma ágil para que no te preocupes.'
    },
    {
      icon: ShieldCheck,
      title: 'Pagos protegidos y cuotas',
      description: `${brandConfig.installmentsCount} cuotas sin interés con todas las tarjetas de crédito bancarias y 10% de descuento abonando por transferencia.`
    },
    {
      icon: MessageSquare,
      title: 'Atención personalizada',
      description: 'Estamos detrás de cada mensaje. Si tenés dudas sobre medidas exactas o el calce de una prenda, te asesoramos al instante por WhatsApp.'
    }
  ];

  return (
    <section className="py-16 bg-[#121212] border-b border-[#1E1E1E]" aria-labelledby="benefits-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 id="benefits-heading" className="sr-only">
          Nuestros compromisos y beneficios de compra
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {benefits.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-start p-6 bg-[#161616] border border-[#222222] rounded-[2px] hover:border-[#333333] transition-colors"
              >
                <div className="w-10 h-10 rounded-[2px] bg-[#1E1E1E] border border-[#2E2E2E] flex items-center justify-center mb-4 text-[#C85A32]">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-base text-[#F8F7F4] leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-[#9E9D99] mt-2 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
