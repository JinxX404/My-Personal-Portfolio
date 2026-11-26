// Shared helpers for reading project images stored as strings or {url|src|image} objects.
export const FALLBACK_PROJECT_IMAGE = '/assets/images/no_image.png';

export const imageUrl = (value) => {
  if (typeof value === 'string') return value.trim();
  if (value && typeof value === 'object') {
    const candidate = value.url || value.src || value.image;
    return typeof candidate === 'string' ? candidate.trim() : '';
  }
  return '';
};

export const firstImageUrl = (items) => {
  if (!Array.isArray(items)) return '';
  for (const item of items) {
    const url = imageUrl(item);
    if (url) return url;
  }
  return '';
};

/** Hero first, then the first screenshot. Empty string when the project has neither. */
export const projectCover = (project) =>
  firstImageUrl(project?.hero_images) || firstImageUrl(project?.screenshots);

/** Same as projectCover, falling back to the stock placeholder. */
export const coverForProject = (project) => projectCover(project) || FALLBACK_PROJECT_IMAGE;
