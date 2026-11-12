// How a gallery image is presented on a project page.
//
// Screenshots already live in the projects.screenshots JSONB array, as either
// a URL string or an object. A new column is unnecessary: an optional `layout`
// on that object ("scroll" | "phone" | "tile") overrides auto-detection, and
// existing URL strings keep working unchanged.

export const LONG_PAGE_RATIO = 1.8;
export const PHONE_RATIO = 1.15;
// Retina phone screenshots land around 1170–1290px wide. Wider than that, a
// tall image is a desktop page capture rather than a phone screen.
export const PHONE_MAX_WIDTH = 1300;
export const LONG_PAGE_MIN_WIDTH = 1000;
// A desktop capture that is only about as wide as a large phone still counts
// as a full page when it is much taller than a single screen.
export const EXTREME_PAGE_RATIO = 2.8;

export const SCROLL_SPEED = {
  desktop: 150,
  mobile: 52,
};

const LAYOUT_ALIASES = {
  scroll: 'scroll',
  long: 'scroll',
  full: 'scroll',
  fullpage: 'scroll',
  'full-page': 'scroll',
  browser: 'scroll',
  phone: 'phone',
  mobile: 'phone',
  tile: 'tile',
  standard: 'tile',
  auto: null,
};

export function explicitLayout(item) {
  if (!item || typeof item !== 'object') return null;

  const raw = item.layout ?? item.presentation ?? item.kind;
  if (typeof raw === 'string') {
    const key = raw.trim().toLowerCase();
    if (Object.prototype.hasOwnProperty.call(LAYOUT_ALIASES, key)) {
      return LAYOUT_ALIASES[key];
    }
  }

  if (item.fullPage === true || item.full_page === true) return 'scroll';
  if (item.device === 'phone' || item.device === 'mobile') return 'phone';
  return null;
}

/**
 * Classify one gallery image.
 * Returns "scroll" (browser frame), "phone", "tile", or "unknown" when the
 * size has not been measured and no explicit layout was stored.
 */
export function classifyScreenshot({ width, height, layout } = {}) {
  if (layout === 'scroll' || layout === 'phone' || layout === 'tile') return layout;

  const w = Number(width);
  const h = Number(height);
  if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) return 'unknown';

  const ratio = h / w;
  const tall = ratio >= LONG_PAGE_RATIO;
  const portrait = ratio >= PHONE_RATIO;

  if (tall && w > PHONE_MAX_WIDTH) return 'scroll';
  if (tall && w >= LONG_PAGE_MIN_WIDTH && ratio >= EXTREME_PAGE_RATIO) return 'scroll';
  if (tall || (portrait && w <= PHONE_MAX_WIDTH)) return 'phone';
  return 'tile';
}

/** Duration grows with the distance the image has to travel. */
export function scrollDurationMs(distancePx, pixelsPerSecond) {
  const distance = Math.max(0, Number(distancePx) || 0);
  const speed = Math.max(1, Number(pixelsPerSecond) || 1);
  return Math.round((distance / speed) * 1000);
}

/**
 * Visual order and tile spans for the bento. Lightbox order stays the
 * original index carried on each item.
 */
export function arrangeBento(items) {
  const tiles = [];
  const phones = [];
  items.forEach((item, index) => {
    const entry = { ...item, index: item.index ?? index };
    if (item.kind === 'phone') phones.push(entry);
    else tiles.push(entry);
  });

  if (tiles.length === 0) {
    return phones.map((item) => ({ ...item, span: 'phone' }));
  }

  if (tiles.length === 1 && phones.length === 0) {
    return [{ ...tiles[0], span: 'hero' }];
  }

  const ordered = [{ ...tiles[0], span: 'large' }];
  const rest = tiles.slice(1);

  if (phones.length > 0) {
    ordered.push({ ...phones[0], span: 'phone' });
    rest.splice(0, 2).forEach((tile) => ordered.push({ ...tile, span: 'small' }));
  }

  rest.forEach((tile, position) => {
    ordered.push({ ...tile, span: position % 3 === 0 ? 'wide' : 'small' });
  });

  phones.slice(1).forEach((item) => ordered.push({ ...item, span: 'phone' }));
  return ordered;
}

/**
 * Persist a screenshot the way the CMS already stores them.
 * A bare URL stays a string. Layout (and an existing caption) are kept on
 * an object so older readers that only understand strings still work when
 * the editor leaves the display on Auto.
 */
export function toStoredScreenshot(url, meta) {
  if (typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed || trimmed.startsWith('blob:')) return null;

  const layout = explicitLayout(meta);
  const caption =
    meta && typeof meta.caption === 'string' && meta.caption.trim()
      ? meta.caption.trim()
      : '';

  if (!layout && !caption) return trimmed;

  const stored = { url: trimmed };
  if (layout) stored.layout = layout;
  if (caption) stored.caption = caption;
  return stored;
}
