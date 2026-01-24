'use client';

import Image, { ImageProps } from 'next/image';
import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

import { cx } from '@/lib/utils';
import { motionTokens } from '@/lib/motion-tokens';
import { useInViewOnce } from '@/hooks/useInViewOnce';

type ParallaxLayer = 'none' | 'background' | 'mid' | 'foreground';

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function layerStrength(layer: ParallaxLayer) {
  if (layer === 'background') return motionTokens.parallaxStrength.background;
  if (layer === 'mid') return motionTokens.parallaxStrength.mid;
  if (layer === 'foreground') return motionTokens.parallaxStrength.fg;
  return 0;
}

function canHover() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia?.('(hover: hover) and (pointer: fine)')?.matches ?? false;
}

type MotionImageProps = {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  quality?: number;
  className?: string;
  wrapperClassName?: string;
  aspectRatio?: string;
  parallaxLayer?: ParallaxLayer;
  clampPx?: number;
  reveal?: boolean;
  revealIndex?: number;
  hover?: boolean;
  overlay?: ReactNode;
  overlayParallaxLayer?: ParallaxLayer;
  overlayClassName?: string;
} & Omit<ImageProps, 'src' | 'alt' | 'fill' | 'sizes' | 'priority' | 'quality'>;

export function MotionImage({
  src,
  alt,
  sizes,
  priority,
  quality,
  className,
  wrapperClassName,
  aspectRatio,
  parallaxLayer = 'mid',
  clampPx = 80,
  reveal = true,
  revealIndex,
  hover = true,
  overlay,
  overlayParallaxLayer = 'foreground',
  overlayClassName,
  ...rest
}: MotionImageProps) {
  const reduced = useReducedMotion();

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const parallaxRef = useRef<HTMLDivElement | null>(null);
  const hoverRef = useRef<HTMLDivElement | null>(null);
  const overlayParallaxRef = useRef<HTMLDivElement | null>(null);

  const [revealed, setRevealed] = useState(() => !reveal);

  const revealDelayMs = useMemo(() => {
    if (typeof revealIndex !== 'number') return 0;
    return Math.round(revealIndex * motionTokens.stagger * 1000);
  }, [revealIndex]);

  useInViewOnce(
    wrapperRef,
    () => {
      setRevealed(true);
    },
    { threshold: 0.2, disabled: !reveal }
  );

  const setHoverVars = useCallback(
    (yPx: number, scale: number) => {
      if (!hoverRef.current) return;
      hoverRef.current.style.setProperty('--hover-y', `${yPx}px`);
      hoverRef.current.style.setProperty('--hover-scale', `${scale}`);
    },
    []
  );

  useEffect(() => {
    if (!hoverRef.current) return;
    hoverRef.current.style.setProperty('--hover-y', '0px');
    hoverRef.current.style.setProperty('--hover-scale', '1');
  }, []);

  useEffect(() => {
    if (!parallaxRef.current) return;

    const baseStrength = layerStrength(parallaxLayer);
    const overlayStrength = layerStrength(overlayParallaxLayer);

    const setVars = (scrollY: number) => {
      const baseY = reduced ? 0 : clamp(scrollY * baseStrength, -clampPx, clampPx);
      const overlayY = reduced ? 0 : clamp(scrollY * overlayStrength, -clampPx, clampPx);

      parallaxRef.current?.style.setProperty('--parallax-y', `${baseY.toFixed(2)}px`);
      overlayParallaxRef.current?.style.setProperty('--parallax-y', `${overlayY.toFixed(2)}px`);
    };

    if (reduced || (baseStrength === 0 && overlayStrength === 0)) {
      setVars(0);
      return;
    }

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        setVars(window.scrollY || 0);
      });
    };

    setVars(typeof window !== 'undefined' ? window.scrollY || 0 : 0);

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [clampPx, overlayParallaxLayer, parallaxLayer, reduced]);

  const onPointerEnter = useCallback(() => {
    if (!hover || reduced) return;
    if (!canHover()) return;
    setHoverVars(motionTokens.hoverLift.translateY, motionTokens.hoverLift.scale);
  }, [hover, reduced, setHoverVars]);

  const onPointerLeave = useCallback(() => {
    if (!hover || reduced) return;
    if (!canHover()) return;
    setHoverVars(0, 1);
  }, [hover, reduced, setHoverVars]);

  const opacity = revealed ? 1 : 0;
  const revealY = reduced ? 0 : revealed ? 0 : 18;

  return (
    <div
      ref={wrapperRef}
      className={cx(
        'relative w-full overflow-hidden',
        hover ? 'transition-shadow duration-200 [transition-timing-function:var(--motion-ease)] hover:shadow-lift' : null,
        wrapperClassName
      )}
      style={{ aspectRatio }}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      <div
        ref={parallaxRef}
        className={cx('absolute inset-0')}
        style={
          {
            opacity,
            transform: `translate3d(0, calc(var(--parallax-y, 0px) + ${revealY}px), 0)`,
            transitionProperty: 'opacity, transform',
            transitionDuration: reduced ? 'var(--motion-short)' : 'var(--motion-long)',
            transitionTimingFunction: 'var(--motion-ease)',
            transitionDelay: reveal ? `${revealDelayMs}ms` : undefined,
            willChange: 'transform, opacity',
          } as React.CSSProperties
        }
      >
        <div
          ref={hoverRef}
          className="absolute inset-0"
          style={
            {
              transform: 'translate3d(0, var(--hover-y, 0px), 0) scale(var(--hover-scale, 1))',
              transitionProperty: 'transform, box-shadow',
              transitionDuration: 'var(--motion-short)',
              transitionTimingFunction: 'var(--motion-ease)',
              willChange: 'transform',
            } as React.CSSProperties
          }
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            quality={quality}
            className={cx('object-cover', className)}
            {...rest}
          />
        </div>
      </div>

      {overlay ? (
        <div
          ref={overlayParallaxRef}
          className={cx('pointer-events-none absolute inset-0', overlayClassName)}
          style={
            {
              opacity,
              transform: `translate3d(0, calc(var(--parallax-y, 0px) + ${revealY}px), 0)`,
              transitionProperty: 'opacity, transform',
              transitionDuration: reduced ? 'var(--motion-short)' : 'var(--motion-long)',
              transitionTimingFunction: 'var(--motion-ease)',
              transitionDelay: reveal ? `${revealDelayMs}ms` : undefined,
              willChange: 'transform, opacity',
            } as React.CSSProperties
          }
        >
          {overlay}
        </div>
      ) : null}
    </div>
  );
}
