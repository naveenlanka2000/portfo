"use client";

import { useEffect, useMemo, useRef } from "react";

import { cx } from "@/lib/utils";
import { lerp } from "@/utils/math";

export type PointsTimelineProps = {
  count: number;
  activeIndex: number;
  handoff: { inProgress: boolean; current: number; next: number; t: number; kind?: "handoff" | "contract" | "expand" };
  fillProgress: number; // 0..1 for active capsule only; 0 during handoff
  onSelect: (index: number) => void;
  compact?: boolean;
  capsuleWidth?: number;
  capsuleHeight?: number;
  dotSize?: number;
  dotColor?: string;
  progressColor?: string;
  label?: string;
  idBase: string;
};

export function PointsTimeline({
  count,
  activeIndex,
  handoff: handoffProp,
  fillProgress,
  onSelect,
  compact = true,
  capsuleWidth = 32,
  capsuleHeight = 8,
  dotSize = 6,
  dotColor = "#d4d4d4",
  progressColor = "#0a84ff",
  label = "Image timeline",
  idBase,
}: PointsTimelineProps) {
  const handoff = handoffProp ?? { inProgress: false, current: activeIndex, next: activeIndex, t: 0 };
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const dotScaleX = Math.max(0.01, Math.min(1, dotSize / capsuleWidth));
  const dotScaleY = Math.max(0.01, Math.min(1, dotSize / capsuleHeight));
  const kind = handoff.kind ?? "handoff";
  // Translate the capsule body left so the dot is centered when scaleX=dotScaleX.
  // This is constant (not animated), so it doesn't introduce drift.
  const bodyShiftPx = (capsuleWidth - dotSize) / 2;

  const items = useMemo(() => Array.from({ length: count }, (_, i) => i), [count]);

  useEffect(() => {
    // Keep focus on the active tab if focus is already within the timeline.
    const active = document.activeElement;
    if (!active) return;
    const isWithin = buttonRefs.current.some((b) => b === active);
    if (!isWithin) return;
    buttonRefs.current[activeIndex]?.focus();
  }, [activeIndex]);

  return (
    <div className="relative">
      <div
        role="tablist"
        aria-label={label}
        aria-orientation="horizontal"
        className={cx(
          "relative flex items-center justify-center",
          // Tight visual gap while keeping hit targets large via padding.
          compact ? "gap-0" : "gap-0.5"
        )}
        onKeyDown={(e) => {
          const key = e.key;
          if (key !== "ArrowLeft" && key !== "ArrowRight" && key !== "Home" && key !== "End") return;
          e.preventDefault();

          if (key === "Home") return onSelect(0);
          if (key === "End") return onSelect(count - 1);
          if (key === "ArrowLeft") return onSelect(activeIndex - 1);
          if (key === "ArrowRight") return onSelect(activeIndex + 1);
        }}
      >
        {items.map((i) => {
          const isActive = i === activeIndex;

          const isCurrent = handoff.inProgress && i === handoff.current;
          const isNext = handoff.inProgress && i === handoff.next;

                  const t = Math.max(0, Math.min(1, handoff.t));
                  const delta = capsuleWidth - dotSize;

                  const currentWidth = dotSize + delta * (1 - t);
                  const nextWidth = dotSize + delta * t;
                  const currentScale = Math.max(0.01, Math.min(1, currentWidth / capsuleWidth));
                  const nextScale = Math.max(0.01, Math.min(1, nextWidth / capsuleWidth));

                  const currentScaleY = lerp(1, dotScaleY, t);
                  const nextScaleY = lerp(dotScaleY, 1, t);

                  const scale = handoff.inProgress
                    ? kind === "contract"
                      ? isCurrent
                        ? { x: currentScale, y: currentScaleY }
                        : { x: dotScaleX, y: dotScaleY }
                      : kind === "expand"
                        ? isNext
                          ? { x: nextScale, y: nextScaleY }
                          : { x: dotScaleX, y: dotScaleY }
                        : // handoff (equal-delta)
                          isCurrent
                          ? { x: currentScale, y: currentScaleY }
                          : isNext
                            ? { x: nextScale, y: nextScaleY }
                            : { x: dotScaleX, y: dotScaleY }
                    : isActive
                      ? { x: 1, y: 1 }
                      : { x: dotScaleX, y: dotScaleY };

          const barProgress = handoff.inProgress
            ? kind === "expand"
              ? 0
              : isCurrent
                ? 1
                : 0
            : isActive
              ? fillProgress
              : 0;

          return (
            <button
              key={i}
              ref={(el) => {
                buttonRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`${idBase}-slide-${i}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onSelect(i)}
              className={cx(
                "relative grid place-items-center outline-none",
                // Ensure >=44px target without increasing visual spacing.
                "px-3 py-3",
                compact ? "-mx-3" : "",
                "focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-4 focus-visible:ring-offset-white"
              )}
              aria-label={`Go to image ${i + 1} of ${count}`}
            >
              {/* Fixed-size capsule frame; scaleX animates inside with origin-right (no drift). */}
              <span
                aria-hidden="true"
                className={cx(
                  "relative",
                  "overflow-visible"
                )}
                style={{
                  width: capsuleWidth,
                  height: capsuleHeight,
                }}
              >
                {/* Centering shim: positions the right-anchored scaling body so dot is centered. */}
                <span
                  className="absolute inset-0 transform-gpu"
                  style={{ transform: `translate3d(${-bodyShiftPx}px, 0, 0)` }}
                >
                  <span
                    className={cx(
                      "absolute inset-0 rounded-full",
                      "transform-gpu",
                      "bg-transparent"
                    )}
                    style={{
                      transform: `scale3d(${scale.x}, ${scale.y}, 1)`,
                      transformOrigin: "right center",
                    }}
                  >
                    <span className="absolute inset-0 overflow-hidden rounded-full" style={{ padding: 0 }}>
                      <span className="absolute inset-0 rounded-full" style={{ backgroundColor: dotColor }} />

                      {(isActive || (handoff.inProgress && isCurrent)) && (
                        <span
                          className="absolute left-0 top-0 h-full rounded-full"
                          style={{
                            backgroundColor: progressColor,
                            width: `${Math.max(0, Math.min(1, barProgress)) * 100}%`,
                            transformOrigin: "left center",
                            transition: "none",
                          }}
                        />
                      )}
                    </span>
                  </span>
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
