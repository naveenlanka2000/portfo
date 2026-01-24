import type { Metadata } from 'next';

import { motionTokens } from '@/lib/motion-tokens';
import { SnapCarousel } from '@/components/carousel/SnapCarousel';

export const metadata: Metadata = {
  title: 'Styleguide',
  description: 'Design tokens and motion specs.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function StyleguidePage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <h1 className="text-4xl font-semibold tracking-tight text-neutral-900">Styleguide</h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-neutral-600">
        Tokens are defined in CSS variables (globals) and in a single TS source for motion.
      </p>

      <section className="mt-10">
        <h2 className="text-lg font-semibold tracking-tight text-neutral-900">Snap carousel demo</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600">
          Drag or swipe: pills morph in sync with progress. Programmatic nav uses a 300ms Standard Ease.
        </p>

        <div className="mt-5">
          <SnapCarousel
            ariaLabel="Snap carousel demo"
            legalText="Demo only. Text is pinned; it never moves with slides."
            items={[
              { src: '/rail/01.svg', alt: 'Demo slide 1', heading: 'Jackson Wang', subheading: 'Shot on iPhone' },
              { src: '/rail/02.svg', alt: 'Demo slide 2', heading: 'Sculpted light', subheading: 'Studio detail' },
              { src: '/rail/03.svg', alt: 'Demo slide 3', heading: 'Precision', subheading: 'Micro-motion' },
              { src: '/rail/04.svg', alt: 'Demo slide 4', heading: 'Clarity', subheading: 'No jitter' },
              { src: '/rail/05.svg', alt: 'Demo slide 5', heading: 'Momentum', subheading: 'Glide then lock' },
            ]}
          />
        </div>
      </section>

      <section className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-black/5 bg-white p-7 shadow-soft">
          <h2 className="text-lg font-semibold tracking-tight text-neutral-900">Color tokens</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-neutral-900 p-4 text-xs font-medium text-white">
              neutral-900
            </div>
            <div className="rounded-2xl bg-neutral-100 p-4 text-xs font-medium text-neutral-900">
              neutral-100
            </div>
            <div className="rounded-2xl bg-accent-500 p-4 text-xs font-medium text-white">accent-500</div>
            <div className="rounded-2xl border border-black/10 bg-white p-4 text-xs font-medium text-neutral-900">
              white
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-black/5 bg-white p-7 shadow-soft">
          <h2 className="text-lg font-semibold tracking-tight text-neutral-900">Motion tokens</h2>
          <pre className="mt-4 overflow-auto rounded-2xl bg-neutral-100 p-4 text-xs text-neutral-800">
            {JSON.stringify(motionTokens, null, 2)}
          </pre>
          <p className="mt-3 text-xs text-neutral-500">
            All non-essential motion should disable under prefers-reduced-motion.
          </p>
        </div>
      </section>
    </div>
  );
}
