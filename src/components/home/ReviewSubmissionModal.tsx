import React, { useState } from 'react';
import { useReviews } from '../../context/ReviewsContext';
import { useUI } from '../../context/UIContext';
import { auth, googleProvider } from '../../config/firebase';
import { signInWithPopup } from 'firebase/auth';
import { X, Star, Upload, CheckCircle2, Image as ImageIcon, User, Trash2 } from 'lucide-react';

interface ReviewSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const compressAndReadFile = (file: File, maxWidth = 800, maxHeight = 800): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const elem = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        elem.width = width;
        elem.height = height;
        const ctx = elem.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        const dataUrl = elem.toDataURL('image/jpeg', 0.7);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

export const ReviewSubmissionModal: React.FC<ReviewSubmissionModalProps> = ({ isOpen, onClose }) => {
  const { submitReview } = useReviews();
  const { showToast } = useUI();

  const [stars, setStars] = useState(5);
  const [hoverStars, setHoverStars] = useState<number | null>(null);
  const [author, setAuthor] = useState('');
  const [origin, setOrigin] = useState('Las Breñas');
  const [text, setText] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [googleUser, setGoogleUser] = useState<{ name: string; email: string; photo?: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      if (res.user) {
        setGoogleUser({
          name: res.user.displayName || 'Usuario de Google',
          email: res.user.email || '',
          photo: res.user.photoURL || undefined
        });
        setAuthor(res.user.displayName || 'Usuario de Google');
        setIsAnonymous(false);
        showToast('Sesión de Google iniciada para tu reseña.', 'success');
      }
    } catch (err: any) {
      console.warn('Google sign-in error or cancelled:', err);
      showToast('No se pudo conectar con Google. Puedes escribir tu nombre o publicar como anónimo.', 'info');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      showToast('Procesando foto de tu prenda...', 'info');
      const base64 = await compressAndReadFile(file);
      setImage(base64);
      showToast('Foto cargada correctamente.', 'success');
    } catch (err) {
      console.error(err);
      showToast('Error al procesar la foto.', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      showToast('Por favor escribe tu opinión.', 'error');
      return;
    }

    const finalAuthor = isAnonymous ? 'Cliente Anónimo' : author.trim() || 'Cliente Verificado';
    const finalOrigin = isAnonymous ? 'Comprador Verificado' : origin.trim() || 'Las Breñas, Chaco';

    setIsSubmitting(true);
    try {
      const res = await submitReview({
        author: finalAuthor,
        origin: finalOrigin,
        stars,
        text: text.trim(),
        image: image || undefined,
        isAnonymous,
        userEmail: googleUser?.email,
        userPhoto: googleUser?.photo
      });

      setIsSuccess(true);
      showToast(res.message, 'success');
    } catch (err) {
      console.error(err);
      showToast('Error al enviar la reseña. Inténtalo de nuevo.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const starLabels = ['Muy mala', 'Regular', 'Buena', 'Muy buena', '¡Excelente!'];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-lg bg-[#141414] border border-[#2B2B2B] rounded-[4px] shadow-2xl my-8 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#222] bg-[#111]">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C8102E] font-bold">
              Experiencia de Compra
            </span>
            <h2 className="font-display font-extrabold text-xl text-[#F8F7F4] tracking-tight">
              Dejar una Opinión
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#888] hover:text-white rounded-[2px] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-950/60 border border-emerald-600 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-display font-bold text-2xl text-white">
              ¡Opinión Enviada con Éxito!
            </h3>
            <p className="text-xs sm:text-sm text-[#AAA] leading-relaxed max-w-sm mx-auto">
              Muchas gracias por tu tiempo y por compartir tu experiencia con nosotros.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2.5 bg-[#C8102E] hover:bg-[#E01837] text-white font-bold text-xs uppercase tracking-wider rounded-[2px] transition-colors cursor-pointer"
            >
              Entendido
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">

            {/* Star Rating Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#DDD]">
                ¿Cómo calificarías tu experiencia? *
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((s) => {
                  const active = (hoverStars !== null ? hoverStars : stars) >= s;
                  return (
                    <button
                      key={s}
                      type="button"
                      onMouseEnter={() => setHoverStars(s)}
                      onMouseLeave={() => setHoverStars(null)}
                      onClick={() => setStars(s)}
                      className="p-1 text-[#444] hover:scale-110 transition-transform cursor-pointer"
                      title={starLabels[s - 1]}
                    >
                      <Star
                        className={`w-7 h-7 ${
                          active ? 'text-[#C8102E] fill-[#C8102E]' : 'text-[#333]'
                        }`}
                      />
                    </button>
                  );
                })}
                <span className="text-xs font-bold text-[#AAA] ml-2 font-mono">
                  {starLabels[(hoverStars !== null ? hoverStars : stars) - 1]}
                </span>
              </div>
            </div>

            {/* Author Identity Options */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#DDD]">
                Tu Identificación
              </label>

              {/* Google Button */}
              {!isAnonymous && (
                <div className="flex items-center gap-3">
                  {googleUser ? (
                    <div className="flex items-center gap-2.5 px-3 py-2 bg-[#1A1A1A] border border-[#333] rounded-[2px] text-xs text-white flex-1">
                      {googleUser.photo ? (
                        <img src={googleUser.photo} alt="Avatar" className="w-6 h-6 rounded-full" />
                      ) : (
                        <User className="w-5 h-5 text-[#888]" />
                      )}
                      <div className="flex-1 truncate">
                        <span className="font-bold">{googleUser.name}</span>
                        <span className="text-[10px] text-[#777] block truncate">{googleUser.email}</span>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 bg-emerald-950 text-emerald-400 rounded font-bold">
                        Google
                      </span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleGoogleLogin}
                      className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 bg-[#1C1C1C] hover:bg-[#252525] border border-[#333] hover:border-[#555] rounded-[2px] text-xs font-semibold text-white transition-colors cursor-pointer"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.87c2.26-2.09 3.67-5.17 3.67-9.15z"/>
                        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.05c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.28v3.15C3.26 21.36 7.34 24 12 24z"/>
                        <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.28C.46 8.23 0 10.06 0 12s.46 3.77 1.28 5.39l3.99-3.15z"/>
                        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.28 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.73-4.96z"/>
                      </svg>
                      <span>Identificarme con Google</span>
                    </button>
                  )}
                </div>
              )}

              {/* Anonymous Checkbox */}
              <label className="flex items-center gap-2 cursor-pointer text-xs text-[#AAA]">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => {
                    setIsAnonymous(e.target.checked);
                    if (e.target.checked) {
                      setAuthor('Cliente Anónimo');
                    } else if (googleUser) {
                      setAuthor(googleUser.name);
                    } else {
                      setAuthor('');
                    }
                  }}
                  className="w-4 h-4 accent-[#C8102E] rounded cursor-pointer"
                />
                <span className="font-semibold text-white">Publicar de forma anónima</span>
                <span className="text-[11px] text-[#777]">(No se mostrará tu nombre)</span>
              </label>

              {/* Manual Name & City input if not anonymous */}
              {!isAnonymous && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <input
                      type="text"
                      required={!isAnonymous}
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="Tu nombre (ej: Lucas M.)"
                      className="w-full bg-[#181818] border border-[#333] focus:border-[#C8102E] rounded-[2px] px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      placeholder="Ciudad (ej: Las Breñas, Chaco)"
                      className="w-full bg-[#181818] border border-[#333] focus:border-[#C8102E] rounded-[2px] px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Review Comment Text */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#DDD]">
                Tu Opinión / Comentario *
              </label>
              <textarea
                required
                rows={3}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="¿Qué te pareció la calidad de la tela, la estampa, los tiempos de entrega y la atención?"
                className="w-full bg-[#181818] border border-[#333] focus:border-[#C8102E] rounded-[2px] px-3 py-2.5 text-xs text-white focus:outline-none"
              />
            </div>

            {/* Photo Upload of Product */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#DDD]">
                Foto de lo que compraste (Opcional)
              </label>

              {image ? (
                <div className="flex items-center gap-3 p-2 bg-[#181818] border border-[#333] rounded-[2px]">
                  <div className="w-14 h-14 rounded-[2px] overflow-hidden bg-black shrink-0">
                    <img src={image} alt="Prenda recibida" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 text-xs text-[#AAA]">
                    <span className="text-emerald-400 font-bold block">✓ Foto adjunta lista</span>
                    <span className="text-[10px] text-[#777]">Foto adjuntada correctamente</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setImage(null)}
                    className="p-2 text-[#777] hover:text-[#C8102E] transition-colors cursor-pointer"
                    title="Eliminar foto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="w-full border border-dashed border-[#3A3A3A] hover:border-[#C8102E] bg-[#181818] hover:bg-[#1E1E1E] p-3.5 rounded-[2px] flex items-center justify-center gap-2.5 text-xs font-semibold text-[#DDD] cursor-pointer transition-colors">
                  <Upload className="w-4 h-4 text-[#C8102E]" />
                  <span>Subir foto de la prenda desde PC o Celular</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>
              )}
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#222]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-[#222] hover:bg-[#2A2A2A] text-[#DDD] text-xs font-semibold rounded-[2px] transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-[#C8102E] hover:bg-[#E01837] text-white font-display font-bold text-xs uppercase tracking-wider rounded-[2px] transition-colors shadow-lg shadow-[#C8102E]/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Enviando...</span>
                ) : (
                  <span>Enviar Opinión</span>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
