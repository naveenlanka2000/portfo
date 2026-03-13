import type { ReactNode } from 'react';

import { FaDatabase, FaJava } from 'react-icons/fa6';
import {
  SiCss,
  SiFlutter,
  SiHtml5,
  SiJavascript,
  SiMysql,
  SiNextdotjs,
  SiReact,
  SiSpringboot,
  SiTailwindcss,
  SiTypescript,
  SiPython,
} from 'react-icons/si';

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
      <SiTypescript className="h-full w-full text-[#3178C6]" aria-hidden="true" focusable={false} />
    </IconWrap>
  ),
  JavaScript: (
    <IconWrap>
      <SiJavascript className="h-full w-full text-[#F7DF1E]" aria-hidden="true" focusable={false} />
    </IconWrap>
  ),
  Python: (
    <IconWrap>
      <SiPython className="h-full w-full text-[#3776AB]" aria-hidden="true" focusable={false} />
    </IconWrap>
  ),
  HTML: (
    <IconWrap>
      <SiHtml5 className="h-full w-full text-[#E34F26]" aria-hidden="true" focusable={false} />
    </IconWrap>
  ),
  CSS: (
    <IconWrap>
      <SiCss className="h-full w-full text-[#1572B6]" aria-hidden="true" focusable={false} />
    </IconWrap>
  ),
  React: (
    <IconWrap>
      <SiReact className="h-full w-full text-[#61DAFB]" aria-hidden="true" focusable={false} />
    </IconWrap>
  ),
  'Next.js': (
    <IconWrap>
      <SiNextdotjs className="h-full w-full text-neutral-900" aria-hidden="true" focusable={false} />
    </IconWrap>
  ),
  Tailwind: (
    <IconWrap>
      <SiTailwindcss className="h-full w-full text-[#38BDF8]" aria-hidden="true" focusable={false} />
    </IconWrap>
  ),
  Java: (
    <IconWrap>
      <FaJava className="h-full w-full text-[#EA2D2E]" aria-hidden="true" focusable={false} />
    </IconWrap>
  ),
  Spring: (
    <IconWrap>
      <SiSpringboot className="h-full w-full text-[#6DB33F]" aria-hidden="true" focusable={false} />
    </IconWrap>
  ),
  Flutter: (
    <IconWrap>
      <SiFlutter className="h-full w-full text-[#02569B]" aria-hidden="true" focusable={false} />
    </IconWrap>
  ),
  MySQL: (
    <IconWrap>
      <SiMysql className="h-full w-full text-[#4479A1]" aria-hidden="true" focusable={false} />
    </IconWrap>
  ),
  SQL: (
    <IconWrap>
      <FaDatabase className="h-full w-full text-neutral-700" aria-hidden="true" focusable={false} />
    </IconWrap>
  ),
};

export const defaultLanguageTapeItems: LanguageTapeItem[] = [
  { name: 'TypeScript', alt: 'TypeScript', href: '/projects', svg: tapeIcons.TypeScript },
  { name: 'JavaScript', alt: 'JavaScript', href: '/projects', svg: tapeIcons.JavaScript },
  { name: 'Python', alt: 'Python', href: '/projects', svg: tapeIcons.Python },
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
