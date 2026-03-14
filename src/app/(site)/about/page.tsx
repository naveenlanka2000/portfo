import type { Metadata } from 'next';

import { Reveal } from '@/components/reveal';
import { tagToBrandKind } from '@/lib/brand';
import { BrandIcon, type BrandKind } from '@/components/sections/BrandIcon';

const LANGUAGES = ['Java', 'Python', 'JavaScript', 'TypeScript', 'Dart', 'HTML', 'CSS'] as const;
const FRAMEWORKS = ['Spring Boot', 'Flask', 'React', 'Flutter'] as const;
const DATA = ['MySQL', 'SQL'] as const;

export const metadata: Metadata = {
  title: 'About',
  description: 'Backend + full-stack background, skills, and experience.',
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
            I’m{' '}
            <span className="[font-family:var(--font-cursive)] text-neutral-900">
              Naveen Lanka
            </span>{' '}
            — a software engineering graduate focused on backend and full-stack development.
            I build secure, reliable services and ship clean web experiences, with an interest in applied ML.
          </p>
        </Reveal>
      </header>

      <section className="mt-12 grid gap-6 md:grid-cols-12">
        <Reveal className="md:col-span-5">
          <div className="rounded-3xl border border-black/5 bg-white p-8 shadow-soft">
            <h2 className="text-lg font-semibold tracking-tight text-neutral-900">Skills</h2>
            <div className="mt-5 grid gap-5">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Languages</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {LANGUAGES.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700"
                    >
                      <BrandIcon
                        kind={tagToBrandKind(t) as BrandKind}
                        label={t}
                        className="h-4 w-4 rounded-md bg-transparent ring-0 transition-transform duration-200 ease-out hover:scale-150"
                      />
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Frameworks</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {FRAMEWORKS.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700"
                    >
                      <BrandIcon
                        kind={tagToBrandKind(t) as BrandKind}
                        label={t}
                        className="h-4 w-4 rounded-md bg-transparent ring-0 transition-transform duration-200 ease-out hover:scale-150"
                      />
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Databases</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {DATA.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700"
                    >
                      <BrandIcon
                        kind={tagToBrandKind(t) as BrandKind}
                        label={t}
                        className="h-4 w-4 rounded-md bg-transparent ring-0 transition-transform duration-200 ease-out hover:scale-150"
                      />
                      {t}
                    </span>
                  ))}
                </div>
                <p className="mt-3 text-sm text-neutral-700">Schema design, queries, data integrity</p>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">AI/ML</h3>
                <p className="mt-2 text-sm text-neutral-700">CNNs, TensorFlow, Keras (experimentation & evaluation)</p>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal className="md:col-span-7" delay={0.06}>
          <div className="rounded-3xl border border-black/5 bg-white p-8 shadow-soft">
            <h2 className="text-lg font-semibold tracking-tight text-neutral-900">Experience</h2>
            <div className="mt-5 grid gap-5 text-sm text-neutral-600">
              <div className="grid gap-1">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <span className="font-medium text-neutral-900">Backend Developer — NFORCE (Dental Management System)</span>
                  <span className="text-xs text-neutral-500">Oct 2024 – Mar 2025</span>
                </div>
                <ul className="mt-2 grid gap-2">
                  <li>Built and maintained Java backend services for core clinical workflows.</li>
                  <li>Implemented secure data handling for patient records and appointment scheduling.</li>
                  <li>Collaborated across teams to improve reliability and performance.</li>
                </ul>
              </div>

              <div className="grid gap-1">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <span className="font-medium text-neutral-900">Research — CNN-Based Sri Lankan Medicinal Leaf Classification</span>
                  <span className="text-xs text-neutral-500">Academic</span>
                </div>
                <ul className="mt-2 grid gap-2">
                  <li>Built and trained CNN models to classify Sri Lankan medicinal leaves.</li>
                  <li>Used TensorFlow/Keras to iterate quickly on architectures and evaluation.</li>
                  <li>Goal: support Ayurvedic medicine with accurate leaf recognition.</li>
                </ul>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="mt-6 grid gap-6 md:grid-cols-12">
        <Reveal className="md:col-span-7">
          <div className="rounded-3xl border border-black/5 bg-white p-8 shadow-soft">
            <h2 className="text-lg font-semibold tracking-tight text-neutral-900">Projects</h2>
            <div className="mt-5 grid gap-4 text-sm text-neutral-600">
              <div className="grid gap-1">
                <p className="font-medium text-neutral-900">Online Banking Application</p>
                <p>Feedback module with React, Spring Boot, and MySQL; focused on secure data handling.</p>
              </div>
              <div className="grid gap-1">
                <p className="font-medium text-neutral-900">Air Ticket Booking System</p>
                <p>Java + SQL reservation flows for bookings, cancellations, and passenger records.</p>
              </div>
              <div className="grid gap-1">
                <p className="font-medium text-neutral-900">Medicare Application</p>
                <p>Flutter app for appointments and healthcare resources.</p>
              </div>
              <div className="grid gap-1">
                <p className="font-medium text-neutral-900">Food Market DB Management</p>
                <p>Web app with HTML/CSS/JS + SQL for inventory, sales, and supplier management.</p>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal className="md:col-span-5" delay={0.06}>
          <div className="rounded-3xl border border-black/5 bg-white p-8 shadow-soft">
            <h2 className="text-lg font-semibold tracking-tight text-neutral-900">Education</h2>
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
