import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import { useProjects } from 'context/ProjectsContext';
import { SkeletonProjectCard } from 'components/ui/Skeleton';
import { useDebounce } from 'hooks/useDebounce';

const fallbackImage = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop';

const categoryIconMap = {
  'Web Apps': 'Monitor',
  'E-commerce': 'ShoppingCart',
  'Mobile': 'Smartphone',
  'Open Source': 'Github'
};

const PortfolioGallery = () => {
  const { getPublishedProjects, loading: projectsLoading, useSupabase } = useProjects();
  const [activeFilter, setActiveFilter] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [selectedProject, setSelectedProject] = useState(null);
  const [portfolioProjects, setPortfolioProjects] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 20;

  const transformProjects = (projects) => {
    return projects.map((project) => {
      const technologies = Array.isArray(project.technologies) ? project.technologies : [];
      const tags = Array.isArray(project.tags) ? project.tags : [];
      const heroImages = Array.isArray(project.hero_images) ? project.hero_images : [];
      const metrics = Array.isArray(project.metrics) ? project.metrics : [];

      let metricsLabel = project.results || 'Proven Results';
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
        title: project.title || 'Untitled Project',
        category: project.category || 'General',
        technologies,
        description: project.description || 'No description available yet.',
        image: heroImages.length ? heroImages[0] : fallbackImage,
        metrics: metricsLabel,
        featured: Boolean(project.featured),
        liveUrl: project.demo_url || '#',
        githubUrl: project.repository_url || '#',
        tags
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

    if (result.success && Array.isArray(result.data) && result.data.length) {
      setPortfolioProjects(transformProjects(result.data));
      setHasMore(result.data.length >= PAGE_SIZE || (result.count && result.data.length < result.count));
    } else {
      setPortfolioProjects([]);
      setHasMore(false);
    }

    setIsFetching(false);
  };

  const loadMoreProjects = async () => {
    if (!useSupabase || isLoadingMore || !hasMore) return;

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

  useEffect(() => {
    loadInitialProjects();
  }, [useSupabase]);


  const displayProjects = portfolioProjects;

  const filterCategories = useMemo(() => {
    const counts = new Map();
    displayProjects.forEach((project) => {
      const category = project.category || 'General';
      counts.set(category, (counts.get(category) || 0) + 1);
    });

    return [
      { name: 'All', icon: 'Grid3X3', count: displayProjects.length },
      ...Array.from(counts.entries()).map(([name, count]) => ({
        name,
        icon: categoryIconMap[name] || 'Folder',
        count
      }))
    ];
  }, [displayProjects]);

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

  const isLoading = useSupabase && (projectsLoading || isFetching);

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
        project.technologies.some(tech => tech.toLowerCase().includes(debouncedSearch.toLowerCase()))
      );
    }

    return filtered;
  }, [activeFilter, debouncedSearch, displayProjects]);

  const ProjectCard = ({ project, index }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={`group relative bg-white rounded-xl shadow-sm border border-primary-200 overflow-hidden hover:shadow-lg transition-all duration-300 ${
        project.featured ? 'md:col-span-2 md:row-span-2' : ''
      } ${viewMode === 'list' ? 'flex flex-row' : 'flex flex-col'}`}
    >
      {/* Project Image */}
      <div className={`relative overflow-hidden ${
        viewMode === 'list' ? 'w-1/3 flex-shrink-0' : 'aspect-video'
      }`}>
        <Image
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex space-x-3">
            <button
              onClick={() => setSelectedProject(project)}
              className="bg-white/90 hover:bg-white text-primary-800 p-3 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
              aria-label={`Preview ${project.title}`}
              title={`Preview ${project.title}`}
            >
              <Icon name="Eye" size={20} strokeWidth={2} />
            </button>
            <a
              href={project.liveUrl}
              className="bg-accent/90 hover:bg-accent text-white p-3 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
              aria-label={`View live demo of ${project.title}`}
              title={`View live demo of ${project.title}`}
            >
              <Icon name="ExternalLink" size={20} strokeWidth={2} />
            </a>
            <a
              href={project.githubUrl}
              className="bg-primary-800/90 hover:bg-primary-800 text-white p-3 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
              aria-label={`View source code of ${project.title} on GitHub`}
              title={`View source code of ${project.title} on GitHub`}
            >
              <Icon name="Github" size={20} strokeWidth={2} />
            </a>
          </div>
        </div>

        {/* Featured Badge */}
        {project.featured && (
          <div className="absolute top-4 left-4 bg-cta text-white px-3 py-1 rounded-full text-sm font-semibold">
            Featured
          </div>
        )}
      </div>

      {/* Project Content */}
      <div className={`p-6 flex-1 ${viewMode === 'list' ? 'flex flex-col justify-between' : ''}`}>
        <div>
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-bold text-primary-800 group-hover:text-accent transition-colors duration-200">
              {project.title}
            </h3>
            <span className="text-sm font-medium text-cta bg-cta-50 px-2 py-1 rounded-full">
              {project.category}
            </span>
          </div>

          <p className="text-secondary-600 mb-4 line-clamp-3">
            {project.description}
          </p>

          {/* Metrics */}
          <div className="flex items-center space-x-2 mb-4">
            <Icon name="TrendingUp" size={16} color="var(--color-success)" strokeWidth={2} />
            <span className="text-sm font-semibold text-success">{project.metrics}</span>
          </div>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies.map((tech, techIndex) => (
              <span
                key={techIndex}
                className="text-xs font-medium text-accent bg-accent-50 px-2 py-1 rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <Link
          to={`/case-study-detail/${project.id}`}
          className="inline-flex items-center space-x-2 text-accent hover:text-accent-700 font-semibold transition-colors duration-200"
        >
          <span>View Case Study</span>
          <Icon name="ArrowRight" size={16} strokeWidth={2} />
        </Link>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 pt-20">
      <Helmet>
        <title>Portfolio Gallery — Projects & Case Studies</title>
        <meta name="description" content="Browse my portfolio of web development projects, including web apps, mobile apps, and open source work." />
        <meta property="og:title" content="Portfolio Gallery — Projects & Case Studies" />
        <meta property="og:description" content="Browse my portfolio of web development projects." />
      </Helmet>
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-primary-800 mb-6">
              Portfolio <span className="text-gradient">Gallery</span>
            </h1>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto mb-8">
              Explore my collection of digital experiences, from web applications to mobile solutions. 
              Each project represents a unique challenge solved with creativity and technical expertise.
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-secondary-500">
              <div className="flex items-center space-x-2">
                <Icon name="Code2" size={16} strokeWidth={2} />
                <span>{displayProjects.length} Projects</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Star" size={16} strokeWidth={2} />
                <span>{displayProjects.filter(p => p.featured).length} Featured</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="TrendingUp" size={16} strokeWidth={2} />
                <span>Proven Results</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters and Controls */}
      <section className="px-4 mb-12">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-primary-200 p-6">
            {/* Search Bar */}
            <div className="relative mb-6">
              <Icon 
                name="Search" 
                size={20} 
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary-400" 
                strokeWidth={2}
              />
              <input
                type="text"
                placeholder="Search projects by name, technology, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-3 mb-6">
              {filterCategories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => setActiveFilter(category.name)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    activeFilter === category.name
                      ? 'bg-accent text-white shadow-md'
                      : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
                  }`}
                >
                  <Icon name={category.icon} size={16} strokeWidth={2} />
                  <span>{category.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    activeFilter === category.name
                      ? 'bg-white/20 text-white' :'bg-primary-200 text-primary-600'
                  }`}>
                    {category.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Tech Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="text-sm font-medium text-secondary-600 mr-2">Technologies:</span>
              {techFilters.map((tech) => (
                <button
                  key={tech}
                  onClick={() => setSearchQuery(tech)}
                  className="text-xs font-medium text-accent bg-accent-50 hover:bg-accent-100 px-3 py-1 rounded-full transition-colors duration-200"
                >
                  {tech}
                </button>
              ))}
            </div>

            {/* View Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-secondary-600">
                  {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} found
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-secondary-600">View:</span>
                <div className="flex bg-primary-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-all duration-200 ${
                      viewMode === 'grid' ?'bg-white text-accent shadow-sm' :'text-secondary-500 hover:text-secondary-700'
                    }`}
                    aria-label="Grid view"
                    title="Grid view"
                  >
                    <Icon name="Grid3X3" size={16} strokeWidth={2} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-all duration-200 ${
                      viewMode === 'list' ?'bg-white text-accent shadow-sm' :'text-secondary-500 hover:text-secondary-700'
                    }`}
                    aria-label="List view"
                    title="List view"
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
          <AnimatePresence mode="wait">
            {isLoading ? (
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
              <motion.div
                key={`${activeFilter}-${viewMode}-${searchQuery}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={
                  viewMode === 'grid' ?'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-max' :'space-y-6'
                }
              >
                {filteredProjects.map((project, index) => (
                  <ProjectCard key={project.id} project={project} index={index} />
                ))}
              </motion.div>

              {/* Load More Button */}
              {hasMore && !isFetching && (
                <div className="text-center mt-12">
                  <button
                    onClick={loadMoreProjects}
                    disabled={isLoadingMore}
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    {isLoadingMore ? (
                      <>
                        <Icon name="Loader" size={18} className="animate-spin" />
                        <span>Loading...</span>
                      </>
                    ) : (
                      <>
                        <Icon name="Plus" size={18} />
                        <span>Load More Projects</span>
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
                <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Icon name="Search" size={32} color="var(--color-primary-500)" strokeWidth={2} />
                </div>
                <h3 className="text-2xl font-bold text-primary-800 mb-4">No Projects Found</h3>
                <p className="text-secondary-600 mb-6 max-w-md mx-auto">
                  Try adjusting your search criteria or browse all projects to discover amazing work.
                </p>
                <button
                  onClick={() => {
                    setActiveFilter('All');
                    setSearchQuery('');
                  }}
                  className="btn-primary"
                >
                  View All Projects
                </button>
              </motion.div>
            )}
          </AnimatePresence>
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
              className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <Image
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-64 object-cover"
                />
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 bg-white/90 hover:bg-white text-primary-800 p-2 rounded-full shadow-lg transition-all duration-200"
                  aria-label="Close preview"
                  title="Close preview"
                >
                  <Icon name="X" size={20} strokeWidth={2} />
                </button>
              </div>
              
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-primary-800 mb-2">
                      {selectedProject.title}
                    </h2>
                    <span className="text-cta bg-cta-50 px-3 py-1 rounded-full text-sm font-semibold">
                      {selectedProject.category}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="TrendingUp" size={20} color="var(--color-success)" strokeWidth={2} />
                    <span className="text-lg font-semibold text-success">{selectedProject.metrics}</span>
                  </div>
                </div>

                <p className="text-secondary-600 text-lg mb-6">
                  {selectedProject.description}
                </p>

                <div className="flex flex-wrap gap-3 mb-8">
                  {selectedProject.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="text-sm font-medium text-accent bg-accent-50 px-3 py-2 rounded-lg"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex space-x-4">
                  <Link
                    to="/case-study-detail"
                    className="btn-primary flex items-center space-x-2"
                    onClick={() => setSelectedProject(null)}
                  >
                    <Icon name="FileText" size={18} strokeWidth={2} />
                    <span>View Case Study</span>
                  </Link>
                  <a
                    href={selectedProject.liveUrl}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <Icon name="ExternalLink" size={18} strokeWidth={2} />
                    <span>Live Demo</span>
                  </a>
                  <a
                    href={selectedProject.githubUrl}
                    className="flex items-center space-x-2 px-6 py-3 border border-primary-300 text-primary-700 hover:bg-primary-50 rounded-lg transition-colors duration-200"
                  >
                    <Icon name="Github" size={18} strokeWidth={2} />
                    <span>Source Code</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA Section */}
      <section className="bg-primary-800 text-white py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Your Next Project?
            </h2>
            <p className="text-xl text-primary-200 mb-8 max-w-2xl mx-auto">
              Let's collaborate to bring your vision to life with the same attention to detail and results-driven approach you see in my portfolio.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact-hub"
                className="bg-cta hover:bg-cta-600 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg flex items-center justify-center space-x-2"
              >
                <Icon name="MessageCircle" size={20} strokeWidth={2} />
                <span>Start a Conversation</span>
              </Link>
              <Link
                to="/about-story"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-800 font-semibold py-4 px-8 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <Icon name="User" size={20} strokeWidth={2} />
                <span>Learn More About Me</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default PortfolioGallery;