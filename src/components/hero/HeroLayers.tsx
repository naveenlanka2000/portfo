'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';

import { cx } from '@/lib/utils';
import { tagToBrandKind } from '@/lib/brand';
import { motionTokens } from '@/lib/motion-tokens';
import { useHeroScrollProgress } from '@/hooks/useHeroScrollProgress';
import { parallaxTranslateY } from '@/lib/motion/parallax';
import { AnimatedHeadline } from '@/components/AnimatedHeadline';
import { OrbitalPortrait } from '@/components/hero/OrbitalPortrait';
import { BrandIcon } from '@/components/sections/BrandIcon';

function canUseCursorLight() {
  if (typeof window === 'undefined') return false;
  const fine = window.matchMedia?.('(hover: hover) and (pointer: fine)')?.matches ?? false;
  return fine;
}

export type HeroLayersProps = {
  title: string;
  subtitle?: string;
  ctaPrimary?: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
  portraitSrc?: string;
  portraitAlt?: string;
  assets: {
    backgroundSrc: string;
    midAccentSrc?: string;
    primarySrc: string;
    foregroundAccentSrc?: string;
  };
  strengths?: {
    bg?: number;
    mid?: number;
    fg?: number;
    hi?: number;
  };
  enableCursorLight?: boolean;
  className?: string;
};

export function HeroLayers({
  title,
  subtitle,
  ctaPrimary,
  ctaSecondary,
  portraitSrc,
  portraitAlt,
  assets,
  strengths,
  enableCursorLight = true,
  className,
}: HeroLayersProps) {
  const reduced = useReducedMotion();

  const focusItems = useMemo(
    () => ['Secure APIs', 'Auth & Validation', 'Database Design', 'Performance', 'Clean UI'] as const,
    []
  );
  const stackItems = useMemo(() => ['Java', 'Python', 'JavaScript', 'TypeScript', 'React', 'MySQL', 'SQL'], []);

  const { ref: heroRef, progress, active } = useHeroScrollProgress({ rootMargin: '0px 0px -20% 0px' });

  const [vh, setVh] = useState(0);
  useEffect(() => {
    const update = () => setVh(window.innerHeight || 0);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const sBg = strengths?.bg ?? 0.18;

  const yBg = useMemo(() => {
    if (reduced) return 0;
    return parallaxTranslateY({ progress, viewportHeight: vh, strength: sBg, clamp: { minPx: -24, maxPx: 72 } });
  }, [progress, reduced, sBg, vh]);

  const [hasEntered, setHasEntered] = useState(false);
  useEffect(() => {
    if (!active) return;
    setHasEntered(true);
  }, [active]);

  useEffect(() => {
    const fallback = window.setTimeout(() => {
      setHasEntered(true);
    }, 200);

    return () => window.clearTimeout(fallback);
  }, []);

  // Optional cursor lighting (desktop only), updates CSS vars via rAF.
  const mediaRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef(0);
  const pendingRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (reduced) return;
    if (!enableCursorLight) return;
    if (!canUseCursorLight()) return;

    const el = mediaRef.current;
    if (!el) return;

    const setVars = (x: number, y: number) => {
      el.style.setProperty('--hero-cx', `${x.toFixed(3)}`);
      el.style.setProperty('--hero-cy', `${y.toFixed(3)}`);
    };

    const onMove = (evt: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const px = (evt.clientX - rect.left) / Math.max(1, rect.width);
      const py = (evt.clientY - rect.top) / Math.max(1, rect.height);

      // Normalize to [-1, 1]
      const nx = (px - 0.5) * 2;
      const ny = (py - 0.5) * 2;

      pendingRef.current = { x: nx, y: ny };
      if (rafRef.current) return;

      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = 0;
        const next = pendingRef.current;
        if (!next) return;

        // Cap movement
        setVars(Math.max(-1, Math.min(1, next.x)), Math.max(-1, Math.min(1, next.y)));
      });
    };

    const onLeave = () => {
      pendingRef.current = { x: 0, y: 0 };
      if (rafRef.current) return;
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = 0;
        setVars(0, 0);
      });
    };

    setVars(0, 0);

    el.addEventListener('pointermove', onMove, { passive: true });
    el.addEventListener('pointerleave', onLeave, { passive: true });

    return () => {
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, [enableCursorLight, reduced]);

  const contentMotion = reduced
    ? { initial: { opacity: 1 }, animate: { opacity: 1 } }
    : { initial: { opacity: 0 }, animate: { opacity: hasEntered ? 1 : 0 } };

  return (
    <section
      ref={heroRef}
      className={cx(
        'relative overflow-hidden rounded-none bg-transparent sm:rounded-[28px] sm:bg-neutral-100',
        className
      )}
    >
      <div className="grid gap-10 px-7 py-14 md:grid-cols-12 md:items-start md:px-12 md:py-20">
        <div className="md:col-span-7">
          <motion.div
            initial={contentMotion.initial}
            animate={contentMotion.animate}
            transition={{ duration: 0.6, ease: motionTokens.ease }}
          >
            <p className="text-sm font-medium text-neutral-700">Software Engineer • Backend & Web • AI-curious</p>
            <AnimatedHeadline
              play={hasEntered}
              className="mt-4 text-pretty font-sans text-4xl font-bold tracking-tight text-neutral-900 md:text-6xl"
            >
              {title}
            </AnimatedHeadline>
            {subtitle ? (
              <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-neutral-600 md:text-lg">
                {subtitle}
              </p>
            ) : null}

            {(ctaPrimary || ctaSecondary) ? (
              <div className="mt-8 flex flex-nowrap items-center gap-3">
                {ctaPrimary ? (
                  <Link
                    href={ctaPrimary.href}
                    className="inline-flex min-h-11 flex-1 items-center justify-center whitespace-nowrap rounded-full bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white shadow-soft transition-transform duration-200 active:scale-95 sm:flex-none sm:px-6 sm:py-3"
                  >
                    {ctaPrimary.label}
                  </Link>
                ) : null}
                {ctaSecondary ? (
                  <Link
                    href={ctaSecondary.href}
                    className="inline-flex min-h-11 flex-1 items-center justify-center whitespace-nowrap rounded-full border border-black bg-white px-4 py-2.5 text-sm font-medium text-neutral-900 shadow-soft transition-all duration-75 hover:bg-black hover:text-white hover:border-black active:scale-95 sm:flex-none sm:px-6 sm:py-3"
                  >
                    {ctaSecondary.label}
                  </Link>
                ) : null}
              </div>
            ) : null}

            <dl className="mt-10 grid grid-cols-2 gap-6 md:max-w-lg">
              <div>
                <dt className="text-xs font-medium text-neutral-500">Focus</dt>
                <dd className="mt-1">
                  <div className="text-sm font-medium text-neutral-900">Backend APIs + web apps</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {focusItems.map((item) => (
                      <span
                        key={item}
                        className="inline-flex items-center rounded-full bg-white/70 px-2.5 py-1 text-[12px] font-medium text-neutral-800 ring-1 ring-black/5"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-neutral-500">Stack</dt>
                <dd className="mt-2 flex flex-wrap gap-2">
                  {stackItems.map((label) => (
                    <span
                      key={label}
                      className={
                        [
                          'group/stack inline-flex items-center gap-2 rounded-full bg-white/70 px-2.5 py-1',
                          'text-sm font-medium text-neutral-900 ring-1 ring-black/5',
                          'transition-[background-color] duration-200 ease-out',
                          'hover:bg-white',
                        ].join(' ')
                      }
                    >
                      <BrandIcon
                        kind={tagToBrandKind(label)}
                        label={label}
                        className={
                          [
                            'h-7 w-7 shrink-0 rounded-lg bg-white ring-black/5',
                            'transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
                            'group-hover/stack:scale-[2.05] hover:scale-[2.05]',
                            'motion-reduce:transition-none motion-reduce:group-hover/stack:scale-100 motion-reduce:hover:scale-100',
                          ].join(' ')
                        }
                      />
                      <span
                        className={
                          [
                            'overflow-hidden whitespace-nowrap',
                            'transition-opacity duration-200 ease-out',
                            'group-hover/stack:opacity-0',
                          ].join(' ')
                        }
                      >
                        {label}
                      </span>
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
          </motion.div>
        </div>

        <div className="md:col-span-5">
          <div
            ref={mediaRef}
            className={cx(
              'relative bg-transparent'
            )}
            style={{ aspectRatio: '4 / 5' }}
          >
            {/* Portrait + orbital rings */}
            <div className="relative z-10 flex h-full w-full items-start justify-center">
              <OrbitalPortrait
                src={portraitSrc}
                alt={portraitAlt ?? 'Naveen Lanka portrait'}
                name="Naveen Lanka"
                tagline="SOFTWARE ENGINEER // BACKEND + WEB"
              />
            </div>

            {/* Cursor light overlay (desktop only) */}
            {!reduced && enableCursorLight ? (
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-[0.14]"
                style={
                  {
                    transform:
                      'translate3d(calc(var(--hero-cx, 0) * 10px), calc(var(--hero-cy, 0) * 10px), 0)',
                    background:
                      'radial-gradient(closest-side at 55% 40%, rgba(255,255,255,0.85), rgba(255,255,255,0) 60%)',
                  } as React.CSSProperties
                }
              />
            ) : null}

            {/* Edge highlight removed (flat look) */}
          </div>
        </div>
      </div>
    </section>
  );
}
