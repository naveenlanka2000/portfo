'use client';

import type React from 'react';

import { motion, useMotionValue, useSpring } from 'framer-motion';

import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { cx } from '@/lib/utils';

type LaptopTiltProps = {
  children: React.ReactNode;
  className?: string;
  frameClassName?: string;
  frameBaseClassName?: string;
  maxTiltDeg?: number;
  perspectivePx?: number;
  scale?: number;
  showBase?: boolean;
};

export function LaptopTilt({
  children,
  className,
  frameClassName,
  frameBaseClassName,
  maxTiltDeg = 12,
  perspectivePx = 900,
  scale = 1.02,
  showBase = true,
}: LaptopTiltProps) {
  const reducedMotion = usePrefersReducedMotion();

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const glareOpacity = useMotionValue(0);
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);

  const spring = { stiffness: 240, damping: 22, mass: 0.6 };
  const rX = useSpring(rotateX, spring);
  const rY = useSpring(rotateY, spring);
  const gO = useSpring(glareOpacity, { stiffness: 180, damping: 30 });
  const gX = useSpring(glareX, { stiffness: 220, damping: 26 });
  const gY = useSpring(glareY, { stiffness: 220, damping: 26 });

  const setFromPoint = (clientX: number, clientY: number, rect: DOMRect) => {
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const px = (x / rect.width - 0.5) * 2; // -1..1
    const py = (y / rect.height - 0.5) * 2; // -1..1

    rotateY.set(px * maxTiltDeg);
    rotateX.set(-py * maxTiltDeg);

    glareOpacity.set(0.22);
    glareX.set((x / rect.width) * 100);
    glareY.set((y / rect.height) * 100);
  };

  const onPointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    // Give a visible "laptop tilt" even without movement.
    // If reduced motion is enabled, we keep this as a static pose
    // (no continuous tracking) so the effect is still visible.
    rotateX.set(-3);
    rotateY.set(6);
    glareOpacity.set(0.14);

    if (reducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setFromPoint(e.clientX, e.clientY, rect);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion) return;

    // Avoid fighting scroll gestures on touch devices.
    if (e.pointerType === 'touch') return;

    const rect = e.currentTarget.getBoundingClientRect();
    setFromPoint(e.clientX, e.clientY, rect);
  };

  const onPointerLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    glareOpacity.set(0);
    glareX.set(50);
    glareY.set(50);
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'touch') return;

    // Quick, obvious effect on tap/press.
    rotateX.set(-6);
    rotateY.set(8);
    glareOpacity.set(0.18);
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'touch') return;
    onPointerLeave();
  };

  const screenDepth: React.CSSProperties = reducedMotion ? {} : { transform: 'translateZ(26px)' };
  const baseDepth: React.CSSProperties = reducedMotion
    ? {}
    : {
        transform: 'translateX(-50%) rotateX(74deg) translateY(-10px)',
        transformOrigin: 'top',
      };
  const touchpadDepth: React.CSSProperties = reducedMotion
    ? {}
    : {
        transform: 'translateX(-50%) translateZ(10px) translateY(12px)',
      };

  const glareStyle = {
    opacity: reducedMotion ? glareOpacity : gO,
    background:
      'radial-gradient(circle at var(--gx) var(--gy), rgba(255,255,255,0.55), rgba(255,255,255,0) 55%)',
    ['--gx' as any]: reducedMotion ? glareX : gX,
    ['--gy' as any]: reducedMotion ? glareY : gY,
  } as unknown as React.CSSProperties;

  return (
    <div className={cx('relative', className)} style={{ perspective: `${perspectivePx}px` }}>
      <motion.div
        onPointerEnter={onPointerEnter}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        className="relative will-change-transform [transform-style:preserve-3d]"
        style={{
          rotateX: reducedMotion ? rotateX : rX,
          rotateY: reducedMotion ? rotateY : rY,
          scale: reducedMotion ? 1 : scale,
        }}
      >
        <div
          className={cx(
            'relative overflow-hidden shadow-soft',
            frameBaseClassName ?? 'rounded-2xl border border-black/5 bg-white',
            frameClassName
          )}
          style={screenDepth}
        >
          {children}

          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={glareStyle}
          />
        </div>

        {showBase ? (
          <>
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-[100%] h-10 w-[94%] rounded-b-[28px] bg-gradient-to-b from-neutral-200 to-neutral-100 shadow-soft"
              style={baseDepth}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-[100%] h-2 w-28 rounded-full bg-neutral-300/70"
              style={touchpadDepth}
            />
          </>
        ) : null}
      </motion.div>
    </div>
  );
}
