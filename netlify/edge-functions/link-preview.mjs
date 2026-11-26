// Per-page link previews: title, description, canonical, hreflang, Open Graph
// and Twitter tags in the HTML itself, so WhatsApp, LinkedIn, X, Facebook and
// search engines see the right page (they do not run JavaScript).
//
// Safe by design: any error, timeout, missing setting or non-HTML response
// serves the page unchanged (and `onError: 'bypass'` covers crashes).
import { buildPreview, injectHead, projectIdFromPath } from '../../src/lib/linkPreview.mjs';

const TTL_MS = 5 * 60 * 1000; // data cache per edge instance
const FETCH_TIMEOUT_MS = 1500;
const PROJECT_COLUMNS = [
  'id', 'title', 'title_ar', 'description', 'description_ar', 'meta_title', 'meta_title_ar',
  'meta_description', 'meta_description_ar', 'hero_images', 'screenshots', 'publishing_status', 'visibility',
];
const SHARE_COLUMNS = ['share_image', 'share_image_ar'];

const cache = new Map();

function env(name) {
  try {
    const value = globalThis.Netlify?.env?.get(name);
    return typeof value === 'string' ? value.trim() : '';
  } catch {
    return '';
  }
}

async function rest(path) {
  const base = (env('VITE_SUPABASE_URL') || env('SUPABASE_URL')).replace(/\/+$/, '');
  const key = env('VITE_SUPABASE_ANON_KEY') || env('SUPABASE_ANON_KEY');
  if (!base || !key) return { ok: false };
  const response = await fetch(`${base}/rest/v1/${path}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}`, Accept: 'application/json' },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!response.ok) return { ok: false, status: response.status, body: await response.text().catch(() => '') };
  return { ok: true, rows: await response.json() };
}

/** Cached lookup; failures are cached briefly so a Supabase outage costs one timeout per minute. */
async function cached(key, load) {
  const hit = cache.get(key);
  if (hit && hit.expires > Date.now()) return hit.value;
  let value;
  try {
    value = await load();
  } catch {
    value = undefined;
  }
  cache.set(key, { value, expires: Date.now() + (value === undefined ? 60 * 1000 : TTL_MS) });
  if (cache.size > 500) cache.delete(cache.keys().next().value);
  return value;
}

const loadSettings = () =>
  cached('settings', async () => {
    const result = await rest('portfolio_settings?select=profile,site_settings,seo_settings,social_links&limit=1');
    return result.ok ? result.rows[0] || null : undefined;
  });

// Share image columns come with migration 010; before it, ask without them.
let shareColumns = true;
const loadProject = (id) =>
  cached(`project:${id}`, async () => {
    const select = (shareColumns ? [...PROJECT_COLUMNS, ...SHARE_COLUMNS] : PROJECT_COLUMNS).join(',');
    let result = await rest(`projects?select=${select}&id=eq.${encodeURIComponent(id)}&limit=1`);
    if (!result.ok && shareColumns && /share_image/.test(result.body || '')) {
      shareColumns = false;
      result = await rest(`projects?select=${PROJECT_COLUMNS.join(',')}&id=eq.${encodeURIComponent(id)}&limit=1`);
    }
    if (!result.ok) return undefined; // unknown: keep generic meta, stay indexable
    return result.rows[0] || null; // null: not found / not visible
  });

export default async (request, context) => {
  const response = await context.next();
  let html = null;
  try {
    if (request.method !== 'GET' || response.status !== 200) return response;
    if (!(response.headers.get('content-type') || '').includes('text/html')) return response;

    const url = new URL(request.url);
    const projectId = projectIdFromPath(url.pathname);
    const [settings, project] = await Promise.all([
      loadSettings(),
      projectId ? loadProject(projectId) : Promise.resolve(undefined),
    ]);

    html = await response.text();
    const out = injectHead(html, buildPreview({ pathname: url.pathname, settings, project }));
    const headers = new Headers(response.headers);
    headers.delete('content-length');
    headers.delete('etag');
    headers.set('x-link-preview', out ? 'on' : 'skipped');
    return new Response(out ?? html, { status: response.status, headers });
  } catch (error) {
    console.warn('link-preview: serving page unchanged', error?.name || 'error');
    // The body may already be read: rebuild the original page from it.
    return html === null ? response : new Response(html, { status: response.status, headers: response.headers });
  }
};

export const config = {
  path: '/*',
  excludedPath: [
    '/assets/*', '/screenshot-slices/*', '/seed/*', '/.netlify/*',
    '/sitemap.xml', '/robots.txt', '/manifest.json', '/theme-init.js',
    '/*.png', '/*.jpg', '/*.jpeg', '/*.webp', '/*.svg', '/*.ico', '/*.js', '/*.css', '/*.json', '/*.txt', '/*.xml', '/*.woff2',
  ],
  onError: 'bypass',
};
