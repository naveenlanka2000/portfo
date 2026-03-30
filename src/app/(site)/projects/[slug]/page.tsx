import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Reveal } from '@/components/reveal';
import { tagToBrandKind } from '@/lib/brand';
import { getProjectBySlug, projects } from '@/lib/projects';
import { absoluteRouteUrl, buildBreadcrumbList, buildPageMetadata, buildProjectSchema, buildWebPageSchema } from '@/lib/seo';
import { siteConfig } from '@/lib/site';
import { BrandIcon, type BrandKind } from '@/components/sections/BrandIcon';

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const project = getProjectBySlug(params.slug);
  if (!project) return {};

  return buildPageMetadata({
    path: `/projects/${project.slug}`,
    title: project.title,
    description: project.summary,
    keywords: [
      project.title,
      project.role,
      ...project.stack,
      `${project.title} project`,
      'software engineering portfolio project',
    ],
  });
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = getProjectBySlug(params.slug);
  if (!project) notFound();

  const projectPath = `/projects/${project.slug}`;
  const breadcrumbId = `${absoluteRouteUrl(projectPath)}#breadcrumb`;
  const projectId = `${absoluteRouteUrl(projectPath)}#project`;
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      buildBreadcrumbList([
        { name: 'Home', path: '/' },
        { name: 'Projects', path: '/projects' },
        { name: project.title, path: projectPath },
      ], projectPath),
      buildWebPageSchema({
        path: projectPath,
        name: `${project.title} | ${siteConfig.name}`,
        description: project.summary,
        breadcrumbId,
        mainEntityId: projectId,
      }),
      buildProjectSchema(project),
    ],
  };

  return (
    <div className="site-shell py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <Breadcrumbs
        items={[
          { name: 'Home', href: '/' },
          { name: 'Projects', href: '/projects' },
          { name: project.title },
        ]}
      />

      <header className="max-w-3xl">
        <Reveal y={24}>
          <p className="text-sm font-medium text-neutral-600">Project</p>
        </Reveal>
        <Reveal delay={0.12} y={24}>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-neutral-900 md:text-5xl">{project.title}</h1>
        </Reveal>
        <Reveal delay={0.2} y={24}>
          <p className="mt-4 text-base leading-relaxed text-neutral-600 md:text-lg">{project.summary}</p>
        </Reveal>

        <dl className="mt-10 grid grid-cols-2 gap-6 rounded-3xl border border-black/5 bg-white p-6 shadow-soft md:grid-cols-4">
          <div>
            <dt className="text-xs font-medium text-neutral-500">Year</dt>
            <dd className="mt-1 text-sm font-medium text-neutral-900">{project.year}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-neutral-500">Role</dt>
            <dd className="mt-1 text-sm font-medium text-neutral-900">{project.role}</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-xs font-medium text-neutral-500">Stack</dt>
            <dd className="mt-1 flex flex-wrap gap-2">
              {project.stack.map((label) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700"
                >
                  <BrandIcon
                    kind={tagToBrandKind(label) as BrandKind}
                    label={label}
                    bare
                    className="h-4 w-4 origin-center transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.8] motion-reduce:transition-none motion-reduce:hover:scale-100"
                  />
                  {label}
                </span>
              ))}
            </dd>
          </div>
        </dl>
      </header>

      <section
        aria-labelledby="project-overview-title project-challenge-title project-solution-title"
        className="mt-12 grid gap-6 md:grid-cols-12"
      >
        <Reveal className="md:col-span-12">
          <div className="rounded-3xl border border-black/5 bg-white p-8 shadow-soft">
            <h2 id="project-overview-title" className="text-lg font-semibold tracking-tight text-neutral-900">
              Overview
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">{project.tagline}</p>
          </div>
        </Reveal>

        <Reveal className="md:col-span-5">
          <div className="rounded-3xl border border-black/5 bg-white p-8 shadow-soft">
            <h2 id="project-challenge-title" className="text-lg font-semibold tracking-tight text-neutral-900">
              Challenge
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">{project.challenge}</p>
          </div>
        </Reveal>
        <Reveal className="md:col-span-7" delay={0.06}>
          <div className="rounded-3xl border border-black/5 bg-white p-8 shadow-soft">
            <h2 id="project-solution-title" className="text-lg font-semibold tracking-tight text-neutral-900">
              Solution
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">{project.solution}</p>
          </div>
        </Reveal>
      </section>

      <section aria-labelledby="project-outcome-title" className="mt-6">
        <Reveal>
          <div className="rounded-3xl border border-black/5 bg-neutral-900 p-10 text-white shadow-soft">
            <h2 id="project-outcome-title" className="text-lg font-semibold tracking-tight">
              Outcome
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/80">{project.outcome}</p>
            <ul className="mt-6 grid gap-2 text-sm text-white/85 md:grid-cols-3">
              {project.highlights.map((highlight) => (
                <li key={highlight} className="rounded-2xl bg-white/5 px-4 py-3">
                  {highlight}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
