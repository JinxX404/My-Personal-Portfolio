// src/pages/project-manager/index.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Icon from 'components/AppIcon';
import { useProjects } from 'context/ProjectsContext';
import { useToast } from 'context/ToastContext';
import { uploadImage } from 'services/storageService';

// Import components
import BasicInformation from './components/BasicInformation';
import VisualAssets from './components/VisualAssets';
import TechnicalDetails from './components/TechnicalDetails';
import CaseStudyContent from './components/CaseStudyContent';
import PublishingOptions from './components/PublishingOptions';
import ContentSections from './components/ContentSections';

const ProjectManager = () => {
  const { addProject, editProject, getProjectById } = useProjects();
  const { success, error: showError } = useToast();
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
    
    // Case Study Content
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
    content_sections: []
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
    { id: 'content', label: 'Case Study Content', icon: 'FileText', color: 'primary' },
    { id: 'publishing', label: 'Publishing Options', icon: 'Settings', color: 'warning' }
  ];

  const sectionColorMap = {
    accent:  { bg: 'bg-accent-100',  text: 'text-accent-800',  border: 'border-accent-600',  iconBg: 'bg-accent-200',  iconText: 'text-accent-600' },
    cta:     { bg: 'bg-cta-100',     text: 'text-cta-800',     border: 'border-cta-600',     iconBg: 'bg-cta-200',     iconText: 'text-cta-600' },
    success: { bg: 'bg-success-100', text: 'text-success-800', border: 'border-success-600', iconBg: 'bg-success-200', iconText: 'text-success-600' },
    primary: { bg: 'bg-primary-100', text: 'text-primary-800', border: 'border-primary-600', iconBg: 'bg-primary-200', iconText: 'text-primary-600' },
    warning: { bg: 'bg-warning-100', text: 'text-warning-800', border: 'border-warning-600', iconBg: 'bg-warning-200', iconText: 'text-warning-600' },
    secondary: { bg: 'bg-secondary-100', text: 'text-secondary-800', border: 'border-secondary-600', iconBg: 'bg-secondary-200', iconText: 'text-secondary-600' },
  };

  // Validation function - MINIMAL REQUIREMENTS ONLY
  const validateForm = () => {
    const errors = {};
    
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
    
    if (!isDraft && !validateForm()) {
      setIsSaving(false);
      setSaveStatus('Please fix the validation errors before saving.');
      return;
    }
    
    try {
      // Upload images to Supabase Storage first
      const uploadImages = async (images, folder) => {
        const urls = [];
        for (const img of images) {
          // Handle string URLs (existing images)
          if (typeof img === 'string') {
            urls.push(img);
          } else if (img.file) {
            // Upload new file
            const result = await uploadImage(img.file, editId || 'draft', folder);
            if (result.success) {
              urls.push(result.data);
            }
          } else if (img.preview) {
            urls.push(img.preview);
          }
        }
        return urls;
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
        publishing_status: isDraft ? 'draft' : (formData.publishingStatus || 'draft'),
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
      };
      
      const result = isEditing
        ? await editProject(editId, projectData)
        : await addProject(projectData);
      
      if (result.success) {
        setIsSaving(false);
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
  }, [formData, addProject, editProject, editId, isEditing, navigate]);

  // Auto-save function — uses ref to avoid interval recreation on every keystroke
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
        return <PublishingOptions formData={formData} setFormData={setFormData} />;
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
          <Icon name="Loader" size={32} className="animate-spin mx-auto mb-4 text-accent" />
          <p className="text-secondary-600">Loading project data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-secondary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link
                to="/projects-manager"
                className="flex items-center text-secondary-600 hover:text-secondary-800 transition-colors mr-4"
              >
                <Icon name="ArrowLeft" size={20} className="mr-2" />
                Back to Projects
              </Link>
              <h1 className="text-2xl font-bold text-primary-800">
                {isEditing ? `Edit: ${formData.title || 'Untitled'}` : 'Create Project'}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Completion Status */}
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-secondary-200 rounded-full h-2">
                  <div 
                    className="bg-accent-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
                <span className="text-sm text-secondary-600">{completionPercentage}% Complete</span>
              </div>
              
              {/* Save Status */}
              {saveStatus && !saveStatus.toLowerCase().includes('error') && (
                <div className="flex items-center space-x-2 px-3 py-1 rounded-full text-sm bg-success-100 text-success-700">
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
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <Icon name="Info" size={20} className="text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Minimum Requirements</h3>
              <p className="text-sm text-blue-800">
                Only <strong>3 fields required</strong>: Title, Description, and Category. 
                Everything else is optional - add as much or as little detail as you want!
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Navigation Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold text-primary-800 mb-4">Sections</h2>
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
                          : 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-800'
                      }`}
                    >
                      <div className={`p-1 rounded mr-3 ${
                        isActive 
                          ? colors.iconBg 
                          : 'bg-secondary-100'
                      }`}>
                        <Icon 
                          name={section.icon} 
                          size={16} 
                          className={isActive ? colors.iconText : 'text-secondary-600'}
                        />
                      </div>
                      <span className="font-medium">{section.label}</span>
                    </button>
                  );
                })}
              </nav>
              
              {/* Project Status Summary */}
              <div className="mt-6 p-4 bg-secondary-50 rounded-lg">
                <h3 className="text-sm font-semibold text-secondary-700 mb-2">Project Status</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Status:</span>
                    <span className="font-medium text-secondary-800 capitalize">
                      {formData.status || 'Not set'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Type:</span>
                    <span className="font-medium text-secondary-800">
                      {formData.projectType || 'Not set'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Images:</span>
                    <span className="font-medium text-secondary-800">
                      {(formData.heroImages?.length || 0) + (formData.screenshots?.length || 0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderSectionContent()}
            
            {/* Form Errors */}
            {Object.keys(formErrors).length > 0 && (
              <div className="bg-error-50 border border-error-200 rounded-lg p-4 mb-6">
                <div className="flex items-center mb-2">
                  <Icon name="AlertCircle" size={16} className="text-error-600 mr-2" />
                  <h3 className="text-sm font-semibold text-error-800">Please fix the following errors:</h3>
                </div>
                <ul className="text-sm text-error-700 space-y-1">
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