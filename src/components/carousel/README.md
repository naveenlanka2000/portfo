# Carousel

Premium, “buttery” carousel for Next.js + Tailwind + Framer Motion.

## Usage

```tsx
import { Carousel } from '@/components/carousel/Carousel';

<Carousel
  ariaLabel="Selected work"
  items={[{ src: '/images/1.webp', alt: '…' }]}
  intervalMs={5000}
  loop
  animation="butter"
  priorityFirstImage
  aspectRatio="4 / 5"
/>
```

## Accessibility

- Wrapper: `role="region"`, `aria-roledescription="carousel"`, `aria-label` via prop
- Slides: `role="group"` with `aria-label="Slide X of Y"`
- Dots: buttons with `aria-current="true"` on the active dot
- Keyboard: `ArrowLeft/ArrowRight`, `Home/End` supported
- Autoplay pauses on hover, focus, hidden tab, and reduced motion

## Notes

- Uses `next/image` for image optimization and stable layout via CSS `aspect-ratio`.
- Autoplay uses a single `setTimeout` scheduled only when active; resets after manual navigation.
