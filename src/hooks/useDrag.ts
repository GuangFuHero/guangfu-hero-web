import { useState } from 'react';

interface UseDragOptions {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onClick?: (e: React.TouchEvent | React.MouseEvent) => void;
  threshold?: number;
}

export function useDrag({
  onSwipeLeft,
  onSwipeRight,
  onDragStart,
  onDragEnd,
  onClick,
  threshold = 50,
}: UseDragOptions) {
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

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

  const handleTouchEnd = (e: React.TouchEvent) => {
    // 如果 dragStartX 還存在，表示沒有滑動（滑動時會設為 null）
    const shouldClick = dragStartX !== null;

    setDragStartX(null);
    onDragEnd?.();

    // 如果沒有滑動，觸發點擊事件
    if (shouldClick && onClick) {
      onClick(e);
    }
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
