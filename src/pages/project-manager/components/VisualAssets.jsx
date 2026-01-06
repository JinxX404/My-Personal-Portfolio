// src/pages/project-manager/components/VisualAssets.jsx
import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const VisualAssets = ({ formData, setFormData }) => {
  const [dragActive, setDragActive] = useState(false);
  const [activeDropZone, setActiveDropZone] = useState(null);

  const handleDrag = (e, zone) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
      setActiveDropZone(zone);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
      setActiveDropZone(null);
    }
  };

  const handleDrop = (e, zone) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setActiveDropZone(null);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files, zone);
    }
  };

  const handleFiles = (files, zone) => {
    const file = files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage = {
          id: Date.now(),
          file: file,
          preview: e.target.result,
          name: file.name,
          size: file.size,
          type: file.type
        };
        
        setFormData(prev => ({
          ...prev,
          [zone]: prev?.[zone] ? [...prev[zone], newImage] : [newImage]
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (zone, imageId) => {
    setFormData(prev => ({
      ...prev,
      [zone]: prev?.[zone]?.filter(img => img.id !== imageId) || []
    }));
  };

  const DropZone = ({ zone, title, description, accept, maxFiles = 5 }) => {
    const images = formData?.[zone] || [];
    const isActive = activeDropZone === zone && dragActive;
    
    return (
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-secondary-800 mb-3">{title}</h3>
        
        <div
          className={`border-2 border-dashed rounded-xl p-6 transition-all duration-200 ${
            isActive 
              ? 'border-accent-500 bg-accent-50' :'border-secondary-300 hover:border-secondary-400'
          }`}
          onDragEnter={(e) => handleDrag(e, zone)}
          onDragLeave={(e) => handleDrag(e, zone)}
          onDragOver={(e) => handleDrag(e, zone)}
          onDrop={(e) => handleDrop(e, zone)}
        >
          <div className="text-center">
            <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
              isActive ? 'bg-accent-100' : 'bg-secondary-100'
            }`}>
              <Icon 
                name="Upload" 
                size={24} 
                className={isActive ? 'text-accent-600' : 'text-secondary-600'} 
              />
            </div>
            <p className="text-secondary-700 mb-2">{description}</p>
            <p className="text-sm text-secondary-500 mb-4">
              Drag and drop files here, or{' '}
              <label className="text-accent-600 cursor-pointer hover:text-accent-700">
                browse
                <input
                  type="file"
                  multiple
                  accept={accept}
                  className="hidden"
                  onChange={(e) => handleFiles(e.target.files, zone)}
                />
              </label>
            </p>
            <p className="text-xs text-secondary-400">
              Supports JPG, PNG, WebP up to 10MB each (max {maxFiles} files)
            </p>
          </div>
        </div>

        {/* Image Preview Grid */}
        {images.length > 0 && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map(image => (
              <div key={image.id} className="relative group">
                <div className="aspect-square bg-secondary-100 rounded-lg overflow-hidden">
                  <img
                    src={image.preview}
                    alt={image.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={() => removeImage(zone, image.id)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-error-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
                >
                  <Icon name="X" size={12} />
                </button>
                <div className="mt-2">
                  <p className="text-xs text-secondary-600 truncate">{image.name}</p>
                  <p className="text-xs text-secondary-400">
                    {(image.size / 1024 / 1024).toFixed(1)} MB
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <div className="flex items-center mb-6">
        <div className="p-2 bg-cta-100 rounded-lg mr-3">
          <Icon name="Image" size={20} className="text-cta-600" />
        </div>
        <h2 className="text-2xl font-bold text-primary-800">Visual Assets</h2>
      </div>

      <div className="space-y-6">
        <DropZone
          zone="heroImages"
          title="Hero Images"
          description="Main project showcase images that will be featured prominently"
          accept="image/*"
          maxFiles={3}
        />

        <DropZone
          zone="screenshots"
          title="Screenshots"
          description="Application screenshots showing key features and functionality"
          accept="image/*"
          maxFiles={8}
        />

        <DropZone
          zone="mockups"
          title="Mockups & Designs"
          description="Design mockups, wireframes, and visual prototypes"
          accept="image/*"
          maxFiles={5}
        />

        <DropZone
          zone="beforeAfter"
          title="Before/After Comparisons"
          description="Images showing the improvement or transformation achieved"
          accept="image/*"
          maxFiles={4}
        />
      </div>

      {/* Image Optimization Settings */}
      <div className="mt-6 p-4 bg-secondary-50 rounded-lg">
        <div className="flex items-center mb-3">
          <Icon name="Settings" size={16} className="text-secondary-600 mr-2" />
          <h4 className="text-sm font-semibold text-secondary-700">Optimization Settings</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData?.autoOptimize ?? true}
              onChange={(e) => setFormData(prev => ({ ...prev, autoOptimize: e.target.checked }))}
              className="mr-2 text-accent-600 focus:ring-accent-500"
            />
            <span className="text-sm text-secondary-700">Auto-optimize images</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData?.generateWebP ?? true}
              onChange={(e) => setFormData(prev => ({ ...prev, generateWebP: e.target.checked }))}
              className="mr-2 text-accent-600 focus:ring-accent-500"
            />
            <span className="text-sm text-secondary-700">Generate WebP format</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData?.responsiveImages ?? true}
              onChange={(e) => setFormData(prev => ({ ...prev, responsiveImages: e.target.checked }))}
              className="mr-2 text-accent-600 focus:ring-accent-500"
            />
            <span className="text-sm text-secondary-700">Create responsive sizes</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default VisualAssets;