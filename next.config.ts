import type { NextConfig } from 'next';

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  async rewrites() {
    if (!isProd) {
      return [
        {
          source: '/api/:path*',
          destination: 'https://uat-api.gf250923.org/:path*',
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
