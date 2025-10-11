import { useState } from 'react';

interface UseDragOptions {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  threshold?: number;
}

export function useDrag({
  onSwipeLeft,
  onSwipeRight,
  onDragStart,
  onDragEnd,
  threshold = 50,
}: UseDragOptions) {
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setDragStartX(e.clientX);
    setIsDragging(true);
    onDragStart?.();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || dragStartX === null) return;

    const diff = e.clientX - dragStartX;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        onSwipeRight();
      } else {
        onSwipeLeft();
      }
      setDragStartX(null);
      setIsDragging(false);
      onDragEnd?.();
    }
  };

  const handleMouseUp = () => {
    setDragStartX(null);
    setIsDragging(false);
    onDragEnd?.();
  };

  const handleMouseLeave = () => {
    setDragStartX(null);
    setIsDragging(false);
    onDragEnd?.();
  };

  // Touch swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setDragStartX(e.touches[0].clientX);
    onDragStart?.();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (dragStartX === null) return;

    const diff = e.touches[0].clientX - dragStartX;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        onSwipeRight();
      } else {
        onSwipeLeft();
      }
      setDragStartX(null);
      onDragEnd?.();
    }
  };

  const handleTouchEnd = () => {
    setDragStartX(null);
    onDragEnd?.();
  };

  return {
    isDragging,
    dragHandlers: {
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseLeave,
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
  };
}
