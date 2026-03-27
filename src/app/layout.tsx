import type { Metadata, Viewport } from 'next';
import { Space_Grotesk } from 'next/font/google';
import { ReactNode } from 'react';
import './globals.css';

import { HashScroller } from '@/components/hash-scroller';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { buildPersonSchema, buildWebsiteSchema, getSocialImage } from '@/lib/seo';
import { siteConfig } from '@/lib/site';
import { withBasePath } from '@/lib/utils';

const displayFont = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  alternates: {
    canonical: siteConfig.siteUrl,
  },
  authors: [{ name: siteConfig.name, url: siteConfig.siteUrl }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: 'technology',
  keywords: [...siteConfig.keywords],
  manifest: '/site.webmanifest',
  referrer: 'origin-when-cross-origin',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon.svg', rel: 'shortcut icon', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/icon.svg', type: 'image/svg+xml' }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    url: siteConfig.siteUrl,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    locale: siteConfig.openGraphLocale,
    images: [getSocialImage()],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    creator: siteConfig.xHandle,
    images: [siteConfig.siteUrl + siteConfig.socialImage.pathname],
  },
};

export const viewport: Viewport = {
  themeColor: siteConfig.themeColor,
  colorScheme: 'light',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const sitewideStructuredData = {
    '@context': 'https://schema.org',
    '@graph': [buildWebsiteSchema(), buildPersonSchema()],
  };

  return (
    <html lang={siteConfig.locale}>
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="preload" as="image" href={withBasePath(siteConfig.socialImage.pathname)} />
        {siteConfig.sameAs.map((profileUrl) => (
          <link key={profileUrl} rel="me" href={profileUrl} />
        ))}
      </head>
      <body className={`${displayFont.variable} min-h-dvh antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(sitewideStructuredData),
          }}
        />
        <HashScroller />
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
