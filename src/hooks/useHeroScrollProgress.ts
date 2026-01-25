'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { clamp } from '@/utils/math';

export type UseHeroScrollProgressOptions = {
  /** IO rootMargin, default '0px 0px -20% 0px' to finish motion before fully exiting. */
  rootMargin?: string;
  /** rAF batches scroll work by default. */
  throttle?: 'rAF' | 'none';
};

/**
 * Tracks hero scroll progress (0 → 1) relative to viewport.
 * Activates only when intersecting (IntersectionObserver), then computes progress using
 * getBoundingClientRect() on scroll/resize.
 */
export function useHeroScrollProgress(options: UseHeroScrollProgressOptions = {}) {
  const { rootMargin = '0px 0px -20% 0px', throttle = 'rAF' } = options;

  const [el, setEl] = useState<HTMLElement | null>(null);
  const [active, setActive] = useState(false);
  const [progress, setProgress] = useState(0);

  const ref = useCallback((node: HTMLElement | null) => {
    setEl(node);
  }, []);

  const optsKey = useMemo(() => `${rootMargin}|${throttle}`, [rootMargin, throttle]);

  useEffect(() => {
    if (!el) return;

    let rafId = 0;
    let removeListeners: (() => void) | null = null;

    const compute = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 0;

      // Start when hero enters (top crosses bottom of viewport), end before it fully leaves.
      // This is the same normalized mapping as useSectionScrollProgress, tuned for hero.
      const raw = (vh - rect.top) / (vh + rect.height);
      setProgress(clamp(raw, 0, 1));
    };

    const schedule = () => {
      if (throttle === 'none') {
        compute();
        return;
      }
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        compute();
      });
    };

    const onActiveChange = (isActive: boolean) => {
      setActive(isActive);

      if (!isActive) {
        if (removeListeners) {
          removeListeners();
          removeListeners = null;
        }
        if (rafId) {
          window.cancelAnimationFrame(rafId);
          rafId = 0;
        }
        return;
      }

      schedule();

      const onScroll = () => schedule();
      const onResize = () => schedule();

      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onResize);

      removeListeners = () => {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onResize);
      };
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        onActiveChange(entry.isIntersecting);
      },
      { rootMargin }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      onActiveChange(false);
    };
  }, [el, optsKey, rootMargin, throttle]);

  return { ref, progress, active };
}
