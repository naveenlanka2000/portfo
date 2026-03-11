import Image from 'next/image';
import Link from 'next/link';

import { withBasePath } from '@/lib/utils';

export function SiteFooter() {
  return (
    <footer className="bg-neutral-100/80">
      <div className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-sm font-semibold text-neutral-900">Naveen Lanka</h4>
            <p className="mt-2 text-sm text-neutral-600">
              Software Engineer
            </p>
          </div>
          <div className="col-span-1">
            <h4 className="text-sm font-semibold text-neutral-900">Menu</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link className="text-neutral-600 hover:text-neutral-900" href="/">Home</Link></li>
              <li><Link className="text-neutral-600 hover:text-neutral-900" href="/about">About</Link></li>
              <li><Link className="text-neutral-600 hover:text-neutral-900" href="/projects">Projects</Link></li>
              <li><Link className="text-neutral-600 hover:text-neutral-900" href="/contact">Contact</Link></li>
            </ul>
          </div>
          <div className="col-span-1">
            <h4 className="text-sm font-semibold text-neutral-900">Connect</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><a className="text-neutral-600 hover:text-neutral-900" href="https://github.com/naveenlanka2000" target="_blank" rel="noreferrer">GitHub</a></li>
              <li><a className="text-neutral-600 hover:text-neutral-900" href="https://www.linkedin.com/in/naveen-lanka" target="_blank" rel="noreferrer">LinkedIn</a></li>
              <li><a className="text-neutral-600 hover:text-neutral-900" href="https://twitter.com/NaveenLanka" target="_blank" rel="noreferrer">X</a></li>
            </ul>
          </div>
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-sm font-semibold text-neutral-900">Contact</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><a className="text-neutral-600 hover:text-neutral-900" href="mailto:naveenlanka45@gmail.com">naveenlanka45@gmail.com</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-16 border-t border-neutral-900/10 pt-8 sm:mt-20 lg:mt-24 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-neutral-500">
            &copy; {new Date().getFullYear()} Naveen Lanka. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="https://github.com/naveenlanka2000" target="_blank" rel="noreferrer" className="text-neutral-500 hover:text-neutral-900">
              <Image src={withBasePath('/brands/github.svg')} alt="GitHub" width={24} height={24} sizes="24px" />
            </a>
            <a href="https://www.linkedin.com/in/naveen-lanka" target="_blank" rel="noreferrer" className="text-neutral-500 hover:text-neutral-900">
              <Image src={withBasePath('/brands/linkedin.svg')} alt="LinkedIn" width={24} height={24} sizes="24px" />
            </a>
            <a href="https://twitter.com/NaveenLanka" target="_blank" rel="noreferrer" className="text-neutral-500 hover:text-neutral-900">
              <Image src={withBasePath('/brands/x.svg')} alt="X" width={24} height={24} sizes="24px" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
