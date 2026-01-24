/** Clamp a number to the inclusive range [min, max]. */
export function clamp(n: number, min = 0, max = 1): number {
  return Math.max(min, Math.min(max, n));
}

/** Linear interpolation between a and b using t in [0, 1]. */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Cubic-bezier easing function generator.
 * Returns a function mapping t in [0,1] to eased progress in [0,1].
 */
export function cubicBezier(p1x: number, p1y: number, p2x: number, p2y: number) {
  const cx = 3 * p1x;
  const bx = 3 * (p2x - p1x) - cx;
  const ax = 1 - cx - bx;

  const cy = 3 * p1y;
  const by = 3 * (p2y - p1y) - cy;
  const ay = 1 - cy - by;

  const sampleX = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sampleY = (t: number) => ((ay * t + by) * t + cy) * t;
  const sampleDerivX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;

  const solveTForX = (x: number) => {
    let t = x;
    for (let i = 0; i < 8; i++) {
      const xEst = sampleX(t) - x;
      const dEst = sampleDerivX(t);
      if (Math.abs(xEst) < 1e-6) return t;
      if (Math.abs(dEst) < 1e-6) break;
      t = t - xEst / dEst;
    }

    let t0 = 0;
    let t1 = 1;
    t = x;
    while (t0 < t1) {
      const xEst = sampleX(t);
      if (Math.abs(xEst - x) < 1e-6) return t;
      if (x > xEst) t0 = t;
      else t1 = t;
      t = (t1 + t0) / 2;
    }
    return t;
  };

  return (t: number) => {
    const x = clamp(t, 0, 1);
    const solved = solveTForX(x);
    return clamp(sampleY(solved), 0, 1);
  };
}
