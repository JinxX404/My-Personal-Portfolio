import React, { useState } from 'react';
import { detectPlatform as detectSocialPlatform } from 'lib/socialPlatforms.mjs';
import Icon from 'components/AppIcon';

const platformColorMap = {
  success:       { bg10: 'bg-success/10 dark:bg-success-900/30',  text: 'text-success dark:text-success-text' },
  accent:        { bg10: 'bg-accent/10 dark:bg-accent-subtle',     text: 'text-accent dark:text-accent-text' },
  warning:       { bg10: 'bg-warning/10 dark:bg-warning-900/40',   text: 'text-warning' },
  'primary-600': { bg10: 'bg-primary-600/10 dark:bg-white/10', text: 'text-primary-600 dark:text-slate-200' },
  'gray-700':    { bg10: 'bg-gray-700/10 dark:bg-white/10',    text: 'text-gray-700 dark:text-gray-200' },
  'blue-600':    { bg10: 'bg-blue-600/10 dark:bg-blue-400/15', text: 'text-blue-600 dark:text-blue-400' },
  'gray-900':    { bg10: 'bg-gray-900/10 dark:bg-white/10',    text: 'text-gray-900 dark:text-gray-100' },
  'pink-500':    { bg10: 'bg-pink-500/10 dark:bg-pink-400/15', text: 'text-pink-500 dark:text-pink-400' },
  'blue-500':    { bg10: 'bg-blue-500/10 dark:bg-blue-400/15', text: 'text-blue-500 dark:text-blue-400' },
  'pink-600':    { bg10: 'bg-pink-600/10 dark:bg-pink-400/15', text: 'text-pink-600 dark:text-pink-400' },
  'blue-700':    { bg10: 'bg-blue-700/10 dark:bg-blue-400/15', text: 'text-blue-700 dark:text-blue-400' },
  'red-600':     { bg10: 'bg-red-600/10 dark:bg-red-400/15',   text: 'text-red-600 dark:text-red-400' },
  'gray-800':    { bg10: 'bg-gray-800/10 dark:bg-white/10',    text: 'text-gray-800 dark:text-gray-200' },
  'orange-500':  { bg10: 'bg-orange-500/10 dark:bg-orange-400/15', text: 'text-orange-500 dark:text-orange-400' },
  'green-600':   { bg10: 'bg-green-600/10 dark:bg-green-400/15', text: 'text-green-600 dark:text-green-400' },
  'green-500':   { bg10: 'bg-green-500/10 dark:bg-green-400/15', text: 'text-green-500 dark:text-green-400' },
  'purple-500':  { bg10: 'bg-purple-500/10 dark:bg-purple-300/15', text: 'text-purple-500 dark:text-purple-300' },
  'red-500':     { bg10: 'bg-red-500/10 dark:bg-red-400/15',   text: 'text-red-500 dark:text-red-400' },
  'indigo-500':  { bg10: 'bg-indigo-500/10 dark:bg-indigo-300/15', text: 'text-indigo-500 dark:text-indigo-300' },
  'purple-600':  { bg10: 'bg-purple-600/10 dark:bg-purple-300/15', text: 'text-purple-600 dark:text-purple-300' },
  'orange-600':  { bg10: 'bg-orange-600/10 dark:bg-orange-400/15', text: 'text-orange-600 dark:text-orange-400' },
  'yellow-400':  { bg10: 'bg-yellow-400/10 dark:bg-yellow-300/15', text: 'text-yellow-400 dark:text-yellow-300' },
};

const SocialLinksTabDynamic = ({ settings, onChange }) => {
  const [newLinkLabel, setNewLinkLabel] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');

  // Shared with the public site (src/lib/socialPlatforms.mjs).
  const detectPlatform = (url, key) => detectSocialPlatform(url, key);

  // Convert object to array for easier manipulation
  const linksArray = Object.entries(settings || {})
    .filter(([key, value]) => value !== '')
    .map(([key, url]) => ({ key, url, platform: detectPlatform(url, key) }));

  const handleAddLink = () => {
    if (!newLinkUrl.trim()) return;
    
    // Generate a unique key from label or platform name
    const platform = detectPlatform(newLinkUrl);
    const key = (newLinkLabel || platform.name).toLowerCase().replace(/[^a-z0-9]/g, '_');
    
    onChange({
      ...settings,
      [key]: newLinkUrl.trim()
    });
    
    setNewLinkLabel('');
    setNewLinkUrl('');
  };

  const handleRemoveLink = (key) => {
    const newSettings = { ...settings };
    delete newSettings[key];
    onChange(newSettings);
  };

  const handleUpdateLink = (key, url) => {
    onChange({
      ...settings,
      [key]: url
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-primary-800 mb-2 flex items-center space-x-3 dark:text-text-primary">
          <Icon name="Share2" size={24} className="text-accent dark:text-accent-text" />
          <span>Social & Professional Links</span>
        </h2>
        <p className="text-secondary-600 mb-6 dark:text-text-secondary">
          Add unlimited links to your social media, freelance profiles, and professional networks. URLs are auto-detected for logos.
        </p>

        {/* Add New Link Section */}
        <div className="bg-gradient-to-br from-accent-50 to-cta-50 border-2 border-dashed border-accent-300 rounded-xl p-6 mb-6 dark:from-background dark:to-background">
          <h3 className="text-lg font-bold text-primary-800 mb-4 flex items-center space-x-2 dark:text-text-primary">
            <Icon name="Plus" size={20} className="text-accent dark:text-accent-text" />
            <span>Add New Link</span>
          </h3>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <label className="block text-sm font-semibold text-primary-700 mb-2 dark:text-text-primary">
                Label (Optional)
              </label>
              <input
                type="text"
                value={newLinkLabel}
                onChange={(e) => setNewLinkLabel(e.target.value)}
                placeholder="e.g., My GitHub"
                className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent dark:border-border"
              />
            </div>
            
            <div className="md:col-span-1">
              <label className="block text-sm font-semibold text-primary-700 mb-2 dark:text-text-primary">
                URL *
              </label>
              <input
                type="url"
                value={newLinkUrl}
                onChange={(e) => setNewLinkUrl(e.target.value)}
                placeholder="https://github.com/username"
                className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent dark:border-border"
                onKeyDown={(e) => e.key === 'Enter' && handleAddLink()}
              />
            </div>
            
            <div className="flex items-end">
              <button
                onClick={handleAddLink}
                className="w-full px-6 py-3 bg-gradient-to-r from-accent to-cta text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Icon name="Plus" size={18} />
                <span>Add Link</span>
              </button>
            </div>
          </div>
          
          <div className="mt-3 flex items-start space-x-2 text-sm text-secondary-600 dark:text-text-secondary">
            <Icon name="Info" size={16} className="mt-0.5 flex-shrink-0" />
            <span>Platform logo will be auto-detected from the URL. Supports 30+ platforms including GitHub, LinkedIn, Upwork, Fiverr, and more.</span>
          </div>
        </div>

        {/* Existing Links */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-primary-800 dark:text-text-primary">Your Links ({linksArray.length})</h3>
            {linksArray.length > 0 && (
              <span className="text-sm text-secondary-600 dark:text-text-secondary">
                {linksArray.length} link{linksArray.length !== 1 ? 's' : ''} added
              </span>
            )}
          </div>

          {linksArray.length === 0 ? (
            <div className="text-center py-12 bg-secondary-50 rounded-xl border-2 border-dashed border-secondary-300 dark:bg-surface dark:border-border">
              <Icon name="Link" size={48} className="mx-auto text-secondary-400 mb-4 dark:text-muted" />
              <p className="text-secondary-600 font-medium mb-2 dark:text-text-secondary">No links added yet</p>
              <p className="text-sm text-secondary-500 dark:text-muted">Add your first social or professional link above</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {linksArray.map(({ key, url, platform }) => (
                <div
                  key={key}
                  className="bg-white border-2 border-primary-200 rounded-xl p-4 hover:border-accent hover:shadow-md transition-all group dark:bg-surface dark:border-border"
                >
                  <div className="flex items-start space-x-4">
                    {(() => {
                      const colors = platformColorMap[platform.color] || platformColorMap['primary-600'];
                      return (
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${colors.bg10}`}>
                          <Icon name={platform.icon} size={20} className={colors.text} />
                        </div>
                      );
                    })()}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-primary-700 dark:text-text-primary">{platform.name}</span>
                        <button
                          onClick={() => handleRemoveLink(key)}
                          className="text-error hover:text-error-700 transition-colors"
                          title="Remove link"
                        >
                          <Icon name="Trash2" size={16} />
                        </button>
                      </div>
                      
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => handleUpdateLink(key, e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-primary-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent dark:border-border"
                      />
                      
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 text-xs text-accent hover:text-accent-700 mt-2 dark:text-accent-text dark:hover:text-accent-text"
                      >
                        <Icon name="ExternalLink" size={12} />
                        <span>Test Link</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Add Popular Platforms */}
        <div className="mt-8 bg-white border-2 border-primary-200 rounded-xl p-6 dark:bg-surface dark:border-border">
          <h3 className="text-lg font-bold text-primary-800 mb-4 dark:text-text-primary">Popular Platforms</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {[
              { name: 'GitHub', placeholder: 'https://github.com/username' },
              { name: 'LinkedIn', placeholder: 'https://linkedin.com/in/username' },
              { name: 'X (Twitter)', placeholder: 'https://x.com/username' },
              { name: 'Mostaql', placeholder: 'https://mostaql.com/u/username' },
              { name: 'Upwork', placeholder: 'https://upwork.com/freelancers/~username' },
              { name: 'Fiverr', placeholder: 'https://fiverr.com/username' },
              { name: 'Dribbble', placeholder: 'https://dribbble.com/username' },
            ].map((platform) => {
              const hasLink = linksArray.some(link => link.platform.name === platform.name);
              return (
                <button
                  key={platform.name}
                  onClick={() => {
                    if (!hasLink) {
                      setNewLinkUrl(platform.placeholder);
                      setNewLinkLabel(platform.name);
                    }
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    hasLink
                      ? 'bg-success-100 text-success-800 cursor-default dark:bg-success-900/30 dark:text-success-text'
                      : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200 dark:bg-surface-elevated dark:text-text-secondary dark:hover:bg-surface'
                  }`}
                  disabled={hasLink}
                >
                  {hasLink ? '✓ ' : ''}{platform.name}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-secondary-500 mt-3 dark:text-muted">
            Click a platform to quick-fill the URL template above
          </p>
        </div>
      </div>
    </div>
  );
};

export default SocialLinksTabDynamic;
