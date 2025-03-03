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
    ],
  },
  
 
 
  
}
 
export default nextConfig