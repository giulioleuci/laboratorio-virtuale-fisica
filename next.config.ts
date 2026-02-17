import type {NextConfig} from 'next';

// Conditional config for GitHub Pages vs local development
const isGitHubPages = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  // Base path only for GitHub Pages project site
  ...(isGitHubPages && {
    basePath: '/laboratorio-virtuale-fisica',
    assetPrefix: '/laboratorio-virtuale-fisica/',
  }),
  // Safer routing on static hosts
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    // next/image optimization is not supported in static export
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
