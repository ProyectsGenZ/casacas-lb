import React, { useState, useEffect, useRef } from 'react';
import { useUI } from '../../context/UIContext';
import { useStoreSettings } from '../../context/StoreSettingsContext';
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
  const [currentSlide, setCurrentSlide] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const currentDragOffsetRef = useRef(0);
  const wasDraggedRef = useRef(false);

  const slides = [
    {
      eyebrow: settings.hero?.badge || "INDUMENTARIA + IDENTIDAD",
      title: (
        <>
          {settings.hero?.title || "HACÉ QUE"} <br />
          <span className="text-[#F8F7F4] underline decoration-[#C8102E] decoration-4 underline-offset-8">
            {settings.hero?.highlightWord || "TE VEAN."}
          </span>
        </>
      ),
      copy: settings.hero?.subtitle || "Prendas, accesorios y estampas para equipos que salen a jugar, marcas que quieren hacerse notar y personas que visten lo que creen.",
      image: settings.hero?.bgImage || "https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?auto=format&fit=crop&w=2000&q=85",
      primaryCta: settings.hero?.primaryCtaText || "Explorar catálogo"
    },
    heroSlides[1],
    heroSlides[2]
  ];

  // Auto-play timer that pauses while dragging
  useEffect(() => {
    if (isDragging) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isDragging, currentSlide, slides.length]);

  // Drag & Swipe event handlers (mouse and touch)
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
    const threshold = 60; // Pixels required to switch slide

    if (deltaX < -threshold) {
      // Swiped left -> Next slide
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    } else if (deltaX > threshold) {
      // Swiped right -> Previous slide
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    }

    setIsDragging(false);
    setDragOffset(0);
    currentDragOffsetRef.current = 0;
  };

  const slide = slides[currentSlide];

  return (
    <>
      <section
        className={`relative w-full min-h-[85vh] lg:min-h-[88vh] flex items-center justify-center overflow-hidden border-b border-[#222222] select-none ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        aria-label="Presentación de la colección principal"
        onMouseDown={(e) => handleDragStart(e.clientX)}
        onMouseMove={(e) => handleDragMove(e.clientX)}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
        onTouchEnd={handleDragEnd}
      >
        {/* Background Editorial Images Track with Real-Time Drag Translation */}
        <div
          className="absolute inset-0 z-0 flex h-full pointer-events-none"
          style={{
            transform: `translateX(calc(-${currentSlide * 100}% + ${dragOffset}px))`,
            transition: isDragging ? 'none' : 'transform 550ms cubic-bezier(0.16, 1, 0.3, 1)',
            willChange: 'transform'
          }}
        >
          {slides.map((s, idx) => (
            <div key={idx} className="relative w-full h-full flex-shrink-0 overflow-hidden">
              <img
                src={s.image}
                alt={`${settings.brandName} - ${s.eyebrow}`}
                className="w-full h-full object-cover object-center filter brightness-[0.62] contrast-[1.08] pointer-events-none select-none"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E0E] via-[#0E0E0E]/40 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0E0E0E]/90 via-[#0E0E0E]/50 to-transparent pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-20 lg:py-28 flex flex-col justify-end min-h-[75vh]">
          <div className="max-w-2xl space-y-6">
            
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#181818]/90 backdrop-blur-md border border-[#333333] text-[#F8F7F4] text-xs font-semibold uppercase tracking-wider rounded-[2px]">
                <Sparkles className="w-3.5 h-3.5 text-[#C8102E]" />
                {slide.eyebrow}
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-[#C8102E]/20 border border-[#C8102E]/50 text-[#F8F7F4] text-xs font-semibold uppercase tracking-wider rounded-[2px]">
                <MapPin className="w-3.5 h-3.5 text-[#C8102E]" />
                {brandConfig.location}
              </span>
            </div>

            {/* Title */}
            <h1 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl text-[#F8F7F4] tracking-tight leading-[1.05]">
              {slide.title}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg lg:text-xl text-[#D0CDC5] font-normal leading-relaxed max-w-xl">
              {slide.copy}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <button
                onClick={(e) => {
                  if (wasDraggedRef.current) {
                    e.preventDefault();
                    return;
                  }
                  navigateToCatalog('Todos');
                }}
                onMouseDown={(e) => e.stopPropagation()}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 bg-[#F8F7F4] hover:bg-white text-[#121212] font-semibold text-xs uppercase tracking-wider rounded-[2px] transition-all duration-150 active:scale-[0.98] shadow-lg focus-ring cursor-pointer"
              >
                <span>{(slide as any).primaryCta || "Explorar catálogo"}</span>
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
                <span>Personalizá tu equipo</span>
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="pt-6 border-t border-[#333333]/70 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-[#B5B2A9]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C8102E] shrink-0" />
                <span>Precios oficiales de Las Breñas</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#25D366] shrink-0"></span>
                <span>Atención directa por WhatsApp</span>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C8102E] shrink-0"></span>
                <span>Envíos a todo el país</span>
              </div>
            </div>

          </div>

          {/* Carousel Navigation Arrows & Dots & Drag Hint */}
          <div className="flex items-center justify-between sm:justify-start gap-4 pt-8">
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentSlide((c) => (c - 1 + heroSlides.length) % heroSlides.length);
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
                  setCurrentSlide((c) => (c + 1) % heroSlides.length);
                }}
                onMouseDown={(e) => e.stopPropagation()}
                className="w-10 h-10 rounded-[2px] bg-[#1A1A1A]/80 border border-[#333] hover:border-[#666] text-white flex items-center justify-center transition-colors focus-ring cursor-pointer"
                aria-label="Slide siguiente"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              {heroSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentSlide(idx);
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === currentSlide ? 'w-8 bg-[#C8102E]' : 'w-2 bg-[#555] hover:bg-[#888]'
                  }`}
                  aria-label={`Ir al slide ${idx + 1}`}
                />
              ))}
            </div>

            <span className="hidden md:inline-flex items-center text-[10px] uppercase tracking-widest text-[#7E7B74] ml-2 select-none">
              ← Arrastrá con el mouse →
            </span>
          </div>

        </div>
      </section>

      {/* Continuous Marquee Ticker Banner */}
      <div className="bg-[#141414] border-b border-[#222] py-3.5 overflow-hidden select-none" aria-hidden="true">
        <div className="hero-ticker-track flex items-center whitespace-nowrap">
          <div className="flex items-center gap-8 text-xs font-display font-bold uppercase tracking-widest text-[#B5B2AA] pr-8 shrink-0">
            <span className="flex items-center gap-3">
              <span className="text-[#C8102E]">★</span> INDUMENTARIA DEPORTIVA
            </span>
            <span className="flex items-center gap-3">
              <span className="text-[#C8102E]">★</span> SUBLIMACIÓN UV CON RELIEVE
            </span>
            <span className="flex items-center gap-3">
              <span className="text-[#C8102E]">★</span> PERSONALIZACIÓN TOTAL
            </span>
            <span className="flex items-center gap-3">
              <span className="text-[#C8102E]">★</span> PARA EQUIPOS Y MARCAS
            </span>
            <span className="flex items-center gap-3">
              <span className="text-[#C8102E]">★</span> CONFECCIÓN & CALIDAD CHAQUEÑA
            </span>
            <span className="flex items-center gap-3">
              <span className="text-[#C8102E]">★</span> RETIRO EN LOCAL LAS BREÑAS
            </span>
          </div>
          <div className="flex items-center gap-8 text-xs font-display font-bold uppercase tracking-widest text-[#B5B2AA] pr-8 shrink-0">
            <span className="flex items-center gap-3">
              <span className="text-[#C8102E]">★</span> INDUMENTARIA DEPORTIVA
            </span>
            <span className="flex items-center gap-3">
              <span className="text-[#C8102E]">★</span> SUBLIMACIÓN UV CON RELIEVE
            </span>
            <span className="flex items-center gap-3">
              <span className="text-[#C8102E]">★</span> PERSONALIZACIÓN TOTAL
            </span>
            <span className="flex items-center gap-3">
              <span className="text-[#C8102E]">★</span> PARA EQUIPOS Y MARCAS
            </span>
            <span className="flex items-center gap-3">
              <span className="text-[#C8102E]">★</span> CONFECCIÓN & CALIDAD CHAQUEÑA
            </span>
            <span className="flex items-center gap-3">
              <span className="text-[#C8102E]">★</span> RETIRO EN LOCAL LAS BREÑAS
            </span>
          </div>
        </div>
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
