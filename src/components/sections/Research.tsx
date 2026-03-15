'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { useMemo } from 'react';

import { useSectionScrollProgress } from '@/hooks/useSectionScrollProgress';
import { cx, withBasePath } from '@/lib/utils';
import { motionTokens } from '@/lib/motion-tokens';
import { ObsidianShimmerExperienceHeading } from '@/components/ObsidianShimmerExperienceHeading';
import { tagToBrandKind } from '@/lib/brand';

import { ScrollScrubImage, TechTag } from './_ui';
import { LeafMark } from './_marks';
import { BrandIcon, type BrandKind } from './BrandIcon';

type ResearchItem = {
  title: string;
  bullets: string[];
  toolbox: string[];
};

type ResearchFigure = {
  src: string;
  alt: string;
  caption: string;
};

const RESEARCH: ResearchItem = {
  title: 'Medicinal Leaf Classification via CNN',
  bullets: [
    'Developed a Convolutional Neural Network for medicinal leaf classification.',
    'Engineered a model to support Ayurvedic medicine with image recognition.',
    'Iteratively trained and validated models using Keras and TensorFlow.',
  ],
  toolbox: ['Python', 'TensorFlow', 'Keras', 'OpenCV', 'NumPy', 'Pandas', 'Jupyter'],
};

const RESEARCH_FIGURES: ResearchFigure[] = [
  {
    src: '/research/medicinal-cnn/training-curves.svg',
    alt: 'Training and validation accuracy/loss curves for the CNN model',
    caption: 'Training/validation curves',
  },
  {
    src: '/research/medicinal-cnn/confusion-matrix.svg',
    alt: 'Confusion matrix for defect vs no_defect classification',
    caption: 'Confusion matrix',
  },
  {
    src: '/research/medicinal-cnn/epoch-loss.svg',
    alt: 'Epoch-by-epoch loss decreasing during CNN training',
    caption: 'Epoch loss (training)',
  },
  {
    src: '/research/medicinal-cnn/training-log.svg',
    alt: 'Training log showing accuracy and validation metrics across epochs',
    caption: 'Training log snapshot',
  },
];

// Derived from the provided confusion matrix screenshot:
// True defect: 32 predicted defect, 1 predicted no_defect
// True no_defect: 10 predicted defect, 23 predicted no_defect
const RESEARCH_METRICS = {
  accuracy: (32 + 23) / (32 + 1 + 10 + 23),
  precisionDefect: 32 / (32 + 10),
  recallDefect: 32 / (32 + 1),
  f1Defect: (2 * (32 / (32 + 10)) * (32 / (32 + 1))) / ((32 / (32 + 10)) + (32 / (32 + 1))),
};

export type ResearchSectionProps = {
  className?: string;
};

export function ResearchSection({ className }: ResearchSectionProps) {
  const reduced = useReducedMotion();
  const { ref, progress } = useSectionScrollProgress({ rootMargin: '0px 0px -25% 0px', throttle: 'rAF' });

  const metricCards = useMemo(
    () =>
      [
        { label: 'Accuracy', value: RESEARCH_METRICS.accuracy },
        { label: 'F1 (defect)', value: RESEARCH_METRICS.f1Defect },
        { label: 'Precision (defect)', value: RESEARCH_METRICS.precisionDefect },
        { label: 'Recall (defect)', value: RESEARCH_METRICS.recallDefect },
      ].map((m) => ({
        ...m,
        pct: Math.max(0, Math.min(100, m.value * 100)),
      })),
    []
  );

  return (
    <section
      id="research"
      ref={ref}
      aria-labelledby="research-title"
      className={cx('scroll-mt-28 bg-[#f8f8f8] py-16 md:py-20', className)}
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
                <ObsidianShimmerExperienceHeading as="h2" text="Research" className="text-4xl md:text-5xl" />
                <p className="mt-3 text-pretty text-base leading-relaxed text-neutral-600 md:text-lg">
                  Applied ML research aimed at accurate identification through computer vision.
                </p>
              </motion.div>
              <div className="mt-6 h-px w-full bg-black/10" />

              <div className="mt-6">
                <div className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Toolbox</div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {RESEARCH.toolbox.map((t) => (
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
                        kind={tagToBrandKind(t) as BrandKind}
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
            <span id="research-title" className="sr-only">
              Research
            </span>
          </div>

          <div className="md:col-span-8">
            <div className="grid gap-6 md:grid-cols-12 md:items-start">
              <div className="md:col-span-5">
                <ScrollScrubImage
                  alt="Leaf motif representing CNN-based medicinal leaf classification"
                  progress={progress}
                  startOffsetPct={0.16}
                  fadeInRange={0.2}
                  aspectRatio="4 / 5"
                  className="bg-white"
                  priority={false}
                >
                  <LeafMark title="Leaf mark" />
                </ScrollScrubImage>
              </div>

              <div className="md:col-span-7">
                <motion.article
                  role="article"
                  initial={reduced ? false : { opacity: 0, y: 14 }}
                  whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: motionTokens.durations.medium / 1000, ease: 'linear' }}
                  className={cx('rounded-xl bg-white p-7')}
                >
                  <h3 className="text-2xl font-semibold tracking-tight text-neutral-900 md:text-3xl">
                    {RESEARCH.title}
                  </h3>

                  <ul className="mt-4 grid gap-2 text-base leading-relaxed text-neutral-700 md:text-lg">
                    {RESEARCH.bullets.map((b) => (
                      <li key={b} className="flex gap-3">
                        <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500/70" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 flex flex-wrap gap-2">
                    <span className="sr-only">Technologies:</span>
                    <TechTag label="CNN" className="bg-neutral-50 border-black/5" />
                    <TechTag
                      label="TensorFlow"
                      icon={<BrandIcon kind="tensorflow" label="TensorFlow" className="h-4 w-4 rounded-md bg-transparent ring-0" />}
                      className="bg-neutral-50 border-black/5"
                    />
                    <TechTag
                      label="Keras"
                      icon={<BrandIcon kind="keras" label="Keras" className="h-4 w-4 rounded-md bg-transparent ring-0" />}
                      className="bg-neutral-50 border-black/5"
                    />
                    <TechTag
                      label="OpenCV"
                      icon={<BrandIcon kind="opencv" label="OpenCV" className="h-4 w-4 rounded-md bg-transparent ring-0" />}
                      className="bg-neutral-50 border-black/5"
                    />
                    <TechTag
                      label="NumPy"
                      icon={<BrandIcon kind="numpy" label="NumPy" className="h-4 w-4 rounded-md bg-transparent ring-0" />}
                      className="bg-neutral-50 border-black/5"
                    />
                    <TechTag
                      label="Pandas"
                      icon={<BrandIcon kind="pandas" label="Pandas" className="h-4 w-4 rounded-md bg-transparent ring-0" />}
                      className="bg-neutral-50 border-black/5"
                    />
                  </div>

                  <div className="mt-7 rounded-lg bg-[#f8f8f8] p-4">
                    <div className="flex flex-wrap items-baseline justify-between gap-3">
                      <h4 className="text-sm font-semibold tracking-tight text-neutral-900">Model results</h4>
                      <p className="text-xs text-neutral-600">from evaluation plots</p>
                    </div>

                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {metricCards.map((m) => (
                        <div key={m.label} className="rounded-md bg-white px-3 py-2">
                          <div className="text-[11px] uppercase tracking-wide text-neutral-500">{m.label}</div>
                          <div className="mt-0.5 text-base font-semibold tabular-nums text-neutral-900">{m.pct.toFixed(1)}%</div>

                          <div
                            role="meter"
                            aria-label={`${m.label}: ${m.pct.toFixed(1)}%`}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-valuenow={Number(m.pct.toFixed(1))}
                            className="mt-2 h-2 w-full overflow-hidden rounded-full bg-neutral-100 ring-1 ring-black/5"
                          >
                            <motion.div
                              className="h-full rounded-full bg-[linear-gradient(90deg,rgba(16,185,129,0.72),rgba(16,185,129,0.95))]"
                              initial={reduced ? false : { width: 0 }}
                              whileInView={reduced ? undefined : { width: `${m.pct}%` }}
                              viewport={reduced ? undefined : { once: true, amount: 0.7 }}
                              transition={
                                reduced
                                  ? { duration: 0 }
                                  : { duration: 0.9, ease: [0.16, 1, 0.3, 1] }
                              }
                              style={reduced ? { width: `${m.pct}%` } : undefined}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.article>
              </div>
            </div>

            <motion.div
              initial={reduced ? false : { opacity: 0, y: 10 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: motionTokens.durations.medium / 1000, ease: 'linear' }}
              className={cx('mt-6 rounded-xl bg-white p-6')}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h3 className="text-lg font-semibold tracking-tight text-neutral-900 md:text-xl">Evaluation plots</h3>
                <p className="text-sm text-neutral-600">click to open full size</p>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {RESEARCH_FIGURES.map((fig) => {
                  const src = withBasePath(fig.src);
                  return (
                    <a
                      key={fig.src}
                      href={src}
                      target="_blank"
                      rel="noreferrer"
                      className={cx(
                        'group block overflow-hidden rounded-lg bg-[#f8f8f8]'
                      )}
                    >
                      <div className="aspect-[16/10] w-full overflow-hidden">
                        <Image
                          src={src}
                          alt={fig.alt}
                          width={1600}
                          height={1000}
                          sizes="(min-width: 640px) 50vw, 100vw"
                          className={cx(
                            'h-full w-full object-contain p-3',
                            'transition-transform duration-300 motion-reduce:transition-none',
                            'group-hover:scale-[1.02]'
                          )}
                        />
                      </div>
                      <div className="bg-white px-4 py-3">
                        <div className="text-sm font-medium text-neutral-900">{fig.caption}</div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
