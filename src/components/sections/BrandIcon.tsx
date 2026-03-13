
import { cx } from '@/lib/utils';

import type { IconType } from 'react-icons';
import { FaJava } from 'react-icons/fa';
import { FaDatabase, FaMobileScreenButton } from 'react-icons/fa6';
import {
  SiCss,
  SiDart,
  SiFlask,
  SiHtml5,
  SiJavascript,
  SiMysql,
  SiPython,
  SiReact,
  SiSpringboot,
  SiFlutter,
} from 'react-icons/si';

export type BrandKind =
  | 'nforce'
  | 'java'
  | 'python'
  | 'spring-boot'
  | 'flask'
  | 'react'
  | 'flutter'
  | 'dart'
  | 'mysql'
  | 'sql'
  | 'html'
  | 'css'
  | 'javascript'
  | 'data-modeling'
  | 'mobile-ui'
  | 'generic';

export type BrandIconProps = {
  kind: BrandKind;
  label: string;
  className?: string;
};

export function BrandIcon({ kind, label, className }: BrandIconProps) {
  const iconMap: Record<BrandKind, IconType> = {
    react: SiReact,
    java: FaJava,
    python: SiPython,
    'spring-boot': SiSpringboot,
    flask: SiFlask,
    flutter: SiFlutter,
    dart: SiDart,
    mysql: SiMysql,
    sql: FaDatabase,
    html: SiHtml5,
    css: SiCss,
    javascript: SiJavascript,
    'data-modeling': FaDatabase,
    'mobile-ui': FaMobileScreenButton,
    nforce: FaMobileScreenButton,
    generic: FaDatabase,
  };

  const tintClass: Record<BrandKind, string> = {
    react: 'text-sky-400',
    java: 'text-rose-500',
    python: 'text-blue-600',
    'spring-boot': 'text-green-500',
    flask: 'text-neutral-900',
    flutter: 'text-sky-500',
    dart: 'text-cyan-500',
    mysql: 'text-blue-700',
    sql: 'text-violet-500',
    html: 'text-orange-500',
    css: 'text-blue-500',
    javascript: 'text-yellow-400',
    'data-modeling': 'text-violet-500',
    'mobile-ui': 'text-green-500',
    nforce: 'text-accent-500',
    generic: 'text-neutral-700',
  };

  const Icon = iconMap[kind] ?? FaDatabase;

  const wrapperClassName = cx(
    'relative inline-flex h-10 w-10 origin-center items-center justify-center rounded-xl bg-white ring-1 ring-black/10',
    'transition-transform duration-200 ease-out hover:scale-150 hover:z-10',
    className
  );

  return (
    <span className={wrapperClassName} aria-hidden="true" title={label}>
      <Icon className={cx('h-full w-full', tintClass[kind])} focusable={false} aria-hidden="true" />
    </span>
  );
}
