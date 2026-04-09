import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const platformColorMap = {
  'primary-600': { bg10: 'bg-primary-600/10', text: 'text-primary-600' },
  'gray-700':    { bg10: 'bg-gray-700/10',    text: 'text-gray-700' },
  'blue-600':    { bg10: 'bg-blue-600/10',    text: 'text-blue-600' },
  'gray-900':    { bg10: 'bg-gray-900/10',    text: 'text-gray-900' },
  'pink-500':    { bg10: 'bg-pink-500/10',    text: 'text-pink-500' },
  'blue-500':    { bg10: 'bg-blue-500/10',    text: 'text-blue-500' },
  'pink-600':    { bg10: 'bg-pink-600/10',    text: 'text-pink-600' },
  'blue-700':    { bg10: 'bg-blue-700/10',    text: 'text-blue-700' },
  'red-600':     { bg10: 'bg-red-600/10',     text: 'text-red-600' },
  'gray-800':    { bg10: 'bg-gray-800/10',    text: 'text-gray-800' },
  'orange-500':  { bg10: 'bg-orange-500/10',  text: 'text-orange-500' },
  'green-600':   { bg10: 'bg-green-600/10',   text: 'text-green-600' },
  'green-500':   { bg10: 'bg-green-500/10',   text: 'text-green-500' },
  'purple-500':  { bg10: 'bg-purple-500/10',  text: 'text-purple-500' },
  'red-500':     { bg10: 'bg-red-500/10',     text: 'text-red-500' },
  'indigo-500':  { bg10: 'bg-indigo-500/10',  text: 'text-indigo-500' },
  'purple-600':  { bg10: 'bg-purple-600/10',  text: 'text-purple-600' },
  'orange-600':  { bg10: 'bg-orange-600/10',  text: 'text-orange-600' },
  'yellow-400':  { bg10: 'bg-yellow-400/10',  text: 'text-yellow-400' },
};

const SocialLinksTabDynamic = ({ settings, onChange }) => {
  const [newLinkLabel, setNewLinkLabel] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');

  // Platform detection from URL
  const detectPlatform = (url) => {
    if (!url) return { name: 'Link', icon: 'Link', color: 'primary-600' };
    const urlLower = url.toLowerCase();
    
    const platforms = {
      'github.com': { name: 'GitHub', icon: 'Github', color: 'gray-700' },
      'linkedin.com': { name: 'LinkedIn', icon: 'Linkedin', color: 'blue-600' },
      'twitter.com': { name: 'X', icon: 'X', color: 'gray-900' },
      'x.com': { name: 'X', icon: 'X', color: 'gray-900' },
      'dribbble.com': { name: 'Dribbble', icon: 'Dribbble', color: 'pink-500' },
      'behance.net': { name: 'Behance', icon: 'Box', color: 'blue-500' },
      'instagram.com': { name: 'Instagram', icon: 'Instagram', color: 'pink-600' },
      'facebook.com': { name: 'Facebook', icon: 'Facebook', color: 'blue-700' },
      'youtube.com': { name: 'YouTube', icon: 'Youtube', color: 'red-600' },
      'medium.com': { name: 'Medium', icon: 'FileText', color: 'gray-700' },
      'dev.to': { name: 'DEV', icon: 'Code2', color: 'gray-800' },
      'stackoverflow.com': { name: 'Stack Overflow', icon: 'HelpCircle', color: 'orange-500' },
      'codepen.io': { name: 'CodePen', icon: 'Code', color: 'gray-800' },
      'upwork.com': { name: 'Upwork', icon: 'Briefcase', color: 'green-600' },
      'fiverr.com': { name: 'Fiverr', icon: 'DollarSign', color: 'green-500' },
      'freelancer.com': { name: 'Freelancer', icon: 'Users', color: 'blue-500' },
      'toptal.com': { name: 'Toptal', icon: 'Award', color: 'blue-700' },
      '99designs.com': { name: '99designs', icon: 'Palette', color: 'orange-500' },
      'figma.com': { name: 'Figma', icon: 'Figma', color: 'purple-500' },
      'pinterest.com': { name: 'Pinterest', icon: 'Image', color: 'red-500' },
      'telegram.org': { name: 'Telegram', icon: 'Send', color: 'blue-500' },
      't.me': { name: 'Telegram', icon: 'Send', color: 'blue-500' },
      'discord.com': { name: 'Discord', icon: 'MessageSquare', color: 'indigo-500' },
      'twitch.tv': { name: 'Twitch', icon: 'Tv', color: 'purple-600' },
      'tiktok.com': { name: 'TikTok', icon: 'Music', color: 'gray-900' },
      'reddit.com': { name: 'Reddit', icon: 'MessageCircle', color: 'orange-600' },
      'gitlab.com': { name: 'GitLab', icon: 'GitBranch', color: 'orange-500' },
      'bitbucket.org': { name: 'Bitbucket', icon: 'GitBranch', color: 'blue-600' },
      'notion.so': { name: 'Notion', icon: 'FileText', color: 'gray-800' },
      'threads.net': { name: 'Threads', icon: 'AtSign', color: 'gray-900' },
      'snapchat.com': { name: 'Snapchat', icon: 'Camera', color: 'yellow-400' },
    };

    for (const [domain, platform] of Object.entries(platforms)) {
      if (urlLower.includes(domain)) {
        return platform;
      }
    }
    
    return { name: 'Website', icon: 'ExternalLink', color: 'primary-600' };
  };

  // Convert object to array for easier manipulation
  const linksArray = Object.entries(settings || {})
    .filter(([key, value]) => value !== '')
    .map(([key, url]) => ({ key, url, platform: detectPlatform(url) }));

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
        <h2 className="text-2xl font-bold text-primary-800 mb-2 flex items-center space-x-3">
          <Icon name="Share2" size={24} className="text-accent" />
          <span>Social & Professional Links</span>
        </h2>
        <p className="text-secondary-600 mb-6">
          Add unlimited links to your social media, freelance profiles, and professional networks. URLs are auto-detected for logos.
        </p>

        {/* Add New Link Section */}
        <div className="bg-gradient-to-br from-accent-50 to-cta-50 border-2 border-dashed border-accent-300 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-bold text-primary-800 mb-4 flex items-center space-x-2">
            <Icon name="Plus" size={20} className="text-accent" />
            <span>Add New Link</span>
          </h3>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <label className="block text-sm font-semibold text-primary-700 mb-2">
                Label (Optional)
              </label>
              <input
                type="text"
                value={newLinkLabel}
                onChange={(e) => setNewLinkLabel(e.target.value)}
                placeholder="e.g., My GitHub"
                className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>
            
            <div className="md:col-span-1">
              <label className="block text-sm font-semibold text-primary-700 mb-2">
                URL *
              </label>
              <input
                type="url"
                value={newLinkUrl}
                onChange={(e) => setNewLinkUrl(e.target.value)}
                placeholder="https://github.com/username"
                className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
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
          
          <div className="mt-3 flex items-start space-x-2 text-sm text-secondary-600">
            <Icon name="Info" size={16} className="mt-0.5 flex-shrink-0" />
            <span>Platform logo will be auto-detected from the URL. Supports 30+ platforms including GitHub, LinkedIn, Upwork, Fiverr, and more.</span>
          </div>
        </div>

        {/* Existing Links */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-primary-800">Your Links ({linksArray.length})</h3>
            {linksArray.length > 0 && (
              <span className="text-sm text-secondary-600">
                {linksArray.length} link{linksArray.length !== 1 ? 's' : ''} added
              </span>
            )}
          </div>

          {linksArray.length === 0 ? (
            <div className="text-center py-12 bg-secondary-50 rounded-xl border-2 border-dashed border-secondary-300">
              <Icon name="Link" size={48} className="mx-auto text-secondary-400 mb-4" />
              <p className="text-secondary-600 font-medium mb-2">No links added yet</p>
              <p className="text-sm text-secondary-500">Add your first social or professional link above</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {linksArray.map(({ key, url, platform }) => (
                <div
                  key={key}
                  className="bg-white border-2 border-primary-200 rounded-xl p-4 hover:border-accent hover:shadow-md transition-all group"
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
                        <span className="font-semibold text-primary-700">{platform.name}</span>
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
                        className="w-full px-3 py-2 text-sm border border-primary-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                      />
                      
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 text-xs text-accent hover:text-accent-700 mt-2"
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
        <div className="mt-8 bg-white border-2 border-primary-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-primary-800 mb-4">Popular Platforms</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {[
              { name: 'GitHub', placeholder: 'https://github.com/username' },
              { name: 'LinkedIn', placeholder: 'https://linkedin.com/in/username' },
              { name: 'Twitter', placeholder: 'https://twitter.com/username' },
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
                      ? 'bg-success-100 text-success-700 cursor-default'
                      : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                  }`}
                  disabled={hasLink}
                >
                  {hasLink ? '✓ ' : ''}{platform.name}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-secondary-500 mt-3">
            Click a platform to quick-fill the URL template above
          </p>
        </div>
      </div>
    </div>
  );
};

export default SocialLinksTabDynamic;
