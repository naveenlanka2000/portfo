'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { CSSProperties, ReactNode } from 'react';

export type AnimatedHeadlineProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;

  /** When true, plays the entrance animation. */
  play?: boolean;
};

export function AnimatedHeadline({ children, className, style, play = true }: AnimatedHeadlineProps) {
  const reduced = useReducedMotion();

  return (
    <motion.h1
      className={className}
      style={style}
      initial={reduced ? { x: 0, y: 0, opacity: 1 } : { x: -50, y: -50, opacity: 0 }}
      animate={play ? { x: 0, y: 0, opacity: 1 } : undefined}
      transition={
        reduced
          ? undefined
          : {
              type: 'spring',
              stiffness: 100,
              damping: 20,
              mass: 1,
            }
      }
    >
      {children}
    </motion.h1>
  );
}
