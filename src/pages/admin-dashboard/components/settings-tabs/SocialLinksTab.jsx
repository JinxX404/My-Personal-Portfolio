import React from 'react';
import Icon from 'components/AppIcon';

const SocialLinksTab = ({ links, onChange }) => {
  const socialPlatforms = [
    { 
      key: 'github', 
      label: 'GitHub', 
      icon: 'Github', 
      color: '#181717', 
      placeholder: 'https://github.com/username',
      description: 'Your GitHub profile'
    },
    { 
      key: 'linkedin', 
      label: 'LinkedIn', 
      icon: 'Linkedin', 
      color: '#0A66C2', 
      placeholder: 'https://linkedin.com/in/username',
      description: 'Professional network'
    },
    { 
      key: 'twitter', 
      label: 'Twitter / X', 
      icon: 'Twitter', 
      color: '#1DA1F2', 
      placeholder: 'https://twitter.com/username',
      description: 'Social media presence'
    },
    { 
      key: 'dribbble', 
      label: 'Dribbble', 
      icon: 'Dribbble', 
      color: '#EA4C89', 
      placeholder: 'https://dribbble.com/username',
      description: 'Design portfolio'
    },
    { 
      key: 'behance', 
      label: 'Behance', 
      icon: 'Box', 
      color: '#1769FF', 
      placeholder: 'https://behance.net/username',
      description: 'Creative showcase'
    },
    { 
      key: 'instagram', 
      label: 'Instagram', 
      icon: 'Instagram', 
      color: '#E4405F', 
      placeholder: 'https://instagram.com/username',
      description: 'Visual content'
    },
    { 
      key: 'facebook', 
      label: 'Facebook', 
      icon: 'Facebook', 
      color: '#1877F2', 
      placeholder: 'https://facebook.com/username',
      description: 'Social profile'
    },
    { 
      key: 'youtube', 
      label: 'YouTube', 
      icon: 'Youtube', 
      color: '#FF0000', 
      placeholder: 'https://youtube.com/@username',
      description: 'Video content'
    },
    { 
      key: 'medium', 
      label: 'Medium', 
      icon: 'FileText', 
      color: '#000000', 
      placeholder: 'https://medium.com/@username',
      description: 'Articles'
    },
    { 
      key: 'dev_to', 
      label: 'DEV.to', 
      icon: 'Code', 
      color: '#0A0A0A', 
      placeholder: 'https://dev.to/username',
      description: 'Developer community'
    },
    { 
      key: 'stackoverflow', 
      label: 'Stack Overflow', 
      icon: 'HelpCircle', 
      color: '#F58025', 
      placeholder: 'https://stackoverflow.com/users/id',
      description: 'Q&A profile'
    },
    { 
      key: 'codepen', 
      label: 'CodePen', 
      icon: 'Code2', 
      color: '#000000', 
      placeholder: 'https://codepen.io/username',
      description: 'Code snippets'
    }
  ];

  const filledLinks = socialPlatforms.filter(platform => links[platform.key]).length;
  const totalLinks = socialPlatforms.length;

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-primary-800 flex items-center space-x-3">
              <Icon name="Share2" size={24} className="text-accent" />
              <span>Social Media Links</span>
            </h2>
            <p className="text-secondary-600 mt-1">
              Connect your social media profiles to showcase your online presence
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-accent">{filledLinks}/{totalLinks}</div>
            <div className="text-xs text-secondary-600">Connected</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-secondary-600">Profile Completion</span>
            <span className="text-sm font-bold text-accent">{Math.round((filledLinks / totalLinks) * 100)}%</span>
          </div>
          <div className="w-full bg-secondary-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-accent to-cta h-3 rounded-full transition-all duration-500"
              style={{ width: `${(filledLinks / totalLinks) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {socialPlatforms.map((platform) => (
            <div 
              key={platform.key} 
              className={`relative group transition-all duration-200 ${
                links[platform.key] ? 'ring-2 ring-accent ring-offset-2' : ''
              }`}
            >
              <div className="bg-white border-2 border-primary-200 rounded-xl p-4 hover:border-accent transition-colors">
                <label className="block text-sm font-semibold text-primary-700 mb-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${platform.color}15` }}
                    >
                      <Icon name={platform.icon} size={18} style={{ color: platform.color }} />
                    </div>
                    <div>
                      <div className="font-bold">{platform.label}</div>
                      <div className="text-xs text-secondary-500 font-normal">{platform.description}</div>
                    </div>
                  </div>
                  {links[platform.key] && (
                    <Icon name="CheckCircle" size={20} className="text-success" />
                  )}
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={links[platform.key]}
                    onChange={(e) => onChange({ ...links, [platform.key]: e.target.value })}
                    placeholder={platform.placeholder}
                    className="w-full pl-4 pr-10 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent text-sm"
                  />
                  {links[platform.key] && (
                    <a
                      href={links[platform.key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-accent hover:text-accent-700"
                    >
                      <Icon name="ExternalLink" size={16} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-gradient-to-br from-accent-50 to-primary-50 border-2 border-dashed border-accent-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-primary-800 mb-3 flex items-center space-x-2">
            <Icon name="Lightbulb" size={20} className="text-accent" />
            <span>Pro Tips</span>
          </h3>
          <ul className="space-y-2 text-sm text-secondary-700">
            <li className="flex items-start space-x-2">
              <Icon name="Check" size={16} className="text-success mt-0.5 flex-shrink-0" />
              <span>Add your most active social profiles to increase credibility</span>
            </li>
            <li className="flex items-start space-x-2">
              <Icon name="Check" size={16} className="text-success mt-0.5 flex-shrink-0" />
              <span>Make sure your profiles are public and up-to-date</span>
            </li>
            <li className="flex items-start space-x-2">
              <Icon name="Check" size={16} className="text-success mt-0.5 flex-shrink-0" />
              <span>Use consistent branding across all platforms</span>
            </li>
            <li className="flex items-start space-x-2">
              <Icon name="Check" size={16} className="text-success mt-0.5 flex-shrink-0" />
              <span>These links will appear in your portfolio's footer and contact sections</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SocialLinksTab;
