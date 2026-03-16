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
        <linearGradient id="leafBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#eef6ff" />
          <stop offset="0.52" stopColor="#d9ebff" />
          <stop offset="1" stopColor="#f6fbff" />
        </linearGradient>
        <radialGradient id="leafGlowA" cx="0" cy="0" r="1" gradientTransform="translate(118 108) rotate(31) scale(188 154)">
          <stop offset="0" stopColor="#0a84ff" stopOpacity="0.34" />
          <stop offset="1" stopColor="#0a84ff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="leafGlowB" cx="0" cy="0" r="1" gradientTransform="translate(434 312) rotate(180) scale(176 132)">
          <stop offset="0" stopColor="#38bdf8" stopOpacity="0.22" />
          <stop offset="1" stopColor="#38bdf8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="leafFill" x1="0.14" y1="0.08" x2="0.92" y2="0.9">
          <stop offset="0" stopColor="#1d4ed8" stopOpacity="0.98" />
          <stop offset="0.48" stopColor="#0ea5e9" stopOpacity="0.92" />
          <stop offset="1" stopColor="#93c5fd" stopOpacity="0.82" />
        </linearGradient>
        <linearGradient id="leafVein" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#eff6ff" stopOpacity="0.9" />
          <stop offset="1" stopColor="#bfdbfe" stopOpacity="0.32" />
        </linearGradient>
        <filter id="leafShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="18" stdDeviation="18" floodColor="#1d4ed8" floodOpacity="0.18" />
        </filter>
        <pattern id="leafGrid" width="28" height="28" patternUnits="userSpaceOnUse">
          <path d="M28 0H0V28" fill="none" stroke="#0f172a" strokeOpacity="0.06" />
        </pattern>
        <clipPath id="leafClip">
          <path d="M422 82c-84 8-153 46-206 112-48 59-69 118-62 176 61 6 124-19 188-73 68-58 108-132 118-223-12 1-25 4-38 8z" />
        </clipPath>
        <linearGradient id="leafStem" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1e3a8a" stopOpacity="0.72" />
          <stop offset="1" stopColor="#0f172a" stopOpacity="0.22" />
        </linearGradient>
      </defs>

      <rect width="560" height="420" rx="28" fill="url(#leafBg)" />
      <rect width="560" height="420" rx="28" fill="url(#leafGrid)" />
      <circle cx="126" cy="114" r="132" fill="url(#leafGlowA)" />
      <circle cx="438" cy="312" r="126" fill="url(#leafGlowB)" />

      <g opacity="0.72">
        <path d="M74 312c78-58 144-83 198-75" fill="none" stroke="#0a84ff" strokeOpacity="0.12" strokeWidth="2" />
        <path d="M308 82c78 14 132 44 164 90" fill="none" stroke="#0f172a" strokeOpacity="0.08" strokeWidth="2" />
      </g>

      <path
        d="M422 82c-84 8-153 46-206 112-48 59-69 118-62 176 61 6 124-19 188-73 68-58 108-132 118-223-12 1-25 4-38 8z"
        fill="url(#leafFill)"
        filter="url(#leafShadow)"
      />
      <path
        d="M262 352c38-60 86-109 145-148"
        fill="none"
        stroke="url(#leafStem)"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d="M408 102c-72 10-132 44-178 103-43 54-62 110-56 168"
        fill="none"
        stroke="url(#leafVein)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M226 336c36-54 80-96 132-124"
        fill="none"
        stroke="url(#leafVein)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M308 302c11-27 29-55 56-81"
        fill="none"
        stroke="url(#leafVein)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      <g clipPath="url(#leafClip)" opacity="0.38">
        <path d="M214 114 414 314" stroke="#eff6ff" strokeWidth="16" />
        <path d="M192 152 384 344" stroke="#bfdbfe" strokeWidth="10" strokeOpacity="0.72" />
      </g>

      <circle cx="420" cy="84" r="7" fill="#ffffff" fillOpacity="0.9" />
      <circle cx="434" cy="98" r="3" fill="#1d4ed8" fillOpacity="0.32" />
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
