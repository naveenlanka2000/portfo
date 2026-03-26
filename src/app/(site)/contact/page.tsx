import type { Metadata } from 'next';

import { Reveal } from '@/components/reveal';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch about roles, projects, or collaboration.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact | Naveen Lanka',
    description: 'Get in touch about roles, projects, or collaboration.',
    url: '/contact',
  },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <header className="max-w-2xl">
        <Reveal y={24}>
          <h1 className="text-4xl font-semibold tracking-tight text-neutral-900">Contact</h1>
        </Reveal>
        <Reveal delay={0.12} y={24}>
          <p className="mt-4 text-base leading-relaxed text-neutral-600 md:text-lg">
            Open to backend and full-stack roles. Send a short brief and I’ll reply with availability and next steps.
          </p>
        </Reveal>
      </header>

      <section className="mt-10 grid max-w-4xl gap-6 md:grid-cols-12">
        <Reveal className="md:col-span-5">
          <div className="grid gap-3 rounded-3xl border border-black/5 bg-white p-7 shadow-soft">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Email</p>
              <a className="mt-1 block text-sm font-medium text-neutral-900 hover:underline" href="mailto:naveenlanka45@gmail.com">
                naveenlanka45@gmail.com
              </a>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Phone</p>
              <a className="mt-1 block text-sm font-medium text-neutral-900 hover:underline" href="tel:+94707705725">
                +94 70 770 5725
              </a>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Location</p>
              <p className="mt-1 text-sm font-medium text-neutral-900">Delgoda, Sri Lanka</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">GitHub</p>
              <a
                className="mt-1 block text-sm font-medium text-neutral-900 hover:underline"
                href="https://github.com/naveenlanka2000"
                target="_blank"
                rel="noreferrer"
              >
                github.com/naveenlanka2000
              </a>
            </div>

            <p className="pt-2 text-xs text-neutral-500">
              Prefer email? That’s the fastest way to reach me.
            </p>
          </div>
        </Reveal>

        <Reveal>
          <form className="grid gap-4 rounded-3xl border border-black/5 bg-white p-7 shadow-soft md:col-span-7">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-neutral-800">Your email</span>
              <input
                className="h-11 rounded-xl border border-black/10 bg-white px-4 text-sm text-neutral-900 shadow-sm"
                type="email"
                name="email"
                autoComplete="email"
                required
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-neutral-800">Message</span>
              <textarea
                className="min-h-32 rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-neutral-900 shadow-sm"
                name="message"
                required
              />
            </label>

            <button
              type="submit"
              className="mt-2 inline-flex h-11 items-center justify-center rounded-full bg-neutral-900 px-6 text-sm font-medium text-white shadow-soft transition-transform duration-200 active:scale-95"
            >
              Send
            </button>
          </form>
        </Reveal>
      </section>
    </div>
  );
}
