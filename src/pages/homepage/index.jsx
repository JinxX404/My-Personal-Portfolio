import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';
import { useReducedMotion } from 'hooks/useReducedMotion';
import { usePortfolioSettings } from 'context/PortfolioSettingsContext';
import { safeHref } from 'lib/safeUrl';
import { useI18n } from 'i18n/I18nContext';

import HeroSection from './components/HeroSection';
import FeaturedWork from './components/FeaturedWork';
import SkillsVisualization from './components/SkillsVisualization';
import WhoAmI from './components/WhoAmI';
import TestimonialsStrip from './components/TestimonialsStrip';

const Homepage = () => {
  const progressRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const { profile } = usePortfolioSettings();
  const { t, lp } = useI18n();
  const cvUrl = safeHref(profile?.cv_url || profile?.resume_url);

  // Reading progress. Written straight to the bar's transform once per frame,
  // so scrolling does not re-render the whole page.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const maxHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxHeight > 0 ? Math.min(1, window.scrollY / maxHeight) : 0;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${progress})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-text-primary transition-theme">
      {/* Progress Bar */}
      <div className="fixed top-0 start-0 w-full h-1 bg-primary-100 dark:bg-accent-fill/40 z-50 transition-theme" aria-hidden="true">
        <div
          ref={progressRef}
          className="h-full origin-left rtl:origin-right bg-gradient-to-r rtl:bg-gradient-to-l from-accent-500 via-accent-400 to-cta dark:from-accent-400 dark:via-accent-500 dark:to-cta"
          style={{ transform: 'scaleX(0)' }}
        ></div>
      </div>

      {/* Hero Section */}
      <HeroSection shouldReduceMotion={shouldReduceMotion} />

      {/* Who Am I Section */}
      <WhoAmI />

      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
              {t('home.featured.title')}
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              {t('home.featured.subtitle')}
            </p>
          </div>
          <FeaturedWork />
        </div>
      </section>

      {/* Client testimonials (hidden until one is featured) */}
      <TestimonialsStrip />

      {/* Skills Visualization Section */}
      <section className="py-20 bg-surface dark:bg-surface transition-theme">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6 transition-theme">
              {t('home.skills.title')}
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              {t('home.skills.subtitle')}
            </p>
          </div>
          <SkillsVisualization shouldReduceMotion={shouldReduceMotion} />
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-background dark:bg-background border-t border-border dark:border-border-strong transition-theme">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-text-primary">
            {t('home.cta.title')}
          </h2>
          <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
            {t('home.cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={lp('/contact-hub')}
              className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center space-x-2 rtl:space-x-reverse"
            >
              <Icon name="MessageCircle" size={20} strokeWidth={2} />
              <span>{t('common.startConversation')}</span>
            </Link>
            <Link
              to={lp('/projects')}
              className="inline-flex items-center justify-center space-x-2 rtl:space-x-reverse border border-border dark:border-border-strong hover:border-accent hover:bg-accent/5 text-text-primary dark:text-text-primary font-semibold py-4 px-8 rounded-xl transition-all duration-300"
            >
              <Icon name="Eye" size={20} strokeWidth={2} />
              <span>{t('home.cta.explore')}</span>
            </Link>
            {cvUrl && (
              <a
                href={cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center space-x-2 rtl:space-x-reverse border border-accent text-accent hover:bg-accent hover:text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 dark:text-accent-text"
              >
                <Icon name="Download" size={20} strokeWidth={2} />
                <span>{t('common.downloadCv')}</span>
              </a>
            )}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Homepage;