import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isProd ? "/hualien-aid" : "",
  images: {
    unoptimized: true,
  },
  async rewrites() {
    if (!isProd) {
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
