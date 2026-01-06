import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';
import { usePortfolioSettings } from 'context/PortfolioSettingsContext';

const FloatingCTA = ({ scrollProgress }) => {
  const { profile, socialLinks } = usePortfolioSettings();
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setIsVisible(scrollProgress > 30);
  }, [scrollProgress]);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <div className={`transition-all duration-300 ${isExpanded ? 'w-80' : 'w-auto'}`}>
        {/* Expanded CTA Card */}
        {isExpanded && (
          <div className="bg-white rounded-lg shadow-2xl p-6 mb-4 border border-primary-100 animate-fade-in">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="font-bold text-primary-800 mb-1">
                  Ready to Start Your Project?
                </h4>
                <p className="text-sm text-secondary-600">
                  Let's discuss how I can help bring your ideas to life.
                </p>
              </div>
              <button
                onClick={toggleExpanded}
                className="text-secondary-400 hover:text-secondary-600 transition-colors duration-200"
              >
                <Icon name="X" size={18} strokeWidth={2} />
              </button>
            </div>

            <div className="space-y-3">
              <Link
                to="/contact-hub"
                className="w-full bg-cta hover:bg-cta-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
                onClick={() => setIsExpanded(false)}
              >
                <Icon name="MessageCircle" size={18} strokeWidth={2} />
                <span>Start Conversation</span>
              </Link>

              <Link
                to="/portfolio-gallery"
                className="w-full bg-transparent border border-accent text-accent hover:bg-accent hover:text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
                onClick={() => setIsExpanded(false)}
              >
                <Icon name="Eye" size={18} strokeWidth={2} />
                <span>View Portfolio</span>
              </Link>
            </div>

            {/* Quick Contact Options */}
            <div className="mt-4 pt-4 border-t border-primary-100">
              <p className="text-xs text-secondary-500 mb-2">Quick Connect:</p>
              <div className="flex space-x-2">
                {profile?.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    className="flex-1 bg-primary-50 hover:bg-primary-100 text-primary-600 p-2 rounded text-center transition-colors duration-200"
                    title="Email"
                  >
                    <Icon name="Mail" size={16} strokeWidth={2} className="mx-auto" />
                  </a>
                )}
                {socialLinks?.linkedin && (
                  <a
                    href={socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-primary-50 hover:bg-primary-100 text-primary-600 p-2 rounded text-center transition-colors duration-200"
                    title="LinkedIn"
                  >
                    <Icon name="Linkedin" size={16} strokeWidth={2} className="mx-auto" />
                  </a>
                )}
                {socialLinks?.github && (
                  <a
                    href={socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-primary-50 hover:bg-primary-100 text-primary-600 p-2 rounded text-center transition-colors duration-200"
                    title="GitHub"
                  >
                    <Icon name="Github" size={16} strokeWidth={2} className="mx-auto" />
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Main Floating Button */}
        <div className="flex justify-end">
          <button
            onClick={toggleExpanded}
            className={`group relative bg-gradient-to-r from-cta to-cta-600 hover:from-cta-600 hover:to-cta-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
              isExpanded ? 'w-12 h-12' : 'w-14 h-14'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cta-400 to-cta-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative flex items-center justify-center h-full">
              {isExpanded ? (
                <Icon name="X" size={20} strokeWidth={2} />
              ) : (
                <Icon name="MessageCircle" size={24} strokeWidth={2} />
              )}
            </div>

            {/* Pulse Animation */}
            {!isExpanded && (
              <div className="absolute inset-0 rounded-full bg-cta animate-ping opacity-20"></div>
            )}

            {/* Tooltip */}
            {!isExpanded && (
              <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
                Let's work together!
                <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-gray-900"></div>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Background Overlay for Mobile */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[-1] lg:hidden"
          onClick={() => setIsExpanded(false)}
        ></div>
      )}
    </div>
  );
};

export default FloatingCTA;