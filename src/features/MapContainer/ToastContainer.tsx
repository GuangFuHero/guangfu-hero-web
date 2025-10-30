'use client';

import { useToast } from '@/providers/ToastProvider';
import { useEffect, useState } from 'react';

interface ToastItemProps {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  onRemove: (id: string) => void;
}

const getTypeStyles = (type: ToastItemProps['type']) => {
  switch (type) {
    case 'success':
      return 'bg-[var(--success)] border-[var(--green)] border text-[var(--black)]';
    case 'error':
      return 'bg-[var(--red)] border-[var(--red)] border text-[var(--black)]';
    case 'warning':
      return 'bg-yellow-600 border-yellow-500 border text-[var(--black)]';
    default:
      return 'bg-gray-800 border-gray-700 border text-[var(--black)]';
  }
};

const ToastIconComponent = ({ type }: { type: ToastItemProps['type'] }) => {
  switch (type) {
    case 'success':
      return (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_5330_27992)">
            <path
              d="M9.00016 16.1737L4.83016 12.0037L3.41016 13.4137L9.00016 19.0037L21.0002 7.00375L19.5902 5.59375L9.00016 16.1737Z"
              fill="var(--green)"
            />
          </g>
          <defs>
            <clipPath id="clip0_5330_27992">
              <rect width="24" height="24" fill="white" />
            </clipPath>
          </defs>
        </svg>
      );

    case 'error':
    case 'warning':
    case 'info':
    default:
      return null;
  }
};

const ToastItem = ({ id, message, type, onRemove }: ToastItemProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const handleRemove = () => {
    setIsVisible(false);
    setTimeout(() => onRemove(id), 300);
  };

  return (
    <div
      className={`
        flex items-center justify-between p-4 mb-2 rounded-lg gap-[12px]
        transition-all duration-300 transform
        ${getTypeStyles(type)}
        ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}
      `}
    >
      <div className="flex row items-start gap-[12px] justify-start flex-1">
        <ToastIconComponent type={type} />
        <span className="text-[16px] leading-[24px] font-medium font-[inherit]">{message}</span>
      </div>
      <button
        onClick={handleRemove}
        className="text-[var(--gray-2)] hover:text-[var(--gray-3)] transition-colors"
        aria-label="關閉通知"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.4 19L5 17.6L10.6 12L5 6.4L6.4 5L12 10.6L17.6 5L19 6.4L13.4 12L19 17.6L17.6 19L12 13.4L6.4 19Z"
            fill="currentColor"
          />
        </svg>
      </button>
    </div>
  );
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 md:bottom-25 right-5 z-2000 max-w-[85svw] w-full md:max-w-sm">
      {toasts.map(toast => (
        <ToastItem
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          onRemove={removeToast}
        />
      ))}
    </div>
  );
}
