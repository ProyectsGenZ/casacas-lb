import React from 'react';
import { brandConfig } from '../../config/brandConfig';
import { MapPin, Clock, MessageCircle, Instagram, ExternalLink, ShieldCheck } from 'lucide-react';

export const LocalSection: React.FC = () => {
  return (
    <section id="local" className="py-20 lg:py-28 bg-[#121212] border-b border-[#222] scroll-mt-16" aria-labelledby="local-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14">
          
          {/* Left Column: Heading and CTAs (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-xs uppercase tracking-widest font-semibold text-[#C8102E] flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                Estamos Cerca
              </span>
              <h2 id="local-heading" className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#F8F7F4] mt-2 leading-[1.1]">
                Local, horarios <br />
                <span className="text-[#C8102E]">& contacto.</span>
              </h2>
            </div>

            <p className="text-sm sm:text-base text-[#B5B2AA] leading-relaxed">
              Coordiná tu pedido directo con Leo. El diseño final, las muestras y la producción se confirman por WhatsApp para que tengas exactamente lo que imaginás.
            </p>

            <div className="pt-2 space-y-3">
              <a
                href={`https://wa.me/${brandConfig.contact.whatsapp}?text=${encodeURIComponent(brandConfig.contact.whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 w-full py-4 bg-[#25D366] hover:bg-[#20BA5A] text-[#121212] font-semibold text-xs uppercase tracking-wider rounded-[2px] transition-all shadow-md active:scale-[0.98] focus-ring"
              >
                <MessageCircle className="w-4 h-4 text-[#121212]" />
                <span>Escribir por WhatsApp a Leo</span>
              </a>

              <a
                href={brandConfig.contact.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#1C1C1C] hover:bg-[#252525] border border-[#333] text-xs font-semibold text-[#F8F7F4] uppercase tracking-wider rounded-[2px] transition-colors focus-ring"
              >
                <span>Abrir ubicación en Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#C8102E]" />
              </a>
            </div>

            <div className="p-4 bg-[#181818] border border-[#242424] rounded-[2px] flex items-center gap-3 text-xs text-[#9E9D99]">
              <ShieldCheck className="w-5 h-5 text-[#C8102E] shrink-0" />
              <span>Retiro inmediato en el local sin costo de flete. Envíos coordinados a toda la provincia y el país.</span>
            </div>
          </div>

          {/* Right Column: Local info cards & Google Map embed (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Info cards row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card 1: Retiro */}
              <div className="p-5 bg-[#161616] border border-[#262626] rounded-[2px] space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#C8102E] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  Retiro en el local
                </span>
                <strong className="block font-display font-bold text-base text-white">
                  {brandConfig.contact.address}
                </strong>
                <p className="text-xs text-[#9E9D99] leading-relaxed">
                  {brandConfig.contact.addressDetail}
                </p>
              </div>

              {/* Card 2: Horarios */}
              <div className="p-5 bg-[#161616] border border-[#262626] rounded-[2px] space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#C8102E] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Horarios de atención
                </span>
                <strong className="block font-display font-bold text-base text-white">
                  Lunes a viernes
                </strong>
                <p className="text-xs text-[#9E9D99] leading-relaxed">
                  09:00 a 12:00 hs <br />
                  15:00 a 21:00 hs
                </p>
              </div>
            </div>

            {/* Embedded Google Map */}
            <div className="relative w-full h-80 sm:h-96 rounded-[2px] overflow-hidden border border-[#282828] bg-[#141414]">
              <iframe
                title="Ubicación oficial de CASACAS LB en Las Breñas, Chaco"
                src={brandConfig.contact.mapsEmbedUrl}
                className="w-full h-full border-0 filter contrast-[1.1] grayscale-[0.3]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="absolute bottom-3 left-3 bg-[#0E0E0E]/90 backdrop-blur-md px-3 py-1.5 border border-[#333] rounded-[2px] text-[11px] font-bold tracking-wider text-white">
                LAS BREÑAS · CHACO
              </div>
            </div>

            {/* Channels Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[#161616] border border-[#242424] rounded-[2px] text-xs text-[#A09D96]">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">Atención con Leo:</span>
                <span className="font-mono text-[#F8F7F4]">{brandConfig.contact.whatsappFormatted}</span>
              </div>
              <a
                href={brandConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[#C8102E] hover:underline font-semibold"
              >
                <Instagram className="w-4 h-4 text-[#E1306C]" />
                <span>{brandConfig.social.instagramHandle}</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
