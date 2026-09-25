import React, { useState } from 'react';
import { useReviews } from '../../context/ReviewsContext';
import { ReviewSubmissionModal } from './ReviewSubmissionModal';
import { Star, MessageSquareQuote, Plus, Camera, X } from 'lucide-react';

export const OpinionsSection: React.FC = () => {
  const { approvedReviews } = useReviews();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  return (
    <>
      <section id="opiniones" className="py-20 bg-[#0E0E0E] border-b border-[#222] scroll-mt-16" aria-labelledby="opinions-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-xs uppercase tracking-widest font-semibold text-[#C8102E] flex items-center gap-1.5">
                <MessageSquareQuote className="w-4 h-4" />
                Lo que dicen de Casacas
              </span>
              <h2 id="opinions-heading" className="font-display font-bold text-3xl sm:text-4xl text-[#F8F7F4] mt-1.5">
                Opiniones Reales
              </h2>
              <p className="text-xs sm:text-sm text-[#8E8B84] max-w-sm leading-relaxed mt-1">
                Experiencias de clientes, clubes y emprendimientos que eligen el taller de CASACAS LB en Las Breñas.
              </p>
            </div>

            {/* Leave Review Action Button */}
            <div>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-3 bg-[#C8102E] hover:bg-[#E01837] active:scale-[0.98] text-white font-display font-bold text-xs uppercase tracking-wider rounded-[2px] transition-all shadow-lg shadow-[#C8102E]/20 cursor-pointer focus-ring"
              >
                <Plus className="w-4 h-4" />
                <span>Dejar mi opinión</span>
              </button>
            </div>
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {approvedReviews.map((review) => (
              <article
                key={review.id}
                className={`p-7 rounded-[2px] border flex flex-col justify-between transition-colors ${
                  review.featured
                    ? 'bg-[#181818] border-[#C8102E]/60 shadow-xl'
                    : 'bg-[#141414] border-[#242424] hover:border-[#383838]'
                }`}
              >
                <div className="space-y-4">
                  {/* Stars */}
                  <div className="flex items-center gap-1 text-[#C8102E]">
                    {[...Array(review.stars)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>

                  {/* Comment Text */}
                  <p className="text-sm text-[#D8D4CA] leading-relaxed italic">
                    "{review.text}"
                  </p>

                  {/* Review Photo Attachment (if present) */}
                  {review.image && (
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => setSelectedPhoto(review.image || null)}
                        className="group relative inline-flex items-center gap-2 p-1.5 bg-[#1C1C1C] border border-[#333] hover:border-[#C8102E] rounded-[2px] transition-colors cursor-pointer"
                        title="Ver foto enviada por el cliente"
                      >
                        <div className="w-12 h-12 rounded-[2px] overflow-hidden bg-black shrink-0">
                          <img
                            src={review.image}
                            alt={`Foto de ${review.author}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="text-left pr-2">
                          <span className="text-[10px] uppercase font-bold text-[#AAA] group-hover:text-white flex items-center gap-1">
                            <Camera className="w-3 h-3 text-[#C8102E]" />
                            Foto del cliente
                          </span>
                          <span className="text-[9px] text-[#777] block">Clic para ampliar</span>
                        </div>
                      </button>
                    </div>
                  )}
                </div>

                {/* Author footer */}
                <div className="pt-6 mt-6 border-t border-[#222222] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {review.userPhoto && !review.isAnonymous ? (
                      <img src={review.userPhoto} alt={review.author} className="w-7 h-7 rounded-full object-cover" />
                    ) : null}
                    <div>
                      <h3 className="font-display font-bold text-sm text-[#F8F7F4]">
                        {review.author}
                      </h3>
                      <span className="text-xs text-[#7A7873]">
                        {review.origin || 'Las Breñas, Chaco'}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#202020] text-[#999] rounded-[2px]">
                    {review.userEmail ? 'Google Verificado' : 'Verificado'}
                  </span>
                </div>
              </article>
            ))}
          </div>

        </div>
      </section>

      {/* Review Submission Modal */}
      <ReviewSubmissionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Photo Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-2xl max-h-[85vh] bg-[#141414] border border-[#333] rounded-[4px] overflow-hidden p-2">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/70 hover:bg-black text-white rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={selectedPhoto}
              alt="Foto ampliada"
              className="max-h-[75vh] w-auto mx-auto object-contain rounded-[2px]"
            />
          </div>
        </div>
      )}
    </>
  );
};
