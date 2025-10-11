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
  className = '',
  variant = 'default',
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        border rounded-lg
        bg-white
        cursor-pointer
        whitespace-nowrap
        ${variant === 'sub' ? 'text-sm h-[36px] px-3' : 'h-[44px] px-4'}
        ${
          active
            ? 'border-2 font-medium border-[var(--primary)] text-[var(--primary)]'
            : 'border-[var(--gray-2)] text-[var(--gray-2)]'
        }
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;
