import React from 'react';
import { useStoreSettings } from '../../context/StoreSettingsContext';
import { useLiveEditor } from '../../context/LiveEditContext';
import { EditableText } from '../admin/EditableText';

export const AnnouncementBar: React.FC = () => {
  const { settings } = useStoreSettings();
  const { isLiveEditMode, getText } = useLiveEditor();
  const items = [1, 2, 3, 4];

  if (!settings.announcement?.enabled) return null;

  const currentBadge = getText('announcement.badge', settings.announcement.badge);
  const currentText = getText('announcement.text', settings.announcement.text);

  return (
    <aside
      className="bg-[#121212] border-b border-[#222222] text-xs text-[#E5E2DA] py-2 overflow-hidden select-none relative z-30"
      aria-label="Anuncios y promociones de la tienda"
    >
      {isLiveEditMode ? (
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-3">
          <EditableText
            contentKey="announcement.badge"
            defaultValue={settings.announcement.badge}
            label="Etiqueta anuncio superior"
            className="bg-[#C8102E] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-[2px] tracking-wider uppercase shrink-0"
          />
          <EditableText
            contentKey="announcement.text"
            defaultValue={settings.announcement.text}
            label="Texto anuncio superior"
            className="text-[11px] sm:text-xs font-semibold tracking-wide text-[#E5E2DA] shrink-0"
          />
        </div>
      ) : (
        <div className="w-full overflow-hidden flex">
          <div className="marquee-scroller flex items-center whitespace-nowrap">
            {/* Primer bloque de elementos */}
            <div className="flex items-center shrink-0">
              {items.map((i) => (
                <div key={`track1-${i}`} className="inline-flex items-center gap-3 px-6 sm:px-10 shrink-0">
                  <span className="bg-[#C8102E] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-[2px] tracking-wider uppercase shrink-0">
                    {currentBadge}
                  </span>
                  <span className="text-[11px] sm:text-xs font-semibold tracking-wide text-[#E5E2DA] shrink-0">
                    {currentText}
                  </span>
                  <span className="text-[#C8102E] font-bold mx-2 shrink-0">•</span>
                </div>
              ))}
            </div>

            {/* Segundo bloque idéntico para loop continuo sin saltos */}
            <div className="flex items-center shrink-0" aria-hidden="true">
              {items.map((i) => (
                <div key={`track2-${i}`} className="inline-flex items-center gap-3 px-6 sm:px-10 shrink-0">
                  <span className="bg-[#C8102E] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-[2px] tracking-wider uppercase shrink-0">
                    {currentBadge}
                  </span>
                  <span className="text-[11px] sm:text-xs font-semibold tracking-wide text-[#E5E2DA] shrink-0">
                    {currentText}
                  </span>
                  <span className="text-[#C8102E] font-bold mx-2 shrink-0">•</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .marquee-scroller {
          display: flex !important;
          width: max-content !important;
          animation: marqueeScroll 25s linear infinite !important;
          will-change: transform;
        }
        .marquee-scroller:hover {
          animation-play-state: paused !important;
        }
        @keyframes marqueeScroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </aside>
  );
};
