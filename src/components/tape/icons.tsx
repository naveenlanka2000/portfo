import type { ReactNode } from 'react';

export type LanguageTapeItem = {
  name: string;
  alt: string;
  href?: string;
  svg?: ReactNode;
  src?: string;
};

function IconWrap({ children }: { children: ReactNode }) {
  return <span className="block h-10 w-10">{children}</span>;
}

export const tapeIcons: Record<string, ReactNode> = {
  TypeScript: (
    <IconWrap>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="4" fill="#3178C6" />
        <path
          d="M7.5 10h9v1.9h-3.4V18h-2.2v-6.1H7.5V10Zm9.6 8.2c-.5.4-1.3.7-2.3.7-1.8 0-3-.9-3.1-2.4h2.1c.1.6.5.9 1.1.9.6 0 1-.3 1-.7 0-.5-.4-.7-1.4-1-1.6-.5-2.6-1.1-2.6-2.6 0-1.4 1.2-2.4 3-2.4 1.6 0 2.7.8 2.9 2.3h-2.1c-.1-.5-.4-.8-.9-.8-.5 0-.8.3-.8.6 0 .4.3.6 1.3.9 1.8.6 2.7 1.3 2.7 2.7 0 .7-.3 1.3-.9 1.8Z"
          fill="#fff"
          fillOpacity="0.95"
        />
      </svg>
    </IconWrap>
  ),
  JavaScript: (
    <IconWrap>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="4" fill="#F7DF1E" />
        <path
          d="M12.7 17.8c.5.8 1.1 1.4 2.2 1.4.9 0 1.5-.5 1.5-1.1 0-.8-.6-1.1-1.7-1.6l-.6-.3c-1.7-.7-2.9-1.6-2.9-3.5 0-1.7 1.3-3 3.4-3 1.5 0 2.5.5 3.3 1.8l-1.8 1.1c-.4-.7-.8-1-1.5-1-.7 0-1.1.4-1.1 1 0 .7.4 1 1.4 1.4l.6.3c2 .8 3.2 1.7 3.2 3.7 0 2.1-1.7 3.2-3.9 3.2-2.2 0-3.6-1-4.3-2.4l2-1Z"
          fill="#111827"
          fillOpacity="0.9"
        />
        <path
          d="M7.3 18c.4.7.8 1.2 1.7 1.2.9 0 1.4-.3 1.4-1.7V9h2.4v8.7c0 2.6-1.5 3.8-3.7 3.8-2 0-3.2-1-3.8-2.3l2-1.2Z"
          fill="#111827"
          fillOpacity="0.9"
        />
      </svg>
    </IconWrap>
  ),
  HTML: (
    <IconWrap>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 3h16l-1.5 17L12 22l-6.5-2L4 3Z" fill="#E34F26" />
        <path d="M12 20.3 17.3 18.7 18.6 4.7H12v15.6Z" fill="#EF652A" />
        <path
          d="M7.4 7.8h4.6v2H9.6l.2 2.1h2.2v2H7.9L7.4 7.8Zm.6 8.4h4v2.1l-2-.6-1.9-.6.2-2.2Z"
          fill="#fff"
          fillOpacity="0.92"
        />
        <path
          d="M16.6 7.8H12v2h4.4l-.2 2.1H12v2h4.2l-.4 3.2-1.9.6-1.9.6v2.1l4-1.2.6-4.9.1-1 .4-3.5Z"
          fill="#fff"
          fillOpacity="0.92"
        />
      </svg>
    </IconWrap>
  ),
  CSS: (
    <IconWrap>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 3h16l-1.5 17L12 22l-6.5-2L4 3Z" fill="#1572B6" />
        <path d="M12 20.3 17.3 18.7 18.6 4.7H12v15.6Z" fill="#1B83C1" />
        <path
          d="M7.5 7.9H12v2H9.7l.2 2H12v2H7.9l-.4-5.9Zm.7 8.4H12v2.1l-2-.6-1.8-.6.1-1.9Z"
          fill="#fff"
          fillOpacity="0.92"
        />
        <path
          d="M16.5 7.9H12v2h4.3l-.2 2H12v2h4.1l-.4 3.2-1.8.6-1.9.6v2.1l4-1.2.7-5.2.2-1.3.3-3.2Z"
          fill="#fff"
          fillOpacity="0.92"
        />
      </svg>
    </IconWrap>
  ),
  React: (
    <IconWrap>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="2.2" fill="#149ECA" />
        <g fill="none" stroke="#149ECA" strokeWidth="1.6">
          <ellipse cx="12" cy="12" rx="9" ry="3.6" />
          <ellipse cx="12" cy="12" rx="3.6" ry="9" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="3.6" ry="9" transform="rotate(120 12 12)" />
        </g>
      </svg>
    </IconWrap>
  ),
  'Next.js': (
    <IconWrap>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="10" fill="#0B0B0C" />
        <path
          d="M8 8.2h2.1l4.2 5.6V8.2H16v7.6h-2l-4.3-5.7v5.7H8V8.2Z"
          fill="#fff"
          fillOpacity="0.92"
        />
        <path
          d="M17.2 17.2c-1.4 1.2-3.2 1.9-5.2 1.9-4.4 0-8-3.6-8-8 0-2 .7-3.8 1.9-5.2"
          fill="none"
          stroke="#ffffff"
          strokeOpacity="0.28"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
    </IconWrap>
  ),
  Tailwind: (
    <IconWrap>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 7c-2.7 0-4.4 1.3-5.2 3.9 1-1.3 2.1-1.8 3.5-1.5.8.2 1.4.8 2.1 1.5.9.9 2 2 4.6 2 2.7 0 4.4-1.3 5.2-3.9-1 1.3-2.1 1.8-3.5 1.5-.8-.2-1.4-.8-2.1-1.5C15.7 8.1 14.6 7 12 7Zm-5.2 5.1C4.1 12.1 2.4 13.4 1.6 16c1-1.3 2.1-1.8 3.5-1.5.8.2 1.4.8 2.1 1.5.9.9 2 2 4.6 2 2.7 0 4.4-1.3 5.2-3.9-1 1.3-2.1 1.8-3.5 1.5-.8-.2-1.4-.8-2.1-1.5-0.9-.9-2-2-4.6-2Z"
          fill="#38BDF8"
        />
      </svg>
    </IconWrap>
  ),
  Java: (
    <IconWrap>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8.3 16.6c.1 1.2 2 2.2 4.3 2.2 2.6 0 4.7-1 4.7-2.3 0-.8-.8-1.3-2-1.7.7.5 1 .9 1 1.3 0 1-1.7 1.8-3.8 1.8-1.9 0-3.5-.7-4.2-1.3Z" fill="#EA580C" />
        <path d="M10.2 5.4c1.2 1.5-.4 2.8-.4 2.8s2.9-1.4.4-2.8Z" fill="#2563EB" />
        <path d="M12.2 4c1.4 1.7-.5 3.2-.5 3.2s3.3-1.6.5-3.2Z" fill="#2563EB" />
        <path d="M14.3 5c1.1 1.5-.5 2.8-.5 2.8s3-1.4.5-2.8Z" fill="#2563EB" />
        <path d="M7.3 13.6c0-1.6 2.2-2.9 4.9-2.9 1.5 0 2.9.4 3.7 1-.8-.9-2.3-1.5-4-1.5-2.8 0-5 1.5-5 3.4 0 1.1.8 2 2.1 2.6-1.1-.7-1.7-1.6-1.7-2.6Z" fill="#111827" fillOpacity="0.9" />
      </svg>
    </IconWrap>
  ),
  Spring: (
    <IconWrap>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="9" fill="#16A34A" />
        <path
          d="M8.2 13.1c2.3-1.1 5-.5 7.6-2.3-1.6 3.3-4.6 6-8.4 6-1.4 0-2.4-.4-3-.9 1 .4 2.2.3 3.8-.8Z"
          fill="#fff"
          fillOpacity="0.92"
        />
      </svg>
    </IconWrap>
  ),
  Flutter: (
    <IconWrap>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M14.6 3.6 4.7 13.5l2.7 2.7L20 3.6h-5.4Z" fill="#42A5F5" />
        <path d="M10.6 17.6 4.7 23.5h5.4l3.2-3.2-2.7-2.7Z" fill="#0D47A1" />
        <path d="M13.3 20.3 20 13.6h-5.4l-4 4 2.7 2.7Z" fill="#1E88E5" />
      </svg>
    </IconWrap>
  ),
  MySQL: (
    <IconWrap>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M6.2 16.8c.6-2.1 2.7-3.5 5.2-3.5 2.3 0 4.3 1.2 5 3.1-.9-.5-2.1-.6-3.2-.4 1.8.2 3.1 1 3.2 2.1 0 1.4-1.9 2.4-4.7 2.4-2.9 0-5.1-1.1-5.5-2.7Z"
          fill="#0B4F6C"
        />
        <path d="M9.2 7.6c.7-1.5 2.2-2.5 4-2.5 1.2 0 2.2.4 3 1.1-1-.4-2.2-.2-3.1.4 1.2-.3 2.2 0 2.9.7.8.8.8 2 0 3.1.4-1.2 0-2.3-.8-2.9-.7-.5-1.6-.5-2.5.1-1.3.9-1.8 2.4-1.5 4.1-.6-1.3-.7-2.8 0-4.1Z" fill="#F59E0B" />
      </svg>
    </IconWrap>
  ),
  SQL: (
    <IconWrap>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <ellipse cx="12" cy="7" rx="7" ry="3" fill="#64748B" />
        <path d="M5 7v4c0 1.7 3.1 3 7 3s7-1.3 7-3V7" fill="#94A3B8" />
        <path d="M5 11v4c0 1.7 3.1 3 7 3s7-1.3 7-3v-4" fill="#CBD5E1" />
        <path d="M5 15v2c0 1.7 3.1 3 7 3s7-1.3 7-3v-2" fill="#E2E8F0" />
      </svg>
    </IconWrap>
  ),
};

export const defaultLanguageTapeItems: LanguageTapeItem[] = [
  { name: 'TypeScript', alt: 'TypeScript', href: '/projects', svg: tapeIcons.TypeScript },
  { name: 'JavaScript', alt: 'JavaScript', href: '/projects', svg: tapeIcons.JavaScript },
  { name: 'HTML', alt: 'HTML5', href: '/projects', svg: tapeIcons.HTML },
  { name: 'CSS', alt: 'CSS3', href: '/projects', svg: tapeIcons.CSS },
  { name: 'React', alt: 'React', href: '/projects', svg: tapeIcons.React },
  { name: 'Next.js', alt: 'Next.js', href: '/projects', svg: tapeIcons['Next.js'] },
  { name: 'Tailwind', alt: 'Tailwind CSS', href: '/projects', svg: tapeIcons.Tailwind },
  { name: 'Java', alt: 'Java', href: '/projects', svg: tapeIcons.Java },
  { name: 'Spring', alt: 'Spring Framework', href: '/projects', svg: tapeIcons.Spring },
  { name: 'Flutter', alt: 'Flutter', href: '/projects', svg: tapeIcons.Flutter },
  { name: 'MySQL', alt: 'MySQL', href: '/projects', svg: tapeIcons.MySQL },
  { name: 'SQL', alt: 'SQL', href: '/projects', svg: tapeIcons.SQL },
];
