import React from 'react';
import { Link } from 'react-router-dom';
import Icon from './AppIcon';
import { usePortfolioSettings } from 'context/PortfolioSettingsContext';

const Footer = () => {
  const { profile, socialLinks, siteSettings } = usePortfolioSettings();
  const currentYear = new Date().getFullYear();

  // Platform detection from URL
  const detectPlatform = (url) => {
    if (!url) return null;
    const urlLower = url.toLowerCase();
    
    const platforms = {
      'github.com': { name: 'GitHub', icon: 'Github', color: 'gray-700' },
      'linkedin.com': { name: 'LinkedIn', icon: 'Linkedin', color: 'blue-600' },
      'twitter.com': { name: 'Twitter', icon: 'Twitter', color: 'blue-400' },
      'x.com': { name: 'X (Twitter)', icon: 'Twitter', color: 'gray-900' },
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
      'telegram.org': { name: 'Telegram', icon: 'MessageCircle', color: 'blue-500' },
      't.me': { name: 'Telegram', icon: 'MessageCircle', color: 'blue-500' },
      'discord.com': { name: 'Discord', icon: 'MessageSquare', color: 'indigo-500' },
      'twitch.tv': { name: 'Twitch', icon: 'Tv', color: 'purple-600' },
      'tiktok.com': { name: 'TikTok', icon: 'Music', color: 'gray-900' },
      'reddit.com': { name: 'Reddit', icon: 'MessageCircle', color: 'orange-600' },
      'gitlab.com': { name: 'GitLab', icon: 'GitBranch', color: 'orange-500' },
      'bitbucket.org': { name: 'Bitbucket', icon: 'GitBranch', color: 'blue-600' },
      'notion.so': { name: 'Notion', icon: 'FileText', color: 'gray-800' },
    };

    for (const [domain, platform] of Object.entries(platforms)) {
      if (urlLower.includes(domain)) {
        return platform;
      }
    }
    
    // Default for unknown platforms
    return { name: 'Website', icon: 'ExternalLink', color: 'primary-600' };
  };

  // Get all social links that have values
  const activeSocialLinks = Object.entries(socialLinks || {})
    .filter(([key, url]) => url && url.trim() !== '')
    .map(([key, url]) => ({
      key,
      url,
      platform: detectPlatform(url)
    }));

  const footerLinks = [
    { name: 'Home', path: '/' },
    { name: 'Portfolio', path: '/portfolio-gallery' },
    { name: 'About', path: '/about-story' },
    { name: 'Contact', path: '/contact-hub' },
  ];

  return (
    <footer className="bg-primary-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold mb-4">{profile?.full_name || siteSettings?.site_title || 'Portfolio'}</h3>
            <p className="text-primary-200 mb-4">
              {profile?.tagline || 'Crafting digital experiences that matter.'}
            </p>
            {profile?.email && (
              <a 
                href={`mailto:${profile.email}`}
                className="text-accent-400 hover:text-accent-300 transition-colors flex items-center space-x-2"
              >
                <Icon name="Mail" size={16} />
                <span>{profile.email}</span>
              </a>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path}
                    className="text-primary-200 hover:text-white transition-colors flex items-center space-x-2"
                  >
                    <Icon name="ChevronRight" size={14} />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Connect With Me</h3>
            {activeSocialLinks.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {activeSocialLinks.map(({ key, url, platform }) => (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-primary-800 hover:bg-accent-500 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                    title={platform.name}
                  >
                    <Icon 
                      name={platform.icon} 
                      size={18} 
                      className="text-primary-200 group-hover:text-white transition-colors"
                    />
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-primary-300 text-sm">No social links added yet</p>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-700 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-primary-300 text-sm">
            © {currentYear} {profile?.full_name || siteSettings?.site_title || 'Portfolio'}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
