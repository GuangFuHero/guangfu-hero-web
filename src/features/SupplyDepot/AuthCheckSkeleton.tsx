'use client';

import React from 'react';

const AuthCheckSkeleton = () => (
  <main className="min-h-dvh grid place-items-center bg-gradient-to-b from-slate-50 to-slate-100">
    <div className="animate-pulse rounded-2xl border border-slate-200 bg-white px-6 py-4 text-slate-600 shadow-sm">
      正在檢查登入狀態…
    </div>
  </main>
);

export default AuthCheckSkeleton;
