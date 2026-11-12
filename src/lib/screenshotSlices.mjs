// Full-page screenshots are sliced and re-encoded ahead of time.
// The browser frame looks them up by the original Storage URL and falls
// back to that URL when a future CMS upload has no derivatives yet.

export const SLICE_HEIGHT = 2000;
export const DESKTOP_WIDTH = 1440;
export const NARROW_WIDTH = 800;

// Desktop column is about 880px. Phones are capped below at the 800px file
// with a media query, because a plain srcset would still pick 1440 on a 3x screen.
export const FRAME_SIZES = '880px';
export const NARROW_MEDIA = '(max-width: 900px)';

export function planSliceSpans(height, sliceHeight = SLICE_HEIGHT) {
  const spans = [];
  const total = Math.max(0, Math.round(Number(height) || 0));
  const step = Math.max(1, Math.round(Number(sliceHeight) || SLICE_HEIGHT));
  for (let y = 0; y < total; y += step) {
    spans.push({ y, height: Math.min(step, total - y) });
  }
  return spans;
}

export function contiguousReadyCount(ready) {
  if (!Array.isArray(ready)) return 0;
  let count = 0;
  for (let i = 0; i < ready.length; i += 1) {
    if (!ready[i]) break;
    count += 1;
  }
  return count;
}

export function contiguousReadyHeight(ready, heights) {
  if (!Array.isArray(heights)) return 0;
  let total = 0;
  const prefix = contiguousReadyCount(ready);
  for (let i = 0; i < prefix && i < heights.length; i += 1) {
    total += Math.max(0, Number(heights[i]) || 0);
  }
  return total;
}

/** How far the frame may move without revealing pixels that are not decoded. */
export function scrollLimit(readyHeight, viewport) {
  const ready = Math.max(0, Number(readyHeight) || 0);
  const view = Math.max(0, Number(viewport) || 0);
  return Math.max(0, Math.round(ready - view));
}

/**
 * How many slices to request. The first screen loads immediately. Further
 * slices wait until the decoded prefix catches up, plus one slice of lookahead,
 * so a Slow 4G download is not spent on the bottom of the page.
 */
export function requestCount({
  offset = 0,
  viewport = 0,
  heights = [],
  ready = [],
  ahead = 1,
} = {}) {
  const count = Array.isArray(heights) ? heights.length : 0;
  if (!count) return 0;
  if (heights.every((height) => !(Number(height) > 0))) return 1;

  let cover = 1;
  let y = 0;
  const target = Math.max(0, Number(offset) || 0) + Math.max(0, Number(viewport) || 0);
  for (let i = 0; i < count; i += 1) {
    cover = i + 1;
    y += Math.max(0, Number(heights[i]) || 0);
    if (y >= target) break;
  }

  const prefix = contiguousReadyCount(ready);
  if (prefix === 0) return Math.min(count, Math.max(cover, 1));
  return Math.min(count, Math.max(cover, prefix + Math.max(0, ahead)));
}

function srcSetFor(sources) {
  const sorted = [...sources].sort((a, b) => a.width - b.width);
  if (sorted.length < 2) return '';
  return sorted.map((source) => `${source.src} ${source.width}w`).join(', ');
}

export function framePartsFor(src, manifest) {
  const entry = manifest?.images?.[src];
  if (!entry?.slices?.length) return null;

  return entry.slices.map((slice) => {
    const sources = [...(slice.sources || [])].filter((source) => source?.src && source.width > 0);
    const webp = sources.filter((source) => (source.type || 'image/webp') === 'image/webp');
    const avif = sources.filter((source) => source.type === 'image/avif');
    const byWidth = (list) => [...list].sort((a, b) => a.width - b.width);
    const webpSorted = byWidth(webp);
    const avifSorted = byWidth(avif);
    const widest = (webpSorted.length ? webpSorted : avifSorted).at(-1);
    const narrowWebp = webpSorted.find((source) => source.width <= NARROW_WIDTH);
    const narrowAvif = avifSorted.find((source) => source.width <= NARROW_WIDTH);
    const widestAvif = avifSorted.at(-1);
    if (!widest) return null;
    const hasWide = webpSorted.some((source) => source.width > NARROW_WIDTH)
      || avifSorted.some((source) => source.width > NARROW_WIDTH);
    return {
      src: widest.src,
      srcSet: srcSetFor(webpSorted.length ? webpSorted : [widest]),
      avifSrc: widestAvif?.src || '',
      avifSrcSet: srcSetFor(avifSorted),
      narrowSrc: hasWide ? (narrowWebp?.src || '') : '',
      narrowAvif: hasWide ? (narrowAvif?.src || '') : '',
      width: widest.width,
      height: widest.height,
    };
  }).filter(Boolean);
}
