// Server-side link preview meta (used by netlify/edge-functions/link-preview.mjs).
// Pure functions only: the edge function fetches the data, this decides what
// goes in <head>. Mirrors what Layout.jsx renders in the browser, and marks
// every tag data-rh="true" so react-helmet-async replaces them on load instead
// of adding duplicates.
import { messages } from '../i18n/messages.mjs';
import { directionFor, languageFromPath, stripLanguage } from '../i18n/paths.mjs';
import { localize, localizeProject, PROFILE_SPEC, SEO_SPEC, SITE_SPEC } from '../i18n/content.mjs';
import {
  absoluteHttpsUrl,
  alternateUrls,
  canonicalUrl,
  formatPageTitle,
  personJsonLd,
  publicKeywords,
  resolveRouteMeta,
} from './pageMeta.js';
import { projectCover, projectShareImage } from './projectMedia.js';

export { projectShareImage };

export const HEAD_START = '<!--head-meta-->';
export const HEAD_END = '<!--/head-meta-->';
export const SHARE_IMAGE_SIZE = { width: 1200, height: 630 };

const MAX_DESCRIPTION = 300;

const text = (lang, key) => messages[lang]?.[key] ?? messages.en[key] ?? '';

export const escapeAttr = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

function clip(value, max = MAX_DESCRIPTION) {
  const clean = String(value ?? '').replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const space = cut.lastIndexOf(' ');
  return `${(space > max * 0.6 ? cut.slice(0, space) : cut).trim()}…`;
}

/** `/projects/<id>` (or /ar/..., /case-study-detail/<id>) -> id, else null. */
export function projectIdFromPath(pathname = '/') {
  const base = stripLanguage(pathname.split(/[?#]/)[0]).replace(/\/+$/, '');
  const match = /^\/(?:projects|case-study-detail)\/([^/]+)$/.exec(base);
  if (!match) return null;
  try {
    const id = decodeURIComponent(match[1]);
    return /^[A-Za-z0-9-]{1,64}$/.test(id) ? id : null;
  } catch {
    return null;
  }
}

/** Same rule as the public site: published or in progress, and not private. */
export const isPublicProject = (project) =>
  Boolean(project) &&
  project.visibility !== 'private' &&
  (project.publishing_status === 'published' || project.publishing_status === 'in_progress');

/**
 * Everything the <head> needs for one URL.
 * `project`: the row for /projects/<id>; null = looked up and not public;
 * undefined = not looked up / lookup failed (generic project meta, still indexable).
 */
export function buildPreview({ pathname = '/', settings = null, project } = {}) {
  const lang = languageFromPath(pathname);
  const route = resolveRouteMeta(pathname);
  const profile = localize(settings?.profile || {}, PROFILE_SPEC, lang);
  const site = localize(settings?.site_settings || {}, SITE_SPEC, lang);
  const seo = localize(settings?.seo_settings || {}, SEO_SPEC, lang);
  const defaults = { name: text(lang, 'site.defaultName'), role: text(lang, 'site.defaultRole') };

  let page = route.isHome ? null : text(lang, route.page);
  let description = text(lang, route.description);
  let image = seo.og_image;
  let imageIsShare = false;
  let noindex = Boolean(route.noindex);
  let type = 'website';
  let jsonLd = null;

  const projectId = projectIdFromPath(pathname);
  if (projectId && !noindex) {
    if (project && isPublicProject(project)) {
      const local = localizeProject(project, lang);
      page = local.meta_title || local.title || text(lang, 'project.untitled') || page;
      description = local.meta_description || local.description || description;
      const share = projectShareImage(project, lang);
      image = share || projectCover(project) || image;
      imageIsShare = Boolean(share);
      type = 'article';
    } else if (project !== undefined) {
      // Not found, private or draft: the page shows "not found" to visitors.
      noindex = true;
    }
  }

  if (!noindex && stripLanguage(pathname) === '/') {
    jsonLd = personJsonLd(profile, settings?.social_links);
  }

  return {
    lang,
    dir: directionFor(lang),
    title: formatPageTitle(page, profile, defaults),
    description: clip(description || seo.meta_description || site.site_description || text(lang, 'meta.fallbackDescription')),
    keywords: publicKeywords(site.site_keywords),
    url: canonicalUrl(pathname),
    image: absoluteHttpsUrl(image),
    imageIsShare,
    imageAlt: page || formatPageTitle(null, profile, defaults),
    type,
    locale: lang === 'ar' ? 'ar_EG' : 'en_US',
    alternates: noindex ? [] : alternateUrls(pathname),
    noindex,
    twitterHandle: typeof seo.twitter_handle === 'string' ? seo.twitter_handle.trim() : '',
    googleVerification: typeof seo.google_site_verification === 'string' ? seo.google_site_verification.trim() : '',
    jsonLd,
  };
}

/** The <head> tags for a preview, one per line, all owned by react-helmet-async. */
export function renderHeadTags(p) {
  const rh = 'data-rh="true"';
  const meta = (attr, key, value) => `<meta ${attr}="${key}" content="${escapeAttr(value)}" ${rh} />`;
  const tags = [
    `<title>${escapeAttr(p.title)}</title>`,
    meta('name', 'description', p.description),
  ];
  if (p.keywords) tags.push(meta('name', 'keywords', p.keywords));
  tags.push(
    meta('property', 'og:title', p.title),
    meta('property', 'og:description', p.description),
    meta('property', 'og:type', p.type),
    meta('property', 'og:url', p.url),
    meta('property', 'og:locale', p.locale),
  );
  if (p.alternates.length) tags.push(meta('property', 'og:locale:alternate', p.lang === 'ar' ? 'en_US' : 'ar_EG'));
  tags.push(meta('property', 'og:image', p.image));
  if (p.imageIsShare) {
    tags.push(
      meta('property', 'og:image:width', String(SHARE_IMAGE_SIZE.width)),
      meta('property', 'og:image:height', String(SHARE_IMAGE_SIZE.height)),
    );
  }
  tags.push(
    meta('property', 'og:image:alt', p.imageAlt),
    meta('name', 'twitter:card', 'summary_large_image'),
    meta('name', 'twitter:title', p.title),
    meta('name', 'twitter:description', p.description),
    meta('name', 'twitter:image', p.image),
  );
  if (p.twitterHandle) tags.push(meta('name', 'twitter:creator', p.twitterHandle));
  if (p.googleVerification) tags.push(meta('name', 'google-site-verification', p.googleVerification));
  if (p.noindex) tags.push(meta('name', 'robots', 'noindex, nofollow'));
  else tags.push(`<link rel="canonical" href="${escapeAttr(p.url)}" ${rh} />`);
  for (const alt of p.alternates) {
    tags.push(`<link rel="alternate" hreflang="${alt.hrefLang}" href="${escapeAttr(alt.href)}" ${rh} />`);
  }
  if (p.jsonLd) {
    // Escape "<" so the JSON cannot close the script element.
    tags.push(`<script type="application/ld+json" ${rh}>${JSON.stringify(p.jsonLd).replace(/</g, '\\u003c')}</script>`);
  }
  return tags.join('\n    ');
}

/**
 * Puts the tags between the head-meta markers of index.html and sets
 * <html lang dir>. Returns null when the markers are missing, so the caller
 * can serve the page unchanged.
 */
export function injectHead(html, preview) {
  const start = html.indexOf(HEAD_START);
  const end = html.indexOf(HEAD_END);
  if (start === -1 || end === -1 || end < start) return null;
  const head = `${HEAD_START}\n    ${renderHeadTags(preview)}\n    `;
  let out = html.slice(0, start) + head + html.slice(end);
  out = out.replace(/<html\b[^>]*>/i, `<html lang="${preview.lang}" dir="${preview.dir}">`);
  return out;
}
