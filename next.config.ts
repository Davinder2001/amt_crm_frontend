/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {

  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: '**', // Match any domain
      },
      {
        protocol: 'http',
        hostname: '**', // (Optional) If you want to allow HTTP as well.
      },
    ],
  },




}

export default nextConfig