/// <reference types="node" />
import withPWA from 'next-pwa';
import path from 'path';

const withPWAFunc = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development', // process.env is available in Next.js config
  // maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // Not a valid PWAOptions property
});

const nextConfig = {
  reactStrictMode: true,
  
  // Enable standalone output for Docker
  output: 'standalone' as const,
  
  // Experimental features for better performance
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },

  // Remove swcMinify (no longer needed)

  // Reduce bundle size
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production', // process.env is available in Next.js config
  },

  images: {
    domains: ['localhost', 'himmanav.com', 'api.himmanav.com'],
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
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  
  // Compression
  compress: true,
  
  // Power by header
  poweredByHeader: false,

  webpack: (config: any, { dev, isServer }: any) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};
    // __dirname is available in Node.js context for webpack config
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    
    // Optimize webpack for production builds
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
          },
        },
      };
    }
    
    return config;
  },
};

export default withPWAFunc(nextConfig);
