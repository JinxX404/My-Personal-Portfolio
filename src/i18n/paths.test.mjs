import test from 'node:test';
import assert from 'node:assert/strict';
import { languageFromPath, stripLanguage, localizePath, alternatePath, isLocalizedPath, directionFor } from './paths.mjs';
import { messages } from './messages.mjs';

test('language comes from the /ar prefix only', () => {
  assert.equal(languageFromPath('/'), 'en');
  assert.equal(languageFromPath('/ar'), 'ar');
  assert.equal(languageFromPath('/ar/projects/12'), 'ar');
  assert.equal(languageFromPath('/archive'), 'en');
  assert.equal(directionFor('ar'), 'rtl');
  assert.equal(directionFor('en'), 'ltr');
});

test('stripLanguage', () => {
  assert.equal(stripLanguage('/ar'), '/');
  assert.equal(stripLanguage('/ar/about-story'), '/about-story');
  assert.equal(stripLanguage('/projects'), '/projects');
});

test('localizePath keeps English URLs and prefixes Arabic public pages', () => {
  assert.equal(localizePath('/', 'en'), '/');
  assert.equal(localizePath('/', 'ar'), '/ar');
  assert.equal(localizePath('/projects/abc', 'ar'), '/ar/projects/abc');
  assert.equal(localizePath('/projects?filter=web#top', 'ar'), '/ar/projects?filter=web#top');
  assert.equal(localizePath('/ar/contact-hub', 'en'), '/contact-hub');
  assert.equal(localizePath('/ar/contact-hub', 'ar'), '/ar/contact-hub');
  // English-only pages are never prefixed.
  assert.equal(localizePath('/login', 'ar'), '/login');
  assert.equal(localizePath('/admin-dashboard', 'ar'), '/admin-dashboard');
  assert.equal(localizePath('https://example.com', 'ar'), 'https://example.com');
});

test('alternatePath only for pages that exist in both languages', () => {
  assert.equal(alternatePath('/ar/projects/7', 'en'), '/projects/7');
  assert.equal(alternatePath('/about-story', 'ar'), '/ar/about-story');
  assert.equal(alternatePath('/login', 'ar'), null);
  assert.equal(alternatePath('/nope', 'ar'), null);
  assert.equal(isLocalizedPath('/projects/'), true);
});

test('Arabic and English dictionaries have the same keys and placeholders', () => {
  const en = Object.keys(messages.en).filter((k) => !/_(zero|one|two|few|many)$/.test(k)).sort();
  const ar = Object.keys(messages.ar).filter((k) => !/_(zero|one|two|few|many)$/.test(k)).sort();
  assert.deepEqual(ar.filter((k) => !en.includes(k)), [], 'Arabic keys missing in English');
  assert.deepEqual(en.filter((k) => !ar.includes(k)), [], 'English keys missing in Arabic');
  const vars = (s) => (s.match(/\{\w+\}/g) || []).sort().join(',');
  for (const key of en) {
    assert.equal(vars(messages.ar[key]), vars(messages.en[key]), `placeholders differ for ${key}`);
  }
  for (const value of Object.values(messages.ar)) {
    assert.ok(!/[٠-٩]/.test(value), `Arabic-Indic digits in "${value}" (site uses Latin digits)`);
  }
});

test('every translation key used in the code exists', async () => {
  const { readdir, readFile } = await import('node:fs/promises');
  const { join } = await import('node:path');
  const root = new URL('..', import.meta.url).pathname;
  const files = [];
  const walk = async (dir) => {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) await walk(path);
      else if (/\.(jsx?|mjs)$/.test(entry.name) && !entry.name.includes('.test.')) files.push(path);
    }
  };
  await walk(root);
  const prefixes = new Set(Object.keys(messages.en).map((k) => k.split('.')[0]));
  const missing = [];
  for (const file of files) {
    if (file.endsWith('messages.mjs')) continue;
    const source = await readFile(file, 'utf8');
    for (const [, key] of source.matchAll(/['"`]([a-zA-Z]+(?:\.[a-zA-Z0-9]+)+)['"`]/g)) {
      if (!prefixes.has(key.split('.')[0]) || /\.(js|jsx|mjs|png|svg|com|json)$/.test(key)) continue;
      if (!(key in messages.en) && !(`${key}_other` in messages.en)) missing.push(`${key} (${file.slice(root.length)})`);
    }
  }
  assert.deepEqual(missing, []);
});
