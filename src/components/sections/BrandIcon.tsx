
import { cx } from '@/lib/utils';

import type { IconType } from 'react-icons';
import { FaJava } from 'react-icons/fa';
import { FaDatabase, FaMobileScreenButton } from 'react-icons/fa6';
import {
  SiCss,
  SiDart,
  SiFlask,
  SiGit,
  SiHtml5,
  SiJavascript,
  SiJupyter,
  SiKeras,
  SiMysql,
  SiNumpy,
  SiOpencv,
  SiPandas,
  SiPostman,
  SiPython,
  SiReact,
  SiSpringboot,
  SiTensorflow,
  SiTypescript,
  SiFlutter,
} from 'react-icons/si';

export type BrandKind =
  | 'nforce'
  | 'java'
  | 'python'
  | 'typescript'
  | 'git'
  | 'postman'
  | 'tensorflow'
  | 'keras'
  | 'jupyter'
  | 'numpy'
  | 'pandas'
  | 'opencv'
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
  bare?: boolean;
};

export function BrandIcon({ kind, label, className, bare = false }: BrandIconProps) {
  const iconMap: Record<BrandKind, IconType> = {
    react: SiReact,
    java: FaJava,
    python: SiPython,
    typescript: SiTypescript,
    git: SiGit,
    postman: SiPostman,
    tensorflow: SiTensorflow,
    keras: SiKeras,
    jupyter: SiJupyter,
    numpy: SiNumpy,
    pandas: SiPandas,
    opencv: SiOpencv,
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
    typescript: 'text-blue-600',
    git: 'text-orange-600',
    postman: 'text-orange-500',
    tensorflow: 'text-orange-500',
    keras: 'text-red-500',
    jupyter: 'text-orange-500',
    numpy: 'text-blue-700',
    pandas: 'text-indigo-600',
    opencv: 'text-emerald-600',
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

  if (bare) {
    return (
      <span className="inline-flex items-center justify-center overflow-visible" aria-hidden="true" title={label}>
        <Icon className={cx('h-5 w-5', tintClass[kind], className)} focusable={false} aria-hidden="true" />
      </span>
    );
  }

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
