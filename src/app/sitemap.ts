import type { MetadataRoute } from 'next';

import { projects } from '@/lib/projects';
import { absoluteRouteUrl, absoluteUrl } from '@/lib/seo';
import { siteConfig, siteRoutes } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const portraitImage = absoluteUrl(siteConfig.socialImage.pathname);

  const staticRoutes: MetadataRoute.Sitemap = siteRoutes.map((route) => ({
    url: absoluteRouteUrl(route.path),
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
    ...(route.path === '/' || route.path === '/about' || route.path === '/contact'
      ? { images: [portraitImage] }
      : {}),
  }));

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: absoluteRouteUrl(`/projects/${project.slug}`),
    lastModified,
    changeFrequency: 'monthly',
    priority: 0.72,
  }));

  return [...staticRoutes, ...projectRoutes];
}
