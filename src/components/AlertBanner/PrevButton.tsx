'use client';
import React from 'react';

interface PrevButtonProps {
  setIsPaused: React.Dispatch<React.SetStateAction<boolean>>;
  prev: () => void;
}

const PrevButton = ({ setIsPaused, prev }: PrevButtonProps) => {
  return (
    <button
      type="button"
      onClick={e => {
        e.stopPropagation();
        setIsPaused(true);
        prev();
      }}
      className="hidden sm:inline-flex items-center justify-center w-8 h-8 mr-2 rounded-full text-[var(--text-black)] focus:outline-none focus:ring-2 focus:ring-yellow-600"
      aria-label="上一則警示"
    >
      <span aria-hidden>‹</span>
    </button>
  );
};

export default PrevButton;
