# Portfolio (Next.js)

A modern portfolio site built with Next.js (App Router), TypeScript, Tailwind CSS, and Framer Motion.

## Scripts

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run start` — run production server
- `npm run lint` — lint
- `npm run format` / `npm run format:write` — check/format code

## Routes

- `/` — Home
- `/projects` — Projects index
- `/projects/[slug]` — Case study page
- `/about` — About
- `/contact` — Contact
- `/styleguide` — Tokens (internal)

## Motion tokens

Motion tokens live in `src/lib/motion-tokens.ts` and are mirrored by CSS variables in `src/app/globals.css`.

## Notes

- Replace `https://example.com` in the root metadata (`src/app/layout.tsx`) with your real domain.
- The homepage hero image currently uses an external Unsplash URL as a placeholder.
- If you develop from a OneDrive-synced folder on Windows and see `EPERM` errors writing `.next*/trace`, the most reliable fix is moving the repo outside OneDrive (or excluding `.next*` from sync).
