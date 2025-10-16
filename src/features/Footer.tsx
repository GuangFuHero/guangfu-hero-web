'use client';

import { Typography } from '@mui/material';
import Link from 'next/link';
import ReactGA from 'react-ga4';

export default function Footer() {
  return (
    <footer className="fixed h-[85px] bottom-0 left-0 right-0 w-full bg-[var(--light-gray-background)] text-white z-1000">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex gap-3 justify-center">
          {/*
          // Due to typhoon, close the matching pages temporarily

          <Link
            href="/resources"
            className="flex-1 max-w-[160px] bg-[var(--secondary)] hover:bg-[#166f8c] py-3 px-6 rounded-lg text-center font-bold transition-colors"
            onClick={() => {
              ReactGA.event('配送媒合');
            }}
          >
            配送媒合
          </Link>
          <Link
            href="/volunteer-register"
            className="flex-1 max-w-[160px] bg-[var(--primary)] hover:bg-[#B55815] py-3 px-6 rounded-lg text-center font-bold transition-colors"
            onClick={() => {
              ReactGA.event('志工媒合');
            }}
          >
            志工媒合
          </Link>
          */}

          <Typography className="text-black">
            因應颱風來襲，配合政府撤離志工指示，配送及志工媒合頁面暫不開放
          </Typography>
        </div>
      </div>
    </footer>
  );
}
