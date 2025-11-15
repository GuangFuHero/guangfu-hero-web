'use client';

import React, { useRef, useState } from 'react';

export type Announcement = {
  title: string;
  content: string;
  date: string;
};

/**
 * 公告輪播（支援觸控左右滑動與分頁點）。
 * 一次顯示一則，支援左右切換與點擊分頁點跳轉。
 */
export default function Announcements({
  items,
  showArrows = true,
}: {
  items: Announcement[];
  showArrows?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef(0);

  const clamp = (n: number) => Math.max(0, Math.min(items.length - 1, n));
  const goTo = (i: number) => setIndex(clamp(i));
  const prev = () => goTo(index - 1);
  const next = () => goTo(index + 1);

  const onTouchStart: React.TouchEventHandler<HTMLDivElement> = e => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  };

  const onTouchMove: React.TouchEventHandler<HTMLDivElement> = e => {
    if (touchStartX.current == null) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };

  const onTouchEnd: React.TouchEventHandler<HTMLDivElement> = () => {
    const threshold = 40; // 最小滑動距離
    const dx = touchDeltaX.current;
    touchStartX.current = null;
    touchDeltaX.current = 0;
    if (Math.abs(dx) < threshold) return;
    if (dx < 0) next();
    else prev();
  };

  // 確認內容是否含有未設定的超連結
  const renderAnswer = (text: string) => {
    if (!text) return null;
    if (text.includes('<a')) {
      return <span dangerouslySetInnerHTML={{ __html: text }} />;
    }
    const pattern = /(https?:\/\/[^\s<>"']+|www\.[^\s<>"']+)/gi;
    const nodes: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(text)) !== null) {
      if (match.index > lastIndex) {
        nodes.push(text.slice(lastIndex, match.index));
      }
      const url = match[0];
      const href = url.startsWith('http') ? url : `https://${url}`;
      nodes.push(
        <a key={`${url}-${match.index}`} href={href} target="_blank" rel="noopener noreferrer">
          {url}
        </a>
      );
      lastIndex = match.index + url.length;
    }
    if (lastIndex < text.length) {
      nodes.push(text.slice(lastIndex));
    }
    return nodes;
  };

  if (!items || items.length === 0) return null;

  return (
    <div
      className="ann-slider"
      role="region"
      aria-roledescription="carousel"
      aria-label="網站公告輪播"
    >
      <div
        className="ann-viewport"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="ann-track" style={{ transform: `translateX(-${index * 100}%)` }}>
          {items.map((it, i) => (
            <div
              className="ann-slide"
              key={`${it.title}-${it.date}-${i}`}
              aria-hidden={i !== index}
            >
              <div className="ann-card">
                <h4 className="ann-title">{it.title}</h4>
                <div className="ann-content" style={{ whiteSpace: 'pre-wrap' }}>
                  {renderAnswer(it.content)}
                </div>
                <span className="ann-date">{it.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showArrows && (
        <div className="ann-controls">
          <button
            type="button"
            className="ann-btn prev"
            onClick={prev}
            aria-label="上一則"
            disabled={index === 0}
          >
            ‹
          </button>
          <button
            type="button"
            className="ann-btn next"
            onClick={next}
            aria-label="下一則"
            disabled={index === items.length - 1}
          >
            ›
          </button>
        </div>
      )}

      {items.length > 1 && (
        <div className="ann-dots" role="tablist" aria-label="輪播分頁">
          {items.map((_, i) => (
            <div
              key={i}
              className={`dot ${i === index ? 'active' : ''}`}
              role="tab"
              aria-selected={i === index}
              aria-controls={`ann-slide-${i}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
