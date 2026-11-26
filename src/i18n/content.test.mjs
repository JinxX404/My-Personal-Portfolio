import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  AR_COLUMNS,
  CAREER_SPEC,
  describeMissing,
  isFallback,
  isMissingArabicColumnError,
  localize,
  localizeProject,
  missingArabic,
  pick,
  PROFILE_SPEC,
  PROJECT_SPEC,
  stripArabicColumns,
  translateTerm,
} from './content.mjs';
import { writeWithArabicFallback } from '../lib/arabicWrite.js';

test('pick uses Arabic only on ar and only when filled in', () => {
  const row = { title: 'Clinic booking', title_ar: 'حجز العيادات', client: 'Acme', client_ar: '   ' };
  assert.equal(pick(row, 'title', 'ar'), 'حجز العيادات');
  assert.equal(pick(row, 'title', 'en'), 'Clinic booking');
  assert.equal(pick(row, 'client', 'ar'), 'Acme');
  assert.equal(pick(row, 'missing', 'ar'), undefined);
  assert.equal(pick(null, 'title', 'ar'), undefined);
  assert.equal(isFallback(row, 'client', 'ar'), true);
  assert.equal(isFallback(row, 'title', 'ar'), false);
  assert.equal(isFallback(row, 'client', 'en'), false);
});

test('localize returns English untouched and fills Arabic lists item by item', () => {
  const settings = {
    philosophy: 'Ship small',
    philosophy_ar: 'أطلق بخطوات صغيرة',
    timeline: [
      { year: '2024', title: 'Course', title_ar: 'دورة', company: 'Institute' },
      { year: '2023', title: 'Degree' },
    ],
  };
  assert.equal(localize(settings, CAREER_SPEC, 'en'), settings);
  const ar = localize(settings, CAREER_SPEC, 'ar');
  assert.equal(ar.philosophy, 'أطلق بخطوات صغيرة');
  assert.deepEqual(ar.timeline.map((item) => item.title), ['دورة', 'Degree']);
  assert.equal(ar.timeline[0].company, 'Institute');
  assert.equal(ar.timeline[0].year, '2024');
  // The source is not mutated.
  assert.equal(settings.philosophy, 'Ship small');
  assert.equal(settings.timeline[0].title, 'Course');
});

test('localizeProject translates fixed vocabulary and keeps technology names', () => {
  const project = {
    title: 'Shop', title_ar: 'متجر',
    category: 'Web Development', project_type: 'Web Application',
    tags: ['Responsive', 'React', 'API'],
    content_sections: [{ id: 's1', title: 'Overview', title_ar: 'نظرة عامة', content: 'Text' }],
  };
  const ar = localizeProject(project, 'ar');
  assert.equal(ar.title, 'متجر');
  assert.equal(ar.category, 'تطوير الويب');
  assert.equal(ar.project_type, 'تطبيق ويب');
  assert.deepEqual(ar.tags, ['متجاوب', 'React', 'واجهة برمجية']);
  assert.equal(ar.content_sections[0].title, 'نظرة عامة');
  assert.equal(ar.content_sections[0].content, 'Text');
  assert.equal(localizeProject(project, 'en'), project);
  assert.equal(translateTerm('Custom category', 'ar'), 'Custom category');
  assert.equal(translateTerm('Web Development', 'en'), 'Web Development');
});

test('missingArabic lists English-only fields, including list items', () => {
  const project = {
    title: 'Shop', title_ar: 'متجر',
    description: 'A shop', description_ar: '',
    client: '',
    content_sections: [
      { title: 'Overview', title_ar: 'نظرة عامة', content: 'Text', content_ar: 'نص' },
      { title: 'Stack', content: 'React' },
    ],
  };
  const missing = missingArabic(project, PROJECT_SPEC);
  assert.deepEqual(missing, ['description', 'content_sections[1].title', 'content_sections[1].content']);
  assert.deepEqual(describeMissing(missing), ['description', 'section 2 title', 'section 2 content']);
  assert.deepEqual(missingArabic({ full_name: 'Sara', full_name_ar: 'سارة' }, PROFILE_SPEC), []);
  assert.deepEqual(missingArabic(null, PROFILE_SPEC), []);
});

test('stripArabicColumns drops top-level _ar keys only', () => {
  const row = { title: 'Shop', title_ar: 'متجر', content_sections: [{ title_ar: 'x' }] };
  assert.deepEqual(stripArabicColumns(row), { title: 'Shop', content_sections: [{ title_ar: 'x' }] });
});

test('isMissingArabicColumnError matches PostgREST missing-column errors for _ar columns', () => {
  assert.equal(isMissingArabicColumnError({ code: 'PGRST204', message: "Could not find the 'title_ar' column of 'projects' in the schema cache" }), true);
  assert.equal(isMissingArabicColumnError({ code: '42703', message: 'column "name_ar" of relation "skills" does not exist' }), true);
  assert.equal(isMissingArabicColumnError({ code: 'PGRST204', message: "Could not find the 'title' column" }), false);
  assert.equal(isMissingArabicColumnError({ code: '42501', message: 'permission denied for table projects' }), false);
  assert.equal(isMissingArabicColumnError(null), false);
});

test('writeWithArabicFallback retries without _ar columns before migration 008', async () => {
  const calls = [];
  const write = async (row) => {
    calls.push(row);
    return 'title_ar' in row
      ? { data: null, error: { code: 'PGRST204', message: "Could not find the 'title_ar' column of 'projects'" } }
      : { data: { id: 1, ...row }, error: null };
  };
  const warn = console.warn;
  console.warn = () => {};
  try {
    const result = await writeWithArabicFallback({ title: 'Shop', title_ar: 'متجر' }, write);
    assert.equal(result.arabicSkipped, true);
    assert.deepEqual(result.data, { id: 1, title: 'Shop' });
    assert.equal(calls.length, 2);
  } finally {
    console.warn = warn;
  }
  // Other errors are returned as they are, without a retry.
  let count = 0;
  const failing = async () => { count += 1; return { error: { code: '42501', message: 'permission denied' } }; };
  const denied = await writeWithArabicFallback({ title: 'x', title_ar: 'y' }, failing);
  assert.equal(denied.error.code, '42501');
  assert.equal(count, 1);
});

test('migration 008 adds exactly the _ar columns the app writes', () => {
  const sql = readFileSync(new URL('../../supabase/migrations/008_bilingual_content.sql', import.meta.url), 'utf8');
  const code = sql.replace(/--.*$/gm, '');
  const found = {};
  for (const block of code.split(/alter table/i).slice(1)) {
    const table = /^\s+public\.(\w+)/.exec(block)?.[1];
    for (const [, column] of block.matchAll(/add column if not exists\s+(\w+)\s+text/gi)) {
      (found[table] ||= []).push(column);
    }
  }
  const sorted = (object) => Object.fromEntries(Object.entries(object).map(([k, v]) => [k, [...v].sort()]).sort());
  assert.deepEqual(sorted(found), sorted(AR_COLUMNS));
  assert.doesNotMatch(code, /drop\s+column|alter\s+column|drop\s+table/i);
});
