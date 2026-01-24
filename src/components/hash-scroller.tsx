'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
}

function scrollToHash(hash: string) {
  if (typeof window === 'undefined') return;
  const id = decodeURIComponent(hash.replace(/^#/, ''));
  if (!id) return;

  const el = document.getElementById(id);
  if (!el) return;

  const behavior: ScrollBehavior = prefersReducedMotion() ? 'auto' : 'smooth';
  el.scrollIntoView({ behavior, block: 'start' });
}

/**
 * Ensures hash navigation scrolls smoothly in Next.js App Router.
 * - Handles direct loads with hashes.
 * - Handles in-page hash changes.
 * - Respects prefers-reduced-motion.
 */
export function HashScroller() {
  const pathname = usePathname();

  useEffect(() => {
    const run = () => {
      if (!window.location.hash) return;
      // Give layout/sections a tick to mount.
      window.setTimeout(() => scrollToHash(window.location.hash), 0);
    };

    run();

    const onHashChange = () => run();
    window.addEventListener('hashchange', onHashChange, { passive: true } as AddEventListenerOptions);

    return () => {
      window.removeEventListener('hashchange', onHashChange);
    };
  }, [pathname]);

  return null;
}
