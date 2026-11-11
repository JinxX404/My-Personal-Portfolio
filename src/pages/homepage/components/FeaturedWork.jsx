import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import LoadError from 'components/ui/LoadError';
import { useProjects } from 'context/ProjectsContext';
import { safeHref } from 'lib/safeUrl';

const PLACEHOLDER = '/assets/images/no_image.png';

const isPublicProject = (project) =>
  project &&
  project.visibility !== 'private' &&
  (project.publishing_status === 'published' || project.publishing_status === 'in_progress');

const toCard = (project) => {
  const technologies = Array.isArray(project.technologies) ? project.technologies : [];
  const heroImages = Array.isArray(project.hero_images) ? project.hero_images : [];

  return {
    id: project.id,
    title: project.title || 'Untitled project',
    category: project.category || 'Project',
    description: project.description || '',
    image: heroImages[0] || PLACEHOLDER,
    technologies,
    liveUrl: safeHref(project.demo_url),
    githubUrl: safeHref(project.repository_url),
  };
};

const FeaturedWork = () => {
  const { projects, loading, error, loadProjects, getFeaturedProjects } = useProjects();
  const [cards, setCards] = useState([]);
  const [usingFallback, setUsingFallback] = useState(false);
  const [activeProject, setActiveProject] = useState(0);
  const [loadError, setLoadError] = useState(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setFetching(true);
      const result = await getFeaturedProjects();
      if (cancelled) return;

      if (!result?.success) {
        const latest = (projects || []).filter(isPublicProject).slice(0, 4).map(toCard);
        if (latest.length > 0) {
          setCards(latest);
          setUsingFallback(true);
          setLoadError(null);
        } else {
          setCards([]);
          setLoadError(result?.error || error || 'Featured projects could not be loaded.');
        }
        setFetching(false);
        return;
      }

      const featured = (result.data || []).filter(isPublicProject).map(toCard);
      if (featured.length > 0) {
        setCards(featured);
        setUsingFallback(false);
        setLoadError(null);
      } else {
        const latest = (projects || [])
          .filter(isPublicProject)
          .slice(0, 4)
          .map(toCard);
        setCards(latest);
        setUsingFallback(latest.length > 0);
        setLoadError(null);
      }
      setActiveProject(0);
      setFetching(false);
    };

    load();
    return () => {
      cancelled = true;
    };
    // getFeaturedProjects is recreated each render; run when the project list settles.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, projects]);

  const retry = () => {
    setLoadError(null);
    loadProjects();
  };

  if (loading || fetching) {
    return <p className="text-center text-text-secondary">Loading projects…</p>;
  }

  if (loadError) {
    return <LoadError message={loadError} onRetry={retry} />;
  }

  if (cards.length === 0) {
    return (
      <div className="text-center text-text-secondary">
        <p>Published projects will show up here.</p>
        <Link to="/portfolio-gallery" className="inline-flex items-center space-x-2 mt-4 text-accent-500 font-semibold">
          <span>Browse the portfolio</span>
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
          No projects are marked featured yet. Showing the latest published work.
        </p>
      )}
      <div className="bg-surface dark:bg-background/80 rounded-2xl shadow-xl overflow-hidden border border-border dark:border-border-strong/50 transition-theme">
        <div className="grid lg:grid-cols-2 gap-0">
          <div className="relative aspect-[16/10] min-h-56 overflow-hidden lg:aspect-auto lg:min-h-[20rem]">
            <Image
              src={current.image}
              alt={current.title}
              width={1200}
              height={800}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-overlay/60 to-transparent"></div>
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-accent-500/90 text-white text-sm font-medium rounded-full">
                {current.category}
              </span>
            </div>
            <div className="absolute bottom-4 right-4 flex space-x-2">
              {current.liveUrl && (
                <a
                  href={current.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-surface dark:bg-background/80 rounded-full flex items-center justify-center text-text-primary hover:text-accent-500 hover:shadow-xl transition-all duration-200"
                  aria-label={`Open live demo of ${current.title}`}
                >
                  <Icon name="ExternalLink" size={18} strokeWidth={2} />
                </a>
              )}
              <Link
                to={`/projects/${current.id}`}
                className="w-10 h-10 bg-surface dark:bg-background/80 rounded-full flex items-center justify-center text-text-primary hover:text-accent-500 hover:shadow-xl transition-all duration-200"
                aria-label={`Open project details for ${current.title}`}
              >
                <Icon name="FileText" size={18} strokeWidth={2} />
              </Link>
            </div>
          </div>

          <div className="p-8 lg:p-12 flex flex-col justify-center transition-theme">
            <h3 className="text-3xl font-bold text-text-primary dark:text-primary-100 mb-4">
              {current.title}
            </h3>
            <p className="text-lg text-text-secondary mb-6 leading-relaxed">
              {current.description}
            </p>

            {current.technologies.length > 0 && (
              <div className="mb-8">
                <h4 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-3">
                  Tech stack
                </h4>
                <div className="flex flex-wrap gap-2">
                  {current.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-primary-100 dark:bg-primary-200/20 text-primary-700 dark:text-primary-200 text-sm font-medium rounded-lg"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to={`/projects/${current.id}`}
                className="btn-primary flex items-center justify-center space-x-2 px-6 py-3"
              >
                <Icon name="FileText" size={18} strokeWidth={2} />
                <span>View Project</span>
              </Link>
              {current.liveUrl && (
                <a
                  href={current.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary flex items-center justify-center space-x-2 px-6 py-3"
                >
                  <Icon name="ExternalLink" size={18} strokeWidth={2} />
                  <span>Live demo</span>
                </a>
              )}
              {current.githubUrl && (
                <a
                  href={current.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary flex items-center justify-center space-x-2 px-6 py-3"
                >
                  <Icon name="Github" size={18} strokeWidth={2} />
                  <span>Source</span>
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
            className="w-12 h-12 bg-surface dark:bg-background/80 rounded-full shadow-lg flex items-center justify-center text-text-primary hover:text-accent-500"
            aria-label="Previous project"
          >
            <Icon name="ChevronLeft" size={24} strokeWidth={2} />
          </button>

          <div className="flex space-x-2">
            {cards.map((project, index) => (
              <button
                key={project.id}
                type="button"
                onClick={() => setActiveProject(index)}
                aria-label={`Show ${project.title}`}
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
            className="w-12 h-12 bg-surface dark:bg-background/80 rounded-full shadow-lg flex items-center justify-center text-text-primary hover:text-accent-500"
            aria-label="Next project"
          >
            <Icon name="ChevronRight" size={24} strokeWidth={2} />
          </button>
        </div>
      )}

      <div className="text-center mt-12">
        <Link
          to="/portfolio-gallery"
          className="inline-flex items-center space-x-2 text-accent-500 hover:text-accent-600 font-semibold transition-theme"
        >
          <span>View all projects</span>
          <Icon name="ArrowRight" size={18} strokeWidth={2} />
        </Link>
      </div>
    </div>
  );
};

export default FeaturedWork;
