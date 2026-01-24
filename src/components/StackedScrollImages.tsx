'use client';

import { ScrollScrubImage } from '@/components/ScrollScrubImage';

export type StackedScrollImageItem = {
  src: string;
  alt: string;
  aspectRatio?: string;
  width?: number;
  height?: number;
  startOffsetPercent?: number;
  opacityRevealFraction?: number;
  priority?: boolean;
  ariaLabel?: string;
  sizes?: string;
};

export function StackedScrollImages({ items }: { items: StackedScrollImageItem[] }) {
  return (
    <div className="space-y-8">
      {items.map((item, idx) => (
        <ScrollScrubImage
          key={`${item.src}-${idx}`}
          {...item}
          priority={item.priority ?? idx === 0}
        />
      ))}
    </div>
  );
}
