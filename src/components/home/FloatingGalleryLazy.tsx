'use client';

import dynamic from 'next/dynamic';

const FloatingGallerySection = dynamic(
  () => import('@/components/FloatingGallerySection').then((m) => m.FloatingGallerySection),
  {
    ssr: false,
    loading: () => null,
  }
);

export function FloatingGalleryLazy() {
  return <FloatingGallerySection />;
}
