import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { detectPlatform } from './socialPlatforms.mjs';
import { whatsappNumber, whatsappUrl } from './whatsapp.mjs';
import { budgetLabel, budgetOptions, currencyOfBudget, defaultCurrency } from './budget.mjs';
import { formatServicePrice, isMissingTableError, prepareFaqs, prepareServices, serviceContactPath } from './services.mjs';
import { featuredTestimonials, missingArabic, SERVICE_SPEC } from '../i18n/content.mjs';
import { buildSitemap } from '../../netlify/functions/sitemap.mjs';

test('social links: Mostaql and hostname matching', () => {
  assert.equal(detectPlatform('https://mostaql.com/u/someone').key, 'mostaql');
  assert.equal(detectPlatform('https://mostaql.com/u/someone', '', 'ar').label, 'مستقل');
  assert.equal(detectPlatform('https://x.com/someone').key, 'twitter');
  assert.equal(detectPlatform('https://twitter.com/someone').key, 'twitter');
  // Substrings of other domains must not match.
  assert.equal(detectPlatform('https://dropbox.com/s/file').key, 'website');
  assert.equal(detectPlatform('https://www.linkedin.com/in/someone').key, 'linkedin');
  assert.equal(detectPlatform('https://wa.me/201000000000').key, 'whatsapp');
  // Unknown URL falls back to the saved key, then to a generic website.
  assert.equal(detectPlatform('https://example.org', 'github').key, 'github');
  assert.equal(detectPlatform('https://example.org', 'custom').label, 'Website');
  assert.equal(detectPlatform('not a url', 'mostaql').key, 'mostaql');
});

test('whatsapp number and link', () => {
  assert.equal(whatsappNumber('+20 100 000 0000'), '201000000000');
  assert.equal(whatsappNumber('00201000000000'), '201000000000');
  assert.equal(whatsappNumber('+٢٠ ١٠٠ ٠٠٠ ٠٠٠٠'), '201000000000');
  assert.equal(whatsappNumber('010'), '');
  assert.equal(whatsappNumber(''), '');
  assert.equal(whatsappNumber(undefined), '');
  assert.equal(whatsappUrl('+20 100 000 0000', 'مرحبا'), `https://wa.me/201000000000?text=${encodeURIComponent('مرحبا')}`);
  assert.equal(whatsappUrl('abc', 'hi'), '');
});

test('budget ranges in EGP and USD', () => {
  assert.equal(defaultCurrency('ar'), 'EGP');
  assert.equal(defaultCurrency('en'), 'USD');
  assert.equal(currencyOfBudget('egp-10k-30k'), 'EGP');
  assert.equal(currencyOfBudget('5k-15k'), 'USD');
  assert.equal(currencyOfBudget('discuss'), null);
  assert.equal(budgetLabel('egp-10k-30k', 'en'), 'EGP 10,000 - 30,000');
  assert.equal(budgetLabel('5k-15k'), '$5,000 - $15,000');
  // Old or unknown values are shown as they were stored.
  assert.equal(budgetLabel('something else'), 'something else');
  const egp = budgetOptions('EGP', 'ar').map((o) => o.value);
  assert.ok(egp.every((v) => v.startsWith('egp-') || v === 'discuss'));
  assert.ok(budgetOptions('USD', 'en').some((o) => o.value === 'under-5k'));
  for (const o of budgetOptions('EGP', 'ar')) assert.ok(o.label.length <= 80, 'fits the contact function limit');
});

test('services: filter, order, localize and price', () => {
  const rows = [
    { id: 'b', title: 'B', title_ar: 'ب', published: true, order_index: 2, deliverables: [{ text: 'x', text_ar: 'س' }, { text: 'y' }] },
    { id: 'a', title: 'A', published: true, order_index: 1, deliverables: [] },
    { id: 'c', title: 'C', published: false, order_index: 0 },
    { id: 'd', title: '', published: true, order_index: 0 },
  ];
  const ar = prepareServices(rows, 'ar');
  assert.deepEqual(ar.map((s) => s.id), ['a', 'b']);
  assert.equal(ar[1].title, 'ب');
  assert.deepEqual(ar[1].deliverables, ['س', 'y']);
  assert.equal(prepareServices(rows, 'en')[1].title, 'B');
  assert.deepEqual(prepareFaqs([{ id: 1, question: 'Q', answer: 'A', question_ar: 'س', published: true }], 'ar')[0].question, 'س');

  assert.equal(formatServicePrice({ price_from: null }, 'en'), null);
  assert.equal(formatServicePrice({ price_from: 5000, currency: 'EGP' }, 'en'), 'EGP 5,000');
  assert.equal(formatServicePrice({ price_from: 5000, currency: 'EGP' }, 'ar'), '5,000 جنيه');
  assert.equal(formatServicePrice({ price_from: 300, currency: 'USD' }, 'en'), '$300');
  assert.equal(serviceContactPath({ id: 'abc' }), '/contact-hub?service=abc');

  assert.equal(isMissingTableError({ code: 'PGRST205' }), true);
  assert.equal(isMissingTableError({ code: '42P01' }), true);
  assert.equal(isMissingTableError({ code: '42501' }), false);

  assert.deepEqual(missingArabic({ title: 'T', deliverables: [{ text: 'x', text_ar: 'س' }] }, SERVICE_SPEC), ['title']);
});

test('homepage testimonials: featured only, from visible case studies', () => {
  const projects = [
    { id: 1, title: 'P1', title_ar: 'م1', testimonials: [
      { content: 'Great', content_ar: 'ممتاز', name: 'N', featured: true },
      { content: 'Fine', name: 'M' },
    ] },
    { id: 2, title: 'P2', enable_case_study: false, testimonials: [{ content: 'Hidden', name: 'H', featured: true }] },
    { id: 3, title: 'P3', testimonials: [{ content: '', name: 'Empty', featured: true }] },
    { id: 4, title: 'P4' },
  ];
  const ar = featuredTestimonials(projects, 'ar');
  assert.equal(ar.length, 1);
  assert.equal(ar[0].quote, 'ممتاز');
  assert.equal(ar[0].projectTitle, 'م1');
  assert.equal(featuredTestimonials(projects, 'en')[0].quote, 'Great');
  assert.deepEqual(featuredTestimonials([], 'en'), []);
});

test('sitemap lists /services only when a service is published', () => {
  assert.ok(!buildSitemap([]).includes('/services<'));
  const xml = buildSitemap([], { hasServices: true });
  assert.ok(xml.includes('/services</loc>'));
  assert.ok(xml.includes('/ar/services</loc>'));
});

test('migration 009 is additive and admin-only for writes', async () => {
  const sql = (await readFile(new URL('../../supabase/migrations/009_services_faq.sql', import.meta.url), 'utf8'))
    .split('\n').filter((line) => !line.trim().startsWith('--')).join('\n').toLowerCase();
  assert.ok(!/\bdrop\s+(table|column)\b/.test(sql), 'no drops');
  assert.ok(!/alter\s+table\s+(public\.)?(projects|skills|portfolio_settings|contact_submissions)\b/.test(sql), 'existing tables untouched');
  for (const table of ['services', 'faqs']) {
    assert.ok(sql.includes(`create table if not exists public.${table}`));
    assert.ok(sql.includes(`alter table public.${table} enable row level security`));
  }
  assert.ok(sql.includes('grant select on table public.services, public.faqs to anon'));
  const policies = sql.match(/create policy/g) || [];
  assert.equal(policies.length, 10);
  const writes = sql.match(/create policy[^;]*for (insert|update|delete)[^;]*;/g) || [];
  assert.equal(writes.length, 6);
  for (const policy of writes) assert.ok(policy.includes('is_admin()'), policy);
  assert.ok((sql.match(/using \(published = true\)/g) || []).length === 2);
  assert.ok(!/grant (insert|update|delete|all)[^;]*to anon/.test(sql), 'anon cannot write');
});
