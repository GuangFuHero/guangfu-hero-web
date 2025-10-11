'use client';

import React from 'react';

const FetchSupplyStatus = ({
  loading,
  error,
  count,
}: {
  loading: boolean;
  error: string | null;
  count: number;
}) => {
  return (
    <>
      {loading && (
        <div className="mt-4 text-center">
          <p className="text-slate-600">載入物資資料中...</p>
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 p-4 text-red-800">
          <p className="font-medium">載入失敗</p>
          <p className="mt-1 text-sm">{error}</p>
        </div>
      )}

      {!loading && !error && count > 0 && (
        <div className="mt-4">
          <p className="text-sm text-slate-600">已載入 {count} 個物資需求</p>
        </div>
      )}
    </>
  );
};

export default FetchSupplyStatus;
