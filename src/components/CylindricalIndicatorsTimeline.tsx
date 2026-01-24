"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { cx } from "@/lib/utils";

export type CylinderVisual = {
  id: number;
  x: number; // center x in px relative to the timeline container
  isActive: boolean;
  fill: number; // 0..1
};

export type CylindricalIndicatorsTimelineProps = {
  anchorCount: number; // expected 11
  cylinders: CylinderVisual[]; // expected 10
  onAnchorsMeasured?: (centers: number[]) => void;

  pillWidth?: number; // 30..36
  pillHeight?: number; // 6..8

  trackColor?: string;
  fillColor?: string;

  showAnchors?: boolean; // default false (Apple-clean)
  arrow?: boolean; // default true
  className?: string;
};

export function CylindricalIndicatorsTimeline({
  anchorCount,
  cylinders,
  onAnchorsMeasured,
  pillWidth = 34,
  pillHeight = 8,
  trackColor = "rgba(0,0,0,0.10)",
  fillColor = "#0a84ff",
  showAnchors = false,
  arrow = true,
  className,
}: CylindricalIndicatorsTimelineProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const anchorRefs = useRef<Array<HTMLSpanElement | null>>([]);

  const [centers, setCenters] = useState<number[]>([]);

  const anchors = useMemo(() => Array.from({ length: anchorCount }, (_, i) => i), [anchorCount]);

  useEffect(() => {
    const measure = () => {
      const container = containerRef.current;
      if (!container) return;
      const containerRect = container.getBoundingClientRect();
      const next = anchorRefs.current.map((el) => {
        if (!el) return NaN;
        const r = el.getBoundingClientRect();
        return r.left + r.width / 2 - containerRect.left;
      });
      setCenters(next);
      onAnchorsMeasured?.(next);
    };

    measure();

    const ro = new ResizeObserver(() => measure());
    if (containerRef.current) ro.observe(containerRef.current);
    anchorRefs.current.forEach((el) => el && ro.observe(el));

    window.addEventListener("resize", measure, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [onAnchorsMeasured]);

  return (
    <div className={cx("relative", className)}>
      {/* Arrow (purely visual). */}
      {arrow && (
        <div aria-hidden="true" className="pointer-events-none absolute left-1 top-1/2 -translate-y-1/2 text-neutral-400">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M10 6L4 12L10 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      )}

      <div
        ref={containerRef}
        className={cx(
          "relative mx-auto",
          // Constrain so anchors feel like Apple.com (tight, centered).
          "w-full max-w-[560px]",
          // Give vertical space for pills.
          "py-5"
        )}
      >
        {/* Fixed anchors (L1..Ln). */}
        <div className="grid grid-cols-11 items-center justify-items-center">
          {anchors.map((i) => (
            <span
              key={i}
              ref={(el) => {
                anchorRefs.current[i] = el;
              }}
              className={cx(
                "block",
                showAnchors ? "h-1.5 w-1.5 rounded-full bg-neutral-300" : "h-1 w-1 rounded-full bg-transparent"
              )}
            />
          ))}
        </div>

        {/* Cylinders overlay */}
        <div aria-hidden="true" className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2">
          {cylinders.map((c) => {
            const x = Number.isFinite(c.x) ? c.x : centers[0] ?? 0;
            const fill = Math.max(0, Math.min(1, c.fill));
            return (
              <div
                key={c.id}
                className={cx(
                  "absolute top-0 transform-gpu",
                  c.isActive ? "z-20" : "z-10",
                  // A little glassy track.
                  c.isActive ? "opacity-100" : "opacity-80"
                )}
                style={{
                  width: pillWidth,
                  height: pillHeight,
                  transform: `translate3d(${x - pillWidth / 2}px, -50%, 0)`,
                }}
              >
                <div
                  className={cx(
                    "relative h-full w-full overflow-hidden rounded-full",
                    c.isActive ? "shadow-[0_6px_20px_rgba(0,0,0,0.10)]" : ""
                  )}
                  style={{ backgroundColor: trackColor }}
                >
                  <div
                    className="absolute left-0 top-0 h-full rounded-full"
                    style={{
                      width: `${fill * 100}%`,
                      backgroundColor: fillColor,
                      transition: "none",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
