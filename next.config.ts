import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 90],
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return [
      { source: '/the-system', destination: '/framework', permanent: true },
      { source: '/work', destination: '/case-studies', permanent: true },
      { source: '/contact', destination: '/work-together', permanent: true },
      { source: '/about', destination: '/', permanent: false },
    ]
  },
};

export default nextConfig;
