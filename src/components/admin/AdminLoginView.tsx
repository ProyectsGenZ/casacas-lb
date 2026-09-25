import React, { useState } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useUI } from '../../context/UIContext';
import { Lock, User, Eye, EyeOff, ShieldCheck, ArrowLeft, KeyRound } from 'lucide-react';
import { brandConfig } from '../../config/brandConfig';

export const AdminLoginView: React.FC = () => {
  const { login } = useAdminAuth();
  const { setActiveView, navigateToHome, showToast } = useUI();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const result = login(username, password);
      setIsLoading(false);

      if (result.success) {
        showToast('Bienvenido al Panel de Administración de CASACAS LB.', 'success');
        setActiveView('admin-dashboard');
      } else {
        setError(result.error || 'Credenciales incorrectas.');
      }
    }, 350);
  };

  const handleFillDemo = () => {
    setUsername('AdminsCasacaslb');
    setPassword('GenZPass.123@@');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#C8102E]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Back to store link */}
      <div className="w-full max-w-md mb-6">
        <button
          onClick={navigateToHome}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#8E8B84] hover:text-white transition-colors focus-ring cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a la tienda de CASACAS LB</span>
        </button>
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-[#121212] border border-[#222222] rounded-[4px] p-7 sm:p-9 shadow-2xl relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-3 pb-6 border-b border-[#1E1E1E]">
          <div className="flex justify-center">
            <img
              src="/media/logo-casacas-oficial.png"
              alt={brandConfig.name}
              className="h-10 w-auto object-contain"
            />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1A1A1A] border border-[#2C2C2C] rounded-full text-[11px] font-mono text-[#E5E2DA] uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C8102E]" />
            <span>Panel de Administración</span>
          </div>
          <p className="text-xs text-[#8E8B84]">
            Ingresá tus credenciales para gestionar el catálogo, precios y stock.
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-5 p-3 bg-[#D32F2F]/15 border border-[#D32F2F]/40 rounded-[2px] text-xs text-[#FF8585] flex items-center gap-2">
            <span>⚠️ {error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#C5C2BA] mb-1.5">
              Usuario o Correo
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ej: admin o leo@casacaslb.com.ar"
                className="w-full bg-[#181818] border border-[#2C2C2C] focus:border-[#C8102E] rounded-[2px] px-3.5 py-3 pl-10 text-sm text-[#F8F7F4] placeholder-[#555] focus:outline-none transition-colors"
              />
              <User className="w-4 h-4 text-[#777] absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#C5C2BA] mb-1.5">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#181818] border border-[#2C2C2C] focus:border-[#C8102E] rounded-[2px] px-3.5 py-3 pl-10 pr-10 text-sm text-[#F8F7F4] placeholder-[#555] focus:outline-none transition-colors"
              />
              <Lock className="w-4 h-4 text-[#777] absolute left-3.5 top-3.5" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-[#777] hover:text-[#CCC] transition-colors focus-ring"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-[#C8102E] hover:bg-[#E01837] active:scale-[0.99] text-white font-display font-bold text-sm tracking-wider uppercase rounded-[2px] transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#C8102E]/20"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span>Ingresar al Panel</span>
              </>
            )}
          </button>
        </form>

        {/* Demo Credentials Helper */}
        <div className="mt-6 pt-5 border-t border-[#1E1E1E] text-center">
          <p className="text-[11px] text-[#7E7B74] mb-2 font-mono">
            Acceso Rápido de Prueba (Demo)
          </p>
          <button
            type="button"
            onClick={handleFillDemo}
            className="text-xs text-[#C8102E] hover:text-[#E01837] font-semibold underline underline-offset-4 cursor-pointer transition-colors"
          >
            Rellenar con: AdminsCasacaslb / GenZPass.123@@
          </button>
        </div>

      </div>
    </div>
  );
};
