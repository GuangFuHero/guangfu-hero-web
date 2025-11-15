'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Accordion from './Accordion';
import { env } from '@/config/env';

export type FaqItem = { question: string; answer: string };
type LoadingPhase = 'before' | 'during' | 'fadeOut' | 'done';

/**
 * 首頁「常見問題」區塊。
 * - 從 Google Sheet 以 CSV 方式抓取資料
 * - 若無資料則不渲染。
 */
export default function HomeFaqSection() {
  const [items, setItems] = useState<FaqItem[]>([]);
  const [hasData, setHasData] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState<LoadingPhase>('before');
  const sheetId = env.NEXT_PUBLIC_GOOGLE_SHEET_ID;
  const gid = process.env.NEXT_PUBLIC_FAQ_SHEET_GID || '';
  const isConfigMissing = !sheetId || !gid;

  const parseCsv = (text: string): string[][] => {
    const rows: string[][] = [];
    let cur = '';
    let row: string[] = [];
    let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (inQuotes) {
        if (ch === '"') {
          if (text[i + 1] === '"') {
            cur += '"';
            i++;
          } else {
            inQuotes = false;
          }
        } else {
          cur += ch;
        }
      } else {
        if (ch === '"') {
          inQuotes = true;
        } else if (ch === ',') {
          row.push(cur);
          cur = '';
        } else if (ch === '\r') {
          // skip
        } else if (ch === '\n') {
          row.push(cur);
          rows.push(row);
          row = [];
          cur = '';
        } else {
          cur += ch;
        }
      }
    }
    row.push(cur);
    rows.push(row);
    return rows.filter(r => r.some(cell => cell.trim() !== ''));
  };

  useEffect(() => {
    if (isConfigMissing) return;

    let isMounted = true;
    let fadeTimeout: ReturnType<typeof setTimeout> | undefined;

    async function fetchFaq() {
      try {
        if (isMounted) {
          setLoadingPhase('during');
        }

        const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
        const res = await fetch(csvUrl);
        const csvText = await res.text();
        if (csvText.includes('<!DOCTYPE') || csvText.includes('<html')) {
          if (isMounted) {
            setHasData(false);
            setItems([]);
            setLoadingPhase('done');
          }
          return;
        }

        const rows = parseCsv(csvText);
        const list: FaqItem[] = [];
        console.log(rows);
        for (let i = 1; i < rows.length; i++) {
          const r = rows[i];
          const q = (r[0] || '').trim();
          let a = (r[1] || '').trim();
          if (!q || !a) continue;
          if (['問題', 'question', 'Question'].includes(q)) continue;

          const linkText = (r[2] || '').trim();
          const linkUrl = (r[3] || '').trim();
          if (linkText && linkUrl) {
            a += `<a href="${linkUrl}" target="_blank" class="pt-3" style="display: block;" rel="noopener noreferrer">👉 ${linkText}</a>`;
          }

          list.push({ question: q, answer: a });
        }

        if (isMounted) {
          setItems(list);
          if (list.length > 0) {
            setHasData(true);
            setLoadingPhase('fadeOut');
            fadeTimeout = setTimeout(() => {
              if (isMounted) {
                setLoadingPhase('done');
              }
            }, 300);
          } else {
            setHasData(false);
            setLoadingPhase('done');
          }
        }
      } catch (e) {
        if (isMounted) {
          setItems([]);
          setHasData(false);
          setLoadingPhase('done');
        }
      }
    }
    fetchFaq();

    return () => {
      isMounted = false;
      if (fadeTimeout) {
        clearTimeout(fadeTimeout);
      }
    };
  }, [gid, isConfigMissing, sheetId]);

  if (isConfigMissing) return null;
  if (!hasData && loadingPhase === 'done') return null;

  return (
    <>
      <h3 className="homeTitle pb-3 pt-8">
        <div className="flex items-center gap-2">
          <p>常見問題</p>
        </div>
        {/* <Link href="/faq" className="flex items-center gap-1">
          <p>看更多</p>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M16.6024 11.5557L8.92021 4L7 5.88859L13.7221 12.5L7 19.1114L8.92021 21L16.6024 13.4443C16.857 13.1938 17 12.8542 17 12.5C17 12.1458 16.857 11.8062 16.6024 11.5557Z"
              fill="#838383"
            />
          </svg>
        </Link> */}
      </h3>
      <div className="home-loading-shell home-loading-shell-faq">
        {loadingPhase !== 'done' && (
          <div
            className={`home-loading-skeleton home-loading-skeleton-faq home-loading-${loadingPhase}`}
          />
        )}
        {hasData && (
          <div
            className={`home-loading-content${
              loadingPhase === 'fadeOut' || loadingPhase === 'done'
                ? ' home-loading-content-show'
                : ''
            }`}
          >
            <Accordion items={items} />
          </div>
        )}
      </div>
    </>
  );
}
