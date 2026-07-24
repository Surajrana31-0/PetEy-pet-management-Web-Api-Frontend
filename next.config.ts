import type { NextConfig } from 'next';


const backendURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8088';
const IsDev = backendURL.startsWith('http://localhost');
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
  allowedDevOrigins: ['192.168.1.64', 'localhost'],
};

export default nextConfig;
