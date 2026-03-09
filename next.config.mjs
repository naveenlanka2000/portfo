/** @type {import('next').NextConfig} */
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants.js';


const baseConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
};

export default function nextConfig(phase) {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;
  const basePath = isDev ? '' : GH_PAGES_BASE_PATH;

  const config = {
    ...baseConfig,
    basePath,
    env: {
      NEXT_PUBLIC_BASE_PATH: basePath,
    },
  };

  // NOTE: `distDir` must be project-relative.
  // On Windows/OneDrive, you may still hit EPERM for `.next*/trace`.
  // The recommended workaround is to junction these folders to a TEMP location.
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return { ...config, distDir: '.next-dev' };
  }
  // For static export, emit into `out/`.
  return { ...config, distDir: 'out' };
}
