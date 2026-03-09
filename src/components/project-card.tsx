import Link from 'next/link';

import type { Project } from '@/lib/projects';
import { LaptopTilt } from '@/components/LaptopTilt';

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group relative block focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/40"
    >
      <LaptopTilt
        className="pb-14 transition-transform duration-200 [transition-timing-function:var(--motion-ease)] group-hover:z-10 group-hover:-translate-y-1"
        frameClassName="shadow-soft group-hover:shadow-lift"
      >
        <div className="relative p-6">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="text-lg font-semibold tracking-tight text-neutral-900">{project.title}</h3>
            <span className="text-xs font-medium text-neutral-500">{project.year}</span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600">{project.tagline}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {project.stack.slice(0, 3).map((s) => (
              <span
                key={s}
                className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700"
              >
                {s}
              </span>
            ))}
          </div>

          <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <div className="absolute inset-0 bg-gradient-to-b from-accent-500/0 via-accent-500/0 to-accent-500/10" />
          </div>
        </div>
      </LaptopTilt>
    </Link>
  );
}
