import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'coohrygeybpmhvzycrgs.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/products/ice-bath-chiller-1hp',
        destination: '/products/warrior-chiller',
        permanent: true,
      },
      {
        source: '/products/ice-bath-chiller-2hp',
        destination: '/products/warrior-chiller-pro',
        permanent: true,
      },
      {
        source: '/products/round-ice-tub',
        destination: '/products/warrior-tub',
        permanent: true,
      },
      {
        source: '/products/oval-ice-tub',
        destination: '/products/warrior-tub-xl',
        permanent: true,
      },
      {
        source: '/products/ice-bath-system-round',
        destination: '/products/warrior-system',
        permanent: true,
      },
      {
        source: '/products/ice-bath-system-oval',
        destination: '/products/warrior-system-pro',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
