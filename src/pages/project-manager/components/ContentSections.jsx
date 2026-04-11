// src/pages/project-manager/components/ContentSections.jsx
import React from 'react';
import Icon from 'components/AppIcon';

const ContentSections = ({ formData, setFormData }) => {
  const sections = formData?.content_sections || [];

  const handleAddSection = () => {
    const newSection = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      title: '',
      content: ''
    };
    setFormData(prev => ({
      ...prev,
      content_sections: [...(prev.content_sections || []), newSection]
    }));
  };

  const handleUpdateSection = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      content_sections: (prev.content_sections || []).map(section =>
        section.id === id ? { ...section, [field]: value } : section
      )
    }));
  };

  const handleDeleteSection = (id) => {
    setFormData(prev => ({
      ...prev,
      content_sections: (prev.content_sections || []).filter(section => section.id !== id)
    }));
  };

  const handleMoveSection = (id, direction) => {
    const currentSections = formData?.content_sections || [];
    const index = currentSections.findIndex(s => s.id === id);
    if (index === -1) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= currentSections.length) return;

    const newSections = [...currentSections];
    [newSections[index], newSections[newIndex]] = [newSections[newIndex], newSections[index]];
    
    setFormData(prev => ({ ...prev, content_sections: newSections }));
  };

  return (
    <div className="bg-surface dark:bg-surface rounded-xl shadow-md p-6 mb-6 border border-border dark:border-border-strong">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="p-2 bg-accent-100 dark:bg-accent-50 rounded-lg mr-3">
            <Icon name="FileText" size={20} className="text-accent-600 dark:text-accent-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-text-primary dark:text-primary-800">Content Sections</h2>
            <p className="text-sm text-text-secondary dark:text-text-secondary mt-1">
              Add custom sections to showcase your project details
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleAddSection}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-accent-600 hover:bg-accent-700 text-white rounded-lg transition-colors"
        >
          <Icon name="Plus" size={18} />
          <span>Add Section</span>
        </button>
      </div>

      {sections.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-secondary-300 dark:border-secondary-700 rounded-lg">
          <Icon name="LayoutList" size={48} className="mx-auto text-secondary-400 mb-4" />
          <p className="text-text-secondary dark:text-text-secondary mb-4">
            No content sections yet. Add sections to describe your project in detail.
          </p>
          <button
            type="button"
            onClick={handleAddSection}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-accent-600 hover:bg-accent-700 text-white rounded-lg transition-colors"
          >
            <Icon name="Plus" size={18} />
            <span>Add First Section</span>
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {sections.map((section, index) => (
            <div
              key={section.id}
              className="bg-secondary-50 dark:bg-primary-900/20 rounded-lg p-4 border border-secondary-200 dark:border-primary-800"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-secondary-500 dark:text-secondary-400">
                    Section {index + 1}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => handleMoveSection(section.id, 'up')}
                    disabled={index === 0}
                    className="p-2 hover:bg-secondary-200 dark:hover:bg-primary-800 rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move up"
                  >
                    <Icon name="ChevronUp" size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveSection(section.id, 'down')}
                    disabled={index === sections.length - 1}
                    className="p-2 hover:bg-secondary-200 dark:hover:bg-primary-800 rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move down"
                  >
                    <Icon name="ChevronDown" size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteSection(section.id)}
                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-md transition-colors"
                    title="Delete section"
                  >
                    <Icon name="Trash2" size={16} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-1">
                  <label className="block text-sm font-semibold text-text-secondary dark:text-text-secondary mb-2">
                    Section Title
                  </label>
                  <input
                    type="text"
                    value={section.title || ''}
                    onChange={(e) => handleUpdateSection(section.id, 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors dark:bg-primary-900 dark:border-primary-700 dark:text-white"
                    placeholder="e.g., Overview"
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="block text-sm font-semibold text-text-secondary dark:text-text-secondary mb-2">
                    Content
                  </label>
                  <textarea
                    value={section.content || ''}
                    onChange={(e) => handleUpdateSection(section.id, 'content', e.target.value)}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors resize-none dark:bg-primary-900 dark:border-primary-700 dark:text-white"
                    rows={4}
                    placeholder="Write your section content here..."
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContentSections;
