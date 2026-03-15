'use client';

import { motion, useReducedMotion } from 'framer-motion';

import { useSectionScrollProgress } from '@/hooks/useSectionScrollProgress';
import { cx } from '@/lib/utils';
import { motionTokens } from '@/lib/motion-tokens';
import { ObsidianShimmerExperienceHeading } from '@/components/ObsidianShimmerExperienceHeading';
import { tagToBrandKind } from '@/lib/brand';
import { projects } from '@/lib/projects';

import { BrandIcon, type BrandKind } from './BrandIcon';
import { TechTag } from './_ui';

const PROJECT_TOOLBOX = ['Java', 'Spring Boot', 'MySQL', 'SQL', 'Postman', 'Git', 'React', 'Flutter'] as const;

export type ProjectsSectionProps = {
  className?: string;
};

export function ProjectsSection({ className }: ProjectsSectionProps) {
  const reduced = useReducedMotion();
  const { ref, progress } = useSectionScrollProgress({ rootMargin: '0px 0px -25% 0px', throttle: 'rAF' });

  return (
    <section
      id="projects"
      ref={ref}
      aria-labelledby="projects-title"
      className={cx('scroll-mt-28 bg-white py-16 md:py-20', className)}
    >
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid gap-10 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-4">
            <div className="sticky top-14">
              <motion.div
                initial={false}
                animate={reduced ? { opacity: 1 } : { opacity: Math.min(1, Math.max(0, progress / 0.2)) }}
                transition={reduced ? { duration: motionTokens.durations.short / 1000 } : { duration: 0 }}
              >
                <ObsidianShimmerExperienceHeading as="h2" text="Projects" className="text-4xl md:text-5xl" />
                <p className="mt-3 text-pretty text-base leading-relaxed text-neutral-600 md:text-lg">
                  Selected builds across backend services, booking workflows, mobile apps, and data-driven web UIs.
                </p>
              </motion.div>
              <div className="mt-6 h-px w-full bg-black/10" />

              <div className="mt-6">
                <div className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Toolbox</div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {PROJECT_TOOLBOX.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-2 rounded-full bg-white/70 px-2.5 py-1 text-xs font-medium text-neutral-800 ring-1 ring-black/5"
                    >
                      <BrandIcon
                        kind={tagToBrandKind(t) as BrandKind}
                        label={t}
                        className="h-4 w-4 rounded-md bg-transparent ring-0"
                      />
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <span id="projects-title" className="sr-only">
              Projects
            </span>
          </div>

          <div className="md:col-span-8">
            <div className="grid gap-6 md:grid-cols-2">
              {projects.slice(0, 4).map((p, i) => (
                <motion.article
                  key={p.title}
                  role="article"
                  initial={reduced ? false : { opacity: 0, y: 14 }}
                  whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: motionTokens.durations.medium / 1000, ease: 'linear', delay: i * 0.06 }}
                  className={cx(
                    'group rounded-2xl bg-white p-7',
                    'transition-transform [transition-duration:220ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]',
                    'hover:scale-[1.01] focus-within:scale-[1.01]',
                    'motion-reduce:hover:scale-100 motion-reduce:focus-within:scale-100'
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-2xl font-semibold tracking-tight text-neutral-900 md:text-3xl">
                      {p.title}
                    </h3>
                    <span
                      aria-hidden
                      className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-[#f8f8f8] text-accent-500"
                    >
                      <span className="h-2 w-2 rounded-full bg-accent-500" />
                    </span>
                  </div>

                  <p className="mt-3 text-base leading-relaxed text-neutral-700 md:text-lg">{p.tagline}</p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {p.stack.map((t) => (
                      <TechTag
                        key={t}
                        label={t}
                        icon={
                          <BrandIcon
                            kind={tagToBrandKind(t) as BrandKind}
                            label={t}
                            className="h-4 w-4 rounded-md bg-transparent ring-0"
                          />
                        }
                        className="bg-neutral-50 border-black/5"
                      />
                    ))}
                  </div>
                </motion.article>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
