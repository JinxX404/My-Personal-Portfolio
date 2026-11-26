// Language and URL helpers. Plain module (no React) so node tests can use it.
// English keeps the existing URLs; Arabic lives under /ar.

export const LANGUAGES = ['en', 'ar'];
export const DEFAULT_LANGUAGE = 'en';
export const RTL_LANGUAGES = new Set(['ar']);
export const LANGUAGE_STORAGE_KEY = 'portfolio-language';

// Public pages that exist in both languages. Admin, login and the old redirect
// addresses stay English-only.
const LOCALIZED_PATTERNS = [
  /^\/$/,
  /^\/projects(\/[^/]+)?\/?$/,
  /^\/about-story\/?$/,
  /^\/contact-hub\/?$/,
];

export function languageFromPath(pathname = '/') {
  return pathname === '/ar' || pathname.startsWith('/ar/') ? 'ar' : 'en';
}

export function directionFor(lang) {
  return RTL_LANGUAGES.has(lang) ? 'rtl' : 'ltr';
}

/** The path without its language prefix: '/ar/projects' -> '/projects', '/ar' -> '/'. */
export function stripLanguage(pathname = '/') {
  if (languageFromPath(pathname) !== 'ar') return pathname || '/';
  const rest = pathname.slice(3);
  return rest === '' ? '/' : rest;
}

export function isLocalizedPath(pathname = '/') {
  const [path] = pathname.split(/[?#]/);
  return LOCALIZED_PATTERNS.some((pattern) => pattern.test(path || '/'));
}

/**
 * Address of `path` (an English, unprefixed path; may carry ?query or #hash) in
 * `lang`. Paths that only exist in English are returned unchanged.
 */
export function localizePath(path = '/', lang = DEFAULT_LANGUAGE) {
  if (typeof path !== 'string' || !path.startsWith('/')) return path;
  const base = stripLanguage(path.split(/[?#]/)[0]);
  const suffix = path.slice(path.split(/[?#]/)[0].length);
  if (lang !== 'ar' || !isLocalizedPath(base)) return base + suffix;
  return (base === '/' ? '/ar' : `/ar${base}`) + suffix;
}

/** Same page in the other language, when it exists there. */
export function alternatePath(pathname, lang) {
  const base = stripLanguage(pathname);
  if (!isLocalizedPath(base)) return null;
  return localizePath(base, lang);
}
