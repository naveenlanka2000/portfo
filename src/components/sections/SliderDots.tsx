'use client';

import { motion } from 'framer-motion';

import { cx } from '@/lib/utils';

type SliderDotsProps = {
  count: number;
  activeIndex: number;
  isPlaying: boolean;
  progress: number;
  onTogglePlay: () => void;
  onSelect?: (index: number) => void;
  className?: string;
  disabled?: boolean;
};

export function SliderDots({
  count,
  activeIndex,
  isPlaying,
  progress,
  onTogglePlay,
  onSelect,
  className,
  disabled = false,
}: SliderDotsProps) {
  return (
    <div className={cx('relative mt-5 flex min-h-8 items-center justify-center', className)}>
      <div className="flex items-center justify-center gap-3">
        {Array.from({ length: count }).map((_, index) => {
          const isActive = index === activeIndex;

          return (
            <button
              key={index}
              type="button"
              onClick={() => onSelect?.(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={isActive}
              disabled={disabled}
              className={cx(
                'inline-flex h-6 items-center justify-center',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500',
                'disabled:cursor-not-allowed disabled:opacity-60'
              )}
            >
              <motion.div
                animate={{
                  width: isActive ? 36 : 10,
                  opacity: isActive ? 1 : 0.8,
                }}
                transition={{
                  duration: 0.9,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative h-2.5 overflow-hidden rounded-full border border-black/10 bg-neutral-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_1px_4px_rgba(15,23,42,0.08)]"
              >
                {isActive ? (
                  <div
                    className="absolute inset-0 origin-left rounded-full bg-neutral-950 shadow-[0_1px_6px_rgba(15,23,42,0.14)] will-change-transform"
                    style={{
                      transform: `translateZ(0) scaleX(${progress})`,
                    }}
                  />
                ) : null}
              </motion.div>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onTogglePlay}
        aria-label={isPlaying ? 'Pause slider' : 'Play slider'}
        disabled={disabled}
        className={cx(
          'absolute right-0 inline-flex h-8 w-8 items-center justify-center rounded-full',
          'border border-black/10 bg-white/85 text-neutral-900 shadow-soft backdrop-blur-md',
          'transition hover:scale-[1.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500',
          'disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:scale-100'
        )}
      >
        {isPlaying ? (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <rect x="2" y="2" width="3" height="8" rx="1" fill="currentColor" />
            <rect x="7" y="2" width="3" height="8" rx="1" fill="currentColor" />
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" className="translate-x-px">
            <path
              d="M4 2.6v6.8c0 .45.5.73.9.5l5.5-3.4a.58.58 0 000-1L4.9 2.1c-.4-.24-.9.05-.9.5z"
              fill="currentColor"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
