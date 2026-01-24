'use client';

import { motion, useReducedMotion } from 'framer-motion';

import { cx } from '@/lib/utils';
import { carouselMotion } from '@/components/carousel/motionPresets';

type CarouselDotsProps = {
  count: number;
  index: number;
  onSelect: (index: number) => void;
  className?: string;
};

export function CarouselDots({ count, index, onSelect, className }: CarouselDotsProps) {
  const reduced = useReducedMotion();

  if (count <= 1) return null;

  return (
    <div
      className={cx(
        'mt-4 flex items-center justify-center',
        'rounded-full border border-white/10 bg-neutral-950/35 px-2 py-1.5',
        'backdrop-blur-md shadow-soft',
        className
      )}
      role="tablist"
      aria-label="Carousel pagination"
    >
      {Array.from({ length: count }).map((_, i) => {
        const active = i === index;

        return (
          <button
            key={i}
            type="button"
            onClick={() => onSelect(i)}
            className={cx(
              'group inline-flex h-11 w-11 items-center justify-center rounded-full',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950/40'
            )}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={active ? 'true' : undefined}
          >
            <motion.span
              className={cx(
                'block rounded-full bg-white/65',
                active ? 'bg-white' : 'group-hover:bg-white/80'
              )}
              animate={{
                width: active ? 12 : 10,
                height: active ? 12 : 10,
                opacity: active ? 1 : 0.75,
                scale: active ? 1 : 1,
              }}
              transition={
                reduced
                  ? { duration: carouselMotion.durations.short, ease: carouselMotion.easing.defaultCurve }
                  : { duration: carouselMotion.durations.medium, ease: carouselMotion.easing.butterCurve }
              }
            />
          </button>
        );
      })}
    </div>
  );
}
