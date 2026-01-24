import Link from 'next/link';

import { TrackCarousel } from '@/components/carousel/TrackCarousel';
import { AppleCarousel } from '@/components/AppleCarousel';
import { ProjectCard } from '@/components/project-card';
import { Reveal } from '@/components/reveal';
import { ExperienceSection } from '@/components/sections/Experience';
import { ResearchSection } from '@/components/sections/Research';
import { ProjectsSection } from '@/components/sections/Projects';
import { projects } from '@/lib/projects';

export default function HomePage() {
  const featured = projects.slice(0, 3);

  return (
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

      <section className="relative overflow-hidden rounded-[28px] border border-black/5 bg-neutral-100 shadow-soft">
        <div className="grid gap-10 px-7 py-14 md:grid-cols-12 md:items-center md:px-12 md:py-20">
          <div className="md:col-span-7">
            <Reveal y={24}>
              <p className="text-sm font-medium text-neutral-700">
                Software Engineer • Backend + Web • AI-curious
              </p>
            </Reveal>
            <Reveal delay={0.12} y={24}>
              <h1 className="mt-4 text-pretty text-4xl font-semibold tracking-tight text-neutral-900 md:text-6xl">
                Building secure backends and polished web apps.
              </h1>
            </Reveal>
            <Reveal delay={0.2} y={24}>
              <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-neutral-600 md:text-lg">
                Java + Spring Boot / Flask APIs, React frontends, and MySQL-backed systems — with hands-on
                experience shipping healthcare and booking workflows, plus research in CNN-based leaf
                classification.
              </p>
            </Reveal>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/projects"
                className="inline-flex items-center justify-center rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white shadow-soft transition-transform duration-200 [transition-timing-function:var(--motion-ease)] hover:-translate-y-0.5 active:scale-[0.98]"
              >
                View work
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-medium text-neutral-900 shadow-soft transition-transform duration-200 [transition-timing-function:var(--motion-ease)] hover:-translate-y-0.5 active:scale-[0.98]"
              >
                About me
              </Link>
            </div>

            <Reveal delay={0.28}>
              <dl className="mt-10 grid grid-cols-2 gap-6 md:max-w-lg">
                <div>
                  <dt className="text-xs font-medium text-neutral-500">Focus</dt>
                  <dd className="mt-1 text-sm font-medium text-neutral-900">Backend APIs + web apps</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-neutral-500">Stack</dt>
                  <dd className="mt-1 text-sm font-medium text-neutral-900">Java, Python, React, MySQL</dd>
                </div>
              </dl>
            </Reveal>
          </div>

          <div className="md:col-span-5">
            <Reveal delay={0.12}>
              <TrackCarousel
                ariaLabel="Hero imagery"
                aspectRatio="4 / 5"
                priorityFirstImage
                items={[
                  {
                    src: 'https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?auto=format&fit=crop&w=1600&q=70',
                    alt: 'Abstract studio scene with soft light',
                  },
                  {
                    src: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1600&q=70',
                    alt: 'Neutral geometric interior detail',
                  },
                  {
                    src: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=70',
                    alt: 'Team collaborating around a table',
                  },
                ]}
              />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">Featured work</h2>
            <p className="mt-2 text-sm text-neutral-600">
              Projects presented like products: problem, approach, impact.
            </p>
          </div>
          <Link className="text-sm font-medium text-neutral-900 hover:underline" href="/projects">
            See all
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
            cards={[
              { title: 'Designed for Every Student', sub: 'Accessibility', img: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1800&q=70' },
              { title: 'The Underdogs', sub: 'Apple at Work', img: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1800&q=70' },
              { title: 'Jackson Wang: Let Loose', sub: 'Shot on iPhone', img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1800&q=70' },
              { title: 'Made to Move', sub: 'Motion Design', img: 'https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?auto=format&fit=crop&w=1800&q=70' },
              { title: 'Crafted for Clarity', sub: 'Product UI', img: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1800&q=70' },
            ]}
          />
        </div>
      </section>

      <ExperienceSection className="-mx-5" />
      <ResearchSection className="-mx-5" />
      <ProjectsSection className="-mx-5" />

      <section className="pb-16">
        <div className="grid gap-6 rounded-3xl border border-black/5 bg-white p-8 shadow-soft md:grid-cols-3">
          <div className="md:col-span-2">
            <h3 className="text-xl font-semibold tracking-tight text-neutral-900">Future work</h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">
              A single motion system everywhere: scroll reveals, hover lift, and page transitions share the
              same tokens — and respect reduced motion.
            </p>
          </div>
          <div className="flex items-center md:justify-end">
            <Link
              href="/styleguide"
              className="inline-flex items-center justify-center rounded-full bg-accent-500 px-6 py-3 text-sm font-medium text-white shadow-soft transition-transform duration-200 [transition-timing-function:var(--motion-ease)] hover:-translate-y-0.5 active:scale-[0.98]"
            >
              View tokens
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
