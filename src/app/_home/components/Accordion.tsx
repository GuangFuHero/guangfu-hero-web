'use client';

import React, { useState } from 'react';

/**
 * 簡易百葉窗 Accordion。一次僅展開一個項目。
 * @param {Object} props - 組件參數。
 * @param {{ question: string; answer: string; }[]} props.items - 問答資料陣列。
 * @returns {JSX.Element} Accordion 元件。
 */
export default function Accordion({ items }: { items: { question: string; answer: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const contentRefs = React.useRef<Array<HTMLDivElement | null>>([]);

  const toggle = (idx: number) => {
    setOpenIndex(prev => (prev === idx ? null : idx));
  };

  return (
    <div className="accordion">
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div className="accordion-item" key={`${item.question}-${idx}`}>
            <button
              type="button"
              className="accordion-trigger"
              aria-expanded={isOpen}
              aria-controls={`acc-panel-${idx}`}
              id={`acc-header-${idx}`}
              onClick={() => toggle(idx)}
            >
              <span>{item.question}</span>

              <svg
                className={`acc-icon ${!isOpen ? 'block' : 'hidden'}`}
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <path
                  d="M15 8.57143H8.57143V15H6.42857V8.57143H0V6.42857H6.42857V0H8.57143V6.42857H15V8.57143Z"
                  fill="#838383"
                />
              </svg>

              <svg
                className={`acc-icon ${isOpen ? 'block' : 'hidden'}`}
                width="14"
                height="2"
                viewBox="0 0 14 2"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <path d="M14 2H0V0H14V2Z" fill="#838383" />
              </svg>

              {/* <svg
                className={`acc-icon ${isOpen ? 'open' : ''}`}
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <path d="M6 9L12 15L18 9" stroke="#838383" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg> */}
            </button>
            <div
              id={`acc-panel-${idx}`}
              role="region"
              aria-labelledby={`acc-header-${idx}`}
              className={`accordion-content ${isOpen ? 'isOpen' : ''}`}
              ref={el => {
                contentRefs.current[idx] = el;
              }}
              style={{
                maxHeight: isOpen ? (contentRefs.current[idx]?.scrollHeight ?? 0) : 0,
                opacity: isOpen ? 1 : 0,
                transform: isOpen ? 'translateY(0)' : 'translateY(-4px)',
                transition: 'max-height 200ms ease, opacity 180ms ease, transform 180ms ease',
                overflow: 'hidden',
                whiteSpace: 'pre-wrap',
              }}
              aria-hidden={!isOpen}
            >
              {item.answer}
            </div>
          </div>
        );
      })}
    </div>
  );
}
