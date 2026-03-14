'use client';

import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useMemo, useRef } from 'react';

import { cx } from '@/lib/utils';
import { IronShineHeadline } from '@/components/IronShineHeadline';

export type FloatingGalleryItem = {
  id: string;
  title: string;
  caption?: string;
  imageSrc: string;
  imageAlt: string;
  overlay?: { title: string; subtitle?: string };
};

export type FloatingGallerySectionProps = {
  className?: string;
  items?: FloatingGalleryItem[];
  heading?: string;
  subheading?: string;

  /** Seconds to complete a full loop (lower = faster). */
  durationSec?: { col1?: number; col2?: number; col3?: number };
};

const DEFAULT_ITEMS: FloatingGalleryItem[] = [
  {
    id: 'a1',
    title: 'Clear architecture',
    caption: 'simple modules, strong boundaries',
    imageSrc:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=70',
    imageAlt: 'Team collaborating at a desk',
  },
  {
    id: 'a2',
    title: 'Secure workflows',
    caption: 'validation, auth, safe defaults',
    imageSrc:
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=70',
    imageAlt: 'People working together in an office',
  },
  {
    id: 'a3',
    title: 'Gradient study',
    caption: 'Tone & depth',
    imageSrc:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=70',
    imageAlt: 'Laptop with code on screen',
  },
  {
    id: 'a4',
    title: 'API discipline',
    caption: 'contracts, edge cases, testing',
    imageSrc:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=70',
    imageAlt: 'Close-up of code editor interface',
  },
  {
    id: 'a5',
    title: 'Data integrity',
    caption: 'schemas, queries, consistency',
    imageSrc:
      'https://images.unsplash.com/photo-1487014679447-9f8336841d58?auto=format&fit=crop&w=1200&q=70',
    imageAlt: 'Clean desk and minimal workspace elements',
  },
  {
    id: 'a6',
    title: 'Performance mindset',
    caption: 'fast paths, fewer surprises',
    imageSrc:
      'https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?auto=format&fit=crop&w=1200&q=70',
    imageAlt: 'Runner moving through a city street',
  },
  {
    id: 'a7',
    title: 'Polished interfaces',
    caption: 'motion that feels natural',
    imageSrc:
      'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&q=70',
    imageAlt: 'Minimal product workspace scene',
  },
  {
    id: 'a8',
    title: 'Research rigor',
    caption: 'measure, iterate, improve',
    imageSrc:
      'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=70',
    imageAlt: 'Minimal product design scene with soft light',
  },
  {
    id: 'a9',
    title: 'Calm systems',
    caption: 'reliable, readable, maintainable',
    imageSrc:
      'https://images.unsplash.com/photo-1522199755839-a2bacb67c546?auto=format&fit=crop&w=1200&q=70',
    imageAlt: 'Laptop on desk with minimal scene',
  },
];

function chunk3(items: FloatingGalleryItem[]) {
  const col1: FloatingGalleryItem[] = [];
  const col2: FloatingGalleryItem[] = [];
  const col3: FloatingGalleryItem[] = [];
  items.forEach((it, idx) => {
    if (idx % 3 === 0) col1.push(it);
    else if (idx % 3 === 1) col2.push(it);
    else col3.push(it);
  });
  return { col1, col2, col3 };
}

function Card({ item }: { item: FloatingGalleryItem }) {
  const content = (
    <>
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/30" style={{ aspectRatio: '4 / 3' }}>
        <Image
          src={item.imageSrc}
          alt={item.imageAlt}
          fill
          sizes="(min-width: 1024px) 420px, 100vw"
          className="object-cover"
        />

        {item.overlay ? (
          <div className="absolute inset-x-0 bottom-0 p-4">
            <div className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 backdrop-blur">
              <p className="text-sm font-semibold tracking-tight text-white">{item.overlay.title}</p>
              {item.overlay.subtitle ? (
                <p className="mt-1 text-xs text-white/75">{item.overlay.subtitle}</p>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
      <div className="mt-3 sm:mt-4">
        <p className="text-xs font-medium tracking-tight text-white sm:text-sm">{item.title}</p>
        {item.caption ? <p className="mt-1 text-[11px] text-white/70 sm:text-xs">{item.caption}</p> : null}
      </div>
    </>
  );

  const frame = "rounded-3xl border border-white/10 bg-neutral-950 p-3 text-white shadow-[0_1px_0_rgba(255,255,255,0.04),0_10px_30px_rgba(0,0,0,0.35)] sm:p-4";

  return <article className={frame}>{content}</article>;
}

function MarqueeColumn({
  items,
  direction,
  durationSec,
}: {
  items: FloatingGalleryItem[];
  direction: 'up' | 'down';
  durationSec: number;
}) {
  const reduced = useReducedMotion();

  // Duplicate list for seamless looping.
  const loopItems = useMemo(() => [...items, ...items], [items]);

  const animate = reduced
    ? undefined
    : {
        y: direction === 'up' ? ['0%', '-50%'] : ['-50%', '0%'],
      };

  return (
    <div className="relative h-[320px] overflow-hidden sm:h-[420px] lg:h-[480px]">
      <motion.div
        className="flex flex-col gap-4 sm:gap-6"
        animate={animate}
        transition={
          reduced
            ? undefined
            : {
                duration: durationSec,
                ease: 'linear',
                repeat: Infinity,
              }
        }
      >
        {loopItems.map((item, idx) => (
          <Card key={`${item.id}-${idx}`} item={item} />
        ))}
      </motion.div>
    </div>
  );
}

function hexToRgbTriplet(hex: string): string | null {
  const v = hex.trim();
  const m = /^#([0-9a-fA-F]{6})$/.exec(v);
  if (!m) return null;
  const n = parseInt(m[1], 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `${r} ${g} ${b}`;
}

export function FloatingGallerySection({
  className,
  items = DEFAULT_ITEMS,
  heading = 'A floating gallery of ideas',
  subheading = 'A quick snapshot of how I build: secure workflows, clean data, and interfaces that feel effortless.',
  durationSec,
}: FloatingGallerySectionProps) {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);

  // Theme switch: interpolate global background based on this section's scroll.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Fade to black while entering this section, then fade back to white as it leaves.
  // This keeps the footer (below) from inheriting a fully-black global background.
  const bg = useTransform(scrollYProgress, [0, 0.35, 0.75, 1], ['#ffffff', '#000000', '#000000', '#ffffff']);

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    // Treat the flat part of the curve as "fully black".
    const isFullyBlack = p >= 0.36 && p <= 0.74;
    if (isFullyBlack) document.documentElement.dataset.pageTone = 'dark';
    else delete document.documentElement.dataset.pageTone;
  });

  useMotionValueEvent(bg, 'change', (v) => {
    // Apply to global background (inline styles win over CSS vars).
    document.documentElement.style.backgroundColor = v;
    document.body.style.backgroundColor = v;

    // Also update the CSS variable used by the app, for consistency.
    const triplet = hexToRgbTriplet(v);
    if (triplet) {
      document.documentElement.style.setProperty('--background', triplet);
    }
  });

  useEffect(() => {
    return () => {
      // Restore defaults on unmount.
      document.documentElement.style.backgroundColor = '';
      document.body.style.backgroundColor = '';
      document.documentElement.style.setProperty('--background', '255 255 255');
      delete document.documentElement.dataset.pageTone;
    };
  }, []);

  const { col1, col2, col3 } = useMemo(() => chunk3(items), [items]);

  const col1Dur = durationSec?.col1 ?? 26;
  const col2Dur = durationSec?.col2 ?? 30;
  const col3Dur = durationSec?.col3 ?? 28;

  return (
    <motion.section
      ref={sectionRef}
      className={cx(
        // Full-bleed even inside the centered page container.
        'relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen',
        'mt-16 overflow-hidden bg-black',
        className
      )}
      // Local background follows the same transform to avoid seams.
      style={{ backgroundColor: bg }}
    >
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5">
            <p className="text-xs font-medium tracking-wide text-white/60">Gallery</p>

            <div className="relative mt-3">
              <div
                aria-hidden
                className="pointer-events-none absolute -left-10 -top-10 h-48 w-48 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.14),transparent_60%)] blur-2xl"
              />

              <div className="max-w-md">
                <IronShineHeadline text={heading} />
                {subheading ? (
                  <p className="mt-4 text-pretty text-sm leading-relaxed text-white/70 md:text-base">
                    {subheading}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.06] p-4">
              <p className="text-sm font-medium text-white">Ambient mode</p>
              <p className="mt-1 text-xs text-white/70">
                The page tone blends smoothly as you enter and leave this gallery.
                {reduced ? ' (Reduced motion: drift pauses.)' : ''}
              </p>
            </div>
          </div>

          <div className="lg:col-span-7">
            {/* Always show all 3 columns; compact gaps for mobile widths. */}
            <div className="grid grid-cols-3 gap-3 sm:gap-6">
              <MarqueeColumn items={col1} direction="up" durationSec={col1Dur} />
              <MarqueeColumn items={col2} direction="down" durationSec={col2Dur} />
              <MarqueeColumn items={col3} direction="up" durationSec={col3Dur} />
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
