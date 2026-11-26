// src/pages/project-manager/components/PublishingOptions.jsx
import React, { useState } from 'react';
import Icon from 'components/AppIcon';
import BilingualField from 'components/admin/BilingualField';
import { translateTerm } from '../../../i18n/content.mjs';

const PublishingOptions = ({ formData, setFormData }) => {
  const [previewMode, setPreviewMode] = useState('desktop');

  const workflowStages = [
    { id: 'draft', label: 'Draft', icon: 'Edit3', color: 'secondary' },
    { id: 'in_progress', label: 'In Progress', icon: 'Clock', color: 'warning' },
    { id: 'review', label: 'Review', icon: 'Eye', color: 'warning' },
    { id: 'approved', label: 'Approved', icon: 'CheckCircle', color: 'success' },
    { id: 'published', label: 'Published', icon: 'Globe', color: 'accent' }
  ];

  const workflowColorMap = {
    secondary: { border: 'border-secondary-500 dark:border-border-strong', bg: 'bg-secondary-50 dark:bg-surface-elevated', iconBg: 'bg-secondary-100 dark:bg-surface', iconText: 'text-secondary-600 dark:text-muted' },
    warning:   { border: 'border-warning-500',   bg: 'bg-warning-50 dark:bg-warning-900/40',   iconBg: 'bg-warning-100 dark:bg-warning-800/40',   iconText: 'text-warning-600 dark:text-warning' },
    success:   { border: 'border-success-500 dark:border-success-fill',   bg: 'bg-success-50 dark:bg-success-900/30',   iconBg: 'bg-success-100 dark:bg-success-800/40',   iconText: 'text-success-600 dark:text-success-text' },
    accent:    { border: 'border-accent-500 dark:border-accent-fill',    bg: 'bg-accent-50 dark:bg-accent-subtle',    iconBg: 'bg-accent-100 dark:bg-accent-fill/30',    iconText: 'text-accent-600 dark:text-accent-text' },
  };

  const visibilityOptions = [
    { value: 'public', label: 'Public', description: 'Visible to everyone', icon: 'Globe' },
    { value: 'private', label: 'Private', description: 'Only visible to you', icon: 'Lock' },
    { value: 'unlisted', label: 'Unlisted', description: 'Accessible via direct link only', icon: 'Link' },
    { value: 'password', label: 'Password Protected', description: 'Requires password to view', icon: 'Shield' }
  ];

  const categories = [
    'Web Development', 'Mobile App', 'UI/UX Design', 'Backend Development',
    'E-commerce', 'API Development', 'DevOps', 'Database Design', 'Other'
  ];

  const tags = [
    'React', 'JavaScript', 'TypeScript', 'Node.js', 'Python', 'Design System',
    'Responsive', 'API', 'Database', 'Cloud', 'Mobile', 'Performance', 'Security'
  ];

  const breakpoints = [
    { id: 'mobile', label: 'Mobile', width: '375px', icon: 'Smartphone' },
    { id: 'tablet', label: 'Tablet', width: '768px', icon: 'Tablet' },
    { id: 'desktop', label: 'Desktop', width: '1024px', icon: 'Monitor' },
    { id: 'widescreen', label: 'Widescreen', width: '1440px', icon: 'Monitor' }
  ];

  const handlePublishingStatusChange = (status) => {
    setFormData(prev => ({ ...prev, publishingStatus: status }));
  };

  const toggleTag = (tag) => {
    const currentTags = formData?.tags || [];
    const updatedTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    
    setFormData(prev => ({ ...prev, tags: updatedTags }));
  };

  return (
    <div className="bg-surface dark:bg-surface rounded-xl shadow-md p-6 mb-6 border border-border dark:border-border-strong">
      <div className="flex items-center mb-6">
        <div className="p-2 bg-success-100 dark:bg-success-900/30 rounded-lg mr-3">
          <Icon name="Settings" size={20} className="text-success-600 dark:text-success-500" />
        </div>
        <h2 className="text-2xl font-bold text-text-primary dark:text-text-primary">Publishing Options</h2>
      </div>

      <div className="space-y-6">
        {/* Workflow Status */}
        <div>
          <label className="block text-sm font-semibold text-text-secondary dark:text-text-secondary mb-3">
            Workflow Status <span className="text-secondary-600 font-normal dark:text-muted">(optional)</span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {workflowStages.map(stage => {
              const colors = workflowColorMap[stage.color] || workflowColorMap.accent;
              return (
              <button
                key={stage.id}
                type="button"
                onClick={() => handlePublishingStatusChange(stage.id)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  formData?.publishingStatus === stage.id
                    ? `${colors.border} ${colors.bg}`
                    : 'border-secondary-200 hover:border-secondary-300'
                }`}
              >
                <div className="flex flex-col items-center">
                  <div className={`p-2 rounded-full mb-2 ${colors.iconBg}`}>
                    <Icon 
                      name={stage.icon} 
                      size={16} 
                      className={colors.iconText}
                    />
                  </div>
                  <span className="text-sm font-medium text-text-primary dark:text-text-primary">{stage.label}</span>
                </div>
              </button>
              );
            })}
          </div>
        </div>

        {/* Visibility Settings */}
        <div>
          <label className="block text-sm font-semibold text-text-secondary dark:text-text-secondary mb-3">
            Visibility Settings <span className="text-secondary-600 font-normal dark:text-muted">(optional, defaults to Public)</span>
          </label>
          <div className="space-y-3">
            {visibilityOptions.map(option => (
              <label key={option.value} className="flex items-center p-3 border border-secondary-200 rounded-lg hover:bg-secondary-50 cursor-pointer transition-colors dark:border-border dark:hover:bg-surface-elevated">
                <input
                  type="radio"
                  name="visibility"
                  value={option.value}
                  checked={formData?.visibility === option.value}
                  onChange={(e) => setFormData(prev => ({ ...prev, visibility: e.target.value }))}
                  className="mr-3 text-accent-600 focus:ring-accent-500 dark:text-accent-text"
                />
                <div className="flex items-center flex-1">
                  <div className="p-2 bg-accent-100 rounded-lg mr-3 dark:bg-accent-subtle">
                    <Icon name={option.icon} size={16} className="text-accent-600 dark:text-accent-text" />
                  </div>
                  <div>
                    <p className="font-medium text-text-primary dark:text-text-primary">{option.label}</p>
                    <p className="text-sm text-secondary-600 dark:text-text-secondary">{option.description}</p>
                  </div>
                </div>
              </label>
            ))}
          </div>
          
          {/* Password Field */}
          {formData?.visibility === 'password' && (
            <div className="mt-3">
              <input
                type="password"
                value={formData?.password || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors dark:border-border"
                placeholder="Enter password for protected access"
              />
            </div>
          )}
        </div>

        {/* Categories and Tags */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-text-secondary dark:text-text-secondary mb-2">
              Category *
            </label>
            <select
              value={formData?.category || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors dark:border-border"
            >
              <option value="">Select category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category} · {translateTerm(category, 'ar')}</option>
              ))}
            </select>
          </div>

          {/* Featured */}
          <div>
            <label className="block text-sm font-semibold text-text-secondary dark:text-text-secondary mb-2">
              Featured Project
            </label>
            <label className="flex items-center p-3 border border-secondary-200 rounded-lg cursor-pointer hover:bg-secondary-50 transition-colors dark:border-border dark:hover:bg-surface-elevated">
              <input
                type="checkbox"
                checked={formData?.featured || false}
                onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                className="mr-3 text-accent-600 focus:ring-accent-500 dark:text-accent-text"
              />
              <div className="flex items-center">
                <Icon name="Star" size={16} className="text-warning-500 mr-2" />
                <span className="text-text-secondary dark:text-text-secondary">Mark as featured project</span>
              </div>
            </label>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-semibold text-text-secondary dark:text-text-secondary mb-3">
            Tags <span className="font-normal text-secondary-600 dark:text-muted">(translated automatically on the Arabic site)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => {
              const isSelected = formData?.tags?.includes(tag) || false;
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                    isSelected
                      ? 'bg-accent-100 text-accent-800 border-accent-300 dark:bg-accent-subtle dark:text-accent-text dark:border-accent-fill/50' :'bg-white text-secondary-600 border-secondary-300 hover:border-secondary-400 dark:bg-surface-elevated dark:text-text-secondary dark:border-border'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* SEO Settings */}
        <div className="p-4 bg-secondary-50 rounded-lg dark:bg-surface">
          <h3 className="text-lg font-semibold text-text-primary dark:text-text-primary mb-4 flex items-center">
            <Icon name="Search" size={18} className="mr-2" />
            SEO Settings
          </h3>
          <div className="space-y-4">
            <BilingualField
              label="Meta Title"
              value={formData?.metaTitle}
              valueAr={formData?.meta_title_ar}
              onChange={(value) => setFormData(prev => ({ ...prev, metaTitle: value }))}
              onChangeAr={(value) => setFormData(prev => ({ ...prev, meta_title_ar: value }))}
              placeholder="Optimized title for search engines"
              placeholderAr="عنوان مخصص لمحركات البحث"
              maxLength={60}
            />
            <BilingualField
              label="Meta Description"
              multiline
              rows={3}
              value={formData?.metaDescription}
              valueAr={formData?.meta_description_ar}
              onChange={(value) => setFormData(prev => ({ ...prev, metaDescription: value }))}
              onChangeAr={(value) => setFormData(prev => ({ ...prev, meta_description_ar: value }))}
              placeholder="Brief description for search engine results"
              placeholderAr="وصف قصير يظهر في نتائج البحث"
              maxLength={160}
            />
          </div>
        </div>

        {/* Preview Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text-primary dark:text-text-primary flex items-center">
              <Icon name="Eye" size={18} className="mr-2" />
              Preview
            </h3>
            <div className="flex items-center space-x-2">
              {breakpoints.map(breakpoint => (
                <button
                  key={breakpoint.id}
                  type="button"
                  onClick={() => setPreviewMode(breakpoint.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    previewMode === breakpoint.id
                      ? 'bg-accent-100 text-accent-600 dark:bg-accent-subtle dark:text-accent-text' :'bg-secondary-100 text-secondary-600 hover:bg-secondary-200 dark:bg-surface-elevated dark:text-text-secondary dark:hover:bg-surface'
                  }`}
                  title={`${breakpoint.label} (${breakpoint.width})`}
                >
                  <Icon name={breakpoint.icon} size={16} />
                </button>
              ))}
            </div>
          </div>
          
          <div className="border border-secondary-200 rounded-lg p-4 bg-secondary-50 dark:border-border dark:bg-surface">
            <div className="flex items-center justify-center min-h-48">
              <div className="text-center">
                <Icon name="Monitor" size={48} className="text-secondary-400 mx-auto mb-4 dark:text-muted" />
                <p className="text-secondary-600 mb-2 dark:text-text-secondary">Preview Mode: {breakpoints.find(b => b.id === previewMode)?.label}</p>
                <p className="text-sm text-secondary-500 dark:text-muted">
                  This is where your project preview will appear
                </p>
                <button
                  type="button"
                  className="mt-4 px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors"
                >
                  Generate Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublishingOptions;