import Link from 'next/link';

import { AppleCarousel } from '@/components/AppleCarousel';
import { FloatingGallerySection } from '@/components/FloatingGallerySection';
import { HeroLayers } from '@/components/hero/HeroLayers';
import { LanguageTape } from '@/components/tape/LanguageTape';
import { defaultLanguageTapeItems } from '@/components/tape/icons';
import { ProjectCard } from '@/components/project-card';
import { ExperienceSection } from '@/components/sections/Experience';
import { ResearchSection } from '@/components/sections/Research';
import { ProjectsSection } from '@/components/sections/Projects';
import { projects } from '@/lib/projects';
import { withBasePath } from '@/lib/utils';

export default function HomePage() {
  const featured = projects.slice(0, 3);

  return (
    <>
      <div className="mx-auto max-w-6xl px-5">
        <script
          type="application/ld+json"
          // JSON-LD is static content; safe to inline.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Person',
                  name: 'Naveen Lanka',
                  email: 'mailto:naveenlanka45@gmail.com',
                  address: {
                    '@type': 'PostalAddress',
                    addressLocality: 'Delgoda',
                    addressCountry: 'Sri Lanka',
                  },
                  url: 'https://github.com/naveenlanka2000',
                },
                {
                  '@type': 'ItemList',
                  name: 'Projects',
                  itemListElement: [
                    {
                      '@type': 'CreativeWork',
                      name: 'Online Banking Application',
                      description:
                        'Secure banking workflows with a feedback module and clean data handling.',
                    },
                    {
                      '@type': 'CreativeWork',
                      name: 'Air Ticket Booking System',
                      description:
                        'Java + SQL reservation flows for booking, cancellations, and passenger records.',
                    },
                    {
                      '@type': 'CreativeWork',
                      name: 'Medicare Application',
                      description:
                        'A Flutter app for appointments and healthcare resources.',
                    },
                    {
                      '@type': 'CreativeWork',
                      name: 'Food Market Database Management',
                      description:
                        'Inventory, sales, and supplier management with a SQL-backed web UI.',
                    },
                  ],
                },
              ],
            }),
          }}
        />

        <HeroLayers
          title="Crafting Secure Backends & Polished Web Apps"
          subtitle="Specializing in Java/Spring Boot, Python APIs, and React/Next.js frontends, with a focus on creating efficient healthcare and booking systems."
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
            {featured.map((p, idx) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        </section>

        <section className="pb-16">
          <div className="mt-8">
            <AppleCarousel
              ariaLabel="Highlights"
              cards={[
                { title: 'Secure Backend Services', sub: 'Validation & Access Control', img: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1800&q=70' },
                { title: 'Workflow-Driven APIs', sub: 'Booking & Scheduling', img: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1800&q=70' },
                { title: 'Robust Data Systems', sub: 'MySQL Schema & Queries', img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1800&q=70' },
                { title: 'Polished Interfaces', sub: 'React + Motion', img: 'https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?auto=format&fit=crop&w=1800&q=70' },
                { title: 'ML-Powered Research', sub: 'CNN-Based Classification', img: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1800&q=70' },
              ]}
            />

            <LanguageTape
              items={defaultLanguageTapeItems}
              speedPxPerSec={170}
              direction="ltr"
              gap={18}
              size={44}
              pauseOnHover={false}
              hoverZoomScale={1.35}
              hoverLiftPx={-4}
              className="mt-[3cm]"
            />
          </div>
        </section>

        <ExperienceSection className="-mx-5" />
        <ResearchSection className="-mx-5" />
        <ProjectsSection className="-mx-5" />

        <section className="mt-24 pb-16">
          <div className="grid gap-6 rounded-3xl border border-black/5 bg-white p-8 shadow-soft md:grid-cols-3">
            <div className="md:col-span-2">
              <h3 className="text-xl font-semibold tracking-tight text-neutral-900">Future work</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                Currently focused on stronger testing, clearer observability, and faster iteration across full-stack builds.
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

      <FloatingGallerySection />
    </>
  );
}
