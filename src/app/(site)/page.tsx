import type { Metadata } from 'next';
import Link from 'next/link';

import { ExperienceLazy } from '@/components/home/ExperienceLazy';
import { FloatingGalleryLazy } from '@/components/home/FloatingGalleryLazy';
import { HighlightsLazy } from '@/components/home/HighlightsLazy';
import { ProjectsLazy } from '@/components/home/ProjectsLazy';
import { ResearchLazy } from '@/components/home/ResearchLazy';
import { HeroLayers } from '@/components/hero/HeroLayers';
import { ProjectCard } from '@/components/project-card';
import { projects } from '@/lib/projects';
import { absoluteUrl } from '@/lib/seo';
import { siteConfig } from '@/lib/site';
import { withBasePath } from '@/lib/utils';

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: '/',
    images: ['/portrait.png'],
  },
  twitter: {
    title: siteConfig.title,
    description: siteConfig.description,
    images: ['/portrait.png'],
  },
};

export default function HomePage() {
  const featured = projects.slice(0, 3);
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${siteConfig.siteUrl}/#website`,
        url: siteConfig.siteUrl,
        name: siteConfig.name,
        alternateName: siteConfig.alternateName,
        description: siteConfig.description,
        inLanguage: 'en',
      },
      {
        '@type': 'Person',
        '@id': `${siteConfig.siteUrl}/#person`,
        name: siteConfig.name,
        alternateName: siteConfig.alternateName,
        jobTitle: siteConfig.jobTitle,
        description: siteConfig.description,
        email: `mailto:${siteConfig.email}`,
        url: siteConfig.siteUrl,
        image: absoluteUrl('/portrait.png'),
        sameAs: siteConfig.sameAs,
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Delgoda',
          addressCountry: 'Sri Lanka',
        },
      },
      {
        '@type': 'ItemList',
        name: 'Featured projects by Naveen Lanka',
        itemListElement: featured.map((project, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: absoluteUrl(`/projects/${project.slug}`),
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
    <>
      <div className="mx-auto max-w-6xl px-5">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />

        <HeroLayers
          title={siteConfig.name}
          subtitle="Backend and full-stack software engineer in Sri Lanka building secure Spring Boot and Python APIs, polished React and Next.js frontends, and reliable healthcare and booking workflows."
          ctaPrimary={{ label: 'View work', href: '/projects' }}
          ctaSecondary={{ label: 'About me', href: '/about' }}
          portraitSrc={withBasePath('/portrait.png')}
          assets={{
            backgroundSrc: withBasePath('/hero/bg-texture.svg'),
            midAccentSrc: withBasePath('/hero/mid-accent.svg'),
            primarySrc: withBasePath('/hero/primary.svg'),
            foregroundAccentSrc: withBasePath('/hero/foreground-accent.svg'),
          }}
        />

        <section className="py-16">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">Naveen Lanka</h2>
            <p className="mt-3 text-base leading-relaxed text-neutral-600 md:text-lg">
              Naveen Lanka is a backend and full-stack software engineer from Sri Lanka. This portfolio highlights Java,
              Spring Boot, Python, React, Next.js, Flutter, and SQL projects across banking, booking, healthcare, and
              database-driven web applications.
            </p>
          </div>
        </section>

        <section className="pb-16">
          <div className="flex items-end justify-between gap-6">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">Featured work</h2>
              <p className="mt-2 text-sm text-neutral-600">
                A short list of projects with clear scope, stack, and outcomes.
              </p>
            </div>
            <Link className="text-sm font-medium text-neutral-900 hover:underline" href="/projects">
              View all
            </Link>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {featured.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </section>

        <HighlightsLazy />

        <div className="[content-visibility:auto] [contain-intrinsic-size:1px_960px]">
          <ExperienceLazy className="-mx-5" />
        </div>
        <div className="[content-visibility:auto] [contain-intrinsic-size:1px_1100px]">
          <ResearchLazy className="-mx-5" />
        </div>
        <div className="[content-visibility:auto] [contain-intrinsic-size:1px_920px]">
          <ProjectsLazy className="-mx-5" />
        </div>

        <section className="mt-24 pb-16">
          <div className="grid gap-6 rounded-3xl border border-black/5 bg-white p-8 shadow-soft md:grid-cols-3">
            <div className="md:col-span-2">
              <h3 className="text-xl font-semibold tracking-tight text-neutral-900">Future work</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                Currently focused on stronger testing, clearer observability, and faster iteration across full-stack
                builds.
              </p>
            </div>
            <div className="flex items-center md:justify-end">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full bg-accent-500 px-6 py-3 text-sm font-medium text-white shadow-soft transition-transform duration-200 active:scale-95"
              >
                Get in touch
              </Link>
            </div>
          </div>
        </section>
      </div>

      <div className="[content-visibility:auto] [contain-intrinsic-size:1px_980px]">
        <FloatingGalleryLazy />
      </div>
    </>
  );
}
