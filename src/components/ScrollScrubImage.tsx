'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';

import { cx } from '@/lib/utils';
import { motionTokens } from '@/lib/motion-tokens';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useSectionScrollProgress } from '@/hooks/useSectionScrollProgress';
import { clamp, lerp } from '@/utils/math';

type ScrollScrubImageProps = {
  src: string;
  alt: string;
  aspectRatio?: string; // e.g. '4/5' or '3/4'
  width?: number;
  height?: number;
  startOffsetPercent?: number; // default 0.16 (12–20% allowed)
  opacityRevealFraction?: number; // default 0.2
  hoverLift?: boolean; // default true
  className?: string;
  priority?: boolean;
  ariaLabel?: string;
  sizes?: string;
};

function normalizeAspectRatio(value?: string) {
  if (!value) return undefined;
  return value.includes('/') ? value.replace('/', ' / ') : value;
}

function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}

/**
 * Masked image that scroll-scrubs vertically inside a fixed container.
 * translateY is strictly linear with section scroll progress (0→1), clamped.
 */
export function ScrollScrubImage({
  src,
  alt,
  aspectRatio,
  width,
  height,
  startOffsetPercent = 0.16,
  opacityRevealFraction = 0.2,
  hoverLift = true,
  className,
  priority,
  ariaLabel = 'Product visual',
  sizes,
}: ScrollScrubImageProps) {
  const reduced = usePrefersReducedMotion();
  const { ref, progress, active } = useSectionScrollProgress({ rootMargin: '0px 0px -20% 0px' });

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerHeight, setContainerHeight] = useState(0);

  const ratio = useMemo(() => {
    if (aspectRatio) return normalizeAspectRatio(aspectRatio);
    if (width && height) return `${width} / ${height}`;
    return undefined;
  }, [aspectRatio, width, height]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const next = Math.round(el.getBoundingClientRect().height);
      if (next > 0) setContainerHeight(next);
    };

    update();

    const ro = new ResizeObserver(() => update());
    ro.observe(el);

    return () => ro.disconnect();
  }, []);

  const startPercent = clamp(startOffsetPercent, 0.12, 0.2);
  const startOffsetPx = containerHeight * startPercent;

  const imageYpx = reduced ? 0 : lerp(startOffsetPx, 0, clamp(progress, 0, 1));

  const rawOpacityT = clamp(progress / Math.max(0.0001, opacityRevealFraction), 0, 1);
  const opacity = reduced ? 1 : smoothstep(rawOpacityT);

  const hoverClasses = hoverLift
    ? '[@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-1'
    : '';

  return (
    <section ref={ref} role="region" aria-label={ariaLabel} className={cx('w-full', className)}>
      <div
        ref={containerRef}
        className={cx(
          'relative overflow-hidden rounded-xl bg-neutral-100 shadow-soft',
          'transition-transform duration-200 [transition-timing-function:var(--motion-ease)]',
          hoverClasses
        )}
        style={ratio ? ({ aspectRatio: ratio } as React.CSSProperties) : undefined}
      >
        <div
          className={cx('absolute inset-0')}
          style={
            {
              transform: `translate3d(0, ${reduced ? 0 : imageYpx}px, 0)`,
              willChange: active && !reduced ? 'transform' : 'auto',
              opacity,
              transition: reduced
                ? `opacity ${motionTokens.durations.short}ms var(--motion-ease)`
                : undefined,
            } as React.CSSProperties
          }
        >
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            sizes={sizes}
            className="absolute inset-0 h-full w-full object-cover object-center"
            decoding="async"
          />
        </div>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-neutral-900/35 via-neutral-900/0 to-neutral-900/0" />
      </div>
    </section>
  );
}
