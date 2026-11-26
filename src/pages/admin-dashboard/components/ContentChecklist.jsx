// src/pages/admin-dashboard/components/ContentChecklist.jsx
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';
import { projectCover } from 'lib/projectMedia';

const hasText = (value, min = 1) => typeof value === 'string' && value.trim().length >= min;
const hasItems = (value) => Array.isArray(value) && value.length > 0;

/** Gaps a visitor would notice, in the order they would notice them. */
export const projectGaps = (project) => {
  const gaps = [];
  if (!projectCover(project)) gaps.push('cover image');
  if (!hasText(project.description, 40)) gaps.push('short description');
  if (!hasItems(project.technologies)) gaps.push('tech stack');
  if (project.enable_case_study !== false && (!hasText(project.problem) || !hasText(project.solution))) {
    gaps.push('problem and solution');
  }
  if (!hasItems(project.screenshots)) gaps.push('screenshots');
  return gaps;
};

export const profileGaps = (profile, careerData) => {
  const gaps = [];
  if (!hasText(profile?.avatar)) gaps.push({ label: 'Profile photo', tab: 'profile' });
  if (!hasText(profile?.bio, 40)) gaps.push({ label: 'Bio', tab: 'profile' });
  if (!hasText(profile?.cv_url) && !hasText(profile?.resume_url)) gaps.push({ label: 'CV link', tab: 'profile' });
  if (!hasItems(careerData?.timeline)) gaps.push({ label: 'Career timeline', tab: 'career' });
  return gaps;
};

const ContentChecklist = ({ projects, profile, careerData }) => {
  const projectItems = useMemo(
    () =>
      projects
        .filter((p) => p.publishing_status !== 'draft')
        .map((p) => ({ project: p, gaps: projectGaps(p) }))
        .filter((item) => item.gaps.length > 0),
    [projects]
  );
  const profileItems = useMemo(() => profileGaps(profile, careerData), [profile, careerData]);
  const total = projectItems.length + profileItems.length;

  return (
    <section className="card h-full" aria-labelledby="content-checklist-title">
      <div>
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <h3 id="content-checklist-title" className="text-lg font-semibold text-primary-800 dark:text-text-primary flex items-center gap-2">
              <Icon name="ListChecks" size={20} className="text-accent dark:text-accent-text" />
              Content checklist
            </h3>
            <p className="text-sm text-secondary-600 dark:text-text-secondary mt-1">
              Things visitors see as missing on the live site.
            </p>
          </div>
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              total === 0
                ? 'bg-success-50 text-success-700 dark:bg-success-900/30 dark:text-success-text'
                : 'bg-warning-50 text-warning-800 dark:bg-warning-900/30 dark:text-warning'
            }`}
          >
            {total === 0 ? 'All set' : `${total} to review`}
          </span>
        </div>

        {total === 0 ? (
          <div className="flex items-center gap-3 rounded-lg bg-success-50 dark:bg-success-900/20 px-4 py-3 text-sm text-success-800 dark:text-success-text">
            <Icon name="CheckCircle" size={18} />
            Every published project has a cover, description, tech stack, and case study.
          </div>
        ) : (
          <ul className="space-y-2">
            {profileItems.map((gap) => (
              <li key={gap.label}>
                <Link
                  to="/settings-manager"
                  state={{ tab: gap.tab }}
                  className="flex items-center justify-between gap-3 rounded-lg border border-primary-100 dark:border-border px-4 py-3 hover:border-accent transition-colors"
                >
                  <span className="flex items-center gap-3 min-w-0">
                    <Icon name="User" size={16} className="text-secondary-500 dark:text-muted flex-shrink-0" />
                    <span className="text-sm text-primary-800 dark:text-text-primary">
                      Profile: <span className="font-semibold">{gap.label}</span> is empty
                    </span>
                  </span>
                  <Icon name="ChevronRight" size={16} className="text-secondary-400 dark:text-muted flex-shrink-0" />
                </Link>
              </li>
            ))}
            {projectItems.slice(0, 6).map(({ project, gaps }) => (
              <li key={project.id}>
                <Link
                  to={`/project-manager?id=${project.id}`}
                  className="flex items-center justify-between gap-3 rounded-lg border border-primary-100 dark:border-border px-4 py-3 hover:border-accent transition-colors"
                >
                  <span className="min-w-0">
                    <span dir="auto" className="block text-sm font-semibold text-primary-800 dark:text-text-primary truncate">
                      {project.title}
                    </span>
                    <span className="block text-xs text-secondary-600 dark:text-text-secondary mt-0.5">
                      Missing: {gaps.join(', ')}
                    </span>
                  </span>
                  <Icon name="ChevronRight" size={16} className="text-secondary-400 dark:text-muted flex-shrink-0" />
                </Link>
              </li>
            ))}
            {projectItems.length > 6 && (
              <li className="text-xs text-secondary-500 dark:text-muted px-1">
                And {projectItems.length - 6} more in the projects list.
              </li>
            )}
          </ul>
        )}
      </div>
    </section>
  );
};

export default ContentChecklist;
