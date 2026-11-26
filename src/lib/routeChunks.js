// One place for the public page chunks, so the router and the prefetcher share
// the same import() calls (Vite then reuses one module per page).
export const pageLoaders = {
  home: () => import('pages/homepage'),
  projects: () => import('pages/portfolio-gallery'),
  project: () => import('pages/case-study-detail'),
  about: () => import('pages/about-story'),
  contact: () => import('pages/contact-hub'),
};

const started = new Set();

const loaderForPath = (path = '') => {
  const clean = path.split(/[?#]/)[0];
  if (clean === '/' || clean === '/homepage') return 'home';
  if (clean === '/projects' || clean === '/portfolio-gallery') return 'projects';
  if (/^\/projects\/[^/]+/.test(clean)) return 'project';
  if (clean.startsWith('/about-story')) return 'about';
  if (clean.startsWith('/contact-hub')) return 'contact';
  return null;
};

/** Start downloading a page's code before the click lands (hover, focus, touch). */
export function prefetchPath(path) {
  const key = loaderForPath(path);
  if (!key || started.has(key)) return;
  started.add(key);
  pageLoaders[key]().catch(() => started.delete(key));
}

/** After the first page is up, quietly fetch the other public pages. */
export function prefetchPublicPagesWhenIdle() {
  if (typeof window === 'undefined') return;
  const conn = navigator.connection;
  if (conn && (conn.saveData || /2g/.test(conn.effectiveType || ''))) return;
  const run = () => Object.keys(pageLoaders).forEach((key) => {
    if (started.has(key)) return;
    started.add(key);
    pageLoaders[key]().catch(() => started.delete(key));
  });
  if ('requestIdleCallback' in window) window.requestIdleCallback(run, { timeout: 4000 });
  else window.setTimeout(run, 2500);
}
