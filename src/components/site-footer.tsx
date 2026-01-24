import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="border-t border-black/5">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-10 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-neutral-500">
          © {new Date().getFullYear()} Your Name. Built with care.
        </p>
        <div className="flex items-center gap-5 text-sm">
          <Link className="text-neutral-600 hover:text-neutral-900" href="/contact">
            Email
          </Link>
          <a className="text-neutral-600 hover:text-neutral-900" href="#">
            LinkedIn
          </a>
          <a className="text-neutral-600 hover:text-neutral-900" href="#">
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
