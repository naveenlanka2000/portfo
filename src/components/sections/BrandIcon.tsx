'use client';

import type { ReactNode } from 'react';

import { cx } from '@/lib/utils';

export type BrandKind =
  | 'nforce'
  | 'java'
  | 'spring-boot'
  | 'react'
  | 'flutter'
  | 'mysql'
  | 'sql'
  | 'html'
  | 'css'
  | 'javascript';

export type BrandIconProps = {
  kind: BrandKind;
  label: string;
  className?: string;
};

export function BrandIcon({ kind, label, className }: BrandIconProps) {
  // Original, portfolio-safe marks (not trademarked official logos).
  // Keeps visuals crisp and avoids runtime fetch/404 issues.
  const ink = '#0A0A0A';

  const palette: Record<BrandKind, { a: string; b?: string }> = {
    react: { a: '#61DAFB' },
    java: { a: '#E11D48', b: '#2563EB' },
    'spring-boot': { a: '#22C55E' },
    flutter: { a: '#0EA5E9', b: '#1D4ED8' },
    mysql: { a: '#2563EB', b: '#F59E0B' },
    sql: { a: '#A855F7' },
    html: { a: '#F97316' },
    css: { a: '#3B82F6' },
    javascript: { a: '#FACC15' },
    nforce: { a: '#0A84FF' },
  };

  const { a: accent, b: accent2 } = palette[kind];

  const wrapperClassName = cx(
    'inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white ring-1 ring-black/10',
    className
  );

  const common = {
    width: 40,
    height: 40,
    viewBox: '0 0 40 40',
    role: 'img' as const,
    'aria-label': label,
    className: 'h-full w-full',
  };

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <span className={wrapperClassName} aria-hidden="true">
      {children}
    </span>
  );

  switch (kind) {
    case 'react':
      return (
        <Wrapper>
          <svg xmlns="http://www.w3.org/2000/svg" {...common}>
            <circle cx="20" cy="20" r="2.2" fill={accent} />
            <g stroke={accent} strokeOpacity="0.95" strokeWidth="1.7" fill="none">
              <ellipse cx="20" cy="20" rx="14" ry="5.6" />
              <ellipse cx="20" cy="20" rx="14" ry="5.6" transform="rotate(60 20 20)" />
              <ellipse cx="20" cy="20" rx="14" ry="5.6" transform="rotate(120 20 20)" />
            </g>
          </svg>
        </Wrapper>
      );
    case 'java':
      return (
        <Wrapper>
          <svg xmlns="http://www.w3.org/2000/svg" {...common}>
            <path d="M16 27.8c0 2.5 8 2.5 8 0" stroke={accent2 ?? ink} strokeOpacity="0.65" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M13.8 30c0 3.3 12.4 3.3 12.4 0" stroke={accent2 ?? ink} strokeOpacity="0.35" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M20.7 9.2c2 1.6-.5 2.6-1.7 3.5-1.2.9-.4 1.8 1.7 2.9" stroke={accent} strokeOpacity="0.95" strokeWidth="1.9" strokeLinecap="round" />
            <path d="M23.4 10.2c1.2.9.2 1.5-.5 2-.8.6-.4 1.2.5 1.7" stroke={accent2 ?? ink} strokeOpacity="0.75" strokeWidth="1.9" strokeLinecap="round" />
          </svg>
        </Wrapper>
      );
    case 'spring-boot':
      return (
        <Wrapper>
          <svg xmlns="http://www.w3.org/2000/svg" {...common}>
            <path
              d="M29.5 14.2c-3.4.4-6.7 2.2-9.6 5.1-3 3-4.7 6.2-5.1 9.6 3.4-.4 6.7-2.1 9.7-5.1 2.9-2.9 4.7-6.2 5-9.6Z"
              fill={accent}
              fillOpacity="0.16"
            />
            <path d="M29.5 14.2c-3.4.4-6.7 2.2-9.6 5.1-3 3-4.7 6.2-5.1 9.6" stroke={accent} strokeOpacity="0.9" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M12.5 28.6c4-.3 7.7-2.2 11.4-5.9" stroke={ink} strokeOpacity="0.28" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M22 20.4c-1.1 2.3-2.5 4.4-4.4 6.2" stroke={accent} strokeOpacity="0.85" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </Wrapper>
      );
    case 'flutter':
      return (
        <Wrapper>
          <svg xmlns="http://www.w3.org/2000/svg" {...common}>
            <path d="M12 20.3 23.3 9h5.6L17.6 20.3 23.3 26H17.6L12 20.3Z" fill={accent} fillOpacity="0.92" />
            <path d="M17.6 26 23.3 20.3 29 26l-5.7 5.7L17.6 26Z" fill={accent2 ?? accent} fillOpacity="0.9" />
            <path d="M23.3 20.3 29 26" stroke={ink} strokeOpacity="0.22" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </Wrapper>
      );
    case 'mysql':
      return (
        <Wrapper>
          <svg xmlns="http://www.w3.org/2000/svg" {...common}>
            <path d="M11.5 16.4c0-3.2 17-3.2 17 0v7.2c0 3.2-17 3.2-17 0v-7.2Z" fill={accent} fillOpacity="0.10" />
            <path d="M11.5 16.4c0-3.2 17-3.2 17 0v7.2c0 3.2-17 3.2-17 0v-7.2Z" stroke={accent} strokeOpacity="0.9" strokeWidth="1.7" />
            <path d="M28.5 16.4c0 3.2-17 3.2-17 0" stroke={accent} strokeOpacity="0.55" strokeWidth="1.7" />
            <path d="M28.5 20c0 3.2-17 3.2-17 0" stroke={accent} strokeOpacity="0.35" strokeWidth="1.7" />
            <path d="M29.2 27.3c2.6-.2 4.8 1.5 4.8 3.7" stroke={accent2 ?? accent} strokeOpacity="0.95" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        </Wrapper>
      );
    case 'sql':
      return (
        <Wrapper>
          <svg xmlns="http://www.w3.org/2000/svg" {...common}>
            <path d="M12.5 14.5h15" stroke={accent} strokeOpacity="0.95" strokeWidth="1.9" strokeLinecap="round" />
            <path d="M12.5 19.5h15" stroke={accent} strokeOpacity="0.72" strokeWidth="1.9" strokeLinecap="round" />
            <path d="M12.5 24.5h10" stroke={accent} strokeOpacity="0.55" strokeWidth="1.9" strokeLinecap="round" />
            <path d="M28.5 23.5v8" stroke={ink} strokeOpacity="0.22" strokeWidth="1.9" strokeLinecap="round" />
            <path d="M28.5 31.5h-3.5" stroke={ink} strokeOpacity="0.22" strokeWidth="1.9" strokeLinecap="round" />
          </svg>
        </Wrapper>
      );
    case 'html':
      return (
        <Wrapper>
          <svg xmlns="http://www.w3.org/2000/svg" {...common}>
            <path d="M16 14.5 10.5 20 16 25.5" stroke={accent} strokeOpacity="0.95" strokeWidth="2.0" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M24 14.5 29.5 20 24 25.5" stroke={accent} strokeOpacity="0.95" strokeWidth="2.0" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Wrapper>
      );
    case 'css':
      return (
        <Wrapper>
          <svg xmlns="http://www.w3.org/2000/svg" {...common}>
            <path d="M16.5 14.5c-2 0-3.5 1.5-3.5 3.5S14.5 21.5 16.5 21.5c-2 0-3.5 1.5-3.5 3.5s1.5 3.5 3.5 3.5" stroke={accent} strokeOpacity="0.95" strokeWidth="2" strokeLinecap="round" />
            <path d="M23.5 14.5c2 0 3.5 1.5 3.5 3.5s-1.5 3.5-3.5 3.5c2 0 3.5 1.5 3.5 3.5s-1.5 3.5-3.5 3.5" stroke={accent} strokeOpacity="0.95" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </Wrapper>
      );
    case 'javascript':
      return (
        <Wrapper>
          <svg xmlns="http://www.w3.org/2000/svg" {...common}>
            <rect x="10" y="10" width="20" height="20" rx="6" fill={accent} fillOpacity="0.92" />
            <path d="M17.2 15.8v10.3c0 2-1.1 3.1-3.1 3.1" stroke={ink} strokeOpacity="0.9" strokeWidth="1.9" strokeLinecap="round" />
            <path d="M24.4 15.8c2 0 3.2 1.1 3.2 2.7 0 3.4-5 1.8-5 5.1 0 1.6 1.3 2.6 3.7 2.6" stroke={ink} strokeOpacity="0.9" strokeWidth="1.9" strokeLinecap="round" />
          </svg>
        </Wrapper>
      );
    case 'nforce':
      return (
        <Wrapper>
          <svg xmlns="http://www.w3.org/2000/svg" {...common}>
            <rect x="7" y="7" width="26" height="26" rx="10" fill={accent} fillOpacity="0.10" />
            <path d="M13 28V12h3.7l10.6 11.6V12H31v16h-3.7L16.7 16.4V28H13z" fill={accent} fillOpacity="0.95" />
          </svg>
        </Wrapper>
      );
    default:
      return (
        <Wrapper>
          <svg xmlns="http://www.w3.org/2000/svg" {...common}>
            <circle cx="20" cy="20" r="6" fill={ink} fillOpacity="0.12" />
          </svg>
        </Wrapper>
      );
  }
}
