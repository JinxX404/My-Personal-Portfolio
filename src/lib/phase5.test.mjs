import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { buildPreview, escapeAttr, HEAD_END, HEAD_START, injectHead, projectIdFromPath, renderHeadTags } from './linkPreview.mjs';
import { alertConfig, buildAlertEmail, sendContactAlert } from '../../netlify/lib/contactAlert.mjs';

const SETTINGS = {
  profile: { full_name: 'Test Person', full_name_ar: 'شخص تجريبي', title: 'Developer', title_ar: 'مطور' },
  seo_settings: { og_image: 'https://cdn.example.com/og.png', google_site_verification: 'abc123' },
  site_settings: {},
  social_links: {},
};
const PROJECT = {
  id: 'p-1', title: 'Shop "One"', title_ar: 'متجر واحد', description: 'A <b>shop</b>', description_ar: 'متجر إلكتروني',
  publishing_status: 'published', visibility: 'public', hero_images: ['https://cdn.example.com/hero.jpg'],
};

test('project id from path', () => {
  assert.equal(projectIdFromPath('/projects/abc-123'), 'abc-123');
  assert.equal(projectIdFromPath('/ar/projects/abc-123/'), 'abc-123');
  assert.equal(projectIdFromPath('/case-study-detail/abc'), 'abc');
  assert.equal(projectIdFromPath('/projects'), null);
  assert.equal(projectIdFromPath('/projects/a%3Cb'), null);
  assert.equal(projectIdFromPath('/projects/a/b'), null);
});

test('route meta in both languages, with settings', () => {
  const en = buildPreview({ pathname: '/services', settings: SETTINGS });
  assert.equal(en.title, 'Services — Test Person | Developer');
  assert.equal(en.url, 'https://moatazz.site/services');
  assert.equal(en.image, 'https://cdn.example.com/og.png');
  assert.deepEqual(en.alternates.map((a) => a.href), ['https://moatazz.site/services', 'https://moatazz.site/ar/services', 'https://moatazz.site/services']);
  const ar = buildPreview({ pathname: '/ar/services', settings: SETTINGS });
  assert.equal(ar.lang, 'ar');
  assert.equal(ar.dir, 'rtl');
  assert.equal(ar.title, 'الخدمات — شخص تجريبي | مطور');
  assert.equal(ar.locale, 'ar_EG');
  assert.ok(!/[A-Za-z]{4,}/.test(ar.description.replace(/Full-Stack|\.NET/g, '')), 'Arabic description on /ar');
  // Without settings (Supabase down) it still works.
  assert.match(buildPreview({ pathname: '/ar' }).title, /^معتز محمد/);
});

test('project pages: localized, share image first, hidden ones noindex', () => {
  const en = buildPreview({ pathname: '/projects/p-1', settings: SETTINGS, project: PROJECT });
  assert.equal(en.title, 'Shop "One" — Test Person | Developer');
  assert.equal(en.image, 'https://cdn.example.com/hero.jpg');
  assert.equal(en.type, 'article');
  const ar = buildPreview({ pathname: '/ar/projects/p-1', settings: SETTINGS, project: { ...PROJECT, share_image: 'https://cdn.example.com/en.png', share_image_ar: 'https://cdn.example.com/ar.png' } });
  assert.equal(ar.title, 'متجر واحد — شخص تجريبي | مطور');
  assert.equal(ar.description, 'متجر إلكتروني');
  assert.equal(ar.image, 'https://cdn.example.com/ar.png');
  assert.equal(ar.imageIsShare, true);
  assert.equal(buildPreview({ pathname: '/projects/p-1', project: { ...PROJECT, share_image_ar: 'https://cdn.example.com/ar.png' } }).image, 'https://cdn.example.com/ar.png');
  for (const project of [null, { ...PROJECT, visibility: 'private' }, { ...PROJECT, publishing_status: 'draft' }]) {
    const p = buildPreview({ pathname: '/projects/p-1', settings: SETTINGS, project });
    assert.equal(p.noindex, true);
    assert.deepEqual(p.alternates, []);
  }
  // Lookup failed: generic project meta, still indexable.
  const unknown = buildPreview({ pathname: '/projects/p-1', settings: SETTINGS, project: undefined });
  assert.equal(unknown.noindex, false);
  assert.match(unknown.title, /^Project Details/);
});

test('admin and unknown /ar pages are noindex', () => {
  assert.equal(buildPreview({ pathname: '/admin-dashboard' }).noindex, true);
  assert.equal(buildPreview({ pathname: '/ar/login' }).noindex, true);
  assert.equal(buildPreview({ pathname: '/ar/projects/p-1', project: PROJECT }).noindex, false);
});

test('rendered tags are escaped, owned by Helmet, and replace the defaults', () => {
  const p = buildPreview({ pathname: '/projects/p-1', settings: SETTINGS, project: { ...PROJECT, share_image: 'https://cdn.example.com/x.png' } });
  const tags = renderHeadTags(p);
  assert.ok(tags.includes('content="Shop &quot;One&quot; — Test Person | Developer"'));
  assert.ok(tags.includes('A &lt;b&gt;shop&lt;/b&gt;'));
  assert.ok(tags.includes('<meta property="og:image:width" content="1200" data-rh="true" />'));
  assert.ok(tags.includes('<meta name="google-site-verification" content="abc123" data-rh="true" />'));
  assert.ok(tags.includes('<link rel="alternate" hreflang="ar" href="https://moatazz.site/ar/projects/p-1" data-rh="true" />'));
  for (const line of tags.split('\n').map((l) => l.trim()).filter((l) => !l.startsWith('<title'))) {
    assert.ok(line.includes('data-rh="true"'), line);
  }
  assert.equal(escapeAttr('"<&>'), '&quot;&lt;&amp;&gt;');
  const home = renderHeadTags(buildPreview({ pathname: '/', settings: { ...SETTINGS, profile: { full_name: '</script><x>' } } }));
  assert.ok(!home.includes('</script><x>'), 'JSON-LD cannot close the script tag');
});

test('injectHead replaces only the marked block and sets lang/dir', async () => {
  const html = await readFile(new URL('../../index.html', import.meta.url), 'utf8');
  assert.ok(html.includes(HEAD_START) && html.includes(HEAD_END));
  const block = html.slice(html.indexOf(HEAD_START), html.indexOf(HEAD_END));
  // Defaults are Helmet-owned, so the app replaces them (no duplicate English description on /ar).
  for (const line of block.split('\n').filter((l) => l.includes('<meta'))) assert.ok(line.includes('data-rh="true"'), line);
  const out = injectHead(html, buildPreview({ pathname: '/ar/services', settings: SETTINGS }));
  assert.ok(out.startsWith('<!doctype html>\n<html lang="ar" dir="rtl">'));
  assert.equal((out.match(/name="description"/g) || []).length, 1);
  assert.equal((out.match(/<title>/g) || []).length, 1);
  assert.ok(out.includes('الخدمات — شخص تجريبي'));
  assert.ok(out.includes('<link rel="icon" href="/favicon.svg"'), 'rest of head untouched');
  assert.equal(injectHead('<html><head></head></html>', buildPreview({ pathname: '/' })), null);
});

const ROW = {
  name: 'Sara <S>', email: 'sara@example.com', company: null, phone: '', subject: 'Hello\r\nBcc: x@example.com',
  message: 'Line 1\n<script>alert(1)</script>', inquiry_type: 'project', budget: 'egp-10k-30k', timeline: '1-month',
};

test('contact alert: off unless all three settings exist', () => {
  const env = (values) => (name) => values[name] || '';
  assert.equal(alertConfig(env({})), null);
  assert.equal(alertConfig(env({ RESEND_API_KEY: 'k', ALERT_EMAIL_TO: 'a@example.com' })), null);
  assert.deepEqual(alertConfig(env({ RESEND_API_KEY: 'k', ALERT_EMAIL_TO: 'a@example.com, b@example.com', ALERT_EMAIL_FROM: 'Site <s@example.com>' })).to, ['a@example.com', 'b@example.com']);
});

test('contact alert email: safe subject, escaped html, reply-to visitor, budget in words', () => {
  const email = buildAlertEmail(ROW, { from: 'Site <s@example.com>', to: ['me@example.com'] });
  assert.equal(email.reply_to, 'sara@example.com');
  assert.ok(!/[\r\n]/.test(email.subject));
  assert.ok(email.subject.startsWith('New message: Hello Bcc'));
  assert.ok(email.html.includes('&lt;script&gt;'));
  assert.ok(!email.html.includes('<script>'));
  assert.ok(email.text.includes('Budget: EGP 10,000 - 30,000'));
  assert.ok(!email.text.includes('Company:'), 'empty fields left out');
  assert.ok(email.text.includes('https://moatazz.site/messages-manager'));
});

test('sendContactAlert never throws and reports what happened', async () => {
  const env = (name) => ({ RESEND_API_KEY: 're_x', ALERT_EMAIL_TO: 'me@example.com', ALERT_EMAIL_FROM: 's@example.com' })[name] || '';
  let sent;
  const ok = async (url, init) => { sent = { url, init }; return { ok: true, status: 200 }; };
  assert.equal(await sendContactAlert(ROW, () => '', { fetchImpl: ok }), 'skipped');
  assert.equal(sent, undefined);
  assert.equal(await sendContactAlert(ROW, env, { fetchImpl: ok }), 'sent');
  assert.equal(sent.url, 'https://api.resend.com/emails');
  assert.equal(sent.init.headers.Authorization, 'Bearer re_x');
  assert.equal(JSON.parse(sent.init.body).to[0], 'me@example.com');
  const warn = console.warn; console.warn = () => {};
  try {
    assert.equal(await sendContactAlert(ROW, env, { fetchImpl: async () => ({ ok: false, status: 422 }) }), 'failed');
    assert.equal(await sendContactAlert(ROW, env, { fetchImpl: async () => { throw new Error('network'); } }), 'failed');
  } finally {
    console.warn = warn;
  }
});

test('migration 010 only adds nullable columns', async () => {
  const sql = (await readFile(new URL('../../supabase/migrations/010_project_share_images.sql', import.meta.url), 'utf8'))
    .split('\n').filter((line) => !line.trim().startsWith('--')).join('\n').toLowerCase();
  assert.ok(!/\bdrop\b/.test(sql));
  assert.ok(!/not null/.test(sql));
  assert.equal((sql.match(/add column if not exists/g) || []).length, 2);
  assert.ok(!/policy|grant|revoke/.test(sql));
});
