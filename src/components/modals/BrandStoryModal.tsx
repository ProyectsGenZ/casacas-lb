import React, { useEffect } from 'react';
import { useUI } from '../../context/UIContext';
import { brandConfig } from '../../config/brandConfig';
import { X, MapPin, Clock, MessageCircle, Instagram, ShieldCheck } from 'lucide-react';

export const BrandStoryModal: React.FC = () => {
  const { isStoryModalOpen, setIsStoryModalOpen } = useUI();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isStoryModalOpen) {
        setIsStoryModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isStoryModalOpen, setIsStoryModalOpen]);

  if (!isStoryModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 lg:p-12 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Historia y Manifiesto de Marca"
    >
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsStoryModalOpen(false)} />

      <div className="relative max-w-2xl w-full bg-[#141414] border border-[#2A2A2A] rounded-[2px] shadow-2xl p-6 sm:p-8 z-10 space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#242424]">
          <div>
            <span className="text-xs uppercase tracking-widest font-semibold text-[#C85A32]">
              Manifiesto & Origen
            </span>
            <h2 className="font-display font-bold text-2xl text-[#F8F7F4] mt-1">
              Sobre {brandConfig.name}
            </h2>
          </div>
          <button
            onClick={() => setIsStoryModalOpen(false)}
            className="p-1 text-[#888] hover:text-white"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Narrative */}
        <div className="space-y-4 text-xs sm:text-sm text-[#B5B2AA] leading-relaxed">
          <p>
            <strong className="text-white">CASACAS LB</strong> nació con una premisa clara: vestir a quienes salen a jugar, a las personas que eligen moverse con carácter y a los equipos que buscan una identidad visual auténtica.
          </p>
          <p>
            Desde nuestro taller y local en <strong className="text-white">Las Breñas, Chaco</strong>, combinamos la estética deportiva retro con la silueta del streetwear urbano moderno. Cada casaca, buzo y prenda que producimos está pensada para resistir el uso real, sin atajos en materiales ni costuras flojas.
          </p>
          <p>
            Creemos en la producción responsable, el trato directo con cada persona que nos elige y el orgullo de fabricar indumentaria con identidad federal desde Las Breñas para toda la región.
          </p>
        </div>

        {/* Local Information */}
        <div className="p-5 bg-[#181818] border border-[#262626] rounded-[2px] space-y-3">
          <h3 className="font-display font-bold text-sm text-[#F8F7F4] uppercase tracking-wider text-[#C85A32]">
            Local y Retiro de Pedidos
          </h3>
          <div className="space-y-2 text-xs text-[#C8C5BD]">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#C85A32] shrink-0" />
              <span>{brandConfig.contact.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#C85A32] shrink-0" />
              <span>{brandConfig.contact.hours}</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C85A32] shrink-0" />
              <span>Retiro inmediato de compras online sin costo de envío</span>
            </div>
          </div>
        </div>

        {/* Direct Channels */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <a
            href={`https://wa.me/${brandConfig.contact.whatsapp}?text=${encodeURIComponent(brandConfig.contact.whatsappMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-3 bg-[#1F1F1F] hover:bg-[#282828] border border-[#333] text-xs font-semibold uppercase text-white rounded-[2px] transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-[#25D366]" />
            <span>Hablar por WhatsApp</span>
          </a>
          <a
            href={brandConfig.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-3 bg-[#1F1F1F] hover:bg-[#282828] border border-[#333] text-xs font-semibold uppercase text-white rounded-[2px] transition-colors"
          >
            <Instagram className="w-4 h-4 text-[#E1306C]" />
            <span>{brandConfig.social.instagramHandle}</span>
          </a>
        </div>

      </div>
    </div>
  );
};
