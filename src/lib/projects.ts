export type Project = {
  slug: string;
  title: string;
  tagline: string;
  year: string;
  role: string;
  stack: string[];
  highlights: string[];
};

export const projects: Project[] = [
  {
    slug: 'lumen-commerce',
    title: 'Lumen Commerce',
    tagline: 'A performance-first storefront with tactile motion.',
    year: '2025',
    role: 'Design + Frontend',
    stack: ['Next.js', 'TypeScript', 'Tailwind', 'Framer Motion'],
    highlights: ['LCP improved from 2.6s → 1.1s', 'CLS reduced to 0.02', 'Conversion +18%'],
  },
  {
    slug: 'atlas-analytics',
    title: 'Atlas Analytics',
    tagline: 'A calm, data-dense dashboard built for clarity.',
    year: '2024',
    role: 'Product Design',
    stack: ['Design Systems', 'Accessibility', 'Prototyping'],
    highlights: ['WCAG AA across key flows', 'Onboarding time -35%', 'Reusable tokenized UI kit'],
  },
  {
    slug: 'northwind-mobile',
    title: 'Northwind Mobile',
    tagline: 'A mobile experience that feels engineered.',
    year: '2024',
    role: 'UI Engineering',
    stack: ['React', 'Motion', 'Testing'],
    highlights: ['Gesture microinteractions', 'Shared component primitives', 'Smooth 60fps transitions'],
  },
  {
    slug: 'studio-site',
    title: 'Studio Site',
    tagline: 'A product-like marketing site with scroll narrative.',
    year: '2023',
    role: 'Design + Build',
    stack: ['Next.js', 'SEO', 'Content'],
    highlights: ['Organic traffic +42%', 'Content pipeline simplified', 'Reusable case study template'],
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
