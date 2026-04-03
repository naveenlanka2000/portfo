'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useMemo } from 'react';

import { useSectionScrollProgress } from '@/hooks/useSectionScrollProgress';
import { cx } from '@/lib/utils';
import { motionTokens } from '@/lib/motion-tokens';
import { ObsidianShimmerExperienceHeading } from '@/components/ObsidianShimmerExperienceHeading';
import { tagToBrandKind } from '@/lib/brand';

import { TechTag } from './_ui';
import { LeafMark } from './_marks';
import { BrandIcon, type BrandKind } from './BrandIcon';
import { ResearchImageSlider } from './ResearchImageSlider';

type ResearchItem = {
  title: string;
  context: string;
  summary: string;
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
  context: 'Academic machine learning research',
  summary: 'Built for practical medicinal leaf recognition through computer vision and applied model evaluation.',
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
      className={cx('scroll-mt-28 bg-white py-14 sm:py-16 md:py-20', className)}
    >
      <div className="site-shell">
        <div className="grid gap-8 sm:gap-10 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-4">
            <div className="md:sticky md:top-14">
              <motion.div
                initial={false}
                animate={reduced ? { opacity: 1 } : { opacity: Math.min(1, Math.max(0, progress / 0.2)) }}
                transition={reduced ? { duration: motionTokens.durations.short / 1000 } : { duration: 0 }}
              >
                <ObsidianShimmerExperienceHeading
                  as="h2"
                  text="Research"
                  className="text-3xl sm:text-4xl md:text-5xl"
                />
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
                          'inline-flex items-center gap-2 rounded-full bg-white/70 px-2.5 py-1',
                          'text-xs font-medium text-neutral-800 ring-1 ring-black/5',
                          'overflow-visible',
                        ].join(' ')
                      }
                    >
                      <BrandIcon
                        kind={tagToBrandKind(t) as BrandKind}
                        label={t}
                        bare
                        className={
                          [
                            'h-4 w-4 shrink-0 origin-center',
                            'transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
                            'hover:scale-[1.8]',
                            'motion-reduce:transition-none motion-reduce:hover:scale-100',
                          ].join(' ')
                        }
                      />
                      <span>{t}</span>
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
            <motion.article
              role="article"
              initial={reduced ? false : { opacity: 0, y: 14 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: motionTokens.durations.medium / 1000, ease: 'linear' }}
              className={cx(
                'rounded-2xl bg-white p-4 sm:p-6 md:p-7',
                'transition-transform [transition-duration:220ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]',
                'hover:scale-[1.01] focus-within:scale-[1.01]',
                'motion-reduce:hover:scale-100 motion-reduce:focus-within:scale-100'
              )}
            >
              <div className="grid gap-6 md:grid-cols-12 md:items-start">
                <div className="md:col-span-5">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-black/10 bg-[linear-gradient(180deg,#f8fbff_0%,#edf5ff_100%)] p-1.5 sm:h-14 sm:w-14">
                      <LeafMark title="Leaf mark" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold tracking-tight text-neutral-900 sm:text-2xl md:text-3xl">
                        {RESEARCH.title}
                      </h3>
                      <p className="mt-1 text-sm font-medium text-neutral-700">{RESEARCH.context}</p>
                      <p className="mt-2 text-sm text-neutral-500">{RESEARCH.summary}</p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <span className="sr-only">Technologies:</span>
                    <TechTag label="CNN" className="bg-neutral-50 border-black/5" />
                    <TechTag
                      label="TensorFlow"
                      icon={<BrandIcon kind="tensorflow" label="TensorFlow" bare className="h-4 w-4" />}
                      className="bg-neutral-50 border-black/5"
                    />
                    <TechTag
                      label="Keras"
                      icon={<BrandIcon kind="keras" label="Keras" bare className="h-4 w-4" />}
                      className="bg-neutral-50 border-black/5"
                    />
                    <TechTag
                      label="OpenCV"
                      icon={<BrandIcon kind="opencv" label="OpenCV" bare className="h-4 w-4" />}
                      className="bg-neutral-50 border-black/5"
                    />
                    <TechTag
                      label="NumPy"
                      icon={<BrandIcon kind="numpy" label="NumPy" bare className="h-4 w-4" />}
                      className="bg-neutral-50 border-black/5"
                    />
                    <TechTag
                      label="Pandas"
                      icon={<BrandIcon kind="pandas" label="Pandas" bare className="h-4 w-4" />}
                      className="bg-neutral-50 border-black/5"
                    />
                  </div>
                </div>

                <div className="md:col-span-7">
                  <ul className="grid gap-2 text-base leading-relaxed text-neutral-700 md:text-lg">
                    {RESEARCH.bullets.map((b) => (
                      <li key={b} className="flex gap-3">
                        <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500/70" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 rounded-lg bg-[#f8f8f8] p-3 sm:mt-7 sm:p-4">
                    <div className="flex flex-wrap items-baseline justify-between gap-3">
                      <h4 className="text-sm font-semibold tracking-tight text-neutral-900">Model results</h4>
                      <p className="text-xs text-neutral-600">from evaluation plots</p>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {metricCards.map((m) => (
                        <div key={m.label} className="rounded-md bg-white px-2.5 py-2 sm:px-3">
                          <div className="text-[10px] uppercase leading-tight tracking-wide text-neutral-500 sm:text-[11px]">
                            {m.label}
                          </div>
                          <div className="mt-0.5 text-sm font-semibold tabular-nums text-neutral-900 sm:text-base">
                            {m.pct.toFixed(1)}%
                          </div>

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
                </div>
              </div>
            </motion.article>

            <motion.div
              initial={reduced ? false : { opacity: 0, y: 10 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: motionTokens.durations.medium / 1000, ease: 'linear' }}
              className={cx('mt-6 rounded-2xl bg-white p-4 sm:p-6 md:p-7')}
            >
              <div className="flex flex-wrap items-start justify-between gap-3 sm:items-baseline">
                <div>
                  <h3 className="text-lg font-semibold tracking-tight text-neutral-900 md:text-xl">Evaluation plots</h3>
                  <p className="mt-1 text-sm text-neutral-600">Swipe or use the controls to inspect each result plot.</p>
                </div>
                <p className="hidden text-sm text-neutral-500 sm:block">Each slide opens full size.</p>
              </div>

              <ResearchImageSlider
                className="mt-5"
                ariaLabel="Research evaluation plots"
                items={RESEARCH_FIGURES.map((figure, index) => ({
                  ...figure,
                  eyebrow: `Plot ${index + 1}`,
                }))}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
