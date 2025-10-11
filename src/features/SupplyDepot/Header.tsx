'use client';
import React from 'react';

const Header = () => (
  <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
    <div>
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl">物資站志工填單頁面</h1>
      <p className="mt-1 text-sm text-slate-600">
        {/* TODO: 等備註可以顯示時恢復文案 */}
        {/* 請填寫物資站資訊（會更新名稱、地址、電話與備註）。 */}
        請填寫物資站資訊（會更新名稱、地址、電話）。
      </p>
    </div>

    <div className="flex gap-2">
      <button
        disabled
        type="button"
        className="rounded-2xl border border-transparent bg-amber-500 px-4 py-2 text-sm font-semibold text-white shadow-sm"
      >
        已登入
      </button>
      <button
        className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium shadow-sm"
        type="button"
        onClick={() => {
          localStorage.removeItem('line_oauth_state');
          window.location.reload();
        }}
      >
        登出
      </button>
    </div>
  </div>
);

export default Header;
