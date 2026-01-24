import Link from 'next/link';

const links = [
  { href: '/projects', label: 'Projects' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: '/styleguide', label: 'Style' },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/75 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/" className="group inline-flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-xl bg-neutral-900 text-sm font-semibold text-white shadow-soft">
            Y
          </span>
          <span className="text-sm font-medium tracking-tight text-neutral-900">
            Your Name
            <span className="text-neutral-500"> — Portfolio</span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-neutral-700 transition-colors hover:text-neutral-900"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/projects"
          className="inline-flex items-center justify-center rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white shadow-soft transition-transform duration-200 [transition-timing-function:var(--motion-ease)] hover:-translate-y-0.5 active:translate-y-0"
        >
          View work
        </Link>
      </div>
    </header>
  );
}
