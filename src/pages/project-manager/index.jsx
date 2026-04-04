// src/pages/project-manager/index.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Icon from 'components/AppIcon';
import { useProjects } from 'context/ProjectsContext';
import { uploadImage } from 'services/storageService';

// Import components
import BasicInformation from './components/BasicInformation';
import VisualAssets from './components/VisualAssets';
import TechnicalDetails from './components/TechnicalDetails';
import CaseStudyContent from './components/CaseStudyContent';
import PublishingOptions from './components/PublishingOptions';

const ProjectManager = () => {
  const { addProject, editProject, getProjectById } = useProjects();
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
    metaDescription: ''
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
          });
        } else {
          setSaveStatus('Error: Project not found. Redirecting...');
          setTimeout(() => navigate('/projects-manager'), 2000);
        }
      } catch (err) {
        setSaveStatus(`Error loading project: ${err.message}`);
      } finally {
        setIsLoadingProject(false);
      }
    };
    loadExisting();
  }, [editId, getProjectById, navigate]);

  const sections = [
    { id: 'basic', label: 'Basic Information', icon: 'Info', color: 'accent' },
    { id: 'visual', label: 'Visual Assets', icon: 'Image', color: 'cta' },
    { id: 'technical', label: 'Technical Details', icon: 'Code', color: 'success' },
    { id: 'content', label: 'Case Study Content', icon: 'FileText', color: 'primary' },
    { id: 'publishing', label: 'Publishing Options', icon: 'Settings', color: 'warning' }
  ];

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
          if (img.file) {
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
      };
      
      const result = isEditing
        ? await editProject(editId, projectData)
        : await addProject(projectData);
      
      if (result.success) {
        setIsSaving(false);
        setSaveStatus(isEditing
          ? (isDraft ? 'Draft updated successfully!' : 'Project updated successfully!')
          : (isDraft ? 'Draft saved successfully!' : 'Project saved successfully!'));
        
        // Redirect to projects manager after 1 second
        setTimeout(() => {
          navigate('/projects-manager');
        }, 1000);
      } else {
        setIsSaving(false);
        setSaveStatus(`Error: ${result.error}`);
      }
    } catch (error) {
      setIsSaving(false);
      setSaveStatus(`Error: ${error.message}`);
    }
  }, [formData, addProject, editProject, editId, isEditing, navigate]);

  // Auto-save function
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (formData.title && formData.title.trim()) {
        handleSave(true);
      }
    }, 30000); // Auto-save every 30 seconds
    
    return () => clearInterval(autoSaveInterval);
  }, [handleSave]);

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'basic':
        return <BasicInformation formData={formData} setFormData={setFormData} />;
      case 'visual':
        return <VisualAssets formData={formData} setFormData={setFormData} />;
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
              {saveStatus && (
                <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
                  saveStatus.includes('error') || saveStatus.includes('fix')
                    ? 'bg-error-100 text-error-700' :'bg-success-100 text-success-700'
                }`}>
                  <Icon 
                    name={saveStatus.includes('error') || saveStatus.includes('fix') ? 'AlertCircle' : 'CheckCircle'} 
                    size={16} 
                  />
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
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                        isActive
                          ? `bg-${section.color}-100 text-${section.color}-800 border-l-4 border-${section.color}-600`
                          : 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-800'
                      }`}
                    >
                      <div className={`p-1 rounded mr-3 ${
                        isActive 
                          ? `bg-${section.color}-200` 
                          : 'bg-secondary-100'
                      }`}>
                        <Icon 
                          name={section.icon} 
                          size={16} 
                          className={isActive ? `text-${section.color}-600` : 'text-secondary-600'}
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