'use client';

import dynamic from 'next/dynamic';

const ResearchSection = dynamic(
  () => import('@/components/sections/Research').then((m) => m.ResearchSection),
  {
    loading: () => (
      <section className="bg-[#f8f8f8] py-16 md:py-20" aria-hidden>
        <div className="site-shell">
          <div className="grid gap-10 md:grid-cols-12 md:gap-12">
            <div className="space-y-4 md:col-span-4">
              <div className="h-12 w-36 rounded-2xl bg-black/5" />
              <div className="h-20 max-w-xs rounded-2xl bg-black/5" />
            </div>
            <div className="grid gap-6 md:col-span-8 md:grid-cols-12">
              <div className="h-72 rounded-3xl bg-white md:col-span-5" />
              <div className="h-72 rounded-3xl bg-white md:col-span-7" />
            </div>
          </div>
        </div>
      </section>
    ),
  }
);

export function ResearchLazy({ className }: { className?: string }) {
  return <ResearchSection className={className} />;
}
