import React from 'react';
import { reviewsData } from '../../data/products';
import { Star, MessageSquareQuote } from 'lucide-react';

export const OpinionsSection: React.FC = () => {
  return (
    <section id="opiniones" className="py-20 bg-[#0E0E0E] border-b border-[#222] scroll-mt-16" aria-labelledby="opinions-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs uppercase tracking-widest font-semibold text-[#C8102E] flex items-center gap-1.5">
              <MessageSquareQuote className="w-4 h-4" />
              Lo que dicen de Casacas
            </span>
            <h2 id="opinions-heading" className="font-display font-bold text-3xl sm:text-4xl text-[#F8F7F4] mt-1.5">
              Opiniones Reales
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#8E8B84] max-w-sm leading-relaxed">
            Experiencias de clientes, clubes y emprendimientos que eligen el taller de CASACAS LB en Las Breñas.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviewsData.map((review) => (
            <article
              key={review.id}
              className={`p-7 rounded-[2px] border flex flex-col justify-between transition-colors ${
                review.featured
                  ? 'bg-[#181818] border-[#C8102E]/60 shadow-xl'
                  : 'bg-[#141414] border-[#242424] hover:border-[#383838]'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-[#C8102E]">
                  {[...Array(review.stars)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-[#D8D4CA] leading-relaxed italic">
                  "{review.text}"
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-[#222222] flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-sm text-[#F8F7F4]">
                    {review.author}
                  </h3>
                  <span className="text-xs text-[#7A7873]">
                    {review.origin}
                  </span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#202020] text-[#999] rounded-[2px]">
                  Verificado
                </span>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
};
