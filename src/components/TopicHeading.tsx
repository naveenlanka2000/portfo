'use client';

import type { CSSProperties, ElementType } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

import { cx } from '@/lib/utils';
import { useInViewSection } from '@/hooks/useInViewSection';
import { usePageVisibility } from '@/hooks/usePageVisibility';
import { useShimmerTimer } from '@/hooks/useShimmerTimer';

function canHover() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia?.('(hover: hover) and (pointer: fine)')?.matches ?? false;
}

export type TopicHeadingProps<TAs extends ElementType = 'h2'> = {
  as?: TAs;
  title: string;
  subtitle?: string;
  className?: string;
  tone?: 'light' | 'dark';
  autoCadenceMs?: number;
  shimmerDurationMs?: number;
  replayOnHover?: boolean;
  cooldownMs?: number;
  id?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  titleStyle?: CSSProperties;
};

export function TopicHeading<TAs extends ElementType = 'h2'>({
  as,
  title,
  subtitle,
  className,
  tone = 'light',
  autoCadenceMs = 4000,
  shimmerDurationMs = 1200,
  replayOnHover = true,
  cooldownMs = 1000,
  id,
  titleClassName,
  subtitleClassName,
  titleStyle,
}: TopicHeadingProps<TAs>) {
  const Tag = (as ?? 'h2') as ElementType;
  const reduced = useReducedMotion();
  const pageVisible = usePageVisibility();

  const { ref, inView } = useInViewSection<HTMLHeadingElement>({ threshold: 0.15 });

  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const lastPlayedAt = useRef(0);

  const prevInView = useRef(false);
  const prevPageVisible = useRef(true);

  const timerEnabled = useMemo(() => {
    if (reduced) return false;
    if (!pageVisible) return false;
    if (!inView) return false;
    return true;
  }, [inView, pageVisible, reduced]);

  const startSweep = useCallback(() => {
    const now = Date.now();
    if (isPlaying) return;
    if (isHovered || isFocused) return;
    if (now - lastPlayedAt.current < cooldownMs) return;

    lastPlayedAt.current = now;
    setIsPlaying(true);

    window.setTimeout(() => {
      setIsPlaying(false);
    }, shimmerDurationMs + 60);
  }, [cooldownMs, isFocused, isHovered, isPlaying, shimmerDurationMs]);

  const startEmphasis = useCallback(() => {
    const now = Date.now();
    if (isPlaying) return;
    if (now - lastPlayedAt.current < cooldownMs) return;
    lastPlayedAt.current = now;
    setIsPlaying(true);
    window.setTimeout(() => setIsPlaying(false), 220);
  }, [cooldownMs, isPlaying]);

  const start = useCallback(() => {
    if (reduced) {
      startEmphasis();
      return;
    }
    startSweep();
  }, [reduced, startEmphasis, startSweep]);

  useShimmerTimer({
    enabled: timerEnabled,
    intervalMs: autoCadenceMs,
    onTick: startSweep,
    fireOnStart: true,
  });

  useEffect(() => {
    if (!reduced) {
      prevInView.current = inView;
      prevPageVisible.current = pageVisible;
      return;
    }

    const becameVisible = (!prevInView.current && inView) || (!prevPageVisible.current && pageVisible);
    prevInView.current = inView;
    prevPageVisible.current = pageVisible;

    if (becameVisible && inView && pageVisible) {
      startEmphasis();
    }
  }, [inView, pageVisible, reduced, startEmphasis]);

  const onMouseEnter = useCallback(() => {
    if (!canHover()) return;
    setIsHovered(true);
    if (!replayOnHover) return;
    start();
  }, [replayOnHover, start]);

  const onMouseLeave = useCallback(() => {
    if (!canHover()) return;
    setIsHovered(false);
  }, []);

  const onFocus = useCallback(() => {
    setIsFocused(true);
    if (!replayOnHover) return;
    start();
  }, [replayOnHover, start]);

  const onBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  const onAnimationEnd = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const play = isPlaying;
  const isDark = tone === 'dark';

  return (
    <div className={cx('space-y-3', className)}>
      <Tag
        id={id}
        ref={ref}
        tabIndex={replayOnHover ? 0 : undefined}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onFocus={onFocus}
        onBlur={onBlur}
        onAnimationEnd={onAnimationEnd}
        style={{
          ['--iron-shimmer-duration' as unknown as string]: `${shimmerDurationMs}ms`,
          ...(titleStyle ?? {}),
        }}
        className={cx(
          'text-4xl font-semibold tracking-tight md:text-5xl',
          isDark ? 'text-white' : 'text-neutral-900',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--ring))] focus-visible:ring-offset-4',
          isDark ? 'focus-visible:ring-offset-black' : 'focus-visible:ring-offset-white',
          reduced && play ? 'iron-emphasis' : undefined,
          !reduced && play ? 'iron-shimmer-play' : undefined,
          titleClassName
        )}
      >
        <span className="iron-shimmer-text">{title}</span>
      </Tag>

      {subtitle ? (
        <p
          className={cx(
            'text-base leading-relaxed md:text-lg',
            isDark ? 'text-white/70' : 'text-neutral-600',
            subtitleClassName
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
