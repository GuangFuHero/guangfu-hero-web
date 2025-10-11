import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  async rewrites() {
    if (!isProd) {
      // resolve CORS issue in local dev
      return [
        {
          source: "/api/:path*",
          destination: "https://guangfu250923.pttapp.cc/:path*",
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
