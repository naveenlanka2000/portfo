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
  // Prevent dev and build from fighting over the same `.next` files on Windows
  // (common EPERM/locked-file issue, especially in synced folders like OneDrive).
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return { ...baseConfig, distDir: '.next-dev' };
  }
  return { ...baseConfig, distDir: '.next-build' };
}
