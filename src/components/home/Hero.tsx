import React, { useState, useEffect, useRef } from 'react';
import { useUI } from '../../context/UIContext';
import { useStoreSettings } from '../../context/StoreSettingsContext';
import { useLiveEditor } from '../../context/LiveEditContext';
import { EditableText } from '../admin/EditableText';
import { brandConfig } from '../../config/brandConfig';
import { ArrowRight, ChevronLeft, ChevronRight, ShieldCheck, Sparkles, MapPin } from 'lucide-react';

const heroSlides = [
  {
    eyebrow: "INDUMENTARIA + IDENTIDAD",
    title: (
      <>
        HACÉ QUE <br />
        <span className="text-[#F8F7F4] underline decoration-[#C8102E] decoration-4 underline-offset-8">
          TE VEAN.
        </span>
      </>
    ),
    copy: "Prendas, accesorios y estampas para equipos que salen a jugar, marcas que quieren hacerse notar y personas que visten lo que creen.",
    image: "https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?auto=format&fit=crop&w=2000&q=85"
  },
  {
    eyebrow: "EQUIPOS + MARCAS",
    title: (
      <>
        VESTÍ <br />
        <span className="text-[#F8F7F4] underline decoration-[#C8102E] decoration-4 underline-offset-8">
          TU CÓDIGO.
        </span>
      </>
    ),
    copy: "Diseñamos prendas y piezas que hacen visible lo que une a tu equipo, tu marca y tu forma de moverte.",
    image: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=2000&q=85"
  },
  {
    eyebrow: "HECHO EN LAS BREÑAS",
    title: (
      <>
        MOVERTE <br />
        <span className="text-[#F8F7F4] underline decoration-[#C8102E] decoration-4 underline-offset-8">
          CON IDENTIDAD.
        </span>
      </>
    ),
    copy: "Del diseño a la entrega: una experiencia cercana para convertir tus ideas en piezas que representan.",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=2000&q=85"
  }
];

export const Hero: React.FC = () => {
  const { navigateToCatalog } = useUI();
  const { settings } = useStoreSettings();
  const { isLiveEditMode, getText, activeEditingKey } = useLiveEditor();

  const [isHeroHovered, setIsHeroHovered] = useState(false);
  const [isUserInteracting, setIsUserInteracting] = useState(false);

  const defaultTickerItems = [
    { key: 'home.ticker.item1', label: 'Cinta ticker 1', text: 'INDUMENTARIA DEPORTIVA' },
    { key: 'home.ticker.item2', label: 'Cinta ticker 2', text: 'SUBLIMACIÓN UV CON RELIEVE' },
    { key: 'home.ticker.item3', label: 'Cinta ticker 3', text: 'PERSONALIZACIÓN TOTAL' },
    { key: 'home.ticker.item4', label: 'Cinta ticker 4', text: 'PARA EQUIPOS Y MARCAS' },
    { key: 'home.ticker.item5', label: 'Cinta ticker 5', text: 'CONFECCIÓN & CALIDAD CHAQUEÑA' },
    { key: 'home.ticker.item6', label: 'Cinta ticker 6', text: 'RETIRO EN LOCAL LAS BREÑAS' },
  ];

  const fallbackSlidesData = [
    {
      eyebrow: "INDUMENTARIA + IDENTIDAD",
      titlePart1: "HACÉ QUE",
      highlightWord: "TE VEAN.",
      copy: "Prendas, accesorios y estampas para equipos que salen a jugar, marcas que quieren hacerse notar y personas que visten lo que creen.",
      image: "https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?auto=format&fit=crop&w=2000&q=85",
      primaryCta: "Explorar catálogo"
    },
    {
      eyebrow: "EQUIPOS + MARCAS",
      titlePart1: "VESTÍ",
      highlightWord: "TU CÓDIGO.",
      copy: "Diseñamos prendas y piezas que hacen visible lo que une a tu equipo, tu marca y tu forma de moverte.",
      image: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=2000&q=85",
      primaryCta: "Explorar catálogo"
    },
    {
      eyebrow: "HECHO EN LAS BREÑAS",
      titlePart1: "MOVERTE",
      highlightWord: "CON IDENTIDAD.",
      copy: "Del diseño a la entrega: una experiencia cercana para convertir tus ideas en piezas que representan.",
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=2000&q=85",
      primaryCta: "Explorar catálogo"
    }
  ];

  const slidesSource = settings.hero?.slides && settings.hero.slides.length > 0
    ? settings.hero.slides.map((s) => ({
        eyebrow: s.badge,
        titlePart1: s.title,
        highlightWord: s.highlightWord,
        copy: s.subtitle,
        image: s.bgImage,
        primaryCta: s.primaryCtaText || "Explorar catálogo"
      }))
    : fallbackSlidesData;

  const slides = slidesSource.map((s, idx) => {
    const eyebrow = getText(`hero.slide.${idx}.badge`, s.eyebrow);
    const titlePart1 = getText(`hero.slide.${idx}.title`, s.titlePart1);
    const highlightWord = getText(`hero.slide.${idx}.highlightWord`, s.highlightWord);
    const copy = getText(`hero.slide.${idx}.subtitle`, s.copy);
    const primaryCta = getText(`hero.slide.${idx}.primaryCtaText`, s.primaryCta);

    return {
      eyebrow,
      copy,
      image: s.image,
      primaryCta,
      title: (
        <>
          {titlePart1} <br />
          <span className="text-[#F8F7F4] underline decoration-[#C8102E] decoration-4 underline-offset-8">
            {highlightWord}
          </span>
        </>
      )
    };
  });

  const count = slides.length;
  // Extended array with clones: [last, ...slides, first]
  const extendedSlides = count > 1
    ? [slides[count - 1], ...slides, slides[0]]
    : slides;

  const [trackIndex, setTrackIndex] = useState(count > 1 ? 1 : 0);
  const [withTransition, setWithTransition] = useState(true);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const currentDragOffsetRef = useRef(0);
  const wasDraggedRef = useRef(false);
  const isTransitioningRef = useRef(false);
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-unlock transition lock to prevent freezing under rapid clicks
  const triggerTransitionLock = () => {
    isTransitioningRef.current = true;
    if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    transitionTimerRef.current = setTimeout(() => {
      isTransitioningRef.current = false;
    }, 340);
  };

  // Re-arm transitions after silent repositioning
  useEffect(() => {
    if (!withTransition) {
      const id = requestAnimationFrame(() => {
        setWithTransition(true);
      });
      return () => cancelAnimationFrame(id);
    }
  }, [withTransition]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    };
  }, []);

  // Active logical slide index (0 to count - 1)
  const activeSlideIndex = count > 1 ? (trackIndex - 1 + count) % count : 0;
  const slide = slides[activeSlideIndex] || slides[0];

  const nextSlide = () => {
    if (count <= 1) return;
    if (isTransitioningRef.current) {
      // If user is clicking rapidly at clone boundary, resolve immediately
      if (trackIndex >= count + 1) {
        setWithTransition(false);
        setTrackIndex(1);
        isTransitioningRef.current = false;
        return;
      }
    }
    triggerTransitionLock();
    setWithTransition(true);
    setTrackIndex((prev) => prev + 1);
  };

  const prevSlide = () => {
    if (count <= 1) return;
    if (isTransitioningRef.current) {
      if (trackIndex <= 0) {
        setWithTransition(false);
        setTrackIndex(count);
        isTransitioningRef.current = false;
        return;
      }
    }
    triggerTransitionLock();
    setWithTransition(true);
    setTrackIndex((prev) => prev - 1);
  };

  const goToSlide = (idx: number) => {
    if (count <= 1 || isTransitioningRef.current) return;
    triggerTransitionLock();
    setWithTransition(true);
    setTrackIndex(idx + 1);
  };

  // Seamless jump without reverse animation on clone boundary
  const handleTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    isTransitioningRef.current = false;
    if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    if (count <= 1) return;

    const trackEl = trackRef.current;

    if (trackIndex >= count + 1) {
      // Reached the clone of slide 1 at end -> jump silently to real slide 1
      if (trackEl) {
        trackEl.style.transition = 'none';
        trackEl.style.transform = 'translateX(-100%)';
        void trackEl.offsetHeight; // Synchronous reflow: commits new position without reverse animation
      }
      setWithTransition(false);
      setTrackIndex(1);
    } else if (trackIndex <= 0) {
      // Reached the clone of last slide at start -> jump silently to real last slide
      if (trackEl) {
        trackEl.style.transition = 'none';
        trackEl.style.transform = `translateX(-${count * 100}%)`;
        void trackEl.offsetHeight; // Synchronous reflow
      }
      setWithTransition(false);
      setTrackIndex(count);
    }
  };

  // Auto-play timer
  useEffect(() => {
    // Completely freeze carousel slides if:
    // 1. Live edit mode is enabled
    // 2. Any text is actively being edited (active popover)
    // 3. User is hovering over the hero
    // 4. User clicked or interacted with hero
    // 5. Dragging or only 1 slide
    if (isLiveEditMode || Boolean(activeEditingKey) || isHeroHovered || isUserInteracting || isDragging || count <= 1) {
      return;
    }

    const timer = setInterval(() => {
      nextSlide();
    }, 6000);

    return () => clearInterval(timer);
  }, [isLiveEditMode, activeEditingKey, isHeroHovered, isUserInteracting, isDragging, count, trackIndex]);

  // Drag & Swipe event handlers
  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    startXRef.current = clientX;
    currentDragOffsetRef.current = 0;
    wasDraggedRef.current = false;
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    const deltaX = clientX - startXRef.current;
    currentDragOffsetRef.current = deltaX;
    setDragOffset(deltaX);
    if (Math.abs(deltaX) > 8) {
      wasDraggedRef.current = true;
    }
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    const deltaX = currentDragOffsetRef.current;
    const threshold = 50;

    if (deltaX < -threshold) {
      nextSlide();
    } else if (deltaX > threshold) {
      prevSlide();
    }

    setIsDragging(false);
    setDragOffset(0);
    currentDragOffsetRef.current = 0;
  };

  return (
    <>
      <section
        className={`relative w-full min-h-[85vh] lg:min-h-[88vh] flex items-center justify-center overflow-hidden border-b border-[#222222] select-none ${
          isLiveEditMode ? 'cursor-default' : isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        aria-label="Presentación de la colección principal"
        onMouseEnter={() => setIsHeroHovered(true)}
        onMouseLeave={() => {
          setIsHeroHovered(false);
          if (!isLiveEditMode && !activeEditingKey) {
            setIsUserInteracting(false);
          }
        }}
        onClick={() => {
          setIsUserInteracting(true);
        }}
        onMouseDown={(e) => {
          setIsUserInteracting(true);
          if (isLiveEditMode) return;
          handleDragStart(e.clientX);
        }}
        onMouseMove={(e) => {
          if (isLiveEditMode) return;
          handleDragMove(e.clientX);
        }}
        onMouseUp={handleDragEnd}
        onTouchStart={(e) => {
          setIsUserInteracting(true);
          if (isLiveEditMode) return;
          handleDragStart(e.touches[0].clientX);
        }}
        onTouchMove={(e) => {
          if (isLiveEditMode) return;
          handleDragMove(e.touches[0].clientX);
        }}
        onTouchEnd={handleDragEnd}
      >
        {/* Background Editorial Images Track with Real Infinite Loop */}
        <div
          ref={trackRef}
          className="absolute inset-0 z-0 flex h-full pointer-events-none"
          onTransitionEnd={handleTransitionEnd}
          style={{
            transform: `translateX(calc(-${trackIndex * 100}% + ${dragOffset}px))`,
            transition: isDragging || !withTransition ? 'none' : 'transform 320ms cubic-bezier(0.2, 0.9, 0.3, 1)',
            willChange: 'transform'
          }}
        >
          {extendedSlides.map((s, idx) => (
            <div key={idx} className="relative w-full h-full flex-shrink-0 overflow-hidden">
              <img
                src={s.image}
                alt={`${settings.brandName} - ${s.eyebrow}`}
                className="w-full h-full object-cover object-center filter brightness-[0.88] contrast-[1.03] pointer-events-none select-none"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E0E]/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0E0E0E]/60 via-[#0E0E0E]/20 to-transparent pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-20 lg:py-28 flex flex-col justify-end min-h-[75vh]">
          <div className="max-w-2xl space-y-6 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#181818]/90 backdrop-blur-md border border-[#333333] text-[#F8F7F4] text-xs font-semibold uppercase tracking-wider rounded-[2px]">
                <Sparkles className="w-3.5 h-3.5 text-[#C8102E]" />
                <EditableText
                  contentKey={`hero.slide.${activeSlideIndex}.badge`}
                  defaultValue={settings.hero?.slides?.[activeSlideIndex]?.badge || "COLECCIÓN OFICIAL 2026"}
                  label={`Etiqueta Slide #${activeSlideIndex + 1}`}
                  as="span"
                />
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-[#C8102E]/20 border border-[#C8102E]/50 text-[#F8F7F4] text-xs font-semibold uppercase tracking-wider rounded-[2px]">
                <MapPin className="w-3.5 h-3.5 text-[#C8102E]" />
                <EditableText
                  contentKey="home.hero.location"
                  defaultValue={brandConfig.location}
                  label="Ubicación Hero"
                  as="span"
                />
              </span>
            </div>

            {/* Title */}
            <h1 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl text-[#F8F7F4] tracking-tight leading-[1.05]">
              {isLiveEditMode ? (
                <div className="flex flex-col gap-2">
                  <div>
                    <EditableText
                      contentKey={`hero.slide.${activeSlideIndex}.title`}
                      defaultValue={settings.hero?.slides?.[activeSlideIndex]?.title || "HACÉ QUE"}
                      label={`Título Slide #${activeSlideIndex + 1}`}
                      as="span"
                    />
                  </div>
                  <div>
                    <span className="text-[#F8F7F4] underline decoration-[#C8102E] decoration-4 underline-offset-8">
                      <EditableText
                        contentKey={`hero.slide.${activeSlideIndex}.highlightWord`}
                        defaultValue={settings.hero?.slides?.[activeSlideIndex]?.highlightWord || "TE VEAN."}
                        label={`Palabra destacada Slide #${activeSlideIndex + 1}`}
                        as="span"
                      />
                    </span>
                  </div>
                </div>
              ) : (
                slide.title
              )}
            </h1>

            {/* Subtitle */}
            <div className="text-base sm:text-lg lg:text-xl text-[#D0CDC5] font-normal leading-relaxed max-w-xl">
              <EditableText
                contentKey={`hero.slide.${activeSlideIndex}.subtitle`}
                defaultValue={settings.hero?.slides?.[activeSlideIndex]?.subtitle || "Prendas, accesorios y estampas para equipos que salen a jugar, marcas que quieren hacerse notar y personas que visten lo que creen."}
                label={`Subtítulo Slide #${activeSlideIndex + 1}`}
                multiline
                as="p"
              />
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <button
                onClick={(e) => {
                  if (wasDraggedRef.current || isLiveEditMode) {
                    e.preventDefault();
                    return;
                  }
                  navigateToCatalog('Todos');
                }}
                onMouseDown={(e) => e.stopPropagation()}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 bg-[#F8F7F4] hover:bg-white text-[#121212] font-semibold text-xs uppercase tracking-wider rounded-[2px] transition-all duration-150 active:scale-[0.98] shadow-lg focus-ring cursor-pointer"
              >
                <EditableText
                  contentKey={`hero.slide.${activeSlideIndex}.primaryCtaText`}
                  defaultValue={settings.hero?.slides?.[activeSlideIndex]?.primaryCtaText || "Explorar catálogo"}
                  label={`Texto botón Slide #${activeSlideIndex + 1}`}
                  as="span"
                />
                <ArrowRight className="w-4 h-4 text-[#121212]" />
              </button>

              <a
                href="#personaliza"
                onClick={(e) => {
                  if (wasDraggedRef.current) {
                    e.preventDefault();
                    return;
                  }
                }}
                onMouseDown={(e) => e.stopPropagation()}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 bg-[#1A1A1A]/80 hover:bg-[#252525] backdrop-blur-md border border-[#3A3A3A] text-[#F8F7F4] font-semibold text-xs uppercase tracking-wider rounded-[2px] transition-all duration-150 active:scale-[0.98] focus-ring cursor-pointer"
              >
                <EditableText
                  contentKey="home.hero.secondaryCta"
                  defaultValue="Personalizá tu equipo"
                  label="Texto botón secundario Hero"
                  as="span"
                />
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="pt-6 border-t border-[#333333]/70 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-[#B5B2A9]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C8102E] shrink-0" />
                <EditableText
                  contentKey="home.hero.trust1"
                  defaultValue="Precios oficiales de Las Breñas"
                  label="Indicador de confianza 1"
                  as="span"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#25D366] shrink-0"></span>
                <EditableText
                  contentKey="home.hero.trust2"
                  defaultValue="Atención directa por WhatsApp"
                  label="Indicador de confianza 2"
                  as="span"
                />
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C8102E] shrink-0"></span>
                <EditableText
                  contentKey="home.hero.trust3"
                  defaultValue="Retiro en local Las Breñas"
                  label="Indicador de confianza 3"
                  as="span"
                />
              </div>
            </div>

          </div>

          {/* Carousel Navigation Arrows & Dots & Drag Hint */}
          <div className="flex items-center justify-between sm:justify-start gap-4 pt-8">
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevSlide();
                }}
                onMouseDown={(e) => e.stopPropagation()}
                className="w-10 h-10 rounded-[2px] bg-[#1A1A1A]/80 border border-[#333] hover:border-[#666] text-white flex items-center justify-center transition-colors focus-ring cursor-pointer"
                aria-label="Slide anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextSlide();
                }}
                onMouseDown={(e) => e.stopPropagation()}
                className="w-10 h-10 rounded-[2px] bg-[#1A1A1A]/80 border border-[#333] hover:border-[#666] text-white flex items-center justify-center transition-colors focus-ring cursor-pointer"
                aria-label="Slide siguiente"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    goToSlide(idx);
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === activeSlideIndex ? 'w-8 bg-[#C8102E]' : 'w-2 bg-[#555] hover:bg-[#888]'
                  }`}
                  aria-label={`Ir al slide ${idx + 1}`}
                />
              ))}
            </div>

            {isLiveEditMode ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1A1A1A]/90 border border-amber-500/40 rounded-[2px] text-amber-300 text-xs font-medium ml-2">
                <span>⏸️ Animación pausada para editar (Slide {activeSlideIndex + 1} de {count})</span>
              </span>
            ) : (
              <span className="hidden md:inline-flex items-center text-[10px] uppercase tracking-widest text-[#7E7B74] ml-2 select-none">
                ← Arrastrá con el mouse →
              </span>
            )}
          </div>

        </div>
      </section>

      {/* Continuous Marquee Ticker Banner */}
      <div className="bg-[#141414] border-b border-[#222] py-3.5 overflow-hidden select-none" aria-hidden="true">
        {isLiveEditMode ? (
          <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs font-display font-bold uppercase tracking-widest text-[#B5B2AA]">
            {defaultTickerItems.map((item) => (
              <span key={item.key} className="inline-flex items-center gap-2 bg-[#1A1A1A] px-3 py-1.5 rounded-[2px] border border-[#2D2D2D]">
                <span className="text-[#C8102E]">★</span>
                <EditableText
                  contentKey={item.key}
                  defaultValue={item.text}
                  label={item.label}
                  as="span"
                />
              </span>
            ))}
          </div>
        ) : (
          <div className="hero-ticker-track flex items-center whitespace-nowrap">
            <div className="flex items-center gap-8 text-xs font-display font-bold uppercase tracking-widest text-[#B5B2AA] pr-8 shrink-0">
              {defaultTickerItems.map((item) => (
                <span key={`t1-${item.key}`} className="flex items-center gap-3">
                  <span className="text-[#C8102E]">★</span>
                  <span>{getText(item.key, item.text)}</span>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-8 text-xs font-display font-bold uppercase tracking-widest text-[#B5B2AA] pr-8 shrink-0">
              {defaultTickerItems.map((item) => (
                <span key={`t2-${item.key}`} className="flex items-center gap-3">
                  <span className="text-[#C8102E]">★</span>
                  <span>{getText(item.key, item.text)}</span>
                </span>
              ))}
            </div>
          </div>
        )}
        <style>{`
          .hero-ticker-track {
            display: flex !important;
            width: max-content !important;
            animation: heroTickerScroll 30s linear infinite !important;
            will-change: transform;
          }
          .hero-ticker-track:hover {
            animation-play-state: paused !important;
          }
          @keyframes heroTickerScroll {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </div>
    </>
  );
};
