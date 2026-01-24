import { Variants } from 'framer-motion';

import { motionTokens } from '@/lib/motion-tokens';

export const carouselMotion = {
  durations: {
    short: motionTokens.durations.short / 1000,
    medium: motionTokens.durations.medium / 1000,
    long: motionTokens.durations.long / 1000,
    butter: 0.58,
  },
  easing: {
    defaultCurve: motionTokens.ease,
    butterCurve: [0.22, 1, 0.36, 1] as const,
  },
} as const;

export type CarouselAnimationPreset = 'butter' | 'fade' | 'slide';

type SlideCustom = {
  direction: -1 | 0 | 1;
  reduced: boolean;
  jump: boolean;
};

export function getSlideVariants(preset: CarouselAnimationPreset): Variants {
  const { durations, easing } = carouselMotion;

  if (preset === 'fade') {
    return {
      enter: ({ reduced }: SlideCustom) => ({
        opacity: 1,
        transition: { duration: reduced ? durations.short : durations.medium, ease: easing.defaultCurve },
      }),
      center: { opacity: 1 },
      exit: ({ reduced }: SlideCustom) => ({
        opacity: 0,
        transition: { duration: reduced ? durations.short : durations.medium, ease: easing.defaultCurve },
      }),
    };
  }

  if (preset === 'slide') {
    return {
      enter: ({ direction, reduced }: SlideCustom) => ({
        opacity: 1,
        x: reduced ? 0 : direction * 18,
        transition: { duration: reduced ? durations.short : durations.long, ease: easing.defaultCurve },
      }),
      center: { opacity: 1, x: 0 },
      exit: ({ direction, reduced }: SlideCustom) => ({
        opacity: 0,
        x: reduced ? 0 : direction * -12,
        transition: { duration: reduced ? durations.short : durations.long, ease: easing.defaultCurve },
      }),
    };
  }

  return {
    enter: ({ direction, reduced, jump }: SlideCustom) => ({
      opacity: 1,
      x: reduced || jump ? 0 : direction * 16,
      scale: 1,
      filter: jump && !reduced ? 'blur(1px)' : 'blur(0px)',
      transition: {
        duration: reduced ? durations.short : durations.butter,
        ease: easing.butterCurve,
      },
    }),
    center: ({ jump, reduced }: SlideCustom) => ({
      opacity: 1,
      x: 0,
      scale: 1,
      filter: jump && !reduced ? 'blur(0px)' : 'blur(0px)',
      transition: {
        duration: reduced ? durations.short : durations.butter,
        ease: easing.butterCurve,
      },
    }),
    exit: ({ direction, reduced, jump }: SlideCustom) => ({
      opacity: 0,
      x: reduced || jump ? 0 : direction * -10,
      scale: reduced ? 1 : 0.995,
      filter: jump && !reduced ? 'blur(1px)' : 'blur(0px)',
      transition: {
        duration: reduced ? durations.short : durations.butter,
        ease: easing.butterCurve,
      },
    }),
  };
}
