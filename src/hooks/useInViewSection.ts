'use client';

import { RefObject, useEffect, useMemo, useRef, useState } from 'react';

export type UseInViewSectionOptions = {
  threshold?: number | number[];
  rootMargin?: string;
  disabled?: boolean;
};

/**
 * IntersectionObserver hook for "is this element currently on screen?".
 * Designed for motion cadence controls (pause when offscreen).
 */
export function useInViewSection<T extends Element>({
  threshold = 0.1,
  rootMargin = '0px 0px -15% 0px',
  disabled = false,
}: UseInViewSectionOptions = {}) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  const opts = useMemo(() => ({ threshold, rootMargin, disabled }), [disabled, rootMargin, threshold]);

  useEffect(() => {
    if (opts.disabled) return;

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        setInView(entry.isIntersecting);
      },
      { threshold: opts.threshold, rootMargin: opts.rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [opts.disabled, opts.rootMargin, opts.threshold]);

  return { ref: ref as unknown as RefObject<T>, inView };
}
