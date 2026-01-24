import { Metadata } from 'next';

import { ProjectCard } from '@/components/project-card';
import { Reveal } from '@/components/reveal';
import { projects } from '@/lib/projects';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Selected work presented like high-end product pages.',
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <header className="max-w-2xl">
        <h1 className="text-4xl font-semibold tracking-tight text-neutral-900">Projects</h1>
        <p className="mt-3 text-base leading-relaxed text-neutral-600">
          A curated set of case studies with a product-page narrative: brief, challenge, solution,
          outcome.
        </p>
      </header>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {projects.map((p, idx) => (
          <Reveal key={p.slug} delay={idx * 0.06}>
            <ProjectCard project={p} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
