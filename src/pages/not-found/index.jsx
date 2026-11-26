import React from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';
import { useI18n } from 'i18n/I18nContext';

const NotFound = () => {
  const { t, lp } = useI18n();
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center px-4 dark:from-background dark:to-background">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Animation */}
        <div className="relative mb-8">
          <div className="text-9xl font-bold text-primary-200 select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-gradient-to-br from-accent to-cta rounded-full flex items-center justify-center animate-bounce">
              <Icon name="Search" size={32} color="white" strokeWidth={2} />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-800 mb-4 dark:text-text-primary">
            {t('notFound.title')}
          </h1>
          <p className="text-lg text-secondary-600 mb-6 max-w-md mx-auto dark:text-text-secondary">
            {t('notFound.body')}
          </p>
        </div>

        {/* Navigation Options */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Link
            to={lp('/')}
            className="btn-primary flex items-center space-x-2 rtl:space-x-reverse px-6 py-3"
          >
            <Icon name="Home" size={18} strokeWidth={2} />
            <span>{t('notFound.home')}</span>
          </Link>
          
          <Link
            to={lp('/projects')}
            className="btn-secondary flex items-center space-x-2 rtl:space-x-reverse px-6 py-3"
          >
            <Icon name="Briefcase" size={18} strokeWidth={2} />
            <span>{t('notFound.portfolio')}</span>
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="text-sm text-secondary-500 dark:text-muted">
          <p className="mb-4">{t('notFound.try')}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to={lp('/about-story')} 
              className="text-accent hover:text-accent-700 transition-colors duration-200 dark:text-accent-text dark:hover:text-accent-text"
            >
              {t('nav.about')}
            </Link>
            <Link 
              to={lp('/contact-hub')} 
              className="text-accent hover:text-accent-700 transition-colors duration-200 dark:text-accent-text dark:hover:text-accent-text"
            >
              {t('nav.contact')}
            </Link>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 start-10 w-20 h-20 bg-accent-100 rounded-full opacity-50 animate-pulse dark:bg-accent-subtle"></div>
        <div className="absolute bottom-20 end-10 w-16 h-16 bg-cta-100 rounded-full opacity-50 animate-pulse animation-delay-400 dark:bg-accent-subtle"></div>
        <div className="absolute top-1/2 start-5 w-12 h-12 bg-success-100 rounded-full opacity-50 animate-pulse animation-delay-200 dark:bg-success-900/30"></div>
      </div>
    </div>
  );
};

export default NotFound;