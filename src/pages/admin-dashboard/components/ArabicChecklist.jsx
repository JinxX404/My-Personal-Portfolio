// src/pages/admin-dashboard/components/ArabicChecklist.jsx
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';
import {
  CAREER_SPEC,
  describeMissing,
  missingArabic,
  PROFILE_SPEC,
  PROJECT_SPEC,
  SEO_SPEC,
  SITE_SPEC,
  SKILL_CATEGORY_SPEC,
} from '../../../i18n/content.mjs';

/** Everything with English text but no Arabic, grouped by where to fix it. */
export const arabicGaps = ({ projects = [], settings = {}, skillCategories = {} }) => {
  const items = [];
  const settingsTabs = [
    { tab: 'profile', label: 'Profile', source: settings.profile, spec: PROFILE_SPEC },
    { tab: 'career', label: 'Career data', source: settings.career_data, spec: CAREER_SPEC },
    { tab: 'site', label: 'Site settings', source: settings.site_settings, spec: SITE_SPEC },
    { tab: 'seo', label: 'SEO', source: settings.seo_settings, spec: SEO_SPEC },
  ];
  settingsTabs.forEach(({ tab, label, source, spec }) => {
    const missing = missingArabic(source, spec);
    if (missing.length) items.push({ key: `settings-${tab}`, kind: 'settings', label, missing, to: '/settings-manager', state: { tab } });
  });
  projects
    .filter((project) => project.publishing_status !== 'draft')
    .forEach((project) => {
      const source = project.enable_case_study ? project : { ...project, problem: null, solution: null, results: null, testimonials: [] };
      const missing = missingArabic(source, PROJECT_SPEC);
      if (missing.length) items.push({ key: `project-${project.id}`, kind: 'project', label: project.title || 'Untitled project', missing, to: `/project-manager?id=${project.id}` });
    });
  const categories = Object.values(skillCategories || {}).filter((category) => missingArabic(category, SKILL_CATEGORY_SPEC).length);
  if (categories.length) {
    items.push({ key: 'skills', kind: 'skills', label: 'Skill categories', missing: categories.map((category) => category.title), to: '/skills-manager' });
  }
  return items;
};

const ICONS = { settings: 'User', project: 'Briefcase', skills: 'Layers' };

const ArabicChecklist = ({ projects, settings, skillCategories }) => {
  const items = useMemo(() => arabicGaps({ projects, settings, skillCategories }), [projects, settings, skillCategories]);
  const fieldCount = items.reduce((sum, item) => sum + item.missing.length, 0);

  return (
    <section className="card h-full" aria-labelledby="arabic-checklist-title" data-arabic-checklist>
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h3 id="arabic-checklist-title" className="text-lg font-semibold text-primary-800 dark:text-text-primary flex items-center gap-2">
            <Icon name="Languages" size={20} className="text-accent dark:text-accent-text" />
            Arabic version
          </h3>
          <p className="text-sm text-secondary-600 dark:text-text-secondary mt-1">
            Text the Arabic site (/ar) still shows in English.
          </p>
        </div>
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${
            fieldCount === 0
              ? 'bg-success-50 text-success-700 dark:bg-success-900/30 dark:text-success-text'
              : 'bg-warning-50 text-warning-800 dark:bg-warning-900/30 dark:text-warning'
          }`}
        >
          {fieldCount === 0 ? 'All translated' : `${fieldCount} field${fieldCount === 1 ? '' : 's'} missing`}
        </span>
      </div>

      {items.length === 0 ? (
        <div className="flex items-center gap-3 rounded-lg bg-success-50 dark:bg-success-900/20 px-4 py-3 text-sm text-success-800 dark:text-success-text">
          <Icon name="CheckCircle" size={18} />
          Every published text has an Arabic version.
        </div>
      ) : (
        <ul className="space-y-2">
          {items.slice(0, 8).map((item) => (
            <li key={item.key}>
              <Link
                to={item.to}
                state={item.state}
                className="flex items-center justify-between gap-3 rounded-lg border border-primary-100 dark:border-border px-4 py-3 hover:border-accent transition-colors"
              >
                <span className="flex items-center gap-3 min-w-0">
                  <Icon name={ICONS[item.kind]} size={16} className="text-secondary-500 dark:text-muted flex-shrink-0" />
                  <span className="min-w-0">
                    <span dir="auto" className="block text-sm font-semibold text-primary-800 dark:text-text-primary truncate">
                      {item.label}
                    </span>
                    <span className="block text-xs text-secondary-600 dark:text-text-secondary mt-0.5 truncate">
                      {item.missing.length} missing: {(item.kind === 'skills' ? item.missing : describeMissing(item.missing)).slice(0, 4).join(', ')}
                      {item.missing.length > 4 ? '…' : ''}
                    </span>
                  </span>
                </span>
                <Icon name="ChevronRight" size={16} className="text-secondary-400 dark:text-muted flex-shrink-0" />
              </Link>
            </li>
          ))}
          {items.length > 8 && (
            <li className="text-xs text-secondary-500 dark:text-muted px-1">And {items.length - 8} more.</li>
          )}
        </ul>
      )}
    </section>
  );
};

export default ArabicChecklist;
