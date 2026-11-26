import React, { useState, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Icon from "components/AppIcon";
import Image from "components/AppImage";
import { PageMeta } from "components/PageMeta";
import LoadError from "components/ui/LoadError";
import { useProjects } from "context/ProjectsContext";
import { SkeletonCard, SkeletonText } from "components/ui/Skeleton";
import { safeHref } from "lib/safeUrl";
import ProjectGallery, { normalizeGalleryImages } from "./ProjectGallery";
import MoreProjects from "./MoreProjects";
import { coverForProject } from "lib/projectMedia";
import { SITE_ORIGIN, absoluteHttpsUrl } from "lib/pageMeta";
import { useI18n } from "i18n/I18nContext";
import { localizePath } from "i18n/paths.mjs";
import { localizeProject } from "i18n/content.mjs";

// Shape a project record for the detail page, in the page language (Arabic
// fields on /ar where filled in, English otherwise).
const toCaseStudy = (raw, lang) => {
  const project = localizeProject(raw, lang);
  return {
    id: project.id,
    title: project.title || "",
    subtitle:
      project.tagline ||
      project.short_description ||
      project.description ||
      "",
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
    categoryKey: raw.category,
    status: project.status,
    heroImage: coverForProject(project),
    description: project.description,
    metaTitle: project.meta_title,
    metaDescription: project.meta_description,
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
              : "",
          image: typeof img === "object" ? img.url : img,
          type: "desktop",
        }))
      : [],
    testimonial:
      Array.isArray(project.testimonials) &&
      project.testimonials.length > 0
        ? {
            quote: project.testimonials[0].content || project.testimonials[0].quote,
            author: project.testimonials[0].name,
            role: project.testimonials[0].role || "",
            company: project.testimonials[0].company || "",
            avatar: project.testimonials[0].avatar || null,
          }
        : null,
  };
};

const CaseStudyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProjectById, projects } = useProjects();
  const { t, lp, lang } = useI18n();

  const [activeSection, setActiveSection] = useState("");
  // Start from the project the app already holds (list cache), so opening a
  // project shows it at once; the fresh copy below replaces it quietly.
  const knownProject = useMemo(
    () => (projects || []).find((project) => project?.id === id) || null,
    [projects, id]
  );
  const [caseStudy, setCaseStudy] = useState(() => (knownProject ? toCaseStudy(knownProject, lang) : null));
  const [isLoading, setIsLoading] = useState(() => !knownProject);
  const [loadError, setLoadError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const knownProjectRef = useRef(knownProject);
  knownProjectRef.current = knownProject;

  // Load the fresh project from Supabase. When a cached copy is already on
  // screen this happens quietly: no skeleton, and a failed refresh keeps it.
  // Layout effect so moving to another project never paints the previous one.
  useLayoutEffect(() => {
    let cancelled = false;

    const loadProject = async () => {
      if (!id) {
        navigate(lp("/projects"));
        return;
      }

      const cached = knownProjectRef.current;
      if (cached) {
        setCaseStudy(toCaseStudy(cached, lang));
        setLoadError(null);
        setIsLoading(false);
      } else {
        setIsLoading(true);
      }

      try {
        const result = await getProjectById(id);
        if (cancelled) return;

        if (result.success && result.data) {
          setCaseStudy(toCaseStudy(result.data, lang));
          setLoadError(null);
        } else if (result?.success) {
          setCaseStudy(null);
          setLoadError(null);
        } else if (!cached) {
          setCaseStudy(null);
          setLoadError(result?.error || t("caseStudy.loadError"));
        }
      } catch (error) {
        if (cancelled) return;
        if (!cached) {
          setCaseStudy(null);
          setLoadError(error?.message || t("caseStudy.loadError"));
        }
      }

      setIsLoading(false);
    };

    loadProject();
    return () => {
      cancelled = true;
    };
    // t/lp only feed error text and the redirect; a language switch should not refetch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, getProjectById, navigate, reloadKey]);

  // Dynamic navigation based on available content
  const getNavigationSections = () => {
    const sections = [];

    if (caseStudy?.screenshots?.length > 0) {
      sections.push({ id: "gallery", label: t("caseStudy.gallery"), icon: "Image" });
    }

    if (caseStudy?.content_sections && caseStudy.content_sections.length > 0) {
      caseStudy.content_sections.forEach((section, index) => {
        sections.push({
          id: `section-${section.id || index}`,
          label: section.title || t("caseStudy.section", { n: index + 1 }),
          icon: "FileText"
        });
      });
    }

    if (
      caseStudy?.enableCaseStudy &&
      (caseStudy.problem || caseStudy.solution || caseStudy.results)
    ) {
      sections.push({ id: "project-details", label: t("caseStudy.details"), icon: "FileText" });
    }

    if (caseStudy?.testimonial) {
      sections.push({
        id: "testimonial",
        label: t("caseStudy.testimonial"),
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

  const galleryImages = useMemo(
    () => normalizeGalleryImages(caseStudy?.screenshots, (n) => t("gallery.screenshot", { n })),
    [caseStudy, t]
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary-50 dark:bg-background">
        {/* Skeleton Hero */}
        <section className="relative bg-gradient-to-br from-banner-from to-banner-to pt-20 pb-16">
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
              <div className="sticky top-24 bg-white rounded-lg shadow-sm border border-primary-200 p-6 mb-8 lg:mb-0 dark:bg-surface dark:border-border">
                <SkeletonText width="w-24" height="h-5" />
                <div className="space-y-2 mt-4">
                  <SkeletonText width="w-full" height="h-10" />
                  <SkeletonText width="w-full" height="h-10" />
                  <SkeletonText width="w-full" height="h-10" />
                </div>
              </div>
            </div>
            <div className="lg:col-span-3 space-y-16">
              <div className="bg-white rounded-lg shadow-sm border border-primary-200 p-8 dark:bg-surface dark:border-border">
                <SkeletonText width="w-48" height="h-8" />
                <div className="space-y-4 mt-6">
                  <SkeletonText width="w-full" height="h-4" />
                  <SkeletonText width="w-5/6" height="h-4" />
                  <SkeletonText width="w-4/6" height="h-4" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-primary-200 p-8 dark:bg-surface dark:border-border">
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
            <Link to={lp("/projects")} className="text-accent font-semibold dark:text-accent-text">
              {t("caseStudy.back")}
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
            {t("caseStudy.notFoundTitle")}
          </h2>
          <p className="text-text-secondary dark:text-white/70 mb-6">
            {t("caseStudy.notFoundBody")}
          </p>
          <Link to={lp("/projects")} className="btn-primary">
            {t("caseStudy.back")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-background">
      <PageMeta
        page={caseStudy.metaTitle || caseStudy.title || t("project.untitled")}
        description={caseStudy.metaDescription || caseStudy.description}
        image={caseStudy.heroImage}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: caseStudy.title || t("project.untitled"),
          inLanguage: lang,
          ...(caseStudy.description ? { description: caseStudy.description } : {}),
          url: `${SITE_ORIGIN}${localizePath(`/projects/${caseStudy.id}`, lang)}`,
          image: absoluteHttpsUrl(caseStudy.heroImage),
          ...(caseStudy.tags.length ? { keywords: caseStudy.tags.join(", ") } : {}),
          author: { "@id": `${SITE_ORIGIN}/#person` },
        }}
      />
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-banner-from to-banner-to text-white pt-28 lg:pt-32 pb-16">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse mb-4">
                <Link
                  to={lp("/projects")}
                  className="text-accent-200 hover:text-accent-100 transition-colors duration-200 flex items-center space-x-1 rtl:space-x-reverse"
                >
                  <Icon name="ArrowLeft" size={16} strokeWidth={2} />
                  <span className="text-sm">{t("caseStudy.back")}</span>
                </Link>
              </div>

              <h1 dir="auto" className="text-4xl lg:text-5xl font-bold mb-4 leading-tight text-white text-start">
                {caseStudy.title || t("project.untitled")}
              </h1>
              <p dir="auto" className="text-xl text-accent-100 mb-6 text-start">
                {caseStudy.subtitle || t("caseStudy.overview")}
              </p>

              <div className="grid grid-cols-2 gap-6 mb-8">
                {caseStudy.category && (
                  <div>
                    <h3 className="text-sm font-semibold text-accent-200 uppercase tracking-wide mb-2">
                      {t("caseStudy.category")}
                    </h3>
                    <p dir="auto" className="text-lg text-white">{caseStudy.category}</p>
                  </div>
                )}
                {/in[-_ ]?progress/i.test(caseStudy.status || "") && (
                  <div>
                    <h3 className="text-sm font-semibold text-accent-200 uppercase tracking-wide mb-2">
                      {t("caseStudy.status")}
                    </h3>
                    <p className="text-lg text-white">{t("caseStudy.inProgress")}</p>
                  </div>
                )}
                {caseStudy.client && (
                  <div>
                    <h3 className="text-sm font-semibold text-accent-200 uppercase tracking-wide mb-2">
                      {t("caseStudy.client")}
                    </h3>
                    <p dir="auto" className="text-lg text-white text-start">{caseStudy.client}</p>
                  </div>
                )}
                {caseStudy.duration && (
                  <div>
                    <h3 className="text-sm font-semibold text-accent-200 uppercase tracking-wide mb-2">
                      {t("caseStudy.duration")}
                    </h3>
                    <p dir="auto" className="text-lg text-white">{caseStudy.duration}</p>
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
                      className="inline-flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <Icon name="Github" size={18} />
                      <span>{t("caseStudy.viewCode")}</span>
                    </a>
                  )}
                  {safeHref(caseStudy.demoUrl) && (
                    <a
                      href={safeHref(caseStudy.demoUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-accent hover:bg-accent-600 rounded-lg transition-colors"
                    >
                      <Icon name="ExternalLink" size={18} />
                      <span>{t("project.liveDemo")}</span>
                    </a>
                  )}
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {caseStudy.tags.map((tag, index) => (
                  <span
                    key={index}
                    dir="auto"
                    className="px-3 py-1 bg-white/15 text-white rounded-full text-sm font-medium"
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
                {t("caseStudy.navigation")}
              </h3>
              <nav className="space-y-2">
                {navigationSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full flex items-center space-x-3 rtl:space-x-reverse px-3 py-2 rounded-lg text-start transition-all duration-200 ${
                      activeSection === section.id
                        ? "bg-accent text-white"
                        : "text-text-secondary dark:text-white/70 hover:bg-surface dark:hover:bg-white/10 hover:text-text-primary dark:hover:text-white"
                    }`}
                  >
                    <Icon name={section.icon} size={16} strokeWidth={2} />
                    <span dir="auto" className="text-sm font-medium">{section.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {galleryImages.length > 0 && (
              <ProjectGallery images={galleryImages} projectTitle={caseStudy.title || t("project.untitled")} />
            )}

            {/* Dynamic Content Sections */}
            {caseStudy.content_sections && caseStudy.content_sections.length > 0 && (
              caseStudy.content_sections.map((section, index) => (
                <section key={section.id || index} id={`section-${section.id || index}`} className="scroll-mt-24">
                  <div className="bg-surface dark:bg-surface rounded-lg shadow-sm border border-border dark:border-border-strong p-6">
                    <h2 dir="auto" className="text-2xl font-bold text-text-primary dark:text-white mb-4">
                      {section.title || t("caseStudy.section", { n: index + 1 })}
                    </h2>
                    <div dir="auto" className="prose prose-lg max-w-none text-text-secondary dark:text-white/70 whitespace-pre-wrap">
                      {section.content}
                    </div>
                  </div>
                </section>
              ))
            )}

            {/* Problem, solution, and results — only when the write-up is enabled */}
            {caseStudy.enableCaseStudy &&
              (caseStudy.problem ||
                caseStudy.solution ||
                caseStudy.results) && (
                <section id="project-details" className="scroll-mt-24">
                  <div className="bg-surface dark:bg-surface rounded-lg shadow-sm border border-border dark:border-border-strong p-8">
                    <h2 className="text-3xl font-bold text-text-primary dark:text-white mb-8">
                      {t("caseStudy.details")}
                    </h2>

                    <div className="space-y-8">
                      {caseStudy.problem && (
                        <div className="border-s-4 border-error ps-6">
                          <h3 className="text-xl font-semibold text-text-primary dark:text-white mb-4 flex items-center">
                            <Icon
                              name="AlertCircle"
                              size={20}
                              className="me-2 text-error"
                              strokeWidth={2}
                            />
                            {t("caseStudy.problem")}
                          </h3>
                          <div dir="auto" className="prose prose-lg max-w-none text-text-secondary dark:text-white/70 whitespace-pre-wrap">
                            {caseStudy.problem}
                          </div>
                        </div>
                      )}

                      {caseStudy.solution && (
                        <div className="border-s-4 border-accent ps-6">
                          <h3 className="text-xl font-semibold text-text-primary dark:text-white mb-4 flex items-center">
                            <Icon
                              name="Lightbulb"
                              size={20}
                              className="me-2 text-accent dark:text-accent-text"
                              strokeWidth={2}
                            />
                            {t("caseStudy.solution")}
                          </h3>
                          <div dir="auto" className="prose prose-lg max-w-none text-text-secondary dark:text-white/70 whitespace-pre-wrap">
                            {caseStudy.solution}
                          </div>
                        </div>
                      )}

                      {caseStudy.results && (
                        <div className="border-s-4 border-success ps-6">
                          <h3 className="text-xl font-semibold text-text-primary dark:text-white mb-4 flex items-center">
                            <Icon
                              name="TrendingUp"
                              size={20}
                              className="me-2 text-success"
                              strokeWidth={2}
                            />
                            {t("caseStudy.results")}
                          </h3>
                          <div dir="auto" className="prose prose-lg max-w-none text-text-secondary dark:text-white/70 whitespace-pre-wrap">
                            {caseStudy.results}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              )}

            {/* Testimonial Section */}
            {caseStudy.testimonial && (
              <section id="testimonial" className="scroll-mt-24">
                <div className="bg-surface dark:bg-surface rounded-lg shadow-sm border border-border dark:border-border-strong p-8">
                  <h2 className="text-3xl font-bold text-text-primary dark:text-white mb-8 text-center">
                    {t("caseStudy.clientTestimonial")}
                  </h2>

                  <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                      <Icon
                        name="Quote"
                        size={48}
                        className="text-accent mx-auto mb-6 dark:text-accent-text"
                        strokeWidth={1}
                      />
                      <blockquote dir="auto" className="text-xl text-text-primary dark:text-white leading-relaxed mb-8 italic">
                        {t("caseStudy.quoteOpen")}{caseStudy.testimonial.quote}{t("caseStudy.quoteClose")}
                      </blockquote>
                    </div>

                    <div className="flex items-center justify-center space-x-4 rtl:space-x-reverse">
                      <Image
                        src={caseStudy.testimonial.avatar}
                        alt={caseStudy.testimonial.author}
                        width={64}
                        height={64}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div>
                        <h4 dir="auto" className="font-semibold text-text-primary dark:text-white">
                          {caseStudy.testimonial.author}
                        </h4>
                        <p dir="auto" className="text-text-secondary dark:text-white/70">
                          {caseStudy.testimonial.company
                            ? t("caseStudy.roleAt", { role: caseStudy.testimonial.role, company: caseStudy.testimonial.company })
                            : caseStudy.testimonial.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            <MoreProjects
              currentId={caseStudy.id}
              category={caseStudy.categoryKey}
              projects={projects}
            />
          </div>
        </div>
      </div>

    </div>
  );
};

export default CaseStudyDetail;
