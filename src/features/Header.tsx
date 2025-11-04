'use client';

import Sidebar from '@/components/Sidebar';
import Toast2 from '@/components/Toast2';
import { getAssetPath } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Header({ hideShare = false }: { hideShare?: boolean }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleShare = async () => {
    if (typeof window === 'undefined') return;

    // 建構完整 URL
    const baseUrl = window.location.origin;
    const shareUrl = `${baseUrl}${pathname}`;

    // 根據路徑決定標題
    const getTitle = () => {
      if (pathname.startsWith('/map')) return '光復超人 - 現場地圖';
      if (pathname.startsWith('/volunteer')) return '光復超人 - 志工資訊';
      if (pathname.startsWith('/victim')) return '光復超人 - 居民協助';
      return '光復超人';
    };

    const title = getTitle();

    // 檢查是否支援 Web Share API
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: shareUrl,
        });
      } catch (error) {
        // 如果使用者取消分享或發生錯誤=複製功能
        if (!(error instanceof Error && error.name === 'AbortError')) {
          await fallbackToCopy(shareUrl);
        }
      }
    } else {
      // 不支援 Web Share API,直接使用複製功能
      await fallbackToCopy(shareUrl);
    }
  };

  const fallbackToCopy = async (url: string) => {
    if (!navigator.clipboard || !navigator.clipboard.writeText) {
      console.warn('Clipboard API 不可用 - 需要 HTTPS 或 localhost 環境');
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      // 複製成功,顯示 Toast2
      setShowToast(true);
    } catch (error) {
      console.error('複製失敗:', error);
    }
  };

  return (
    <>
      <header className="w-full sticky top-0 bg-white z-1000">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 relative">
            {/* Left: Hamburger menu */}
            <button
              className="p-2 rounded-md text-white"
              aria-label="開啟選單"
              onClick={() => setIsSidebarOpen(true)}
            >
              <svg
                className="h-6 w-6 stroke-gray-500 hover:stroke-gray-700"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>

            {/* Center: Logo */}
            <div className="absolute left-1/2 -translate-x-1/2">
              <Link href="/" aria-label="前往地圖">
                <Image
                  src={getAssetPath('/logo_new.svg')}
                  alt="Logo"
                  width={1028}
                  height={301}
                  style={{ width: 'auto', height: '40px' }}
                  className="h-10 w-auto cursor-pointer"
                />
              </Link>
            </div>

            {/* Right: Share icon */}
            {!hideShare && (
              <button className="p-2" aria-label="分享" onClick={handleShare}>
                <Image src={getAssetPath('/share.svg')} alt="分享" width={24} height={24} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 側邊欄 */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Toast 提示 */}
      <Toast2 isVisible={showToast} onClose={() => setShowToast(false)} duration={3000} />
    </>
  );
}
