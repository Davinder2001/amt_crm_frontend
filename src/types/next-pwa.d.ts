declare module 'next-pwa' {
    import type { NextConfig } from 'next';

    type PWAOptions = {
        dest: string;
        register?: boolean;
        skipWaiting?: boolean;
        disable?: boolean;
    };

    function withPWA(options: PWAOptions): (nextConfig: NextConfig) => NextConfig;

    export default withPWA;
}
