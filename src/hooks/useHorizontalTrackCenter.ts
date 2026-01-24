"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { clamp, cubicBezier } from "@/utils/math";
import { tween } from "@/utils/tween";

const butterEasing = cubicBezier(0.22, 1, 0.36, 1);

export function useHorizontalTrackCenter(opts?: {
  animationMs?: number;
  easing?: (t: number) => number;
}) {
  const { animationMs = 560, easing = butterEasing } = opts ?? {};

  const prefersReducedMotion = usePrefersReducedMotion();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);

  const [tx, setTx] = useState(0);
  const txRef = useRef(0);
  const cancelRef = useRef<(() => void) | null>(null);

  const pauseFromRef = useRef<number>(0);
  const pauseToRef = useRef<number>(0);
  const pauseDurationRef = useRef<number>(0);
  const pauseStartAtRef = useRef<number>(0);
  const pauseElapsedRef = useRef<number>(0);
  const pausedRef = useRef(false);

  const onDoneRef = useRef<(() => void) | undefined>(undefined);

  const setTxSafe = (next: number) => {
    txRef.current = next;
    setTx(next);
  };

  const measure = useCallback(() => {
    // no-op: measurements are read lazily in centerIndex
    // but this exists for explicit remeasure calls.
    setTxSafe(txRef.current);
  }, []);

  const getTargetTx = useCallback((index: number) => {
    const container = containerRef.current;
    const track = trackRef.current;
    const item = itemRefs.current[index];
    if (!container || !track || !item) return txRef.current;

    const containerW = container.clientWidth;
    const trackW = track.scrollWidth;
    const itemLeft = item.offsetLeft;
    const itemW = item.offsetWidth;
    const targetCenterX = itemLeft + itemW / 2;

    const raw = containerW / 2 - targetCenterX;
    const minTx = Math.min(0, containerW - trackW);
    const maxTx = 0;
    return clamp(raw, minTx, maxTx);
  }, []);

  const snapIndex = useCallback(
    (index: number) => {
      cancelRef.current?.();
      cancelRef.current = null;
      pausedRef.current = false;
      setTxSafe(getTargetTx(index));
    },
    [getTargetTx]
  );

  const centerIndex = useCallback(
    (index: number, opts?: { onDone?: () => void }) => {
      cancelRef.current?.();
      cancelRef.current = null;
      pausedRef.current = false;

      const target = getTargetTx(index);
      if (prefersReducedMotion) {
        setTxSafe(target);
        return;
      }

      // Store tween params so pause/resume can restart from current.
      pauseFromRef.current = txRef.current;
      pauseToRef.current = target;
      pauseDurationRef.current = animationMs;
      pauseElapsedRef.current = 0;
      pauseStartAtRef.current = performance.now();
      onDoneRef.current = opts?.onDone;

      cancelRef.current = tween({
        from: pauseFromRef.current,
        to: pauseToRef.current,
        durationMs: pauseDurationRef.current,
        easing,
        cancelOnUserInput: true,
        onUpdate: (v) => setTxSafe(v),
        onDone: () => onDoneRef.current?.(),
      });
    },
    [animationMs, easing, getTargetTx, prefersReducedMotion]
  );

  const pause = useCallback(() => {
    if (pausedRef.current) return;
    if (!cancelRef.current) return;
    // Estimate elapsed time based on startAt; restart later from current.
    const now = performance.now();
    pauseElapsedRef.current = Math.max(0, Math.min(pauseDurationRef.current, now - pauseStartAtRef.current));
    cancelRef.current?.();
    cancelRef.current = null;
    pausedRef.current = true;
  }, []);

  const resume = useCallback(() => {
    if (!pausedRef.current) return;
    if (prefersReducedMotion) {
      pausedRef.current = false;
      return;
    }

    const remaining = Math.max(0, pauseDurationRef.current - pauseElapsedRef.current);
    if (remaining <= 0) {
      pausedRef.current = false;
      return;
    }

    pauseFromRef.current = txRef.current;
    pauseStartAtRef.current = performance.now();
    pausedRef.current = false;

    cancelRef.current = tween({
      from: pauseFromRef.current,
      to: pauseToRef.current,
      durationMs: remaining,
      easing,
      cancelOnUserInput: true,
      onUpdate: (v) => setTxSafe(v),
      onDone: () => onDoneRef.current?.(),
    });
  }, [easing, prefersReducedMotion]);

  useEffect(() => {
    const onResize = () => {
      // keep current item centered; caller decides which index.
      // Here we just clamp tx to current value.
      measure();
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, [measure]);

  return useMemo(
    () => ({
      containerRef,
      trackRef,
      itemRefs,
      tx,
      centerIndex,
      snapIndex,
      measure,
      prefersReducedMotion,
      pause,
      resume,
    }),
    [centerIndex, measure, prefersReducedMotion, snapIndex, tx, pause, resume]
  );
}
