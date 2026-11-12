const injected = new Set();

/**
 * Start a high-priority image fetch as soon as the project page knows the
 * URL. The link stays in the document so a strict-mode remount does not
 * abort the request by removing it.
 */
export function preloadImages(hrefs) {
  if (typeof document === 'undefined' || !Array.isArray(hrefs)) return;

  hrefs.forEach((href) => {
    if (typeof href !== 'string' || !href || injected.has(href)) return;
    injected.add(href);
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = href;
    link.setAttribute('fetchpriority', 'high');
    document.head.appendChild(link);
  });
}
