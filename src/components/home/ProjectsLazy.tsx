'use client';

import dynamic from 'next/dynamic';

const ProjectsSection = dynamic(
  () => import('@/components/sections/Projects').then((m) => m.ProjectsSection),
  {
    loading: () => (
      <section className="bg-white py-16 md:py-20" aria-hidden>
        <div className="site-shell">
          <div className="grid gap-10 md:grid-cols-12 md:gap-12">
            <div className="space-y-4 md:col-span-4">
              <div className="h-12 w-36 rounded-2xl bg-black/5" />
              <div className="h-20 max-w-xs rounded-2xl bg-black/5" />
            </div>
            <div className="grid gap-6 md:col-span-8 md:grid-cols-2">
              <div className="h-56 rounded-3xl bg-black/5" />
              <div className="h-56 rounded-3xl bg-black/5" />
            </div>
          </div>
        </div>
      </section>
    ),
  }
);

export function ProjectsLazy({ className }: { className?: string }) {
  return <ProjectsSection className={className} />;
}
