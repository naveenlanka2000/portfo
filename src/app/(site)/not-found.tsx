import type { Metadata } from 'next';
import Link from 'next/link';

import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  path: '/404',
  title: 'Not found',
  description: 'The requested page could not be found.',
  noindex: true,
});

export default function NotFound() {
  return (
    <div className="site-shell py-20">
      <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">Not found</h1>
      <p className="mt-3 text-neutral-600">That page doesn’t exist.</p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center justify-center rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white shadow-soft transition-transform duration-200 active:scale-95"
      >
        Back home
      </Link>
    </div>
  );
}
