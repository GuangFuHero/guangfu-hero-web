'use client';

import { useEffect, useState } from 'react';

interface Toast2Props {
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export default function Toast2({ isVisible, onClose, duration = 3000 }: Toast2Props) {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsClosing(false);

      // 自動關閉
      const timer = setTimeout(() => {
        setIsClosing(true);

        setTimeout(() => {
          onClose();
        }, 300); // 淡出動畫 0.3 秒
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible && !isClosing) return null;

  return (
    <div
      className={`fixed left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2 z-50 ${
        isClosing ? 'animate-fade-out' : 'animate-fade-in'
      }`}
    >
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 pl-4 pr-4 py-3 flex items-center gap-3">
        {/* 綠色勾勾 icon */}
        <div className="flex-shrink-0">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.5 10L9.16667 11.6667L12.5 8.33333M17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5C14.1421 2.5 17.5 5.85786 17.5 10Z"
              stroke="#22C55E"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* 複製成功 */}
        <span className="text-sm font-medium text-gray-900">複製成功</span>

        {/* 關閉按鈕 */}
        <button
          onClick={() => {
            setIsClosing(true);
            setTimeout(() => {
              onClose();
            }, 300);
          }}
          className="flex-shrink-0 ml-1 text-gray-400 hover:text-gray-600 transition-colors p-0.5 rounded"
          aria-label="關閉提示"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
