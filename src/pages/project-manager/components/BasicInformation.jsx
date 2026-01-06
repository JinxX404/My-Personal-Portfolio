// src/pages/project-manager/components/BasicInformation.jsx
import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const BasicInformation = ({ formData, setFormData }) => {
  const [characterCounts, setCharacterCounts] = useState({
    title: formData?.title?.length || 0,
    description: formData?.description?.length || 0
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'title' || field === 'description') {
      setCharacterCounts(prev => ({ ...prev, [field]: value.length }));
    }
  };

  const projectTypes = [
    'Web Application',
    'Mobile App',
    'Desktop Software',
    'API Development',
    'UI/UX Design',
    'E-commerce',
    'Other'
  ];

  const statusOptions = [
    { value: 'completed', label: 'Completed', color: 'success' },
    { value: 'in-progress', label: 'In Progress', color: 'warning' },
    { value: 'planned', label: 'Planned', color: 'accent' },
    { value: 'on-hold', label: 'On Hold', color: 'secondary' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <div className="flex items-center mb-6">
        <div className="p-2 bg-accent-100 rounded-lg mr-3">
          <Icon name="Info" size={20} className="text-accent-600" />
        </div>
        <h2 className="text-2xl font-bold text-primary-800">Basic Information</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Project Title */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-secondary-700 mb-2">
            Project Title *
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData?.title || ''}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors"
              placeholder="Enter project title"
              maxLength={100}
            />
            <div className="absolute right-3 top-3 text-xs text-secondary-500">
              {characterCounts.title}/100
            </div>
          </div>
        </div>

        {/* Client */}
        <div>
          <label className="block text-sm font-semibold text-secondary-700 mb-2">
            Client/Company
          </label>
          <input
            type="text"
            value={formData?.client || ''}
            onChange={(e) => handleInputChange('client', e.target.value)}
            className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors"
            placeholder="Client or company name"
          />
        </div>

        {/* Project Type */}
        <div>
          <label className="block text-sm font-semibold text-secondary-700 mb-2">
            Project Type <span className="text-secondary-400 font-normal">(optional)</span>
          </label>
          <select
            value={formData?.projectType || ''}
            onChange={(e) => handleInputChange('projectType', e.target.value)}
            className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors"
          >
            <option value="">Select project type</option>
            {projectTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-sm font-semibold text-secondary-700 mb-2">
            Start Date
          </label>
          <input
            type="date"
            value={formData?.startDate || ''}
            onChange={(e) => handleInputChange('startDate', e.target.value)}
            className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors"
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block text-sm font-semibold text-secondary-700 mb-2">
            End Date
          </label>
          <input
            type="date"
            value={formData?.endDate || ''}
            onChange={(e) => handleInputChange('endDate', e.target.value)}
            className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors"
          />
        </div>

        {/* Project Status */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-secondary-700 mb-2">
            Project Status <span className="text-secondary-400 font-normal">(optional)</span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {statusOptions.map(status => (
              <button
                key={status.value}
                type="button"
                onClick={() => handleInputChange('status', status.value)}
                className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                  formData?.status === status.value
                    ? `border-${status.color}-500 bg-${status.color}-50`
                    : 'border-secondary-200 hover:border-secondary-300'
                }`}
              >
                <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${
                  status.color === 'success' ? 'bg-success-500' :
                  status.color === 'warning' ? 'bg-warning-500' :
                  status.color === 'accent'? 'bg-accent-500' : 'bg-secondary-500'
                }`}></div>
                <span className="text-sm font-medium text-secondary-700">{status.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-secondary-700 mb-2">
            Project Description *
          </label>
          <div className="relative">
            <textarea
              value={formData?.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors resize-none"
              rows={4}
              placeholder="Brief description of the project..."
              maxLength={500}
            />
            <div className="absolute right-3 bottom-3 text-xs text-secondary-500">
              {characterCounts.description}/500
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInformation;