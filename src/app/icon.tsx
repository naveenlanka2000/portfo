export const contentType = 'image/svg+xml';

export default function Icon() {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
  <rect width="32" height="32" rx="8" fill="#0a0a0a"/>
  <path d="M10 21V11h3.2c3.7 0 5.6 1.5 5.6 4.6S16.9 21 13.2 21H10Zm2.2-1.8h1.1c2.5 0 3.8-1 3.8-3.6 0-2.5-1.3-3.6-3.8-3.6h-1.1v7.2Z" fill="#ffffff"/>
</svg>`;

  return new Response(svg, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
