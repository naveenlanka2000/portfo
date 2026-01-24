"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";

import { usePageVisibility } from "@/hooks/usePageVisibility";
import { useHorizontalTrackCenter } from "@/hooks/useHorizontalTrackCenter";
import { useMagnetHandoff } from "@/hooks/useMagnetHandoff";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useProgressEngine } from "@/hooks/useProgressEngine";
import { clamp, cubicBezier } from "@/utils/math";
import { cx } from "@/lib/utils";

import { PairBridgeTimeline } from "./PairBridgeTimeline";

export type ShowcaseItem = {
  src: string;
  alt: string;
  aspectRatio?: string;
  blurDataURL?: string;
};

export type HorizontalImageShowcaseProps = {
  items: ShowcaseItem[];
  durationMs?: number;
  butterMs?: number;
  capsuleMs?: number;
  settleMs?: number;
  capsuleWidth?: number;
  capsuleHeight?: number;
  dotSize?: number;
  loop?: boolean;
  initialIndex?: number;
  onIndexChange?: (i: number) => void;
  className?: string;
  timelineMode?: "pairBridge";
};

export function HorizontalImageShowcase({
  items,
  durationMs = 5200,
  butterMs = 720,
  capsuleMs = 400,
  settleMs = 60,
  capsuleWidth = 32,
  capsuleHeight = 8,
  dotSize = 6,
  loop = true,
  initialIndex = 0,
  onIndexChange,
  className,
  timelineMode = "pairBridge",
}: HorizontalImageShowcaseProps) {
  const idBase = useId().replace(/:/g, "");

  const prefersReducedMotion = usePrefersReducedMotion();
  const pageVisible = usePageVisibility();

  const softButterEase = useMemo(() => cubicBezier(0.25, 1, 0.35, 1), []);
  const softEase = useMemo(() => cubicBezier(0.22, 0.95, 0.28, 1), []);

  const {
    containerRef,
    trackRef,
    itemRefs,
    tx,
    centerIndex,
    snapIndex,
    pause: pauseTrack,
    resume: resumeTrack,
  } = useHorizontalTrackCenter({ animationMs: butterMs, easing: softButterEase });

  const count = items.length;
  const locationCount = count + 1;

  const [activeIndex, setActiveIndex] = useState(() => Math.max(0, Math.min(count - 1, initialIndex)));
  const [pairIndex, setPairIndex] = useState(0);
  const pairIndexRef = useRef(pairIndex);
  pairIndexRef.current = pairIndex;

  const [stage, setStage] = useState<"make" | "fill" | "handoff" | "decrease" | "done">("make");

  const [hovered, setHovered] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const [userInputPause, setUserInputPause] = useState(false);

  const activeIndexRef = useRef(activeIndex);
  activeIndexRef.current = activeIndex;

  const userPauseTimeout = useRef<number | null>(null);
  const settleTimeout = useRef<number | null>(null);

  const pendingFillStartRef = useRef(false);

  const paused = hovered || focusWithin || userInputPause || !pageVisible;

  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  const resolvedCapsuleMs = prefersReducedMotion ? Math.min(200, capsuleMs) : capsuleMs;

  const clearTimers = useCallback(() => {
    if (userPauseTimeout.current) window.clearTimeout(userPauseTimeout.current);
    if (settleTimeout.current) window.clearTimeout(settleTimeout.current);
    userPauseTimeout.current = null;
    settleTimeout.current = null;
  }, []);

  const setTemporaryUserPause = () => {
    setUserInputPause(true);
    if (userPauseTimeout.current) window.clearTimeout(userPauseTimeout.current);
    userPauseTimeout.current = window.setTimeout(() => setUserInputPause(false), 150);
  };

  const normalizeIndex = useCallback(
    (idx: number) => {
      if (count === 0) return;
      if (loop) {
        return ((idx % count) + count) % count;
      } else {
        return Math.max(0, Math.min(count - 1, idx));
      }
    },
    [count, loop]
  );

  const setActive = useCallback(
    (idx: number) => {
      const next = normalizeIndex(idx);
      if (next == null) return;
      setActiveIndex(next);
      onIndexChange?.(next);
    },
    [normalizeIndex, onIndexChange]
  );

  const { handoff, startHandoff, cancel: cancelHandoff, pause: pauseHandoff, resume: resumeHandoff } =
    useMagnetHandoff();

  const {
    progress: fillProgress,
    isRunning: fillRunning,
    start: startFill,
    pause: pauseFill,
    resume: resumeFill,
    reset: resetFill,
  } = useProgressEngine(durationMs, {
    onComplete: () => {
      if (count <= 1) return;
      const k = clamp(pairIndexRef.current, 0, Math.max(0, count - 1));

      // Final image: only decrease back to a dot, then stop.
      if (k >= count - 1) {
        startFinalDecrease(k);
        return;
      }

      // Fill complete => begin Stage C (handoff overlap):
      // current bridge decreases R→L while next bridge makes R→L and image advances.
      startHandoffStage(k);
    },
  });

  const startSettleThenFill = useCallback(() => {
    if (settleTimeout.current) window.clearTimeout(settleTimeout.current);
    settleTimeout.current = window.setTimeout(() => {
      if (pausedRef.current) return;
      pendingFillStartRef.current = false;
      resetFill();
      startFill();
    }, settleMs);
  }, [resetFill, settleMs, startFill]);

  const startMakeStage = useCallback(
    (k: number) => {
      if (count === 0) return;
      const clamped = clamp(k, 0, Math.max(0, count - 1));

      clearTimers();
      cancelHandoff();
      resetFill();
      pendingFillStartRef.current = true;

      setPairIndex(clamped);
      setStage("make");

      // For pair k: show image k while making bridge (k -> k+1).
      setActive(clamped);
      if (prefersReducedMotion) snapIndex(clamped);
      else centerIndex(clamped);

      startHandoff(clamped, normalizeIndex(clamped + 1) ?? clamped, {
        kind: "handoff",
        durationMs: resolvedCapsuleMs,
        easing: softEase,
        onDone: () => {
          if (pausedRef.current) return;
          setStage("fill");
          // Fill starts after settleMs for cadence.
          pendingFillStartRef.current = true;
          startSettleThenFill();
        },
      });
    },
    [
      cancelHandoff,
      centerIndex,
      clearTimers,
      count,
      normalizeIndex,
      prefersReducedMotion,
      resetFill,
      resolvedCapsuleMs,
      setActive,
      snapIndex,
      softEase,
      startSettleThenFill,
      startHandoff,
    ]
  );

  const startFinalDecrease = useCallback(
    (k: number) => {
      if (count === 0) return;
      const current = clamp(k, 0, count - 1);

      clearTimers();
      cancelHandoff();
      resetFill();
      pendingFillStartRef.current = false;

      setStage("decrease");

      // Keep final image active; only animate the bridge shrinking.
      startHandoff(current, current, {
        kind: "handoff",
        durationMs: resolvedCapsuleMs,
        easing: softEase,
        onDone: () => {
          if (pausedRef.current) return;
          setStage("done");
        },
      });
    },
    [cancelHandoff, clearTimers, count, resetFill, resolvedCapsuleMs, softEase, startHandoff]
  );

  const startHandoffStage = useCallback(
    (k: number) => {
      if (count <= 1) return;

      const current = clamp(k, 0, count - 1);
      const next = normalizeIndex(current + 1);
      if (next == null) return;

      clearTimers();
      cancelHandoff();
      resetFill();
      pendingFillStartRef.current = false;

      setStage("handoff");

      // Image advances during the overlap.
      setActive(next);
      if (prefersReducedMotion) snapIndex(next);
      else centerIndex(next);

      startHandoff(current, next, {
        kind: "handoff",
        durationMs: resolvedCapsuleMs,
        easing: softEase,
        onDone: () => {
          if (pausedRef.current) return;

          // Move to next pair and start filling it (after optional settle).
          const nextPair = loop ? ((current + 1) % count) : Math.min(current + 1, count - 1);
          setPairIndex(nextPair);
          setStage("fill");
          pendingFillStartRef.current = true;

          // Ensure the fill starts after a short settle.
          startSettleThenFill();
        },
      });
    },
    [
      cancelHandoff,
      centerIndex,
      clearTimers,
      count,
      loop,
      normalizeIndex,
      prefersReducedMotion,
      resetFill,
      resolvedCapsuleMs,
      setActive,
      snapIndex,
      softEase,
      startHandoff,
      startSettleThenFill,
    ]
  );

  // Mount: start the first pair (0,1).
  useEffect(() => {
    if (count === 0) return;
    startMakeStage(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Pause/resume everything precisely.
  useEffect(() => {
    if (paused) {
      pauseTrack();
      pauseHandoff();
      pauseFill();
      return;
    }

    resumeTrack();
    resumeHandoff();
    if (handoff.inProgress) return;

    if (stage !== "fill") return;

    if (pendingFillStartRef.current) {
      startSettleThenFill();
      return;
    }

    if (fillRunning) resumeFill();
    else startFill();
  }, [
    fillRunning,
    handoff.inProgress,
    pauseFill,
    pauseHandoff,
    pauseTrack,
    paused,
    resetFill,
    resumeFill,
    resumeHandoff,
    resumeTrack,
    settleMs,
    stage,
    startSettleThenFill,
    startFill,
  ]);

  // Keep active centered on resize.
  useEffect(() => {
    const onResize = () => {
      if (prefersReducedMotion) snapIndex(activeIndex);
      else centerIndex(activeIndex);
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, [activeIndex, centerIndex, prefersReducedMotion, snapIndex]);

  // Cleanup.
  useEffect(() => () => clearTimers(), [clearTimers]);

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
      aria-roledescription="carousel"
      aria-label="Image showcase"
    >
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-3xl"
      >
        <div
          ref={trackRef}
          className={cx(
            "flex will-change-transform",
            "gap-0",
            "select-none"
          )}
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
                className={cx(
                  "shrink-0",
                  "w-[86vw] sm:w-[56vw] md:w-[420px]",
                  "p-5"
                )}
              >
                <div
                  className={cx(
                    "relative overflow-hidden rounded-2xl border border-black/5 bg-neutral-100",
                    "shadow-soft",
                    "transition-opacity duration-150",
                    isActive ? "opacity-100" : "opacity-95"
                  )}
                  style={{ aspectRatio: item.aspectRatio }}
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(min-width: 1024px) 420px, (min-width: 640px) 56vw, 86vw"
                    priority={i < 2}
                    className="object-cover"
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
        <div className="mt-4 flex items-center justify-center">
          {timelineMode === "pairBridge" && (
            <PairBridgeTimeline
              locationCount={locationCount}
              activeLocationIndex={Math.min(locationCount - 1, Math.max(0, activeIndex + 1))}
              pairIndex={pairIndex}
              stage={stage}
              t={handoff.inProgress ? handoff.t : 0}
              fillProgress={stage === "fill" ? fillProgress : 0}
              loop={loop}
              capsuleWidth={capsuleWidth}
              capsuleHeight={capsuleHeight}
              dotSize={dotSize}
              dotGapPx={2}
              idBase={idBase}
              onSelectLocation={(loc) => {
                setTemporaryUserPause();
                if (count === 0) return;
                const lastLoc = locationCount - 1;
                const k = loc === lastLoc ? (loop ? 0 : count - 1) : clamp(loc, 0, count - 1);
                startMakeStage(k);
              }}
            />
          )}
        </div>

        <div className="mt-3 text-center text-xs text-neutral-500">
          {prefersReducedMotion ? "Reduced motion: snaps to center." : "Centers with a butter tween."} Progress is
          linear {durationMs}ms.
        </div>
      </div>
    </section>
  );
}
