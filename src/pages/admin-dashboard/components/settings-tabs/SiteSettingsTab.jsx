import React from 'react';
import Icon from 'components/AppIcon';
import BilingualField from 'components/admin/BilingualField';

const SiteSettingsTab = ({ settings, onChange }) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-primary-800 mb-6 flex items-center space-x-3 dark:text-text-primary">
          <Icon name="Settings" size={24} className="text-accent dark:text-accent-text" />
          <span>Site Configuration</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Site Title */}
          <BilingualField
            className="md:col-span-2"
            label="Site Title"
            hint="(used in the footer when the profile has no name)"
            value={settings.site_title}
            valueAr={settings.site_title_ar}
            onChange={(value) => onChange({ ...settings, site_title: value })}
            onChangeAr={(value) => onChange({ ...settings, site_title_ar: value })}
            placeholder="My Portfolio"
            placeholderAr="معرض أعمالي"
          />

          {/* Site Description */}
          <BilingualField
            className="md:col-span-2"
            label="Site Description"
            multiline
            rows={3}
            value={settings.site_description}
            valueAr={settings.site_description_ar}
            onChange={(value) => onChange({ ...settings, site_description: value })}
            onChangeAr={(value) => onChange({ ...settings, site_description_ar: value })}
            placeholder="A brief description of your portfolio..."
            placeholderAr="وصف قصير لموقعك"
          />

          {/* Keywords */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-primary-700 mb-2 dark:text-text-primary">
              Keywords (comma-separated)
            </label>
            <input
              type="text"
              value={settings.site_keywords}
              onChange={(e) => onChange({ ...settings, site_keywords: e.target.value })}
              placeholder="web developer, designer, react, nodejs"
              className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent dark:border-border"
            />
          </div>

          {/* Feature Toggles */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-lg font-bold text-primary-800 flex items-center space-x-2 dark:text-text-primary">
              <Icon name="ToggleRight" size={20} className="text-accent dark:text-accent-text" />
              <span>Feature Toggles</span>
            </h3>
            
            {[
              { key: 'enable_animations', label: 'Enable Page Animations', description: 'Smooth transitions and entrance animations', icon: 'Zap' },
              { key: 'enable_contact_form', label: 'Enable Contact Form', description: 'Show the contact form on the contact page', icon: 'Mail' }
            ].map((feature) => (
              <label 
                key={feature.key} 
                className="flex items-center justify-between p-5 bg-white border-2 border-primary-200 rounded-xl cursor-pointer hover:border-accent hover:shadow-md transition-all group dark:bg-surface dark:border-border"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${
                    settings[feature.key] ? 'bg-accent text-white' : 'bg-secondary-100 text-secondary-500 dark:bg-surface-elevated dark:text-muted'
                  }`}>
                    <Icon name={feature.icon} size={20} />
                  </div>
                  <div>
                    <div className="font-semibold text-primary-700 dark:text-text-primary">{feature.label}</div>
                    <div className="text-sm text-secondary-500 dark:text-muted">{feature.description}</div>
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={settings[feature.key]}
                    onChange={(e) => onChange({ ...settings, [feature.key]: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-16 h-8 bg-secondary-300 peer-focus:ring-4 peer-focus:ring-accent-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-accent shadow-inner"></div>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteSettingsTab;
