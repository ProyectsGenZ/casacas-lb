import React, { useState, useEffect, useRef } from 'react';
import { useLiveEditor } from '../../context/LiveEditContext';
import { Pencil, Check, X, RotateCcw } from 'lucide-react';

interface EditableTextProps {
  contentKey: string;
  defaultValue: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div' | 'b' | 'strong';
  className?: string;
  wrapperClassName?: string;
  label?: string;
  multiline?: boolean;
}

export const EditableText: React.FC<EditableTextProps> = ({
  contentKey,
  defaultValue,
  as: Component = 'span',
  className = '',
  wrapperClassName = '',
  label,
  multiline = false
}) => {
  const {
    isLiveEditMode,
    activeEditingKey,
    setActiveEditingKey,
    getText,
    updateLiveText,
    resetLiveText,
    hasCustomText
  } = useLiveEditor();

  const currentText = getText(contentKey, defaultValue);
  const isEditing = isLiveEditMode && activeEditingKey === contentKey;
  const isCustomized = hasCustomText(contentKey);

  const [tempValue, setTempValue] = useState(currentText);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setTempValue(currentText);
  }, [currentText]);

  // Auto-focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // Click outside to close without saving
  useEffect(() => {
    if (!isEditing) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setActiveEditingKey(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isEditing, setActiveEditingKey]);

  const handleSave = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    await updateLiveText(contentKey, tempValue.trim());
  };

  const handleCancel = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setTempValue(currentText);
    setActiveEditingKey(null);
  };

  const handleReset = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await resetLiveText(contentKey);
    setTempValue(defaultValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    } else if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && multiline) {
      e.preventDefault();
      handleSave();
    }
  };

  // 1. Regular Client View (Zero overhead, pure semantic HTML)
  if (!isLiveEditMode) {
    return <Component className={className}>{currentText}</Component>;
  }

  // 2. Superadmin Live Edit Mode
  return (
    <span
      className={`relative inline-block group/editable transition-all duration-150 ${wrapperClassName} ${
        isEditing
          ? 'z-50 ring-2 ring-[#C8102E] ring-offset-2 ring-offset-[#0E0E0E] rounded-[2px]'
          : 'hover:outline hover:outline-2 hover:outline-dashed hover:outline-[#C8102E] hover:bg-[#C8102E]/10 rounded-[2px] cursor-pointer'
      }`}
      onMouseDown={(e) => {
        if (isLiveEditMode) {
          e.stopPropagation();
        }
      }}
      onTouchStart={(e) => {
        if (isLiveEditMode) {
          e.stopPropagation();
        }
      }}
      onClick={(e) => {
        if (!isEditing) {
          e.preventDefault();
          e.stopPropagation();
          setActiveEditingKey(contentKey);
        }
      }}
      title={`Clic para editar "${label || contentKey}"`}
    >
      <Component className={className}>{currentText}</Component>

      {/* Floating Pencil Button - ONLY visible on hover */}
      {!isEditing && (
        <span
          className="absolute -top-3 -right-3 bg-[#C8102E] text-white p-1.5 rounded-full shadow-xl opacity-0 group-hover/editable:opacity-100 scale-75 group-hover/editable:scale-100 transition-all duration-150 z-30 flex items-center justify-center cursor-pointer pointer-events-none group-hover/editable:pointer-events-auto"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setActiveEditingKey(contentKey);
          }}
          aria-label={`Editar ${label || contentKey}`}
        >
          <Pencil className="w-3 h-3" />
        </span>
      )}

      {/* Customized badge dot - ONLY visible on hover */}
      {isCustomized && !isEditing && (
        <span
          className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-[#0E0E0E] z-10 opacity-0 group-hover/editable:opacity-100 transition-opacity"
          title="Texto personalizado"
        />
      )}

      {/* In-Context Edit Popover */}
      {isEditing && (
        <div
          ref={popoverRef}
          onClick={(e) => e.stopPropagation()}
          className="absolute left-0 top-full mt-2 w-72 sm:w-96 p-3 bg-[#161616] border border-[#C8102E] rounded-[4px] shadow-2xl z-50 text-left font-sans animate-in fade-in zoom-in-95 duration-150 text-[#F8F7F4]"
          style={{ minWidth: '280px' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-[#282828]">
            <div className="flex items-center gap-1.5 overflow-hidden">
              <Pencil className="w-3.5 h-3.5 text-[#C8102E] shrink-0" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#E5E2DA] truncate">
                {label || contentKey}
              </span>
            </div>
            {isCustomized && (
              <span className="text-[9px] font-mono px-1.5 py-0.5 bg-amber-500/20 text-amber-300 rounded-[2px] shrink-0">
                Personalizado
              </span>
            )}
          </div>

          {/* Input field */}
          <div className="mb-3">
            {multiline ? (
              <textarea
                ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={3}
                className="w-full bg-[#0D0D0D] border border-[#333] focus:border-[#C8102E] focus:outline-none p-2 text-xs text-white rounded-[2px] leading-relaxed resize-y"
                placeholder="Escribe el texto aquí..."
              />
            ) : (
              <input
                ref={inputRef as React.RefObject<HTMLInputElement>}
                type="text"
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-[#0D0D0D] border border-[#333] focus:border-[#C8102E] focus:outline-none px-2.5 py-1.5 text-xs text-white rounded-[2px]"
                placeholder="Escribe el texto aquí..."
              />
            )}
            <span className="block mt-1 text-[10px] text-[#777]">
              {multiline ? 'Presiona Ctrl+Enter para guardar' : 'Presiona Enter para guardar, Esc para cancelar'}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#222]">
            <div>
              {isCustomized && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-2 py-1 text-[10px] text-[#A09D95] hover:text-amber-300 hover:bg-[#202020] rounded-[2px] transition-colors flex items-center gap-1 cursor-pointer"
                  title="Restablecer al texto original por defecto"
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                  <span>Por defecto</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleCancel}
                className="px-2.5 py-1 text-xs text-[#AAA] hover:text-white bg-[#222] hover:bg-[#2A2A2A] rounded-[2px] transition-colors flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3 h-3" />
                <span>Cancelar</span>
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-3 py-1 text-xs font-bold text-white bg-[#C8102E] hover:bg-[#A00D24] rounded-[2px] transition-colors flex items-center gap-1 shadow-md cursor-pointer"
              >
                <Check className="w-3 h-3" />
                <span>Guardar</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </span>
  );
};
