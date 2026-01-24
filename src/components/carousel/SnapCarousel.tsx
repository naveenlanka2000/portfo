'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

import { cx } from '@/lib/utils';
import { useEventListener } from '@/hooks/useEventListener';
import { clamp } from '@/utils/math';
import { tween } from '@/utils/tween';
import { SnapCarouselCylinders } from '@/components/carousel/SnapCarouselCylinders';

export type SnapCarouselItem = {
  src: string;
  alt: string;
  heading?: string;
  subheading?: string;
};

export type SnapCarouselProps = {
  items: SnapCarouselItem[];
  className?: string;
  ariaLabel?: string;
  legalText?: string;
  transitionMs?: number; // programmatic
  aspectRatio?: string;
  sizes?: string;
};

// Cubic-bezier easing compatible with CSS timing functions.
function cubicBezier(p1x: number, p1y: number, p2x: number, p2y: number) {
  const cx = 3 * p1x;
  const bx = 3 * (p2x - p1x) - cx;
  const ax = 1 - cx - bx;

  const cy = 3 * p1y;
  const by = 3 * (p2y - p1y) - cy;
  const ay = 1 - cy - by;

  const sampleCurveX = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sampleCurveY = (t: number) => ((ay * t + by) * t + cy) * t;
  const sampleDerivX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;

  const solveCurveX = (x: number) => {
    let t2 = x;
    for (let i = 0; i < 8; i++) {
      const x2 = sampleCurveX(t2) - x;
      if (Math.abs(x2) < 1e-6) return t2;
      const d2 = sampleDerivX(t2);
      if (Math.abs(d2) < 1e-6) break;
      t2 = t2 - x2 / d2;
    }

    let t0 = 0;
    let t1 = 1;
    t2 = x;

    while (t0 < t1) {
      const x2 = sampleCurveX(t2);
      if (Math.abs(x2 - x) < 1e-6) return t2;
      if (x > x2) t0 = t2;
      else t1 = t2;
      t2 = (t1 - t0) * 0.5 + t0;
    }

    return t2;
  };

  return (t: number) => {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    return sampleCurveY(solveCurveX(t));
  };
}

const standardEase = cubicBezier(0.4, 0, 0.2, 1);

type ProgressState = {
  baseIndex: number;
  nextIndex: number;
  progress: number; // 0..1
  activeIndex: number; // toggles at 50%
};

export function SnapCarousel({
  items,
  className,
  ariaLabel = 'Snap carousel',
  legalText = 'Some features and content shown are for demonstration purposes only.',
  transitionMs = 300,
  aspectRatio = '16 / 9',
  sizes = '100vw',
}: SnapCarouselProps) {
  const reduced = useReducedMotion();
  const count = items.length;
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const [slideWidth, setSlideWidth] = useState(0);
  const [progressState, setProgressState] = useState<ProgressState>(() => ({
    baseIndex: 0,
    nextIndex: 0,
    progress: 0,
    activeIndex: 0,
  }));

  const dragRef = useRef({
    isDown: false,
    startX: 0,
    startScrollLeft: 0,
    lastX: 0,
    lastT: 0,
    velocity: 0,
  });

  const inertialCancelRef = useRef<null | (() => void)>(null);
  const scrollTweenCancelRef = useRef<null | (() => void)>(null);

  const computeProgress = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const w = slideWidth || el.clientWidth;
    if (w <= 0) return;

    const x = el.scrollLeft;
    const raw = x / w;

    const base = clamp(Math.floor(raw), 0, Math.max(0, count - 1));
    const next = clamp(base + 1, 0, Math.max(0, count - 1));
    const p = clamp(raw - base, 0, 1);

    const active = p > 0.5 ? next : base;

    setProgressState({ baseIndex: base, nextIndex: next, progress: p, activeIndex: active });
  }, [count, slideWidth]);

  const stopInertial = useCallback(() => {
    inertialCancelRef.current?.();
    inertialCancelRef.current = null;
  }, []);

  const stopScrollTween = useCallback(() => {
    scrollTweenCancelRef.current?.();
    scrollTweenCancelRef.current = null;
  }, []);

  const scrollToIndex = useCallback(
    (index: number, opts?: { animated?: boolean }) => {
      const el = scrollerRef.current;
      if (!el) return;

      stopInertial();
      stopScrollTween();

      const w = slideWidth || el.clientWidth;
      if (w <= 0) return;

      const target = clamp(index, 0, Math.max(0, count - 1)) * w;
      const from = el.scrollLeft;

      const effectiveDuration = reduced ? 180 : transitionMs;

      if (opts?.animated === false) {
        el.scrollLeft = target;
        computeProgress();
        return;
      }

      scrollTweenCancelRef.current = tween({
        from,
        to: target,
        durationMs: effectiveDuration,
        easing: standardEase,
        cancelOnUserInput: true,
        onUpdate: (value) => {
          el.scrollLeft = value;
        },
        onDone: () => {
          scrollTweenCancelRef.current = null;
          computeProgress();
        },
      });
    },
    [computeProgress, count, reduced, slideWidth, stopInertial, stopScrollTween, transitionMs]
  );

  const snapToNearest = useCallback(
    (opts?: { animated?: boolean }) => {
      const el = scrollerRef.current;
      if (!el) return;

      const w = slideWidth || el.clientWidth;
      if (w <= 0) return;

      const raw = el.scrollLeft / w;
      const nearest = clamp(Math.round(raw), 0, Math.max(0, count - 1));
      scrollToIndex(nearest, { animated: opts?.animated ?? true });
    },
    [count, scrollToIndex, slideWidth]
  );

  // Measure slide width.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const measure = () => setSlideWidth(el.clientWidth);
    measure();

    const ro = new ResizeObserver(() => measure());
    ro.observe(el);

    return () => ro.disconnect();
  }, []);

  // rAF-throttled scroll handler for frame-perfect mapping.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        computeProgress();
      });
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    computeProgress();

    return () => {
      if (raf) cancelAnimationFrame(raf);
      el.removeEventListener('scroll', onScroll);
    };
  }, [computeProgress]);

  const startInertial = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;

    if (reduced) {
      snapToNearest({ animated: true });
      return;
    }

    stopInertial();
    stopScrollTween();

    const state = dragRef.current;
    let v = state.velocity;

    // Clamp initial velocity to something sane (px/ms).
    v = clamp(v, -2.5, 2.5);

    const friction = 0.92;
    const minV = 0.02;

    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.max(1, now - last);
      last = now;

      // Move scrollLeft opposite of drag dx; velocity already aligned to dx direction.
      el.scrollLeft -= v * dt;

      v *= friction;

      if (Math.abs(v) > minV) {
        raf = requestAnimationFrame(tick);
      } else {
        snapToNearest({ animated: true });
      }
    };

    raf = requestAnimationFrame(tick);

    inertialCancelRef.current = () => {
      cancelAnimationFrame(raf);
      inertialCancelRef.current = null;
    };
  }, [reduced, snapToNearest, stopInertial, stopScrollTween]);

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    if (!el) return;

    stopInertial();
    stopScrollTween();

    dragRef.current.isDown = true;
    dragRef.current.startX = e.clientX;
    dragRef.current.startScrollLeft = el.scrollLeft;
    dragRef.current.lastX = e.clientX;
    dragRef.current.lastT = performance.now();
    dragRef.current.velocity = 0;

    // Capture pointer so we keep receiving move/up.
    el.setPointerCapture?.(e.pointerId);
  }, [stopInertial, stopScrollTween]);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    if (!el) return;

    const state = dragRef.current;
    if (!state.isDown) return;

    const dx = e.clientX - state.startX;
    el.scrollLeft = state.startScrollLeft - dx;

    const now = performance.now();
    const dt = Math.max(1, now - state.lastT);
    const vx = (e.clientX - state.lastX) / dt; // px/ms

    // Low-pass filter for velocity.
    state.velocity = state.velocity * 0.7 + vx * 0.3;
    state.lastX = e.clientX;
    state.lastT = now;
  }, []);

  const endDrag = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const el = scrollerRef.current;
      if (!el) return;

      const state = dragRef.current;
      if (!state.isDown) return;

      state.isDown = false;
      el.releasePointerCapture?.(e.pointerId);

      // Inertial glide then snap.
      startInertial();
    },
    [startInertial]
  );

  // Prevent selection during drag.
  useEventListener(scrollerRef, 'dragstart', (e) => {
    e.preventDefault();
  });

  const { baseIndex, nextIndex, progress, activeIndex } = progressState;

  const nav = useMemo(() => {
    return {
      prev: () => scrollToIndex(activeIndex - 1, { animated: true }),
      next: () => scrollToIndex(activeIndex + 1, { animated: true }),
    };
  }, [activeIndex, scrollToIndex]);

  if (count === 0) return null;

  return (
    <section
      className={cx('relative w-full overflow-hidden rounded-3xl bg-black text-white', className)}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
    >
      <div className="relative">
        <div
          ref={scrollerRef}
          className={cx('relative flex w-full overflow-x-auto', 'snap-x snap-mandatory')}
          style={{
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          {/* Hide scrollbar (WebKit). */}
          <style jsx>{`
            div::-webkit-scrollbar { display: none; }
          `}</style>

          {items.map((item, i) => (
            <div
              key={i}
              className="relative w-full flex-none snap-center"
              style={{ aspectRatio }}
              role="group"
              aria-label={`Slide ${i + 1} of ${count}`}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes={sizes}
                className="object-cover opacity-90"
                priority={i === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/0" />

              {(item.heading || item.subheading) && (
                <div className="absolute left-6 bottom-14 right-6">
                  {item.heading ? (
                    <div className="text-lg font-semibold tracking-tight">{item.heading}</div>
                  ) : null}
                  {item.subheading ? (
                    <div className="mt-1 text-sm text-white/80">{item.subheading}</div>
                  ) : null}
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={nav.prev}
          className={cx(
            'absolute left-3 top-1/2 -translate-y-1/2',
            'hidden h-10 w-10 items-center justify-center rounded-full',
            'bg-white/10 text-white backdrop-blur-md',
            'transition-colors duration-200 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 md:inline-flex'
          )}
          aria-label="Previous slide"
        >
          <span aria-hidden>‹</span>
        </button>
        <button
          type="button"
          onClick={nav.next}
          className={cx(
            'absolute right-3 top-1/2 -translate-y-1/2',
            'hidden h-10 w-10 items-center justify-center rounded-full',
            'bg-white/10 text-white backdrop-blur-md',
            'transition-colors duration-200 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 md:inline-flex'
          )}
          aria-label="Next slide"
        >
          <span aria-hidden>›</span>
        </button>

        {/* Pinned legal text (top layer, does not move with scroll). */}
        <div className="pointer-events-none absolute bottom-3 left-0 right-0 z-10 px-6">
          <div className="text-[10px] leading-snug text-white/55 [text-wrap:balance]">{legalText}</div>
        </div>
      </div>

      <SnapCarouselCylinders
        count={count}
        baseIndex={baseIndex}
        nextIndex={nextIndex}
        progress={progress}
        activeIndex={activeIndex}
        onSelect={(i) => scrollToIndex(i, { animated: true })}
        dotSize={8}
        gapPx={8}
        activeWidth={20}
        className="mb-5"
      />

      <div className="sr-only">
        Progress from slide {baseIndex + 1} to {nextIndex + 1}: {Math.round(progress * 100)}%
      </div>
    </section>
  );
}
