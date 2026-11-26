import test from 'node:test';
import assert from 'node:assert/strict';
import { alternateUrls, canonicalUrl, resolveRouteMeta, formatPageTitle } from './pageMeta.js';

test('canonical URL stays in the page language', () => {
  assert.equal(canonicalUrl('/'), 'https://moatazz.site/');
  assert.equal(canonicalUrl('/ar'), 'https://moatazz.site/ar');
  assert.equal(canonicalUrl('/ar/'), 'https://moatazz.site/ar');
  assert.equal(canonicalUrl('/ar/projects/42'), 'https://moatazz.site/ar/projects/42');
  assert.equal(canonicalUrl('/portfolio-gallery'), 'https://moatazz.site/projects');
  assert.equal(canonicalUrl('/case-study-detail/9?x=1'), 'https://moatazz.site/projects/9');
});

test('hreflang alternates for bilingual pages only', () => {
  assert.deepEqual(alternateUrls('/ar/about-story'), [
    { hrefLang: 'en', href: 'https://moatazz.site/about-story' },
    { hrefLang: 'ar', href: 'https://moatazz.site/ar/about-story' },
    { hrefLang: 'x-default', href: 'https://moatazz.site/about-story' },
  ]);
  assert.equal(alternateUrls('/')[1].href, 'https://moatazz.site/ar');
  assert.deepEqual(alternateUrls('/login'), []);
  assert.deepEqual(alternateUrls('/admin-dashboard'), []);
});

test('route meta resolves in both languages; unknown /ar paths are 404s', () => {
  assert.equal(resolveRouteMeta('/ar/contact-hub').page, 'meta.contact.page');
  assert.equal(resolveRouteMeta('/ar').isHome, true);
  assert.equal(resolveRouteMeta('/ar/login').noindex, true);
  assert.equal(resolveRouteMeta('/ar/login').page, 'meta.notFound.page');
  assert.equal(resolveRouteMeta('/login').page, 'meta.login.page');
  assert.equal(resolveRouteMeta('/ar/services').page, 'meta.services.page');
  assert.equal(resolveRouteMeta('/services-manager').noindex, true);
});

test('page title', () => {
  assert.equal(formatPageTitle(null, { full_name: 'A', title: 'B' }), 'A — B');
  assert.equal(formatPageTitle('X', null, { name: 'N', role: 'R' }), 'X — N | R');
});
