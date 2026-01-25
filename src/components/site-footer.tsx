import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="border-t border-black/5 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-10 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-neutral-500">
          © {new Date().getFullYear()} Naveen Lanka. Built with care.
        </p>
        <div className="flex items-center gap-5 text-sm">
          <a className="text-neutral-600 hover:text-neutral-900" href="mailto:naveenlanka45@gmail.com">
            naveenlanka45@gmail.com
          </a>
          <a
            className="text-neutral-600 hover:text-neutral-900"
            href="https://github.com/naveenlanka2000"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          <Link className="text-neutral-600 hover:text-neutral-900" href="/contact">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
