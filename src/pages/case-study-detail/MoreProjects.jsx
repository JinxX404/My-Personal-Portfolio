import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import Icon from "components/AppIcon";
import Image from "components/AppImage";
import { coverForProject } from "lib/projectMedia";
import { useI18n } from "i18n/I18nContext";
import { localizeProject } from "i18n/content.mjs";

/**
 * Previous / next project plus up to two related projects (same category
 * first). Uses the published list already loaded by ProjectsContext.
 */
const MoreProjects = ({ currentId, category, projects }) => {
  const { t, lp, lang } = useI18n();
  const published = useMemo(
    () =>
      (projects || [])
        .filter(
          (p) =>
            ["published", "in_progress"].includes(p.publishing_status) &&
            (p.visibility || "public") === "public"
        )
        .map((p) => ({ ...localizeProject(p, lang), categoryKey: p.category })),
    [projects, lang]
  );

  const { previous, next, related } = useMemo(() => {
    const index = published.findIndex((p) => p.id === currentId);
    const others = published.filter((p) => p.id !== currentId);
    const sameCategory = others.filter((p) => category && p.categoryKey === category);
    const rest = others.filter((p) => !sameCategory.includes(p));
    return {
      previous: index > 0 ? published[index - 1] : null,
      next: index >= 0 && index < published.length - 1 ? published[index + 1] : null,
      related: [...sameCategory, ...rest].slice(0, 2),
    };
  }, [published, currentId, category]);

  if (!previous && !next && related.length === 0) {
    return (
      <div className="text-center">
        <Link to={lp("/projects")} className="btn-primary inline-flex items-center space-x-2 rtl:space-x-reverse">
          <span>{t('projects.viewAllButton')}</span>
          <Icon name="ArrowRight" size={16} strokeWidth={2} />
        </Link>
      </div>
    );
  }

  return (
    <section
      aria-labelledby="more-projects-title"
      className="bg-surface dark:bg-surface rounded-lg shadow-sm border border-border dark:border-border-strong p-8"
    >
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <h2 id="more-projects-title" className="text-3xl font-bold text-text-primary dark:text-white">
          {t('caseStudy.moreProjects')}
        </h2>
        <Link
          to={lp("/projects")}
          className="inline-flex items-center gap-1 text-sm font-semibold text-accent dark:text-accent-text"
        >
          {t('caseStudy.allProjects')}
          <Icon name="ArrowRight" size={16} strokeWidth={2} />
        </Link>
      </div>

      {related.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {related.map((project) => (
            <Link
              key={project.id}
              to={lp(`/projects/${project.id}`)}
              className="group block rounded-xl overflow-hidden border border-border dark:border-border-strong bg-background hover:border-accent hover:shadow-lg transition-all duration-300"
            >
              <div className="relative overflow-hidden aspect-[16/9]">
                <Image
                  src={coverForProject(project)}
                  alt=""
                  width={800}
                  height={450}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-5">
                {project.category && (
                  <span dir="auto" className="text-xs font-semibold uppercase tracking-wide text-accent dark:text-accent-text">
                    {project.category}
                  </span>
                )}
                <h3 dir="auto" className="text-lg font-semibold text-text-primary mt-1 mb-2 group-hover:text-accent dark:group-hover:text-accent-text transition-colors">
                  {project.title}
                </h3>
                {project.description && (
                  <p dir="auto" className="text-sm text-text-secondary line-clamp-2">
                    {project.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      {(previous || next) && (
        <nav
          aria-label={t('caseStudy.projectNav')}
          className="grid sm:grid-cols-2 gap-4 pt-6 border-t border-border dark:border-border-strong"
        >
          {previous ? (
            <Link
              to={lp(`/projects/${previous.id}`)}
              className="group flex items-center gap-3 p-4 rounded-lg hover:bg-background transition-colors"
            >
              <Icon name="ArrowLeft" size={18} className="text-text-secondary group-hover:text-accent flex-shrink-0" />
              <span className="min-w-0">
                <span className="block text-xs uppercase tracking-wide text-muted">{t('caseStudy.previous')}</span>
                <span dir="auto" className="block font-semibold text-text-primary truncate">{previous.title}</span>
              </span>
            </Link>
          ) : (
            <span aria-hidden="true" />
          )}
          {next && (
            <Link
              to={lp(`/projects/${next.id}`)}
              className="group flex items-center justify-end gap-3 p-4 rounded-lg hover:bg-background transition-colors text-end"
            >
              <span className="min-w-0">
                <span className="block text-xs uppercase tracking-wide text-muted">{t('caseStudy.next')}</span>
                <span dir="auto" className="block font-semibold text-text-primary truncate">{next.title}</span>
              </span>
              <Icon name="ArrowRight" size={18} className="text-text-secondary group-hover:text-accent flex-shrink-0" />
            </Link>
          )}
        </nav>
      )}
    </section>
  );
};

export default MoreProjects;
