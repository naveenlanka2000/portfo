'use client';

import { motion, useReducedMotion } from 'framer-motion';

import { useSectionScrollProgress } from '@/hooks/useSectionScrollProgress';
import { cx } from '@/lib/utils';
import { motionTokens } from '@/lib/motion-tokens';
import { ObsidianShimmerExperienceHeading } from '@/components/ObsidianShimmerExperienceHeading';
import { tagToBrandKind } from '@/lib/brand';

import { BrandIcon, type BrandKind } from './BrandIcon';

type ProjectItem = {
  title: string;
  description: string;
  tags: string[];
};

const PROJECTS: ProjectItem[] = [
  {
    title: 'Online Banking Application',
    description:
      'Built a feedback management module using React, Spring Boot, and MySQL. Implemented secure backend services with IntelliJ IDEA.',
    tags: ['React', 'Spring Boot', 'MySQL'],
  },
  {
    title: 'Air Ticket Booking System',
    description: 'Designed a reservation system in Java and SQL for booking, cancellations, and passenger data handling.',
    tags: ['Java', 'SQL'],
  },
  {
    title: 'Medicare Application',
    description: 'Developed a cross-platform healthcare app using Flutter for appointment management and medical resources.',
    tags: ['Flutter'],
  },
  {
    title: 'Food Market Database Management',
    description:
      'Created a web application using HTML, CSS, JavaScript, and SQL to manage inventory, sales, and suppliers.',
    tags: ['HTML', 'CSS', 'JavaScript', 'SQL'],
  },
];

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
            </div>
            <span id="projects-title" className="sr-only">
              Projects
            </span>
          </div>

          <div className="md:col-span-8">
            <div className="grid gap-6 md:grid-cols-2">
              {PROJECTS.map((p, i) => (
                <motion.article
                  key={p.title}
                  role="article"
                  initial={reduced ? false : { opacity: 0, y: 14 }}
                  whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: motionTokens.durations.medium / 1000, ease: 'linear', delay: i * 0.06 }}
                  className={cx(
                    'group rounded-xl border border-black/10 bg-white p-7',
                    'shadow-[0_1px_0_rgba(0,0,0,0.06),0_16px_40px_rgba(0,0,0,0.08)]',
                    'transition-transform [transition-duration:180ms] [transition-timing-function:cubic-bezier(0.2,0.8,0.2,1)]',
                    'hover:-translate-y-1 focus-within:-translate-y-1'
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

                  <p className="mt-3 text-base leading-relaxed text-neutral-700 md:text-lg">{p.description}</p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="inline-flex min-h-11 items-center gap-2 rounded-full border border-black/10 bg-[#f8f8f8] px-4 text-sm text-neutral-700"
                      >
                        <span className="text-neutral-900">
                          <BrandIcon
                            kind={tagToBrandKind(t) as BrandKind}
                            label={t}
                            className="h-4 w-4 rounded-md bg-transparent ring-0 transition-transform duration-200 ease-out hover:scale-150"
                          />
                        </span>
                        {t}
                      </span>
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
