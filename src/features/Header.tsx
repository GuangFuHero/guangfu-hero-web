'use client';

import Sidebar from '@/components/Sidebar';
import { getAssetPath } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function Header({ hideShare = false }: { hideShare?: boolean }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
          </div>
        </div>
      </header>

      {/* 側邊欄 */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
}
