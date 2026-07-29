/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: { unoptimized: true },
  experimental: {
    serverActions: true,
  },
  webpack: (config) => {
    config.cache = false;
    config.parallelism = 1;
    return config;
  },
};

module.exports = nextConfig;
