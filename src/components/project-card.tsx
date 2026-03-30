import Link from 'next/link';

import type { Project } from '@/lib/projects';
import { tagToBrandKind } from '@/lib/brand';
import { BrandIcon, type BrandKind } from '@/components/sections/BrandIcon';

export function ProjectCard({ project }: { project: Project }) {
  const stackPreview = project.stack.slice(0, 3).join(', ');

  return (
    <article aria-labelledby={`${project.slug}-title`} className="relative h-full">
      <Link
        href={`/projects/${project.slug}`}
        aria-label={`Open ${project.title}, a ${project.role.toLowerCase()} project built with ${stackPreview}`}
        className={
          [
            'group relative flex h-full flex-col rounded-2xl bg-white p-7',
            // Samsung-ish hover zoom (flat, no 3D tilt)
            // Avoid forcing GPU text rasterization (keeps text crisp on hover)
            'will-change-transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
            'hover:z-10 hover:scale-[1.035]',
            'focus-visible:scale-[1.02]',
            'motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:focus-visible:scale-100',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/40',
          ].join(' ')
        }
      >
        <div className="flex items-start justify-between gap-4">
          <h3
            id={`${project.slug}-title`}
            className="max-w-[16ch] text-xl font-semibold tracking-tight text-neutral-900 md:text-2xl"
          >
            {project.title}
          </h3>
          <span className="mt-1 text-sm font-medium text-neutral-500">{project.year}</span>
        </div>
        <p className="mt-3 text-base leading-relaxed text-neutral-600">{project.tagline}</p>

        <div className="mt-auto pt-6">
          <div className="flex flex-wrap gap-3">
            {project.stack.slice(0, 3).map((s) => (
              <span
                key={s}
                className={
                  [
                    'relative inline-flex items-center gap-2 text-sm font-medium text-neutral-700',
                    'overflow-visible',
                  ].join(' ')
                }
              >
                <BrandIcon
                  kind={tagToBrandKind(s) as BrandKind}
                  label={s}
                  bare
                  className={
                    [
                      'shrink-0 origin-center',
                      'transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
                      'hover:scale-[1.8]',
                      'motion-reduce:transition-none motion-reduce:hover:scale-100',
                    ].join(' ')
                  }
                />
                <span>{s}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-black/0 via-black/0 to-black/5" />
        </div>
      </Link>
    </article>
  );
}
