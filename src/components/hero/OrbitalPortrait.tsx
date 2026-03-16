'use client';

/* eslint-disable @next/next/no-img-element */
import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useId, useRef, useState } from 'react';

import { cx } from '@/lib/utils';

export type OrbitalPortraitProps = {
  src?: string;
  alt?: string;
  className?: string;
  name?: string;
  tagline?: string;
  accentColor?: string;
  badgeText?: string;
};

export function OrbitalPortrait({
  src,
  alt = 'Portrait',
  className,
  name = 'Naveen Lanka',
  tagline = 'SOFTWARE ENGINEER',
  accentColor = 'rgba(16, 185, 129, 0.75)',
  badgeText = "COME ON LET'S TALK",
}: OrbitalPortraitProps) {
  const reduced = useReducedMotion();
  const uid = useId();
  const badgePathId = `${uid}-badge-path`;

  // Keep the UI snappy: no artificial 2s wait.
  // Small minimum just avoids flicker if the image is instant.
  const MIN_LOADING_MS = reduced ? 0 : 180;
  const FINISH_MS = 250;
  const easeSoft: [number, number, number, number] = [0.16, 1, 0.3, 1];
  const badgeLoopText = `${badgeText} • `.repeat(6);
  const loaderCircumference = 2 * Math.PI * 22;

  const nameWhole = {
    hidden: reduced ? {} : { opacity: 0, y: 10, filter: 'blur(6px)' },
    show: reduced
      ? {}
      : {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          transition: { duration: 0.55, ease: easeSoft, delay: 0.08 },
        },
  } as const;

  const [phase, setPhase] = useState<'loading' | 'finishing' | 'done'>(() => (src ? 'loading' : 'loading'));
  const [imageLoaded, setImageLoaded] = useState(false);
  const [loaderFilled, setLoaderFilled] = useState(() => reduced);
  const [imageError, setImageError] = useState(false);
  const [processedSrc, setProcessedSrc] = useState<string | null>(null);
  const processedUrlRef = useRef<string | null>(null);
  const loadStartRef = useRef<number>(0);

  const doneTimerRef = useRef<number | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const clearTimers = () => {
    if (doneTimerRef.current !== null) window.clearTimeout(doneTimerRef.current);
    doneTimerRef.current = null;
  };

  useEffect(() => {
    // If the image source changes, return to loading.
    clearTimers();
    setPhase('loading');
    loadStartRef.current = typeof performance !== 'undefined' ? performance.now() : Date.now();
    setImageLoaded(false);
    setLoaderFilled(reduced);
    setImageError(false);
    setProcessedSrc(null);
    if (processedUrlRef.current) {
      URL.revokeObjectURL(processedUrlRef.current);
      processedUrlRef.current = null;
    }
  }, [src, reduced]);

  useEffect(() => {
    if (reduced) setLoaderFilled(true);
  }, [reduced]);

  useEffect(() => {
    const img = imageRef.current;
    if (!img) return;
    if (img.complete && img.naturalWidth > 0) {
      setImageLoaded(true);
    }
  }, [processedSrc, src]);

  useEffect(() => {
    if (phase !== 'loading') return;
    if (reduced) return;
    if (!imageLoaded && !imageError) return;

    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const elapsed = Math.max(0, now - (loadStartRef.current || now));
    const delay = Math.max(0, MIN_LOADING_MS - elapsed);
    const t = window.setTimeout(() => setLoaderFilled(true), delay);
    return () => window.clearTimeout(t);
  }, [phase, reduced, imageLoaded, imageError, MIN_LOADING_MS]);

  useEffect(() => {
    if (phase !== 'loading') return;
    if (!loaderFilled) return;
    if (!imageLoaded && !imageError) return;
    setPhase('finishing');
  }, [phase, loaderFilled, imageLoaded, imageError]);

  useEffect(() => {
    if (!src) return;
    if (typeof window === 'undefined') return;
    if (imageError) return;

    // This processing is purely visual polish; keep it from hurting LCP.
    const cores = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency ?? 8 : 8;
    const deviceMemory = typeof navigator !== 'undefined' ? (navigator as any).deviceMemory ?? 8 : 8;
    const shouldProcess = !reduced;
    const maxSide = cores >= 6 && deviceMemory >= 6 ? 900 : 520;
    if (!shouldProcess) return;

    let cancelled = false;

    const isBgLike = (r: number, g: number, b: number, a: number) => {
      if (a < 235) return false;
      const drg = Math.abs(r - g);
      const dgb = Math.abs(g - b);
      const bright = (r + g + b) / 3;
      // Target light, low-saturation pixels (typical checkerboard colors).
      return bright > 175 && drg < 18 && dgb < 18;
    };

    const load = async () => {
      try {
        const img = new window.Image();
        img.decoding = 'async';
        img.loading = 'eager';
        img.src = src;

        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error('failed to load image'));
        });

        if (cancelled) return;

        const w0 = Math.max(1, img.naturalWidth || img.width);
        const h0 = Math.max(1, img.naturalHeight || img.height);

        // Downscale for processing to reduce CPU + memory cost.
        const scale = Math.min(1, maxSide / Math.max(w0, h0));
        const w = Math.max(1, Math.round(w0 * scale));
        const h = Math.max(1, Math.round(h0 * scale));
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;

        ctx.drawImage(img, 0, 0, w, h);
        const imageData = ctx.getImageData(0, 0, w, h);
        const d = imageData.data;

        const visited = new Uint8Array(w * h);
        const qx = new Int32Array(w * h);
        const qy = new Int32Array(w * h);
        let qh = 0;
        let qt = 0;

        const push = (x: number, y: number) => {
          const idx = y * w + x;
          if (visited[idx]) return;
          visited[idx] = 1;
          qx[qt] = x;
          qy[qt] = y;
          qt++;
        };

        // Seed from all edges.
        for (let x = 0; x < w; x++) {
          push(x, 0);
          push(x, h - 1);
        }
        for (let y = 0; y < h; y++) {
          push(0, y);
          push(w - 1, y);
        }

        const tryClear = (x: number, y: number) => {
          const p = (y * w + x) * 4;
          const r = d[p];
          const g = d[p + 1];
          const b = d[p + 2];
          const a = d[p + 3];
          if (!isBgLike(r, g, b, a)) return false;
          d[p + 3] = 0;
          return true;
        };

        while (qh < qt) {
          const x = qx[qh];
          const y = qy[qh];
          qh++;

          // Only flood through background-like pixels.
          if (!tryClear(x, y)) continue;

          if (x > 0) push(x - 1, y);
          if (x < w - 1) push(x + 1, y);
          if (y > 0) push(x, y - 1);
          if (y < h - 1) push(x, y + 1);
        }

        // Feather hard edges a touch to reduce jaggies.
        for (let y = 1; y < h - 1; y++) {
          for (let x = 1; x < w - 1; x++) {
            const p = (y * w + x) * 4;
            const a = d[p + 3];
            if (a === 0) continue;
            const left = d[p - 4 + 3];
            const right = d[p + 4 + 3];
            const up = d[p - w * 4 + 3];
            const down = d[p + w * 4 + 3];
            if (left === 0 || right === 0 || up === 0 || down === 0) {
              d[p + 3] = Math.min(a, 230);
            }
          }
        }

        ctx.putImageData(imageData, 0, 0);

        const blob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob((b) => resolve(b), 'image/png');
        });
        if (!blob || cancelled) return;

        if (processedUrlRef.current) URL.revokeObjectURL(processedUrlRef.current);
        processedUrlRef.current = URL.createObjectURL(blob);
        setProcessedSrc(processedUrlRef.current);
      } catch {
        // If processing fails, just fall back to the original src.
      }
    };

    // Defer heavy processing off the critical path.
    const idle = (window as any).requestIdleCallback as undefined | ((cb: () => void, opts?: { timeout: number }) => number);
    const cancelIdle = (window as any).cancelIdleCallback as undefined | ((id: number) => void);
    let idleId: number | null = null;
    let timeoutId: number | null = null;

    if (idle) {
      idleId = idle(() => {
        if (!cancelled) void load();
      }, { timeout: 2500 });
    } else {
      timeoutId = window.setTimeout(() => {
        if (!cancelled) void load();
      }, 0);
    }

    return () => {
      cancelled = true;
      if (idleId != null && cancelIdle) cancelIdle(idleId);
      if (timeoutId != null) window.clearTimeout(timeoutId);
    };
  }, [src, imageError, reduced]);

  useEffect(() => {
    if (phase !== 'finishing') return;
    clearTimers();
    doneTimerRef.current = window.setTimeout(() => {
      doneTimerRef.current = null;
      setPhase('done');
    }, FINISH_MS);
    return () => {
      clearTimers();
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== 'loading') return;

    const fallback = window.setTimeout(() => {
      setLoaderFilled(true);
      setImageLoaded(true);
    }, 1800);

    return () => window.clearTimeout(fallback);
  }, [phase]);

  return (
    <div
      className={cx(
        'relative h-full w-full',
        'flex items-start justify-center',
        className
      )}
    >
      <div className="relative w-full max-w-[560px] aspect-[4/5]">
        <div className="relative h-full w-full overflow-hidden rounded-[32px] bg-[#f4f4f2]">
          {/* Paper grain */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-multiply [background-image:radial-gradient(rgba(0,0,0,0.7)_0.6px,transparent_0.6px)] [background-size:3px_3px]"
          />

          {/* Soft vignette */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.10),transparent_52%),radial-gradient(circle_at_50%_78%,rgba(0,0,0,0.06),transparent_58%)]"
          />

          {/* Arch backdrop */}
          <div
            aria-hidden
            className="absolute left-1/2 top-[9%] h-[66%] w-[78%] -translate-x-1/2 rounded-t-[999px] rounded-b-[64px] bg-gradient-to-b from-[#cdd8d9]/95 via-[#dbe3e3]/75 to-slate-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]"
          />

          {/* Ground shadow behind subject */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[58%] h-[18%] w-[62%] -translate-x-1/2 rounded-full bg-black/20 blur-2xl"
          />

          {/* Bottom fade (keeps copy area clean) */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[30] h-[54%] bg-gradient-to-t from-white via-white/95 to-transparent"
          />

          {/* Full-card loader (centered) */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-[50] flex items-center justify-center"
            initial={false}
            animate={phase === 'done' ? { opacity: 0, scale: 0.98 } : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, ease: easeSoft }}
          >
            <div className="relative h-20 w-20">
              {/* Smooth fill ring */}
              <motion.svg className="absolute inset-0" viewBox="0 0 64 64" fill="none">
                <motion.circle
                  key={src ?? 'loader'}
                  cx="32"
                  cy="32"
                  r="22"
                  stroke="rgba(16, 185, 129, 0.92)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={loaderCircumference}
                  initial={reduced ? { strokeDashoffset: 0 } : { strokeDashoffset: loaderCircumference }}
                  animate={phase === 'done' ? { strokeDashoffset: loaderCircumference } : { strokeDashoffset: 0 }}
                  transition={
                    reduced
                      ? undefined
                      : phase === 'done'
                        ? { duration: 0.25, ease: easeSoft }
                        : { duration: MIN_LOADING_MS / 1000, ease: 'linear' }
                  }
                  onAnimationComplete={() => {
                    // No-op: loader completion is driven by image load now.
                  }}
                  style={{ transformOrigin: '32px 32px', transform: 'rotate(-90deg)' }}
                />
              </motion.svg>

              {/* Black monogram circle */}
              <div className="absolute left-1/2 top-1/2 grid h-[46px] w-[46px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-neutral-950 text-[20px] font-extrabold text-white shadow-[0_18px_38px_rgba(0,0,0,0.24)]">
                N
              </div>
            </div>
          </motion.div>

          {/* Portrait */}
          <div className="absolute left-1/2 top-[10%] md:top-[13%] z-[10] w-[74%] -translate-x-1/2">
            <motion.div
              initial={false}
              animate={
                phase === 'done'
                  ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                  : { opacity: 0, y: 18, filter: 'blur(10px)' }
              }
              transition={{ duration: 1.15, ease: easeSoft }}
            >
              {imageError ? (
                <div className="grid aspect-[4/5] w-full place-items-center rounded-3xl bg-black/5 text-sm font-medium tracking-wide text-neutral-900">
                  NL
                </div>
              ) : (
                <img
                  ref={imageRef}
                  src={processedSrc ?? src}
                  alt={alt}
                  decoding="async"
                  loading="eager"
                  onLoad={() => setImageLoaded(true)}
                  onError={() => {
                    setImageError(true);
                    setImageLoaded(true);
                  }}
                  className="w-full select-none object-contain [filter:grayscale(1)_contrast(1.14)_brightness(0.98)] drop-shadow-[0_46px_64px_rgba(0,0,0,0.24)]"
                  style={{
                    WebkitMaskImage: 'linear-gradient(to bottom, black 84%, transparent 100%)',
                    maskImage: 'linear-gradient(to bottom, black 84%, transparent 100%)',
                  }}
                />
              )}
            </motion.div>
          </div>

          {/* Top-right badge (circle + curved text) */}
          <motion.svg
            aria-hidden
            className="pointer-events-none absolute right-[10%] top-[17%] z-[25] h-[88px] w-[88px]"
            viewBox="0 0 100 100"
            initial={false}
            animate={phase === 'done' ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.9, ease: easeSoft, delay: 0.15 }}
          >
            <defs>
              <path id={badgePathId} d="M 50,50 m -36,0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0" />
            </defs>

            <circle cx="50" cy="50" r="16" fill="none" stroke={accentColor} strokeWidth="3" opacity="0.8" />

            <text
              fill="rgba(0,0,0,0.7)"
              style={{ fontSize: 8.6, letterSpacing: '0.34em', textTransform: 'uppercase' }}
            >
              <motion.textPath
                href={`#${badgePathId}`}
                startOffset="0%"
                textAnchor="start"
                animate={reduced || phase !== 'done' ? undefined : { startOffset: ['0%', '100%'] }}
                transition={reduced ? undefined : { repeat: Infinity, duration: 16, ease: 'linear' }}
              >
                {badgeLoopText}
              </motion.textPath>
            </text>
          </motion.svg>

          {/* Bottom copy */}
          <div className="absolute inset-x-0 bottom-[7%] z-[40] px-6 text-center">
            {reduced ? (
              <div
                className={
                  [
                    'whitespace-nowrap font-[family:var(--font-display)] text-[clamp(32px,5.7vw,48px)] font-bold leading-[0.95] tracking-tight',
                    'bg-clip-text text-transparent [-webkit-text-fill-color:transparent]',
                    'bg-[linear-gradient(110deg,#000000_38%,#6f6f6f_48%,#b3b3b3_50%,#6f6f6f_52%,#000000_62%)]',
                    'bg-[length:200%_100%]',
                    'motion-safe:animate-shimmer motion-reduce:animate-none',
                  ].join(' ')
                }
              >
                {name}
              </div>
            ) : (
              <motion.div
                className={
                  [
                    'whitespace-nowrap font-[family:var(--font-display)] text-[clamp(32px,5.7vw,48px)] font-bold leading-[0.95] tracking-tight',
                    'bg-clip-text text-transparent [-webkit-text-fill-color:transparent]',
                    'bg-[linear-gradient(110deg,#000000_38%,#6f6f6f_48%,#b3b3b3_50%,#6f6f6f_52%,#000000_62%)]',
                    'bg-[length:200%_100%]',
                    'motion-safe:animate-shimmer motion-reduce:animate-none',
                  ].join(' ')
                }
                variants={nameWhole}
                initial="hidden"
                animate={phase === 'done' ? 'show' : 'hidden'}
              >
                {name}
              </motion.div>
            )}

            <motion.div
              className="mt-3 text-[11px] font-medium tracking-[0.34em] text-neutral-600"
              initial={reduced ? false : { opacity: 0, y: 6 }}
              animate={
                reduced
                  ? undefined
                  : phase === 'done'
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 6 }
              }
              transition={reduced ? undefined : { duration: 0.7, ease: easeSoft, delay: 0.35 }}
            >
              {tagline}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
