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
    match: (pathname) => pathname.startsWith('/portfolio-gallery'),
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
    match: (pathname) => pathname.startsWith('/case-study-detail'),
    page: 'Project',
    description: 'Project case study by Moataz Mohammed, a Full-Stack .NET developer.',
  },
  {
    match: (pathname) =>
      ['/admin-dashboard', '/project-manager', '/skills-manager', '/projects-manager', '/settings-manager'].some(
        (path) => pathname.startsWith(path)
      ),
    page: 'Admin',
    description: 'Portfolio admin.',
  },
  {
    match: (pathname) => pathname.startsWith('/login'),
    page: 'Sign in',
    description: 'Sign in to the portfolio admin.',
  },
  {
    match: (pathname) => pathname.startsWith('/forgot-password'),
    page: 'Reset password',
    description: 'Reset the portfolio admin password.',
  },
];

export function resolveRouteMeta(pathname) {
  return (
    ROUTES.find((route) => route.match(pathname)) || {
      page: 'Page not found',
      description: 'This page is not on moatazz.site.',
    }
  );
}

export function formatPageTitle(page, profile) {
  const name = profile?.full_name?.trim() || 'Moataz Mohammed';
  const role = profile?.title?.trim() || 'Full-Stack .NET Developer';
  if (!page || page === 'Home') return `${name} — ${role}`;
  return `${page} — ${name} | ${role}`;
}

export function canonicalUrl(pathname = '/') {
  if (pathname === '/' || pathname === '/homepage') return `${SITE_ORIGIN}/`;
  const clean = pathname.split('?')[0].replace(/\/+$/, '') || '/';
  return `${SITE_ORIGIN}${clean}`;
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
