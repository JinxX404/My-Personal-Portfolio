import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

const FeaturedWork = () => {
  const [activeProject, setActiveProject] = useState(0);

  const featuredProjects = [
    {
      id: 1,
      title: "E-Commerce Platform Redesign",
      category: "Full-Stack Development",
      description: "Complete redesign and development of a modern e-commerce platform with improved user experience and 40% increase in conversion rates.",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      techStack: ["React", "Node.js", "PostgreSQL", "Stripe", "AWS"],
      metrics: {
        performance: "+40% conversion rate",
        users: "10K+ active users",
        timeline: "3 months"
      },
      liveUrl: "#",
      caseStudyUrl: "/case-study-detail"
    },
    {
      id: 2,
      title: "Healthcare Dashboard",
      category: "UI/UX & Frontend",
      description: "Intuitive dashboard for healthcare professionals to manage patient data, appointments, and medical records with enhanced accessibility.",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      techStack: ["React", "TypeScript", "D3.js", "Tailwind CSS", "Firebase"],
      metrics: {
        performance: "50% faster workflows",
        users: "500+ medical professionals",
        timeline: "4 months"
      },
      liveUrl: "#",
      caseStudyUrl: "/case-study-detail"
    },
    {
      id: 3,
      title: "Real Estate Platform",
      category: "Full-Stack Development",
      description: "Modern real estate platform with advanced search, virtual tours, and integrated CRM system for agents and buyers.",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      techStack: ["Next.js", "MongoDB", "Socket.io", "Mapbox", "Cloudinary"],
      metrics: {
        performance: "2M+ property views",
        users: "5K+ registered users",
        timeline: "5 months"
      },
      liveUrl: "#",
      caseStudyUrl: "/case-study-detail"
    },
    {
      id: 4,
      title: "Financial Analytics Tool",
      category: "Data Visualization",
      description: "Comprehensive financial analytics dashboard with real-time data visualization and predictive modeling capabilities.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      techStack: ["React", "Python", "D3.js", "TensorFlow", "Docker"],
      metrics: {
        performance: "Real-time processing",
        users: "1K+ financial analysts",
        timeline: "6 months"
      },
      liveUrl: "#",
      caseStudyUrl: "/case-study-detail"
    }
  ];
  const nextProject = () => {
    setActiveProject((prev) => (prev + 1) % featuredProjects.length);
  };

  const prevProject = () => {
    setActiveProject((prev) => (prev - 1 + featuredProjects.length) % featuredProjects.length);
  };

  const currentProject = featuredProjects[activeProject];

  return (
    <div className="relative transition-theme">
      <div className="bg-surface dark:bg-background/80 rounded-2xl shadow-xl overflow-hidden border border-border dark:border-border-strong/50 transition-theme">
        <div className="grid lg:grid-cols-2 gap-0">
          {/* Project Image */}
          <div className="relative h-64 lg:h-96 overflow-hidden">
            <Image
              src={currentProject.image}
              alt={currentProject.title}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-overlay/60 to-transparent"></div>
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-accent-500/90 text-white text-sm font-medium rounded-full">
                {currentProject.category}
              </span>
            </div>
            <div className="absolute bottom-4 right-4 flex space-x-2">
              <a
                href={currentProject.liveUrl}
                className="w-10 h-10 bg-surface dark:bg-background/80 rounded-full flex items-center justify-center text-text-primary hover:text-accent-500 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
                title="View Live"
              >
                <Icon name="ExternalLink" size={18} strokeWidth={2} />
              </a>
              <Link
                to={currentProject.caseStudyUrl}
                className="w-10 h-10 bg-surface dark:bg-background/80 rounded-full flex items-center justify-center text-text-primary hover:text-accent-500 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
                title="Case Study"
              >
                <Icon name="FileText" size={18} strokeWidth={2} />
              </Link>
            </div>
          </div>

          {/* Project Details */}
          <div className="p-8 lg:p-12 flex flex-col justify-center transition-theme">
            <h3 className="text-3xl font-bold text-text-primary dark:text-primary-100 mb-4">
              {currentProject.title}
            </h3>
            <p className="text-lg text-text-secondary mb-6 leading-relaxed">
              {currentProject.description}
            </p>

            {/* Tech Stack */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-3">
                Tech Stack
              </h4>
              <div className="flex flex-wrap gap-2">
                {currentProject.techStack.map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary-100 dark:bg-primary-200/20 text-primary-700 dark:text-primary-200 text-sm font-medium rounded-lg transition-theme"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="text-center sm:text-left">
                <div className="text-lg font-bold text-success-500">
                  {currentProject.metrics.performance}
                </div>
                <div className="text-sm text-text-secondary">Performance</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-lg font-bold text-accent-500">
                  {currentProject.metrics.users}
                </div>
                <div className="text-sm text-text-secondary">Users</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-lg font-bold text-cta">
                  {currentProject.metrics.timeline}
                </div>
                <div className="text-sm text-text-secondary">Timeline</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to={currentProject.caseStudyUrl}
                className="btn-primary flex items-center justify-center space-x-2 px-6 py-3"
              >
                <Icon name="FileText" size={18} strokeWidth={2} />
                <span>View Case Study</span>
              </Link>
              <a
                href={currentProject.liveUrl}
                className="btn-secondary flex items-center justify-center space-x-2 px-6 py-3"
              >
                <Icon name="ExternalLink" size={18} strokeWidth={2} />
                <span>Live Demo</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between mt-8 transition-theme">
        <button
          onClick={prevProject}
          className="w-12 h-12 bg-surface dark:bg-background/80 rounded-full shadow-lg flex items-center justify-center text-text-primary hover:text-accent-500 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
        >
          <Icon name="ChevronLeft" size={24} strokeWidth={2} />
        </button>

        {/* Project Indicators */}
        <div className="flex space-x-2">
          {featuredProjects.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveProject(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === activeProject
                  ? 'bg-accent-500 scale-125' :'bg-primary-200 dark:bg-primary-700 hover:bg-primary-300 dark:hover:bg-primary-600'
              }`}
            />
          ))}
        </div>

        <button
          onClick={nextProject}
          className="w-12 h-12 bg-surface dark:bg-background/80 rounded-full shadow-lg flex items-center justify-center text-text-primary hover:text-accent-500 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
        >
          <Icon name="ChevronRight" size={24} strokeWidth={2} />
        </button>
      </div>

      {/* View All Projects Link */}
      <div className="text-center mt-12">
        <Link
          to="/portfolio-gallery"
          className="inline-flex items-center space-x-2 text-accent-500 hover:text-accent-600 font-semibold transition-theme"
        >
          <span>View All Projects</span>
          <Icon name="ArrowRight" size={18} strokeWidth={2} />
        </Link>
      </div>
    </div>
  );
};
export default FeaturedWork;