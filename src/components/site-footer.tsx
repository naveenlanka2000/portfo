import Link from 'next/link';
import type { ReactNode } from 'react';

function FooterIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  const isInternal = href.startsWith('/');
  const classes =
    'group flex h-10 w-10 items-center justify-center rounded-full border border-black/5 bg-neutral-50 text-neutral-500 transition-all duration-200 hover:-translate-y-1 hover:border-black/10 hover:bg-white hover:text-black hover:shadow-soft active:scale-95';

  if (isInternal) {
    return (
      <Link href={href} aria-label={label} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} target="_blank" rel="noreferrer" aria-label={label} className={classes}>
      {children}
    </a>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-black/5 bg-white pt-16 pb-8 text-sm">
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:gap-12">
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-neutral-900">Sitemap</h3>
            <ul className="flex flex-col gap-3 text-neutral-500">
              <li><Link href="/" className="hover:text-neutral-900 hover:underline">Home</Link></li>
              <li><Link href="/about" className="hover:text-neutral-900 hover:underline">About</Link></li>
              <li><Link href="/projects" className="hover:text-neutral-900 hover:underline">Projects</Link></li>
              <li><Link href="/contact" className="hover:text-neutral-900 hover:underline">Contact</Link></li>
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-neutral-900">Work</h3>
            <ul className="flex flex-col gap-3 text-neutral-500">
              <li><Link href="/projects" className="hover:text-neutral-900 hover:underline">All Projects</Link></li>
              <li><Link href="/#experience" className="hover:text-neutral-900 hover:underline">Experience</Link></li>
              <li><Link href="/#research" className="hover:text-neutral-900 hover:underline">Research</Link></li>
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-neutral-900">Connect</h3>
            <ul className="flex flex-col gap-3 text-neutral-500">
              <li><a href="mailto:naveenlanka45@gmail.com" className="hover:text-neutral-900 hover:underline">Email</a></li>
              <li><a href="https://github.com/naveenlanka2000" target="_blank" rel="noreferrer" className="hover:text-neutral-900 hover:underline">GitHub</a></li>
              <li><Link href="/contact" className="hover:text-neutral-900 hover:underline">Contact Form</Link></li>
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-neutral-900">Legal</h3>
            <ul className="flex flex-col gap-3 text-neutral-500">
              <li><span className="cursor-not-allowed opacity-60">Privacy Policy</span></li>
              <li><span className="cursor-not-allowed opacity-60">Terms of Service</span></li>
              <li><span className="cursor-not-allowed opacity-60">Cookies</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-black/5 pt-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex flex-col gap-2 text-center md:text-left">
              <p className="text-xs text-neutral-500">
                Copyright © {new Date().getFullYear()} Naveen Lanka. All rights reserved.
              </p>
              <p className="text-[10px] text-neutral-400">
                Sri Lanka • English
              </p>
            </div>

            <div className="flex items-center gap-3">
              <FooterIcon href="mailto:naveenlanka45@gmail.com" label="Email">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
              </FooterIcon>

              <FooterIcon href="https://github.com/naveenlanka2000" label="GitHub">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.47 2 2 6.47 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
                </svg>
              </FooterIcon>

              <FooterIcon href="/contact" label="Contact">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                </svg>
              </FooterIcon>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
