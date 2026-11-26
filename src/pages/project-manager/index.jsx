// src/pages/project-manager/index.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Icon from 'components/AppIcon';
import { useProjects } from 'context/ProjectsContext';
import { useToast } from 'context/ToastContext';
import { uploadImage } from 'services/storageService';
import { screenshotLimitMessage, screenshotsWithinLimit, toStoredScreenshot } from 'lib/screenshotLayout.mjs';
import { describeMissing, missingArabic, PROJECT_SPEC } from '../../i18n/content.mjs';
import { ArabicMissingBadge } from 'components/admin/BilingualField';

// Arabic twins of the project's scalar text fields (columns added by migration 008).
const AR_FIELDS = ['title_ar', 'description_ar', 'client_ar', 'problem_ar', 'solution_ar', 'results_ar', 'meta_title_ar', 'meta_description_ar'];
const emptyArabic = () => Object.fromEntries(AR_FIELDS.map((key) => [key, '']));
const arabicOrNull = (value) => (typeof value === 'string' && value.trim() ? value : null);

// Which editor section holds each translatable field.
const SECTION_OF_FIELD = {
  title: 'basic', description: 'basic', client: 'basic',
  content_sections: 'sections',
  problem: 'content', solution: 'content', results: 'content', testimonials: 'content',
  meta_title: 'publishing', meta_description: 'publishing',
};
const sectionOfPath = (path) => SECTION_OF_FIELD[path.split(/[.[]/)[0]] || 'basic';

// Import components
import BasicInformation from './components/BasicInformation';
import VisualAssets from './components/VisualAssets';
import TechnicalDetails from './components/TechnicalDetails';
import CaseStudyContent from './components/CaseStudyContent';
import PublishingOptions from './components/PublishingOptions';
import ShareImagePanel from './components/ShareImagePanel';
import ContentSections from './components/ContentSections';

const formatPublishingStatus = (value) => {
  if (!value || typeof value !== 'string') return 'Not set';
  return value
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
};

const ProjectManager = () => {
  const { addProject, editProject, getProjectById } = useProjects();
  const { success, warning, error: showError } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('id');
  const isEditing = !!editId;
  
  const [formData, setFormData] = useState({
    // Basic Information
    title: '',
    client: '',
    projectType: '',
    startDate: '',
    endDate: '',
    status: 'draft',
    description: '',
    
    // Visual Assets
    heroImages: [],
    screenshots: [],
    mockups: [],
    beforeAfter: [],
    autoOptimize: true,
    generateWebP: true,
    responsiveImages: true,
    
    // Technical Details
    technologies: [],
    complexity: '',
    metrics: [],
    repositoryUrl: '',
    demoUrl: '',
    
    // Detailed project write-up
    problem: '',
    solution: '',
    results: '',
    prototypeUrl: '',
    testimonials: [],
    enableCaseStudy: false,
    
    // Publishing Options
    publishingStatus: 'draft',
    visibility: 'public',
    password: '',
    category: '',
    featured: false,
    tags: [],
    metaTitle: '',
    metaDescription: '',

    // Dynamic Content Sections
    content_sections: [],

    // Arabic versions (optional; empty falls back to English on /ar)
    ...emptyArabic()
  });

  const [activeSection, setActiveSection] = useState('basic');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [isLoadingProject, setIsLoadingProject] = useState(isEditing);

  useEffect(() => {
    const loadExisting = async () => {
      if (!editId) return;
      setIsLoadingProject(true);
      try {
        const result = await getProjectById(editId);
        if (result.success && result.data) {
          const p = result.data;
          setFormData({
            title: p.title || '',
            client: p.client || '',
            projectType: p.project_type || '',
            startDate: p.start_date || '',
            endDate: p.end_date || '',
            status: p.status || 'draft',
            description: p.description || '',
            heroImages: p.hero_images || [],
            screenshots: p.screenshots || [],
            mockups: p.mockups || [],
            beforeAfter: [],
            autoOptimize: true,
            generateWebP: true,
            responsiveImages: true,
            technologies: p.technologies || [],
            complexity: p.complexity || '',
            metrics: [],
            repositoryUrl: p.repository_url || '',
            demoUrl: p.demo_url || '',
            problem: p.problem || '',
            solution: p.solution || '',
            results: p.results || '',
            prototypeUrl: '',
            testimonials: p.testimonials || [],
            publishingStatus: p.publishing_status || 'draft',
            visibility: p.visibility || 'public',
            password: '',
            category: p.category || '',
            featured: p.featured || false,
            tags: p.tags || [],
            metaTitle: p.meta_title || '',
            metaDescription: p.meta_description || '',
            content_sections: p.content_sections || [],
            enableCaseStudy: p.enable_case_study || false,
            shareImage: p.share_image || '',
            shareImageAr: p.share_image_ar || '',
            ...Object.fromEntries(AR_FIELDS.map((key) => [key, p[key] || ''])),
          });
        } else {
          showError('Project not found. Redirecting...');
          setTimeout(() => navigate('/projects-manager'), 2000);
        }
      } catch (err) {
        showError(`Failed to load project: ${err.message}`);
        setTimeout(() => navigate('/projects-manager'), 2000);
      } finally {
        setIsLoadingProject(false);
      }
    };
    loadExisting();
  }, [editId, getProjectById, navigate]);

  const sections = [
    { id: 'basic', label: 'Basic Information', icon: 'Info', color: 'accent' },
    { id: 'visual', label: 'Visual Assets', icon: 'Image', color: 'cta' },
    { id: 'sections', label: 'Content Sections', icon: 'LayoutList', color: 'secondary' },
    { id: 'technical', label: 'Technical Details', icon: 'Code', color: 'success' },
    { id: 'content', label: 'Project Details', icon: 'FileText', color: 'primary' },
    { id: 'publishing', label: 'Publishing Options', icon: 'Settings', color: 'warning' }
  ];

  const sectionColorMap = {
    accent:  { bg: 'bg-accent-100 dark:bg-accent-subtle',  text: 'text-accent-800 dark:text-accent-text',  border: 'border-accent-600 dark:border-accent-fill',  iconBg: 'bg-accent-200 dark:bg-accent-fill/30',  iconText: 'text-accent-600 dark:text-accent-text' },
    cta:     { bg: 'bg-cta-100 dark:bg-accent-subtle',     text: 'text-cta-800 dark:text-accent-text',     border: 'border-cta-600 dark:border-accent-fill',     iconBg: 'bg-cta-200 dark:bg-accent-fill/30',     iconText: 'text-cta-600 dark:text-accent-text' },
    success: { bg: 'bg-success-100 dark:bg-success-900/30', text: 'text-success-800 dark:text-success-text', border: 'border-success-600 dark:border-success-fill', iconBg: 'bg-success-200 dark:bg-success-fill/30', iconText: 'text-success-600 dark:text-success-text' },
    primary: { bg: 'bg-primary-100 dark:bg-surface-elevated', text: 'text-primary-800 dark:text-text-primary', border: 'border-primary-600 dark:border-border-strong', iconBg: 'bg-primary-200 dark:bg-surface', iconText: 'text-primary-600 dark:text-text-secondary' },
    warning: { bg: 'bg-warning-100 dark:bg-warning-900/40', text: 'text-warning-800 dark:text-warning', border: 'border-warning-600', iconBg: 'bg-warning-200 dark:bg-warning-800/40', iconText: 'text-warning-600 dark:text-warning' },
    secondary: { bg: 'bg-secondary-100 dark:bg-surface-elevated', text: 'text-secondary-800 dark:text-text-primary', border: 'border-secondary-600 dark:border-border-strong', iconBg: 'bg-secondary-200 dark:bg-surface', iconText: 'text-secondary-600 dark:text-muted' },
  };

  // English text that has no Arabic yet (Arabic is optional, but flagged).
  const missingArabicPaths = useMemo(() => missingArabic({
    title: formData.title,
    title_ar: formData.title_ar,
    description: formData.description,
    description_ar: formData.description_ar,
    client: formData.client,
    client_ar: formData.client_ar,
    ...(formData.enableCaseStudy ? {
      problem: formData.problem, problem_ar: formData.problem_ar,
      solution: formData.solution, solution_ar: formData.solution_ar,
      results: formData.results, results_ar: formData.results_ar,
      testimonials: formData.testimonials,
    } : {}),
    meta_title: formData.metaTitle,
    meta_title_ar: formData.meta_title_ar,
    meta_description: formData.metaDescription,
    meta_description_ar: formData.meta_description_ar,
    content_sections: formData.content_sections,
  }, PROJECT_SPEC), [formData]);

  const missingBySection = useMemo(() => {
    const counts = {};
    missingArabicPaths.forEach((path) => {
      const section = sectionOfPath(path);
      counts[section] = (counts[section] || 0) + 1;
    });
    return counts;
  }, [missingArabicPaths]);

  // Validation function - MINIMAL REQUIREMENTS ONLY
  const validateForm = () => {
    const errors = {};

    if (!screenshotsWithinLimit(formData.screenshots)) {
      errors.screenshots = screenshotLimitMessage();
    }
    
    // Only require the absolute essentials
    if (!formData.title?.trim()) errors.title = 'Project title is required';
    if (!formData.description?.trim()) errors.description = 'Project description is required';
    if (!formData.category?.trim()) errors.category = 'Category is required';
    
    // Password validation only if visibility is password-protected
    if (formData.visibility === 'password' && !formData.password?.trim()) {
      errors.password = 'Password is required for password-protected projects';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Save function
  const handleSave = useCallback(async (isDraft = false) => {
    setIsSaving(true);
    setSaveStatus('');
    
    if (!screenshotsWithinLimit(formData.screenshots)) {
      const message = screenshotLimitMessage();
      setFormErrors({ screenshots: message });
      setIsSaving(false);
      setSaveStatus(message);
      return;
    }

    if (!isDraft && !validateForm()) {
      setIsSaving(false);
      setSaveStatus('Please fix the validation errors before saving.');
      return;
    }
    
    try {
      // Upload images to Supabase Storage first
      const uploadImages = async (images, folder) => {
        const stored = [];
        for (const img of images) {
          if (typeof img === 'string') {
            const item = toStoredScreenshot(img, null);
            if (item) stored.push(item);
            continue;
          }

          let url = '';
          if (img?.file) {
            const result = await uploadImage(img.file, editId || 'draft', folder);
            if (result.success) url = result.data;
          } else if (typeof img?.url === 'string') {
            url = img.url;
          } else if (typeof img?.preview === 'string' && !img.preview.startsWith('blob:')) {
            url = img.preview;
          }

          const item = toStoredScreenshot(url, img);
          if (item) stored.push(item);
        }
        return stored;
      };

      const [heroImages, screenshots, mockups] = await Promise.all([
        uploadImages(formData.heroImages || [], 'hero'),
        uploadImages(formData.screenshots || [], 'screenshots'),
        uploadImages(formData.mockups || [], 'mockups'),
      ]);

      const projectData = {
        title: formData.title,
        description: formData.description,
        category: formData.category || 'Uncategorized',
        technologies: formData.technologies?.length > 0 ? formData.technologies : [],
        publishing_status: isEditing ? (formData.publishingStatus || 'draft') : (isDraft ? 'draft' : (formData.publishingStatus || 'draft')),
        featured: formData.featured || false,
        status: formData.status || 'draft',
        client: formData.client || null,
        project_type: formData.projectType || null,
        start_date: formData.startDate || null,
        end_date: formData.endDate || null,
        repository_url: formData.repositoryUrl || null,
        demo_url: formData.demoUrl || null,
        complexity: formData.complexity || null,
        enable_case_study: formData.enableCaseStudy || false,
        problem: formData.enableCaseStudy ? (formData.problem || null) : null,
        solution: formData.enableCaseStudy ? (formData.solution || null) : null,
        results: formData.enableCaseStudy ? (formData.results || null) : null,
        visibility: formData.visibility || 'public',
        tags: formData.tags?.length > 0 ? formData.tags : [],
        meta_title: formData.metaTitle || null,
        meta_description: formData.metaDescription || null,
        hero_images: heroImages,
        screenshots: screenshots,
        mockups: mockups,
        content_sections: formData.content_sections || [],
        testimonials: formData.testimonials || [],
        // Arabic: optional; empty saves as null so the site falls back to English.
        title_ar: arabicOrNull(formData.title_ar),
        description_ar: arabicOrNull(formData.description_ar),
        client_ar: arabicOrNull(formData.client_ar),
        problem_ar: formData.enableCaseStudy ? arabicOrNull(formData.problem_ar) : null,
        solution_ar: formData.enableCaseStudy ? arabicOrNull(formData.solution_ar) : null,
        results_ar: formData.enableCaseStudy ? arabicOrNull(formData.results_ar) : null,
        meta_title_ar: arabicOrNull(formData.meta_title_ar),
        meta_description_ar: arabicOrNull(formData.meta_description_ar),
      };
      
      const result = isEditing
        ? await editProject(editId, projectData)
        : await addProject(projectData);
      
      if (result.success) {
        setIsSaving(false);
        if (result.arabicSkipped) {
          warning('Saved the English text only: the database has no Arabic columns yet (migration 008 not applied).', 9000);
        } else if (missingArabicPaths.length > 0) {
          warning(`Saved. Arabic is missing for ${missingArabicPaths.length} field${missingArabicPaths.length === 1 ? '' : 's'}; the Arabic site shows English there.`, 7000);
        }
        success(isEditing
          ? (isDraft ? 'Draft updated successfully!' : 'Project updated successfully!')
          : (isDraft ? 'Draft saved successfully!' : 'Project saved successfully!'));
        
        // Redirect to projects manager after 1 second
        setTimeout(() => {
          navigate('/projects-manager');
        }, 1000);
      } else {
        setIsSaving(false);
        const msg = result.error || 'Failed to save project';
        showError(typeof msg === 'string' ? msg : JSON.stringify(msg));
      }
    } catch (error) {
      setIsSaving(false);
      showError(error.message || 'An unexpected error occurred');
    }
  }, [formData, addProject, editProject, editId, isEditing, navigate, missingArabicPaths]);

  // Auto-save disabled - causes issues with image uploads
  // TODO: Fix auto-save to properly handle file uploads before re-enabling
  /*
  const formDataRef = React.useRef(formData);
  useEffect(() => { formDataRef.current = formData; }, [formData]);

  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      const currentData = formDataRef.current;
      if (currentData.title && currentData.title.trim()) {
        const projectData = {
          title: currentData.title,
          description: currentData.description,
          category: currentData.category || 'Uncategorized',
          technologies: currentData.technologies?.length > 0 ? currentData.technologies : [],
          publishing_status: 'draft',
          featured: currentData.featured || false,
          status: currentData.status || 'draft',
          client: currentData.client || null,
          project_type: currentData.projectType || null,
          start_date: currentData.startDate || null,
          end_date: currentData.endDate || null,
          repository_url: currentData.repositoryUrl || null,
          demo_url: currentData.demoUrl || null,
          complexity: currentData.complexity || null,
          enable_case_study: currentData.enableCaseStudy || false,
          problem: currentData.enableCaseStudy ? (currentData.problem || null) : null,
          solution: currentData.enableCaseStudy ? (currentData.solution || null) : null,
          results: currentData.enableCaseStudy ? (currentData.results || null) : null,
          visibility: currentData.visibility || 'public',
          tags: currentData.tags?.length > 0 ? currentData.tags : [],
          meta_title: currentData.metaTitle || null,
          meta_description: currentData.metaDescription || null,
          content_sections: currentData.content_sections || [],
          hero_images: currentData.heroImages?.filter(img => typeof img === 'string') || [],
          screenshots: currentData.screenshots?.filter(img => typeof img === 'string') || [],
          mockups: currentData.mockups?.filter(img => typeof img === 'string') || [],
        };
        if (editId) {
          editProject(editId, projectData);
        } else {
          addProject(projectData);
        }
      }
    }, 30000);
    
    return () => clearInterval(autoSaveInterval);
  }, [addProject, editProject, editId]);
  */

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'basic':
        return <BasicInformation formData={formData} setFormData={setFormData} />;
      case 'visual':
        return <VisualAssets formData={formData} setFormData={setFormData} />;
      case 'sections':
        return <ContentSections formData={formData} setFormData={setFormData} />;
      case 'technical':
        return <TechnicalDetails formData={formData} setFormData={setFormData} />;
      case 'content':
        return <CaseStudyContent formData={formData} setFormData={setFormData} />;
      case 'publishing':
        return (
          <div className="space-y-6">
            <PublishingOptions formData={formData} setFormData={setFormData} />
            <ShareImagePanel projectId={editId} formData={formData} setFormData={setFormData} />
          </div>
        );
      default:
        return <BasicInformation formData={formData} setFormData={setFormData} />;
    }
  };

  const getCompletionStatus = () => {
    const requiredFields = [
      'title', 'projectType', 'status', 'description',
      'technologies', 'complexity', 'problem', 'solution', 'results',
      'publishingStatus', 'visibility', 'category'
    ];
    
    const completedFields = requiredFields.filter(field => {
      if (field === 'technologies') return formData[field]?.length > 0;
      return formData[field] && formData[field].toString().trim();
    });
    
    return Math.round((completedFields.length / requiredFields.length) * 100);
  };

  const completionPercentage = getCompletionStatus();

  if (isLoadingProject) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader" size={32} className="animate-spin mx-auto mb-4 text-accent dark:text-accent-text" />
          <p className="text-secondary-600 dark:text-text-secondary">Loading project data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-secondary-200 dark:bg-surface dark:border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link
                to="/projects-manager"
                className="flex items-center text-secondary-600 hover:text-secondary-800 transition-colors mr-4 dark:text-text-secondary"
              >
                <Icon name="ArrowLeft" size={20} className="mr-2" />
                Back to Projects
              </Link>
              <h1 className="text-2xl font-bold text-primary-800 dark:text-text-primary">
                {isEditing ? `Edit: ${formData.title || 'Untitled'}` : 'Create Project'}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Completion Status */}
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-secondary-200 rounded-full h-2 dark:bg-surface-elevated">
                  <div 
                    className="bg-accent-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
                <span className="text-sm text-secondary-600 dark:text-text-secondary">{completionPercentage}% Complete</span>
              </div>
              
              {/* Save Status */}
              {saveStatus && !saveStatus.toLowerCase().includes('error') && (
                <div className="flex items-center space-x-2 px-3 py-1 rounded-full text-sm bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-text">
                  <Icon name="CheckCircle" size={16} />
                  <span>{saveStatus}</span>
                </div>
              )}
              
              {/* Cancel Button */}
              <button
                onClick={() => navigate('/projects-manager')}
                className="btn-secondary flex items-center space-x-2"
              >
                <Icon name="X" size={16} />
                <span>Cancel</span>
              </button>
              
              {/* Action Buttons */}
              <button
                onClick={() => handleSave(true)}
                disabled={isSaving}
                className="btn-secondary flex items-center space-x-2"
              >
                {isSaving ? (
                  <Icon name="Loader" size={16} className="animate-spin" />
                ) : (
                  <Icon name="Save" size={16} />
                )}
                <span>Save Draft</span>
              </button>
              
              <button
                onClick={() => handleSave(false)}
                disabled={isSaving}
                className="btn-primary flex items-center space-x-2"
              >
                {isSaving ? (
                  <Icon name="Loader" size={16} className="animate-spin" />
                ) : (
                  <Icon name="Upload" size={16} />
                )}
                <span>{isEditing ? 'Update Project' : 'Publish Project'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Box */}
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 dark:bg-accent-subtle dark:border-border-strong">
          <div className="flex items-start">
            <Icon name="Info" size={20} className="text-blue-600 mt-0.5 mr-3 flex-shrink-0 dark:text-accent-text" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1 dark:text-text-primary">Minimum Requirements</h3>
              <p className="text-sm text-blue-800 dark:text-text-secondary">
                Only <strong>3 fields required</strong>: Title, Description, and Category. 
                Everything else is optional - add as much or as little detail as you want!
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Navigation Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-md p-6 dark:bg-surface">
              <h2 className="text-lg font-semibold text-primary-800 mb-4 dark:text-text-primary">Sections</h2>
              <nav className="space-y-2">
                {sections.map(section => {
                  const isActive = activeSection === section.id;
                  const colors = sectionColorMap[section.color] || sectionColorMap.accent;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                        isActive
                          ? `${colors.bg} ${colors.text} border-l-4 ${colors.border}`
                          : 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-800 dark:text-text-secondary dark:hover:bg-surface-elevated dark:hover:text-text-primary'
                      }`}
                    >
                      <div className={`p-1 rounded mr-3 ${
                        isActive 
                          ? colors.iconBg 
                          : 'bg-secondary-100 dark:bg-surface-elevated'
                      }`}>
                        <Icon 
                          name={section.icon} 
                          size={16} 
                          className={isActive ? colors.iconText : 'text-secondary-600 dark:text-muted'}
                        />
                      </div>
                      <span className="font-medium">{section.label}</span>
                      {missingBySection[section.id] > 0 && (
                        <span
                          className="ms-auto rounded-full bg-warning-100 px-2 py-0.5 text-[11px] font-semibold text-warning-800 dark:bg-warning-900/30 dark:text-warning"
                          title={`${missingBySection[section.id]} field(s) without Arabic`}
                        >
                          AR {missingBySection[section.id]}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
              
              {/* Project Status Summary */}
              <div className="mt-6 p-4 bg-secondary-50 rounded-lg dark:bg-surface">
                <h3 className="text-sm font-semibold text-secondary-700 mb-2 dark:text-text-secondary">Project Status</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-secondary-600 dark:text-text-secondary">Status:</span>
                    <span className="font-medium text-secondary-800 dark:text-text-primary">
                      {formatPublishingStatus(formData.publishingStatus)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600 dark:text-text-secondary">Type:</span>
                    <span className="font-medium text-secondary-800 dark:text-text-primary">
                      {formData.projectType || 'Not set'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600 dark:text-text-secondary">Arabic:</span>
                    <span className="font-medium text-secondary-800 dark:text-text-primary" data-arabic-status>
                      {missingArabicPaths.length === 0 ? 'Complete' : `${missingArabicPaths.length} missing`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600 dark:text-text-secondary">Images:</span>
                    <span className="font-medium text-secondary-800 dark:text-text-primary">
                      {(formData.heroImages?.length || 0) + (formData.screenshots?.length || 0)}
                    </span>
                  </div>
                </div>
              </div>

              {missingArabicPaths.length > 0 && (
                <div className="mt-4 rounded-lg border border-warning-200 bg-warning-50/60 p-4 dark:border-warning-800/50 dark:bg-warning-900/20" data-arabic-missing-list>
                  <ArabicMissingBadge />
                  <p className="mt-2 text-xs text-secondary-700 dark:text-text-secondary">
                    Optional, but the Arabic site shows English for these:
                  </p>
                  <ul className="mt-2 space-y-1">
                    {missingArabicPaths.slice(0, 8).map((path, index) => (
                      <li key={path}>
                        <button
                          type="button"
                          onClick={() => setActiveSection(sectionOfPath(path))}
                          className="text-start text-xs font-medium capitalize text-warning-800 underline-offset-2 hover:underline dark:text-warning"
                        >
                          {describeMissing([path])[0]}
                        </button>
                      </li>
                    ))}
                    {missingArabicPaths.length > 8 && (
                      <li className="text-xs text-secondary-600 dark:text-muted">and {missingArabicPaths.length - 8} more</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderSectionContent()}
            
            {/* Form Errors */}
            {Object.keys(formErrors).length > 0 && (
              <div className="bg-error-50 border border-error-200 rounded-lg p-4 mb-6 dark:bg-error-900/40 dark:border-error-800">
                <div className="flex items-center mb-2">
                  <Icon name="AlertCircle" size={16} className="text-error-600 mr-2 dark:text-error" />
                  <h3 className="text-sm font-semibold text-error-800 dark:text-error">Please fix the following errors:</h3>
                </div>
                <ul className="text-sm text-error-700 space-y-1 dark:text-error">
                  {Object.values(formErrors).map((error, index) => (
                    <li key={index} className="flex items-center">
                      <Icon name="X" size={12} className="mr-2" />
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectManager;