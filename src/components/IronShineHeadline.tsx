'use client';

import { motion } from 'framer-motion';

export type IronShineHeadlineProps = {
  text?: string;
  className?: string;
};

export function IronShineHeadline({ text = 'A floating gallery of ideas', className }: IronShineHeadlineProps) {
  return (
    <motion.h1
      className={
        [
          // Premium typography
          'text-pretty font-sans text-4xl font-bold tracking-tight md:text-5xl',
          // Brighter steel look (reads well on dark backgrounds)
          'bg-gradient-to-r from-neutral-200 via-neutral-400 to-neutral-200',
          'bg-[length:200%_100%] bg-clip-text text-transparent',
          // Safari/WebKit support
          '[-webkit-text-fill-color:transparent]',
          // Subtle depth (not chrome)
          '[text-shadow:0_1px_0_rgba(0,0,0,0.22)]',
          className,
        ].join(' ')
      }
      style={{ backgroundPosition: '0% 50%' }}
      animate={{ backgroundPosition: ['0% 50%', '-200% 50%'] }}
      transition={{ duration: 8, ease: 'linear', repeat: Infinity }}
    >
      {text}
    </motion.h1>
  );
}
