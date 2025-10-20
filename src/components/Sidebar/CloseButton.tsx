'use client';
import React from 'react';

interface CloseButtonProps {
  onClose: () => void;
}

const CloseButton = ({ onClose }: CloseButtonProps) => (
  <div className="flex justify-between items-center px-4 h-[60px]">
    <button onClick={onClose} className="p-2 hover:bg-[var(--gray)] rounded">
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  </div>
);

export default CloseButton;
