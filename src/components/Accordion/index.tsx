'use client';

import React, { useState } from 'react';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  icon?: string;
  defaultOpen?: boolean;
  className?: string;
}

const Accordion: React.FC<AccordionProps> = ({
  title,
  children,
  icon,
  defaultOpen = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      className={`bg-white rounded-lg border border-[var(--gray-3)] overflow-hidden ${className}`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between gap-3 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-start gap-3 flex-1 text-left">
          {icon && <span className="text-2xl">{icon}</span>}
          <h3 className="font-bold text-lg">{title}</h3>
        </div>
        <svg
          className={`w-6 h-6 text-[var(--gray)] transition-transform flex-shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && <div className="px-4 pb-4 pt-0 text-sm text-[var(--gray)]">{children}</div>}
    </div>
  );
};

export default Accordion;
