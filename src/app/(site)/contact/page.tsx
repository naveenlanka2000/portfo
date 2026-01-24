import type { Metadata } from 'next';

import { Reveal } from '@/components/reveal';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Send a note. I reply quickly.',
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
            Tell me what you’re building and what success looks like. I’ll respond with next steps.
          </p>
        </Reveal>
      </header>

      <section className="mt-10 max-w-2xl">
        <Reveal>
          <form className="grid gap-4 rounded-3xl border border-black/5 bg-white p-7 shadow-soft">
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
              className="mt-2 inline-flex h-11 items-center justify-center rounded-full bg-neutral-900 px-6 text-sm font-medium text-white shadow-soft transition-transform duration-200 [transition-timing-function:var(--motion-ease)] active:scale-[0.98]"
            >
              Send
            </button>

            <p className="text-xs text-neutral-500">
              This is a starter UI. Wire it to email/API when ready.
            </p>
          </form>
        </Reveal>
      </section>
    </div>
  );
}
