'use client';

import type { ElementType } from 'react';

export type ObsidianShimmerHeadingProps<T extends ElementType = 'h1'> = {
  as?: T;
  text?: string;
  className?: string;
};

export function ObsidianShimmerExperienceHeading<T extends ElementType = 'h1'>({
  as,
  text = 'Experience',
  className,
}: ObsidianShimmerHeadingProps<T>) {
  const Tag = (as ?? 'h1') as ElementType;
  return (
    <Tag
      className={
        [
          // Match TopicHeading / Research section typography
          'text-4xl font-semibold leading-[1.12] tracking-tight md:text-5xl',
          'py-1',
          'bg-clip-text text-transparent',
          // Brighter (still obsidian) dual-stop highlight for clearer shine.
          'bg-[linear-gradient(110deg,#000000_38%,#6f6f6f_48%,#b3b3b3_50%,#6f6f6f_52%,#000000_62%)]',
          'bg-[length:200%_100%]',
          'animate-shimmer',
          className,
        ].join(' ')
      }
    >
      {text}
    </Tag>
  );
}
