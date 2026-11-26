import React from 'react';
import { Link } from 'react-router-dom';
import Icon from './AppIcon';
import { usePortfolioSettings } from 'context/PortfolioSettingsContext';
import { safeHref } from 'lib/safeUrl';
import { useI18n } from 'i18n/I18nContext';
import { detectPlatform } from 'lib/socialPlatforms.mjs';
import { useHasServices } from 'hooks/usePublicServices';

const Footer = () => {
  const { profile, socialLinks, siteSettings } = usePortfolioSettings();
  const { t, lp, lang } = useI18n();
  const hasServices = useHasServices();
  const currentYear = new Date().getFullYear();

  // Get all social links that have values
  const activeSocialLinks = Object.entries(socialLinks || {})
    .map(([key, url]) => ({
      key,
      url: safeHref(url),
      platform: detectPlatform(url, key, lang)
    }))
    .filter((link) => link.url);

  const footerLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.portfolio'), path: '/projects' },
    hasServices && { name: t('nav.services'), path: '/services' },
    { name: t('nav.about'), path: '/about-story' },
    { name: t('nav.contact'), path: '/contact-hub' },
  ].filter(Boolean);

  return (
    <footer className="bg-surface dark:bg-surface border-t border-border dark:border-border-strong">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-28">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white"><bdi>{profile?.full_name || siteSettings?.site_title || t('site.portfolio')}</bdi></h3>
            <p dir="auto" className="text-gray-600 dark:text-white/70 mb-4">
              {profile?.tagline || t('footer.defaultTagline')}
            </p>
            {profile?.email && safeHref(`mailto:${profile.email}`) && (
              <a 
                href={safeHref(`mailto:${profile.email}`)}
                className="hover:text-accent-500 dark:hover:text-accent-400 transition-colors flex items-center space-x-2 rtl:space-x-reverse dark:hover:text-accent-text"
              >
                <Icon name="Mail" size={16} className="text-accent-500 dark:text-accent-400 flex-shrink-0" />
                <span dir="ltr" className="text-gray-600 dark:text-white/80">{profile.email}</span>
              </a>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">{t('footer.quickLinks')}</h3>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={lp(link.path)}
                    className="group flex items-center space-x-3 rtl:space-x-reverse px-3 py-2 rounded-lg hover:bg-white/10 dark:hover:bg-white/5 transition-all duration-200"
                  >
                    <Icon name="ChevronRight" size={16} className="text-accent dark:text-accent-400 flex-shrink-0 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                    <span className="text-gray-600 dark:text-white/80 group-hover:text-white transition-colors font-medium">
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">{t('footer.connect')}</h3>
            {activeSocialLinks.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {activeSocialLinks.map(({ key, url, platform }) => (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-200 dark:bg-white/10 hover:bg-accent-500 dark:hover:bg-accent-500 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                    aria-label={platform.label}
                    title={platform.label}
                  >
                    <Icon 
                      name={platform.icon} 
                      size={18} 
                      className="text-gray-600 dark:text-white/70 group-hover:text-white transition-colors"
                    />
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-muted text-sm">{t('footer.noSocial')}</p>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 dark:border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 dark:text-white/50 text-sm">
            {t('footer.copyright', { year: currentYear })}{' '}
            <bdi>{profile?.full_name || siteSettings?.site_title || t('site.portfolio')}</bdi>
            {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
