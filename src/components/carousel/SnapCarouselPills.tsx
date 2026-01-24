'use client';

import { useMemo } from 'react';

import { cx } from '@/lib/utils';
import { clamp, lerp } from '@/utils/math';

export type SnapCarouselPillsProps = {
  count: number;
  baseIndex: number;
  nextIndex: number;
  progress: number; // 0..1 from base -> next
  activeIndex: number;
  onSelect: (index: number) => void;
  dotSize?: number; // px (circle diameter)
  gapPx?: number; // px gap between anchor slots
  activeWidth?: number; // px (pill width)
  className?: string;
};

export function SnapCarouselPills({
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
}: SnapCarouselPillsProps) {
  const p = clamp(progress, 0, 1);
  const slotWidth = Math.max(1, dotSize + gapPx);

  const widths = useMemo(() => {
    const w = Array.from({ length: count }, () => dotSize);
    if (count <= 0) return w;

    const a = clamp(baseIndex, 0, count - 1);
    const b = clamp(nextIndex, 0, count - 1);

    w[a] = lerp(activeWidth, dotSize, p);
    w[b] = lerp(dotSize, activeWidth, p);

    return w;
  }, [activeWidth, baseIndex, count, dotSize, nextIndex, p]);

  const opacities = useMemo(() => {
    const o = Array.from({ length: count }, () => 0.3);
    if (count <= 0) return o;

    const a = clamp(baseIndex, 0, count - 1);
    const b = clamp(nextIndex, 0, count - 1);

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
        const width = widths[i] ?? dotSize;
        const opacity = opacities[i] ?? 0.3;
        const scaleX = clamp(width / dotSize, 1, 12);

        return (
          <button
            key={i}
            type="button"
            onClick={() => onSelect(i)}
            className={cx(
              'group relative grid place-items-center rounded-full',
              'px-3 py-3',
              // Pull hit targets together while keeping anchors fixed + tight.
              '-mx-3',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black'
            )}
            role="tab"
            aria-selected={selected}
            aria-label={`Go to slide ${i + 1}`}
            tabIndex={selected ? 0 : -1}
          >
            <span aria-hidden="true" className="relative" style={{ width: slotWidth, height: dotSize }}>
              <span
                className="absolute inset-0 rounded-full bg-white"
                style={{
                  opacity,
                  height: dotSize,
                  width: dotSize,
                  transformOrigin: 'center',
                  transform: `scaleX(${scaleX})`,
                  borderRadius: dotSize / 2,
                }}
              />
            </span>
          </button>
        );
      })}
    </div>
  );
}
