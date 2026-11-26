import { languageFromPath, localizePath, stripLanguage, isLocalizedPath } from '../i18n/paths.mjs';

export const SITE_ORIGIN = 'https://moatazz.site';

const TEMPLATE_KEYWORDS = 'web developer, designer, react, nodejs';

// `page` and `description` are i18n keys (see src/i18n/messages.mjs).
const ROUTES = [
  {
    match: (pathname) => pathname === '/' || pathname === '/homepage',
    page: 'meta.home.page',
    description: 'meta.home.description',
    isHome: true,
  },
  {
    match: (pathname) =>
      pathname.startsWith('/portfolio-gallery') || pathname === '/projects',
    page: 'meta.projects.page',
    description: 'meta.projects.description',
  },
  {
    match: (pathname) => pathname.startsWith('/about-story'),
    page: 'meta.about.page',
    description: 'meta.about.description',
  },
  {
    match: (pathname) => pathname.startsWith('/contact-hub'),
    page: 'meta.contact.page',
    description: 'meta.contact.description',
  },
  {
    match: (pathname) => pathname === '/services' || pathname === '/services/',
    page: 'meta.services.page',
    description: 'meta.services.description',
  },
  {
    match: (pathname) =>
      /^\/projects\/[^/]+/.test(pathname) || pathname.startsWith('/case-study-detail'),
    page: 'meta.project.page',
    description: 'meta.project.description',
  },
  {
    match: (pathname) =>
      ['/admin-dashboard', '/project-manager', '/skills-manager', '/projects-manager', '/settings-manager', '/messages-manager', '/services-manager'].some(
        (path) => pathname.startsWith(path)
      ),
    page: 'meta.admin.page',
    description: 'meta.admin.description',
    noindex: true,
  },
  {
    match: (pathname) => pathname.startsWith('/login'),
    page: 'meta.login.page',
    description: 'meta.login.description',
    noindex: true,
  },
  {
    match: (pathname) => pathname.startsWith('/forgot-password'),
    page: 'meta.reset.page',
    description: 'meta.reset.description',
    noindex: true,
  },
];

const NOT_FOUND = {
  page: 'meta.notFound.page',
  description: 'meta.notFound.description',
  noindex: true,
};

/** Route meta for a path in either language. Unknown paths are 404s (noindex). */
export function resolveRouteMeta(pathname) {
  const lang = languageFromPath(pathname);
  const base = stripLanguage(pathname);
  // Under /ar only the localized pages exist; anything else is a 404 there.
  if (lang === 'ar' && !isLocalizedPath(base)) return NOT_FOUND;
  return ROUTES.find((route) => route.match(base)) || NOT_FOUND;
}

/** `page` is the already-translated page name; null/undefined for home. */
export function formatPageTitle(page, profile, defaults = {}) {
  const name = profile?.full_name?.trim() || defaults.name || 'Moataz Mohammed';
  const role = profile?.title?.trim() || defaults.role || 'Full-Stack .NET Developer';
  if (!page) return `${name} — ${role}`;
  return `${page} — ${name} | ${role}`;
}

// Old addresses that redirect in the router. Canonical links always use the new one.
const CANONICAL_ALIASES = [
  [/^\/homepage\/?$/, '/'],
  [/^\/portfolio-gallery\/?$/, '/projects'],
  [/^\/case-study-detail\/([^/]+)\/?$/, '/projects/$1'],
];

function canonicalBase(pathname) {
  let clean = stripLanguage(pathname.split('?')[0].replace(/\/+$/, '') || '/');
  for (const [pattern, target] of CANONICAL_ALIASES) {
    if (pattern.test(clean)) {
      clean = clean.replace(pattern, target);
      break;
    }
  }
  return clean;
}

function absolute(path) {
  return path === '/' ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${path}`;
}

/** Canonical URL of this page in its own language (/ar pages point to /ar). */
export function canonicalUrl(pathname = '/') {
  const lang = languageFromPath(pathname);
  return absolute(localizePath(canonicalBase(pathname), lang));
}

/**
 * hreflang alternates for pages that exist in both languages, or [] otherwise.
 * x-default is the English page.
 */
export function alternateUrls(pathname = '/') {
  const base = canonicalBase(pathname);
  if (!isLocalizedPath(base)) return [];
  const en = absolute(localizePath(base, 'en'));
  const ar = absolute(localizePath(base, 'ar'));
  return [
    { hrefLang: 'en', href: en },
    { hrefLang: 'ar', href: ar },
    { hrefLang: 'x-default', href: en },
  ];
}

/** schema.org Person + WebSite for the home page. Only fields the CMS actually has. */
export function personJsonLd(profile, socialLinks) {
  const name = profile?.full_name?.trim();
  if (!name) return null;
  const sameAs = Object.values(socialLinks || {})
    .filter((url) => typeof url === 'string' && /^https:\/\//i.test(url.trim()))
    .map((url) => url.trim());
  const person = {
    '@type': 'Person',
    '@id': `${SITE_ORIGIN}/#person`,
    name,
    url: `${SITE_ORIGIN}/`,
  };
  if (profile?.title) person.jobTitle = profile.title.trim();
  if (profile?.bio) person.description = profile.bio.trim();
  const image = profile?.avatar ? absoluteHttpsUrl(profile.avatar, '') : '';
  if (image && image !== SITE_ORIGIN) person.image = image;
  if (sameAs.length) person.sameAs = sameAs;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      person,
      {
        '@type': 'WebSite',
        '@id': `${SITE_ORIGIN}/#website`,
        url: `${SITE_ORIGIN}/`,
        name,
        publisher: { '@id': `${SITE_ORIGIN}/#person` },
      },
    ],
  };
}

export function publicKeywords(keywords) {
  if (typeof keywords !== 'string') return '';
  const trimmed = keywords.trim();
  if (!trimmed || trimmed === TEMPLATE_KEYWORDS) return '';
  return trimmed;
}

export function absoluteHttpsUrl(value, fallbackPath = '/og-image.png') {
  const fallback = `${SITE_ORIGIN}${fallbackPath}`;
  if (typeof value !== 'string' || !value.trim()) return fallback;
  try {
    const url = new URL(value.trim(), SITE_ORIGIN);
    if (url.protocol !== 'https:') return fallback;
    return url.href;
  } catch {
    return fallback;
  }
}
