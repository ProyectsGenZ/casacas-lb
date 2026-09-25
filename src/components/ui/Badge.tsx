import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'accent' | 'subtle' | 'outline' | 'dark';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'accent',
  className = ''
}) => {
  const base = 'inline-flex items-center text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 select-none';
  
  const variants = {
    accent: 'bg-[#C85A32] text-white',
    subtle: 'bg-[#222222] text-[#E0DDD5]',
    outline: 'border border-[#383838] text-[#D0CDC5]',
    dark: 'bg-[#0E0E0E] text-white border border-[#2A2A2A]'
  };

  return (
    <span
      className={`${base} ${variants[variant]} ${className}`}
      style={{ borderRadius: 'var(--radius-xs)' }}
    >
      {children}
    </span>
  );
};
