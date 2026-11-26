import React, { useState, useMemo, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import LoadError from 'components/ui/LoadError';
import { useProjects } from 'context/ProjectsContext';
import { localizeProject } from '../../i18n/content.mjs';
import { SkeletonProjectCard } from 'components/ui/Skeleton';
import { useDebounce } from 'hooks/useDebounce';
import { safeHref } from 'lib/safeUrl';
import TiltCard from 'components/TiltCard';
import { coverForProject } from 'lib/projectMedia';
import { useI18n } from 'i18n/I18nContext';

const categoryIconMap = {
  'Web Apps': 'Monitor',
  'E-commerce': 'ShoppingCart',
  'Mobile': 'Smartphone',
  'Open Source': 'Github'
};

const PortfolioGallery = () => {
  const { projects: knownProjects, loading: projectsLoading, useSupabase } = useProjects();
  const [activeFilter, setActiveFilter] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [selectedProject, setSelectedProject] = useState(null);
  const [portfolioProjects, setPortfolioProjects] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 20;
  const { t, lp, formatNumber, lang } = useI18n();

  const transformProjects = (projects) => {
    return projects.map((raw) => {
      // Arabic fields on /ar where filled in, English otherwise. Filters group
      // by the English category so a half-translated list does not split.
      const project = localizeProject(raw, lang);
      const technologies = Array.isArray(project.technologies) ? project.technologies : [];
      const tags = Array.isArray(project.tags) ? project.tags : [];
      const metrics = Array.isArray(project.metrics) ? project.metrics : [];

      let metricsLabel = project.results || t('projects.provenResults');
      if (metrics.length) {
        const metric = metrics[0];
        if (typeof metric === 'string') {
          metricsLabel = metric;
        } else if (metric && (metric.label || metric.value)) {
          metricsLabel = [metric.label, metric.value].filter(Boolean).join(': ');
        }
      }

      return {
        id: project.id,
        title: project.title || t('project.untitled'),
        category: raw.category || t('projects.general'),
        categoryLabel: project.category || t('projects.general'),
        technologies,
        description: project.description || t('projects.noDescription'),
        image: coverForProject(project),
        metrics: metricsLabel,
        featured: Boolean(project.featured),
        liveUrl: safeHref(project.demo_url),
        githubUrl: safeHref(project.repository_url),
        tags,
        // Search matches both languages.
        searchText: [raw.title, raw.title_ar, raw.description, raw.description_ar]
          .filter((value) => typeof value === 'string')
          .join(' ')
          .toLowerCase(),
        publishingStatus: project.publishing_status || 'draft'
      };
    });
  };

  const loadInitialProjects = async () => {
    if (!useSupabase) {
      setPortfolioProjects([]);
      return;
    }

    setIsFetching(true);
    const { fetchPublishedProjects } = await import('../../services/projectsService.js');
    const result = await fetchPublishedProjects({ limit: PAGE_SIZE, offset: 0 });

    if (!result.success) {
      setPortfolioProjects([]);
      setHasMore(false);
      setLoadError(result.error || t('projects.loadError'));
    } else if (Array.isArray(result.data) && result.data.length) {
      setPortfolioProjects(transformProjects(result.data));
      setHasMore(result.data.length >= PAGE_SIZE || (result.count && result.data.length < result.count));
      setLoadError(null);
    } else {
      setPortfolioProjects([]);
      setHasMore(false);
      setLoadError(null);
    }

    setIsFetching(false);
  };

  // Public projects the app already holds (cached, refreshed in the background).
  // Same rule and order as fetchPublishedProjects.
  const listedProjects = useMemo(
    () => (knownProjects || []).filter(
      (project) =>
        project?.visibility === 'public' &&
        (project.publishing_status === 'published' || project.publishing_status === 'in_progress')
    ),
    [knownProjects]
  );

  const loadMoreProjects = async () => {
    if (!useSupabase || isLoadingMore || !hasMore) return;

    // Serve the next page from memory when we have it.
    if (listedProjects.length > portfolioProjects.length) {
      const next = listedProjects.slice(0, portfolioProjects.length + PAGE_SIZE);
      setPortfolioProjects(transformProjects(next));
      setHasMore(listedProjects.length > next.length);
      return;
    }

    setIsLoadingMore(true);
    const { fetchPublishedProjects } = await import('../../services/projectsService.js');
    const offset = portfolioProjects.length;
    const result = await fetchPublishedProjects({ limit: PAGE_SIZE, offset });

    if (result.success && Array.isArray(result.data) && result.data.length) {
      setPortfolioProjects(prev => [...prev, ...transformProjects(result.data)]);
      setHasMore(result.data.length >= PAGE_SIZE);
    } else {
      setHasMore(false);
    }

    setIsLoadingMore(false);
  };

  // Show what the app already has right away; only go to the network when the
  // shared list is empty (first visit straight to this page, or it failed).
  // Layout effect: the list is in place before the first paint, no empty frame.
  useLayoutEffect(() => {
    if (listedProjects.length > 0) {
      const count = Math.min(listedProjects.length, Math.max(portfolioProjects.length, PAGE_SIZE));
      setPortfolioProjects(transformProjects(listedProjects.slice(0, count)));
      setHasMore(listedProjects.length > count);
      setLoadError(null);
      return;
    }
    if (!projectsLoading) loadInitialProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listedProjects, projectsLoading, useSupabase, t, lang]);


  const displayProjects = portfolioProjects;

  const filterCategories = useMemo(() => {
    const counts = new Map();
    const labels = new Map();
    displayProjects.forEach((project) => {
      const category = project.category || t('projects.general');
      counts.set(category, (counts.get(category) || 0) + 1);
      if (!labels.has(category) || labels.get(category) === category) labels.set(category, project.categoryLabel || category);
    });

    return [
      { name: 'All', label: t('projects.all'), icon: 'Grid3X3', count: displayProjects.length },
      ...Array.from(counts.entries()).map(([name, count]) => ({
        name,
        label: labels.get(name) || name,
        icon: categoryIconMap[name] || 'Folder',
        count
      }))
    ];
  }, [displayProjects, t]);

  const techFilters = useMemo(() => {
    const techs = new Set();
    displayProjects.forEach((project) => {
      (project.technologies || []).forEach((tech) => {
        if (tech) {
          techs.add(tech);
        }
      });
    });

    const techArray = Array.from(techs);
    return techArray.slice(0, 12);
  }, [displayProjects]);

  // Skeletons only when there is nothing at all to show yet.
  const isLoading = useSupabase && portfolioProjects.length === 0 && (projectsLoading || isFetching || listedProjects.length > 0);

  // Filter and search logic
  const filteredProjects = useMemo(() => {
    let filtered = displayProjects;

    // Category filter
    if (activeFilter !== 'All') {
      filtered = filtered.filter(project => project.category === activeFilter);
    }

    // Search filter
    if (debouncedSearch) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        project.description.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        project.searchText.includes(debouncedSearch.toLowerCase()) ||
        project.technologies.some(tech => tech.toLowerCase().includes(debouncedSearch.toLowerCase()))
      );
    }

    return filtered;
  }, [activeFilter, debouncedSearch, displayProjects]);

  const ProjectCard = ({ project, index }) => {
    const card = (
    <div
      className={`group relative flex h-full w-full bg-surface dark:bg-surface rounded-xl shadow-sm border border-border dark:border-border-strong overflow-hidden hover:shadow-lg transition-all duration-300 ${
        viewMode === 'list' ? 'flex-row' : 'flex-col'
      }`}
    >
      {/* Project Image */}
      <div className={`relative shrink-0 overflow-hidden bg-primary-900 ${
        viewMode === 'list' ? 'w-36 sm:w-56 self-stretch min-h-36' : 'aspect-[16/10]'
      }`}>
        <Image
          src={project.image}
          alt={project.title}
          width={1600}
          height={1000}
          className="absolute inset-0 h-full w-full object-contain"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex space-x-3 rtl:space-x-reverse">
            <button
              type="button"
              onClick={() => setSelectedProject(project)}
              className="bg-surface/90 dark:bg-surface hover:bg-surface dark:hover:bg-surface/80 text-text-primary p-3 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
              aria-label={t('projects.preview', { title: project.title })}
              title={t('projects.preview', { title: project.title })}
            >
              <Icon name="Eye" size={20} strokeWidth={2} />
            </button>
            {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-accent/90 hover:bg-accent text-white p-3 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
              aria-label={t('project.openDemoOf', { title: project.title })}
              title={t('project.openDemoOf', { title: project.title })}
            >
              <Icon name="ExternalLink" size={20} strokeWidth={2} />
            </a>
            )}
            {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary-600/90 hover:bg-primary-600 text-white p-3 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
              aria-label={t('projects.sourceOf', { title: project.title })}
              title={t('projects.sourceOf', { title: project.title })}
            >
              <Icon name="Github" size={20} strokeWidth={2} />
            </a>
            )}
          </div>
        </div>

        {/* Featured Badge */}
        {project.featured && (
          <div className="absolute top-4 start-4 bg-cta text-white px-3 py-1 rounded-full text-sm font-semibold">
            {t('projects.featured')}
          </div>
        )}
        
        {/* In Progress Badge */}
        {project.publishingStatus === 'in_progress' && (
          <div className="absolute top-4 end-4 bg-warning-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {t('projects.inProgress')}
          </div>
        )}
      </div>

      {/* Project Content */}
      <div className="flex flex-1 flex-col p-6">
        <div>
          <div className="flex items-start justify-between mb-3">
            <h3 dir="auto" className="text-xl font-bold text-text-primary group-hover:text-accent dark:group-hover:text-accent-text transition-colors duration-200">
              {project.title}
            </h3>
            <span dir="auto" className="shrink-0 text-sm font-medium text-accent-700 bg-cta-50 dark:bg-accent-subtle dark:text-accent-text px-2 py-1 rounded-full">
              {project.categoryLabel}
            </span>
          </div>

          <p dir="auto" className="text-text-secondary mb-4 line-clamp-3">
            {project.description}
          </p>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies.map((tech, techIndex) => (
              <span
                key={techIndex}
                dir="auto"
                className="text-xs font-medium text-accent-700 bg-accent-50 dark:bg-accent-900/30 px-2 py-1 rounded-full dark:text-accent-text"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <Link
          to={lp(`/projects/${project.id}`)}
          className="mt-auto inline-flex items-center space-x-2 rtl:space-x-reverse text-accent hover:text-accent-700 font-semibold transition-colors duration-200 dark:text-accent-text dark:hover:text-accent-text"
        >
          <span>{t('project.view')}</span>
          <Icon name="ArrowRight" size={16} strokeWidth={2} />
        </Link>
      </div>
    </div>
    );

    if (viewMode === 'list') return card;
    return <TiltCard className="h-full">{card}</TiltCard>;
  };

  return (
    <div className="min-h-screen bg-background dark:bg-background pt-20">
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold text-text-primary mb-6">
              {t('projects.titleBefore')}<span className="text-gradient">{t('projects.titleHighlight')}</span>{t('projects.titleAfter')}
            </h1>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto mb-8">
              {t('projects.subtitle')}
            </p>
            <div className="flex items-center justify-center space-x-6 rtl:space-x-reverse text-sm text-muted">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Icon name="Code2" size={16} strokeWidth={2} />
                <span>{t('projects.count', { count: displayProjects.length, n: formatNumber(displayProjects.length) })}</span>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Icon name="Star" size={16} strokeWidth={2} />
                <span>{t('projects.featuredCount', { count: displayProjects.filter(p => p.featured).length, n: formatNumber(displayProjects.filter(p => p.featured).length) })}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Controls */}
      <section className="px-4 mb-12">
        <div className="max-w-7xl mx-auto">
          <div className="bg-surface dark:bg-surface rounded-xl shadow-sm border border-primary-200 dark:border-border-strong p-6">
            {/* Search Bar */}
            <div className="relative mb-6">
              <Icon 
                name="Search" 
                size={20} 
                className="absolute start-4 top-1/2 transform -translate-y-1/2 text-muted" 
                strokeWidth={2}
              />
              <input
                type="text"
                placeholder={t('projects.searchPlaceholder')}
                aria-label={t('projects.searchLabel')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full ps-12 pe-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 bg-surface dark:bg-surface text-text-primary"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-3 mb-6">
              {filterCategories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => setActiveFilter(category.name)}
                  className={`flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    activeFilter === category.name
                      ? 'bg-accent text-white shadow-md'
                      : 'bg-primary-50 dark:bg-primary-900/30 text-text-secondary dark:text-text-secondary hover:bg-primary-100 dark:hover:bg-primary-800/30'
                  }`}
                >
                  <Icon name={category.icon} size={16} strokeWidth={2} />
                  <span dir="auto">{category.label}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    activeFilter === category.name
                      ? 'bg-black/20 text-white' : 'bg-primary-100 dark:bg-primary-800/30 text-text-secondary dark:text-muted'
                  }`}>
                    {category.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Tech Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="text-sm font-medium text-muted me-2">{t('projects.technologies')}</span>
              {techFilters.map((tech) => (
                <button
                  key={tech}
                  dir="auto"
                  onClick={() => setSearchQuery(tech)}
                  className="text-xs font-medium text-accent-700 bg-accent-50 dark:bg-accent-900/30 hover:bg-accent-100 dark:hover:bg-accent-800/30 px-3 py-1 rounded-full transition-colors duration-200 dark:text-accent-text"
                >
                  {tech}
                </button>
              ))}
            </div>

            {/* View Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <span className="text-sm font-medium text-muted">
                  {t('projects.found', { count: filteredProjects.length, n: formatNumber(filteredProjects.length) })}
                </span>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <span className="text-sm font-medium text-muted">{t('projects.view')}</span>
                <div className="flex bg-primary-50 dark:bg-primary-900/30 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-all duration-200 ${
                      viewMode === 'grid' ? 'bg-surface dark:bg-surface text-accent shadow-sm' : 'text-text-secondary dark:text-text-secondary hover:text-text-primary dark:hover:text-text-primary'
                    }`}
                    aria-label={t('projects.gridView')}
                    title={t('projects.gridView')}
                  >
                    <Icon name="Grid3X3" size={16} strokeWidth={2} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-all duration-200 ${
                      viewMode === 'list' ? 'bg-surface dark:bg-surface text-accent shadow-sm' : 'text-text-secondary dark:text-text-secondary hover:text-text-primary dark:hover:text-text-primary'
                    }`}
                    aria-label={t('projects.listView')}
                    title={t('projects.listView')}
                  >
                    <Icon name="List" size={16} strokeWidth={2} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="px-4 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* No AnimatePresence here: waiting for the skeleton to fade out before
              mounting the grid added a blank gap on every visit. */}
          <>
            {loadError ? (
              <LoadError message={loadError} onRetry={loadInitialProjects} />
            ) : isLoading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonProjectCard key={i} />
                ))}
              </motion.div>
            ) : filteredProjects.length > 0 ? (
              <>
              <div
                className={
                  viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-6'
                }
              >
                {filteredProjects.map((project, index) => (
                  <ProjectCard key={project.id} project={project} index={index} />
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && !isFetching && (
                <div className="text-center mt-12">
                  <button
                    type="button"
                    onClick={loadMoreProjects}
                    disabled={isLoadingMore}
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    {isLoadingMore ? (
                      <>
                        <Icon name="Loader" size={18} className="animate-spin" />
                        <span>{t('common.loadingDots')}</span>
                      </>
                    ) : (
                      <>
                        <Icon name="Plus" size={18} />
                        <span>{t('projects.loadMore')}</span>
                      </>
                    )}
                  </button>
                </div>
              )}
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <div className="w-24 h-24 bg-primary-50 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Icon name="Search" size={32} color="var(--color-muted)" strokeWidth={2} />
                </div>
                <h3 className="text-2xl font-bold text-text-primary mb-4">{t('projects.noneTitle')}</h3>
                <p className="text-text-secondary mb-6 max-w-md mx-auto">
                  {t('projects.noneBody')}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveFilter('All');
                    setSearchQuery('');
                  }}
                  className="btn-primary"
                >
                  {t('projects.viewAllButton')}
                </button>
              </motion.div>
            )}
          </>
        </div>
      </section>

      {/* Project Preview Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-surface dark:bg-surface rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-border dark:border-border-strong"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[16/10] bg-primary-900">
                <Image
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  width={1600}
                  height={1000}
                  className="h-full w-full object-contain"
                />
                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 end-4 bg-white/90 hover:bg-white text-primary-800 p-2 rounded-full shadow-lg transition-all duration-200 dark:bg-surface-elevated dark:hover:bg-surface dark:text-text-primary"
                  aria-label={t('projects.closePreview')}
                  title={t('projects.closePreview')}
                >
                  <Icon name="X" size={20} strokeWidth={2} />
                </button>
              </div>
              
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 dir="auto" className="text-3xl font-bold text-primary-800 mb-2 dark:text-text-primary">
                      {selectedProject.title}
                    </h2>
                    <span dir="auto" className="text-accent-700 bg-cta-50 px-3 py-1 rounded-full text-sm font-semibold dark:bg-accent-subtle dark:text-accent-text">
                      {selectedProject.categoryLabel}
                    </span>
                  </div>
                </div>

                <p dir="auto" className="text-secondary-600 text-lg mb-6 dark:text-text-secondary">
                  {selectedProject.description}
                </p>

                <div className="flex flex-wrap gap-3 mb-8">
                  {selectedProject.technologies.map((tech, index) => (
                    <span
                      key={index}
                      dir="auto"
                      className="text-sm font-medium text-accent-700 bg-accent-50 px-3 py-2 rounded-lg dark:text-accent-text dark:bg-accent-subtle"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex space-x-4 rtl:space-x-reverse">
                  <Link
                    to={lp(`/projects/${selectedProject.id}`)}
                    className="btn-primary flex items-center space-x-2 rtl:space-x-reverse"
                    onClick={() => setSelectedProject(null)}
                  >
                    <Icon name="FolderOpen" size={18} strokeWidth={2} />
                    <span>{t('project.view')}</span>
                  </Link>
                  {selectedProject.liveUrl && (
                  <a
                    href={selectedProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary flex items-center space-x-2 rtl:space-x-reverse"
                  >
                    <Icon name="ExternalLink" size={18} strokeWidth={2} />
                    <span>{t('project.liveDemo')}</span>
                  </a>
                  )}
                  {selectedProject.githubUrl && (
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 rtl:space-x-reverse px-6 py-3 border border-primary-300 text-primary-700 hover:bg-primary-50 rounded-lg transition-colors duration-200 dark:text-text-primary dark:hover:bg-surface-elevated"
                  >
                    <Icon name="Github" size={18} strokeWidth={2} />
                    <span>{t('projects.sourceCode')}</span>
                  </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA Section */}
      <section className="bg-surface dark:bg-surface border-t border-border dark:border-border-strong py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-text-primary">
              {t('projects.cta.title')}
            </h2>
            <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
              {t('projects.cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to={lp('/contact-hub')}
                className="bg-accent hover:bg-accent-600 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg flex items-center justify-center space-x-2 rtl:space-x-reverse"
              >
                <Icon name="MessageCircle" size={20} strokeWidth={2} />
                <span>{t('common.startConversation')}</span>
              </Link>
              <Link
                to={lp('/about-story')}
                className="bg-transparent border-2 border-border dark:border-border-strong text-text-primary dark:text-text-primary hover:bg-primary-50 dark:hover:bg-primary-900/30 font-semibold py-4 px-8 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 rtl:space-x-reverse dark:hover:bg-surface-elevated"
              >
                <Icon name="User" size={20} strokeWidth={2} />
                <span>{t('projects.cta.about')}</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default PortfolioGallery;