import type { NextConfig } from 'next';

const isProd = process.env.NODE_ENV === 'production';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://guangfu250923.pttapp.cc';

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  async rewrites() {
    if (!isProd) {
      // resolve CORS issue in local dev
      return [
        {
          source: '/api/:path*',
          destination: 'https://api.gf250923.org/:path*',
        },
        {
          source: '/devapi/:path*',
          destination: 'https://uat-api.gf250923.org/:path*',
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
