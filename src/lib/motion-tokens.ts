export const motionTokens = {
  durations: {
    short: 180,
    medium: 360,
    long: 600,
  },
  ease: [0.2, 0.8, 0.2, 1] as const,
  stagger: 0.06,
  parallaxStrength: {
    background: 0.18,
    mid: 0.35,
    fg: 0.55,
  },
  hoverLift: {
    translateY: -6,
    scale: 1.02,
    duration: 180,
  },
} as const;
