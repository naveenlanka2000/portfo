import { clamp, cubicBezier, lerp } from "@/utils/math";

export type ScrollToSmoothOptions = {
  durationMs?: number;
  easing?: (t: number) => number;
  signal?: AbortSignal;
};

const defaultEasing = cubicBezier(0.2, 0.0, 0.2, 1.0);

export function scrollToSmooth(
  el: HTMLElement,
  left: number,
  { durationMs = 520, easing = defaultEasing, signal }: ScrollToSmoothOptions = {}
) {
  const startLeft = el.scrollLeft;
  const endLeft = left;
  const delta = endLeft - startLeft;

  if (!Number.isFinite(startLeft) || !Number.isFinite(endLeft) || Math.abs(delta) < 1) {
    el.scrollLeft = endLeft;
    return { cancel: () => {} };
  }

  let rafId = 0;
  const start = performance.now();

  const tick = (now: number) => {
    if (signal?.aborted) return;
    const t = clamp((now - start) / durationMs, 0, 1);
    const eased = easing(t);
    el.scrollLeft = lerp(startLeft, endLeft, eased);
    if (t < 1) rafId = requestAnimationFrame(tick);
  };

  rafId = requestAnimationFrame(tick);

  return {
    cancel: () => {
      if (rafId) cancelAnimationFrame(rafId);
    },
  };
}
