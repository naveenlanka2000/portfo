import Link from 'next/link';

import { TrackCarousel } from '@/components/carousel/TrackCarousel';
import { AppleCarousel } from '@/components/AppleCarousel';
import { ProjectCard } from '@/components/project-card';
import { Reveal } from '@/components/reveal';
import { projects } from '@/lib/projects';

export default function HomePage() {
  const featured = projects.slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-5">
      <section className="relative overflow-hidden rounded-[28px] border border-black/5 bg-neutral-100 shadow-soft">
        <div className="grid gap-10 px-7 py-14 md:grid-cols-12 md:items-center md:px-12 md:py-20">
          <div className="md:col-span-7">
            <Reveal y={24}>
              <p className="text-sm font-medium text-neutral-700">
                Product-minded design & engineering
              </p>
            </Reveal>
            <Reveal delay={0.12} y={24}>
              <h1 className="mt-4 text-pretty text-4xl font-semibold tracking-tight text-neutral-900 md:text-6xl">
                Design that feels engineered — crafted for clarity.
              </h1>
            </Reveal>
            <Reveal delay={0.2} y={24}>
              <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-neutral-600 md:text-lg">
                I build premium, performance-first experiences with refined motion, meticulous typography,
                and systems that scale.
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
                  <dd className="mt-1 text-sm font-medium text-neutral-900">UI systems + motion</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-neutral-500">Outcome</dt>
                  <dd className="mt-1 text-sm font-medium text-neutral-900">Fast LCP, low CLS</dd>
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
              { title: 'Made to Move', sub: 'Motion Design', img: 'https://images.unsplash.com/photo-1526481280695-3c687fd5432c?auto=format&fit=crop&w=1800&q=70' },
              { title: 'Crafted for Clarity', sub: 'Product UI', img: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1800&q=70' },
            ]}
          />
        </div>
      </section>

      <section className="pb-16">
        <div className="grid gap-6 rounded-3xl border border-black/5 bg-white p-8 shadow-soft md:grid-cols-3">
          <div className="md:col-span-2">
            <h3 className="text-xl font-semibold tracking-tight text-neutral-900">
              A single motion system, everywhere.
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">
              Scroll reveals, hover lift, and page transitions share the same motion tokens — and respect
              reduced motion.
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
