'use client';

import { RefObject, useEffect, useRef } from 'react';

type TargetLike = Window | Document | HTMLElement;

export function useEventListener<K extends keyof WindowEventMap>(
  target: TargetLike | RefObject<HTMLElement> | null,
  type: K,
  listener: (event: WindowEventMap[K]) => void,
  options?: AddEventListenerOptions
) {
  const listenerRef = useRef(listener);

  useEffect(() => {
    listenerRef.current = listener;
  }, [listener]);

  useEffect(() => {
    const resolvedTarget: TargetLike | null =
      target && typeof (target as RefObject<HTMLElement>).current !== 'undefined'
        ? ((target as RefObject<HTMLElement>).current ?? null)
        : (target as TargetLike | null);

    if (!resolvedTarget?.addEventListener) return;

    const handler = (event: Event) => {
      listenerRef.current(event as WindowEventMap[K]);
    };

    resolvedTarget.addEventListener(type, handler as EventListener, options);
    return () => resolvedTarget.removeEventListener(type, handler as EventListener, options);
  }, [target, type, options]);
}
