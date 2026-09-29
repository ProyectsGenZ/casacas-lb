import React, { useState } from 'react';
import { useLiveEditor } from '../../context/LiveEditContext';
import { useUI } from '../../context/UIContext';
import { useStoreSettings } from '../../context/StoreSettingsContext';
import {
  Crown,
  Pencil,
  Eye,
  Sliders,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  LogOut
} from 'lucide-react';

export const SuperAdminBar: React.FC = () => {
  const {
    isSuperAdmin,
    isLiveEditMode,
    toggleLiveEditMode,
    exitLiveEditMode,
    resetAllLiveTexts
  } = useLiveEditor();

  const { setActiveView } = useUI();
  const { settings } = useStoreSettings();
  const [isMinimized, setIsMinimized] = useState(false);
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);

  // If not super admin, don't show the bar
  if (!isSuperAdmin) return null;

  const customTextCount = settings.customTexts ? Object.keys(settings.customTexts).length : 0;

  const handleResetAll = async () => {
    await resetAllLiveTexts();
    setIsConfirmingReset(false);
  };

  // Minimized Floating Pill
  if (isMinimized) {
    return (
      <div className="fixed bottom-4 left-4 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2 px-3 py-2 bg-[#141414] hover:bg-[#1E1E1E] border border-[#C8102E]/70 text-white rounded-full shadow-2xl transition-all cursor-pointer group"
          title="Abrir barra de Superadministrador"
        >
          <div className="w-5 h-5 rounded-full bg-[#C8102E] flex items-center justify-center text-white">
            <Crown className="w-3 h-3" />
          </div>
          <span className="text-xs font-bold tracking-wider uppercase font-mono">
            Superadmin
          </span>
          <span className={`w-2 h-2 rounded-full ${isLiveEditMode ? 'bg-emerald-400 animate-pulse' : 'bg-[#777]'}`} />
          <ChevronUp className="w-3.5 h-3.5 text-[#AAA] group-hover:text-white" />
        </button>
      </div>
    );
  }

  // Full Sticky Bar
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#121212]/95 backdrop-blur-md border-t-2 border-[#C8102E] shadow-2xl py-2.5 px-4 sm:px-6 text-[#F8F7F4] select-none animate-in slide-in-from-bottom duration-200">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        
        {/* Left: Superadmin Identity & Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#C8102E]/20 border border-[#C8102E]/60 px-2.5 py-1 rounded-[3px]">
            <Crown className="w-4 h-4 text-[#C8102E]" />
            <span className="text-xs font-extrabold uppercase tracking-wider font-mono text-white">
              Superadmin
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs">
            <span
              className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                isLiveEditMode ? 'bg-emerald-400 animate-pulse ring-2 ring-emerald-400/30' : 'bg-[#666]'
              }`}
            />
            <span className="text-[#CCC]">
              {isLiveEditMode ? (
                <>
                  <strong className="text-emerald-400">Modo Edición Activo:</strong> Pasá el cursor y tocá el lapicito ✏️ en cualquier texto
                </>
              ) : (
                <>
                  <strong className="text-[#999]">Modo Navegación:</strong> Estás viendo la web tal como la ve un cliente
                </>
              )}
            </span>
          </div>
        </div>

        {/* Center / Right: Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          
          {/* Live Edit Toggle */}
          <button
            onClick={toggleLiveEditMode}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-[3px] text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer ${
              isLiveEditMode
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white ring-1 ring-emerald-400/50'
                : 'bg-[#222] hover:bg-[#2A2A2A] text-[#DDD] border border-[#444]'
            }`}
          >
            {isLiveEditMode ? (
              <>
                <Pencil className="w-3.5 h-3.5" />
                <span>Edición: ON</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-[#AAA]" />
                <span>Activar Lápices ✏️</span>
              </>
            )}
          </button>

          {/* Custom Texts Counter & Reset */}
          {customTextCount > 0 && (
            <div className="relative">
              {!isConfirmingReset ? (
                <button
                  onClick={() => setIsConfirmingReset(true)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#1B1B1B] hover:bg-[#252525] border border-[#333] text-amber-300 hover:text-amber-200 text-xs rounded-[3px] transition-colors cursor-pointer"
                  title="Restablecer todos los textos a los valores por defecto"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span className="hidden md:inline font-mono">
                    {customTextCount} editado{customTextCount > 1 ? 's' : ''}
                  </span>
                </button>
              ) : (
                <div className="flex items-center gap-1 bg-[#1E1E1E] p-1 border border-amber-500/50 rounded-[3px]">
                  <span className="text-[10px] text-amber-300 px-1 font-semibold">¿Restablecer todo?</span>
                  <button
                    onClick={handleResetAll}
                    className="px-2 py-0.5 bg-[#C8102E] text-white text-[10px] font-bold rounded-[2px] cursor-pointer"
                  >
                    Sí
                  </button>
                  <button
                    onClick={() => setIsConfirmingReset(false)}
                    className="px-1.5 py-0.5 text-[#AAA] hover:text-white text-[10px] cursor-pointer"
                  >
                    No
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Link to Full Admin Dashboard */}
          <button
            onClick={() => {
              exitLiveEditMode();
              setActiveView('admin-dashboard');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#201214] hover:bg-[#30161a] border border-[#C8102E]/60 text-[#FFA0AD] hover:text-white text-xs font-semibold rounded-[3px] transition-colors cursor-pointer"
            title="Salir del modo edición y volver al panel"
          >
            <LogOut className="w-3.5 h-3.5 text-[#C8102E]" />
            <span className="hidden sm:inline">Salir a Panel</span>
          </button>

          {/* Minimize Button */}
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1.5 text-[#888] hover:text-white hover:bg-[#222] rounded-[3px] transition-colors cursor-pointer"
            title="Minimizar barra"
            aria-label="Minimizar barra"
          >
            <ChevronDown className="w-4 h-4" />
          </button>

        </div>

      </div>
    </div>
  );
};
