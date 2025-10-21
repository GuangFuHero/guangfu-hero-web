'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { env } from '@/config/env';

export default function LineLocalCallback() {
  const sp = useSearchParams();
  const router = useRouter();
  const [msg, setMsg] = useState('處理中…');

  useEffect(() => {
    const code = sp.get('code');
    const state = sp.get('state');
    if (!code || !state) {
      setMsg('缺少 code');
      return;
    }

    (async () => {
      try {
        // 丟給你自己的本機 API（server route）去打 guangfu 的 /auth/line/token
        const res = env.IS_USE_NEW_API
          ? await fetch(`${env.NEXT_PUBLIC_API_URL}/line/token?code=${code}&state=${state}`)
          : await fetch(`${env.NEXT_PUBLIC_API_URL}/auth/line/token`, {
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
        window.location.href = '/supply-depot-form-2';
      } catch (err) {
        setMsg(`LINE 登入失敗：${err instanceof Error ? err.message : String(err)}`);
      }
    })();
  }, [sp, router]);

  return <p>{msg}</p>;
}
