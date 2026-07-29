import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  images: { unoptimized: true },
  allowedDevOrigins: ['192.168.1.64'],
};

export default nextConfig;
