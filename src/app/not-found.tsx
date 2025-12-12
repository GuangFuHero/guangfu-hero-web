'use client';

import PageLayout from '@/components/PageLayout';
import Link from 'next/link';
import Image from 'next/image';

/**
 * 全域 404 找不到頁面。
 * 當使用者造訪不存在的路由時顯示，引導其回到首頁或主要導覽。
 */
export default function NotFoundPage() {
  return (
    <PageLayout>
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Image
          src="/404.webp"
          alt="404 找不到頁面的插圖"
          width={140}
          height={129}
          className="mb-5"
        />

        <h1 className="text-2xl font-bold text-[var(--black)] mb-5">哎呀! 找不到頁面</h1>
        <p className="text-[var(--gray-2)] mb-5 max-w-md">
          很抱歉，您要造訪的連結不存在或已被移除。請試試檢查網址或返回首頁。
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#179BC6] text-white text-base font-medium hover:bg-[#148aa3] transition-colors"
        >
          回首頁
        </Link>
      </div>
    </PageLayout>
  );
}
