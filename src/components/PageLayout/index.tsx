'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Wrapper from '@/features/Wrapper';

interface PageLayoutProps {
  children: React.ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  const pathname = usePathname();

  const tabs = [
    { name: '現場地圖', path: '/map' },
    { name: '志工資訊', path: '/volunteer/preparation' },
    { name: '居民協助', path: '/victim/shelter' },
  ];

  // 不顯示 tab 的頁面路徑
  const noTabPages = ['/volunteer/about-us', '/privacy', '/terms'];
  const shouldShowTabs = !noTabPages.some(path => pathname.startsWith(path));

  // Helper function to check if current pathname matches a tab's path prefix
  const isActiveTab = (tabPath: string) => {
    if (tabPath === '/map') {
      return pathname === '/map';
    }
    if (tabPath.startsWith('/volunteer')) {
      return pathname.startsWith('/volunteer');
    }
    if (tabPath.startsWith('/victim')) {
      return pathname.startsWith('/victim');
    }
    return pathname === tabPath;
  };

  return (
    <Wrapper>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tab Navigation */}
        {shouldShowTabs && (
          <div className="flex border-b-2 border-[var(--gray-3)]">
            {tabs.map(tab => (
              <Link
                key={tab.path}
                href={tab.path}
                className={`px-6 py-3 text-base font-medium border-b-4 transition-colors ${
                  isActiveTab(tab.path)
                    ? 'border-[var(--primary)] text-[var(--primary)]'
                    : 'border-transparent text-[var(----text-black)] hover:text-[var(--primary)]'
                }`}
              >
                {tab.name}
              </Link>
            ))}
          </div>
        )}

        {/* Page Content */}
        <div className={shouldShowTabs ? 'mt-3' : ''}>{children}</div>
      </div>
    </Wrapper>
  );
}
