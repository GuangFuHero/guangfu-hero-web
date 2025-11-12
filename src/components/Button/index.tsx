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
      variantBaseClassName = 'rounded-lg border font-bold h-[36px] px-3';
      activeClassName = 'text-[var(--background)] bg-[var(--gray)] border-[var(--gray)]';
      noActiveClassName = 'text-[var(--gray)] bg-[var(--gray-4)] border-[var(--gray-3)]';
      break;
    case 'default':
    default:
      variantBaseClassName = 'h-[44px] px-3';
      activeClassName = 'border-b-2 font-medium text-[var(--primary)] border-[var(--primary)] ]';
      noActiveClassName = 'text-[var(--gray-2)] bg-white border-[var(--gray-2)]';
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
      {variant === 'sub' && active && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-4 h-4 me-1"
        >
          <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;
