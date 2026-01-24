'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ReactNode } from 'react';

import { motionTokens } from '@/lib/motion-tokens';

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
};

export function Reveal({ children, delay = 0, y = 18, className }: RevealProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: motionTokens.durations.long / 1000,
        ease: motionTokens.ease,
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}
