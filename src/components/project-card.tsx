import Link from 'next/link';

import type { Project } from '@/lib/projects';
import { tagToBrandKind } from '@/lib/brand';
import { BrandIcon, type BrandKind } from '@/components/sections/BrandIcon';

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className={
        [
          'group relative block rounded-2xl border border-black/10 bg-white p-6 shadow-soft',
          'transition-shadow duration-200 [transition-timing-function:var(--motion-ease)]',
          'hover:shadow-lift',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/40',
        ].join(' ')
      }
    >
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="text-lg font-semibold tracking-tight text-neutral-900">{project.title}</h3>
        <span className="text-xs font-medium text-neutral-500">{project.year}</span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-neutral-600">{project.tagline}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {project.stack.slice(0, 3).map((s) => (
          <span
            key={s}
            className={
              [
                'relative inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700',
                // Let the icon scale above neighbors
                'overflow-visible',
                // Create a local hover target so “near the icon” (hovering the pill) also pops it
                'group/tech',
              ].join(' ')
            }
          >
            <BrandIcon
              kind={tagToBrandKind(s) as BrandKind}
              label={s}
              className={
                [
                  // Base size a bit bigger in Featured cards
                  'h-5 w-5 rounded-md bg-transparent ring-0',
                  // Big, smooth pop on hover
                  'transition-transform duration-200 ease-out',
                  // Hovering the whole pill should already enlarge the icon
                  'group-hover/tech:scale-[1.6]',
                  // Hovering the icon itself makes it even bigger
                  'hover:scale-[2.0]',
                ].join(' ')
              }
            />
            {s}
          </span>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-accent-500/0 via-accent-500/0 to-accent-500/10" />
      </div>
    </Link>
  );
}
