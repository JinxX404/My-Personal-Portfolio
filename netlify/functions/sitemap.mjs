// Serves /sitemap.xml with every public project page, read from Supabase with
// the anon key (the same rows the public site can already read). If Supabase is
// unreachable it still answers with the fixed pages, so crawlers never get a 5xx.

const SITE_ORIGIN = 'https://moatazz.site';
const STATIC_PATHS = ['/', '/projects', '/about-story', '/contact-hub'];
// Listed only while at least one service is published (the page is hidden from
// the menu otherwise).
const SERVICES_PATH = '/rest/v1/services?select=id&published=eq.true&limit=1';
const PROJECTS_PATH =
  '/rest/v1/projects?select=id,updated_at,created_at' +
  '&publishing_status=in.(published,in_progress)&visibility=eq.public&order=created_at.desc';

function readEnv(name) {
  if (typeof Netlify === 'undefined' || typeof Netlify.env?.get !== 'function') {
    return '';
  }
  const value = Netlify.env.get(name);
  return typeof value === 'string' ? value.trim() : '';
}

const escapeXml = (value) =>
  String(value).replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c]);

const isoDate = (value) => {
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime()) ? date.toISOString().slice(0, 10) : '';
};

const arabicPath = (path) => (path === '/' ? '/ar' : `/ar${path}`);

// Every page is listed in English and Arabic (/ar), each with hreflang links to
// both versions plus x-default (English), as Google asks for bilingual sites.
export function buildSitemap(projects = [], { hasServices = false } = {}) {
  const pages = [
    ...STATIC_PATHS.map((path) => ({ path })),
    ...(hasServices ? [{ path: '/services' }] : []),
    ...projects
      .filter((p) => p && typeof p.id === 'string' && /^[A-Za-z0-9-]+$/.test(p.id))
      .map((p) => ({
        path: `/projects/${p.id}`,
        lastmod: isoDate(p.updated_at || p.created_at),
      })),
  ];
  const body = pages
    .flatMap(({ path, lastmod }) => {
      const en = `${SITE_ORIGIN}${path}`;
      const ar = `${SITE_ORIGIN}${arabicPath(path)}`;
      const links = [
        `    <xhtml:link rel="alternate" hreflang="en" href="${escapeXml(en)}"/>`,
        `    <xhtml:link rel="alternate" hreflang="ar" href="${escapeXml(ar)}"/>`,
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(en)}"/>`,
      ].join('\n');
      return [en, ar].map(
        (loc) =>
          `  <url>\n    <loc>${escapeXml(loc)}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}\n${links}\n  </url>`
      );
    })
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${body}\n</urlset>\n`;
}

async function loadRows(path) {
  const supabaseUrl = (readEnv('VITE_SUPABASE_URL') || readEnv('SUPABASE_URL')).replace(/\/+$/, '');
  const anonKey = readEnv('VITE_SUPABASE_ANON_KEY') || readEnv('SUPABASE_ANON_KEY');
  if (!supabaseUrl || !anonKey) return [];
  try {
    const response = await fetch(`${supabaseUrl}${path}`, {
      headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}`, Accept: 'application/json' },
    });
    if (!response.ok) {
      console.error(`sitemap: Supabase HTTP ${response.status}`);
      return [];
    }
    const rows = await response.json();
    return Array.isArray(rows) ? rows : [];
  } catch (error) {
    console.error(`sitemap: ${error instanceof Error ? error.message : 'request failed'}`);
    return [];
  }
}

export default async () => {
  // The services table may not exist yet (migration 009); that just means no /services.
  const [projects, services] = await Promise.all([loadRows(PROJECTS_PATH), loadRows(SERVICES_PATH)]);
  return new Response(buildSitemap(projects, { hasServices: services.length > 0 }), {
    status: 200,
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      // Crawlers re-read often enough; the CDN keeps Supabase load low.
      'cache-control': 'public, max-age=0, must-revalidate',
      'netlify-cdn-cache-control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
};

// Takes precedence over public/sitemap.xml, which stays as the offline fallback.
export const config = {
  path: '/sitemap.xml',
};
