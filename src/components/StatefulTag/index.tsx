import React, { HTMLAttributes } from 'react';

type Size = 'large' | 'middle';
type ColorVariant = 'primary';

interface TagProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
  size?: Size;
  colorVariant?: ColorVariant;
}

const SIZE: Record<Size, HTMLAttributes<HTMLButtonElement>['className']> = {
  large: 'font-medium text-[16px] leading-5',
  middle: 'text-sm h-[36px] px-3',
};

const COLOR_VARIANT: Record<ColorVariant, { active: string; inactive: string }> = {
  primary: {
    active: 'bg-[var(--gray)] text-white',
    inactive: 'bg-[var(--gray4)] text-[var(--gray)] border border-[var(--gray-3)]',
  },
};

const StatefulTag: React.FC<TagProps> = ({
  children,
  active = false,
  onClick,
  className = '',
  size = 'large',
  colorVariant = 'primary',
}) => {
  const sizeClassName = SIZE[size];
  const variantClassName = COLOR_VARIANT[colorVariant]?.[active ? 'active' : 'inactive'];

  return (
    <button
      onClick={onClick}
      className={` 
        box-border
        cursor-pointer
        whitespace-nowrap
        rounded-sm
        p-2        
        ${sizeClassName}
        ${variantClassName}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default StatefulTag;
