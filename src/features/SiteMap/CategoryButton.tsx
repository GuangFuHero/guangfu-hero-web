'use client';

import React from 'react';
import Image from 'next/image';
import { getAssetPath } from '@/lib/utils';

interface CategoryButtonProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}
const CategoryButton = ({ children, active = false, onClick }: CategoryButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center gap-1
        p-2 rounded-md text-sm
        whitespace-nowrap shrink-0 leading-none
        w-fit
        ${active ? 'bg-[#E2E2E2]' : 'bg-[#F4F4F4]'}
      `}
    >
      {active && <Image src={getAssetPath('/check.svg')} alt="check" width={14} height={14} />}
      {children}
    </button>
  );
};

export default CategoryButton;
