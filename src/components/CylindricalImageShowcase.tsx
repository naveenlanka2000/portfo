"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";

import { useHorizontalTrackCenter } from "@/hooks/useHorizontalTrackCenter";
import { usePageVisibility } from "@/hooks/usePageVisibility";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useProgressEngine } from "@/hooks/useProgressEngine";
import { clamp, cubicBezier, lerp } from "@/utils/math";
import { cx } from "@/lib/utils";

import { CylindricalIndicatorsTimeline, type CylinderVisual } from "./CylindricalIndicatorsTimeline";

export type ShowcaseItem = {
  src: string;
  alt: string;
  aspectRatio?: string;
  blurDataURL?: string;
};

export type CylindricalImageShowcaseProps = {
  items: ShowcaseItem[]; // expected 10
  fillMs?: number; // 5200
  slideMs?: number; // 680
  butterMs?: number; // 720 (image centering)
  settleMs?: number; // optional delay before fill
  initialDelayMs?: number; // pause before starting step 1->2
  className?: string;
};

type Phase = "init" | "sliding" | "filling" | "done";

type SlideSpec = {
  currentId: number;
  currentFrom: number;
  currentTo: number;
  nextId: number;
  nextFrom: number;
  nextTo: number;
};

export function CylindricalImageShowcase({
  items,
  fillMs = 5200,
  slideMs = 680,
  butterMs = 720,
  settleMs = 0,
  initialDelayMs = 450,
  className,
}: CylindricalImageShowcaseProps) {
  const idBase = useId().replace(/:/g, "");

  const prefersReducedMotion = usePrefersReducedMotion();
  const pageVisible = usePageVisibility();

  const softButterEase = useMemo(() => cubicBezier(0.25, 1, 0.35, 1), []);

  const { containerRef, trackRef, itemRefs, tx, centerIndex, snapIndex, pause: pauseTrack, resume: resumeTrack } =
    useHorizontalTrackCenter({ animationMs: butterMs, easing: softButterEase });

  const count = items.length;
  const anchorCount = count + 1; // 11 for 10 images

  const [anchorCenters, setAnchorCenters] = useState<number[]>([]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("init");
  const [fill, setFill] = useState(1); // initial state: cylinder 1 filled 100%

  // 10 cylinders with fixed IDs 0..9
  // Anchor indices 0..10 (L1..L11). Initial staging:
  // c0 at L1, c1..c9 at L3..L11, leaving L2 empty.
  const [cylinderAnchors, setCylinderAnchors] = useState<number[]>(() => {
    const next = Array.from({ length: count }, (_, i) => 0);
    if (count === 0) return next;
    next[0] = 0;
    for (let i = 1; i < count; i++) next[i] = i + 1; // 2..10
    return next;
  });

  const slideSpecRef = useRef<SlideSpec | null>(null);

  const [hovered, setHovered] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const [userInputPause, setUserInputPause] = useState(false);

  const userPauseTimeout = useRef<number | null>(null);
  const settleTimeout = useRef<number | null>(null);
  const initialTimeout = useRef<number | null>(null);

  const paused = hovered || focusWithin || userInputPause || !pageVisible;
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  const clearTimers = useCallback(() => {
    if (userPauseTimeout.current) window.clearTimeout(userPauseTimeout.current);
    if (settleTimeout.current) window.clearTimeout(settleTimeout.current);
    if (initialTimeout.current) window.clearTimeout(initialTimeout.current);
    userPauseTimeout.current = null;
    settleTimeout.current = null;
    initialTimeout.current = null;
  }, []);

  const setTemporaryUserPause = () => {
    setUserInputPause(true);
    if (userPauseTimeout.current) window.clearTimeout(userPauseTimeout.current);
    userPauseTimeout.current = window.setTimeout(() => setUserInputPause(false), 150);
  };

  const {
    progress: fillProgress,
    isRunning: fillRunning,
    start: startFill,
    pause: pauseFill,
    resume: resumeFill,
    reset: resetFill,
  } = useProgressEngine(fillMs, {
    onComplete: () => {
      setFill(1);
      if (activeIndex >= count - 1) {
        setPhase("done");
        return;
      }
      startTransition(activeIndex);
    },
  });

  const {
    progress: slideProgress,
    isRunning: slideRunning,
    start: startSlide,
    pause: pauseSlide,
    resume: resumeSlide,
    reset: resetSlide,
  } = useProgressEngine(slideMs, {
    onComplete: () => {
      const spec = slideSpecRef.current;
      if (!spec) return;

      // Commit anchor positions.
      setCylinderAnchors((prev) => {
        const next = [...prev];
        next[spec.currentId] = spec.currentTo;
        next[spec.nextId] = spec.nextTo;
        return next;
      });

      // Activate next image + start fill.
      setActiveIndex(spec.nextId);
      setPhase("filling");
      setFill(0);
      resetFill();

      const startAfterSettle = () => {
        if (pausedRef.current) return;
        startFill();
      };

      if (settleMs > 0) {
        if (settleTimeout.current) window.clearTimeout(settleTimeout.current);
        settleTimeout.current = window.setTimeout(startAfterSettle, settleMs);
      } else {
        startAfterSettle();
      }
    },
  });

  const startTransition = useCallback(
    (n: number) => {
      if (count <= 1) return;
      if (anchorCenters.length !== anchorCount) return;

      // Transition n -> n+1:
      // current cylinder n slides back to L1.
      // next cylinder (n+1), currently at L(n+2), slides into L(n+1).
      const currentId = n;
      const nextId = n + 1;

      const currentFrom = cylinderAnchors[currentId];
      const currentTo = 0;

      const nextFrom = cylinderAnchors[nextId];
      const nextTo = n + 1;

      slideSpecRef.current = { currentId, currentFrom, currentTo, nextId, nextFrom, nextTo };

      // During sliding, the current image stays active; its cylinder resets fill to 0.
      setPhase("sliding");
      setFill(0);
      resetFill();
      resetSlide();

      if (prefersReducedMotion) {
        // Snap positions, then activate next and fill.
        setCylinderAnchors((prev) => {
          const next = [...prev];
          next[currentId] = currentTo;
          next[nextId] = nextTo;
          return next;
        });
        setActiveIndex(nextId);
        setPhase("filling");
        resetFill();
        startFill();
        return;
      }

      startSlide();
    },
    [
      anchorCenters.length,
      anchorCount,
      count,
      cylinderAnchors,
      prefersReducedMotion,
      resetFill,
      resetSlide,
      startFill,
      startSlide,
    ]
  );

  // Keep rail centered on active image.
  useEffect(() => {
    if (count === 0) return;
    if (prefersReducedMotion) snapIndex(activeIndex);
    else centerIndex(activeIndex);
  }, [activeIndex, centerIndex, count, prefersReducedMotion, snapIndex]);

  // Initial schedule: start transition from 1->2 after a short delay.
  useEffect(() => {
    if (count <= 1) return;
    clearTimers();
    setPhase("init");
    setFill(1);
    resetFill();

    initialTimeout.current = window.setTimeout(() => {
      if (pausedRef.current) return;
      startTransition(0);
    }, initialDelayMs);

    return () => {
      clearTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  // Pause/resume engines.
  useEffect(() => {
    if (paused) {
      pauseTrack();
      pauseFill();
      pauseSlide();
      return;
    }

    resumeTrack();

    if (phase === "sliding" && slideRunning) {
      resumeSlide();
      return;
    }

    if (phase === "filling" && fillRunning) {
      resumeFill();
      return;
    }
  }, [
    fillRunning,
    pauseFill,
    pauseSlide,
    pauseTrack,
    paused,
    phase,
    resumeFill,
    resumeSlide,
    resumeTrack,
    slideRunning,
  ]);

  // Drive derived fill state for render.
  useEffect(() => {
    if (phase !== "filling") return;
    setFill(fillProgress);
  }, [fillProgress, phase]);

  // Compute cylinder positions (center x).
  const cylinders: CylinderVisual[] = useMemo(() => {
    const centers = anchorCenters;
    const fallback = 0;

    const easedT = prefersReducedMotion ? 1 : softButterEase(clamp(slideProgress, 0, 1));

    const spec = slideSpecRef.current;

    return Array.from({ length: count }, (_, id) => {
      let x = centers[cylinderAnchors[id]] ?? fallback;

      if (phase === "sliding" && spec) {
        if (id === spec.currentId) {
          const fromX = centers[spec.currentFrom] ?? fallback;
          const toX = centers[spec.currentTo] ?? fallback;
          x = lerp(fromX, toX, easedT);
        }
        if (id === spec.nextId) {
          const fromX = centers[spec.nextFrom] ?? fallback;
          const toX = centers[spec.nextTo] ?? fallback;
          x = lerp(fromX, toX, easedT);
        }
      }

      const isActive = id === activeIndex;
      const fillValue = isActive ? fill : 0;

      return { id, x, isActive, fill: fillValue };
    });
  }, [
    activeIndex,
    anchorCenters,
    count,
    cylinderAnchors,
    fill,
    phase,
    prefersReducedMotion,
    slideProgress,
    softButterEase,
  ]);

  const slides = useMemo(
    () =>
      items.map((item, i) => ({
        ...item,
        key: `${item.src}-${i}`,
        aspectRatio: item.aspectRatio ?? "4/3",
      })),
    [items]
  );

  return (
    <section
      className={cx("rounded-3xl border border-black/5 bg-white shadow-soft", className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocusWithin(true)}
      onBlurCapture={() => setFocusWithin(false)}
      onWheel={() => setTemporaryUserPause()}
      onTouchStart={() => setTemporaryUserPause()}
      onKeyDown={() => setTemporaryUserPause()}
      role="region"
      aria-label="Feature showcase"
    >
      <div ref={containerRef} className="relative overflow-hidden rounded-3xl">
        <div
          ref={trackRef}
          className={cx("flex will-change-transform gap-0 select-none")}
          style={{ transform: `translate3d(${tx}px,0,0)` }}
        >
          {slides.map((item, i) => {
            const isActive = i === activeIndex;
            return (
              <div
                key={item.key}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                id={`${idBase}-slide-${i}`}
                role="group"
                aria-roledescription="slide"
                aria-label={`Image ${i + 1} of ${slides.length}`}
                className={cx("shrink-0 w-[86vw] sm:w-[56vw] md:w-[420px] p-5")}
              >
                <div
                  className={cx(
                    "relative overflow-hidden rounded-2xl border border-black/5 bg-neutral-100",
                    "shadow-soft",
                    "transition-[opacity,transform,filter] duration-180",
                    isActive ? "opacity-100" : "opacity-70",
                    isActive ? "translate-y-0" : "translate-y-[1px]"
                  )}
                  style={{ aspectRatio: item.aspectRatio }}
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(min-width: 1024px) 420px, (min-width: 640px) 56vw, 86vw"
                    priority={i < 2}
                    className={cx("object-cover", isActive ? "" : "grayscale-[10%]")}
                    placeholder={item.blurDataURL ? "blur" : "empty"}
                    blurDataURL={item.blurDataURL}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="px-6 pb-6">
        <CylindricalIndicatorsTimeline
          anchorCount={anchorCount}
          cylinders={cylinders}
          onAnchorsMeasured={(c) => setAnchorCenters(c)}
          pillWidth={34}
          pillHeight={8}
          arrow
          showAnchors={false}
        />

        <div className="mt-2 text-center text-xs text-neutral-500">
          {prefersReducedMotion ? "Reduced motion: snaps cylinders." : "Cylinders slide right→left."} Fill is linear {fillMs}ms.
          {phase === "done" ? " Done." : ""}
        </div>
      </div>
    </section>
  );
}
