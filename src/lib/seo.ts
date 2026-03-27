import type { Metadata } from 'next';

import type { Project } from '@/lib/projects';
import { siteConfig } from '@/lib/site';

export type BreadcrumbItem = {
  name: string;
  path?: string;
};

export function absoluteUrl(path = '/') {
  if (!path || path === '/') return siteConfig.siteUrl;
  return `${siteConfig.siteUrl}${path.startsWith('/') ? path : `/${path}`}`;
}

export function normalizeRoutePath(path = '/') {
  if (!path || path === '/') return '/';

  const [pathname] = path.split(/[?#]/, 1);
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const trimmed = normalized.replace(/\/+$/, '');

  if (/\.[a-z0-9]+$/i.test(trimmed)) return trimmed;
  return `${trimmed}/`;
}

export function absoluteRouteUrl(path = '/') {
  return absoluteUrl(normalizeRoutePath(path));
}

export function getSocialImage() {
  return {
    url: absoluteUrl(siteConfig.socialImage.pathname),
    width: siteConfig.socialImage.width,
    height: siteConfig.socialImage.height,
    alt: siteConfig.socialImage.alt,
  };
}

export function dedupeKeywords(...groups: Array<readonly string[] | string[] | undefined>) {
  return Array.from(
    new Set(
      groups
        .flatMap((group) => group ?? [])
        .map((keyword) => keyword.trim())
        .filter(Boolean)
    )
  );
}

type OpenGraphType = 'article' | 'profile' | 'website';

type PageMetadataInput = {
  path: string;
  description: string;
  keywords?: string[];
  openGraphType?: OpenGraphType;
  title?: string;
  titleAbsolute?: string;
  noindex?: boolean;
};

export function buildPageMetadata({
  path,
  description,
  keywords,
  openGraphType = 'website',
  title,
  titleAbsolute,
  noindex = false,
}: PageMetadataInput): Metadata {
  const resolvedTitle = titleAbsolute ?? (title ? `${title} | ${siteConfig.name}` : siteConfig.title);
  const robots = noindex
    ? {
        index: false,
        follow: false,
        googleBot: {
          index: false,
          follow: false,
          'max-image-preview': 'none' as const,
          'max-snippet': -1,
          'max-video-preview': -1,
        },
      }
    : undefined;

  return {
    ...(titleAbsolute ? { title: { absolute: titleAbsolute } } : title ? { title } : {}),
    description,
    keywords: dedupeKeywords(siteConfig.keywords, keywords),
    alternates: {
      canonical: absoluteRouteUrl(path),
    },
    ...(robots ? { robots } : {}),
    openGraph: {
      type: openGraphType,
      url: absoluteRouteUrl(path),
      siteName: siteConfig.name,
      locale: siteConfig.openGraphLocale,
      title: resolvedTitle,
      description,
      images: [getSocialImage()],
    },
    twitter: {
      card: 'summary_large_image',
      title: resolvedTitle,
      description,
      creator: siteConfig.xHandle,
      images: [absoluteUrl(siteConfig.socialImage.pathname)],
    },
  };
}

export function buildWebsiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': siteConfig.websiteId,
    url: siteConfig.siteUrl,
    name: siteConfig.name,
    alternateName: siteConfig.alternateName,
    description: siteConfig.description,
    inLanguage: siteConfig.locale,
    publisher: { '@id': siteConfig.personId },
  };
}

export function buildPersonSchema() {
  return {
    '@type': 'Person',
    '@id': siteConfig.personId,
    name: siteConfig.name,
    alternateName: siteConfig.alternateName,
    jobTitle: siteConfig.jobTitle,
    description: siteConfig.description,
    url: siteConfig.siteUrl,
    image: absoluteUrl(siteConfig.socialImage.pathname),
    email: `mailto:${siteConfig.email}`,
    telephone: siteConfig.phone,
    sameAs: siteConfig.sameAs,
    knowsAbout: siteConfig.knowsAbout,
    alumniOf: siteConfig.alumniOf,
    address: {
      '@type': 'PostalAddress',
      addressLocality: siteConfig.location.locality,
      addressCountry: siteConfig.location.country,
    },
    homeLocation: {
      '@type': 'Place',
      name: `${siteConfig.location.locality}, ${siteConfig.location.country}`,
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'professional inquiries',
        email: siteConfig.email,
        telephone: siteConfig.phone,
        areaServed: 'LK',
      },
    ],
  };
}

type WebPageSchemaInput = {
  path: string;
  name: string;
  description: string;
  pageType?: 'CollectionPage' | 'ContactPage' | 'ProfilePage' | 'WebPage';
  breadcrumbId?: string;
  mainEntityId?: string;
};

export function buildWebPageSchema({
  path,
  name,
  description,
  pageType = 'WebPage',
  breadcrumbId,
  mainEntityId = siteConfig.personId,
}: WebPageSchemaInput) {
  return {
    '@type': pageType,
    '@id': `${absoluteRouteUrl(path)}#webpage`,
    url: absoluteRouteUrl(path),
    name,
    description,
    inLanguage: siteConfig.locale,
    isPartOf: { '@id': siteConfig.websiteId },
    about: { '@id': mainEntityId },
    mainEntity: { '@id': mainEntityId },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      ...getSocialImage(),
    },
    ...(breadcrumbId ? { breadcrumb: { '@id': breadcrumbId } } : {}),
  };
}

export function buildProjectSchema(project: Project) {
  const path = `/projects/${project.slug}`;

  return {
    '@type': 'CreativeWork',
    '@id': `${absoluteRouteUrl(path)}#project`,
    name: project.title,
    headline: project.title,
    description: project.summary,
    abstract: project.tagline,
    url: absoluteRouteUrl(path),
    creator: { '@id': siteConfig.personId },
    author: { '@id': siteConfig.personId },
    inLanguage: siteConfig.locale,
    keywords: dedupeKeywords([project.title, project.role, ...project.stack]).join(', '),
  };
}

export function buildBreadcrumbList(items: BreadcrumbItem[], path?: string) {
  return {
    '@type': 'BreadcrumbList',
    ...(path ? { '@id': `${absoluteRouteUrl(path)}#breadcrumb` } : {}),
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.path ? { item: absoluteRouteUrl(item.path) } : {}),
    })),
  };
}
