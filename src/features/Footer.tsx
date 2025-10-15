'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ReactGA from 'react-ga4';

export default function Footer() {
  const pathname = usePathname();
  const isMapPage = pathname === '/map';

  return (
    <footer
      className="h-[80px] bottom-0 left-0 right-0 w-full bg-[var(--light-gray-background)] text-white z-1000"
      style={{
        position: isMapPage ? 'fixed' : 'sticky',
        backgroundColor: isMapPage ? '#FFFFFF50' : '#FFF',
      }}
    >
      <div
        className={isMapPage ? 'w-full px-4 py-5' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5'}
      >
        <div className="flex gap-3 justify-center">
          <Link
            href="/resources"
            className="flex-1 max-w-[160px] bg-[var(--secondary)] hover:bg-[#166f8c] py-2 px-3 rounded-lg text-center font-bold transition-colors"
            onClick={() => {
              ReactGA.event('配送媒合');
            }}
          >
            配送媒合
          </Link>
          <Link
            href="/volunteer-register"
            className="flex-1 max-w-[160px] bg-[var(--primary)] hover:bg-[#B55815] py-2 px-3 rounded-lg text-center font-bold transition-colors"
            onClick={() => {
              ReactGA.event('志工媒合');
            }}
          >
            志工媒合
          </Link>
        </div>
      </div>
    </footer>
  );
}
