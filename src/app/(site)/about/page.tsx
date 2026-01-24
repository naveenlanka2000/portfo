import type { Metadata } from 'next';

import { Reveal } from '@/components/reveal';

export const metadata: Metadata = {
  title: 'About',
  description: 'Bio, skills, and experience.',
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
            I’m Naveen Lanka — a software engineering graduate focused on backend development and web
            technologies. I enjoy building secure, scalable services and clean UIs, and I’m especially
            interested in AI + applied research.
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
                <p className="mt-2 text-sm text-neutral-700">Java, Python, JavaScript, HTML, CSS</p>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Frameworks</h3>
                <p className="mt-2 text-sm text-neutral-700">Spring Boot, Flask, React, Flutter</p>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Data</h3>
                <p className="mt-2 text-sm text-neutral-700">MySQL (schema design, queries), DB management</p>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">AI/ML</h3>
                <p className="mt-2 text-sm text-neutral-700">CNNs, TensorFlow, Keras</p>
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
                  <li>Developed and maintained backend services using Java.</li>
                  <li>Implemented secure data handling, patient records, and appointment scheduling modules.</li>
                  <li>Collaborated with cross-functional teams to improve performance and reliability.</li>
                </ul>
              </div>

              <div className="grid gap-1">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <span className="font-medium text-neutral-900">Research — CNN-Based Sri Lankan Medicinal Leaf Classification</span>
                  <span className="text-xs text-neutral-500">Academic</span>
                </div>
                <ul className="mt-2 grid gap-2">
                  <li>Built and trained CNN models to classify Sri Lankan medicinal leaves.</li>
                  <li>Used TensorFlow/Keras to improve classification accuracy and experimentation speed.</li>
                  <li>Goal: support Ayurvedic medicine by enabling accurate leaf recognition.</li>
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
                <p>Feedback module with React, Spring Boot, and MySQL; implemented secure backend services.</p>
              </div>
              <div className="grid gap-1">
                <p className="font-medium text-neutral-900">Air Ticket Booking System</p>
                <p>Java + SQL reservation system for bookings, cancellations, and passenger records.</p>
              </div>
              <div className="grid gap-1">
                <p className="font-medium text-neutral-900">Medicare Application</p>
                <p>Flutter cross-platform app for appointments and medical resources.</p>
              </div>
              <div className="grid gap-1">
                <p className="font-medium text-neutral-900">Food Market DB Management</p>
                <p>Web app with HTML/CSS/JS + SQL to manage inventory, sales, and suppliers.</p>
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
