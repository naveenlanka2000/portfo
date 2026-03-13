/** @type {import('next').NextConfig} */
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants.js';
import fs from 'node:fs';
import path from 'node:path';

function getGithubPagesBasePath() {
  if (process.env.NEXT_PUBLIC_BASE_PATH) return process.env.NEXT_PUBLIC_BASE_PATH;

  const repo = process.env.GITHUB_REPOSITORY;
  const repoName = repo?.includes('/') ? repo.split('/')[1] : undefined;
  if (repoName) return `/${repoName}`;

  return '/portfo';
}

function hasCustomDomain() {
  try {
    const cnamePath = path.join(process.cwd(), 'CNAME');
    if (!fs.existsSync(cnamePath)) return false;
    return fs.readFileSync(cnamePath, 'utf8').trim().length > 0;
  } catch {
    return false;
  }
}

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
  // With a custom domain (CNAME), GitHub Pages serves at the root path.
  // Using a repo basePath (e.g. /portfo) would break all asset URLs + routes.
  const basePath = isDev ? '' : hasCustomDomain() ? '' : getGithubPagesBasePath();

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
