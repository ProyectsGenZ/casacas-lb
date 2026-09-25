import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const base = 'inline-flex items-center justify-center font-semibold uppercase tracking-wider transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none select-none focus-ring';
  
  const sizes = {
    sm: 'text-xs px-3.5 py-2 min-h-[38px]',
    md: 'text-sm px-6 py-3 min-h-[44px]',
    lg: 'text-sm px-8 py-4 min-h-[50px]'
  };

  const variants = {
    primary: 'bg-[#F8F7F4] text-[#121212] hover:bg-white border border-transparent shadow-sm',
    accent: 'bg-[#C85A32] text-white hover:bg-[#DF683B] border border-transparent',
    secondary: 'bg-[#1C1C1C] text-[#F8F7F4] hover:bg-[#282828] border border-[#2D2D2D]',
    outline: 'bg-transparent text-[#F8F7F4] hover:bg-[#1A1A1A] border border-[#383838]',
    ghost: 'bg-transparent text-[#B5B3AD] hover:text-[#F8F7F4] hover:bg-[#1C1C1C]'
  };

  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      style={{ borderRadius: 'var(--radius-xs)' }}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 text-current" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Procesando...
        </span>
      ) : (
        children
      )}
    </button>
  );
};
