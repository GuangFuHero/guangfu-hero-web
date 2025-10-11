'use client';

import { useEffect } from 'react';
import ReactGA from 'react-ga4';
import { env } from '@/config/env';

export function GoogleAnalytics() {
  const isProd = process.env.NODE_ENV === 'production';

  useEffect(() => {
    if (!isProd || !env.NEXT_PUBLIC_GA4_ID) return;
    ReactGA.initialize(env.NEXT_PUBLIC_GA4_ID);
  }, [isProd]);

  return null;
}
