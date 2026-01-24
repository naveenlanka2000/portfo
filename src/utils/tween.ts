import { clamp, lerp } from "@/utils/math";

export type TweenOptions = {
  from: number;
  to: number;
  durationMs: number;
  easing?: (t: number) => number;
  onUpdate: (value: number) => void;
  onDone?: () => void;
  cancelOnUserInput?: boolean;
};

const defaultEasing = (t: number) => t;

export function tween({
  from,
  to,
  durationMs,
  easing = defaultEasing,
  onUpdate,
  onDone,
  cancelOnUserInput = false,
}: TweenOptions) {
  let rafId = 0;
  let cancelled = false;
  const start = performance.now();

  const cancel = () => {
    if (cancelled) return;
    cancelled = true;
    if (rafId) cancelAnimationFrame(rafId);
    detach?.();
  };

  let detach: (() => void) | undefined;

  if (cancelOnUserInput && typeof window !== "undefined") {
    const handler = () => cancel();
    const opts: AddEventListenerOptions = { passive: true, capture: true };
    window.addEventListener("wheel", handler, opts);
    window.addEventListener("touchstart", handler, opts);
    window.addEventListener("keydown", handler, opts);
    window.addEventListener("pointerdown", handler, opts);
    detach = () => {
      window.removeEventListener("wheel", handler, opts as any);
      window.removeEventListener("touchstart", handler, opts as any);
      window.removeEventListener("keydown", handler, opts as any);
      window.removeEventListener("pointerdown", handler, opts as any);
    };
  }

  const tick = (now: number) => {
    if (cancelled) return;
    const t = clamp((now - start) / durationMs, 0, 1);
    const v = lerp(from, to, easing(t));
    onUpdate(v);

    if (t < 1) {
      rafId = requestAnimationFrame(tick);
    } else {
      detach?.();
      onDone?.();
    }
  };

  rafId = requestAnimationFrame(tick);

  return cancel;
}
