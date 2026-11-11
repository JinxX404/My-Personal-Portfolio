const ALLOWED_PROTOCOLS = new Set(['http:', 'https:', 'mailto:', 'tel:']);

/**
 * Accept only absolute http(s), mailto, and tel URLs from CMS content.
 * Returns null for empty, hash-only, protocol-relative, and scriptable values.
 */
export function safeHref(value) {
  if (typeof value !== 'string') return null;

  const trimmed = value.trim();
  if (!trimmed || trimmed === '#' || trimmed.startsWith('//')) return null;

  let url;
  try {
    url = new URL(trimmed);
  } catch {
    return null;
  }

  if (!ALLOWED_PROTOCOLS.has(url.protocol)) return null;
  if (url.protocol === 'http:' || url.protocol === 'https:') {
    if (!url.hostname) return null;
  }

  return url.href;
}

export function isHttpHref(value) {
  const href = safeHref(value);
  if (!href) return false;
  return href.startsWith('http://') || href.startsWith('https://');
}
