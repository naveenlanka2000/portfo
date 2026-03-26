import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Reveal } from '@/components/reveal';
import { tagToBrandKind } from '@/lib/brand';
import { getProjectBySlug, projects } from '@/lib/projects';
import { absoluteUrl, buildBreadcrumbList } from '@/lib/seo';
import { siteConfig } from '@/lib/site';
import { BrandIcon, type BrandKind } from '@/components/sections/BrandIcon';

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const project = getProjectBySlug(params.slug);
  if (!project) return {};

  const pageTitle = `${project.title} | ${siteConfig.name}`;

  return {
    title: project.title,
    description: project.summary,
    alternates: {
      canonical: `/projects/${project.slug}`,
    },
    openGraph: {
      title: pageTitle,
      description: project.summary,
      url: `/projects/${project.slug}`,
      images: ['/portrait.png'],
    },
    twitter: {
      title: pageTitle,
      description: project.summary,
      images: ['/portrait.png'],
    },
  };
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = getProjectBySlug(params.slug);
  if (!project) notFound();

  const projectPath = `/projects/${project.slug}`;
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      buildBreadcrumbList([
        { name: 'Home', path: '/' },
        { name: 'Projects', path: '/projects' },
        { name: project.title, path: projectPath },
      ]),
      {
        '@type': 'WebPage',
        '@id': `${absoluteUrl(projectPath)}#webpage`,
        url: absoluteUrl(projectPath),
        name: `${project.title} | ${siteConfig.name}`,
        description: project.summary,
      },
      {
        '@type': 'CreativeWork',
        '@id': `${absoluteUrl(projectPath)}#project`,
        name: project.title,
        description: project.summary,
        url: absoluteUrl(projectPath),
        creator: {
          '@type': 'Person',
          name: siteConfig.name,
          url: siteConfig.siteUrl,
        },
        keywords: project.stack.join(', '),
        dateCreated: project.year,
      },
    ],
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
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
                    className="h-4 w-4 rounded-md bg-transparent ring-0 transition-transform duration-200 ease-out hover:scale-150"
                  />
                  {label}
                </span>
              ))}
            </dd>
          </div>
        </dl>
      </header>

      <section className="mt-12 grid gap-6 md:grid-cols-12">
        <Reveal className="md:col-span-12">
          <div className="rounded-3xl border border-black/5 bg-white p-8 shadow-soft">
            <h2 className="text-lg font-semibold tracking-tight text-neutral-900">Overview</h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">{project.tagline}</p>
          </div>
        </Reveal>

        <Reveal className="md:col-span-5">
          <div className="rounded-3xl border border-black/5 bg-white p-8 shadow-soft">
            <h2 className="text-lg font-semibold tracking-tight text-neutral-900">Challenge</h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">{project.challenge}</p>
          </div>
        </Reveal>
        <Reveal className="md:col-span-7" delay={0.06}>
          <div className="rounded-3xl border border-black/5 bg-white p-8 shadow-soft">
            <h2 className="text-lg font-semibold tracking-tight text-neutral-900">Solution</h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">{project.solution}</p>
          </div>
        </Reveal>
      </section>

      <section className="mt-6">
        <Reveal>
          <div className="rounded-3xl border border-black/5 bg-neutral-900 p-10 text-white shadow-soft">
            <h2 className="text-lg font-semibold tracking-tight">Outcome</h2>
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
