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

    async redirects() {
        return [
            {
                source: '/:path*',
                has: [
                    {
                        type: 'host',
                        value: 'novimmob.ch',
                    },
                ],
                destination: 'https://novimmobgerance.ch/:path*',
                permanent: true,
            },
        ];
    },
};

export default nextConfig;