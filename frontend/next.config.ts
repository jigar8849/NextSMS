import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removed turbopack for better performance
  experimental: {
    optimizeCss: true,
  },
  images: {
    unoptimized: true, // Since no images, but for future
  },
};

export default nextConfig;
