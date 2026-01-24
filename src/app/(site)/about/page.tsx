import type { Metadata } from 'next';

import { Reveal } from '@/components/reveal';

export const metadata: Metadata = {
  title: 'About',
  description: 'Bio, principles, and how I work.',
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <header className="max-w-3xl">
        <Reveal y={24}>
          <h1 className="text-4xl font-semibold tracking-tight text-neutral-900">About</h1>
        </Reveal>
        <Reveal delay={0.12} y={24}>
          <p className="mt-4 text-base leading-relaxed text-neutral-600 md:text-lg">
            I design and build interfaces that feel calm, precise, and fast. I care about typography,
            motion, and the invisible details that make products feel premium.
          </p>
        </Reveal>
      </header>

      <section className="mt-12 grid gap-6 md:grid-cols-12">
        <Reveal className="md:col-span-5">
          <div className="rounded-3xl border border-black/5 bg-white p-8 shadow-soft">
            <h2 className="text-lg font-semibold tracking-tight text-neutral-900">Principles</h2>
            <ul className="mt-4 grid gap-2 text-sm text-neutral-600">
              <li>Clarity over cleverness</li>
              <li>Motion that informs, not distracts</li>
              <li>Performance as a feature</li>
              <li>Accessible by default</li>
            </ul>
          </div>
        </Reveal>

        <Reveal className="md:col-span-7" delay={0.06}>
          <div className="rounded-3xl border border-black/5 bg-white p-8 shadow-soft">
            <h2 className="text-lg font-semibold tracking-tight text-neutral-900">Timeline</h2>
            <div className="mt-4 grid gap-4 text-sm text-neutral-600">
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-medium text-neutral-900">2026</span>
                <span>Portfolio refresh: tokens + motion system</span>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-medium text-neutral-900">2025</span>
                <span>Shipped performance-first commerce experience</span>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-medium text-neutral-900">2024</span>
                <span>Designed and delivered a reusable UI kit</span>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
