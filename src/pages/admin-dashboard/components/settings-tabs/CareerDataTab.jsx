import React from 'react';
import Icon from 'components/AppIcon';
import BilingualField from 'components/admin/BilingualField';

const CareerDataTab = ({ careerData, onChange }) => {
  const timeline = careerData?.timeline || [];
  const values = careerData?.values || [];
  const interests = careerData?.interests || [];

  const addTimelineItem = () => {
    onChange({
      ...careerData,
      timeline: [...timeline, { year: '', title: '', title_ar: '', company: '', company_ar: '', description: '', description_ar: '' }]
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
          <BilingualField
            label="Philosophy"
            multiline
            rows={4}
            value={careerData?.philosophy}
            valueAr={careerData?.philosophy_ar}
            onChange={(value) => onChange({ ...careerData, philosophy: value })}
            onChangeAr={(value) => onChange({ ...careerData, philosophy_ar: value })}
            placeholder="Your professional philosophy..."
            placeholderAr="فلسفتك في العمل"
          />
          <BilingualField
            label="Mission"
            multiline
            rows={3}
            value={careerData?.mission}
            valueAr={careerData?.mission_ar}
            onChange={(value) => onChange({ ...careerData, mission: value })}
            onChangeAr={(value) => onChange({ ...careerData, mission_ar: value })}
            placeholder="Your mission statement..."
            placeholderAr="رسالتك المهنية"
          />
        </div>
      </div>

      {/* Timeline */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-primary-800 dark:text-primary-200">Timeline</h3>
          <button onClick={addTimelineItem} className="text-sm text-accent hover:text-accent-700 flex items-center gap-1 dark:text-accent-text dark:hover:text-accent-text">
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
              <div>
                <label className="mb-2 block text-sm font-semibold text-text-secondary dark:text-text-secondary">Year</label>
                <input
                  value={item.year || ''}
                  onChange={(e) => updateTimelineItem(index, 'year', e.target.value)}
                  placeholder="Year (e.g., 2024)"
                  dir="ltr"
                  className="px-3 py-2 border border-primary-200 dark:border-primary-700 rounded-lg text-sm dark:bg-background dark:text-primary-200"
                />
              </div>
              <BilingualField
                label="Title"
                value={item.title}
                valueAr={item.title_ar}
                onChange={(value) => updateTimelineItem(index, 'title', value)}
                onChangeAr={(value) => updateTimelineItem(index, 'title_ar', value)}
                placeholder="Title"
                placeholderAr="المسمى أو الشهادة"
              />
              <BilingualField
                label="Company / Organization"
                value={item.company}
                valueAr={item.company_ar}
                onChange={(value) => updateTimelineItem(index, 'company', value)}
                onChangeAr={(value) => updateTimelineItem(index, 'company_ar', value)}
                placeholder="Company / Organization"
                placeholderAr="الجهة"
              />
              <BilingualField
                label="Description"
                multiline
                rows={3}
                value={item.description}
                valueAr={item.description_ar}
                onChange={(value) => updateTimelineItem(index, 'description', value)}
                onChangeAr={(value) => updateTimelineItem(index, 'description_ar', value)}
                placeholder="Description"
                placeholderAr="الوصف"
              />
            </div>
          ))}
          {timeline.length === 0 && (
            <p className="text-sm text-secondary-500 text-center py-4 dark:text-muted">No timeline items yet. Click "Add Item" to start.</p>
          )}
        </div>
      </div>

      {/* Values */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-primary-800 dark:text-primary-200">Values</h3>
          <button onClick={addValue} className="text-sm text-accent hover:text-accent-700 flex items-center gap-1 dark:text-accent-text dark:hover:text-accent-text">
            <Icon name="Plus" size={16} /> Add Value
          </button>
        </div>
        <div className="space-y-4">
          {values.map((item, index) => (
            <div key={index} className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-primary-700 dark:text-primary-300">Value #{index + 1}</span>
                <div className="flex items-center gap-3">
                  <select
                    value={item.icon}
                    onChange={(e) => updateValue(index, 'icon', e.target.value)}
                    aria-label="Icon"
                    className="px-3 py-2 border border-primary-200 dark:border-primary-700 rounded-lg text-sm dark:bg-background dark:text-primary-200"
                  >
                    {iconOptions.map((icon) => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                  <button onClick={() => removeValue(index)} className="text-error-500 hover:text-error-700" aria-label="Remove value">
                    <Icon name="Trash2" size={16} />
                  </button>
                </div>
              </div>
              <BilingualField
                label="Title"
                value={item.title}
                valueAr={item.title_ar}
                onChange={(value) => updateValue(index, 'title', value)}
                onChangeAr={(value) => updateValue(index, 'title_ar', value)}
                placeholder="Title"
                placeholderAr="العنوان"
              />
              <BilingualField
                label="Description"
                multiline
                rows={2}
                value={item.description}
                valueAr={item.description_ar}
                onChange={(value) => updateValue(index, 'description', value)}
                onChangeAr={(value) => updateValue(index, 'description_ar', value)}
                placeholder="Description"
                placeholderAr="الوصف"
              />
            </div>
          ))}
          {values.length === 0 && (
            <p className="text-sm text-secondary-500 text-center py-4 dark:text-muted">No values yet. Click "Add Value" to start.</p>
          )}
        </div>
      </div>

      {/* Interests */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-primary-800 dark:text-primary-200">Interests</h3>
          <button onClick={addInterest} className="text-sm text-accent hover:text-accent-700 flex items-center gap-1 dark:text-accent-text dark:hover:text-accent-text">
            <Icon name="Plus" size={16} /> Add Interest
          </button>
        </div>
        <div className="space-y-3">
          {interests.map((item, index) => (
            <div key={index} className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-3 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <select
                  value={item.icon}
                  onChange={(e) => updateInterest(index, 'icon', e.target.value)}
                  aria-label="Icon"
                  className="px-3 py-2 border border-primary-200 dark:border-primary-700 rounded-lg text-sm dark:bg-background dark:text-primary-200"
                >
                  {iconOptions.map((icon) => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
                <button onClick={() => removeInterest(index)} className="text-error-500 hover:text-error-700" aria-label="Remove interest">
                  <Icon name="Trash2" size={16} />
                </button>
              </div>
              <BilingualField
                label="Interest"
                value={item.name}
                valueAr={item.name_ar}
                onChange={(value) => updateInterest(index, 'name', value)}
                onChangeAr={(value) => updateInterest(index, 'name_ar', value)}
                placeholder="Interest name"
                placeholderAr="الاهتمام"
              />
            </div>
          ))}
          {interests.length === 0 && (
            <p className="text-sm text-secondary-500 text-center py-4 dark:text-muted">No interests yet. Click "Add Interest" to start.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CareerDataTab;
