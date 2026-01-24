'use client';

import { RefObject, useEffect } from 'react';

type UseInViewOnceOptions = {
  threshold?: number | number[];
  rootMargin?: string;
  disabled?: boolean;
};

export function useInViewOnce<T extends Element>(
  ref: RefObject<T>,
  onEnter: () => void,
  { threshold = 0.2, rootMargin = '0px', disabled = false }: UseInViewOnceOptions = {}
) {
  useEffect(() => {
    if (disabled) return;
    const el = ref.current;
    if (!el) return;

    let didEnter = false;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (didEnter) return;

        if (entry.isIntersecting) {
          didEnter = true;
          onEnter();
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [disabled, onEnter, ref, rootMargin, threshold]);
}
