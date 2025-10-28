import { env } from '@/config/env';
import { Metadata } from 'next';

export const generateResourcesMetadata = (): Metadata => {
  return {
    title: '配送媒合',
    description: '登記在地需求並由小蜜蜂配送協助，僅提供當地居民支援與在地配送媒合。',
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: '配送媒合',
      description: '登記在地需求並由小蜜蜂配送協助，僅提供當地居民支援與在地配送媒合。',
      url: `${env.NEXT_PUBLIC_BASE_URL}/resources`,
      type: 'website',
    },
  };
};
