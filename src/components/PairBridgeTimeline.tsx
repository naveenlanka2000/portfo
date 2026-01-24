"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { cx } from "@/lib/utils";
import { clamp, lerp } from "@/utils/math";

export type PairBridgeTimelineProps = {
  locationCount: number; // expected: images + 1 (e.g. 11 locations for 10 images)
  activeLocationIndex: number;
  pairIndex: number; // current pair i for bridge between location i and i+1
  stage: "make" | "fill" | "handoff" | "decrease" | "done";
  t: number; // 0..1 for make/handoff stages
  fillProgress: number; // 0..1, used in "fill" stage only
  loop?: boolean;
  onSelectLocation: (locationIndex: number) => void;

  dotSize?: number; // px
  dotGapPx?: number; // visual gap between dots
  capsuleWidth?: number; // base frame width
  capsuleHeight?: number;
  dotColor?: string;
  trackColor?: string;
  progressColor?: string;
  arrow?: boolean;
  label?: string;
  idBase: string;
};

export function PairBridgeTimeline({
  locationCount,
  activeLocationIndex,
  pairIndex,
  stage,
  t,
  fillProgress,
  loop = true,
  onSelectLocation,
  dotSize = 6,
  dotGapPx = 2,
  capsuleWidth = 32,
  capsuleHeight = 8,
  dotColor = "#d4d4d4",
  trackColor = "rgba(230,230,230,0.70)",
  progressColor = "#0a84ff",
  arrow = false,
  label = "Image timeline",
  idBase,
}: PairBridgeTimelineProps) {
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const slotRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [centers, setCenters] = useState<number[]>([]);

  const dotScaleX = clamp(dotSize / capsuleWidth, 0.01, 1);
  const dotScaleY = clamp(dotSize / capsuleHeight, 0.01, 1);
  const slotWidth = Math.max(1, dotSize + dotGapPx);

  const items = useMemo(() => Array.from({ length: locationCount }, (_, i) => i), [locationCount]);

  useEffect(() => {
    const measure = () => {
      const container = containerRef.current;
      if (!container) return;
      const containerRect = container.getBoundingClientRect();
      const next = slotRefs.current.map((el) => {
        if (!el) return NaN;
        const r = el.getBoundingClientRect();
        return r.left + r.width / 2 - containerRect.left;
      });
      setCenters(next);
    };

    measure();

    const ro = new ResizeObserver(() => measure());
    if (containerRef.current) ro.observe(containerRef.current);
    slotRefs.current.forEach((el) => el && ro.observe(el));

    window.addEventListener("resize", measure, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [locationCount]);

  useEffect(() => {
    // Keep focus on the active tab if focus is already within the timeline.
    const active = document.activeElement;
    if (!active) return;
    const isWithin = buttonRefs.current.some((b) => b === active);
    if (!isWithin) return;
    buttonRefs.current[activeLocationIndex]?.focus();
  }, [activeLocationIndex]);

  const pairCount = Math.max(0, locationCount - 1);
  const currentPair = clamp(pairIndex, 0, Math.max(0, pairCount - 1));
  const nextPair = loop ? (currentPair + 1) % Math.max(1, pairCount) : Math.min(currentPair + 1, pairCount - 1);

  const computePair = (k: number) => {
    const earlier = clamp(k, 0, Math.max(0, pairCount - 1));
    const later = clamp(k + 1, 1, Math.max(1, pairCount));
    const earlierX = centers[earlier];
    const laterX = centers[later];
    const ok = Number.isFinite(earlierX) && Number.isFinite(laterX);
    const bridgeWidthPx = ok ? Math.max(0, (laterX as number) - (earlierX as number)) : 0;
    const targetScaleX = ok ? clamp(bridgeWidthPx / capsuleWidth, dotScaleX, 12) : dotScaleX;
    return { ok, earlier, later, earlierX, laterX, bridgeWidthPx, targetScaleX };
  };

  const cur = computePair(currentPair);
  const nxt = computePair(nextPair);

  const tt = clamp(t, 0, 1);

  const curScaleX =
    stage === "make"
      ? lerp(dotScaleX, cur.targetScaleX, tt)
      : stage === "handoff" || stage === "decrease"
        ? lerp(cur.targetScaleX, dotScaleX, tt)
        : cur.targetScaleX;
  const curScaleY =
    stage === "make" ? lerp(dotScaleY, 1, tt) : stage === "handoff" || stage === "decrease" ? lerp(1, dotScaleY, tt) : 1;

  const nxtScaleX = stage === "handoff" ? lerp(dotScaleX, nxt.targetScaleX, tt) : dotScaleX;
  const nxtScaleY = stage === "handoff" ? lerp(dotScaleY, 1, tt) : dotScaleY;

  const showCurBridge = cur.ok && (stage === "make" || stage === "fill" || stage === "handoff" || stage === "decrease");
  const showNxtBridge = nxt.ok && stage === "handoff";

  return (
    <div className="relative">
      {arrow && (
        <div aria-hidden="true" className="pointer-events-none absolute -left-1 top-1/2 -translate-y-1/2 text-neutral-400">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 6L4 12L10 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      )}

      <div
        ref={containerRef}
        role="tablist"
        aria-label={label}
        aria-orientation="horizontal"
        className={cx(
          "relative flex items-center justify-center"
        )}
      >
        {/* Current bridge overlay (pair i -> i+1). */}
        {showCurBridge && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2"
            style={{
              width: capsuleWidth,
              height: capsuleHeight,
              transform: `translate3d(${(cur.laterX as number) - capsuleWidth}px, -50%, 0)`,
            }}
          >
            <div
              className="absolute inset-0 rounded-full overflow-hidden transform-gpu"
              style={{
                transformOrigin: "right center",
                transform: `scale3d(${curScaleX}, 1, 1)`,
              }}
            >
              <div
                className="absolute inset-0 rounded-full transform-gpu"
                style={{
                  transformOrigin: "right center",
                  transform: `scale3d(1, ${curScaleY}, 1)`,
                }}
              >
                <div className="absolute inset-0 rounded-full" style={{ backgroundColor: trackColor }} />
                {stage === "fill" && (
                  <div
                    className="absolute left-0 top-0 h-full rounded-full"
                    style={{
                      backgroundColor: progressColor,
                      width: `${clamp(fillProgress, 0, 1) * 100}%`,
                      transition: "none",
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Next bridge overlay (pair i+1 -> i+2), visible only during handoff overlap. */}
        {showNxtBridge && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2"
            style={{
              width: capsuleWidth,
              height: capsuleHeight,
              transform: `translate3d(${(nxt.laterX as number) - capsuleWidth}px, -50%, 0)`,
            }}
          >
            <div
              className="absolute inset-0 rounded-full overflow-hidden transform-gpu"
              style={{
                transformOrigin: "right center",
                transform: `scale3d(${nxtScaleX}, 1, 1)`,
              }}
            >
              <div
                className="absolute inset-0 rounded-full transform-gpu"
                style={{
                  transformOrigin: "right center",
                  transform: `scale3d(1, ${nxtScaleY}, 1)`,
                }}
              >
                <div className="absolute inset-0 rounded-full" style={{ backgroundColor: trackColor }} />
              </div>
            </div>
          </div>
        )}

        {items.map((i) => {
          const isActive = i === activeLocationIndex;

          return (
            <button
              key={i}
              ref={(el) => {
                buttonRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`${idBase}-slide-${Math.min(i, Math.max(0, locationCount - 2))}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onSelectLocation(i)}
              className={cx(
                "relative grid place-items-center outline-none",
                "px-3 py-3",
                // Pull hit targets together to keep dots visually tight.
                "-mx-3",
                "focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-4 focus-visible:ring-offset-white"
              )}
              aria-label={`Go to location ${i + 1} of ${locationCount}`}
            >
              <span
                ref={(el) => {
                  slotRefs.current[i] = el;
                }}
                aria-hidden="true"
                className="relative"
                style={{ width: slotWidth, height: capsuleHeight }}
              >
                <span
                  className="absolute inset-0 rounded-full transform-gpu"
                  style={{
                    backgroundColor: dotColor,
                    transformOrigin: "center",
                    transform: `scale3d(${dotScaleX}, ${dotScaleY}, 1)`,
                  }}
                />
              </span>
            </button>
          );
        })}
      </div>

      <span className="sr-only">Dot gap {dotGapPx}px</span>
    </div>
  );
}
