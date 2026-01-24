'use client';

import { cx } from '@/lib/utils';

type MarkProps = {
  className?: string;
  title: string;
};

export function NforceMark({ className, title }: MarkProps) {
  return (
    <svg
      className={cx('h-12 w-12', className)}
      viewBox="0 0 56 56"
      role="img"
      aria-label={title}
    >
      <defs>
        <linearGradient id="nforceAccent" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0a84ff" stopOpacity="0.9" />
          <stop offset="1" stopColor="#0a84ff" stopOpacity="0.35" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="54" height="54" rx="14" fill="white" />
      <rect x="1" y="1" width="54" height="54" rx="14" fill="url(#nforceAccent)" opacity="0.14" />
      <rect x="1" y="1" width="54" height="54" rx="14" fill="none" stroke="rgba(0,0,0,0.12)" />

      <path
        d="M18 38V18h4.6l10.8 14.1V18H38v20h-4.6L22.6 23.9V38H18z"
        fill="rgba(10,10,10,0.92)"
      />
      <path
        d="M18 38V18h4.6l10.8 14.1V18H38v20h-4.6L22.6 23.9V38H18z"
        fill="none"
        stroke="rgba(10,132,255,0.25)"
        strokeWidth="1"
      />
    </svg>
  );
}

export function LeafMark({ className, title }: MarkProps) {
  return (
    <svg
      className={cx('h-full w-full', className)}
      viewBox="0 0 560 420"
      role="img"
      aria-label={title}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="leafFill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0a84ff" stopOpacity="0.30" />
          <stop offset="1" stopColor="#0a84ff" stopOpacity="0.06" />
        </linearGradient>
      </defs>
      <rect width="560" height="420" fill="#ffffff" />
      <path
        d="M420 88c-82 6-150 42-202 106-50 61-70 122-62 182 58 4 118-20 178-70 66-55 106-128 118-218 1-8 2-16 2-0z"
        fill="url(#leafFill)"
      />
      <path
        d="M408 98c-72 10-132 44-178 103-43 54-62 110-56 168"
        fill="none"
        stroke="rgba(10,10,10,0.22)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M220 348c36-54 80-96 132-124"
        fill="none"
        stroke="rgba(10,10,10,0.18)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M304 304c10-28 28-56 54-82"
        fill="none"
        stroke="rgba(10,132,255,0.35)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

type TechMarkKind = 'Java' | 'Spring Boot' | 'React' | 'Flutter' | 'MySQL' | 'SQL' | 'HTML' | 'CSS' | 'JavaScript';

export function TechMark({ kind, className, title }: { kind: TechMarkKind; className?: string; title?: string }) {
  const label = title ?? kind;

  // Minimal, original, monochrome/duotone marks.
  switch (kind) {
    case 'React':
      return (
        <svg className={cx('h-4 w-4', className)} viewBox="0 0 16 16" role="img" aria-label={label}>
          <circle cx="8" cy="8" r="1.6" fill="currentColor" />
          <ellipse cx="8" cy="8" rx="6.5" ry="2.6" fill="none" stroke="currentColor" strokeOpacity="0.8" />
          <ellipse
            cx="8"
            cy="8"
            rx="6.5"
            ry="2.6"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.8"
            transform="rotate(60 8 8)"
          />
          <ellipse
            cx="8"
            cy="8"
            rx="6.5"
            ry="2.6"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.8"
            transform="rotate(120 8 8)"
          />
        </svg>
      );
    case 'Flutter':
      return (
        <svg className={cx('h-4 w-4', className)} viewBox="0 0 16 16" role="img" aria-label={label}>
          <path d="M3 8.2 9.2 2h3.1L6.1 8.2 9.2 11.3H6.1L3 8.2z" fill="currentColor" fillOpacity="0.85" />
          <path d="M6.1 11.3 9.2 8.2l3.1 3.1-3.1 3.1-3.1-3.1z" fill="currentColor" fillOpacity="0.55" />
        </svg>
      );
    case 'Java':
      return (
        <svg className={cx('h-4 w-4', className)} viewBox="0 0 16 16" role="img" aria-label={label}>
          <path
            d="M8 2.2c1.2 1-.1 1.6-.8 2.2-.7.6-.2 1.1.8 1.8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <path
            d="M5.3 9.4c0 1.8 5.4 1.8 5.4 0"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <path
            d="M4.8 11.2c0 2.2 6.4 2.2 6.4 0"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.75"
          />
        </svg>
      );
    case 'Spring Boot':
      return (
        <svg className={cx('h-4 w-4', className)} viewBox="0 0 16 16" role="img" aria-label={label}>
          <path
            d="M12.8 4.8c-1.3.2-2.7.9-4.1 2.3C7.2 8.5 6.5 10 6.3 11.3c1.3-.2 2.8-.9 4.2-2.4 1.4-1.4 2.1-2.8 2.3-4.1z"
            fill="currentColor"
            fillOpacity="0.18"
          />
          <path
            d="M12.8 4.8c-1.3.2-2.7.9-4.1 2.3C7.2 8.5 6.5 10 6.3 11.3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <path d="M4.2 12c1.6-.1 3.2-.9 4.8-2.5" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.75" />
        </svg>
      );
    case 'MySQL':
      return (
        <svg className={cx('h-4 w-4', className)} viewBox="0 0 16 16" role="img" aria-label={label}>
          <path
            d="M4 12.2c0-3.6 2.5-6.4 5.5-6.4 1.3 0 2.5.5 3.3 1.3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <path
            d="M6.1 12.2c0-2.6 1.7-4.6 3.4-4.6 1 0 1.9.4 2.5 1"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.75"
          />
          <circle cx="4" cy="12.2" r="1" fill="currentColor" />
        </svg>
      );
    case 'SQL':
      return (
        <svg className={cx('h-4 w-4', className)} viewBox="0 0 16 16" role="img" aria-label={label}>
          <path d="M3.2 4.2h9.6M3.2 7.1h9.6M3.2 10h6.4" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M11.2 9.6v3.2" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
        </svg>
      );
    case 'HTML':
      return (
        <svg className={cx('h-4 w-4', className)} viewBox="0 0 16 16" role="img" aria-label={label}>
          <path d="M4 2.6h8l-.7 9.2L8 13.4l-3.3-1.6L4 2.6z" fill="currentColor" fillOpacity="0.18" />
          <path d="M5.3 5.3h5.4M5.6 7.6h5M5.9 9.8h4.4" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
        </svg>
      );
    case 'CSS':
      return (
        <svg className={cx('h-4 w-4', className)} viewBox="0 0 16 16" role="img" aria-label={label}>
          <path d="M4 2.6h8l-.7 9.2L8 13.4l-3.3-1.6L4 2.6z" fill="currentColor" fillOpacity="0.14" />
          <path d="M5.4 5.6h5.2M5.7 8h4.6M6 10.4h4" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
        </svg>
      );
    case 'JavaScript':
      return (
        <svg className={cx('h-4 w-4', className)} viewBox="0 0 16 16" role="img" aria-label={label}>
          <rect x="2.3" y="2.3" width="11.4" height="11.4" rx="3" fill="currentColor" fillOpacity="0.14" />
          <path d="M7 6.2v4.8c0 1.1-.6 1.8-1.8 1.8" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M10.4 6.2c1.1 0 1.8.6 1.8 1.5 0 2-2.8 1-2.8 2.8 0 .8.7 1.5 2 1.5" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg className={cx('h-4 w-4', className)} viewBox="0 0 16 16" role="img" aria-label={label}>
          <circle cx="8" cy="8" r="6" fill="currentColor" fillOpacity="0.12" />
        </svg>
      );
  }
}
