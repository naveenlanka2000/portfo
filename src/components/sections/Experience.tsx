'use client';

import { motion, useReducedMotion } from 'framer-motion';

import { useSectionScrollProgress } from '@/hooks/useSectionScrollProgress';
import { cx } from '@/lib/utils';
import { motionTokens } from '@/lib/motion-tokens';
import { ObsidianShimmerExperienceHeading } from '@/components/ObsidianShimmerExperienceHeading';

import { SectionHeader } from './_ui';
import { BrandIcon } from './BrandIcon';

type ExperienceItem = {
  role: string;
  company: string;
  dateRange: string;
  bullets: string[];
};

const EXPERIENCE: ExperienceItem[] = [
  {
    role: 'Backend Developer',
    company: 'NFORCE Dental Management System',
    dateRange: 'Oct 2024 – Mar 2025',
    bullets: [
      'Built and maintained Java backend services for core clinical workflows.',
      'Implemented secure handling for patient records and appointment scheduling flows.',
      'Worked with cross-functional teams to improve reliability and performance.',
    ],
  },
];

export type ExperienceSectionProps = {
  className?: string;
};

export function ExperienceSection({ className }: ExperienceSectionProps) {
  const reduced = useReducedMotion();
  const { ref, progress } = useSectionScrollProgress({ rootMargin: '0px 0px -25% 0px', throttle: 'rAF' });

  return (
    <section
      id="experience"
      ref={ref}
      aria-labelledby="experience-title"
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
                <ObsidianShimmerExperienceHeading as="h2" className="text-4xl md:text-5xl" />
                <p className="mt-3 text-pretty text-base leading-relaxed text-neutral-600 md:text-lg">
                  Backend experience focused on secure workflows, clean data handling, and reliable delivery.
                </p>
              </motion.div>
              <div className="mt-6 h-px w-full bg-black/10" />
            </div>
            <span id="experience-title" className="sr-only">
              Experience
            </span>
          </div>

          <div className="md:col-span-8">
            <div className="grid gap-6">
              {EXPERIENCE.map((item, i) => (
                <motion.article
                  key={`${item.company}-${item.role}`}
                  role="article"
                  initial={reduced ? false : { opacity: 0, y: 14 }}
                  whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: motionTokens.durations.medium / 1000, ease: 'linear', delay: i * 0.06 }}
                  className={cx(
                    'rounded-xl border border-black/10 bg-white p-7',
                    'shadow-[0_1px_0_rgba(0,0,0,0.06),0_16px_40px_rgba(0,0,0,0.08)]',
                    'transition-transform [transition-duration:180ms] [transition-timing-function:cubic-bezier(0.2,0.8,0.2,1)]',
                    'hover:-translate-y-1 focus-within:-translate-y-1'
                  )}
                >
                  <div className="grid gap-6 md:grid-cols-12 md:items-start">
                    <div className="md:col-span-5">
                      <div className="flex items-start gap-4">
                        <BrandIcon kind="nforce" label="NFORCE" className="shrink-0" />
                        <div>
                          <h3 className="text-2xl font-semibold tracking-tight text-neutral-900 md:text-3xl">
                            {item.role}
                          </h3>
                          <p className="mt-1 text-sm font-medium text-neutral-700">
                            {item.company}
                          </p>
                          <p className="mt-2 text-sm text-neutral-500">{item.dateRange}</p>
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-2">
                        <span className="sr-only">Technologies:</span>
                        <span className="inline-flex min-h-11 items-center gap-2 rounded-full border border-black/10 bg-[#f8f8f8] px-4 text-sm text-neutral-700">
                          <span className="text-neutral-900">
                            <BrandIcon kind="java" label="Java" className="h-4 w-4 rounded-none" />
                          </span>
                          Java
                        </span>
                      </div>
                    </div>

                    <div className="md:col-span-7">
                      <ul className="grid gap-2 text-base leading-relaxed text-neutral-700 md:text-lg">
                        {item.bullets.map((b) => (
                          <li key={b} className="flex gap-3">
                            <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500/70" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
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
