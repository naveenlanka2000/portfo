'use client';

import { motion, useReducedMotion } from 'framer-motion';

import { useSectionScrollProgress } from '@/hooks/useSectionScrollProgress';
import { cx } from '@/lib/utils';
import { motionTokens } from '@/lib/motion-tokens';
import { ObsidianShimmerExperienceHeading } from '@/components/ObsidianShimmerExperienceHeading';

import { TechTag } from './_ui';
import { BrandIcon } from './BrandIcon';

type ExperienceItem = {
  role: string;
  company: string;
  dateRange: string;
  bullets: string[];
};

const EXPERIENCE: ExperienceItem[] = [
  {
    role: 'Software Engineer',
    company: 'NFORCE Dental Management System',
    dateRange: 'Oct 2024 – Mar 2025',
    bullets: [
      'Built and maintained Java / Spring Boot backend services for core clinical workflows.',
      'Worked with MySQL data models + SQL queries to keep records consistent and reliable.',
      'Validated and tested APIs with Postman, focusing on edge cases and safe error handling.',
      'Collaborated with cross-functional teams to improve reliability and performance.',
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
                  Backend experience focused on secure workflows, clean data handling, and reliable delivery with Java, Spring Boot, and MySQL.
                </p>
              </motion.div>
              <div className="mt-6 h-px w-full bg-black/10" />


              <div className="mt-6">
                <div className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Toolbox</div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {['Java', 'Spring Boot', 'MySQL', 'SQL', 'Postman'].map((t) => (
                    <span
                      key={t}
                      className={
                        [
                          'group/tool inline-flex items-center gap-2 rounded-full bg-white/70 px-2.5 py-1',
                          'text-xs font-medium text-neutral-800 ring-1 ring-black/5',
                          'overflow-visible transition-[background-color] duration-200 ease-out hover:bg-white',
                        ].join(' ')
                      }
                    >
                      <BrandIcon
                        // uses tagToBrandKind logic embedded in Experience tags elsewhere, but here we keep it explicit
                        kind={
                          t === 'Java'
                            ? 'java'
                            : t === 'Spring Boot'
                              ? 'spring-boot'
                              : t === 'MySQL'
                                ? 'mysql'
                                : t === 'SQL'
                                  ? 'sql'
                                  : 'postman'
                        }
                        label={t}
                        className={
                          [
                            'h-4 w-4 shrink-0 rounded-md bg-transparent ring-0',
                            'transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
                            'group-hover/tool:scale-[2.05] hover:scale-[2.05]',
                            'motion-reduce:transition-none motion-reduce:group-hover/tool:scale-100 motion-reduce:hover:scale-100',
                          ].join(' ')
                        }
                      />
                      <span
                        className={
                          [
                            'overflow-hidden whitespace-nowrap',
                            'transition-opacity duration-200 ease-out',
                            'group-hover/tool:opacity-0',
                          ].join(' ')
                        }
                      >
                        {t}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
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
                    'rounded-2xl bg-white p-7',
                    'transition-transform [transition-duration:220ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]',
                    'hover:scale-[1.01] focus-within:scale-[1.01]',
                    'motion-reduce:hover:scale-100 motion-reduce:focus-within:scale-100'
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
                        <TechTag label="Java" icon={<BrandIcon kind="java" label="Java" className="h-4 w-4 rounded-md bg-transparent ring-0" />} className="bg-neutral-50 border-black/5" />
                        <TechTag label="Spring Boot" icon={<BrandIcon kind="spring-boot" label="Spring Boot" className="h-4 w-4 rounded-md bg-transparent ring-0" />} className="bg-neutral-50 border-black/5" />
                        <TechTag label="MySQL" icon={<BrandIcon kind="mysql" label="MySQL" className="h-4 w-4 rounded-md bg-transparent ring-0" />} className="bg-neutral-50 border-black/5" />
                        <TechTag label="SQL" icon={<BrandIcon kind="sql" label="SQL" className="h-4 w-4 rounded-md bg-transparent ring-0" />} className="bg-neutral-50 border-black/5" />
                        <TechTag label="Postman" icon={<BrandIcon kind="postman" label="Postman" className="h-4 w-4 rounded-md bg-transparent ring-0" />} className="bg-neutral-50 border-black/5" />
                        <TechTag label="Git" icon={<BrandIcon kind="git" label="Git" className="h-4 w-4 rounded-md bg-transparent ring-0" />} className="bg-neutral-50 border-black/5" />
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
