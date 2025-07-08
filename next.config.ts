import withPWA from 'next-pwa';

const withPWAFunc = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig = {
  reactStrictMode: true,
  devIndicators: false as const,

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
    ] as import('next/dist/shared/lib/image-config').RemotePattern[],
  },
};

export default withPWAFunc(nextConfig);
