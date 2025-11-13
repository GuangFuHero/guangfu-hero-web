'use client';

import { useEffect, useState } from 'react';
import Announcements from './Announcements';
import { env } from '@/config/env';

export type AnnItem = { title: string; content: string; date: string };

export default function HomeAnnouncementsSection() {
  const [items, setItems] = useState<AnnItem[]>([]);

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
    async function fetchAnnouncements() {
      try {
        const sheetId = env.NEXT_PUBLIC_GOOGLE_SHEET_ID;
        const gid = process.env.NEXT_PUBLIC_ANNOUNCEMENTS_SHEET_GID || '';
        if (!sheetId || !gid) return console.error('未設定 sheetId 或 gid');

        const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
        const res = await fetch(csvUrl);
        const csvText = await res.text();
        if (csvText.includes('<!DOCTYPE') || csvText.includes('<html')) return;

        const rows = parseCsv(csvText);
        const list: AnnItem[] = [];
        for (let i = 1; i < rows.length; i++) {
          const r = rows[i];
          const date = (r[0] || '').trim();
          const title = (r[1] || '').trim();
          const content = (r[2] || '').trim();
          if (!date || !title || !content) continue;
          list.push({ title, content, date });
        }
        setItems(list);
      } catch (e) {
        setItems([]);
      }
    }
    fetchAnnouncements();
  }, []);

  if (!items || items.length === 0) return null;

  return (
    <>
      <h3 className="homeTitle pb-3 pt-8">
        <div className="flex items-center gap-2">
          <p>網站公告</p>
        </div>
      </h3>
      <div>
        <Announcements items={items} showArrows={false} />
      </div>
    </>
  );
}
