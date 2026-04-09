import React, { useState, useEffect, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Icon from "components/AppIcon";
import Image from "components/AppImage";
import { useProjects } from "context/ProjectsContext";
import { SkeletonCard, SkeletonText } from "components/ui/Skeleton";

const CaseStudyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProjectById } = useProjects();

  const [activeSection, setActiveSection] = useState("overview");
  const [isCodeExpanded, setIsCodeExpanded] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [caseStudy, setCaseStudy] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load project data from Supabase
  useEffect(() => {
    const loadProject = async () => {
      console.log("\ud83d\udcdd Loading case study for project ID:", id);

      if (!id) {
        console.error("\u274c No project ID provided");
        navigate("/portfolio-gallery");
        return;
      }

      setIsLoading(true);
      try {
        const result = await getProjectById(id);
        console.log("\ud83d\udcca Project data result:", result);

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
              "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=2340&h=600&fit=crop",
            description: project.description,
            repositoryUrl: project.repository_url,
            demoUrl: project.demo_url,
            enableCaseStudy: project.enable_case_study || false,
            problem: project.problem,
            solution: project.solution,
            results: project.results,
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

          console.log("\u2705 Case study loaded successfully");
          setCaseStudy(transformedData);
        } else {
          console.error("\u274c Failed to load project:", result.error);
          // Fallback to empty/default state
          navigate("/portfolio-gallery");
        }
      } catch (error) {
        console.error("\ud83d\udca5 Error loading project:", error);
        navigate("/portfolio-gallery");
      }

      setIsLoading(false);
    };

    loadProject();
  }, [id, getProjectById, navigate]);

  // Fallback mock data structure (kept for reference)
  const mockCaseStudy = {
    id: 1,
    title: "E-Commerce Platform Redesign",
    subtitle: "Transforming User Experience for Better Conversions",
    client: "TechMart Solutions",
    duration: "4 months",
    role: "Lead Frontend Developer & UX Designer",
    team: [
      "Frontend Developer",
      "Backend Developer",
      "UI/UX Designer",
      "Product Manager",
    ],
    tags: ["React", "Node.js", "MongoDB", "Stripe API", "AWS"],
    heroImage:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
    overview: {
      challenge: `TechMart Solutions approached us with a critical business challenge: their existing e-commerce platform was experiencing a 68% cart abandonment rate and declining user engagement. The outdated interface, slow loading times, and complex checkout process were driving potential customers away, resulting in significant revenue loss.

The platform served over 50,000 monthly active users but was built on legacy technology that couldn't scale with modern user expectations. Mobile users, representing 65% of traffic, were particularly affected by poor responsive design and slow performance.`,
      solution: `We implemented a comprehensive redesign strategy focusing on three core areas: user experience optimization, performance enhancement, and conversion funnel improvement. The solution involved migrating to a modern React-based architecture with server-side rendering for optimal performance.

Key improvements included a streamlined checkout process, intelligent product recommendations, real-time inventory updates, and a mobile-first responsive design. We also integrated advanced analytics to track user behavior and continuously optimize the experience.`,
      results: [
        {
          metric: "Cart Abandonment Rate",
          before: "68%",
          after: "32%",
          improvement: "-53%",
        },
        {
          metric: "Page Load Time",
          before: "4.2s",
          after: "1.8s",
          improvement: "-57%",
        },
        {
          metric: "Mobile Conversion Rate",
          before: "1.2%",
          after: "3.8%",
          improvement: "+217%",
        },
        {
          metric: "User Session Duration",
          before: "2.1 min",
          after: "4.7 min",
          improvement: "+124%",
        },
        {
          metric: "Revenue Growth",
          before: "Baseline",
          after: "+45%",
          improvement: "+45%",
        },
      ],
    },
    process: {
      research: `Our research phase involved comprehensive user interviews with 25 existing customers, competitive analysis of 12 similar platforms, and detailed analytics review of user behavior patterns. We discovered that users were frustrated with the complex navigation, unclear product information, and lengthy checkout process.

Heat mapping revealed that users were dropping off at specific points in the checkout flow, while user testing sessions highlighted confusion around product filtering and search functionality. This data formed the foundation of our redesign strategy.`,
      strategy: `Based on research insights, we developed a three-phase strategy:

Phase 1: Information Architecture Redesign - Simplified navigation, improved product categorization, and enhanced search functionality.

Phase 2: User Interface Modernization - Clean, modern design with improved visual hierarchy and mobile-first approach.

Phase 3: Performance Optimization - Code splitting, image optimization, and caching strategies to improve load times.`,
      design: `The design process followed a user-centered approach with iterative prototyping and testing. We created a comprehensive design system with reusable components, ensuring consistency across all touchpoints.

Key design decisions included implementing a card-based layout for better content organization, using progressive disclosure to reduce cognitive load, and creating a streamlined checkout flow with clear progress indicators.`,
      implementation: `Development followed agile methodology with two-week sprints. We used React 18 with TypeScript for type safety, implemented Redux Toolkit for state management, and used React Query for efficient data fetching.

The backend API was redesigned to support the new frontend requirements, with optimized database queries and caching strategies. We also implemented comprehensive testing with Jest and React Testing Library.`,
    },
    gallery: [
      {
        id: 1,
        title: "Homepage Before",
        image:
          "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
        type: "before",
      },
      {
        id: 2,
        title: "Homepage After",
        image:
          "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
        type: "after",
      },
      {
        id: 3,
        title: "Mobile Product Page",
        image:
          "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
        type: "mobile",
      },
      {
        id: 4,
        title: "Checkout Flow",
        image:
          "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
        type: "desktop",
      },
    ],
    codeSnippets: [
      {
        id: 1,
        title: "Product Card Component",
        language: "jsx",
        code: `const ProductCard = ({ product, onAddToCart }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      await onAddToCart(product.id);
      toast.success('Added to cart successfully!');
    } catch (error) {
      toast.error('Failed to add to cart');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="relative overflow-hidden rounded-t-lg">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover transform hover:scale-105 transition-transform duration-300"
        />
        {product.discount && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
            -{product.discount}%
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-900">
              $\{product.price}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                $\{product.originalPrice}
              </span>
            )}
          </div>
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm text-gray-600">{product.rating}</span>
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isLoading || !product.inStock}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <ShoppingCart className="w-4 h-4 mr-2" />
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </>
          )}
        </button>
      </div>
    </div>
  );
};`,
      },
      {
        id: 2,
        title: "Checkout Optimization Hook",
        language: "jsx",
        code: `const useCheckoutOptimization = () => {
  const [checkoutData, setCheckoutData] = useState({
    step: 1,
    shippingInfo: {},
    paymentInfo: {},
    orderSummary: {}
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  const validateStep = useCallback((step, data) => {
    const errors = {};

    switch (step) {
      case 1: // Shipping Information
        if (!data.firstName?.trim()) errors.firstName = 'First name is required';
        if (!data.lastName?.trim()) errors.lastName = 'Last name is required';
        if (!data.email?.trim()) errors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
          errors.email = 'Please enter a valid email address';
        }
        if (!data.address?.trim()) errors.address = 'Address is required';
        if (!data.city?.trim()) errors.city = 'City is required';
        if (!data.zipCode?.trim()) errors.zipCode = 'ZIP code is required';
        break;

      case 2: // Payment Information
        if (!data.cardNumber?.replace(/\s/g, '')) {
          errors.cardNumber = 'Card number is required';
        } else if (!/^\d{16}$/.test(data.cardNumber.replace(/\s/g, ''))) {
          errors.cardNumber = 'Please enter a valid 16-digit card number';
        }
        if (!data.expiryDate?.trim()) errors.expiryDate = 'Expiry date is required';
        if (!data.cvv?.trim()) errors.cvv = 'CVV is required';
        break;
    }

    return errors;
  }, []);

  const proceedToNextStep = useCallback(async (stepData) => {
    const errors = validateStep(checkoutData.step, stepData);

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return false;
    }

    setValidationErrors({});
    setCheckoutData(prev => ({
      ...prev,
      step: prev.step + 1,
      [prev.step === 1 ? 'shippingInfo' : 'paymentInfo']: stepData
    }));

    return true;
  }, [checkoutData.step, validateStep]);

  const processOrder = useCallback(async () => {
    setIsProcessing(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Process payment and create order
      const orderResult = await createOrder({
        ...checkoutData.shippingInfo,
        ...checkoutData.paymentInfo,
        items: checkoutData.orderSummary.items
      });

      return orderResult;
    } catch (error) {
      throw new Error('Payment processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [checkoutData]);

  return {
    checkoutData,
    validationErrors,
    isProcessing,
    proceedToNextStep,
    processOrder,
    setCheckoutData
  };
};`,
      },
    ],
    testimonial: {
      quote: `The transformation of our e-commerce platform exceeded all expectations. The new design not only looks modern and professional but has significantly improved our business metrics. Our customers frequently comment on how much easier it is to find and purchase products. The team's attention to detail and technical expertise was evident throughout the project.`,
      author: "Sarah Johnson",
      position: "CEO, TechMart Solutions",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
    },
    nextProjects: [
      {
        id: 2,
        title: "Healthcare Dashboard",
        subtitle: "Patient Management System",
        image:
          "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
        tags: ["React", "D3.js", "Node.js"],
      },
      {
        id: 3,
        title: "Financial Analytics Platform",
        subtitle: "Real-time Trading Dashboard",
        image:
          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
        tags: ["Vue.js", "Python", "WebSocket"],
      },
    ],
  };

  // Dynamic navigation based on available content
  const getNavigationSections = () => {
    const sections = [{ id: "overview", label: "Overview", icon: "Eye" }];

    if (caseStudy?.enableCaseStudy) {
      if (caseStudy.problem || caseStudy.solution) {
        sections.push({ id: "case-study", label: "Details", icon: "FileText" });
      }
    }

    if (caseStudy?.gallery?.length > 0) {
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
      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i]);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const toggleCodeExpansion = (codeId) => {
    setIsCodeExpanded((prev) => ({
      ...prev,
      [codeId]: !prev[codeId],
    }));
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
      <Helmet>
        <title>{caseStudy.title} — Project</title>
        <meta name="description" content={caseStudy.description} />
        <meta property="og:title" content={`${caseStudy.title} — Project`} />
        <meta property="og:description" content={caseStudy.description} />
        {caseStudy.heroImage && (
          <meta property="og:image" content={caseStudy.heroImage} />
        )}
      </Helmet>
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

              <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
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
              {(caseStudy.repositoryUrl || caseStudy.demoUrl) && (
                <div className="flex flex-wrap gap-4 mb-8">
                  {caseStudy.repositoryUrl && (
                    <a
                      href={caseStudy.repositoryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <Icon name="Github" size={18} />
                      <span>View Code</span>
                    </a>
                  )}
                  {caseStudy.demoUrl && (
                    <a
                      href={caseStudy.demoUrl}
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
          <div className="lg:col-span-3 space-y-16">
            {/* Overview Section */}
            <section id="overview" className="scroll-mt-24">
              <div className="bg-surface dark:bg-surface rounded-lg shadow-sm border border-border dark:border-border-strong p-8">
                <h2 className="text-3xl font-bold text-text-primary dark:text-white mb-8">
                  Project Overview
                </h2>

                {/* Description */}
                {caseStudy.description && (
                  <div className="prose prose-lg max-w-none text-text-secondary dark:text-white/70 mb-8">
                    <p>{caseStudy.description}</p>
                  </div>
                )}

                {/* Technologies */}
                {caseStudy.tags && caseStudy.tags.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-text-primary dark:text-white mb-4">
                      Technologies Used
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {caseStudy.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-accent-50 dark:bg-accent-900/30 text-accent dark:text-accent-400 rounded-lg text-sm font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>

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

            {/* Gallery Section - Only if gallery has items */}
            {caseStudy.gallery && caseStudy.gallery.length > 0 && (
              <section id="gallery" className="scroll-mt-24">
                <div className="bg-surface dark:bg-surface rounded-lg shadow-sm border border-border dark:border-border-strong p-8">
                  <h2 className="text-3xl font-bold text-text-primary dark:text-white mb-8">
                    Visual Gallery
                  </h2>

                  <div className="grid md:grid-cols-2 gap-6">
                    {caseStudy.gallery.map((item) => (
                      <div
                        key={item.id}
                        className="group cursor-pointer"
                        onClick={() => openImageModal(item)}
                      >
                        <div className="relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                          <Image
                            src={item.image}
                            alt={item.title}
                            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                            <Icon
                              name="ZoomIn"
                              size={32}
                              color="white"
                              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              strokeWidth={2}
                            />
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                            <h3 className="text-white font-semibold">
                              {item.title}
                            </h3>
                          </div>
                        </div>
                      </div>
                    ))}
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
