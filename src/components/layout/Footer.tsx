import React from 'react';
import { brandConfig } from '../../config/brandConfig';
import { useStoreSettings } from '../../context/StoreSettingsContext';
import { useUI } from '../../context/UIContext';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { categoriesList } from '../../data/products';
import { ProductCategory } from '../../types';
import { MessageCircle, Mail, MapPin, Clock, ShieldCheck, Truck, CreditCard, RotateCcw } from 'lucide-react';
import { EditableText } from '../admin/EditableText';

export const Footer: React.FC = () => {
  const { navigateToCatalog, setIsSizeGuideOpen, setIsStoryModalOpen, setActiveView } = useUI();
  const { isAuthenticated } = useAdminAuth();
  const { settings, enabledCategories } = useStoreSettings();

  return (
    <footer className="bg-[#0B0B0B] border-t border-[#1F1F1F] text-[#9E9D99] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-[#1C1C1C] text-xs">
          <div className="p-4 bg-[#121212] border border-[#222] rounded-[2px]">
            <b className="block text-white uppercase font-display font-bold text-sm tracking-wide mb-1">
              <EditableText
                contentKey="footer.card1.title"
                defaultValue="Catálogo Real"
                label="Footer - Tarjeta 1 Título"
                as="span"
              />
            </b>
            <span className="text-[#8E8B84]">
              <EditableText
                contentKey="footer.card1.desc"
                defaultValue="Precios oficiales de Las Breñas con stock y personalización."
                label="Footer - Tarjeta 1 Detalle"
                as="span"
                multiline
              />
            </span>
          </div>
          <div className="p-4 bg-[#121212] border border-[#222] rounded-[2px]">
            <b className="block text-white uppercase font-display font-bold text-sm tracking-wide mb-1">
              <EditableText
                contentKey="footer.card2.title"
                defaultValue="Personalización"
                label="Footer - Tarjeta 2 Título"
                as="span"
              />
            </b>
            <span className="text-[#8E8B84]">
              <EditableText
                contentKey="footer.card2.desc"
                defaultValue="Indumentaria deportiva, parches bordados y transferencias UV."
                label="Footer - Tarjeta 2 Detalle"
                as="span"
                multiline
              />
            </span>
          </div>
          <div className="p-4 bg-[#121212] border border-[#222] rounded-[2px]">
            <b className="block text-white uppercase font-display font-bold text-sm tracking-wide mb-1">
              <EditableText
                contentKey="footer.card3.title"
                defaultValue="Retiro en Local"
                label="Footer - Tarjeta 3 Título"
                as="span"
              />
            </b>
            <span className="text-[#8E8B84]">
              <EditableText
                contentKey="footer.card3.desc"
                defaultValue={`${settings.contact.address}, Las Breñas sin costo de flete.`}
                label="Footer - Tarjeta 3 Detalle"
                as="span"
                multiline
              />
            </span>
          </div>
          <div className="p-4 bg-[#121212] border border-[#222] rounded-[2px]">
            <b className="block text-white uppercase font-display font-bold text-sm tracking-wide mb-1">
              <EditableText
                contentKey="footer.card4.title"
                defaultValue="WhatsApp Directo"
                label="Footer - Tarjeta 4 Título"
                as="span"
              />
            </b>
            <span className="text-[#8E8B84]">
              <EditableText
                contentKey="footer.card4.desc"
                defaultValue="Atención personalizada y asesoramiento directo con Leo."
                label="Footer - Tarjeta 4 Detalle"
                as="span"
                multiline
              />
            </span>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 py-14 border-b border-[#1C1C1C]">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={settings.logoUrl || "/media/logo-casacas-oficial.png"}
                alt={settings.brandName}
                className="h-10 w-auto object-contain"
              />
            </div>

            <div className="text-sm text-[#8E8C86] max-w-sm leading-relaxed">
              <EditableText
                contentKey="footer.brand_phrase"
                defaultValue={`${settings.tagline}. Prendas, accesorios y piezas diseñadas para acompañar a tu equipo, tu marca y tu forma de moverte.`}
                label="Footer - Frase descriptiva de la marca"
                multiline
                as="p"
              />
            </div>

            <div className="pt-2 space-y-2 text-xs text-[#B5B2AA]">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C8102E] shrink-0 mt-0.5" />
                <span>{settings.contact.address}, {settings.contact.addressDetail}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#C8102E] shrink-0" />
                <span>{settings.contact.hours}</span>
              </div>
              <div className="flex items-center gap-2">
                <img src="/media/whatsapp-logo.png" alt="WhatsApp" className="w-4 h-4 object-contain shrink-0" />
                <span>{settings.contact.whatsappFormatted}</span>
              </div>
            </div>
          </div>

          {/* Catalog Links */}
          <div className="space-y-4">
            <h3 className="font-display font-bold text-xs uppercase tracking-widest text-[#F8F7F4]">
              <EditableText
                contentKey="footer.col1.title"
                defaultValue="Catálogo"
                label="Footer - Columna 1 Título"
                as="span"
              />
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => navigateToCatalog('Todos')}
                  className="hover:text-white transition-colors text-left focus-ring"
                >
                  Ver todo el catálogo
                </button>
              </li>
              {enabledCategories.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => navigateToCatalog(cat.slug as any)}
                    className="hover:text-white transition-colors text-left focus-ring"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h3 className="font-display font-bold text-xs uppercase tracking-widest text-[#F8F7F4]">
              <EditableText
                contentKey="footer.col2.title"
                defaultValue="Secciones"
                label="Footer - Columna 2 Título"
                as="span"
              />
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a href="#personaliza" className="hover:text-white transition-colors">
                  Personalización para equipos
                </a>
              </li>
              <li>
                <a href="#opiniones" className="hover:text-white transition-colors">
                  Opiniones de clientes
                </a>
              </li>
              <li>
                <a href="#local" className="hover:text-white transition-colors">
                  Local, horarios & mapa
                </a>
              </li>
              <li>
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="hover:text-white transition-colors text-left focus-ring"
                >
                  Guía de talles y medidas
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsStoryModalOpen(true)}
                  className="hover:text-white transition-colors text-left focus-ring"
                >
                  Manifiesto de marca
                </button>
              </li>
            </ul>
          </div>

          {/* Confidence and Guarantees */}
          <div className="space-y-4">
            <h3 className="font-display font-bold text-xs uppercase tracking-widest text-[#F8F7F4]">
              <EditableText
                contentKey="footer.col3.title"
                defaultValue="Garantía de Taller"
                label="Footer - Columna 3 Título"
                as="span"
              />
            </h3>
            <div className="space-y-3 text-xs text-[#8E8C86]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C8102E] shrink-0 mt-0.5" />
                <EditableText
                  contentKey="footer.guarantee1"
                  defaultValue="Retiro exclusivo en nuestro local comercial en Las Breñas, Chaco."
                  label="Garantía 1"
                  as="span"
                />
              </div>
              <div className="flex items-start gap-2.5">
                <RotateCcw className="w-4 h-4 text-[#C8102E] shrink-0 mt-0.5" />
                <EditableText
                  contentKey="footer.guarantee2"
                  defaultValue="Atención directa con Leo para confirmar talles, muestras y detalles."
                  label="Garantía 2"
                  as="span"
                />
              </div>
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#C8102E] shrink-0 mt-0.5" />
                <EditableText
                  contentKey="footer.guarantee3"
                  defaultValue="Garantía de confección e impresión UV de alta adherencia."
                  label="Garantía 3"
                  as="span"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[#73716B]">
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            <span className="text-[11px] uppercase tracking-wider text-[#9E9D99] flex items-center gap-1.5 font-semibold">
              <CreditCard className="w-3.5 h-3.5 text-[#C8102E]" />
              <EditableText
                contentKey="footer.payment_label"
                defaultValue="Medios de pago:"
                label="Etiqueta medios de pago"
                as="span"
              />
            </span>
            <span className="px-2 py-1 bg-[#161616] border border-[#2B2B2B] rounded-[2px] text-[10px] text-[#D0CDC5]">
              Efectivo en local
            </span>
            <span className="px-2 py-1 bg-[#161616] border border-[#2B2B2B] rounded-[2px] text-[10px] text-[#D0CDC5]">
              Tarjetas de débito y crédito
            </span>
            <span className="px-2 py-1 bg-[#161616] border border-[#2B2B2B] rounded-[2px] text-[10px] text-[#D0CDC5]">
              Mercado Pago
            </span>
            <span className="px-2 py-1 bg-[#161616] border border-[#2B2B2B] rounded-[2px] text-[10px] text-[#C8102E] font-semibold">
              Transferencia bancaria
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-right">
            <p className="text-[11px] text-[#605E5A]">
              <EditableText
                contentKey="footer.copyright"
                defaultValue={`© ${new Date().getFullYear()} ${brandConfig.name}. Todos los derechos reservados.`}
                label="Texto de copyright"
                as="span"
              />
            </p>
            <button
              type="button"
              onClick={() => setActiveView(isAuthenticated ? 'admin-dashboard' : 'admin-login')}
              className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[#888] hover:text-[#C8102E] transition-colors cursor-pointer py-1 px-2.5 rounded-[2px] bg-[#161616] border border-[#2B2B2B] hover:border-[#C8102E]"
              title="Panel de Gestión y Stock"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#C8102E]" />
              <span>Acceso Administración</span>
            </button>
          </div>

        </div>

      </div>
    </footer>
  );
};
