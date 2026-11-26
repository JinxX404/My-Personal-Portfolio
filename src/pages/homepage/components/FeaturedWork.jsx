import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import LoadError from 'components/ui/LoadError';
import { useProjects } from 'context/ProjectsContext';
import { localizeProject } from '../../../i18n/content.mjs';
import { safeHref } from 'lib/safeUrl';
import { useI18n } from 'i18n/I18nContext';

const PLACEHOLDER = '/assets/images/no_image.png';

const isPublicProject = (project) =>
  project &&
  project.visibility !== 'private' &&
  (project.publishing_status === 'published' || project.publishing_status === 'in_progress');

const toCard = (raw, t, lang) => {
  const project = localizeProject(raw, lang);
  const technologies = Array.isArray(project.technologies) ? project.technologies : [];
  const heroImages = Array.isArray(project.hero_images) ? project.hero_images : [];

  return {
    id: project.id,
    title: project.title || t('project.untitled'),
    category: project.category || t('project.defaultCategory'),
    description: project.description || '',
    image: heroImages[0] || PLACEHOLDER,
    technologies,
    liveUrl: safeHref(project.demo_url),
    githubUrl: safeHref(project.repository_url),
  };
};

const FeaturedWork = () => {
  const { projects, loading, error, loadProjects } = useProjects();
  const [activeProject, setActiveProject] = useState(0);
  const { t, lp, lang } = useI18n();

  // Built from the project list the app already holds (cached and refreshed in
  // the background), so returning to Home shows the cards at once instead of
  // refetching and flashing "Loading projects…" on every visit.
  const { cards, usingFallback } = useMemo(() => {
    const publicProjects = (projects || []).filter(isPublicProject);
    // Same rule the old featured query used: featured and fully published.
    const featured = publicProjects
      .filter((project) => project.featured && project.publishing_status === 'published')
      .map((project) => toCard(project, t, lang));
    if (featured.length > 0) return { cards: featured, usingFallback: false };
    const latest = publicProjects.slice(0, 4).map((project) => toCard(project, t, lang));
    return { cards: latest, usingFallback: latest.length > 0 };
  }, [projects, t, lang]);

  useEffect(() => {
    if (activeProject >= cards.length) setActiveProject(0);
  }, [cards.length, activeProject]);

  const loadError = cards.length === 0 && error ? error : null;

  const retry = () => {
    loadProjects();
  };

  if (loading && cards.length === 0) {
    // Same footprint as the real block, so the page below does not jump when it arrives.
    return <div className="min-h-[28rem]" aria-busy="true" aria-label={t('home.featured.loading')} />;
  }

  if (loadError) {
    return <LoadError message={loadError} onRetry={retry} />;
  }

  if (cards.length === 0) {
    return (
      <div className="text-center text-text-secondary">
        <p>{t('home.featured.empty')}</p>
        <Link to={lp('/projects')} className="inline-flex items-center space-x-2 rtl:space-x-reverse mt-4 text-accent-500 font-semibold dark:text-accent-text">
          <span>{t('home.featured.browse')}</span>
          <Icon name="ArrowRight" size={18} />
        </Link>
      </div>
    );
  }

  const current = cards[Math.min(activeProject, cards.length - 1)];
  const nextProject = () => setActiveProject((prev) => (prev + 1) % cards.length);
  const prevProject = () => setActiveProject((prev) => (prev - 1 + cards.length) % cards.length);

  return (
    <div className="relative transition-theme">
      {usingFallback && (
        <p className="text-center text-sm text-text-secondary mb-6">
          {t('home.featured.fallback')}
        </p>
      )}
      <div className="bg-surface dark:bg-background/80 rounded-2xl shadow-xl overflow-hidden border border-border dark:border-border-strong/50 transition-theme">
        <div className="grid lg:grid-cols-2 gap-0">
          <div className="relative aspect-[16/10] overflow-hidden bg-primary-900 lg:aspect-auto lg:h-full lg:min-h-[22rem]">
            <Image
              src={current.image}
              alt={current.title}
              width={1600}
              height={1000}
              className="absolute inset-0 h-full w-full object-contain"
            />
            <div className="absolute top-4 start-4">
              <span dir="auto" className="px-3 py-1 bg-accent-500/90 text-white text-sm font-medium rounded-full">
                {current.category}
              </span>
            </div>
            <div className="absolute bottom-4 end-4 flex space-x-2 rtl:space-x-reverse">
              {current.liveUrl && (
                <a
                  href={current.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-surface dark:bg-background/80 rounded-full flex items-center justify-center text-text-primary hover:text-accent-500 hover:shadow-xl transition-all duration-200 dark:hover:text-accent-text"
                  aria-label={t('project.openDemoOf', { title: current.title })}
                >
                  <Icon name="ExternalLink" size={18} strokeWidth={2} />
                </a>
              )}
              <Link
                to={lp(`/projects/${current.id}`)}
                className="w-10 h-10 bg-surface dark:bg-background/80 rounded-full flex items-center justify-center text-text-primary hover:text-accent-500 hover:shadow-xl transition-all duration-200 dark:hover:text-accent-text"
                aria-label={t('project.openDetailsOf', { title: current.title })}
              >
                <Icon name="FileText" size={18} strokeWidth={2} />
              </Link>
            </div>
          </div>

          <div className="p-8 lg:p-12 flex flex-col justify-center transition-theme">
            <h3 dir="auto" className="text-3xl font-bold text-text-primary dark:text-primary-100 mb-4">
              {current.title}
            </h3>
            <p dir="auto" className="text-lg text-text-secondary mb-6 leading-relaxed">
              {current.description}
            </p>

            {current.technologies.length > 0 && (
              <div className="mb-8">
                <h4 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-3">
                  {t('project.techStack')}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {current.technologies.map((tech) => (
                    <span
                      key={tech}
                      dir="auto"
                      className="px-3 py-1 bg-primary-100 dark:bg-accent-subtle text-primary-700 dark:text-accent-text text-sm font-medium rounded-lg"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to={lp(`/projects/${current.id}`)}
                className="btn-primary flex items-center justify-center space-x-2 rtl:space-x-reverse px-6 py-3"
              >
                <Icon name="FileText" size={18} strokeWidth={2} />
                <span>{t('project.view')}</span>
              </Link>
              {current.liveUrl && (
                <a
                  href={current.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary flex items-center justify-center space-x-2 rtl:space-x-reverse px-6 py-3"
                >
                  <Icon name="ExternalLink" size={18} strokeWidth={2} />
                  <span>{t('project.liveDemo')}</span>
                </a>
              )}
              {current.githubUrl && (
                <a
                  href={current.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary flex items-center justify-center space-x-2 rtl:space-x-reverse px-6 py-3"
                >
                  <Icon name="Github" size={18} strokeWidth={2} />
                  <span>{t('project.source')}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {cards.length > 1 && (
        <div className="flex items-center justify-between mt-8 transition-theme">
          <button
            type="button"
            onClick={prevProject}
            className="w-12 h-12 bg-surface dark:bg-background/80 rounded-full shadow-lg flex items-center justify-center text-text-primary hover:text-accent-500 dark:hover:text-accent-text"
            aria-label={t('project.previous')}
          >
            <Icon name="ChevronLeft" size={24} strokeWidth={2} />
          </button>

          <div className="flex space-x-2 rtl:space-x-reverse">
            {cards.map((project, index) => (
              <button
                key={project.id}
                type="button"
                onClick={() => setActiveProject(index)}
                aria-label={t('project.show', { title: project.title })}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === activeProject
                    ? 'bg-accent-500 scale-125'
                    : 'bg-primary-200 dark:bg-primary-700 hover:bg-primary-300 dark:hover:bg-primary-600'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={nextProject}
            className="w-12 h-12 bg-surface dark:bg-background/80 rounded-full shadow-lg flex items-center justify-center text-text-primary hover:text-accent-500 dark:hover:text-accent-text"
            aria-label={t('project.next')}
          >
            <Icon name="ChevronRight" size={24} strokeWidth={2} />
          </button>
        </div>
      )}

      <div className="text-center mt-12">
        <Link
          to={lp('/projects')}
          className="inline-flex items-center space-x-2 rtl:space-x-reverse text-accent-500 hover:text-accent-600 font-semibold transition-theme dark:text-accent-text"
        >
          <span>{t('project.viewAll')}</span>
          <Icon name="ArrowRight" size={18} strokeWidth={2} />
        </Link>
      </div>
    </div>
  );
};

export default FeaturedWork;
