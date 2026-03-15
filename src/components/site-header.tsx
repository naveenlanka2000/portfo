/* eslint-disable jsx-a11y/anchor-is-valid */
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FaBriefcase, FaCode, FaEnvelope, FaMicroscope, FaUser } from 'react-icons/fa';

import { withBasePath } from '@/lib/utils';

function prefersReducedMotion() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
}

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const behavior: ScrollBehavior = prefersReducedMotion() ? 'auto' : 'smooth';
  el.scrollIntoView({ behavior, block: 'start' });
}

const navItems = [
  { href: '/#experience', label: 'Experience', Icon: FaBriefcase },
  { href: '/#research', label: 'Research', Icon: FaMicroscope },
  { href: '/#projects', label: 'Projects', Icon: FaCode },
  { href: '/about', label: 'About', Icon: FaUser },
  { href: '/contact', label: 'Contact', Icon: FaEnvelope },
] as const;

type NavHref = (typeof navItems)[number]['href'];

export function SiteHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const reduced = useReducedMotion();

  const [desktop, setDesktop] = useState(false);

  const [hash, setHash] = useState<string>('');
  const [hovered, setHovered] = useState<NavHref | null>(null);
  const dockRef = useRef<HTMLDivElement | null>(null);
  const [mobileTooltip, setMobileTooltip] = useState<{ x: number; label: string } | null>(null);
  const [mobileSelected, setMobileSelected] = useState<NavHref | null>(null);
  const pointerRafRef = useRef<number | null>(null);
  const clearHoverTimeoutRef = useRef<number | null>(null);
  const clearMobileSelectedTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const read = () => setHash(window.location.hash || '');
    read();
    window.addEventListener('hashchange', read);
    return () => window.removeEventListener('hashchange', read);
  }, []);

  useEffect(() => {
    const mql = window.matchMedia?.('(min-width: 768px)');
    if (!mql) return;

    const apply = () => setDesktop(!!mql.matches);
    apply();

    // Safari < 14 uses addListener/removeListener.
    const anyMql = mql as unknown as {
      addEventListener?: (type: 'change', listener: () => void) => void;
      removeEventListener?: (type: 'change', listener: () => void) => void;
      addListener?: (listener: () => void) => void;
      removeListener?: (listener: () => void) => void;
    };

    if (typeof anyMql.addEventListener === 'function') anyMql.addEventListener('change', apply);
    else anyMql.addListener?.(apply);

    return () => {
      if (typeof anyMql.removeEventListener === 'function') anyMql.removeEventListener('change', apply);
      else anyMql.removeListener?.(apply);
    };
  }, []);

  useEffect(() => {
    if (desktop) {
      setMobileTooltip(null);
      return;
    }

    if (!hovered) {
      setMobileTooltip(null);
      return;
    }

    const dock = dockRef.current;
    if (!dock) return;

    const anchor = dock.querySelector<HTMLAnchorElement>(`a[data-nav-href="${CSS.escape(hovered)}"]`);
    if (!anchor) return;

    const dockRect = dock.getBoundingClientRect();
    const aRect = anchor.getBoundingClientRect();
    const rawX = aRect.left - dockRect.left + aRect.width / 2;
    const x = Math.max(28, Math.min(dockRect.width - 28, rawX));
    const label = navItems.find((i) => i.href === hovered)?.label ?? '';
    setMobileTooltip({ x, label });
  }, [desktop, hovered]);

  useEffect(() => {
    return () => {
      if (pointerRafRef.current != null) window.cancelAnimationFrame(pointerRafRef.current);
      if (clearHoverTimeoutRef.current != null) window.clearTimeout(clearHoverTimeoutRef.current);
      if (clearMobileSelectedTimeoutRef.current != null) window.clearTimeout(clearMobileSelectedTimeoutRef.current);
    };
  }, []);

  const scheduleClearHover = (delayMs = 450) => {
    if (clearHoverTimeoutRef.current != null) window.clearTimeout(clearHoverTimeoutRef.current);
    clearHoverTimeoutRef.current = window.setTimeout(() => {
      setHovered(null);
    }, delayMs);
  };

  const scheduleClearMobileSelected = (delayMs = 1300) => {
    if (clearMobileSelectedTimeoutRef.current != null) window.clearTimeout(clearMobileSelectedTimeoutRef.current);
    clearMobileSelectedTimeoutRef.current = window.setTimeout(() => {
      setMobileSelected(null);
    }, delayMs);
  };

  const onDockPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (desktop) return;
    if (e.pointerType !== 'touch') return;

    if (clearHoverTimeoutRef.current != null) {
      window.clearTimeout(clearHoverTimeoutRef.current);
      clearHoverTimeoutRef.current = null;
    }

    const { clientX, clientY } = e;
    if (pointerRafRef.current != null) return;
    pointerRafRef.current = window.requestAnimationFrame(() => {
      pointerRafRef.current = null;
      const el = document.elementFromPoint(clientX, clientY) as HTMLElement | null;
      const anchor = el?.closest?.('a[data-nav-href]') as HTMLAnchorElement | null;
      const href = (anchor?.dataset?.navHref as NavHref | undefined) ?? undefined;
      if (href) setHovered(href);
    });
  };

  const activeHref = useMemo<NavHref | null>(() => {
    // Route pages
    const routeHit = navItems.find((l) => !l.href.startsWith('/#') && l.href === pathname);
    if (routeHit) return routeHit.href;

    // Home sections
    if (pathname === '/' && hash) {
      const sectionHit = navItems.find((l) => l.href.startsWith('/#') && l.href === `/${hash}`);
      if (sectionHit) return sectionHit.href;
    }

    return null;
  }, [hash, pathname]);

  const highlighted = hovered ?? activeHref;

  const onNavClick = (href: NavHref) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (href.startsWith('/#')) return onAnchorClick(href.replace('/#', '#'))(e);

    e.preventDefault();
    router.push(withBasePath(href));
  };

  const onAnchorClick = (hash: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const id = decodeURIComponent(hash.replace(/^#/, ''));

    // If we're already on home, update hash without triggering a hard jump.
    if (pathname === '/') {
      window.history.pushState(null, '', withBasePath(`/#${id}`));
      scrollToId(id);
      return;
    }

    // Navigate to home without default scroll; HashScroller will handle smooth scrolling.
    router.push(withBasePath(`/#${id}`), { scroll: false });
  };

  return (
    <header
      className="sticky top-0 z-40 border-b border-[rgb(var(--header-border)/var(--header-border-alpha))] bg-[rgb(var(--header-bg)/var(--header-bg-alpha))] backdrop-blur supports-[backdrop-filter]:bg-[rgb(var(--header-bg)/var(--header-bg-alpha-blur))]"
    >
      <div className="mx-auto grid h-16 max-w-6xl grid-cols-[auto_1fr_auto] items-center px-5">
        <Link href="/" className="group inline-flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-xl bg-[rgb(var(--header-badge-bg))] text-sm font-semibold text-[rgb(var(--header-badge-fg))] shadow-soft">
            N
          </span>
          <span className="hidden text-sm font-medium tracking-tight text-[rgb(var(--header-fg))] md:inline">
            Naveen Lanka
            <span className="text-[rgb(var(--header-muted))]"> — Software Engineer</span>
          </span>
        </Link>

        <nav
          aria-label="Primary"
          className="flex items-center justify-center"
          onMouseLeave={() => setHovered(null)}
        >
          <div
            ref={dockRef}
            className="nav-dock relative flex items-center rounded-full p-1 backdrop-blur md:p-1.5"
            onPointerMove={onDockPointerMove}
            onPointerUp={() => scheduleClearHover(220)}
            onPointerCancel={() => scheduleClearHover(180)}
            onPointerLeave={() => scheduleClearHover(180)}
          >
            <AnimatePresence>
              {!desktop && mobileTooltip && !mobileSelected ? (
                <motion.div
                  key="mobile-nav-tooltip"
                  aria-hidden
                  initial={
                    reduced
                      ? false
                      : {
                          opacity: 0,
                          y: 8,
                          x: mobileTooltip.x,
                        }
                  }
                  animate={
                    reduced
                      ? { opacity: 1, y: 0 }
                      : {
                          opacity: 1,
                          y: 0,
                          x: mobileTooltip.x,
                        }
                  }
                  exit={reduced ? undefined : { opacity: 0, y: 8 }}
                  transition={
                    reduced
                      ? { duration: 0 }
                      : {
                          opacity: { duration: 0.16, ease: [0.16, 1, 0.3, 1] },
                          y: { duration: 0.18, ease: [0.16, 1, 0.3, 1] },
                          x: { type: 'spring', stiffness: 520, damping: 40, mass: 0.9 },
                        }
                  }
                  className="pointer-events-none absolute -top-10 left-0 z-20 -translate-x-1/2 rounded-full bg-black/80 px-2.5 py-1 text-[11px] font-semibold tracking-tight text-white shadow-soft will-change-transform"
                >
                  {mobileTooltip.label}
                </motion.div>
              ) : null}
            </AnimatePresence>

            {navItems.map((item) => {
              const isActive = activeHref === item.href;
              const isHovered = hovered === item.href;
              const isHighlighted = highlighted === item.href;
              const expanded = desktop ? isActive || isHovered : mobileSelected === item.href;

              return (
                <div key={item.href} className="relative">
                  {isHighlighted ? (
                    <motion.span
                      layoutId="nav-dock-indicator"
                      aria-hidden
                      className="nav-dock-indicator absolute inset-0 rounded-full"
                      transition={
                        reduced
                          ? { duration: 0 }
                          : { type: 'spring', stiffness: 420, damping: 38, mass: 0.85 }
                      }
                    />
                  ) : null}

                  <motion.a
                    layout={desktop}
                    href={withBasePath(item.href)}
                    data-nav-href={item.href}
                    onMouseEnter={() => setHovered(item.href)}
                    onFocus={() => setHovered(item.href)}
                    onPointerDown={(e) => {
                      if (!desktop && e.pointerType === 'touch') {
                        setMobileSelected(item.href);
                        scheduleClearMobileSelected();
                        setHovered(item.href);
                        scheduleClearHover(1200);
                      }
                    }}
                    onClick={onNavClick(item.href)}
                    aria-current={isActive ? 'page' : undefined}
                    className={
                      [
                        'group relative z-10 inline-flex items-center gap-2 rounded-full',
                        'text-[rgb(var(--header-link))] hover:text-[rgb(var(--header-link-hover))]',
                        'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/40',
                        'select-none',
                      ].join(' ')
                    }
                    variants={
                      reduced
                        ? undefined
                        : {
                            expanded: {
                              paddingLeft: desktop ? 14 : 10,
                              paddingRight: desktop ? 14 : 10,
                              transition: { type: 'spring', stiffness: 460, damping: 36, mass: 0.9 },
                            },
                            collapsed: {
                              paddingLeft: desktop ? 12 : 8,
                              paddingRight: desktop ? 12 : 8,
                              // Slightly more damping on the way back feels smoother.
                              transition: { type: 'spring', stiffness: 360, damping: 40, mass: 0.95 },
                            },
                          }
                    }
                    animate={reduced ? undefined : expanded ? 'expanded' : 'collapsed'}
                    style={
                      desktop
                        ? undefined
                        : {
                            paddingLeft: 8,
                            paddingRight: 8,
                          }
                    }
                  >
                    <motion.span
                      className="grid place-items-center rounded-full bg-white/0 size-7 md:size-9"
                      variants={
                        reduced
                          ? undefined
                          : {
                              expanded: {
                                scale: 1.12,
                                transition: { type: 'spring', stiffness: 460, damping: 34, mass: 0.9 },
                              },
                              collapsed: {
                                scale: 1,
                                transition: { type: 'spring', stiffness: 360, damping: 40, mass: 0.95 },
                              },
                            }
                      }
                      animate={reduced ? undefined : expanded ? 'expanded' : 'collapsed'}
                    >
                      <item.Icon className="h-[15px] w-[15px] md:h-[18px] md:w-[18px]" aria-hidden />
                    </motion.span>

                    <motion.span
                      aria-hidden={!expanded}
                      className={
                        desktop
                          ? 'pr-0.5 text-sm font-semibold tracking-tight overflow-hidden whitespace-nowrap'
                          : 'pr-0.5 text-xs font-semibold tracking-tight overflow-hidden whitespace-nowrap'
                      }
                      variants={
                        reduced
                          ? undefined
                          : desktop
                            ? {
                                expanded: {
                                  opacity: 1,
                                  x: 0,
                                  maxWidth: 140,
                                  transition: {
                                    opacity: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
                                    x: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
                                    maxWidth: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
                                  },
                                },
                                collapsed: {
                                  opacity: 0,
                                  x: -6,
                                  maxWidth: 0,
                                  transition: {
                                    opacity: { duration: 0.16, ease: [0.16, 1, 0.3, 1] },
                                    x: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
                                    maxWidth: { duration: 0.32, ease: [0.16, 1, 0.3, 1] },
                                  },
                                },
                              }
                            : {
                                expanded: {
                                  opacity: 1,
                                  x: 0,
                                  maxWidth: 96,
                                  transition: {
                                    opacity: { duration: 0.18, ease: [0.16, 1, 0.3, 1] },
                                    x: { duration: 0.18, ease: [0.16, 1, 0.3, 1] },
                                    maxWidth: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
                                  },
                                },
                                collapsed: {
                                  opacity: 0,
                                  x: -6,
                                  maxWidth: 0,
                                  transition: {
                                    opacity: { duration: 0.14, ease: [0.16, 1, 0.3, 1] },
                                    x: { duration: 0.16, ease: [0.16, 1, 0.3, 1] },
                                    maxWidth: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
                                  },
                                },
                              }
                      }
                      animate={reduced ? undefined : expanded ? 'expanded' : 'collapsed'}
                      style={reduced ? undefined : { pointerEvents: 'none' }}
                    >
                      {item.label}
                    </motion.span>
                  </motion.a>
                </div>
              );
            })}
          </div>
        </nav>

        <Link
          href="/projects"
          className="hidden items-center justify-center rounded-full bg-[rgb(var(--header-cta-bg))] px-4 py-2 text-sm font-medium text-[rgb(var(--header-cta-fg))] shadow-soft transition-transform duration-200 active:scale-95 md:inline-flex"
        >
          View work
        </Link>
      </div>
    </header>
  );
}
