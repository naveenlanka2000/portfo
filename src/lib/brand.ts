import type { BrandKind } from '@/components/sections/BrandIcon';

function norm(input: string) {
  return input.trim().toLowerCase();
}

export function tagToBrandKind(tag: string): BrandKind {
  const t = norm(tag);

  // Languages
  if (t === 'java') return 'java';
  if (t === 'python') return 'python';
  if (t === 'javascript') return 'javascript';
  if (t === 'html') return 'html';
  if (t === 'css') return 'css';
  if (t === 'sql') return 'sql';
  if (t === 'dart') return 'dart';

  // Frameworks / tools
  if (t === 'spring boot') return 'spring-boot';
  if (t === 'react') return 'react';
  if (t === 'flutter') return 'flutter';
  if (t === 'flask') return 'flask';
  if (t === 'mysql') return 'mysql';

  // Other stack tags
  if (t === 'data modeling') return 'data-modeling';
  if (t === 'mobile ui') return 'mobile-ui';

  // Company
  if (t === 'nforce') return 'nforce';

  return 'generic';
}
