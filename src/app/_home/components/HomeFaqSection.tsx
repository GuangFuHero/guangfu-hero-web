'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Accordion from './Accordion';
import { env } from '@/config/env';

export type FaqItem = { question: string; answer: string };

/**
 * 首頁「常見問題」區塊。
 * - 從 Google Sheet 以 CSV 方式抓取資料
 * - 若無資料則不渲染。
 */
export default function HomeFaqSection() {
  const [items, setItems] = useState<FaqItem[]>([]);

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
    async function fetchFaq() {
      try {
        const sheetId = env.NEXT_PUBLIC_GOOGLE_SHEET_ID;
        const gid = process.env.NEXT_PUBLIC_FAQ_SHEET_GID || '';
        if (!sheetId || !gid) return; // 未設定 sheetId → 不渲染

        const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
        const res = await fetch(csvUrl);
        const csvText = await res.text();
        if (csvText.includes('<!DOCTYPE') || csvText.includes('<html')) return;

        const rows = parseCsv(csvText);
        const list: FaqItem[] = [];
        for (const r of rows) {
          const q = (r[0] || '').trim();
          const a = (r[1] || '').trim();
          if (!q || !a) continue;
          if (['問題', 'question', 'Question'].includes(q)) continue;
          list.push({ question: q, answer: a });
        }
        setItems(list);
      } catch (e) {
        // 發生錯誤 → 保持 items 為空，讓區塊不顯示
        setItems([]);
      }
    }
    fetchFaq();
  }, []);

  if (!items || items.length === 0) return null;

  return (
    <>
      <h3 className="homeTitle pb-3 pt-8">
        <div className="flex items-center gap-2">
          <p>常見問題</p>
        </div>
        <Link href="/faq" className="flex items-center gap-1">
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
        </Link>
      </h3>

      <div>
        <Accordion items={items} />
      </div>
    </>
  );
}
