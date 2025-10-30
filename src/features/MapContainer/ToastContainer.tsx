'use client';

import { useToast } from '@/providers/ToastProvider';
import { useEffect, useState } from 'react';

interface ToastItemProps {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  onRemove: (id: string) => void;
}

const ToastItem = ({ id, message, type, onRemove }: ToastItemProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const handleRemove = () => {
    setIsVisible(false);
    setTimeout(() => onRemove(id), 300);
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-600 border-green-500';
      case 'error':
        return 'bg-red-600 border-red-500';
      case 'warning':
        return 'bg-yellow-600 border-yellow-500';
      case 'info':
      default:
        return 'bg-gray-800 border-gray-700';
    }
  };

  return (
    <div
      className={`
        flex items-center justify-between p-4 mb-2 rounded-lg shadow-lg text-white border-l-4
        transition-all duration-300 transform
        ${getTypeStyles()}
        ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}
      `}
    >
      <span className="text-sm font-medium">{message}</span>
      <button
        onClick={handleRemove}
        className="ml-4 text-white hover:text-gray-200 transition-colors"
        aria-label="關閉通知"
      >
        ✕
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
