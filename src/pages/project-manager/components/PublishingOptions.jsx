// src/pages/project-manager/components/PublishingOptions.jsx
import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const PublishingOptions = ({ formData, setFormData }) => {
  const [previewMode, setPreviewMode] = useState('desktop');

  const workflowStages = [
    { id: 'draft', label: 'Draft', icon: 'Edit3', color: 'secondary' },
    { id: 'review', label: 'Review', icon: 'Eye', color: 'warning' },
    { id: 'approved', label: 'Approved', icon: 'CheckCircle', color: 'success' },
    { id: 'published', label: 'Published', icon: 'Globe', color: 'accent' }
  ];

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
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <div className="flex items-center mb-6">
        <div className="p-2 bg-success-100 rounded-lg mr-3">
          <Icon name="Settings" size={20} className="text-success-600" />
        </div>
        <h2 className="text-2xl font-bold text-primary-800">Publishing Options</h2>
      </div>

      <div className="space-y-6">
        {/* Workflow Status */}
        <div>
          <label className="block text-sm font-semibold text-secondary-700 mb-3">
            Workflow Status <span className="text-secondary-400 font-normal">(optional)</span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {workflowStages.map(stage => (
              <button
                key={stage.id}
                type="button"
                onClick={() => handlePublishingStatusChange(stage.id)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  formData?.publishingStatus === stage.id
                    ? `border-${stage.color}-500 bg-${stage.color}-50`
                    : 'border-secondary-200 hover:border-secondary-300'
                }`}
              >
                <div className="flex flex-col items-center">
                  <div className={`p-2 rounded-full mb-2 ${
                    stage.color === 'secondary' ? 'bg-secondary-100' :
                    stage.color === 'warning' ? 'bg-warning-100' :
                    stage.color === 'success'? 'bg-success-100' : 'bg-accent-100'
                  }`}>
                    <Icon 
                      name={stage.icon} 
                      size={16} 
                      className={`${
                        stage.color === 'secondary' ? 'text-secondary-600' :
                        stage.color === 'warning' ? 'text-warning-600' :
                        stage.color === 'success'? 'text-success-600' : 'text-accent-600'
                      }`}
                    />
                  </div>
                  <span className="text-sm font-medium text-secondary-800">{stage.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Visibility Settings */}
        <div>
          <label className="block text-sm font-semibold text-secondary-700 mb-3">
            Visibility Settings <span className="text-secondary-400 font-normal">(optional, defaults to Public)</span>
          </label>
          <div className="space-y-3">
            {visibilityOptions.map(option => (
              <label key={option.value} className="flex items-center p-3 border border-secondary-200 rounded-lg hover:bg-secondary-50 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="visibility"
                  value={option.value}
                  checked={formData?.visibility === option.value}
                  onChange={(e) => setFormData(prev => ({ ...prev, visibility: e.target.value }))}
                  className="mr-3 text-accent-600 focus:ring-accent-500"
                />
                <div className="flex items-center flex-1">
                  <div className="p-2 bg-accent-100 rounded-lg mr-3">
                    <Icon name={option.icon} size={16} className="text-accent-600" />
                  </div>
                  <div>
                    <p className="font-medium text-secondary-800">{option.label}</p>
                    <p className="text-sm text-secondary-600">{option.description}</p>
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
                className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors"
                placeholder="Enter password for protected access"
              />
            </div>
          )}
        </div>

        {/* Categories and Tags */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-secondary-700 mb-2">
              Category *
            </label>
            <select
              value={formData?.category || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors"
            >
              <option value="">Select category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Featured */}
          <div>
            <label className="block text-sm font-semibold text-secondary-700 mb-2">
              Featured Project
            </label>
            <label className="flex items-center p-3 border border-secondary-200 rounded-lg cursor-pointer hover:bg-secondary-50 transition-colors">
              <input
                type="checkbox"
                checked={formData?.featured || false}
                onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                className="mr-3 text-accent-600 focus:ring-accent-500"
              />
              <div className="flex items-center">
                <Icon name="Star" size={16} className="text-warning-500 mr-2" />
                <span className="text-secondary-700">Mark as featured project</span>
              </div>
            </label>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-semibold text-secondary-700 mb-3">
            Tags
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
                      ? 'bg-accent-100 text-accent-800 border-accent-300' :'bg-white text-secondary-600 border-secondary-300 hover:border-secondary-400'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* SEO Settings */}
        <div className="p-4 bg-secondary-50 rounded-lg">
          <h3 className="text-lg font-semibold text-secondary-800 mb-4 flex items-center">
            <Icon name="Search" size={18} className="mr-2" />
            SEO Settings
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-secondary-700 mb-2">
                Meta Title
              </label>
              <input
                type="text"
                value={formData?.metaTitle || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors"
                placeholder="Optimized title for search engines"
                maxLength={60}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-secondary-700 mb-2">
                Meta Description
              </label>
              <textarea
                value={formData?.metaDescription || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors resize-none"
                rows={3}
                placeholder="Brief description for search engine results"
                maxLength={160}
              />
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-secondary-800 flex items-center">
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
                      ? 'bg-accent-100 text-accent-600' :'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
                  }`}
                  title={`${breakpoint.label} (${breakpoint.width})`}
                >
                  <Icon name={breakpoint.icon} size={16} />
                </button>
              ))}
            </div>
          </div>
          
          <div className="border border-secondary-200 rounded-lg p-4 bg-secondary-50">
            <div className="flex items-center justify-center min-h-48">
              <div className="text-center">
                <Icon name="Monitor" size={48} className="text-secondary-400 mx-auto mb-4" />
                <p className="text-secondary-600 mb-2">Preview Mode: {breakpoints.find(b => b.id === previewMode)?.label}</p>
                <p className="text-sm text-secondary-500">
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

        {/* Bulk Operations */}
        <div className="p-4 bg-warning-50 border border-warning-200 rounded-lg">
          <h3 className="text-lg font-semibold text-warning-800 mb-3 flex items-center">
            <Icon name="Layers" size={18} className="mr-2" />
            Bulk Operations
          </h3>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="px-4 py-2 bg-warning-600 text-white rounded-lg hover:bg-warning-700 transition-colors flex items-center"
            >
              <Icon name="Copy" size={16} className="mr-2" />
              Duplicate Project
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors flex items-center"
            >
              <Icon name="Archive" size={16} className="mr-2" />
              Archive Project
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors flex items-center"
            >
              <Icon name="Download" size={16} className="mr-2" />
              Export Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublishingOptions;