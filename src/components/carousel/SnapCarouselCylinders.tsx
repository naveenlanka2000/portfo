'use client';

import { useMemo } from 'react';

import { cx } from '@/lib/utils';
import { clamp, lerp } from '@/utils/math';

export type SnapCarouselCylindersProps = {
  count: number;
  baseIndex: number;
  nextIndex: number;
  progress: number; // 0..1 from base -> next
  activeIndex: number;
  onSelect: (index: number) => void;
  dotSize?: number; // px
  gapPx?: number; // px
  activeWidth?: number; // px
  className?: string;
};

export function SnapCarouselCylinders({
  count,
  baseIndex,
  nextIndex,
  progress,
  activeIndex,
  onSelect,
  dotSize = 8,
  gapPx = 8,
  activeWidth = 20,
  className,
}: SnapCarouselCylindersProps) {
  const p = clamp(progress, 0, 1);
  const slotWidth = Math.max(1, dotSize + gapPx);
  const activeScale = clamp(activeWidth / dotSize, 1, 12);

  const scales = useMemo(() => {
    const s = Array.from({ length: count }, () => 1);
    if (count <= 0) return s;

    const a = clamp(baseIndex, 0, count - 1);
    const b = clamp(nextIndex, 0, count - 1);

    s[a] = lerp(activeScale, 1, p);
    s[b] = lerp(1, activeScale, p);

    return s;
  }, [activeScale, baseIndex, count, nextIndex, p]);

  const fills = useMemo(() => {
    const f = Array.from({ length: count }, () => 0);
    if (count <= 0) return f;

    const a = clamp(baseIndex, 0, count - 1);
    const b = clamp(nextIndex, 0, count - 1);

    // Crossfade fill: outgoing drains while incoming fills.
    f[a] = lerp(1, 0, p);
    f[b] = lerp(0, 1, p);

    return f;
  }, [baseIndex, count, nextIndex, p]);

  const trackOpacities = useMemo(() => {
    const o = Array.from({ length: count }, () => 0.3);
    if (count <= 0) return o;

    const a = clamp(baseIndex, 0, count - 1);
    const b = clamp(nextIndex, 0, count - 1);

    // Track visibility follows the morph (keeps cylinder feel near active).
    o[a] = lerp(1.0, 0.3, p);
    o[b] = lerp(0.3, 1.0, p);

    return o;
  }, [baseIndex, count, nextIndex, p]);

  if (count <= 1) return null;

  return (
    <div
      className={cx(
        'mx-auto mt-4 flex items-center justify-center',
        'rounded-full border border-white/10 bg-white/5 px-2 py-1.5',
        'backdrop-blur-md',
        className
      )}
      role="tablist"
      aria-label="Carousel pagination"
    >
      {Array.from({ length: count }).map((_, i) => {
        const selected = i === activeIndex;
        const scaleX = scales[i] ?? 1;
        const fill = clamp(fills[i] ?? 0, 0, 1);
        const trackOpacity = clamp(trackOpacities[i] ?? 0.3, 0.3, 1);

        return (
          <button
            key={i}
            type="button"
            onClick={() => onSelect(i)}
            className={cx(
              'group relative grid place-items-center rounded-full',
              'px-3 py-3 -mx-3',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black'
            )}
            role="tab"
            aria-selected={selected}
            aria-label={`Go to slide ${i + 1}`}
            tabIndex={selected ? 0 : -1}
          >
            <span aria-hidden="true" className="relative" style={{ width: slotWidth, height: dotSize }}>
              <span
                className="absolute inset-0 overflow-hidden rounded-full bg-white"
                style={{
                  height: dotSize,
                  width: dotSize,
                  transformOrigin: 'center',
                  transform: `scaleX(${scaleX})`,
                  opacity: trackOpacity,
                }}
              >
                <span
                  className="absolute left-0 top-0 h-full bg-white"
                  style={{
                    width: `${fill * 100}%`,
                    opacity: 1,
                  }}
                />
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
