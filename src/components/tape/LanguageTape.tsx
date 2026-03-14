'use client';

import Image from 'next/image';
import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

import { cx } from '@/lib/utils';
import { usePageVisibility } from '@/hooks/usePageVisibility';
import { useInViewSection } from '@/hooks/useInViewSection';
import { useContinuousTape } from '@/hooks/useContinuousTape';
import { IconButton } from '@/components/tape/IconButton';

export type LanguageTapeItem = {
  name: string;
  svg?: ReactNode;
  src?: string;
  alt: string;
  href?: string;
};

export type LanguageTapeProps = {
  items: LanguageTapeItem[];
  speedPxPerSec?: number;
  direction?: 'ltr' | 'rtl';
  gap?: number;
  size?: number;
  pauseOnHover?: boolean;
  className?: string;

  hoverZoomScale?: number;
  hoverLiftPx?: number;
  enableSheen?: boolean;
  reducedMotionFallback?: 'tint' | 'outline';
};

function ArrowIcon({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
      {dir === 'left' ? (
        <path
          d="M12.5 4.5 7 10l5.5 5.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M7.5 4.5 13 10l-5.5 5.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

export function LanguageTape({
  items,
  speedPxPerSec = 170,
  direction = 'ltr',
  gap = 24,
  size = 60,
  pauseOnHover = false,
  className,
  hoverZoomScale,
  hoverLiftPx,
  enableSheen = true,
  reducedMotionFallback = 'outline',
}: LanguageTapeProps) {
  const reduced = useReducedMotion();
  const pageVisible = usePageVisibility();
  const { ref: inViewRef, inView } = useInViewSection<HTMLDivElement>({ threshold: 0.15 });

  const trackRef = useRef<HTMLDivElement | null>(null);
  const seqRef = useRef<HTMLDivElement | null>(null);

  const [loopLength, setLoopLength] = useState(0);
  const [paused, setPaused] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);

  // Measure loop length (width of one sequence)
  useEffect(() => {
    if (!seqRef.current) return;

    const el = seqRef.current;

    const measure = () => {
      const w = el.getBoundingClientRect().width;
      const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
      // Keep sub-pixel precision to avoid visible snapping at the wrap point.
      const px = Math.round(w * dpr) / dpr;
      setLoopLength(Math.max(0, px));
    };

    measure();

    const ro = new ResizeObserver(() => {
      measure();
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, [items.length, gap, size]);

  const enabled = useMemo(() => {
    if (reduced) return false;
    if (!pageVisible) return false;
    if (!inView) return false;
    return true;
  }, [inView, pageVisible, reduced]);

  const pausedEffective = paused || focusWithin;

  useContinuousTape(trackRef as unknown as React.RefObject<HTMLElement>, {
    enabled,
    paused: pauseOnHover ? pausedEffective : focusWithin,
    speedPxPerSec,
    direction,
    loopLengthPx: loopLength,
  });

  // Reduced motion manual offset
  const [manualX, setManualX] = useState(0);
  useEffect(() => {
    if (!reduced) return;
    setManualX(0);
  }, [reduced, items.length]);

  const step = useMemo(() => Math.max(1, Math.round(size + gap)), [gap, size]);

  const onShift = useCallback(
    (dir: 'left' | 'right') => {
      const next = dir === 'right' ? manualX + step * 3 : manualX - step * 3;
      setManualX(next);
    },
    [manualX, step]
  );

  const onPointerEnter = useCallback(() => {
    if (!pauseOnHover) return;
    setPaused(true);
  }, [pauseOnHover]);

  const onPointerLeave = useCallback(() => {
    if (!pauseOnHover) return;
    setPaused(false);
  }, [pauseOnHover]);

  const onFocusCapture = useCallback(() => {
    setFocusWithin(true);
  }, []);

  const onBlurCapture = useCallback(() => {
    setFocusWithin(false);
  }, []);

  return (
    <div className={cx('mt-4 w-full', className)}>
      <div
        ref={inViewRef}
        className="tape"
        aria-label="Languages & tools"
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        onFocusCapture={onFocusCapture}
        onBlurCapture={onBlurCapture}
        style={{ ['--tape-size' as unknown as string]: `${size}px` }}
      >
        <div className="py-3">
          <div className="tape-track" ref={trackRef} role="list" aria-label="Languages & tools">
            <div className="tape-seq" ref={seqRef} aria-hidden={false}>
              {items.map((item) => (
                <TapeItem
                  key={item.name}
                  item={item}
                  gap={gap}
                  hoverZoomScale={hoverZoomScale}
                  hoverLiftPx={hoverLiftPx}
                  enableSheen={enableSheen}
                  reducedMotionFallback={reducedMotionFallback}
                />
              ))}
            </div>
            {/* Duplicates for seamless loop (increased to prevent gaps on wide screens) */}
            {Array.from({ length: 3 }).map((_, i) => (
              <div className="tape-seq" aria-hidden key={i}>
                {items.map((item) => (
                  <TapeItem
                    key={`${item.name}-dup-${i}`}
                    item={item}
                    gap={gap}
                    hoverZoomScale={hoverZoomScale}
                    hoverLiftPx={hoverLiftPx}
                    enableSheen={enableSheen}
                    reducedMotionFallback={reducedMotionFallback}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Reduced motion: manual nudge controls */}
          {reduced ? (
            <div className="mt-3 flex items-center justify-between">
              <p className="text-xs text-neutral-500">Reduced motion: tape is static.</p>
              <div className="tape-controls">
                <button type="button" className="tape-control" onClick={() => onShift('left')} aria-label="Scroll icons left">
                  <ArrowIcon dir="left" />
                </button>
                <button type="button" className="tape-control" onClick={() => onShift('right')} aria-label="Scroll icons right">
                  <ArrowIcon dir="right" />
                </button>
              </div>
            </div>
          ) : null}
        </div>

        {/* Manual offset layer (reduced motion only) */}
        {reduced ? (
          <style
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: `.tape-track{transform:translate3d(${manualX}px,0,0);will-change:auto}`,
            }}
          />
        ) : null}
      </div>
    </div>
  );
}

function TapeItem({
  item,
  gap,
  hoverZoomScale,
  hoverLiftPx,
  enableSheen,
  reducedMotionFallback,
}: {
  item: LanguageTapeItem;
  gap: number;
  hoverZoomScale?: number;
  hoverLiftPx?: number;
  enableSheen: boolean;
  reducedMotionFallback: 'tint' | 'outline';
}) {
  const style = useMemo(() => ({ marginRight: `${gap}px` }), [gap]);

  const content = item.svg ? (
    <span aria-hidden className="pointer-events-none">
      {item.svg}
    </span>
  ) : item.src ? (
    <Image src={item.src} alt={item.alt} width={40} height={40} className="pointer-events-none" />
  ) : (
    <span className="text-sm font-medium text-neutral-700">{item.name}</span>
  );

  return (
    <IconButton
      href={item.href}
      label={item.alt}
      className="tape-item"
      style={style}
      hoverZoomScale={hoverZoomScale}
      hoverLiftPx={hoverLiftPx}
      enableSheen={enableSheen}
      reducedMotionFallback={reducedMotionFallback}
    >
      <span className="tape-iconInner pointer-events-none" aria-hidden>
        {content}
      </span>
    </IconButton>
  );
}
