// src/pages/project-manager/components/VisualAssets.jsx
import React, { useState, useCallback } from 'react';
import Icon from 'components/AppIcon';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const DropZone = ({ zone, title, description, accept, maxFiles = 5, formData, setFormData }) => {
  const images = formData?.[zone] || [];

  const handleFiles = useCallback((files) => {
    const fileArray = Array.from(files);
    const remainingSlots = maxFiles - images.length;
    
    if (remainingSlots <= 0) {
      alert(`Maximum ${maxFiles} files allowed for ${title}.`);
      return;
    }

    const validFiles = fileArray.filter(file => {
      if (!file.type.startsWith('image/')) {
        return false;
      }
      if (file.size > MAX_FILE_SIZE) {
        return false;
      }
      return true;
    }).slice(0, remainingSlots);

    if (validFiles.length === 0) return;

    const newImages = validFiles.map(file => ({
      id: `${zone}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: file.name,
      size: file.size,
      type: file.type,
      preview: URL.createObjectURL(file),
      file: file,
      status: 'pending'
    }));

    setFormData(prev => ({
      ...prev,
      [zone]: prev?.[zone] ? [...prev[zone], ...newImages] : newImages
    }));
  }, [zone, images.length, maxFiles, title, setFormData]);

  const handleInputChange = useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
    e.target.value = '';
  }, [handleFiles]);

  const removeImage = useCallback((imageId) => {
    setFormData(prev => {
      const imgs = prev?.[zone] || [];
      const img = imgs.find(i => i.id === imageId);
      if (img?.preview) URL.revokeObjectURL(img.preview);
      return { ...prev, [zone]: imgs.filter(i => i.id !== imageId) };
    });
  }, [zone, setFormData]);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-secondary-800 dark:text-secondary-200 mb-3">{title}</h3>
      <div
        className="border-2 border-dashed border-secondary-300 dark:border-primary-700 hover:border-secondary-400 rounded-xl p-6 transition-all duration-200"
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-secondary-100 dark:bg-primary-800">
            <Icon name="Upload" size={24} className="text-secondary-600" />
          </div>
          <p className="text-secondary-700 dark:text-secondary-300 mb-2">{description}</p>
          <p className="text-sm text-secondary-500 mb-4">
            Drag and drop files here, or{' '}
            <span 
              className="text-accent-600 cursor-pointer hover:text-accent-700"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = accept;
                input.multiple = true;
                input.onchange = (ev) => {
                  if (ev.target.files) handleFiles(ev.target.files);
                };
                input.click();
              }}
            >
              browse
            </span>
          </p>
          <p className="text-xs text-secondary-400">
            Supports JPG, PNG, WebP up to 10MB each ({images.length}/{maxFiles} files)
          </p>
        </div>
      </div>

      {images.length > 0 && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, idx) => (
            <div key={image.id || `img-${idx}`} className="relative group">
              <div className="aspect-square bg-secondary-100 dark:bg-primary-800 rounded-lg overflow-hidden">
                {image.preview ? (
                  <img src={image.preview} alt={image.name} className="w-full h-full object-cover" />
                ) : image.url ? (
                  <img src={image.url} alt={image.name} className="w-full h-full object-cover" />
                ) : null}
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeImage(image.id);
                }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-error-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
                aria-label={`Remove ${image.name}`}
              >
                <Icon name="X" size={12} />
              </button>
              <div className="mt-2">
                <p className="text-xs text-secondary-600 dark:text-secondary-400 truncate">{image.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const VisualAssets = ({ formData, setFormData }) => {
  return (
    <div className="bg-white dark:bg-surface rounded-xl shadow-md p-6 mb-6">
      <div className="flex items-center mb-6">
        <div className="p-2 bg-cta-100 dark:bg-cta-900/30 rounded-lg mr-3">
          <Icon name="Image" size={20} className="text-cta-600" />
        </div>
        <h2 className="text-2xl font-bold text-primary-800 dark:text-primary-200">Visual Assets</h2>
      </div>

      <div className="space-y-6">
        <DropZone zone="heroImages" title="Hero Images" description="Main project showcase images" accept="image/*" maxFiles={3} formData={formData} setFormData={setFormData} />
        <DropZone zone="screenshots" title="Screenshots" description="Application screenshots showing key features" accept="image/*" maxFiles={8} formData={formData} setFormData={setFormData} />
        <DropZone zone="mockups" title="Mockups & Designs" description="Design mockups, wireframes, and visual prototypes" accept="image/*" maxFiles={5} formData={formData} setFormData={setFormData} />
        <DropZone zone="beforeAfter" title="Before/After" description="Images showing the improvement achieved" accept="image/*" maxFiles={4} formData={formData} setFormData={setFormData} />
      </div>

      <div className="mt-6 p-4 bg-secondary-50 dark:bg-primary-900/20 rounded-lg">
        <div className="flex items-center mb-3">
          <Icon name="Settings" size={16} className="text-secondary-600 mr-2" />
          <h4 className="text-sm font-semibold text-secondary-700 dark:text-secondary-300">Optimization Settings</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="flex items-center">
            <input type="checkbox" checked={formData?.autoOptimize ?? true} onChange={(e) => setFormData(prev => ({ ...prev, autoOptimize: e.target.checked }))} className="mr-2 text-accent-600 focus:ring-accent-500" />
            <span className="text-sm text-secondary-700 dark:text-secondary-300">Auto-optimize images</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" checked={formData?.generateWebP ?? true} onChange={(e) => setFormData(prev => ({ ...prev, generateWebP: e.target.checked }))} className="mr-2 text-accent-600 focus:ring-accent-500" />
            <span className="text-sm text-secondary-700 dark:text-secondary-300">Generate WebP format</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" checked={formData?.responsiveImages ?? true} onChange={(e) => setFormData(prev => ({ ...prev, responsiveImages: e.target.checked }))} className="mr-2 text-accent-600 focus:ring-accent-500" />
            <span className="text-sm text-secondary-700 dark:text-secondary-300">Create responsive sizes</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default VisualAssets;