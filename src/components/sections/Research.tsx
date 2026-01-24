'use client';

import { motion, useReducedMotion } from 'framer-motion';

import { useSectionScrollProgress } from '@/hooks/useSectionScrollProgress';
import { cx } from '@/lib/utils';
import { motionTokens } from '@/lib/motion-tokens';

import { SectionHeader, ScrollScrubImage } from './_ui';
import { LeafMark } from './_marks';

type ResearchItem = {
  title: string;
  bullets: string[];
};

const RESEARCH: ResearchItem = {
  title: 'CNN-Based Sri Lankan Medicinal Leaf Classification',
  bullets: [
    'Conducted research on applying Convolutional Neural Networks (CNN) to classify Sri Lankan medicinal leaves.',
    'Focused on supporting Ayurvedic medicine by identifying treatments through accurate leaf recognition.',
    'Designed and trained deep learning models using Keras/TensorFlow, improving classification accuracy.',
  ],
};

export type ResearchSectionProps = {
  className?: string;
};

export function ResearchSection({ className }: ResearchSectionProps) {
  const reduced = useReducedMotion();
  const { ref, progress } = useSectionScrollProgress({ rootMargin: '0px 0px -25% 0px', throttle: 'rAF' });

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
            <SectionHeader
              title="Research"
              subtitle="Applied ML research with a practical goal: better identification through vision." 
              progress={progress}
            />
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
                  className={cx(
                    'rounded-xl border border-black/10 bg-white p-7',
                    'shadow-[0_1px_0_rgba(0,0,0,0.06),0_16px_40px_rgba(0,0,0,0.08)]'
                  )}
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
                    <span className="inline-flex min-h-11 items-center rounded-full border border-black/10 bg-[#f8f8f8] px-4 text-sm text-neutral-700">
                      CNN
                    </span>
                    <span className="inline-flex min-h-11 items-center rounded-full border border-black/10 bg-[#f8f8f8] px-4 text-sm text-neutral-700">
                      TensorFlow
                    </span>
                    <span className="inline-flex min-h-11 items-center rounded-full border border-black/10 bg-[#f8f8f8] px-4 text-sm text-neutral-700">
                      Keras
                    </span>
                  </div>
                </motion.article>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
