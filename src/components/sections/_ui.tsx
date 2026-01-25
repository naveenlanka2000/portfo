'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { useMemo } from 'react';

import { cx } from '@/lib/utils';
import { clamp } from '@/utils/math';
import { motionTokens } from '@/lib/motion-tokens';
import { TopicHeading } from '@/components/TopicHeading';

export type SectionHeaderProps = {
  title: string;
  /** 0..1 section progress. */
  progress?: number;
  /** Optional subtitle line (kept minimal). */
  subtitle?: string;
};

export function SectionHeader({ title, progress, subtitle }: SectionHeaderProps) {
  const reduced = useReducedMotion();

  const opacity = useMemo(() => {
    if (progress == null) return 1;
    return clamp(progress / 0.2, 0, 1);
  }, [progress]);

  return (
    <div className="sticky top-20">
      <motion.div
        initial={false}
        animate={reduced ? { opacity: 1 } : { opacity }}
        transition={reduced ? { duration: motionTokens.durations.short / 1000 } : { duration: 0 }}
      >
        <TopicHeading title={title} subtitle={subtitle} />
      </motion.div>
      <div className="mt-6 h-px w-full bg-black/10" />
    </div>
  );
}

export type TechTagProps = {
  label: string;
  icon?: React.ReactNode;
  className?: string;
};

export function TechTag({ label, icon, className }: TechTagProps) {
  return (
    <span
      className={cx(
        'inline-flex min-h-11 items-center gap-2 rounded-full border border-black/10 bg-white px-4 text-sm text-neutral-700',
        className
      )}
    >
      {icon ? <span className="text-neutral-900">{icon}</span> : null}
      <span className="leading-none">{label}</span>
    </span>
  );
}

export type ScrollScrubImageProps = {
  /** For raster images; if omitted, provide children instead. */
  src?: string;
  alt: string;
  /** 0..1 section progress */
  progress: number;
  /** startOffsetPct ∈ [0.12, 0.20], default 0.16 */
  startOffsetPct?: number;
  /** opacity reveal range at start, default 0.2 */
  fadeInRange?: number;
  className?: string;
  /** Aspect ratio of the mask container. */
  aspectRatio?: string;
  children?: React.ReactNode;
  priority?: boolean;
};

export function ScrollScrubImage({
  src,
  alt,
  progress,
  startOffsetPct = 0.16,
  fadeInRange = 0.2,
  className,
  aspectRatio = '4 / 3',
  children,
  priority,
}: ScrollScrubImageProps) {
  const reduced = useReducedMotion();

  const opacity = useMemo(() => clamp(progress / fadeInRange, 0, 1), [fadeInRange, progress]);
  const translateYPct = useMemo(() => {
    if (reduced) return 0;
    const start = clamp(startOffsetPct, 0.12, 0.2);
    // translateY% = startOffsetPct * (1 − progress)
    return start * (1 - clamp(progress, 0, 1)) * 100;
  }, [progress, reduced, startOffsetPct]);

  return (
    <div
      className={cx(
        'relative overflow-hidden rounded-xl border border-black/10 bg-white',
        'shadow-[0_1px_0_rgba(0,0,0,0.06),0_16px_40px_rgba(0,0,0,0.08)]',
        className
      )}
      style={{ aspectRatio }}
    >
      <motion.div
        aria-hidden={!!src ? undefined : true}
        className="absolute inset-0"
        initial={false}
        animate={reduced ? { opacity: 1, y: 0 } : { opacity, y: `${translateYPct}%` }}
        transition={
          reduced
            ? { duration: motionTokens.durations.short / 1000, ease: motionTokens.ease }
            : { duration: 0 }
        }
      >
        {src ? (
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            sizes="(min-width: 768px) 520px, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full">{children}</div>
        )}
      </motion.div>

      {/* subtle sheen */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/30 via-white/0 to-white/0"
      />

      {/* accessible label for non-image children */}
      {!src ? <span className="sr-only">{alt}</span> : null}
    </div>
  );
}
