'use client';

import { useEffect, useRef } from 'react';

export type UseShimmerTimerOptions = {
  enabled: boolean;
  intervalMs?: number;
  onTick: () => void;
  /** When enabled becomes true, trigger one sweep immediately. */
  fireOnStart?: boolean;
};

/**
 * Interval helper that starts/stops cleanly.
 * Does not attempt to "catch up" missed ticks.
 */
export function useShimmerTimer({
  enabled,
  intervalMs = 4000,
  onTick,
  fireOnStart = true,
}: UseShimmerTimerOptions) {
  const saved = useRef(onTick);
  saved.current = onTick;

  const didStart = useRef(false);

  useEffect(() => {
    if (!enabled) {
      didStart.current = false;
      return;
    }

    if (fireOnStart && !didStart.current) {
      didStart.current = true;
      saved.current();
    }

    const id = window.setInterval(() => {
      saved.current();
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [enabled, fireOnStart, intervalMs]);
}
