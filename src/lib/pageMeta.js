export const SITE_ORIGIN = 'https://moatazz.site';

const TEMPLATE_KEYWORDS = 'web developer, designer, react, nodejs';

const ROUTES = [
  {
    match: (pathname) => pathname === '/' || pathname === '/homepage',
    page: 'Home',
    description:
      'Portfolio of Moataz Mohammed, a Full-Stack .NET developer. Selected projects, skills, and ways to get in touch.',
  },
  {
    match: (pathname) =>
      pathname.startsWith('/portfolio-gallery') || pathname === '/projects',
    page: 'Portfolio',
    description: 'Projects by Moataz Mohammed, a Full-Stack .NET developer.',
  },
  {
    match: (pathname) => pathname.startsWith('/about-story'),
    page: 'About',
    description: 'Background, skills, and experience of Moataz Mohammed, a Full-Stack .NET developer.',
  },
  {
    match: (pathname) => pathname.startsWith('/contact-hub'),
    page: 'Contact',
    description: 'Contact Moataz Mohammed about software projects and collaborations.',
  },
  {
    match: (pathname) =>
      /^\/projects\/[^/]+/.test(pathname) || pathname.startsWith('/case-study-detail'),
    page: 'Project Details',
    description: 'Project details by Moataz Mohammed, a Full-Stack .NET developer.',
  },
  {
    match: (pathname) =>
      ['/admin-dashboard', '/project-manager', '/skills-manager', '/projects-manager', '/settings-manager', '/messages-manager'].some(
        (path) => pathname.startsWith(path)
      ),
    page: 'Admin',
    description: 'Portfolio admin.',
    noindex: true,
  },
  {
    match: (pathname) => pathname.startsWith('/login'),
    page: 'Sign in',
    description: 'Sign in to the portfolio admin.',
    noindex: true,
  },
  {
    match: (pathname) => pathname.startsWith('/forgot-password'),
    page: 'Reset password',
    description: 'Reset the portfolio admin password.',
    noindex: true,
  },
];

export function resolveRouteMeta(pathname) {
  return (
    ROUTES.find((route) => route.match(pathname)) || {
      page: 'Page not found',
      description: 'This page is not on moatazz.site.',
      noindex: true,
    }
  );
}

export function formatPageTitle(page, profile) {
  const name = profile?.full_name?.trim() || 'Moataz Mohammed';
  const role = profile?.title?.trim() || 'Full-Stack .NET Developer';
  if (!page || page === 'Home') return `${name} — ${role}`;
  return `${page} — ${name} | ${role}`;
}

// Old addresses that redirect in the router. Canonical links always use the new one.
const CANONICAL_ALIASES = [
  [/^\/homepage\/?$/, '/'],
  [/^\/portfolio-gallery\/?$/, '/projects'],
  [/^\/case-study-detail\/([^/]+)\/?$/, '/projects/$1'],
];

export function canonicalUrl(pathname = '/') {
  let clean = pathname.split('?')[0].replace(/\/+$/, '') || '/';
  for (const [pattern, target] of CANONICAL_ALIASES) {
    if (pattern.test(clean)) {
      clean = clean.replace(pattern, target);
      break;
    }
  }
  return clean === '/' ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${clean}`;
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
