'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

import { usePageVisibility } from '@/hooks/usePageVisibility';

export type CarouselDirection = -1 | 0 | 1;

export type CarouselNavKind = 'adjacent' | 'jump';

export function getNavKind(from: number, to: number) {
  return Math.abs(to - from) === 1 ? ('adjacent' satisfies CarouselNavKind) : ('jump' satisfies CarouselNavKind);
}

type UseCarouselOptions = {
  count: number;
  startIndex?: number;
  loop?: boolean;
  intervalMs?: number;
  autoplay?: boolean;
};

type UseCarouselReturn = {
  index: number;
  direction: CarouselDirection;
  navKind: CarouselNavKind;
  isPaused: boolean;
  isReducedMotion: boolean;
  setIndex: (next: number, opts?: { direction?: CarouselDirection; navKind?: CarouselNavKind; user?: boolean }) => void;
  next: () => void;
  prev: () => void;
  goTo: (target: number) => void;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
  onFocusCapture: () => void;
  onBlurCapture: (e: React.FocusEvent<HTMLElement>) => void;
  resetAutoplay: () => void;
};

function clampIndex(value: number, count: number) {
  return Math.max(0, Math.min(count - 1, value));
}

function wrapIndex(value: number, count: number) {
  if (count <= 0) return 0;
  return ((value % count) + count) % count;
}

export function useCarousel({
  count,
  startIndex = 0,
  loop = true,
  intervalMs = 5000,
  autoplay = true,
}: UseCarouselOptions): UseCarouselReturn {
  const reduced = useReducedMotion();
  const visible = usePageVisibility();

  const [index, setIndexState] = useState(() => clampIndex(startIndex, count));
  const [direction, setDirection] = useState<CarouselDirection>(0);
  const [navKind, setNavKind] = useState<CarouselNavKind>('adjacent');
  const [hovered, setHovered] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);

  const timerRef = useRef<number | null>(null);
  const lastUserActionRef = useRef<number>(0);

  const canAutoplay = autoplay && count > 1 && !reduced && visible;

  const isPaused = useMemo(() => {
    if (!canAutoplay) return true;
    return hovered || focusWithin;
  }, [canAutoplay, hovered, focusWithin]);

  const clearTimer = useCallback(() => {
    if (timerRef.current == null) return;
    window.clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);

  const scheduleNext = useCallback(() => {
    clearTimer();
    if (isPaused) return;

    timerRef.current = window.setTimeout(() => {
      setIndexState((current) => {
        const nextIndex = loop ? wrapIndex(current + 1, count) : clampIndex(current + 1, count);
        setDirection(1);
        setNavKind('adjacent');
        return nextIndex;
      });
    }, intervalMs);
  }, [clearTimer, count, intervalMs, isPaused, loop]);

  const resetAutoplay = useCallback(() => {
    lastUserActionRef.current = Date.now();
    scheduleNext();
  }, [scheduleNext]);

  const setIndex = useCallback(
    (nextIndex: number, opts?: { direction?: CarouselDirection; navKind?: CarouselNavKind; user?: boolean }) => {
      if (count <= 0) return;

      const current = index;
      const clamped = loop ? wrapIndex(nextIndex, count) : clampIndex(nextIndex, count);
      if (clamped === current) return;

      const computedDirection = (opts?.direction ?? (clamped > current ? 1 : -1)) as CarouselDirection;
      const computedNavKind = opts?.navKind ?? getNavKind(current, clamped);

      setDirection(computedNavKind === 'jump' ? 0 : computedDirection);
      setNavKind(computedNavKind);
      setIndexState(clamped);

      if (opts?.user) resetAutoplay();
    },
    [count, index, loop, resetAutoplay]
  );

  const next = useCallback(() => {
    setIndex(index + 1, { direction: 1, navKind: 'adjacent', user: true });
  }, [index, setIndex]);

  const prev = useCallback(() => {
    setIndex(index - 1, { direction: -1, navKind: 'adjacent', user: true });
  }, [index, setIndex]);

  const goTo = useCallback(
    (target: number) => {
      const kind = getNavKind(index, target);
      const dir = target === index ? 0 : ((target > index ? 1 : -1) as CarouselDirection);
      setIndex(target, { direction: dir, navKind: kind, user: true });
    },
    [index, setIndex]
  );

  useEffect(() => {
    scheduleNext();
    return () => clearTimer();
  }, [scheduleNext, clearTimer]);

  const onPointerEnter = useCallback(() => {
    setHovered(true);
    clearTimer();
  }, [clearTimer]);

  const onPointerLeave = useCallback(() => {
    setHovered(false);
    scheduleNext();
  }, [scheduleNext]);

  const onFocusCapture = useCallback(() => {
    setFocusWithin(true);
    clearTimer();
  }, [clearTimer]);

  const onBlurCapture = useCallback(
    (e: React.FocusEvent<HTMLElement>) => {
      const nextFocus = e.relatedTarget as HTMLElement | null;
      if (nextFocus && e.currentTarget.contains(nextFocus)) return;
      setFocusWithin(false);
      scheduleNext();
    },
    [scheduleNext]
  );

  return {
    index,
    direction,
    navKind,
    isPaused,
    isReducedMotion: !!reduced,
    setIndex,
    next,
    prev,
    goTo,
    onPointerEnter,
    onPointerLeave,
    onFocusCapture,
    onBlurCapture,
    resetAutoplay,
  };
}
