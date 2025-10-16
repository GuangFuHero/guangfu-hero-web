'use client';

import React from 'react';

interface CarouselIndicatorsProps {
  alerts: { text: string; actionable: boolean | string }[];
  setCurrentSlide: React.Dispatch<React.SetStateAction<number>>;
  setIsPaused: React.Dispatch<React.SetStateAction<boolean>>;
  currentSlide: number;
}

const CarouselIndicators = ({
  alerts,
  setCurrentSlide,
  setIsPaused,
  currentSlide,
}: CarouselIndicatorsProps) => {
  return (
    <div className="flex justify-center gap-2 py-2 bg-white">
      {alerts.map((alert, index) => (
        <button
          key={index}
          onClick={() => {
            setCurrentSlide(index);
            setIsPaused(true);
          }}
          className={`w-[6px] h-[6px] rounded-full transition-colors ${
            index === currentSlide ? 'bg-[var(--gray-2)]' : 'bg-[var(--gray-3)]'
          }`}
          aria-label={`跳到第 ${index + 1} 則警示：${alert.text}`}
          aria-current={index === currentSlide}
        />
      ))}
    </div>
  );
};

export default CarouselIndicators;
