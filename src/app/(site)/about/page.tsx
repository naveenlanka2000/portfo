import type { Metadata } from 'next';
import Link from 'next/link';

import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Reveal } from '@/components/reveal';
import { tagToBrandKind } from '@/lib/brand';
import { BrandIcon, type BrandKind } from '@/components/sections/BrandIcon';
import { absoluteRouteUrl, buildBreadcrumbList, buildPageMetadata, buildWebPageSchema } from '@/lib/seo';
import { siteConfig } from '@/lib/site';

const LANGUAGES = ['Java', 'Python', 'JavaScript', 'TypeScript', 'Dart', 'HTML', 'CSS'] as const;
const FRAMEWORKS = ['Spring Boot', 'Flask', 'React', 'Flutter'] as const;
const DATA = ['MySQL', 'SQL'] as const;
const ABOUT_PROJECTS = [
  {
    slug: 'online-banking-application',
    title: 'Online Banking Application',
    description: 'Feedback module with React, Spring Boot, and MySQL, focused on secure data handling.',
  },
  {
    slug: 'air-ticket-booking-system',
    title: 'Air Ticket Booking System',
    description: 'Java and SQL reservation workflows for bookings, cancellations, and passenger records.',
  },
  {
    slug: 'medicare-application',
    title: 'Medicare Application',
    description: 'Flutter app for appointments and healthcare resources.',
  },
  {
    slug: 'food-market-db-management',
    title: 'Food Market DB Management',
    description: 'Web app with HTML, CSS, JavaScript, and SQL for inventory, sales, and supplier management.',
  },
] as const;

const pageTitle = 'About';
const pageDescription =
  'Learn about Naveen Lanka, a software engineer in Sri Lanka focused on backend development, full-stack web apps, Java, Spring Boot, Python, React, and applied machine learning.';

export const metadata: Metadata = buildPageMetadata({
  path: '/about',
  title: pageTitle,
  description: pageDescription,
  openGraphType: 'profile',
  keywords: [
    'Naveen Lanka about',
    'Naveen Lanka software engineer Sri Lanka',
    'backend engineer Sri Lanka portfolio',
    'full-stack developer Sri Lanka portfolio',
  ],
});

export default function AboutPage() {
  const breadcrumbId = `${absoluteRouteUrl('/about')}#breadcrumb`;
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      buildBreadcrumbList([
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
      ], '/about'),
      buildWebPageSchema({
        path: '/about',
        name: `${pageTitle} | ${siteConfig.name}`,
        description: pageDescription,
        pageType: 'ProfilePage',
        breadcrumbId,
      }),
    ],
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: 'About' }]} />

      <header className="max-w-3xl">
        <Reveal y={24}>
          <h1 className="text-4xl font-semibold tracking-tight text-neutral-900">About Naveen Lanka</h1>
        </Reveal>
        <Reveal delay={0.12} y={24}>
          <p className="mt-4 text-base leading-relaxed text-neutral-600 md:text-lg">
            I&apos;m <span className="[font-family:var(--font-cursive)] text-neutral-900">Naveen Lanka</span>, a software
            engineer in Sri Lanka focused on backend and full-stack development. I build secure, reliable services and
            clean web experiences, with a strong interest in Java, Spring Boot, Python, React, Next.js, SQL, and
            applied machine learning.
          </p>
        </Reveal>
      </header>

      <section aria-labelledby="about-skills-title about-experience-title" className="mt-12 grid gap-6 md:grid-cols-12">
        <Reveal className="md:col-span-5">
          <div className="rounded-3xl border border-black/5 bg-white p-8 shadow-soft">
            <h2 id="about-skills-title" className="text-lg font-semibold tracking-tight text-neutral-900">
              Skills
            </h2>
            <div className="mt-5 grid gap-5">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Languages</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {LANGUAGES.map((label) => (
                    <span
                      key={label}
                      className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700"
                    >
                      <BrandIcon
                        kind={tagToBrandKind(label) as BrandKind}
                        label={label}
                        className="h-4 w-4 rounded-md bg-transparent ring-0 transition-transform duration-200 ease-out hover:scale-150"
                      />
                      {label}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Frameworks</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {FRAMEWORKS.map((label) => (
                    <span
                      key={label}
                      className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700"
                    >
                      <BrandIcon
                        kind={tagToBrandKind(label) as BrandKind}
                        label={label}
                        className="h-4 w-4 rounded-md bg-transparent ring-0 transition-transform duration-200 ease-out hover:scale-150"
                      />
                      {label}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Databases</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {DATA.map((label) => (
                    <span
                      key={label}
                      className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700"
                    >
                      <BrandIcon
                        kind={tagToBrandKind(label) as BrandKind}
                        label={label}
                        className="h-4 w-4 rounded-md bg-transparent ring-0 transition-transform duration-200 ease-out hover:scale-150"
                      />
                      {label}
                    </span>
                  ))}
                </div>
                <p className="mt-3 text-sm text-neutral-700">Schema design, queries, data integrity</p>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">AI/ML</h3>
                <p className="mt-2 text-sm text-neutral-700">CNNs, TensorFlow, Keras, experimentation, and evaluation</p>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal className="md:col-span-7" delay={0.06}>
          <div className="rounded-3xl border border-black/5 bg-white p-8 shadow-soft">
            <h2 id="about-experience-title" className="text-lg font-semibold tracking-tight text-neutral-900">
              Experience
            </h2>
            <div className="mt-5 grid gap-5 text-sm text-neutral-600">
              <div className="grid gap-1">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <span className="font-medium text-neutral-900">
                    Backend Developer - NFORCE (Dental Management System)
                  </span>
                  <span className="text-xs text-neutral-500">Oct 2024 - Mar 2025</span>
                </div>
                <ul className="mt-2 grid gap-2">
                  <li>Built and maintained Java backend services for core clinical workflows.</li>
                  <li>Implemented secure data handling for patient records and appointment scheduling.</li>
                  <li>Collaborated across teams to improve reliability and performance.</li>
                </ul>
              </div>

              <div className="grid gap-1">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <span className="font-medium text-neutral-900">
                    Research - CNN-Based Sri Lankan Medicinal Leaf Classification
                  </span>
                  <span className="text-xs text-neutral-500">Academic</span>
                </div>
                <ul className="mt-2 grid gap-2">
                  <li>Built and trained CNN models to classify Sri Lankan medicinal leaves.</li>
                  <li>Used TensorFlow and Keras to iterate quickly on architectures and evaluation.</li>
                  <li>Focused on practical ML evaluation for an applied healthcare-related research topic.</li>
                </ul>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section
        aria-labelledby="about-projects-title about-education-title"
        className="mt-6 grid gap-6 md:grid-cols-12"
      >
        <Reveal className="md:col-span-7">
          <div className="rounded-3xl border border-black/5 bg-white p-8 shadow-soft">
            <h2 id="about-projects-title" className="text-lg font-semibold tracking-tight text-neutral-900">
              Projects
            </h2>
            <div className="mt-5 grid gap-4 text-sm text-neutral-600">
              {ABOUT_PROJECTS.map((project) => (
                <div key={project.slug} className="grid gap-1">
                  <Link
                    href={`/projects/${project.slug}`}
                    aria-label={`Read more about the ${project.title} project`}
                    className="font-medium text-neutral-900"
                  >
                    {project.title}
                  </Link>
                  <p>{project.description}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal className="md:col-span-5" delay={0.06}>
          <div className="rounded-3xl border border-black/5 bg-white p-8 shadow-soft">
            <h2 id="about-education-title" className="text-lg font-semibold tracking-tight text-neutral-900">
              Education
            </h2>
            <div className="mt-5 grid gap-4 text-sm text-neutral-600">
              <div className="grid gap-1">
                <p className="font-medium text-neutral-900">NSBM Green University</p>
                <p>BSc (Hons) in Software Engineering</p>
              </div>
              <div className="grid gap-1">
                <p className="font-medium text-neutral-900">Sri Dharmaloke College, Kelaniya</p>
                <p>GCE Advanced Level (Physical Science Stream): Combined Mathematics, Chemistry, Physics</p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
