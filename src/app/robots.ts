import { MetadataRoute } from 'next';
import { env } from '@/config/env';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  // TODO: 若未來新增環境，需更新非生產環境不允訪問路由規則
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [`/401*`, `/*/401*`],
    },
    sitemap: `${env.NEXT_PUBLIC_BASE_URL}/sitemap.xml`,
  };
}
