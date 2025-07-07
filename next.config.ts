import path from 'path';
import withPWA from 'next-pwa';
import type { NextConfig } from 'next';
import type { Configuration as WebpackConfig } from 'webpack';

const withPWAFunc = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,

  webpack: (config: WebpackConfig) => {
    // Add path aliases
    const resolvedBaseUrl = path.resolve(process.cwd(), 'src');

    if (!config.resolve) {
      config.resolve = {};
    }

    if (!config.resolve.alias) {
      config.resolve.alias = {};
    }

    config.resolve.alias = {
      ...config.resolve.alias,
      '@': resolvedBaseUrl,
      '@/components': path.join(resolvedBaseUrl, 'components'),
      '@/slices': path.join(resolvedBaseUrl, 'slices'),
      '@/types': path.join(resolvedBaseUrl, 'types'),
    };

    return config;
  },

  images: {
    domains: ['localhost', 'amt.sparkweb.sbs'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
};

export default withPWAFunc(nextConfig);