'use client';

import React from 'react';
import Link from 'next/link';

interface SubMenuItemProps {
  item: {
    name: string;
    subItems: { name: string; href: string }[];
  };
  toggleSection: (name: string) => void;
  expandedSection: string | null;
  onClose: () => void;
}

const SubMenuItem = ({ item, toggleSection, expandedSection, onClose }: SubMenuItemProps) => {
  return (
    <div className="border-b border-[var(--gray)]">
      <button
        onClick={() => toggleSection(item.name)}
        className="w-full px-6 h-[60px] hover:bg-[var(--gray)] flex justify-between items-center"
      >
        <span>{item.name}</span>
        <svg
          className={`w-4 h-4 transition-transform ${
            expandedSection === item.name ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {expandedSection === item.name && (
        <div className="bg-[#2A2A2A]">
          {item.subItems.map((subItem, subIndex) => (
            <Link
              key={subIndex}
              href={subItem.href}
              className="block px-8 h-[60px] hover:bg-[var(--gray)] border-b border-[#3A3937] flex items-center"
              onClick={onClose}
            >
              {subItem.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubMenuItem;
