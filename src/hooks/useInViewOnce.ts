'use client';

import { RefObject, useEffect, useMemo, useRef, useState } from 'react';

type UseInViewOnceOptions = {
  threshold?: number | number[];
  rootMargin?: string;
  disabled?: boolean;
};

export function useInViewOnce<T extends Element>(
  ref: RefObject<T>,
  onEnter: () => void,
  options?: UseInViewOnceOptions
): void;
export function useInViewOnce<T extends Element>(
  options?: UseInViewOnceOptions
): { ref: RefObject<T>; inViewOnce: boolean };
export function useInViewOnce<T extends Element>(
  a?: RefObject<T> | UseInViewOnceOptions,
  b?: (() => void) | UseInViewOnceOptions,
  c?: UseInViewOnceOptions
) {
  const isRefMode = !!a && typeof (a as RefObject<T>).current !== 'undefined' && typeof b === 'function';

  const { threshold, rootMargin, disabled } = useMemo(() => {
    const opts = (isRefMode ? c : (a as UseInViewOnceOptions)) ?? {};
    return {
      threshold: opts.threshold ?? 0.2,
      rootMargin: opts.rootMargin ?? '0px',
      disabled: opts.disabled ?? false,
    };
  }, [a, c, isRefMode]);

  const localRef = useRef<T | null>(null);
  const ref = (isRefMode ? (a as RefObject<T>) : (localRef as unknown as RefObject<T>)) as RefObject<T>;
  const onEnter = (isRefMode ? (b as () => void) : undefined) as (() => void) | undefined;

  const [inViewOnce, setInViewOnce] = useState(false);

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
          setInViewOnce(true);
          onEnter?.();
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [disabled, onEnter, ref, rootMargin, threshold]);

  if (isRefMode) return;
  return { ref, inViewOnce };
}
