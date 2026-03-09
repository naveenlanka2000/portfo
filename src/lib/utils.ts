export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

export function withBasePath(pathname: string): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  if (!basePath) return pathname;

  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${basePath}${normalized}`.replace(/\/+/g, '/');
}
