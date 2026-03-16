'use client';

import dynamic from 'next/dynamic';

const ExperienceSection = dynamic(
  () => import('@/components/sections/Experience').then((m) => m.ExperienceSection),
  {
    loading: () => (
      <section className="bg-white py-16 md:py-20" aria-hidden>
        <div className="mx-auto max-w-6xl px-5">
          <div className="grid gap-10 md:grid-cols-12 md:gap-12">
            <div className="space-y-4 md:col-span-4">
              <div className="h-12 w-40 rounded-2xl bg-black/5" />
              <div className="h-20 max-w-xs rounded-2xl bg-black/5" />
            </div>
            <div className="md:col-span-8">
              <div className="h-64 rounded-3xl bg-black/5" />
            </div>
          </div>
        </div>
      </section>
    ),
  }
);

export function ExperienceLazy({ className }: { className?: string }) {
  return <ExperienceSection className={className} />;
}
