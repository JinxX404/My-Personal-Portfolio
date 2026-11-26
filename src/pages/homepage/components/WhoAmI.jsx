import React from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import { usePortfolioSettings } from 'context/PortfolioSettingsContext';

const WhoAmI = () => {
  const { profile, isReady } = usePortfolioSettings();

  // Years, project count, and role are already in the hero right above,
  // so this strip only adds what the hero does not say.
  const availabilityText = {
    available: 'Open to new projects',
    busy: 'Limited availability',
  }[profile?.availability] || 'Not taking new projects';

  const highlights = [
    profile?.location && { icon: 'MapPin', text: profile.location, label: 'Based in' },
    { icon: 'Calendar', text: availabilityText, label: 'Availability' },
  ].filter(Boolean);

  return (
    <section className="py-16 bg-surface dark:bg-surface border-y border-border dark:border-border-strong transition-theme">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hidden (space kept) until the real profile is known, so the default
            photo and "Not taking new projects" never flash on a first visit. */}
        <div className={`flex flex-col lg:flex-row items-center gap-8 ${isReady ? '' : 'invisible'}`}>
          {/* Image */}
          <div className="flex-shrink-0">
            <div className="relative">
              <Image
                src={profile?.avatar || '/assets/images/no_image.png'}
                alt={profile?.full_name || 'Moataz Mohammed'}
                width={128}
                height={128}
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
            <p className="text-accent font-medium mb-4 dark:text-accent-text">
              {profile?.title || 'Full-Stack .NET Developer'}
            </p>
            <p dir="auto" className="text-text-secondary dark:text-white/70 max-w-2xl mb-6">
              {profile?.bio ? (
                profile.bio.length > 200 ? profile.bio.substring(0, 200) + '...' : profile.bio
              ) : (
                'Passionate developer dedicated to building scalable, efficient, and user-friendly applications. Committed to continuous learning and delivering high-quality solutions.'
              )}
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6">
              {highlights.map((item) => (
                <div key={item.label} className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-accent/10 dark:bg-accent/20 rounded-lg flex items-center justify-center">
                    <Icon name={item.icon} size={18} className="text-accent dark:text-accent-text" strokeWidth={2} />
                  </div>
                  <div>
                    <p dir="auto" className="text-sm font-semibold text-text-primary dark:text-white">{item.text}</p>
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
