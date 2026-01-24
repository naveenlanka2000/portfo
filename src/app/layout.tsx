import type { Metadata } from 'next';
import { ReactNode } from 'react';
import './globals.css';

import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';

const siteUrl = 'https://example.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Your Name — Product-minded Designer/Engineer',
    template: 'Your Name — %s',
  },
  description:
    'Premium, performance-first digital experiences with refined motion and meticulous detail.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: siteUrl,
    title: 'Your Name — Product-minded Designer/Engineer',
    description:
      'Premium, performance-first digital experiences with refined motion and meticulous detail.',
    images: [{ url: '/og/site.png', width: 1200, height: 630, alt: 'Portfolio preview' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og/site.png'],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh antialiased">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 rounded-xl bg-white px-4 py-2 shadow-soft"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="content" className="min-h-[calc(100dvh-160px)]">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
