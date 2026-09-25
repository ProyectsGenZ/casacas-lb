import React, { useState } from 'react';
import { useReviews } from '../../context/ReviewsContext';
import { useUI } from '../../context/UIContext';
import { Star, Check, Trash2, Camera, ShieldCheck, Clock, X, Eye, EyeOff } from 'lucide-react';

export const AdminReviewsTab: React.FC = () => {
  const { reviews, pendingReviews, approvedReviews, approveReview, rejectReview, deleteReview } = useReviews();
  const { showToast } = useUI();
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const handleApprove = async (id: string, author: string) => {
    try {
      await approveReview(id);
      showToast(`Reseña de ${author} aprobada y publicada en la web.`, 'success');
    } catch {
      showToast('Error al aprobar la reseña.', 'error');
    }
  };

  const handleReject = async (id: string, author: string) => {
    if (window.confirm(`¿Estás seguro de rechazar la reseña de "${author}"?`)) {
      try {
        await rejectReview(id);
        showToast(`Reseña rechazada.`, 'info');
      } catch {
        showToast('Error al rechazar.', 'error');
      }
    }
  };

  const handleDelete = async (id: string, author: string) => {
    if (window.confirm(`¿Deseas eliminar permanentemente la reseña de "${author}"?`)) {
      try {
        await deleteReview(id);
        showToast('Reseña eliminada.', 'info');
      } catch {
        showToast('Error al eliminar.', 'error');
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Header and stats */}
      <div className="p-6 bg-[#121212] border border-[#222] rounded-[4px] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#222] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#C8102E]" />
              <h2 className="font-display font-extrabold text-xl text-white tracking-tight">
                Moderación de Opiniones
              </h2>
            </div>
            <p className="text-xs text-[#888] mt-1">
              Las opiniones de los clientes quedan en espera hasta que las apruebes. Solo las reseñas aprobadas se muestran en la sección pública de la tienda.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="px-3 py-1.5 bg-[#181818] border border-[#333] rounded-[2px]">
              <span className="text-[#888]">Pendientes: </span>
              <strong className={pendingReviews.length > 0 ? 'text-amber-400' : 'text-white'}>
                {pendingReviews.length}
              </strong>
            </div>
            <div className="px-3 py-1.5 bg-[#181818] border border-[#333] rounded-[2px]">
              <span className="text-[#888]">Publicadas: </span>
              <strong className="text-emerald-400">{approvedReviews.length}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Section 1: Pending Reviews */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-400" />
          <h3 className="font-display font-bold text-base text-white uppercase tracking-wider">
            Pendientes de Aprobación ({pendingReviews.length})
          </h3>
        </div>

        {pendingReviews.length === 0 ? (
          <div className="p-8 text-center bg-[#121212] border border-[#222] rounded-[4px] text-xs text-[#888]">
            No hay reseñas pendientes de revisión en este momento. Todas las opiniones enviadas están al día.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingReviews.map((rev) => (
              <div
                key={rev.id}
                className="p-5 bg-[#161412] border-2 border-amber-600/40 rounded-[4px] space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(rev.stars)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                      <span className="text-xs font-mono font-bold text-[#DDD] ml-1">
                        ({rev.stars}/5)
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 border border-amber-700/50 px-2 py-0.5 rounded-[2px] uppercase font-bold">
                      Requiere Aprobación
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#E5E2D9] leading-relaxed italic bg-[#111] p-3 rounded-[2px] border border-[#262626]">
                    "{rev.text}"
                  </p>

                  {/* Photo if present */}
                  {rev.image && (
                    <div>
                      <button
                        type="button"
                        onClick={() => setSelectedPhoto(rev.image || null)}
                        className="flex items-center gap-2 p-1.5 bg-[#1C1C1C] border border-[#333] hover:border-[#C8102E] rounded-[2px] cursor-pointer"
                      >
                        <div className="w-12 h-12 rounded-[2px] overflow-hidden bg-black shrink-0">
                          <img src={rev.image} alt="Prenda" className="w-full h-full object-cover" />
                        </div>
                        <div className="text-left text-xs">
                          <span className="text-[10px] text-[#AAA] font-bold block flex items-center gap-1">
                            <Camera className="w-3 h-3 text-[#C8102E]" />
                            Foto adjuntada por el cliente
                          </span>
                          <span className="text-[9px] text-[#777]">Clic para ver en tamaño completo</span>
                        </div>
                      </button>
                    </div>
                  )}

                  <div className="text-xs text-[#888] flex items-center justify-between border-t border-[#262626] pt-2">
                    <div>
                      <span className="font-bold text-white block">{rev.author}</span>
                      <span className="text-[10px] text-[#777]">{rev.origin || 'Las Breñas, Chaco'}</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#666]">
                      {new Date(rev.createdAt).toLocaleDateString('es-AR')}
                    </span>
                  </div>
                </div>

                {/* Approval buttons */}
                <div className="flex items-center gap-2 pt-3 border-t border-[#262626]">
                  <button
                    type="button"
                    onClick={() => handleApprove(rev.id, rev.author)}
                    className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-[2px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Aprobar y Publicar</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleReject(rev.id, rev.author)}
                    className="py-2 px-3 bg-[#222] hover:bg-[#333] text-[#AAA] hover:text-white text-xs font-semibold rounded-[2px] transition-colors cursor-pointer"
                  >
                    Rechazar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 2: Approved Published Reviews */}
      <div className="space-y-4 pt-4 border-t border-[#222]">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-emerald-400" />
          <h3 className="font-display font-bold text-base text-white uppercase tracking-wider">
            Publicadas en la Tienda ({approvedReviews.length})
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {approvedReviews.map((rev) => (
            <div
              key={rev.id}
              className="p-4 bg-[#141414] border border-[#262626] rounded-[2px] space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[#C8102E]">
                    {[...Array(rev.stars)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-[9px] uppercase px-1.5 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded font-bold">
                    Visible en la Web
                  </span>
                </div>

                <p className="text-xs text-[#CCC] italic leading-relaxed line-clamp-3">
                  "{rev.text}"
                </p>

                {rev.image && (
                  <button
                    type="button"
                    onClick={() => setSelectedPhoto(rev.image || null)}
                    className="inline-flex items-center gap-1.5 text-[10px] text-[#AAA] hover:text-white bg-[#1A1A1A] px-2 py-1 rounded border border-[#333] cursor-pointer"
                  >
                    <Camera className="w-3 h-3 text-[#C8102E]" />
                    <span>Ver foto de prenda</span>
                  </button>
                )}

                <div className="text-[11px] text-[#777] border-t border-[#222] pt-2 flex justify-between">
                  <span>{rev.author}</span>
                  <span>{rev.origin}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#222]">
                <button
                  type="button"
                  onClick={() => rejectReview(rev.id)}
                  className="text-[10px] text-[#888] hover:text-white px-2 py-1 bg-[#1C1C1C] hover:bg-[#252525] rounded transition-colors cursor-pointer"
                  title="Ocultar de la tienda (vuelve a pendientes)"
                >
                  Ocultar
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(rev.id, rev.author)}
                  className="p-1 text-[#666] hover:text-[#C8102E] transition-colors cursor-pointer"
                  title="Eliminar permanentemente"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
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
              alt="Foto del cliente"
              className="max-h-[75vh] w-auto mx-auto object-contain rounded-[2px]"
            />
          </div>
        </div>
      )}
    </div>
  );
};
