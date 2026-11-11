import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Icon from "components/AppIcon";
import Image from "components/AppImage";
import { PageMeta } from "components/PageMeta";
import LoadError from "components/ui/LoadError";
import { useProjects } from "context/ProjectsContext";
import { SkeletonCard, SkeletonText } from "components/ui/Skeleton";
import { safeHref } from "lib/safeUrl";

const CaseStudyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProjectById } = useProjects();

  const [activeSection, setActiveSection] = useState("overview");
  const [selectedImage, setSelectedImage] = useState(null);
  const [caseStudy, setCaseStudy] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  // Load project data from Supabase
  useEffect(() => {
    const loadProject = async () => {

      if (!id) {
        navigate("/portfolio-gallery");
        return;
      }

      setIsLoading(true);
      try {
        const result = await getProjectById(id);

        if (result.success && result.data) {
          const project = result.data;

          // Transform project data to case study format
          const transformedData = {
            id: project.id,
            title: project.title || "Untitled Project",
            subtitle:
              project.tagline ||
              project.short_description ||
              project.description ||
              "Project Overview",
            client: project.client,
            duration: project.duration,
            role: project.role,
            team: Array.isArray(project.team_members)
              ? project.team_members
              : null,
            tags: Array.isArray(project.technologies)
              ? project.technologies
              : [],
            category: project.category,
            status: project.status,
            heroImage:
              (Array.isArray(project.hero_images) && project.hero_images[0]) ||
              project.featured_image ||
              "/assets/images/no_image.png",
            description: project.description,
            repositoryUrl: project.repository_url,
            demoUrl: project.demo_url,
            enableCaseStudy: project.enable_case_study || false,
            problem: project.problem,
            solution: project.solution,
            results: project.results,
            content_sections: project.content_sections || [],
            hero_images: project.hero_images || [],
            screenshots: project.screenshots || [],
            mockups: project.mockups || [],
            gallery: Array.isArray(project.screenshots)
              ? project.screenshots.map((img, idx) => ({
                  id: idx + 1,
                  title:
                    typeof img === "object"
                      ? img.caption
                      : `Screenshot ${idx + 1}`,
                  image: typeof img === "object" ? img.url : img,
                  type: "desktop",
                }))
              : [],
            testimonial:
              Array.isArray(project.testimonials) &&
              project.testimonials.length > 0
                ? {
                    quote: project.testimonials[0].content,
                    author: project.testimonials[0].name,
                    position:
                      project.testimonials[0].role +
                      (project.testimonials[0].company
                        ? ` at ${project.testimonials[0].company}`
                        : ""),
                    avatar: project.testimonials[0].avatar || null,
                  }
                : null,
            nextProjects: [], // Can be populated later with related projects
          };

          setCaseStudy(transformedData);
          setLoadError(null);
        } else if (result?.success) {
          setCaseStudy(null);
          setLoadError(null);
        } else {
          setCaseStudy(null);
          setLoadError(result?.error || "This project could not be loaded.");
        }
      } catch (error) {
        setCaseStudy(null);
        setLoadError(error?.message || "This project could not be loaded.");
      }

      setIsLoading(false);
    };

    loadProject();
  }, [id, getProjectById, navigate, reloadKey]);

  // Dynamic navigation based on available content
  const getNavigationSections = () => {
    const sections = [];

    if (caseStudy?.content_sections && caseStudy.content_sections.length > 0) {
      caseStudy.content_sections.forEach((section, index) => {
        sections.push({
          id: `section-${section.id || index}`,
          label: section.title || `Section ${index + 1}`,
          icon: "FileText"
        });
      });
    }

    if (caseStudy?.enableCaseStudy) {
      if (caseStudy.problem || caseStudy.solution) {
        sections.push({ id: "case-study", label: "Details", icon: "FileText" });
      }
    }

    if (caseStudy?.screenshots?.length > 0) {
      sections.push({ id: "gallery", label: "Gallery", icon: "Image" });
    }

    if (caseStudy?.testimonial) {
      sections.push({
        id: "testimonial",
        label: "Testimonial",
        icon: "MessageSquare",
      });
    }

    return sections;
  };

  const navigationSections = getNavigationSections();

  useEffect(() => {
    const handleScroll = () => {
      const sections = navigationSections.map((section) => section.id);
      const scrollPosition = window.scrollY + 150;

      let currentSection = sections[0];
      for (let i = 0; i < sections.length; i++) {
        const element = document.getElementById(sections[i]);
        if (element) {
          const offsetTop = element.offsetTop - 150;
          if (scrollPosition >= offsetTop) {
            currentSection = sections[i];
          }
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [navigationSections]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const openImageModal = (image) => {
    setSelectedImage(image);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary-50">
        {/* Skeleton Hero */}
        <section className="relative bg-primary-800 pt-20 pb-16">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <SkeletonText width="w-40" height="h-4" />
                <SkeletonText width="w-3/4" height="h-10" />
                <SkeletonText width="w-1/2" height="h-6" />
                <div className="grid grid-cols-2 gap-6">
                  <SkeletonText width="w-full" height="h-16" />
                  <SkeletonText width="w-full" height="h-16" />
                </div>
                <div className="flex gap-2">
                  <SkeletonText width="w-20" height="h-8" />
                  <SkeletonText width="w-20" height="h-8" />
                  <SkeletonText width="w-20" height="h-8" />
                </div>
              </div>
              <div className="relative">
                <SkeletonCard />
              </div>
            </div>
          </div>
        </section>

        {/* Skeleton Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="lg:grid lg:grid-cols-4 lg:gap-8">
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white rounded-lg shadow-sm border border-primary-200 p-6 mb-8 lg:mb-0">
                <SkeletonText width="w-24" height="h-5" />
                <div className="space-y-2 mt-4">
                  <SkeletonText width="w-full" height="h-10" />
                  <SkeletonText width="w-full" height="h-10" />
                  <SkeletonText width="w-full" height="h-10" />
                </div>
              </div>
            </div>
            <div className="lg:col-span-3 space-y-16">
              <div className="bg-white rounded-lg shadow-sm border border-primary-200 p-8">
                <SkeletonText width="w-48" height="h-8" />
                <div className="space-y-4 mt-6">
                  <SkeletonText width="w-full" height="h-4" />
                  <SkeletonText width="w-5/6" height="h-4" />
                  <SkeletonText width="w-4/6" height="h-4" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-primary-200 p-8">
                <SkeletonText width="w-36" height="h-8" />
                <div className="space-y-4 mt-6">
                  <SkeletonText width="w-full" height="h-4" />
                  <SkeletonText width="w-5/6" height="h-4" />
                  <SkeletonText width="w-4/6" height="h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 pt-20">
        <div className="max-w-lg w-full">
          <LoadError message={loadError} onRetry={() => setReloadKey((value) => value + 1)} />
          <div className="text-center mt-6">
            <Link to="/portfolio-gallery" className="text-accent font-semibold">
              Back to portfolio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // No project found
  if (!caseStudy) {
    return (
      <div className="min-h-screen bg-background dark:bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon
            name="AlertCircle"
            size={48}
            className="mx-auto text-error mb-4"
          />
          <h2 className="text-2xl font-bold text-text-primary dark:text-white mb-2">
            Project Not Found
          </h2>
          <p className="text-text-secondary dark:text-white/70 mb-6">
            The project you're looking for doesn't exist.
          </p>
          <Link to="/portfolio-gallery" className="btn-primary">
            Back to Portfolio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-background">
      <PageMeta
        page={caseStudy.title}
        description={caseStudy.description}
        image={caseStudy.heroImage}
      />
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-800 text-white pt-20 pb-16 dark:from-primary-900 from-primary-900 to-accent-900 ">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Link
                  to="/portfolio-gallery"
                  className="text-accent-200 hover:text-accent-100 transition-colors duration-200 flex items-center space-x-1"
                >
                  <Icon name="ArrowLeft" size={16} strokeWidth={2} />
                  <span className="text-sm">Back to Portfolio</span>
                </Link>
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight text-white">
                {caseStudy.title}
              </h1>
              <p className="text-xl text-accent-100 mb-6">
                {caseStudy.subtitle}
              </p>

              <div className="grid grid-cols-2 gap-6 mb-8">
                {caseStudy.category && (
                  <div>
                    <h3 className="text-sm font-semibold text-accent-200 uppercase tracking-wide mb-2">
                      Category
                    </h3>
                    <p className="text-lg">{caseStudy.category}</p>
                  </div>
                )}
                {caseStudy.status && (
                  <div>
                    <h3 className="text-sm font-semibold text-accent-200 uppercase tracking-wide mb-2">
                      Status
                    </h3>
                    <p className="text-lg capitalize">
                      {caseStudy.status.replace("-", " ")}
                    </p>
                  </div>
                )}
                {caseStudy.client && (
                  <div>
                    <h3 className="text-sm font-semibold text-accent-200 uppercase tracking-wide mb-2">
                      Client
                    </h3>
                    <p className="text-lg">{caseStudy.client}</p>
                  </div>
                )}
                {caseStudy.duration && (
                  <div>
                    <h3 className="text-sm font-semibold text-accent-200 uppercase tracking-wide mb-2">
                      Duration
                    </h3>
                    <p className="text-lg">{caseStudy.duration}</p>
                  </div>
                )}
              </div>

              {/* Links */}
              {(safeHref(caseStudy.repositoryUrl) || safeHref(caseStudy.demoUrl)) && (
                <div className="flex flex-wrap gap-4 mb-8">
                  {safeHref(caseStudy.repositoryUrl) && (
                    <a
                      href={safeHref(caseStudy.repositoryUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <Icon name="Github" size={18} />
                      <span>View Code</span>
                    </a>
                  )}
                  {safeHref(caseStudy.demoUrl) && (
                    <a
                      href={safeHref(caseStudy.demoUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-accent hover:bg-accent-600 rounded-lg transition-colors"
                    >
                      <Icon name="ExternalLink" size={18} />
                      <span>Live Demo</span>
                    </a>
                  )}
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {caseStudy.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-accent/20 text-accent-100 rounded-full text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative overflow-hidden rounded-lg shadow-2xl">
                <Image
                  src={caseStudy.heroImage}
                  alt={caseStudy.title}
                  width={1200}
                  height={640}
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Sticky Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-surface dark:bg-surface rounded-lg shadow-sm border border-border dark:border-border-strong p-6 mb-8 lg:mb-0">
              <h3 className="font-semibold text-text-primary dark:text-white mb-4">
                Navigation
              </h3>
              <nav className="space-y-2">
                {navigationSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                      activeSection === section.id
                        ? "bg-accent text-white"
                        : "text-text-secondary dark:text-white/70 hover:bg-surface dark:hover:bg-white/10 hover:text-text-primary dark:hover:text-white"
                    }`}
                  >
                    <Icon name={section.icon} size={16} strokeWidth={2} />
                    <span className="text-sm font-medium">{section.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Dynamic Content Sections */}
            {caseStudy.content_sections && caseStudy.content_sections.length > 0 && (
              caseStudy.content_sections.map((section, index) => (
                <section key={section.id || index} id={`section-${section.id || index}`} className="scroll-mt-24">
                  <div className="bg-surface dark:bg-surface rounded-lg shadow-sm border border-border dark:border-border-strong p-6">
                    <h2 className="text-2xl font-bold text-text-primary dark:text-white mb-4">
                      {section.title || `Section ${index + 1}`}
                    </h2>
                    <div className="prose prose-lg max-w-none text-text-secondary dark:text-white/70 whitespace-pre-wrap">
                      {section.content}
                    </div>
                  </div>
                </section>
              ))
            )}

            {/* Case Study Section - Only if enabled */}
            {caseStudy.enableCaseStudy &&
              (caseStudy.problem ||
                caseStudy.solution ||
                caseStudy.results) && (
                <section id="case-study" className="scroll-mt-24">
                  <div className="bg-surface dark:bg-surface rounded-lg shadow-sm border border-border dark:border-border-strong p-8">
                    <h2 className="text-3xl font-bold text-text-primary dark:text-white mb-8">
                      Project Details
                    </h2>

                    <div className="space-y-8">
                      {caseStudy.problem && (
                        <div className="border-l-4 border-error pl-6">
                          <h3 className="text-xl font-semibold text-text-primary dark:text-white mb-4 flex items-center">
                            <Icon
                              name="AlertCircle"
                              size={20}
                              className="mr-2 text-error"
                              strokeWidth={2}
                            />
                            The Problem
                          </h3>
                          <div className="prose prose-lg max-w-none text-text-secondary dark:text-white/70 whitespace-pre-wrap">
                            {caseStudy.problem}
                          </div>
                        </div>
                      )}

                      {caseStudy.solution && (
                        <div className="border-l-4 border-accent pl-6">
                          <h3 className="text-xl font-semibold text-text-primary dark:text-white mb-4 flex items-center">
                            <Icon
                              name="Lightbulb"
                              size={20}
                              className="mr-2 text-accent"
                              strokeWidth={2}
                            />
                            The Solution
                          </h3>
                          <div className="prose prose-lg max-w-none text-text-secondary dark:text-white/70 whitespace-pre-wrap">
                            {caseStudy.solution}
                          </div>
                        </div>
                      )}

                      {caseStudy.results && (
                        <div className="border-l-4 border-success pl-6">
                          <h3 className="text-xl font-semibold text-text-primary dark:text-white mb-4 flex items-center">
                            <Icon
                              name="TrendingUp"
                              size={20}
                              className="mr-2 text-success"
                              strokeWidth={2}
                            />
                            Results & Impact
                          </h3>
                          <div className="prose prose-lg max-w-none text-text-secondary dark:text-white/70 whitespace-pre-wrap">
                            {caseStudy.results}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              )}

            {/* Visual Gallery Section - Shows only screenshots */}
            {caseStudy.screenshots?.length > 0 && (
              <section id="gallery" className="scroll-mt-24">
                <div className="bg-surface dark:bg-surface rounded-lg shadow-sm border border-border dark:border-border-strong p-8">
                  <h2 className="text-3xl font-bold text-text-primary dark:text-white mb-8">
                    Visual Gallery
                  </h2>

                  <div className="grid md:grid-cols-2 gap-6">
                    {caseStudy.screenshots.map((item, index) => {
                      const imageUrl = typeof item === 'string' ? item : item.image;
                      const imageTitle = typeof item === 'string' ? `Screenshot ${index + 1}` : (item.title || `Screenshot ${index + 1}`);
                      return (
                        <div 
                          key={`screenshot-${index}`} 
                          className="group cursor-pointer"
                          onClick={() => openImageModal({ image: imageUrl, title: imageTitle })}
                        >
                          <div className="relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                            <Image src={imageUrl} alt={imageTitle} width={1280} height={720} className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                              <Icon name="ZoomIn" size={32} color="white" className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" strokeWidth={2} />
                            </div>
                            {imageTitle && (
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                <h4 className="text-white font-semibold">{imageTitle}</h4>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            )}

            {/* Testimonial Section */}
            {caseStudy.testimonial && (
              <section id="testimonial" className="scroll-mt-24">
                <div className="bg-surface dark:bg-surface rounded-lg shadow-sm border border-border dark:border-border-strong p-8">
                  <h2 className="text-3xl font-bold text-text-primary dark:text-white mb-8 text-center">
                    Client Testimonial
                  </h2>

                  <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                      <Icon
                        name="Quote"
                        size={48}
                        className="text-accent mx-auto mb-6"
                        strokeWidth={1}
                      />
                      <blockquote className="text-xl text-text-primary dark:text-white leading-relaxed mb-8 italic">
                        "{caseStudy.testimonial.quote}"
                      </blockquote>
                    </div>

                    <div className="flex items-center justify-center space-x-4">
                      <Image
                        src={caseStudy.testimonial.avatar}
                        alt={caseStudy.testimonial.author}
                        width={64}
                        height={64}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-semibold text-text-primary dark:text-white">
                          {caseStudy.testimonial.author}
                        </h4>
                        <p className="text-text-secondary dark:text-white/70">
                          {caseStudy.testimonial.position}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Next Projects */}
            <section className="bg-surface dark:bg-surface rounded-lg shadow-sm border border-border dark:border-border-strong p-8">
              <h2 className="text-3xl font-bold text-text-primary dark:text-white mb-8 text-center">
                Explore More Projects
              </h2>

              <div className="grid md:grid-cols-2 gap-8">
                {caseStudy.nextProjects.map((project) => (
                  <Link
                    key={project.id}
                    to={`/case-study-detail/${project.id}`}
                    className="group block bg-primary-50 dark:bg-primary-900/30 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
                  >
                    <div className="relative overflow-hidden">
                      <Image
                        src={project.image}
                        alt={project.title}
                        width={800}
                        height={480}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-text-primary dark:text-white mb-2 group-hover:text-accent transition-colors duration-200">
                        {project.title}
                      </h3>
                      <p className="text-text-secondary dark:text-white/70 mb-4">
                        {project.subtitle}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-accent/10 text-accent dark:text-accent-400 text-xs font-medium rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="text-center mt-8">
                <Link
                  to="/portfolio-gallery"
                  className="btn-primary inline-flex items-center space-x-2"
                >
                  <span>View All Projects</span>
                  <Icon name="ArrowRight" size={16} strokeWidth={2} />
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-5xl max-h-full">
            <button
              onClick={closeImageModal}
              className="absolute -top-12 right-0 text-white hover:text-accent-200 transition-colors duration-200"
            >
              <Icon name="X" size={32} strokeWidth={2} />
            </button>
            <Image
              src={selectedImage.image}
              alt={selectedImage.title}
              width={1600}
              height={1000}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
              <h3 className="text-white text-xl font-semibold">
                {selectedImage.title}
              </h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseStudyDetail;
