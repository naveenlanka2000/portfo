import type { Metadata } from 'next';

import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ProjectCard } from '@/components/project-card';
import { Reveal } from '@/components/reveal';
import { projects } from '@/lib/projects';
import { absoluteRouteUrl, buildBreadcrumbList, buildPageMetadata, buildWebPageSchema } from '@/lib/seo';
import { siteConfig } from '@/lib/site';

const pageTitle = 'Projects';
const pageDescription =
  'Browse software engineering projects by Naveen Lanka, including backend systems, full-stack web apps, mobile apps, booking workflows, and SQL-driven builds.';

export const metadata: Metadata = buildPageMetadata({
  path: '/projects',
  title: pageTitle,
  description: pageDescription,
  keywords: [
    'Naveen Lanka projects',
    'software engineer portfolio Sri Lanka',
    'Spring Boot project portfolio',
    'React and Next.js projects Sri Lanka',
    'backend developer portfolio Sri Lanka',
  ],
});

export default function ProjectsPage() {
  const breadcrumbId = `${absoluteRouteUrl('/projects')}#breadcrumb`;
  const itemListId = `${absoluteRouteUrl('/projects')}#project-list`;
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      buildBreadcrumbList([
        { name: 'Home', path: '/' },
        { name: 'Projects', path: '/projects' },
      ], '/projects'),
      buildWebPageSchema({
        path: '/projects',
        name: `${pageTitle} | ${siteConfig.name}`,
        description: pageDescription,
        pageType: 'CollectionPage',
        breadcrumbId,
        mainEntityId: itemListId,
      }),
      {
        '@type': 'ItemList',
        '@id': itemListId,
        name: 'Projects by Naveen Lanka',
        itemListElement: projects.map((project, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: absoluteRouteUrl(`/projects/${project.slug}`),
          item: {
            '@type': 'CreativeWork',
            name: project.title,
            description: project.summary,
          },
        })),
      },
    ],
  };

  return (
    <div className="site-shell py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: 'Projects' }]} />

      <header className="max-w-3xl">
        <h1 className="text-4xl font-semibold tracking-tight text-neutral-900">Projects by Naveen Lanka</h1>
        <p className="mt-3 text-base leading-relaxed text-neutral-600">
          A curated set of software engineering projects across backend services, booking workflows, mobile apps, and
          data-driven web UIs.
        </p>
      </header>

      <section aria-labelledby="projects-list-title" className="mt-10">
        <h2 id="projects-list-title" className="sr-only">
          Project list
        </h2>
        <div className="grid gap-5 md:grid-cols-3">
          {projects.map((project, index) => (
            <Reveal key={project.slug} delay={index * 0.06}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
