import React from 'react';
import Icon from 'components/AppIcon';

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
          <div>
            <label className="block text-sm font-semibold text-primary-700 mb-2 dark:text-text-primary">
              Site Title
            </label>
            <input
              type="text"
              value={settings.site_title}
              onChange={(e) => onChange({ ...settings, site_title: e.target.value })}
              placeholder="My Portfolio"
              className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent dark:border-border"
            />
          </div>

          {/* Site Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-primary-700 mb-2 dark:text-text-primary">
              Site Description
            </label>
            <textarea
              value={settings.site_description}
              onChange={(e) => onChange({ ...settings, site_description: e.target.value })}
              placeholder="A brief description of your portfolio..."
              rows="3"
              className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent dark:border-border"
            />
          </div>

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

          {/* Logo */}
          <div>
            <label className="block text-sm font-semibold text-primary-700 mb-2 dark:text-text-primary">
              Logo URL
            </label>
            <input
              type="url"
              value={settings.logo_url}
              onChange={(e) => onChange({ ...settings, logo_url: e.target.value })}
              placeholder="https://example.com/logo.png"
              className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent dark:border-border"
            />
          </div>

          {/* Favicon */}
          <div>
            <label className="block text-sm font-semibold text-primary-700 mb-2 dark:text-text-primary">
              Favicon URL
            </label>
            <input
              type="url"
              value={settings.favicon_url}
              onChange={(e) => onChange({ ...settings, favicon_url: e.target.value })}
              placeholder="https://example.com/favicon.ico"
              className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent dark:border-border"
            />
          </div>

          {/* Color Scheme */}
          <div className="md:col-span-2 bg-gradient-to-br from-primary-50 to-accent-50 border-2 border-dashed border-primary-300 rounded-xl p-6 dark:from-background dark:to-background">
            <h3 className="text-lg font-bold text-primary-800 mb-4 flex items-center space-x-2 dark:text-text-primary">
              <Icon name="Palette" size={20} className="text-accent dark:text-accent-text" />
              <span>Color Scheme</span>
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-primary-700 mb-2 dark:text-text-primary">
                  Primary Color
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={settings.primary_color}
                    onChange={(e) => onChange({ ...settings, primary_color: e.target.value })}
                    className="w-20 h-14 rounded-lg cursor-pointer border-2 border-primary-200 shadow-sm dark:border-border"
                  />
                  <input
                    type="text"
                    value={settings.primary_color}
                    onChange={(e) => onChange({ ...settings, primary_color: e.target.value })}
                    className="flex-1 px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-white dark:border-border dark:bg-surface"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-primary-700 mb-2 dark:text-text-primary">
                  Accent Color
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={settings.accent_color}
                    onChange={(e) => onChange({ ...settings, accent_color: e.target.value })}
                    className="w-20 h-14 rounded-lg cursor-pointer border-2 border-primary-200 shadow-sm dark:border-border"
                  />
                  <input
                    type="text"
                    value={settings.accent_color}
                    onChange={(e) => onChange({ ...settings, accent_color: e.target.value })}
                    className="flex-1 px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-white dark:border-border dark:bg-surface"
                  />
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-start space-x-2 text-sm text-secondary-600 dark:text-text-secondary">
              <Icon name="Info" size={16} className="mt-0.5 flex-shrink-0" />
              <span>These colors will be applied across your portfolio theme</span>
            </div>
          </div>

          {/* Feature Toggles */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-lg font-bold text-primary-800 flex items-center space-x-2 dark:text-text-primary">
              <Icon name="ToggleRight" size={20} className="text-accent dark:text-accent-text" />
              <span>Feature Toggles</span>
            </h3>
            
            {[
              { key: 'show_theme_toggle', label: 'Show Theme Toggle', description: 'Allow visitors to switch between dark and light mode', icon: 'Moon' },
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
