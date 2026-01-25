export type ParallaxClamp = {
  minPx?: number;
  maxPx?: number;
};

export type ParallaxMapOptions = {
  /** Normalized progress 0..1 */
  progress: number;
  /** Viewport height in px */
  viewportHeight: number;
  /** Layer strength multiplier (e.g., 0.18..0.65) */
  strength: number;
  /** Clamp limits, default [-24, +72] */
  clamp?: ParallaxClamp;
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

/**
 * Linear, mechanical parallax mapping.
 * translateY(px) = clamp(p * (vh * strength), min=-24, max=+72)
 */
export function parallaxTranslateY({
  progress,
  viewportHeight,
  strength,
  clamp: clampOpts,
}: ParallaxMapOptions) {
  const minPx = clampOpts?.minPx ?? -24;
  const maxPx = clampOpts?.maxPx ?? 72;

  const p = clamp(progress, 0, 1);
  const vh = Math.max(0, viewportHeight);
  const raw = p * (vh * strength);
  return clamp(raw, minPx, maxPx);
}

export type ParallaxScaleOptions = {
  /** Normalized progress 0..1 */
  progress: number;
  /** Optional micro scale amount (0 disables) */
  amount?: number;
};

/**
 * Optional micro-accent scale (disabled by default). Linear, no easing.
 * Returns 1..(1+amount)
 */
export function parallaxScale({ progress, amount = 0 }: ParallaxScaleOptions) {
  if (!amount) return 1;
  const p = clamp(progress, 0, 1);
  return 1 + amount * p;
}
