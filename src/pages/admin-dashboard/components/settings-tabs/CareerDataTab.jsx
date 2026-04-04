import React from 'react';
import Icon from 'components/AppIcon';

const CareerDataTab = ({ careerData, onChange }) => {
  const timeline = careerData?.timeline || [];
  const values = careerData?.values || [];
  const interests = careerData?.interests || [];

  const addTimelineItem = () => {
    onChange({
      ...careerData,
      timeline: [...timeline, { year: '', title: '', company: '', description: '' }]
    });
  };

  const updateTimelineItem = (index, field, value) => {
    const updated = [...timeline];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...careerData, timeline: updated });
  };

  const removeTimelineItem = (index) => {
    onChange({ ...careerData, timeline: timeline.filter((_, i) => i !== index) });
  };

  const addValue = () => {
    onChange({
      ...careerData,
      values: [...values, { title: '', description: '', icon: 'Heart' }]
    });
  };

  const updateValue = (index, field, value) => {
    const updated = [...values];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...careerData, values: updated });
  };

  const removeValue = (index) => {
    onChange({ ...careerData, values: values.filter((_, i) => i !== index) });
  };

  const addInterest = () => {
    onChange({
      ...careerData,
      interests: [...interests, { name: '', icon: 'Star' }]
    });
  };

  const updateInterest = (index, field, value) => {
    const updated = [...interests];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...careerData, interests: updated });
  };

  const removeInterest = (index) => {
    onChange({ ...careerData, interests: interests.filter((_, i) => i !== index) });
  };

  const iconOptions = ['Heart', 'Star', 'Lightbulb', 'Target', 'BookOpen', 'Code', 'Globe', 'Music', 'Camera', 'Gamepad2', 'Palette', 'Trophy'];

  return (
    <div className="space-y-8">
      {/* Philosophy */}
      <div>
        <h3 className="text-lg font-semibold text-primary-800 dark:text-primary-200 mb-4">Philosophy & Mission</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1">Philosophy</label>
            <textarea
              value={careerData?.philosophy || ''}
              onChange={(e) => onChange({ ...careerData, philosophy: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border border-primary-200 dark:border-primary-700 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent dark:bg-background dark:text-primary-200"
              placeholder="Your professional philosophy..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1">Mission</label>
            <textarea
              value={careerData?.mission || ''}
              onChange={(e) => onChange({ ...careerData, mission: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border border-primary-200 dark:border-primary-700 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent dark:bg-background dark:text-primary-200"
              placeholder="Your mission statement..."
            />
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-primary-800 dark:text-primary-200">Timeline</h3>
          <button onClick={addTimelineItem} className="text-sm text-accent hover:text-accent-700 flex items-center gap-1">
            <Icon name="Plus" size={16} /> Add Item
          </button>
        </div>
        <div className="space-y-4">
          {timeline.map((item, index) => (
            <div key={index} className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-primary-700 dark:text-primary-300">Item #{index + 1}</span>
                <button onClick={() => removeTimelineItem(index)} className="text-error-500 hover:text-error-700" aria-label="Remove timeline item">
                  <Icon name="Trash2" size={16} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  value={item.year}
                  onChange={(e) => updateTimelineItem(index, 'year', e.target.value)}
                  placeholder="Year (e.g., 2024)"
                  className="px-3 py-2 border border-primary-200 dark:border-primary-700 rounded-lg text-sm dark:bg-background dark:text-primary-200"
                />
                <input
                  value={item.title}
                  onChange={(e) => updateTimelineItem(index, 'title', e.target.value)}
                  placeholder="Title"
                  className="px-3 py-2 border border-primary-200 dark:border-primary-700 rounded-lg text-sm dark:bg-background dark:text-primary-200"
                />
              </div>
              <input
                value={item.company}
                onChange={(e) => updateTimelineItem(index, 'company', e.target.value)}
                placeholder="Company / Organization"
                className="w-full px-3 py-2 border border-primary-200 dark:border-primary-700 rounded-lg text-sm dark:bg-background dark:text-primary-200"
              />
              <textarea
                value={item.description}
                onChange={(e) => updateTimelineItem(index, 'description', e.target.value)}
                placeholder="Description"
                rows={2}
                className="w-full px-3 py-2 border border-primary-200 dark:border-primary-700 rounded-lg text-sm dark:bg-background dark:text-primary-200"
              />
            </div>
          ))}
          {timeline.length === 0 && (
            <p className="text-sm text-secondary-500 text-center py-4">No timeline items yet. Click "Add Item" to start.</p>
          )}
        </div>
      </div>

      {/* Values */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-primary-800 dark:text-primary-200">Values</h3>
          <button onClick={addValue} className="text-sm text-accent hover:text-accent-700 flex items-center gap-1">
            <Icon name="Plus" size={16} /> Add Value
          </button>
        </div>
        <div className="space-y-4">
          {values.map((item, index) => (
            <div key={index} className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-primary-700 dark:text-primary-300">Value #{index + 1}</span>
                <button onClick={() => removeValue(index)} className="text-error-500 hover:text-error-700" aria-label="Remove value">
                  <Icon name="Trash2" size={16} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  value={item.title}
                  onChange={(e) => updateValue(index, 'title', e.target.value)}
                  placeholder="Title"
                  className="px-3 py-2 border border-primary-200 dark:border-primary-700 rounded-lg text-sm dark:bg-background dark:text-primary-200"
                />
                <select
                  value={item.icon}
                  onChange={(e) => updateValue(index, 'icon', e.target.value)}
                  className="px-3 py-2 border border-primary-200 dark:border-primary-700 rounded-lg text-sm dark:bg-background dark:text-primary-200"
                >
                  {iconOptions.map((icon) => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
              </div>
              <textarea
                value={item.description}
                onChange={(e) => updateValue(index, 'description', e.target.value)}
                placeholder="Description"
                rows={2}
                className="w-full px-3 py-2 border border-primary-200 dark:border-primary-700 rounded-lg text-sm dark:bg-background dark:text-primary-200"
              />
            </div>
          ))}
          {values.length === 0 && (
            <p className="text-sm text-secondary-500 text-center py-4">No values yet. Click "Add Value" to start.</p>
          )}
        </div>
      </div>

      {/* Interests */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-primary-800 dark:text-primary-200">Interests</h3>
          <button onClick={addInterest} className="text-sm text-accent hover:text-accent-700 flex items-center gap-1">
            <Icon name="Plus" size={16} /> Add Interest
          </button>
        </div>
        <div className="space-y-3">
          {interests.map((item, index) => (
            <div key={index} className="flex items-center gap-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg p-3">
              <select
                value={item.icon}
                onChange={(e) => updateInterest(index, 'icon', e.target.value)}
                className="px-3 py-2 border border-primary-200 dark:border-primary-700 rounded-lg text-sm dark:bg-background dark:text-primary-200"
              >
                {iconOptions.map((icon) => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
              <input
                value={item.name}
                onChange={(e) => updateInterest(index, 'name', e.target.value)}
                placeholder="Interest name"
                className="flex-1 px-3 py-2 border border-primary-200 dark:border-primary-700 rounded-lg text-sm dark:bg-background dark:text-primary-200"
              />
              <button onClick={() => removeInterest(index)} className="text-error-500 hover:text-error-700" aria-label="Remove interest">
                <Icon name="Trash2" size={16} />
              </button>
            </div>
          ))}
          {interests.length === 0 && (
            <p className="text-sm text-secondary-500 text-center py-4">No interests yet. Click "Add Interest" to start.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CareerDataTab;
