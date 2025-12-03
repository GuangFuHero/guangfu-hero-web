import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'sub';
}

const Button: React.FC<ButtonProps> = ({
  children,
  active = false,
  onClick,
  className = 'flex items-center cursor-pointer whitespace-nowrap transition-all duration-150',
  variant = 'default',
}) => {
  let variantBaseClassName = '';
  let activeClassName = '';
  let noActiveClassName = '';
  switch (variant) {
    case 'sub':
      variantBaseClassName = 'rounded-lg border h-[44px] px-3';
      activeClassName = 'text-[var(--primary)] bg-white border-[var(--primary)] border-2';
      noActiveClassName =
        'text-[var(--gray)] bg-white border-[var(--gray-3)] hover:border-[var(--primary)] hover:text-[var(--primary)]';
      break;
    case 'default':
    default:
      variantBaseClassName = 'h-[44px] px-3';
      activeClassName = 'border-b-2 font-medium text-[var(--primary)] border-[var(--primary)]';
      noActiveClassName = 'text-[var(--gray)] bg-white border-[var(--gray-3)]';
      break;
  }

  return (
    <button
      onClick={onClick}
      className={`
        ${className}
        ${variantBaseClassName}
        ${active ? activeClassName : noActiveClassName}
      `}
    >
      {children}
    </button>
  );
};

export default Button;
