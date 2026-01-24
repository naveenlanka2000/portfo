"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { clamp, cubicBezier } from "@/utils/math";

const defaultEase = cubicBezier(0.16, 1, 0.3, 1);

export type MagnetHandoffState = {
  inProgress: boolean;
  current: number;
  next: number;
  t: number; // 0..1
  kind: "handoff" | "contract" | "expand";
};

export function useMagnetHandoff() {
  const [state, setState] = useState<MagnetHandoffState>({
    inProgress: false,
    current: 0,
    next: 0,
    t: 0,
    kind: "handoff",
  });

  const rafRef = useRef<number | null>(null);
  const startAtRef = useRef<number>(0);
  const durationRef = useRef<number>(340);
  const easingRef = useRef<(t: number) => number>(defaultEase);
  const pausedAtRef = useRef<number | null>(null);
  const pausedTotalRef = useRef<number>(0);

  const onDoneRef = useRef<(() => void) | undefined>(undefined);

  const stop = () => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  };

  const tick = useCallback((now: number) => {
    const elapsed = now - startAtRef.current - pausedTotalRef.current;
    const linear = clamp(elapsed / durationRef.current, 0, 1);
    const eased = easingRef.current(linear);

    setState((s) => ({ ...s, t: eased }));

    if (linear >= 1) {
      stop();
      setState((s) => ({ ...s, inProgress: false, t: 1 }));
      onDoneRef.current?.();
      return;
    }

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const cancel = useCallback(() => {
    stop();
    pausedAtRef.current = null;
    pausedTotalRef.current = 0;
    setState((s) => ({ ...s, inProgress: false, t: 0, kind: "handoff" }));
  }, []);

  const startHandoff = useCallback(
    (
      current: number,
      next: number,
      opts?: {
        durationMs?: number;
        easing?: (t: number) => number;
        kind?: "handoff" | "contract" | "expand";
        onDone?: () => void;
      }
    ) => {
      stop();
      pausedAtRef.current = null;
      pausedTotalRef.current = 0;

      durationRef.current = opts?.durationMs ?? 340;
      easingRef.current = opts?.easing ?? defaultEase;
      onDoneRef.current = opts?.onDone;

      const kind = opts?.kind ?? "handoff";

      setState({ inProgress: true, current, next, t: 0, kind });
      startAtRef.current = performance.now();
      rafRef.current = requestAnimationFrame(tick);
    },
    [tick]
  );

  const pause = useCallback(() => {
    if (pausedAtRef.current != null) return;
    if (rafRef.current == null) return;
    pausedAtRef.current = performance.now();
    stop();
  }, []);

  const resume = useCallback(() => {
    if (pausedAtRef.current == null) return;
    if (!state.inProgress) return;
    const pausedAt = pausedAtRef.current;
    pausedTotalRef.current += performance.now() - pausedAt;
    pausedAtRef.current = null;
    rafRef.current = requestAnimationFrame(tick);
  }, [state.inProgress, tick]);

  useEffect(() => () => stop(), []);

  return useMemo(
    () => ({
      handoff: state,
      startHandoff,
      cancel,
      pause,
      resume,
    }),
    [cancel, pause, resume, startHandoff, state]
  );
}
