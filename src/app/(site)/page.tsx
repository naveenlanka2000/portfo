import Link from 'next/link';

import { AppleCarousel } from '@/components/AppleCarousel';
import { FloatingGallerySection } from '@/components/FloatingGallerySection';
import { HeroLayers } from '@/components/hero/HeroLayers';
import { LanguageTape } from '@/components/tape/LanguageTape';
import { defaultLanguageTapeItems } from '@/components/tape/icons';
import { ProjectCard } from '@/components/project-card';
import { Reveal } from '@/components/reveal';
import { ExperienceSection } from '@/components/sections/Experience';
import { ResearchSection } from '@/components/sections/Research';
import { ProjectsSection } from '@/components/sections/Projects';
import { projects } from '@/lib/projects';

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
                        'Built a feedback management module using React, Spring Boot, and MySQL. Implemented secure backend services with IntelliJ IDEA.',
                    },
                    {
                      '@type': 'CreativeWork',
                      name: 'Air Ticket Booking System',
                      description:
                        'Designed a reservation system in Java and SQL for booking, cancellations, and passenger data handling.',
                    },
                    {
                      '@type': 'CreativeWork',
                      name: 'Medicare Application',
                      description:
                        'Developed a cross-platform healthcare app using Flutter for appointment management and medical resources.',
                    },
                    {
                      '@type': 'CreativeWork',
                      name: 'Food Market Database Management',
                      description:
                        'Created a web application using HTML, CSS, JavaScript, and SQL to manage inventory, sales, and suppliers.',
                    },
                  ],
                },
              ],
            }),
          }}
        />

        <HeroLayers
          title="Building secure backends and polished web apps."
          subtitle="Java/Spring Boot and Python APIs, React/Next.js frontends, and MySQL-backed systems — with hands-on experience building healthcare scheduling and booking workflows."
          ctaPrimary={{ label: 'View work', href: '/projects' }}
          ctaSecondary={{ label: 'About me', href: '/about' }}
          assets={{
            backgroundSrc: '/hero/bg-texture.svg',
            midAccentSrc: '/hero/mid-accent.svg',
            primarySrc: '/hero/primary.svg',
            foregroundAccentSrc: '/hero/foreground-accent.svg',
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
              <Reveal key={p.slug} delay={idx * 0.06}>
                <ProjectCard project={p} />
              </Reveal>
            ))}
          </div>
        </section>

        <section className="pb-16">
          <div className="mt-8">
            <AppleCarousel
              ariaLabel="Highlights"
              cards={[
                { title: 'Secure by default', sub: 'Validation & access control', img: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1800&q=70' },
                { title: 'Workflow-first APIs', sub: 'Booking & scheduling', img: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1800&q=70' },
                { title: 'Clean data systems', sub: 'MySQL schema & queries', img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1800&q=70' },
                { title: 'Polished interfaces', sub: 'React + motion', img: 'https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?auto=format&fit=crop&w=1800&q=70' },
                { title: 'Research-minded', sub: 'CNN-based classification', img: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1800&q=70' },
              ]}
            />

            <LanguageTape
              items={defaultLanguageTapeItems}
              speedPxPerSec={170}
              direction="ltr"
              gap={18}
              size={44}
              pauseOnHover={false}
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
