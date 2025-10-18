import { MetadataRoute } from 'next';
import { env } from '@/config/env';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = env.NEXT_PUBLIC_BASE_URL;

  const routes = [
    '/',
    '/map',
    '/privacy',
    // TODO: 待重構完畢後打開
    // "/resources",
    '/terms',
    '/victim/medical',
    '/victim/mental-health',
    '/victim/shelter',
    '/volunteer-register',
    '/volunteer/about-us',
    '/volunteer/preparation',
    '/volunteer/transportation',
  ];

  return routes.map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '/' ? 1.0 : 0.8,
  }));
}
