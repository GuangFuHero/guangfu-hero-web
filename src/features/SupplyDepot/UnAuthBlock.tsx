'use client';
import React from 'react';
import { env } from '@/config/env';

const UnAuthBlock = () => {
  const startLineLogin = () => {
    if (typeof window === 'undefined') return;

    const LINE_AUTH_API_BASE = env.IS_USE_NEW_API
      ? `${env.NEXT_PUBLIC_API_URL}/line/authorize`
      : `${env.NEXT_PUBLIC_API_URL}/auth/line/start`;
    const LINE_AUTH_CALLBACK_URI = encodeURIComponent(
      `${window.location.origin}/auth/line/callback`
    );

    window.location.href = `${LINE_AUTH_API_BASE}?redirect_uri=${LINE_AUTH_CALLBACK_URI}`;
  };

  return (
    <main className="min-h-dvh grid place-items-center bg-gradient-to-b from-slate-50 to-slate-100 text-slate-900">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold">需要先登入 LINE 才能填寫</h1>
        <p className="mt-2 text-sm text-slate-600">
          請先完成 LINE 登入後再回來此頁進行填寫。你也可以先返回首頁。
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm shadow-sm hover:bg-slate-50"
            onClick={() => (window.location.href = '/')}
          >
            返回首頁
          </button>
          <button
            type="button"
            className="rounded-xl border-0 bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
            onClick={startLineLogin}
          >
            前往 LINE 登入
          </button>
        </div>
      </div>
    </main>
  );
};

export default UnAuthBlock;
