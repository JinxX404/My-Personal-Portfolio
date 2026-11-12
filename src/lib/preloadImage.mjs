const injected = new Set();

/**
 * Start a high-priority image fetch as soon as the project page knows the
 * URL. The link stays in the document so a strict-mode remount does not
 * abort the request by removing it.
 */
function preloadKey(entry) {
  if (typeof entry === 'string') return entry;
  return entry?.srcSet || entry?.src || '';
}

export function preloadImages(entries) {
  if (typeof document === 'undefined' || !Array.isArray(entries)) return;

  entries.forEach((entry) => {
    const key = preloadKey(entry);
    if (!key || injected.has(key)) return;
    injected.add(key);
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.setAttribute('fetchpriority', 'high');
    if (typeof entry === 'string') {
      link.href = entry;
    } else if (entry.srcSet) {
      if (entry.src) link.href = entry.src;
      if (entry.type) link.type = entry.type;
      link.setAttribute('imagesrcset', entry.srcSet);
      if (entry.sizes) link.setAttribute('imagesizes', entry.sizes);
    } else if (entry.src) {
      link.href = entry.src;
    }
    document.head.appendChild(link);
  });
}
