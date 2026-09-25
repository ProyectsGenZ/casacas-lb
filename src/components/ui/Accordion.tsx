import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  defaultOpen?: boolean;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({ items, className = '' }) => {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    items.forEach((item) => {
      if (item.defaultOpen) initial[item.id] = true;
    });
    return initial;
  });

  const toggle = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className={`divide-y divide-[#242424] border-y border-[#242424] ${className}`}>
      {items.map((item) => {
        const isOpen = !!openItems[item.id];
        return (
          <div key={item.id} className="py-1">
            <button
              type="button"
              onClick={() => toggle(item.id)}
              className="w-full flex items-center justify-between py-4 text-left font-display font-medium text-sm md:text-base text-[#F8F7F4] hover:text-[#C85A32] transition-colors focus-ring"
              aria-expanded={isOpen}
              aria-controls={`accordion-content-${item.id}`}
            >
              <span>{item.title}</span>
              <ChevronDown
                className={`w-4 h-4 text-[#9E9D99] transition-transform duration-200 ${
                  isOpen ? 'transform rotate-180 text-[#C85A32]' : ''
                }`}
              />
            </button>
            {isOpen && (
              <div
                id={`accordion-content-${item.id}`}
                className="pb-4 text-sm text-[#9E9D99] leading-relaxed transition-all duration-200"
              >
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
