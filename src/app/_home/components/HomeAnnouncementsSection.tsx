'use client';

import { useEffect, useState } from 'react';
import Announcements from './Announcements';
import { env } from '@/config/env';

export type AnnItem = { title: string; content: string; date: string };
type LoadingPhase = 'before' | 'during' | 'fadeOut' | 'done';

export default function HomeAnnouncementsSection() {
  const [items, setItems] = useState<AnnItem[]>([]);
  const [hasData, setHasData] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState<LoadingPhase>('before');
  const sheetId = env.NEXT_PUBLIC_GOOGLE_SHEET_ID;
  const gid = process.env.NEXT_PUBLIC_ANNOUNCEMENTS_SHEET_GID || '';
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

    async function fetchAnnouncements() {
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
        const list: AnnItem[] = [];
        for (let i = 1; i < rows.length; i++) {
          const r = rows[i];
          const date = (r[0] || '').trim();
          const title = (r[1] || '').trim();
          const content = (r[2] || '').trim();
          if (!date || !title || !content) continue;
          list.push({ title, content, date });
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
    fetchAnnouncements();

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
          <p>網站公告</p>
        </div>
      </h3>
      <div className="home-loading-shell home-loading-shell-ann">
        {loadingPhase !== 'done' && (
          <div
            className={`home-loading-skeleton home-loading-skeleton-ann home-loading-${loadingPhase}`}
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
            <Announcements items={items} showArrows={false} />
          </div>
        )}
      </div>
    </>
  );
}
