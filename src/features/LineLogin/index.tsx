'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LineLocalCallback() {
  const sp = useSearchParams();
  const router = useRouter();
  const [msg, setMsg] = useState('處理中…');

  useEffect(() => {
    const code = sp.get('code');
    const state = sp.get('state');
    if (!code) {
      setMsg('缺少 code');
      return;
    }

    const parseJwt = (token: string | null) => {
      if (!token) return null;
      try {
        const raw = token;
        const parts = raw.split('.');
        if (parts.length < 2) return null;
        const base64Url = parts[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
        const binary = atob(padded);
        const bytes = Uint8Array.from(binary.split('').map(ch => ch.charCodeAt(0)));
        const json = new TextDecoder().decode(bytes);
        return JSON.parse(json);
      } catch {
        return null;
      }
    };

    const decodedState = state ? parseJwt(decodeURIComponent(state)) : null;
    const fs = JSON.parse(decodeURIComponent(decodedState?.fs) || '{}');
    const next = decodeURIComponent(fs.next) || '/map';
    console.log('LINE OAuth callback state fs:', fs);
    (async () => {
      try {
        // 丟給你自己的本機 API（server route）去打 guangfu 的 /auth/line/token
        const res = await fetch('https://guangfu250923.pttapp.cc/auth/line/token', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            code,
            state,
            redirect_uri: `${window.location.origin}/auth/line/callback`,
          }),
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `Exchange failed: ${res.status}`);
        }

        window.localStorage.setItem('line_oauth_state', JSON.stringify(await res.json()));
        setMsg('LINE 登入成功，正在導向…');

        // 若本機 API 已經設好 session cookie，就直接導向你要的頁
        window.location.href = next;
      } catch (err) {
        setMsg(`LINE 登入失敗：${err instanceof Error ? err.message : String(err)}`);
      }
    })();
  }, [sp, router]);

  return <p>{msg}</p>;
}
