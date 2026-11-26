// Bilingual CMS content. English lives in the original fields; Arabic lives in
// a parallel "<field>_ar" column or JSON key. These specs are the single list
// of translatable fields, used by the public site (pick Arabic on /ar with an
// English fallback), the admin forms and the dashboard's missing-Arabic list.

export const AR_SUFFIX = '_ar';

export const arKey = (field) => `${field}${AR_SUFFIX}`;

const hasText = (value) => typeof value === 'string' && value.trim().length > 0;

/** The Arabic value when on Arabic and it is filled in, otherwise English. */
export function pick(source, field, lang) {
  if (!source || typeof source !== 'object') return undefined;
  if (lang === 'ar') {
    const ar = source[arKey(field)];
    if (hasText(ar)) return ar;
  }
  return source[field];
}

/** True when the shown value for `field` is English although Arabic was asked for. */
export function isFallback(source, field, lang) {
  return lang === 'ar' && hasText(source?.[field]) && !hasText(source?.[arKey(field)]);
}

// ---------------------------------------------------------------- specs
// `fields`: scalar text fields. `lists`: arrays of objects whose own text
// fields get `_ar` keys. `arrays`: whole string arrays with an Arabic twin
// array (used as-is when non-empty).

export const PROJECT_SPEC = {
  fields: [
    'title', 'description', 'client',
    'problem', 'solution', 'results', 'meta_title', 'meta_description',
  ],
  lists: {
    content_sections: ['title', 'content'],
    testimonials: ['content', 'name', 'role', 'company'],
  },
};

// Category, tags and project type are picked from fixed lists in the admin,
// so they are translated here once instead of per project. A custom value
// that is not in the list shows as entered.
export const VOCABULARY_AR = {
  // categories
  'Web Development': 'تطوير الويب',
  'Mobile App': 'تطبيق جوال',
  'UI/UX Design': 'تصميم واجهات وتجربة المستخدم',
  'Backend Development': 'تطوير الواجهة الخلفية',
  'E-commerce': 'تجارة إلكترونية',
  'API Development': 'تطوير واجهات برمجية',
  DevOps: 'DevOps',
  'Database Design': 'تصميم قواعد البيانات',
  Other: 'أخرى',
  Uncategorized: 'غير مصنف',
  // tags (technology names stay as they are)
  'Design System': 'نظام تصميم',
  Responsive: 'متجاوب',
  API: 'واجهة برمجية',
  Database: 'قواعد بيانات',
  Cloud: 'سحابي',
  Mobile: 'جوال',
  Performance: 'أداء',
  Security: 'أمان',
  // project types
  'Web Application': 'تطبيق ويب',
  'Desktop Software': 'برنامج سطح مكتب',
};

export const translateTerm = (value, lang) =>
  lang === 'ar' && typeof value === 'string' && VOCABULARY_AR[value.trim()] ? VOCABULARY_AR[value.trim()] : value;

export const PROFILE_SPEC = { fields: ['full_name', 'title', 'tagline', 'bio', 'location'] };
export const SITE_SPEC = { fields: ['site_title', 'site_description'] };
export const SEO_SPEC = { fields: ['meta_title', 'meta_description'] };
export const CAREER_SPEC = {
  fields: ['philosophy', 'mission'],
  lists: {
    timeline: ['title', 'company', 'description'],
    values: ['title', 'description'],
    interests: ['name'],
  },
};
export const SKILL_CATEGORY_SPEC = { fields: ['title'] };
export const SKILL_SPEC = { fields: ['name'] };

/** Database columns added by migration 008 (scalar `_ar` columns only). */
export const AR_COLUMNS = {
  projects: PROJECT_SPEC.fields.map(arKey),
  skill_categories: ['title_ar'],
  skills: ['name_ar'],
};

// ---------------------------------------------------------------- localize

function localizeItem(item, fields, lang) {
  if (!item || typeof item !== 'object' || Array.isArray(item)) return item;
  const out = { ...item };
  for (const field of fields) {
    const value = pick(item, field, lang);
    if (value !== undefined) out[field] = value;
  }
  return out;
}

/**
 * A copy of `source` whose translatable fields hold the text to show in
 * `lang`. English (`lang !== 'ar'`) returns the source unchanged.
 */
export function localize(source, spec, lang) {
  if (lang !== 'ar' || !source || typeof source !== 'object') return source;
  const out = localizeItem(source, spec.fields || [], lang);
  for (const name of spec.arrays || []) {
    const ar = source[arKey(name)];
    if (Array.isArray(ar) && ar.some(hasText)) out[name] = ar.filter(hasText);
  }
  for (const [name, fields] of Object.entries(spec.lists || {})) {
    if (Array.isArray(source[name])) {
      out[name] = source[name].map((item) => localizeItem(item, fields, lang));
    }
  }
  return out;
}

export function localizeProject(project, lang) {
  const out = localize(project, PROJECT_SPEC, lang);
  if (lang !== 'ar' || !out || typeof out !== 'object') return out;
  return {
    ...out,
    category: translateTerm(out.category, lang),
    project_type: translateTerm(out.project_type, lang),
    tags: Array.isArray(out.tags) ? out.tags.map((tag) => translateTerm(tag, lang)) : out.tags,
  };
}

// ---------------------------------------------------------------- coverage

/**
 * Paths whose English text is filled in but whose Arabic is empty, e.g.
 * ['title', 'content_sections[1].content'].
 */
export function missingArabic(source, spec) {
  if (!source || typeof source !== 'object') return [];
  const missing = [];
  for (const field of spec.fields || []) {
    if (hasText(source[field]) && !hasText(source[arKey(field)])) missing.push(field);
  }
  for (const name of spec.arrays || []) {
    const en = source[name];
    const ar = source[arKey(name)];
    if (Array.isArray(en) && en.some(hasText) && !(Array.isArray(ar) && ar.some(hasText))) missing.push(name);
  }
  for (const [name, fields] of Object.entries(spec.lists || {})) {
    const list = source[name];
    if (!Array.isArray(list)) continue;
    list.forEach((item, index) => {
      if (!item || typeof item !== 'object') return;
      for (const field of fields) {
        if (hasText(item[field]) && !hasText(item[arKey(field)])) missing.push(`${name}[${index}].${field}`);
      }
    });
  }
  return missing;
}

/** Human labels for missing paths, grouped: "Title, Section 2 (content)". */
export function describeMissing(paths) {
  const label = (field) => field.replace(/_/g, ' ');
  return paths.map((path) => {
    const match = /^(\w+)\[(\d+)\]\.(\w+)$/.exec(path);
    if (!match) return label(path);
    const [, list, index, field] = match;
    const singular = { content_sections: 'section', metrics: 'metric', testimonials: 'testimonial', screenshots: 'screenshot', timeline: 'timeline item', values: 'value', interests: 'interest' }[list] || list;
    return `${singular} ${Number(index) + 1} ${label(field)}`;
  });
}

/** Top-level keys ending in `_ar` removed: lets a save succeed before the migration is applied. */
export function stripArabicColumns(row) {
  if (!row || typeof row !== 'object') return row;
  const out = {};
  for (const [key, value] of Object.entries(row)) {
    if (!key.endsWith(AR_SUFFIX)) out[key] = value;
  }
  return out;
}

/** True for PostgREST's "column not found" error naming an `_ar` column. */
export function isMissingArabicColumnError(error) {
  const text = `${error?.code || ''} ${error?.message || error || ''}`;
  return /PGRST204|column/i.test(text) && /_ar\b/.test(text);
}
