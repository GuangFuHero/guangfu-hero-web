import { getAssetPath } from '@/lib/utils';
import Image from 'next/image';
import React, { ReactNode } from 'react';

interface ActionButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  openInNewTab?: boolean;
  href?: string;
  className?: string;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  variant?: 'primary' | 'secondary' | 'secondary-light' | 'tertiary' | 'secondary-outline';
}

const getClassNameByVariant = (variant: ActionButtonProps['variant']) => {
  switch (variant) {
    case 'primary':
      return 'bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]';
    case 'secondary-light':
      return 'bg-[var(--secondary-light)] text-[var(--secondary)]';
    case 'secondary':
      return 'bg-[var(--secondary)] text-white hover:bg-[var(--secondary-hover)]';
    case 'tertiary':
      return 'bg-[var(--tertiary)] text-[var(--black)]';
    case 'secondary-outline':
      return 'bg-white text-[var(--secondary)] border border-[2px] border-[var(--secondary)]';
    default:
      return '';
  }
};

const getIconElement = (icon: ReactNode, variant: ActionButtonProps['variant']) => {
  if (typeof icon === 'string') {
    return (
      <Image
        src={getAssetPath(icon)}
        alt=""
        width={20}
        height={20}
        className={variant === 'secondary' || variant === 'secondary-light' ? 'invert' : ''}
        style={
          variant === 'secondary-light'
            ? {
                filter:
                  'invert(54%) sepia(89%) saturate(447%) hue-rotate(153deg) brightness(94%) contrast(91%)',
              }
            : undefined
        }
      />
    );
  }

  return icon;
};

const ActionButton: React.FC<ActionButtonProps> = ({
  children,
  onClick,
  href,
  openInNewTab = true,
  className = '',
  icon,
  iconPosition = 'right',
  variant,
}) => {
  const buttonClasses = `
    h-[36px] py-2 px-3
    min-w-[80px]
    text-sm
    rounded-lg
    cursor-pointer
    flex items-center justify-center gap-1
    whitespace-nowrap
    transition-colors
    ${getClassNameByVariant(variant)}  
    ${className}
  `;

  const content = (
    <>
      {icon && iconPosition === 'left' && getIconElement(icon, variant)}
      {children}
      {icon && iconPosition === 'right' && getIconElement(icon, variant)}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target={openInNewTab ? '_blank' : '_self'}
        rel="noopener noreferrer"
        className={buttonClasses}
      >
        {content}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={buttonClasses}>
      {content}
    </button>
  );
};

export default ActionButton;
