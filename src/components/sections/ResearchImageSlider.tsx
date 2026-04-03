'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { useReducedMotion } from 'framer-motion';
import Image from 'next/image';

import { cx, withBasePath } from '@/lib/utils';
import { clamp } from '@/utils/math';

import { SliderDots } from './SliderDots';

export type ResearchSliderItem = {
  src: string;
  alt: string;
  caption: string;
  eyebrow?: string;
};

export type ResearchImageSliderProps = {
  items: ResearchSliderItem[];
  className?: string;
  ariaLabel?: string;
};

const FILL_DURATION = 3500;

export function ResearchImageSlider({
  items,
  className,
  ariaLabel = 'Research evaluation plots',
}: ResearchImageSliderProps) {
  const reduced = useReducedMotion();
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);
  const [snapPositions, setSnapPositions] = useState<number[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  const count = items.length;

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || count === 0) return;

    const measure = () => {
      const viewportWidth = viewport.clientWidth;
      const positions = cardRefs.current.slice(0, count).map((card) => {
        if (!card) return 0;
        return Math.max(0, card.offsetLeft - (viewportWidth - card.clientWidth) / 2);
      });

      setSnapPositions(positions);

      let nearest = 0;
      let nearestDistance = Number.POSITIVE_INFINITY;

      positions.forEach((position, index) => {
        const distance = Math.abs(position - viewport.scrollLeft);
        if (distance < nearestDistance) {
          nearest = index;
          nearestDistance = distance;
        }
      });

      setActiveIndex(nearest);
    };

    measure();

    const resizeObserver = new ResizeObserver(() => measure());
    resizeObserver.observe(viewport);
    cardRefs.current.forEach((card) => {
      if (card) resizeObserver.observe(card);
    });

    window.addEventListener('resize', measure, { passive: true });

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [count]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || snapPositions.length === 0) return;

    let frame = 0;

    const syncActiveIndex = () => {
      frame = 0;

      let nearest = 0;
      let nearestDistance = Number.POSITIVE_INFINITY;

      snapPositions.forEach((position, index) => {
        const distance = Math.abs(position - viewport.scrollLeft);
        if (distance < nearestDistance) {
          nearest = index;
          nearestDistance = distance;
        }
      });

      setActiveIndex(nearest);
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(syncActiveIndex);
    };

    viewport.addEventListener('scroll', onScroll, { passive: true });
    syncActiveIndex();

    return () => {
      viewport.removeEventListener('scroll', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [snapPositions]);

  useEffect(() => {
    if (!reduced && count > 1) return;
    setIsPlaying(false);
    setProgress(0);
  }, [count, reduced]);

  useEffect(() => {
    setProgress(0);
  }, [activeIndex]);

  const scrollToIndex = useCallback(
    (nextIndex: number, behavior?: ScrollBehavior) => {
      const viewport = viewportRef.current;
      if (!viewport || snapPositions.length === 0) return;

      const safeIndex = clamp(nextIndex, 0, count - 1);
      setActiveIndex(safeIndex);
      viewport.scrollTo({
        left: snapPositions[safeIndex] ?? 0,
        behavior: behavior ?? (reduced ? 'auto' : 'smooth'),
      });
    },
    [count, reduced, snapPositions]
  );

  useEffect(() => {
    if (!isPlaying) return;
    if (reduced) return;
    if (count <= 1) return;
    if (snapPositions.length === 0) return;

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const nextProgress = Math.min(elapsed / FILL_DURATION, 1);
      setProgress(nextProgress);

      if (nextProgress >= 1) {
        const nextIndex = activeIndex === count - 1 ? 0 : activeIndex + 1;
        scrollToIndex(nextIndex, nextIndex === 0 ? 'auto' : 'smooth');
        return;
      }

      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [activeIndex, count, isPlaying, reduced, scrollToIndex, snapPositions.length]);

  if (count === 0) return null;

  return (
    <section
      className={cx('w-full overflow-hidden', className)}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          scrollToIndex(activeIndex - 1);
        }

        if (event.key === 'ArrowRight') {
          event.preventDefault();
          scrollToIndex(activeIndex + 1);
        }

        if (event.key === 'Home') {
          event.preventDefault();
          scrollToIndex(0);
        }

        if (event.key === 'End') {
          event.preventDefault();
          scrollToIndex(count - 1);
        }
      }}
    >
      <div className="overflow-hidden rounded-[22px] border border-black/5 bg-[linear-gradient(180deg,rgba(248,250,252,0.92),rgba(255,255,255,0.98))] sm:rounded-[32px]">
        <div
          ref={viewportRef}
          className={cx(
            'research-slider relative overflow-x-auto snap-x snap-mandatory',
            '[scrollbar-width:none] [-ms-overflow-style:none]'
          )}
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <style jsx>{`
            .research-slider::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          <div className="flex gap-2.5 px-2 py-3 sm:gap-5 sm:px-[6%] sm:py-5 lg:gap-6 lg:px-[8%]">
            {items.map((item, index) => {
              const src = withBasePath(item.src);
              const isActive = index === activeIndex;

              return (
                <article
                  key={item.src}
                  ref={(element) => {
                    cardRefs.current[index] = element;
                  }}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`Plot ${index + 1} of ${count}`}
                  className={cx(
                    'relative w-full max-w-full shrink-0 snap-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
                    'sm:w-[84%] lg:w-[78%] xl:w-[74%]',
                    isActive ? 'scale-100 opacity-100' : 'scale-[0.97] opacity-75'
                  )}
                  style={{ scrollSnapStop: 'always' }}
                >
                  <div className="overflow-hidden rounded-[20px] border border-black/5 bg-white shadow-[0_20px_70px_rgba(15,23,42,0.08)] sm:rounded-[28px]">
                    <div className="relative aspect-[16/10] bg-[radial-gradient(circle_at_top,rgba(226,232,240,0.75),rgba(248,250,252,0.98)_58%,rgba(255,255,255,1))]">
                      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.18),rgba(255,255,255,0))]" />
                      <Image
                        src={src}
                        alt={item.alt}
                        fill
                        sizes="(min-width: 1024px) 58vw, (min-width: 640px) 74vw, 100vw"
                        className="object-contain p-3 sm:p-7 lg:p-8"
                        priority={index === 0}
                      />
                    </div>

                    <div className="flex flex-col items-start gap-3 border-t border-black/5 bg-[linear-gradient(180deg,#fcfcfd_0%,#f3f4f6_100%)] px-3.5 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-5 sm:py-4">
                      <div className="min-w-0">
                        <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-500">
                          {item.eyebrow ?? `Plot ${index + 1}`}
                        </div>
                        <div className="mt-1 text-sm font-medium tracking-tight text-neutral-900 sm:truncate sm:text-base">
                          {item.caption}
                        </div>
                      </div>

                      <a
                        href={src}
                        target="_blank"
                        rel="noreferrer"
                        className={cx(
                          'inline-flex w-full shrink-0 items-center justify-center rounded-full px-3.5 py-2 text-xs font-medium sm:w-auto',
                          'border border-black/10 bg-white text-neutral-900 shadow-soft transition-colors duration-200',
                          'hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500'
                        )}
                      >
                        Open full
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>

      <SliderDots
        count={count}
        activeIndex={activeIndex}
        isPlaying={isPlaying}
        progress={progress}
        onTogglePlay={() => {
          if (reduced || count <= 1) return;
          setIsPlaying((value) => !value);
        }}
        onSelect={(index) => scrollToIndex(index)}
        disabled={count <= 1}
      />
    </section>
  );
}
