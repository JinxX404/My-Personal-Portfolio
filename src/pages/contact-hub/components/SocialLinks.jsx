import React from 'react';
import { motion } from 'framer-motion';
import Icon from 'components/AppIcon';
import { usePortfolioSettings } from 'context/PortfolioSettingsContext';

const SocialLinks = () => {
  const { socialLinks } = usePortfolioSettings();

  const platformMeta = {
    linkedin: { name: 'LinkedIn', icon: 'Linkedin', description: 'Professional updates & networking', color: 'blue-600' },
    github: { name: 'GitHub', icon: 'Github', description: 'Open source projects & code', color: 'gray-800' },
    twitter: { name: 'Twitter', icon: 'Twitter', description: 'Tech insights & industry thoughts', color: 'blue-400' },
    dribbble: { name: 'Dribbble', icon: 'Dribbble', description: 'Design work & creative process', color: 'pink-500' },
    behance: { name: 'Behance', icon: 'Box', description: 'Creative showcase', color: 'blue-500' },
    instagram: { name: 'Instagram', icon: 'Instagram', description: 'Visual content', color: 'pink-600' },
    youtube: { name: 'YouTube', icon: 'Youtube', description: 'Video content', color: 'red-600' },
    medium: { name: 'Medium', icon: 'FileText', description: 'Blog articles', color: 'gray-700' }
  };

  const socialPlatforms = Object.entries(socialLinks || {})
    .filter(([key, url]) => url && platformMeta[key])
    .map(([key, url]) => ({
      ...platformMeta[key],
      url
    }));

  const communities = [
    {
      name: 'Dev Community',
      description: 'Active contributor & mentor',
      icon: 'Users',
      color: 'accent'
    },
    {
      name: 'Stack Overflow',
      description: '15K+ reputation points',
      icon: 'HelpCircle',
      color: 'warning'
    },
    {
      name: 'Tech Meetups',
      description: 'Regular speaker & organizer',
      icon: 'Mic',
      color: 'success'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="space-y-8"
    >
      {/* Social Media Links */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-primary-800 mb-2">Connect Online</h2>
          <p className="text-secondary-600">
            Follow my journey and stay updated with my latest work and insights.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {socialPlatforms.map((platform, index) => (
            <motion.a
              key={platform.name}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center space-x-3 p-4 rounded-lg border border-primary-200 hover:border-primary-300 hover:shadow-md transition-all duration-200 group"
            >
              <div className={`w-10 h-10 bg-${platform.color}/10 rounded-lg flex items-center justify-center group-hover:bg-${platform.color}/20 transition-colors duration-200`}>
                <Icon 
                  name={platform.icon} 
                  size={18} 
                  className={`text-${platform.color}`}
                  strokeWidth={2} 
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-primary-800">{platform.name}</h3>
                <p className="text-sm text-secondary-600">{platform.description}</p>
              </div>
              <Icon 
                name="ExternalLink" 
                size={14} 
                className="text-secondary-400 group-hover:text-secondary-600 transition-colors duration-200" 
                strokeWidth={2}
              />
            </motion.a>
          ))}
        </div>
      </div>

      {/* Community Involvement */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-primary-800 mb-2">Community Involvement</h2>
          <p className="text-secondary-600">
            Active in the tech community, sharing knowledge and helping others grow.
          </p>
        </div>

        <div className="space-y-4">
          {communities.map((community, index) => (
            <motion.div
              key={community.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-primary-50 transition-colors duration-200"
            >
              <div className={`w-8 h-8 bg-${community.color}/10 rounded-lg flex items-center justify-center`}>
                <Icon 
                  name={community.icon} 
                  size={14} 
                  className={`text-${community.color}`}
                  strokeWidth={2} 
                />
              </div>
              <div>
                <h3 className="font-medium text-primary-800">{community.name}</h3>
                <p className="text-sm text-secondary-600">{community.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="bg-gradient-to-br from-accent-50 to-cta-50 rounded-2xl p-8 border border-accent-200">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-accent to-cta rounded-lg flex items-center justify-center mx-auto mb-4">
            <Icon name="Mail" size={20} color="white" strokeWidth={2} />
          </div>
          <h2 className="text-xl font-bold text-primary-800 mb-2">Stay Updated</h2>
          <p className="text-secondary-600">
            Get monthly insights on web development, design trends, and industry updates.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 border border-primary-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
          />
          <button className="bg-accent hover:bg-accent-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2">
            <Icon name="Send" size={16} strokeWidth={2} />
            <span>Subscribe</span>
          </button>
        </div>

        <p className="text-xs text-secondary-500 text-center mt-3">
          No spam, unsubscribe anytime. Read our{' '}
          <a href="#" className="text-accent hover:text-accent-700 underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </motion.div>
  );
};

export default SocialLinks;