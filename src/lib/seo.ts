import { siteConfig } from '@/lib/site';

export type BreadcrumbItem = {
  name: string;
  path?: string;
};

export function absoluteUrl(path = '/') {
  if (!path || path === '/') return siteConfig.siteUrl;
  return `${siteConfig.siteUrl}${path.startsWith('/') ? path : `/${path}`}`;
}

export function buildBreadcrumbList(items: BreadcrumbItem[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.path ? { item: absoluteUrl(item.path) } : {}),
    })),
  };
}
