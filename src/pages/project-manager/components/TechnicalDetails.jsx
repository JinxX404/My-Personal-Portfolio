// src/pages/project-manager/components/TechnicalDetails.jsx
import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const TechnicalDetails = ({ formData, setFormData }) => {
  const [newTag, setNewTag] = useState('');
  const [newMetric, setNewMetric] = useState({ name: '', value: '', unit: '' });

  const technologies = formData?.technologies || [];
  const metrics = formData?.metrics || [];

  const commonTechnologies = [
    'React', 'JavaScript', 'TypeScript', 'Node.js', 'Python', 'Java',
    'HTML', 'CSS', 'Tailwind CSS', 'Bootstrap', 'Vue.js', 'Angular',
    'Express.js', 'MongoDB', 'PostgreSQL', 'MySQL', 'Firebase',
    'AWS', 'Docker', 'Kubernetes', 'Git', 'Jenkins', 'Redis'
  ];

  const metricUnits = ['ms', 'seconds', '%', 'MB', 'GB', 'requests/sec', 'users', 'score'];

  const addTechnology = (tech) => {
    if (tech && !technologies.includes(tech)) {
      setFormData(prev => ({
        ...prev,
        technologies: [...technologies, tech]
      }));
    }
    setNewTag('');
  };

  const removeTechnology = (tech) => {
    setFormData(prev => ({
      ...prev,
      technologies: technologies.filter(t => t !== tech)
    }));
  };

  const addMetric = () => {
    if (newMetric.name && newMetric.value) {
      setFormData(prev => ({
        ...prev,
        metrics: [...metrics, { ...newMetric, id: Date.now() }]
      }));
      setNewMetric({ name: '', value: '', unit: '' });
    }
  };

  const removeMetric = (metricId) => {
    setFormData(prev => ({
      ...prev,
      metrics: metrics.filter(m => m.id !== metricId)
    }));
  };

  const complexityLevels = [
    { value: 'low', label: 'Low', color: 'success', description: 'Simple implementation' },
    { value: 'medium', label: 'Medium', color: 'warning', description: 'Moderate complexity' },
    { value: 'high', label: 'High', color: 'error', description: 'Complex implementation' },
    { value: 'expert', label: 'Expert', color: 'primary', description: 'Highly complex/innovative' }
  ];

  const complexityColorMap = {
    success: { border: 'border-success-500 dark:border-success-fill', bg: 'bg-success-50 dark:bg-success-900/30', dot: 'bg-success-500 dark:bg-success-fill' },
    warning: { border: 'border-warning-500', bg: 'bg-warning-50 dark:bg-warning-900/40', dot: 'bg-warning-500' },
    error:   { border: 'border-error-500',   bg: 'bg-error-50 dark:bg-error-900/40',   dot: 'bg-error-500' },
    primary: { border: 'border-primary-500 dark:border-border-strong',  bg: 'bg-primary-50 dark:bg-surface-elevated',  dot: 'bg-primary-500' },
  };

  return (
    <div className="bg-surface dark:bg-surface rounded-xl shadow-md p-6 mb-6 border border-border dark:border-border-strong">
      <div className="flex items-center mb-6">
        <div className="p-2 bg-success-100 dark:bg-success-900/30 rounded-lg mr-3">
          <Icon name="Code" size={20} className="text-success-600 dark:text-success-500" />
        </div>
        <h2 className="text-2xl font-bold text-text-primary dark:text-text-primary">Technical Details</h2>
      </div>

      <div className="space-y-6">
        {/* Technologies Used */}
        <div>
          <label className="block text-sm font-semibold text-text-secondary dark:text-text-secondary mb-3">
            Technologies Used *
          </label>
          
          {/* Tag Input */}
          <div className="flex flex-wrap gap-2 mb-4">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTechnology(newTag);
                }
              }}
              className="flex-1 min-w-48 px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors dark:border-border"
              placeholder="Type technology name and press Enter"
            />
            <button
              type="button"
              onClick={() => addTechnology(newTag)}
              className="px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors"
            >
              Add
            </button>
          </div>

          {/* Common Technologies */}
          <div className="mb-4">
            <p className="text-sm text-secondary-600 mb-2 dark:text-text-secondary">Common technologies:</p>
            <div className="flex flex-wrap gap-2">
              {commonTechnologies.map(tech => (
                <button
                  key={tech}
                  type="button"
                  onClick={() => addTechnology(tech)}
                  disabled={technologies.includes(tech)}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                    technologies.includes(tech)
                      ? 'bg-secondary-100 text-secondary-600 border-secondary-200 cursor-not-allowed dark:bg-surface dark:text-muted dark:border-border' :'bg-white text-accent-600 border-accent-200 hover:bg-accent-50 dark:bg-surface-elevated dark:text-accent-text dark:border-border dark:hover:bg-accent-subtle'
                  }`}
                >
                  {tech}
                </button>
              ))}
            </div>
          </div>

          {/* Selected Technologies */}
          {technologies.length > 0 && (
            <div>
              <p className="text-sm text-secondary-600 mb-2 dark:text-text-secondary">Selected technologies:</p>
              <div className="flex flex-wrap gap-2">
                {technologies.map(tech => (
                  <span
                    key={tech}
                    className="inline-flex items-center px-3 py-1 bg-accent-100 text-accent-800 rounded-full text-sm dark:bg-accent-subtle dark:text-accent-text"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => removeTechnology(tech)}
                      className="ml-2 text-accent-600 hover:text-accent-800 dark:text-accent-text"
                    >
                      <Icon name="X" size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Project Complexity */}
        <div>
          <label className="block text-sm font-semibold text-text-secondary dark:text-text-secondary mb-3">
            Project Complexity *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {complexityLevels.map(level => {
              const colors = complexityColorMap[level.color] || complexityColorMap.primary;
              return (
              <button
                key={level.value}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, complexity: level.value }))}
                className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                  formData?.complexity === level.value
                    ? `${colors.border} ${colors.bg}`
                    : 'border-secondary-200 hover:border-secondary-300'
                }`}
              >
                <div className={`w-4 h-4 rounded-full mb-2 ${colors.dot}`}></div>
                <p className="font-semibold text-text-primary dark:text-text-primary mb-1">{level.label}</p>
                <p className="text-xs text-secondary-600 dark:text-text-secondary">{level.description}</p>
              </button>
              );
            })}
          </div>
        </div>

        {/* Performance Metrics */}
        <div>
          <label className="block text-sm font-semibold text-text-secondary dark:text-text-secondary mb-3">
            Performance Metrics
          </label>
          
          {/* Add Metric Form */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
            <input
              type="text"
              value={newMetric.name}
              onChange={(e) => setNewMetric(prev => ({ ...prev, name: e.target.value }))}
              className="px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors dark:border-border"
              placeholder="Metric name"
            />
            <input
              type="text"
              value={newMetric.value}
              onChange={(e) => setNewMetric(prev => ({ ...prev, value: e.target.value }))}
              className="px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors dark:border-border"
              placeholder="Value"
            />
            <select
              value={newMetric.unit}
              onChange={(e) => setNewMetric(prev => ({ ...prev, unit: e.target.value }))}
              className="px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors dark:border-border"
            >
              <option value="">Select unit</option>
              {metricUnits.map(unit => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={addMetric}
              className="px-4 py-2 bg-success-700 text-white rounded-lg hover:bg-success-800 transition-colors"
            >
              Add Metric
            </button>
          </div>

          {/* Metrics List */}
          {metrics.length > 0 && (
            <div className="space-y-2">
              {metrics.map(metric => (
                <div key={metric.id} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg dark:bg-surface">
                  <div>
                    <span className="font-medium text-text-primary dark:text-text-primary">{metric.name}:</span>
                    <span className="ml-2 text-text-secondary dark:text-text-secondary">{metric.value}</span>
                    {metric.unit && <span className="ml-1 text-secondary-600 dark:text-text-secondary">{metric.unit}</span>}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeMetric(metric.id)}
                    className="text-error-600 hover:text-error-800 transition-colors dark:text-error"
                  >
                    <Icon name="Trash2" size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Additional Technical Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Repository URL */}
          <div>
            <label className="block text-sm font-semibold text-text-secondary dark:text-text-secondary mb-2">
              Repository URL
            </label>
            <input
              type="url"
              value={formData?.repositoryUrl || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, repositoryUrl: e.target.value }))}
              className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors dark:border-border"
              placeholder="https://github.com/username/repository"
            />
          </div>

          {/* Live Demo URL */}
          <div>
            <label className="block text-sm font-semibold text-text-secondary dark:text-text-secondary mb-2">
              Live Demo URL
            </label>
            <input
              type="url"
              value={formData?.demoUrl || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, demoUrl: e.target.value }))}
              className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors dark:border-border"
              placeholder="https://example.com/demo"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicalDetails;