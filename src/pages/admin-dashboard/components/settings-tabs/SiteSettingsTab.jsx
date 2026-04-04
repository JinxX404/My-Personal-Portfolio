import React from 'react';
import Icon from 'components/AppIcon';

const SiteSettingsTab = ({ settings, onChange }) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-primary-800 mb-6 flex items-center space-x-3">
          <Icon name="Settings" size={24} className="text-accent" />
          <span>Site Configuration</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Site Title */}
          <div>
            <label className="block text-sm font-semibold text-primary-700 mb-2">
              Site Title
            </label>
            <input
              type="text"
              value={settings.site_title}
              onChange={(e) => onChange({ ...settings, site_title: e.target.value })}
              placeholder="My Portfolio"
              className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>

          {/* Site Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-primary-700 mb-2">
              Site Description
            </label>
            <textarea
              value={settings.site_description}
              onChange={(e) => onChange({ ...settings, site_description: e.target.value })}
              placeholder="A brief description of your portfolio..."
              rows="3"
              className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>

          {/* Keywords */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-primary-700 mb-2">
              Keywords (comma-separated)
            </label>
            <input
              type="text"
              value={settings.site_keywords}
              onChange={(e) => onChange({ ...settings, site_keywords: e.target.value })}
              placeholder="web developer, designer, react, nodejs"
              className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>

          {/* Logo */}
          <div>
            <label className="block text-sm font-semibold text-primary-700 mb-2">
              Logo URL
            </label>
            <input
              type="url"
              value={settings.logo_url}
              onChange={(e) => onChange({ ...settings, logo_url: e.target.value })}
              placeholder="https://example.com/logo.png"
              className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>

          {/* Favicon */}
          <div>
            <label className="block text-sm font-semibold text-primary-700 mb-2">
              Favicon URL
            </label>
            <input
              type="url"
              value={settings.favicon_url}
              onChange={(e) => onChange({ ...settings, favicon_url: e.target.value })}
              placeholder="https://example.com/favicon.ico"
              className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>

          {/* Color Scheme */}
          <div className="md:col-span-2 bg-gradient-to-br from-primary-50 to-accent-50 border-2 border-dashed border-primary-300 rounded-xl p-6">
            <h3 className="text-lg font-bold text-primary-800 mb-4 flex items-center space-x-2">
              <Icon name="Palette" size={20} className="text-accent" />
              <span>Color Scheme</span>
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-primary-700 mb-2">
                  Primary Color
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={settings.primary_color}
                    onChange={(e) => onChange({ ...settings, primary_color: e.target.value })}
                    className="w-20 h-14 rounded-lg cursor-pointer border-2 border-primary-200 shadow-sm"
                  />
                  <input
                    type="text"
                    value={settings.primary_color}
                    onChange={(e) => onChange({ ...settings, primary_color: e.target.value })}
                    className="flex-1 px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-primary-700 mb-2">
                  Accent Color
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={settings.accent_color}
                    onChange={(e) => onChange({ ...settings, accent_color: e.target.value })}
                    className="w-20 h-14 rounded-lg cursor-pointer border-2 border-primary-200 shadow-sm"
                  />
                  <input
                    type="text"
                    value={settings.accent_color}
                    onChange={(e) => onChange({ ...settings, accent_color: e.target.value })}
                    className="flex-1 px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-white"
                  />
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-start space-x-2 text-sm text-secondary-600">
              <Icon name="Info" size={16} className="mt-0.5 flex-shrink-0" />
              <span>These colors will be applied across your portfolio theme</span>
            </div>
          </div>

          {/* Feature Toggles */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-lg font-bold text-primary-800 flex items-center space-x-2">
              <Icon name="ToggleRight" size={20} className="text-accent" />
              <span>Feature Toggles</span>
            </h3>
            
            {[
              { key: 'show_theme_toggle', label: 'Show Theme Toggle', description: 'Allow visitors to switch between dark and light mode', icon: 'Moon' },
              { key: 'enable_animations', label: 'Enable Page Animations', description: 'Smooth transitions and entrance animations', icon: 'Zap' },
              { key: 'enable_contact_form', label: 'Enable Contact Form', description: 'Show the contact form on the contact page', icon: 'Mail' }
            ].map((feature) => (
              <label 
                key={feature.key} 
                className="flex items-center justify-between p-5 bg-white border-2 border-primary-200 rounded-xl cursor-pointer hover:border-accent hover:shadow-md transition-all group"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${
                    settings[feature.key] ? 'bg-accent text-white' : 'bg-secondary-100 text-secondary-500'
                  }`}>
                    <Icon name={feature.icon} size={20} />
                  </div>
                  <div>
                    <div className="font-semibold text-primary-700">{feature.label}</div>
                    <div className="text-sm text-secondary-500">{feature.description}</div>
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
