import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useStoreSettings } from './StoreSettingsContext';
import { useAdminAuth } from './AdminAuthContext';
import { useUI } from './UIContext';
import { SiteSettings } from '../types/settings';

interface LiveEditContextType {
  isSuperAdmin: boolean;
  isLiveEditMode: boolean;
  setIsLiveEditMode: (enabled: boolean) => void;
  toggleLiveEditMode: () => void;
  enterLiveEditAndGoHome: () => void;
  exitLiveEditMode: () => void;
  activeEditingKey: string | null;
  setActiveEditingKey: (key: string | null) => void;
  getText: (key: string, defaultValue: string) => string;
  updateLiveText: (key: string, newText: string) => Promise<void>;
  resetLiveText: (key: string) => Promise<void>;
  resetAllLiveTexts: () => Promise<void>;
  hasCustomText: (key: string) => boolean;
}

const LIVE_EDIT_KEY = 'casacas_live_edit_mode';

const LiveEditContext = createContext<LiveEditContextType | undefined>(undefined);

export const LiveEditProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings, updateSettings } = useStoreSettings();
  const { isAuthenticated } = useAdminAuth();
  const { showToast, navigateToHome } = useUI();

  // Superadmin is STRICTLY active ONLY when authenticated as an admin
  const isSuperAdmin = isAuthenticated;

  const [isLiveEditModeState, setIsLiveEditModeState] = useState<boolean>(() => {
    try {
      return (
        sessionStorage.getItem(LIVE_EDIT_KEY) === 'true' ||
        localStorage.getItem(LIVE_EDIT_KEY) === 'true'
      );
    } catch {
      return false;
    }
  });

  // Effective edit mode is true only if user is authenticated AND has turned on edit mode
  const isLiveEditMode = isSuperAdmin && isLiveEditModeState;

  const [activeEditingKey, setActiveEditingKey] = useState<string | null>(null);

  const setIsLiveEditMode = useCallback((val: boolean) => {
    setIsLiveEditModeState(val);
    try {
      sessionStorage.setItem(LIVE_EDIT_KEY, String(val));
      localStorage.setItem(LIVE_EDIT_KEY, String(val));
    } catch {
      // ignore
    }
  }, []);

  const toggleLiveEditMode = useCallback(() => {
    const next = !isLiveEditMode;
    setIsLiveEditMode(next);
    showToast(
      next
        ? '✏️ Modo Edición activado: Pasá el cursor sobre cualquier texto para editarlo'
        : '👁️ Vista Cliente activada (Modo edición pausado)',
      'info'
    );
  }, [isLiveEditMode, setIsLiveEditMode, showToast]);

  const enterLiveEditAndGoHome = useCallback(() => {
    setIsLiveEditMode(true);
    navigateToHome();
    showToast('👑 Modo Superadmin activado: Pasá el cursor sobre cualquier texto para editarlo', 'success');
  }, [setIsLiveEditMode, navigateToHome, showToast]);

  const exitLiveEditMode = useCallback(() => {
    setIsLiveEditMode(false);
    try {
      sessionStorage.setItem(LIVE_EDIT_KEY, 'false');
      localStorage.setItem(LIVE_EDIT_KEY, 'false');
    } catch {
      // ignore
    }
    showToast('Modo edición desactivado', 'info');
  }, [setIsLiveEditMode, showToast]);

  /**
   * Helper to retrieve text:
   * 1. customTexts[key]
   * 2. Direct path on settings (e.g. 'announcement.badge')
   * 3. fallback to defaultValue
   */
  const getText = useCallback(
    (key: string, defaultValue: string): string => {
      if (settings.customTexts && settings.customTexts[key] !== undefined) {
        return settings.customTexts[key];
      }

      // Check known properties in settings
      if (key === 'announcement.badge' && settings.announcement?.badge) {
        return settings.announcement.badge;
      }
      if (key === 'announcement.text' && settings.announcement?.text) {
        return settings.announcement.text;
      }
      if (key === 'announcement.linkText' && settings.announcement?.linkText) {
        return settings.announcement.linkText;
      }
      if (key === 'brandName' && settings.brandName) {
        return settings.brandName;
      }
      if (key === 'tagline' && settings.tagline) {
        return settings.tagline;
      }

      // Check hero slides
      if (key.startsWith('hero.slide.')) {
        const parts = key.split('.');
        const slideIdx = parseInt(parts[2], 10);
        const field = parts[3] as keyof typeof settings.hero.slides[0];
        if (!isNaN(slideIdx) && settings.hero?.slides?.[slideIdx]?.[field]) {
          return String(settings.hero.slides[slideIdx][field]);
        }
      }

      return defaultValue;
    },
    [settings]
  );

  const hasCustomText = useCallback(
    (key: string): boolean => {
      return !!(settings.customTexts && settings.customTexts[key] !== undefined);
    },
    [settings.customTexts]
  );

  /**
   * Save edited text in settings
   */
  const updateLiveText = useCallback(
    async (key: string, newText: string) => {
      const currentCustom = settings.customTexts || {};
      const updatedCustom = { ...currentCustom, [key]: newText };

      const updates: Partial<SiteSettings> = {
        customTexts: updatedCustom
      };

      // Keep standard settings fields in sync if relevant
      if (key === 'announcement.badge') {
        updates.announcement = { ...settings.announcement, badge: newText };
      } else if (key === 'announcement.text') {
        updates.announcement = { ...settings.announcement, text: newText };
      } else if (key === 'announcement.linkText') {
        updates.announcement = { ...settings.announcement, linkText: newText };
      } else if (key === 'brandName') {
        updates.brandName = newText;
      } else if (key === 'tagline') {
        updates.tagline = newText;
      } else if (key.startsWith('hero.slide.')) {
        const parts = key.split('.');
        const slideIdx = parseInt(parts[2], 10);
        const field = parts[3] as keyof typeof settings.hero.slides[0];
        if (!isNaN(slideIdx) && settings.hero?.slides?.[slideIdx]) {
          const updatedSlides = [...settings.hero.slides];
          updatedSlides[slideIdx] = {
            ...updatedSlides[slideIdx],
            [field]: newText
          };
          updates.hero = {
            ...settings.hero,
            slides: updatedSlides
          };
        }
      }

      await updateSettings(updates);
      setActiveEditingKey(null);
      showToast('✓ Texto actualizado y guardado correctamente', 'success');
    },
    [settings, updateSettings, showToast]
  );

  /**
   * Reset a single text to default
   */
  const resetLiveText = useCallback(
    async (key: string) => {
      if (!settings.customTexts || settings.customTexts[key] === undefined) {
        setActiveEditingKey(null);
        return;
      }
      const updatedCustom = { ...settings.customTexts };
      delete updatedCustom[key];

      await updateSettings({ customTexts: updatedCustom });
      setActiveEditingKey(null);
      showToast('Texto restablecido a su valor predeterminado', 'info');
    },
    [settings.customTexts, updateSettings, showToast]
  );

  /**
   * Reset all custom texts
   */
  const resetAllLiveTexts = useCallback(async () => {
    await updateSettings({ customTexts: {} });
    setActiveEditingKey(null);
    showToast('Todos los textos modificados han sido restablecidos', 'info');
  }, [updateSettings, showToast]);

  return (
    <LiveEditContext.Provider
      value={{
        isSuperAdmin,
        isLiveEditMode,
        setIsLiveEditMode,
        toggleLiveEditMode,
        enterLiveEditAndGoHome,
        exitLiveEditMode,
        activeEditingKey,
        setActiveEditingKey,
        getText,
        updateLiveText,
        resetLiveText,
        resetAllLiveTexts,
        hasCustomText
      }}
    >
      {children}
    </LiveEditContext.Provider>
  );
};

export const useLiveEditor = () => {
  const context = useContext(LiveEditContext);
  if (!context) {
    throw new Error('useLiveEditor must be used within a LiveEditProvider');
  }
  return context;
};
