import React from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import { usePortfolioSettings } from 'context/PortfolioSettingsContext';
import { useProjects } from 'context/ProjectsContext';

const WhoAmI = () => {
  const { profile } = usePortfolioSettings();
  const { projects } = useProjects();
  
  const projectCount = projects?.filter(p => p.publishing_status === 'published').length || 0;

  const highlights = [
    { icon: 'Code2', text: profile?.experience_years ? `${profile.experience_years}+ Years` : '1+ Years', label: 'Experience' },
    { icon: 'MapPin', text: profile?.location || 'Remote', label: 'Location' },
    { icon: 'Briefcase', text: profile?.title || 'Developer', label: 'Role' },
    { icon: 'FolderOpen', text: `${projectCount}+`, label: 'Projects' },
  ];

  return (
    <section className="py-16 bg-surface dark:bg-surface border-y border-border dark:border-border-strong transition-theme">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* Image */}
          <div className="flex-shrink-0">
            <div className="relative">
              <Image
                src={profile?.avatar || ''}
                alt={profile?.full_name || 'Profile'}
                className="w-32 h-32 rounded-full object-cover border-4 border-accent shadow-xl"
              />
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-success rounded-full border-4 border-surface dark:border-surface flex items-center justify-center">
                <Icon name="Check" size={16} className="text-white" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary dark:text-white mb-2">
              {profile?.full_name || 'Moataz Mohammed'}
            </h2>
            <p className="text-accent font-medium mb-4">
              {profile?.tagline || 'Backend Engineer & Problem Solver'}
            </p>
            <p className="text-text-secondary dark:text-white/70 max-w-2xl mb-6">
              {profile?.bio ? (
                profile.bio.length > 200 ? profile.bio.substring(0, 200) + '...' : profile.bio
              ) : (
                'Passionate developer dedicated to building scalable, efficient, and user-friendly applications. Committed to continuous learning and delivering high-quality solutions.'
              )}
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6">
              {highlights.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-accent/10 dark:bg-accent/20 rounded-lg flex items-center justify-center">
                    <Icon name={item.icon} size={18} className="text-accent" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary dark:text-white">{item.text}</p>
                    <p className="text-xs text-text-secondary dark:text-white/50">{item.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="flex-shrink-0">
            <Link
              to="/about-story"
              className="inline-flex items-center justify-center space-x-2 bg-accent hover:bg-accent-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <Icon name="User" size={18} strokeWidth={2} />
              <span>More About Me</span>
              <Icon name="ArrowRight" size={16} strokeWidth={2} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoAmI;
