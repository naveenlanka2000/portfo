'use client';

import Link from 'next/link';
import { CSSProperties, ReactNode, useCallback, useMemo, useRef, useState } from 'react';

import { cx } from '@/lib/utils';

export type IconButtonProps = {
  href?: string;
  label: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;

  hoverZoomScale?: number;
  hoverLiftPx?: number;
  enableSheen?: boolean;
  reducedMotionFallback?: 'tint' | 'outline';
};

export function IconButton({
  href,
  label,
  children,
  className,
  style,
  hoverZoomScale,
  hoverLiftPx,
  enableSheen = true,
  reducedMotionFallback = 'outline',
}: IconButtonProps) {
  const [sheenPlay, setSheenPlay] = useState(false);
  const lastSheenAt = useRef(0);
  const sheenTimer = useRef<number | null>(null);

  const mergedStyle = useMemo(() => {
    const next: CSSProperties = { ...style };

    // If the user overrides, set CSS vars. Otherwise, let CSS defaults handle
    // desktop/mobile/coarse pointer tuning.
    if (typeof hoverZoomScale === 'number') {
      (next as unknown as Record<string, string>)['--tape-zoom'] = String(hoverZoomScale);
    }

    if (typeof hoverLiftPx === 'number') {
      (next as unknown as Record<string, string>)['--tape-lift'] = `${hoverLiftPx}px`;
    }

    return next;
  }, [hoverLiftPx, hoverZoomScale, style]);

  const triggerSheen = useCallback(() => {
    if (!enableSheen) return;

    // Cooldown prevents rapid hover jitter from spamming animations.
    const now = Date.now();
    if (now - lastSheenAt.current < 600) return;
    lastSheenAt.current = now;

    setSheenPlay(true);

    if (sheenTimer.current) window.clearTimeout(sheenTimer.current);
    sheenTimer.current = window.setTimeout(() => {
      setSheenPlay(false);
      sheenTimer.current = null;
    }, 420);
  }, [enableSheen]);

  const classes = cx(
    'tape-item tape-iconBox',
    reducedMotionFallback === 'tint' ? 'tape-rmf-tint' : 'tape-rmf-outline',
    sheenPlay ? 'tape-sheen-play' : undefined,
    className
  );

  const commonProps = {
    className: classes,
    style: mergedStyle,
    'aria-label': label,
    title: label,
    role: 'listitem' as const,
    onPointerEnter: triggerSheen,
    onFocus: triggerSheen,
  };

  if (href) {
    return (
      <Link href={href} {...commonProps}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" {...commonProps}>
      {children}
    </button>
  );
}
