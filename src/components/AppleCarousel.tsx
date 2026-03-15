/* eslint-disable react/no-array-index-key */
'use client';

import Image from 'next/image';
import {
  animate,
  type MotionValue,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { cx } from '@/lib/utils';
import { clamp, lerp } from '@/utils/math';

export type AppleCarouselCard = {
  title: string;
  sub: string;
  img: string;
};

export type AppleCarouselProps = {
  cards: AppleCarouselCard[];
  className?: string;
  ariaLabel?: string;
};

const DOT_SIZE = 8;
// Visual spacing between dot hit targets (tap area remains DOT_HIT).
const DOT_GAP = 4;
const DOT_HIT = 24;
const SLOT_WIDTH = DOT_HIT + DOT_GAP;

type SegmentState = {
  i: number;
  p: number; // 0..1 between i and i+1
};

function computeSegment(scrollLeft: number, snapPositions: number[]): SegmentState {
  const n = snapPositions.length;
  if (n <= 1) return { i: 0, p: 0 };

  const first = snapPositions[0] ?? 0;
  const last = snapPositions[n - 1] ?? 0;

  if (scrollLeft <= first) return { i: 0, p: 0 };
  if (scrollLeft >= last) return { i: n - 2, p: 1 };

  let i = 0;
  while (i < n - 2 && scrollLeft > (snapPositions[i + 1] ?? 0)) i++;

  const from = snapPositions[i] ?? 0;
  const to = snapPositions[i + 1] ?? from;
  const span = Math.max(1, to - from);
  const p = clamp((scrollLeft - from) / span, 0, 1);
  return { i, p };
}

function computeCylinderEdges({
  scrollLeft,
  snapPositions,
  dotCenters,
  basePillWidth,
  direction,
  reduced,
}: {
  scrollLeft: number;
  snapPositions: number[];
  dotCenters: number[];
  basePillWidth: number;
  direction: 1 | -1;
  reduced: boolean;
}) {
  const count = Math.min(snapPositions.length, dotCenters.length);
  if (count <= 0) return { left: 0, width: basePillWidth, activeIndex: 0 };
  if (count === 1) {
    const c = dotCenters[0] ?? DOT_SIZE / 2;
    return { left: c - basePillWidth / 2, width: basePillWidth, activeIndex: 0 };
  }

  const first = snapPositions[0] ?? 0;
  const last = snapPositions[count - 1] ?? 0;

  // Boundary clamp: no stretching beyond ends.
  if (scrollLeft <= first) {
    const c = dotCenters[0] ?? DOT_SIZE / 2;
    return { left: c - basePillWidth / 2, width: basePillWidth, activeIndex: 0 };
  }
  if (scrollLeft >= last) {
    const c = dotCenters[count - 1] ?? (count - 1) * SLOT_WIDTH + DOT_SIZE / 2;
    return { left: c - basePillWidth / 2, width: basePillWidth, activeIndex: count - 1 };
  }

  const seg = computeSegment(scrollLeft, snapPositions.slice(0, count));
  const i = clamp(seg.i, 0, count - 2);
  const p = seg.p;

  const c0 = dotCenters[i] ?? i * SLOT_WIDTH + DOT_SIZE / 2;
  const c1 = dotCenters[i + 1] ?? (i + 1) * SLOT_WIDTH + DOT_SIZE / 2;

  // Reduced motion: simple scrubbing pill (no stretch).
  if (reduced) {
    const center = lerp(c0, c1, p);
    const activeIndex = p > 0.5 ? i + 1 : i;
    return { left: center - basePillWidth / 2, width: basePillWidth, activeIndex };
  }

  const half = basePillWidth / 2;

  // Direction-aware "stretch then catch-up".
  // direction = 1: moving right (i -> i+1)
  // direction = -1: moving left (i+1 -> i)
  const movingRight = direction === 1;

  if (movingRight) {
    if (p <= 0.5) {
      const t = p * 2;
      const left = c0 - half;
      const right = lerp(c0 + half, c1 + half, t);
      return { left, width: Math.max(basePillWidth, right - left), activeIndex: i };
    }

    const t = (p - 0.5) * 2;
    const right = c1 + half;
    const left = lerp(c0 - half, c1 - half, t);
    return { left, width: Math.max(basePillWidth, right - left), activeIndex: i + 1 };
  }

  // Moving left: mirror behavior.
  // We treat the start as the right dot (c1) and the end as the left dot (c0).
  const tr = 1 - p;
  if (tr <= 0.5) {
    const t = tr * 2;
    const right = c1 + half;
    const left = lerp(c1 - half, c0 - half, t);
    return { left, width: Math.max(basePillWidth, right - left), activeIndex: i + 1 };
  }

  const t = (tr - 0.5) * 2;
  const left = c0 - half;
  const right = lerp(c1 + half, c0 + half, t);
  return { left, width: Math.max(basePillWidth, right - left), activeIndex: i };
}

function computeCylinderBounds({
  scrollLeft,
  snapPositions,
  dotCenters,
  baseWidth,
  direction,
  reduced,
}: {
  scrollLeft: number;
  snapPositions: number[];
  dotCenters: number[];
  baseWidth: number;
  direction: 1 | -1;
  reduced: boolean;
}) {
  const count = Math.min(snapPositions.length, dotCenters.length);
  if (count <= 0) return { left: 0, right: baseWidth, activeIndex: 0 };

  const half = baseWidth / 2;

  if (count === 1) {
    const c = dotCenters[0] ?? DOT_HIT / 2;
    return { left: c - half, right: c + half, activeIndex: 0 };
  }

  const first = snapPositions[0] ?? 0;
  const last = snapPositions[count - 1] ?? 0;

  // Clamp endpoints: keep it as a point at the edge dot.
  if (scrollLeft <= first) {
    const c = dotCenters[0] ?? DOT_HIT / 2;
    return { left: c - half, right: c + half, activeIndex: 0 };
  }
  if (scrollLeft >= last) {
    const c = dotCenters[count - 1] ?? (count - 1) * SLOT_WIDTH + DOT_HIT / 2;
    return { left: c - half, right: c + half, activeIndex: count - 1 };
  }

  const seg = computeSegment(scrollLeft, snapPositions.slice(0, count));
  const i = clamp(seg.i, 0, count - 2);
  const p = seg.p;

  const c0 = dotCenters[i] ?? i * SLOT_WIDTH + DOT_HIT / 2;
  const c1 = dotCenters[i + 1] ?? (i + 1) * SLOT_WIDTH + DOT_HIT / 2;

  // Reduced motion: simple scrubbing point (no liquid fill).
  if (reduced) {
    const center = lerp(c0, c1, p);
    const activeIndex = p > 0.5 ? i + 1 : i;
    return { left: center - half, right: center + half, activeIndex };
  }

  // Liquid sequential fill:
  // Phase 1 (0..0.5): leading edge grows to span c0->c1.
  // Phase 2 (0.5..1): trailing edge retracts to become a point at c1.
  const movingRight = direction === 1;
  if (movingRight) {
    if (p <= 0.5) {
      const t = p * 2;
      const left = c0 - half;
      const right = lerp(c0 + half, c1 + half, t);
      return { left, right, activeIndex: i };
    }

    const t = (p - 0.5) * 2;
    const right = c1 + half;
    const left = lerp(c0 - half, c1 - half, t);
    return { left, right, activeIndex: i + 1 };
  }

  // Moving left: mirror using tr=1-p so progress increases as scroll decreases.
  // Phase 1 (0..0.5): leading edge grows left (right anchored at c1).
  // Phase 2 (0.5..1): trailing edge retracts (left anchored at c0).
  const tr = 1 - p;
  if (tr <= 0.5) {
    const t = tr * 2;
    const right = c1 + half;
    const left = lerp(c1 - half, c0 - half, t);
    return { left, right, activeIndex: i + 1 };
  }

  const t = (tr - 0.5) * 2;
  const left = c0 - half;
  const right = lerp(c1 + half, c0 + half, t);
  return { left, right, activeIndex: i };
}

function AppleCarouselCardView({
  card,
  centerScrollLeft,
  scrollX,
  reduced,
  setRef,
  onWatch,
  priority,
}: {
  card: AppleCarouselCard;
  centerScrollLeft: number;
  scrollX: MotionValue<number>;
  reduced: boolean;
  setRef: (el: HTMLDivElement | null) => void;
  onWatch?: () => void;
  priority?: boolean;
}) {
  const range = 320;
  const input = [centerScrollLeft - range, centerScrollLeft, centerScrollLeft + range];

  const imgX = useTransform(scrollX, input, reduced ? [0, 0, 0] : [14, 0, -14]);
  const imgScale = useTransform(scrollX, input, reduced ? [1, 1, 1] : [1.02, 1.07, 1.02]);
  const textOpacity = useTransform(scrollX, input, reduced ? [1, 1, 1] : [0.62, 1, 0.62]);
  const textY = useTransform(scrollX, input, reduced ? [0, 0, 0] : [10, 0, 10]);

  // Tiny neutral blur placeholder to avoid "late" card appearance while the remote image loads.
  const BLUR_DATA_URL =
    'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

  return (
    <article
      ref={setRef}
      className={cx(
        'relative flex-none snap-center overflow-hidden rounded-none',
        'border border-white/10 bg-white/5',
        // Landscape card with a small peek of the next card.
        'w-[90%] sm:w-[72%] lg:w-[52%]'
      )}
      style={{ scrollSnapStop: 'always' }}
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <motion.div aria-hidden="true" className="absolute inset-0" style={{ x: imgX, scale: imgScale }}>
          <Image
            src={card.img}
            alt={card.title}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 760px, 92vw"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            priority={!!priority}
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/0" />
      </div>

      <motion.div className="absolute inset-x-6 bottom-6" style={{ opacity: textOpacity, y: textY }}>
        <div className="text-xs font-medium tracking-wide text-white/75">{card.sub}</div>
        <div className="mt-2 text-xl font-semibold tracking-tight text-white">{card.title}</div>

        <div className="mt-4">
          <button
            type="button"
            onClick={onWatch}
            className={cx(
              'inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium',
              'bg-white/80 text-black backdrop-blur-xl',
              'border border-white/25 shadow-soft',
              'transition-all duration-200 hover:bg-white/90 active:scale-95',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70'
            )}
          >
            Watch the film
          </button>
        </div>
      </motion.div>
    </article>
  );
}

export function AppleCarousel({ cards, className, ariaLabel }: AppleCarouselProps) {
  const reduced = useReducedMotion();
  const count = cards.length;
  const hasLoop = count > 1;
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const dotsWrapRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const dotRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const [snapPositions, setSnapPositions] = useState<number[]>([]);
  const [dotCenters, setDotCenters] = useState<number[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  // index is the "display index" into the looped track: [lastClone, ...cards, firstClone]
  // real cards live in [1..count].
  const [index, setIndex] = useState(() => (hasLoop ? count : 0));
  const prevIndexRef = useRef(hasLoop ? count : 0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Virtual scrollLeft that drives card parallax + cylinder indicator.
  const scrollX = useMotionValue(0);

  const loopCards = useMemo(() => {
    if (!hasLoop) return cards;
    const first = cards[0];
    const last = cards[cards.length - 1];
    return [last, ...cards, first];
  }, [cards, hasLoop]);

  const loopLen = loopCards.length;

  const extendedSnaps = useMemo(() => {
    if (!hasLoop) return snapPositions;
    if (snapPositions.length < loopLen) return [];
    // Use the full loop snap positions (clone + reals + clone).
    return snapPositions.slice(0, loopLen);
  }, [hasLoop, loopLen, snapPositions]);

  const extendedCenters = useMemo(() => {
    if (!hasLoop) return dotCenters;
    if (dotCenters.length < count) return [];
    // Mirror the loop: [lastDot, ...dots, firstDot]
    return [dotCenters[count - 1] ?? 0, ...dotCenters, dotCenters[0] ?? 0];
  }, [count, dotCenters, hasLoop]);

  const realIndex = useMemo(() => {
    if (!hasLoop) return clamp(index, 0, Math.max(0, count - 1));
    // Map display index -> real index [0..count-1]
    return clamp(index - 1, 0, count - 1);
  }, [count, hasLoop, index]);

  const directionRef = useRef<1 | -1>(1);
  const lastScrollRef = useRef(0);

  const measure = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const viewportW = viewport.clientWidth;
    const positions = cardRefs.current.slice(0, loopLen).map((el) => {
      if (!el) return 0;
      const left = el.offsetLeft;
      const w = el.clientWidth;
      // Virtual "scrollLeft" needed to center this card in the viewport.
      return Math.max(0, left - (viewportW - w) / 2);
    });
    setSnapPositions(positions);

    const wrap = dotsWrapRef.current;
    if (wrap) {
      const wrapRect = wrap.getBoundingClientRect();
      const centers = dotRefs.current.slice(0, count).map((el, i) => {
        if (!el) return i * SLOT_WIDTH + DOT_HIT / 2;
        const r = el.getBoundingClientRect();
        return r.left + r.width / 2 - wrapRect.left;
      });
      setDotCenters(centers);
    }
  }, [count, loopLen]);

  const onDotClick = useCallback(
    (i: number) => {
      const next = clamp(i, 0, Math.max(0, count - 1));
      // User intent should win over autoplay.
      setIsPlaying(false);
      if (!hasLoop) {
        directionRef.current = next >= index ? 1 : -1;
        setIndex(next);
        return;
      }

      // Dot clicks should feel direct (Apple-like): go straight to that dot.
      // We avoid "shortest wrap" via clones because it can momentarily pass through the end-clone
      // (e.g. 4 -> 1 would animate to 5 then snap to 1).
      const desiredDisplay = next + 1; // real slides live at display indices [1..count]
      directionRef.current = desiredDisplay >= index ? 1 : -1;
      setIndex(desiredDisplay);
    },
    [count, hasLoop, index]
  );

  useEffect(() => {
    measure();

    const viewport = viewportRef.current;
    if (!viewport) return;

    const ro = new ResizeObserver(() => measure());
    ro.observe(viewport);
    cardRefs.current.forEach((el) => el && ro.observe(el));
    if (dotsWrapRef.current) ro.observe(dotsWrapRef.current);

    window.addEventListener('resize', measure, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [measure]);

  // Autoplay: advance automatically while playing.
  useEffect(() => {
    if (count <= 1) return;
    if (!!reduced) return;
    if (!isPlaying) return;

    const id = window.setInterval(() => {
      setIndex((prev) => {
        if (!hasLoop) {
          const last = Math.max(0, count - 1);
          const next = prev + directionRef.current;
          if (next >= last) {
            directionRef.current = -1;
            return last;
          }
          if (next <= 0) {
            directionRef.current = 1;
            return 0;
          }
          return next;
        }

        return prev + 1;
      });
    }, 4200);

    return () => window.clearInterval(id);
  }, [count, hasLoop, isPlaying, reduced]);

  // Animate virtual scrollX to the current snap position.
  useEffect(() => {
    if (snapPositions.length < 1) return;
    if (hasLoop && snapPositions.length < loopLen) return;

    const safeIndex = hasLoop ? clamp(index, 0, loopLen - 1) : clamp(index, 0, Math.max(0, count - 1));
    const target = (snapPositions[safeIndex] ?? 0) as number;

    const prevIndex = prevIndexRef.current;
    prevIndexRef.current = index;

    const needsSnapFromCloneStart = hasLoop && safeIndex === loopLen - 1; // firstClone
    const needsSnapFromCloneEnd = hasLoop && safeIndex === 0; // lastClone

    if (!!reduced) {
      scrollX.set(target);
      return;
    }

    const steps = Math.max(1, Math.abs(index - prevIndex));
    // Slightly longer, smoother glide for the track motion.
    const duration = clamp(0.75 + steps * 0.22, 0.75, 1.6);

    const controls = animate(scrollX, target, {
      type: 'tween',
      duration,
      ease: [0.65, 0, 0.35, 1],
    });

    // If we animated into a clone, snap invisibly to the corresponding real slide.
    let t: number | undefined;
    if (needsSnapFromCloneStart || needsSnapFromCloneEnd) {
      t = window.setTimeout(() => {
        if (needsSnapFromCloneStart) {
          const realDisplay = 1; // first real
          const realTarget = snapPositions[realDisplay] ?? 0;
          scrollX.set(realTarget);
          lastScrollRef.current = realTarget;
          prevIndexRef.current = realDisplay;
          setIndex(realDisplay);
          setActiveIndex(0);
        } else if (needsSnapFromCloneEnd) {
          const realDisplay = count; // last real
          const realTarget = snapPositions[realDisplay] ?? 0;
          scrollX.set(realTarget);
          lastScrollRef.current = realTarget;
          prevIndexRef.current = realDisplay;
          setIndex(realDisplay);
          setActiveIndex(count - 1);
        }
      }, Math.round(duration * 1000 + 40));
    }

    return () => {
      controls.stop();
      if (t) window.clearTimeout(t);
    };
  }, [count, hasLoop, index, loopLen, reduced, scrollX, snapPositions]);

  // Track scroll direction + active index for dot hiding.
  useEffect(() => {
    let raf = 0;
    const unsub = scrollX.on('change', (x) => {
      const prev = lastScrollRef.current;
      const dx = x - prev;
      lastScrollRef.current = x;
      if (Math.abs(dx) > 0.01) directionRef.current = dx > 0 ? 1 : -1;

      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        if (count <= 1) {
          setActiveIndex(0);
          return;
        }

        // Use extended arrays so last<->first clone transitions still animate.
        if (hasLoop) {
          if (extendedSnaps.length < 2 || extendedCenters.length < 2) return;
          const seg = computeSegment(x, extendedSnaps);
          const i = clamp(seg.i, 0, Math.max(0, extendedCenters.length - 2));
          const p = seg.p;

          const next = i + 1;
          const movingRight = directionRef.current === 1;
          const idx = movingRight ? (p > 0.5 ? next : i) : (p < 0.5 ? i : next);

          // Map extended index -> real dot index.
          const realDot = ((idx - 1 + count) % count + count) % count;
          setActiveIndex(clamp(realDot, 0, count - 1));
          return;
        }

        if (snapPositions.length < 2 || dotCenters.length < 2) return;
        const seg = computeSegment(x, snapPositions);
        const i = clamp(seg.i, 0, Math.max(0, count - 2));
        const p = seg.p;

        const next = i + 1;
        const movingRight = directionRef.current === 1;
        const idx = movingRight ? (p > 0.5 ? next : i) : (p < 0.5 ? i : next);
        setActiveIndex(clamp(idx, 0, count - 1));
      });
    });

    return () => {
      unsub();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [count, dotCenters.length, extendedCenters.length, extendedSnaps, hasLoop, scrollX, snapPositions]);

  const trackX = useTransform(scrollX, (x) => -x);

  // Apple-like: start/end as a point (dot size), not a fat pill.
  const basePillWidth = DOT_SIZE;
  const trayWidth = Math.max(0, count * DOT_HIT + Math.max(0, count - 1) * DOT_GAP);

  const rawLeft = useTransform(scrollX, (x) =>
    computeCylinderBounds({
      scrollLeft: x,
      snapPositions: hasLoop ? extendedSnaps : snapPositions,
      dotCenters: hasLoop ? extendedCenters : dotCenters,
      baseWidth: basePillWidth,
      direction: directionRef.current,
      reduced: !!reduced,
    }).left
  );

  const rawRight = useTransform(scrollX, (x) =>
    computeCylinderBounds({
      scrollLeft: x,
      snapPositions: hasLoop ? extendedSnaps : snapPositions,
      dotCenters: hasLoop ? extendedCenters : dotCenters,
      baseWidth: basePillWidth,
      direction: directionRef.current,
      reduced: !!reduced,
    }).right
  );

  // NOTE: scrollX is already tween-animated. Adding extra springs on top can cause
  // tiny overshoot/settling (visible as the pill not stopping perfectly). Use
  // the computed bounds directly so it lands exactly on the dot.
  const widthMv = useTransform([rawLeft, rawRight], (values: number[]) => {
    const l = values[0] ?? 0;
    const r = values[1] ?? l;
    return Math.max(DOT_SIZE, r - l);
  });

  const sectionTitle = useMemo(() => ariaLabel ?? 'Highlights', [ariaLabel]);

  if (count === 0) return null;

  return (
    <section className={cx('w-full', className)} aria-label={sectionTitle}>
      {/* Keep title aligned to content width */}
      <div className="mx-auto max-w-6xl px-5 py-2">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">{sectionTitle}</h2>
            <p className="mt-2 text-sm text-neutral-600">Scroll or drag to explore. The indicator follows your progress.</p>
          </div>
        </div>
      </div>

      {/* Full-bleed viewport so cards can peek off-screen like Apple highlights */}
      <div className="relative left-1/2 right-1/2 -mx-[50vw] mt-7 w-screen overflow-x-clip">
        <div ref={viewportRef} className="overflow-hidden px-3 sm:px-6 lg:px-10">
          <motion.div
            className="flex gap-[2px] transform-gpu will-change-transform"
            style={{ x: trackX }}
          >
            {loopCards.map((card, i) => (
              <AppleCarouselCardView
                key={i}
                card={card}
                centerScrollLeft={snapPositions[i] ?? 0}
                scrollX={scrollX}
                reduced={!!reduced}
                // Preload the first couple of cards so initial + adjacent cards appear together.
                priority={i <= 2}
                setRef={(el) => {
                  cardRefs.current[i] = el;
                }}
              />
            ))}
          </motion.div>
        </div>
      </div>

      {/* Pagination aligned to content width */}
      <div className="mx-auto mt-9 max-w-6xl px-5">
          <div className="relative flex items-center" style={{ height: 22 }}>
            <div
              ref={dotsWrapRef}
              className="relative mx-auto flex items-center justify-center"
              style={{ height: 22, width: trayWidth }}
            >
              <div className="relative flex items-center justify-center" style={{ gap: DOT_GAP }}>
                {Array.from({ length: count }).map((_, i) => (
                  <button
                    key={i}
                    ref={(el) => {
                      dotRefs.current[i] = el;
                    }}
                    type="button"
                    onClick={() => onDotClick(i)}
                    aria-label={`Go to item ${i + 1}`}
                    className={cx(
                      'relative inline-flex h-6 w-6 items-center justify-center',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30'
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className="h-2 w-2 rounded-full bg-black"
                      style={{ opacity: i === activeIndex ? 0 : 0.2 }}
                    />
                  </button>
                ))}
              </div>

              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 -translate-y-1/2 rounded-full bg-black"
                style={{
                  height: DOT_SIZE,
                  width: widthMv,
                  left: rawLeft,
                }}
              />
            </div>

            <div className="absolute right-0 top-1/2 -translate-y-1/2">
              <button
                type="button"
                onClick={() => setIsPlaying((p) => !p)}
                disabled={!!reduced || count <= 1}
                aria-label={isPlaying ? 'Pause carousel' : 'Play carousel'}
                className={cx(
                  'inline-flex h-7 w-7 items-center justify-center rounded-full',
                  'border border-black/15 bg-black/5 text-black/80 backdrop-blur-xl',
                  'transition-colors duration-200 hover:bg-black/10',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30',
                  'disabled:cursor-not-allowed disabled:opacity-50'
                )}
              >
                {isPlaying ? (
                  // Pause icon
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <rect x="2" y="2" width="3" height="8" rx="1" fill="currentColor" />
                    <rect x="7" y="2" width="3" height="8" rx="1" fill="currentColor" />
                  </svg>
                ) : (
                  // Play icon
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

          <div className="mt-4 text-center text-[11px] leading-snug text-neutral-500">Tap dots to jump between items.</div>
      </div>
    </section>
  );
}
