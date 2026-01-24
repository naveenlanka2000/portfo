"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { clamp } from "@/utils/math";

export type UseProgressEngineReturn = {
  progress: number; // 0..1
  isPaused: boolean;
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
};

export function useProgressEngine(durationMs: number, opts?: { onComplete?: () => void }) {
  const onCompleteRef = useRef(opts?.onComplete);
  onCompleteRef.current = opts?.onComplete;

  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const rafRef = useRef<number | null>(null);
  const startAtRef = useRef<number>(0);
  const pausedAtRef = useRef<number | null>(null);
  const pausedTotalRef = useRef<number>(0);

  const stopRaf = () => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  };

  const tick = useCallback(
    (now: number) => {
      const elapsed = now - startAtRef.current - pausedTotalRef.current;
      const next = clamp(elapsed / durationMs, 0, 1);
      setProgress(next);

      if (next >= 1) {
        stopRaf();
        setIsRunning(false);
        setIsPaused(false);
        onCompleteRef.current?.();
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    },
    [durationMs]
  );

  const start = useCallback(() => {
    stopRaf();
    pausedAtRef.current = null;
    pausedTotalRef.current = 0;
    setProgress(0);
    setIsRunning(true);
    setIsPaused(false);
    startAtRef.current = performance.now();
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  const pause = useCallback(() => {
    if (!isRunning || isPaused) return;
    setIsPaused(true);
    pausedAtRef.current = performance.now();
    stopRaf();
  }, [isPaused, isRunning]);

  const resume = useCallback(() => {
    if (!isRunning || !isPaused) return;
    const pausedAt = pausedAtRef.current;
    if (pausedAt != null) pausedTotalRef.current += performance.now() - pausedAt;
    pausedAtRef.current = null;
    setIsPaused(false);
    rafRef.current = requestAnimationFrame(tick);
  }, [isPaused, isRunning, tick]);

  const reset = useCallback(() => {
    stopRaf();
    pausedAtRef.current = null;
    pausedTotalRef.current = 0;
    setProgress(0);
    setIsPaused(false);
    setIsRunning(false);
  }, []);

  useEffect(() => () => stopRaf(), []);

  return {
    progress,
    isPaused,
    isRunning,
    start,
    pause,
    resume,
    reset,
  } satisfies UseProgressEngineReturn;
}
