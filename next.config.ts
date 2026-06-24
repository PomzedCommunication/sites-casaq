import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'app.casaq.ch',
                pathname: '/uploads/**',
            },
        ],
    },
};

export default nextConfig;