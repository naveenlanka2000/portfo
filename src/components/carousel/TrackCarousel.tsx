'use client';

import Image from 'next/image';
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { cx } from '@/lib/utils';
import { clamp } from '@/utils/math';

export type TrackCarouselItem = {
  src: string;
  alt: string;
  blurDataURL?: string;
};

export type TrackCarouselProps = {
  items: TrackCarouselItem[];
  intervalMs?: number;
  startIndex?: number;
  showDots?: boolean;
  className?: string;
  priorityFirstImage?: boolean;
  ariaLabel?: string;
  aspectRatio?: string;
};

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function smoothstep(t: number) {
  const x = clamp(t, 0, 1);
  return x * x * (3 - 2 * x);
}

function computeSegment(x: number, snaps: number[]) {
  if (snaps.length <= 1) return { i: 0, p: 0 };

  let i = 0;
  for (let k = 0; k < snaps.length - 1; k++) {
    const a = snaps[k] ?? 0;
    const b = snaps[k + 1] ?? a;
    if (x >= a && x <= b) {
      i = k;
      break;
    }
    if (x > b) i = k + 1;
  }

  i = clamp(i, 0, snaps.length - 2);
  const a = snaps[i] ?? 0;
  const b = snaps[i + 1] ?? a;
  const denom = Math.max(1e-6, b - a);
  const p = clamp((x - a) / denom, 0, 1);
  return { i, p };
}

function computeCylinderBounds(opts: {
  scrollLeft: number;
  snapPositions: number[];
  dotCenters: number[];
  baseWidth: number;
  direction: 1 | -1;
}) {
  const { scrollLeft, snapPositions, dotCenters, baseWidth, direction } = opts;

  if (dotCenters.length < 2 || snapPositions.length < 2) {
    const c = dotCenters[0] ?? 0;
    const half = baseWidth / 2;
    return { left: c - half, right: c + half };
  }

  const seg = computeSegment(scrollLeft, snapPositions);
  const i = clamp(seg.i, 0, Math.max(0, dotCenters.length - 2));
  const p = seg.p;

  const a = dotCenters[i] ?? 0;
  const b = dotCenters[i + 1] ?? a;
  const half = baseWidth / 2;

  // Ensure progress is monotonic in the travel direction.
  // For left travel, p goes 1 -> 0 as x decreases, so we flip to t = 1 - p.
  const t = direction === 1 ? p : 1 - p;

  // Ease each half-phase for smoother leading-edge motion.
  const phase = smoothstep(t < 0.5 ? t * 2 : (t - 0.5) * 2);

  // Define start/end centers based on direction.
  const start = direction === 1 ? a : b;
  const end = direction === 1 ? b : a;

  // Liquid sequential fill:
  // - Moving right: right edge leads, then left edge catches up.
  // - Moving left: left edge leads, then right edge catches up.
  if (direction === 1) {
    const left = t < 0.5 ? start - half : lerp(start - half, end - half, phase);
    const right = t < 0.5 ? lerp(start + half, end + half, phase) : end + half;
    return { left, right };
  }

  const left = t < 0.5 ? lerp(start - half, end - half, phase) : end - half;
  const right = t < 0.5 ? start + half : lerp(start + half, end + half, phase);
  return { left, right };
}

export function TrackCarousel({
  items,
  intervalMs = 5000,
  startIndex = 0,
  showDots = true,
  className,
  priorityFirstImage = true,
  ariaLabel = 'Image carousel',
  aspectRatio = '4 / 5',
}: TrackCarouselProps) {
  const reduced = useReducedMotion();
  const count = items.length;
  const hasLoop = count > 1;

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const dotsWrapRef = useRef<HTMLDivElement | null>(null);
  const dotRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [slideWidth, setSlideWidth] = useState(0);
  const [dotCenters, setDotCenters] = useState<number[]>([]);

  const loopItems = useMemo(() => {
    if (!hasLoop) return items;
    return [items[count - 1], ...items, items[0]];
  }, [count, hasLoop, items]);

  const loopLen = loopItems.length;

  const scrollX = useMotionValue(0);

  // Display index in looped list (0..loopLen-1)
  const [index, setIndex] = useState(() => {
    if (!hasLoop) return clamp(startIndex, 0, Math.max(0, count - 1));
    const real = clamp(startIndex, 0, count - 1);
    return real + 1;
  });

  const prevIndexRef = useRef(index);
  const directionRef = useRef<1 | -1>(1);
  const [isPlaying, setIsPlaying] = useState(true);

  const realIndex = useMemo(() => {
    if (!hasLoop) return clamp(index, 0, Math.max(0, count - 1));
    return ((index - 1 + count) % count + count) % count;
  }, [count, hasLoop, index]);

  const extendedCenters = useMemo(() => {
    if (!hasLoop) return dotCenters;
    if (dotCenters.length < count) return [];
    return [dotCenters[count - 1] ?? 0, ...dotCenters, dotCenters[0] ?? 0];
  }, [count, dotCenters, hasLoop]);

  const extendedSnaps = useMemo(() => {
    if (slideWidth <= 0) return [];
    const n = hasLoop ? loopLen : count;
    return Array.from({ length: Math.max(0, n) }, (_, i) => i * slideWidth);
  }, [count, hasLoop, loopLen, slideWidth]);

  // Measure viewport width to compute snaps.
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const measure = () => setSlideWidth(el.clientWidth);
    measure();

    const ro = new ResizeObserver(() => measure());
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Measure dot centers (relative to wrap).
  useEffect(() => {
    if (!showDots) return;
    if (count <= 0) return;
    const wrap = dotsWrapRef.current;
    if (!wrap) return;

    const measure = () => {
      const wrapRect = wrap.getBoundingClientRect();
      const centers = dotRefs.current.slice(0, count).map((btn, i) => {
        if (!btn) return i * 24 + 12;
        const r = btn.getBoundingClientRect();
        return r.left + r.width / 2 - wrapRect.left;
      });
      setDotCenters(centers);
    };

    const raf = requestAnimationFrame(measure);
    const ro = new ResizeObserver(() => measure());
    ro.observe(wrap);
    window.addEventListener('resize', measure, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [count, showDots]);

  // Autoplay.
  useEffect(() => {
    if (!hasLoop) return;
    if (!!reduced) return;
    if (!isPlaying) return;

    const id = window.setInterval(() => {
      setIndex((prev) => prev + 1);
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [hasLoop, intervalMs, isPlaying, reduced]);

  // Animate scrollX to current index.
  useEffect(() => {
    if (slideWidth <= 0) return;

    const prevIndex = prevIndexRef.current;
    prevIndexRef.current = index;

    const safeIndex = hasLoop ? clamp(index, 0, loopLen - 1) : clamp(index, 0, Math.max(0, count - 1));
    const target = safeIndex * slideWidth;

    const prev = scrollX.get();
    directionRef.current = target >= prev ? 1 : -1;

    if (!!reduced) {
      scrollX.set(target);
      return;
    }

    const steps = Math.max(1, Math.abs(index - prevIndex));
    const duration = clamp(0.65 + steps * 0.2, 0.65, 1.4);

    const controls = animate(scrollX, target, {
      type: 'tween',
      duration,
      ease: [0.65, 0, 0.35, 1],
    });

    // Snap after animating into clones.
    let t: number | undefined;
    if (hasLoop && (safeIndex === 0 || safeIndex === loopLen - 1)) {
      t = window.setTimeout(() => {
        if (safeIndex === 0) {
          const realDisplay = count; // last real
          scrollX.set(realDisplay * slideWidth);
          prevIndexRef.current = realDisplay;
          setIndex(realDisplay);
        } else {
          const realDisplay = 1; // first real
          scrollX.set(realDisplay * slideWidth);
          prevIndexRef.current = realDisplay;
          setIndex(realDisplay);
        }
      }, Math.round(duration * 1000 + 40));
    }

    return () => {
      controls.stop();
      if (t) window.clearTimeout(t);
    };
  }, [count, hasLoop, index, loopLen, reduced, scrollX, slideWidth]);

  const trackXMV = useTransform(scrollX, (v: number) => -v);

  // Apple-like dot indicator (liquid fill).
  const DOT_HIT = 22;
  const DOT_SIZE = 7;
  const DOT_GAP = 10;
  const SLOT_W = DOT_HIT + DOT_GAP;

  const basePillWidth = DOT_SIZE;

  const rawLeft = useTransform(scrollX, (x) =>
    computeCylinderBounds({
      scrollLeft: x,
      snapPositions: extendedSnaps,
      dotCenters: hasLoop ? extendedCenters : dotCenters,
      baseWidth: basePillWidth,
      direction: directionRef.current,
    }).left
  );

  const rawRight = useTransform(scrollX, (x) =>
    computeCylinderBounds({
      scrollLeft: x,
      snapPositions: extendedSnaps,
      dotCenters: hasLoop ? extendedCenters : dotCenters,
      baseWidth: basePillWidth,
      direction: directionRef.current,
    }).right
  );

  const left = useSpring(rawLeft, { stiffness: 200, damping: 30, mass: 0.35 });
  const right = useSpring(rawRight, { stiffness: 200, damping: 30, mass: 0.35 });
  const pillX = left;
  const pillW = useTransform([left, right], (values: number[]) => {
    const l = values[0] ?? 0;
    const r = values[1] ?? l;
    return Math.max(2, r - l);
  });

  const goToReal = useCallback(
    (targetReal: number) => {
      if (!hasLoop) {
        setIsPlaying(false);
        setIndex(clamp(targetReal, 0, Math.max(0, count - 1)));
        return;
      }

      setIsPlaying(false);

      const currentReal = realIndex;
      const nextReal = clamp(targetReal, 0, count - 1);

      // For dot clicks, move in the direct visual direction (no wrap shortcut).
      // This makes jumps like 3 -> 1 feel the same as other moves.
      const delta = nextReal - currentReal;
      if (delta === 0) return;

      directionRef.current = delta >= 0 ? 1 : -1;
      setIndex((prev) => prev + delta);
    },
    [count, hasLoop, realIndex]
  );

  if (count === 0) return null;

  const active = items[realIndex];

  return (
    <section
      className={cx('w-full', className)}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      aria-live="off"
    >
      <div
        ref={viewportRef}
        className={cx(
          'relative overflow-hidden rounded-2xl bg-neutral-950',
          'border border-black/5 shadow-soft'
        )}
        style={{ aspectRatio }}
      >
        <motion.div className="flex h-full w-full transform-gpu will-change-transform" style={{ x: trackXMV }}>
          {loopItems.map((item, i) => (
            <div key={i} className="relative h-full w-full shrink-0">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                priority={priorityFirstImage && realIndex === 0 && i === (hasLoop ? 1 : 0)}
                placeholder={item.blurDataURL ? 'blur' : 'empty'}
                blurDataURL={item.blurDataURL}
                sizes="(min-width: 768px) 420px, 100vw"
                className="object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/45 via-neutral-950/0 to-neutral-950/0" />
            </div>
          ))}
        </motion.div>

        <button
          type="button"
          onClick={() => {
            if (!hasLoop) return;
            setIsPlaying(false);
            setIndex((prev) => prev - 1);
          }}
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
          onClick={() => {
            if (!hasLoop) return;
            setIsPlaying(false);
            setIndex((prev) => prev + 1);
          }}
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

        {/* keep for a11y; prevents unused var lint when showDots=false */}
        <span className="sr-only">{active?.alt}</span>
      </div>

      {showDots ? (
        <div className="mt-4 flex justify-center">
          <div className="flex items-center justify-center">
            <div
              ref={dotsWrapRef}
              className={cx(
                'relative flex items-center justify-center',
                'rounded-full border border-black/10 bg-white/70 px-2 py-1',
                'backdrop-blur-md shadow-soft'
              )}
              style={{ width: Math.max(0, count * SLOT_W - DOT_GAP) + 16 }}
            >
              <motion.div
                aria-hidden
                className={cx(
                  'absolute left-0 top-1/2 z-0',
                  'h-[7px] rounded-full bg-neutral-900',
                  'shadow-[0_1px_10px_rgba(0,0,0,0.22)]'
                )}
                style={{ x: pillX, width: pillW, y: '-50%' }}
              />

              <div className="relative z-10 flex items-center" style={{ gap: DOT_GAP }}>
                {items.map((_, i) => (
                  <button
                    key={i}
                    ref={(el) => {
                      dotRefs.current[i] = el;
                    }}
                    type="button"
                    onClick={() => goToReal(i)}
                    className={cx(
                      'grid place-items-center rounded-full',
                      'transition-transform duration-200 [transition-timing-function:var(--motion-ease)]',
                      'hover:scale-105 active:scale-95',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500'
                    )}
                    style={{ width: DOT_HIT, height: DOT_HIT }}
                    aria-label={`Go to slide ${i + 1}`}
                  >
                    <span
                      className={cx(
                        'block rounded-full bg-neutral-900/35 transition-opacity',
                        i === realIndex ? 'opacity-0' : 'opacity-100'
                      )}
                      style={{ width: DOT_SIZE, height: DOT_SIZE }}
                    />
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsPlaying((p) => !p)}
              disabled={!!reduced || count <= 1}
              aria-label={isPlaying ? 'Pause carousel' : 'Play carousel'}
              className={cx(
                'ml-4 inline-flex h-7 w-7 items-center justify-center rounded-full',
                'border border-black/15 bg-black/5 text-black/80 backdrop-blur-xl',
                'transition-colors duration-200 hover:bg-black/10',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30',
                'disabled:cursor-not-allowed disabled:opacity-50'
              )}
            >
              {isPlaying ? (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <rect x="2" y="2" width="3" height="8" rx="1" fill="currentColor" />
                  <rect x="7" y="2" width="3" height="8" rx="1" fill="currentColor" />
                </svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path
                    d="M4 2.6v6.8c0 .45.5.73.9.5l5.5-3.4a.58.58 0 000-1L4.9 2.1c-.4-.24-.9.05-.9.5z"
                    fill="currentColor"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
