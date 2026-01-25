'use client';

import { RefObject, useEffect, useRef } from 'react';

export type UseContinuousTapeOptions = {
  enabled: boolean;
  speedPxPerSec: number;
  direction: 'ltr' | 'rtl';
  loopLengthPx: number;
  paused?: boolean;
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

/**
 * rAF-driven continuous translateX loop.
 * Maintains x in [-loopLength, 0] for stable wrapping.
 */
export function useContinuousTape(
  trackRef: RefObject<HTMLElement>,
  { enabled, paused = false, speedPxPerSec, direction, loopLengthPx }: UseContinuousTapeOptions
) {
  const rafId = useRef(0);
  const lastT = useRef(0);
  const xRef = useRef(0);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    if (!enabled || paused || !loopLengthPx) {
      el.style.willChange = 'auto';
      return;
    }

    el.style.willChange = 'transform';

    // Initialize into stable range
    if (direction === 'ltr') {
      xRef.current = clamp(xRef.current, -loopLengthPx, 0);
      if (xRef.current === 0) xRef.current = -loopLengthPx;
    } else {
      xRef.current = clamp(xRef.current, -loopLengthPx, 0);
    }

    const tick = (t: number) => {
      if (!lastT.current) lastT.current = t;
      const dt = Math.min(0.05, Math.max(0, (t - lastT.current) / 1000));
      lastT.current = t;

      const delta = speedPxPerSec * dt;

      if (direction === 'ltr') {
        xRef.current += delta;
        if (xRef.current >= 0) xRef.current -= loopLengthPx;
      } else {
        xRef.current -= delta;
        if (xRef.current <= -loopLengthPx) xRef.current += loopLengthPx;
      }

      el.style.transform = `translate3d(${xRef.current.toFixed(2)}px, 0, 0)`;
      rafId.current = window.requestAnimationFrame(tick);
    };

    rafId.current = window.requestAnimationFrame(tick);

    return () => {
      if (rafId.current) window.cancelAnimationFrame(rafId.current);
      rafId.current = 0;
      lastT.current = 0;
      el.style.willChange = 'auto';
    };
  }, [direction, enabled, loopLengthPx, paused, speedPxPerSec, trackRef]);
}
