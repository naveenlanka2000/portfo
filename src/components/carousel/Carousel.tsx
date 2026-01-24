'use client';

import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useCallback, useMemo, useRef, useState } from 'react';

import { cx } from '@/lib/utils';
import { CarouselDots } from '@/components/carousel/CarouselDots';
import { CarouselAnimationPreset, getSlideVariants } from '@/components/carousel/motionPresets';
import { useCarousel } from '@/components/carousel/useCarousel';

export type CarouselItem = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  aspectRatio?: string;
  blurDataURL?: string;
};

export type CarouselProps = {
  items: CarouselItem[];
  intervalMs?: number;
  startIndex?: number;
  loop?: boolean;
  showDots?: boolean;
  onIndexChange?: (index: number) => void;
  className?: string;
  priorityFirstImage?: boolean;
  animation?: CarouselAnimationPreset;
  ariaLabel?: string;
  aspectRatio?: string;
};

export function Carousel({
  items,
  intervalMs = 5000,
  startIndex = 0,
  loop = true,
  showDots = true,
  onIndexChange,
  className,
  priorityFirstImage = true,
  animation = 'butter',
  ariaLabel = 'Image carousel',
  aspectRatio,
}: CarouselProps) {
  const reduced = useReducedMotion();
  const count = items.length;

  const slideVariants = useMemo(() => getSlideVariants(animation), [animation]);

  const {
    index,
    direction,
    navKind,
    goTo,
    next,
    prev,
    onPointerEnter,
    onPointerLeave,
    onFocusCapture,
    onBlurCapture,
    isReducedMotion,
  } = useCarousel({
    count,
    startIndex,
    loop,
    intervalMs,
    autoplay: true,
  });

  const [pendingIndex, setPendingIndex] = useState<number | null>(null);
  const animatingRef = useRef(false);

  const activeAspectRatio =
    aspectRatio ?? items[index]?.aspectRatio ?? items[0]?.aspectRatio ?? '4 / 5';

  const setIndexSafe = useCallback(
    (target: number) => {
      if (!count) return;

      if (animatingRef.current) {
        setPendingIndex(target);
        return;
      }

      onIndexChange?.(target);
      goTo(target);
    },
    [count, goTo, onIndexChange]
  );

  const onExitComplete = useCallback(() => {
    animatingRef.current = false;
    if (pendingIndex == null) return;
    const nextTarget = pendingIndex;
    setPendingIndex(null);
    onIndexChange?.(nextTarget);
    goTo(nextTarget);
  }, [goTo, onIndexChange, pendingIndex]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      const key = e.key;
      if (key !== 'ArrowLeft' && key !== 'ArrowRight' && key !== 'Home' && key !== 'End') return;

      e.preventDefault();

      if (key === 'ArrowLeft') prev();
      if (key === 'ArrowRight') next();
      if (key === 'Home') setIndexSafe(0);
      if (key === 'End') setIndexSafe(count - 1);
    },
    [count, next, prev, setIndexSafe]
  );

  if (count === 0) return null;

  const active = items[index];

  return (
    <section
      className={cx('w-full', className)}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      aria-live="off"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onFocusCapture={onFocusCapture}
      onBlurCapture={onBlurCapture}
    >
      <div
        className={cx(
          'relative overflow-hidden rounded-2xl bg-neutral-950',
          'border border-black/5 shadow-soft'
        )}
        style={{ aspectRatio: activeAspectRatio }}
      >
        <AnimatePresence
          initial={false}
          mode="wait"
          onExitComplete={onExitComplete}
        >
          <motion.div
            key={index}
            className="absolute inset-0"
            custom={{
              direction,
              reduced: !!reduced,
              jump: navKind === 'jump' || isReducedMotion,
            }}
            variants={slideVariants}
            initial="exit"
            animate="center"
            exit="exit"
            onAnimationStart={() => {
              animatingRef.current = true;
            }}
          >
            <div role="group" aria-label={`Slide ${index + 1} of ${count}`} className="absolute inset-0">
              <Image
                src={active.src}
                alt={active.alt}
                fill
                priority={priorityFirstImage && index === 0}
                placeholder={active.blurDataURL ? 'blur' : 'empty'}
                blurDataURL={active.blurDataURL}
                sizes="(min-width: 768px) 420px, 100vw"
                className="object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/45 via-neutral-950/0 to-neutral-950/0" />
            </div>
          </motion.div>
        </AnimatePresence>

        <button
          type="button"
          onClick={prev}
          className={cx(
            'absolute left-3 top-1/2 -translate-y-1/2',
            'hidden h-10 w-10 items-center justify-center rounded-full',
            'bg-white/10 text-white backdrop-blur-md',
            'transition-opacity duration-200 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 md:inline-flex'
          )}
          aria-label="Previous slide"
        >
          <span aria-hidden>‹</span>
        </button>
        <button
          type="button"
          onClick={next}
          className={cx(
            'absolute right-3 top-1/2 -translate-y-1/2',
            'hidden h-10 w-10 items-center justify-center rounded-full',
            'bg-white/10 text-white backdrop-blur-md',
            'transition-opacity duration-200 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 md:inline-flex'
          )}
          aria-label="Next slide"
        >
          <span aria-hidden>›</span>
        </button>
      </div>

      {showDots ? (
        <CarouselDots
          count={count}
          index={index}
          onSelect={(i) => {
            setIndexSafe(i);
          }}
        />
      ) : null}
    </section>
  );
}
