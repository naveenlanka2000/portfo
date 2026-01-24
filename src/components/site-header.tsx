/* eslint-disable jsx-a11y/anchor-is-valid */
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

function prefersReducedMotion() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
}

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const behavior: ScrollBehavior = prefersReducedMotion() ? 'auto' : 'smooth';
  el.scrollIntoView({ behavior, block: 'start' });
}

const links = [
  { href: '/#experience', label: 'Experience' },
  { href: '/#research', label: 'Research' },
  { href: '/#projects', label: 'Projects' },
  { href: '/projects', label: 'All work' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: '/styleguide', label: 'Style' },
] as const;

export function SiteHeader() {
  const router = useRouter();
  const pathname = usePathname();

  const onAnchorClick = (hash: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const id = decodeURIComponent(hash.replace(/^#/, ''));

    // If we're already on home, update hash without triggering a hard jump.
    if (pathname === '/') {
      window.history.pushState(null, '', `/#${id}`);
      scrollToId(id);
      return;
    }

    // Navigate to home without default scroll; HashScroller will handle smooth scrolling.
    router.push(`/#${id}`, { scroll: false });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/75 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/" className="group inline-flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-xl bg-neutral-900 text-sm font-semibold text-white shadow-soft">
            N
          </span>
          <span className="text-sm font-medium tracking-tight text-neutral-900">
            Naveen Lanka
            <span className="text-neutral-500"> — Software Engineer</span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            l.href.startsWith('/#') ? (
              <a
                key={l.href}
                href={l.href}
                onClick={onAnchorClick(l.href.replace('/#', '#'))}
                className="text-sm text-neutral-700 transition-colors hover:text-neutral-900"
              >
                {l.label}
              </a>
            ) : (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm text-neutral-700 transition-colors hover:text-neutral-900"
              >
                {l.label}
              </Link>
            )
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
