import React, { useState } from 'react';
import { brandConfig } from '../../config/brandConfig';
import { Mail, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'empty' | 'invalid' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const validateEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setStatus('empty');
      setErrorMessage('Por favor, ingresá tu correo electrónico.');
      return;
    }

    if (!validateEmail(cleanEmail)) {
      setStatus('invalid');
      setErrorMessage('Ingresá una dirección de correo válida (ejemplo: usuario@correo.com).');
      return;
    }

    // Simulate sending
    try {
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
      setErrorMessage('Ocurrió un error al procesar la suscripción. Por favor intentá nuevamente.');
    }
  };

  return (
    <section className="py-20 bg-[#141414] border-b border-[#222222]" aria-labelledby="newsletter-heading">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Badge */}
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1F1F1F] border border-[#333] text-[#F8F7F4] text-xs font-semibold uppercase tracking-wider rounded-[2px] mb-4">
          <Mail className="w-3.5 h-3.5 text-[#C85A32]" />
          Comunidad {brandConfig.name}
        </span>

        {/* Title */}
        <h2 id="newsletter-heading" className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#F8F7F4] tracking-tight">
          Enterate antes que nadie.
        </h2>

        {/* Subtitle */}
        <p className="mt-3 text-sm sm:text-base text-[#9E9D99] max-w-xl mx-auto leading-relaxed">
          Recibí novedades, lanzamientos y beneficios de la comunidad {brandConfig.name}. Sin spam, solo lanzamientos y avisos exclusivos.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 max-w-md mx-auto space-y-3" noValidate>
          <div className="flex flex-col text-left">
            <label htmlFor="newsletter-email" className="text-xs font-semibold text-[#D0CDC5] uppercase tracking-wider mb-2">
              Correo electrónico
            </label>
            <div className="relative flex flex-col sm:flex-row gap-2">
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status !== 'idle') setStatus('idle');
                }}
                placeholder="ejemplo@correo.com"
                className={`w-full px-4 py-3.5 bg-[#0E0E0E] text-[#F8F7F4] border text-sm rounded-[2px] placeholder:text-[#555] focus:outline-none transition-colors ${
                  status === 'empty' || status === 'invalid' || status === 'error'
                    ? 'border-[#D32F2F] ring-1 ring-[#D32F2F]'
                    : 'border-[#333] focus:border-[#C85A32] focus:ring-1 focus:ring-[#C85A32]'
                }`}
                aria-describedby={status !== 'idle' && status !== 'success' ? 'newsletter-error' : undefined}
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#C85A32] hover:bg-[#DF683B] text-white font-semibold text-xs uppercase tracking-wider rounded-[2px] transition-all whitespace-nowrap active:scale-[0.98] focus-ring"
              >
                <span>Quiero suscribirme</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Validation Feedback Messages */}
          {status === 'success' && (
            <div className="p-3.5 bg-[#1B2E1D] border border-[#2E7D32] text-[#A5D6A7] text-xs font-medium rounded-[2px] flex items-center justify-center gap-2" role="status">
              <CheckCircle2 className="w-4 h-4 text-[#4CAF50] shrink-0" />
              <span>¡Listo! Te suscribiste correctamente. Te avisaremos antes de cada drop.</span>
            </div>
          )}

          {(status === 'empty' || status === 'invalid' || status === 'error') && (
            <div id="newsletter-error" className="p-3 bg-[#2D1616] border border-[#D32F2F] text-[#FFCDD2] text-xs font-medium rounded-[2px] flex items-center gap-2 text-left" role="alert">
              <AlertCircle className="w-4 h-4 text-[#F44336] shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <p className="text-[11px] text-[#696762] text-left sm:text-center">
            Podés cancelar tu suscripción en cualquier momento haciendo clic en el enlace al pie de cada correo.
          </p>
        </form>

      </div>
    </section>
  );
};
