/** @type {import('next').NextConfig} */
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants.js';

const baseConfig = {
  reactStrictMode: true,
  images: {
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
  // NOTE: `distDir` must be project-relative.
  // On Windows/OneDrive, you may still hit EPERM for `.next*/trace`.
  // The recommended workaround is to junction these folders to a TEMP location.
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return { ...baseConfig, distDir: '.next-dev' };
  }
  return { ...baseConfig, distDir: '.next-build' };
}
