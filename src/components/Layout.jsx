import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from "components/ui/Header";
import Footer from "components/Footer";
import LoadError from 'components/ui/LoadError';
import { usePageMetaOverride } from 'components/PageMeta';
import { usePortfolioSettings } from 'context/PortfolioSettingsContext';
import { useI18n } from 'i18n/I18nContext';
import { stripLanguage } from 'i18n/paths.mjs';
import {
  absoluteHttpsUrl,
  alternateUrls,
  canonicalUrl,
  formatPageTitle,
  personJsonLd,
  publicKeywords,
  resolveRouteMeta,
} from 'lib/pageMeta';

const GA_ID_PATTERN = /^(G|GT|AW)-[A-Z0-9]{4,}$/i;

const Layout = ({ children }) => {
  const location = useLocation();
  const { siteSettings, seoSettings, profile, socialLinks, error: settingsError, loadSettings } = usePortfolioSettings();
  const pageMeta = usePageMetaOverride();
  const { t, lang } = useI18n();
  const routeMeta = resolveRouteMeta(location.pathname);
  const pageName = pageMeta?.override?.page || (routeMeta.isHome ? null : t(routeMeta.page));
  const pageDescription = pageMeta?.override?.description || t(routeMeta.description);

  // Google Analytics: load gtag once per ID, then report each route change.
  const gaId = GA_ID_PATTERN.test(seoSettings?.google_analytics_id || '') ? seoSettings.google_analytics_id : '';
  useEffect(() => {
    if (!gaId || window.__portfolioGaId === gaId) return;
    window.__portfolioGaId = gaId;
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(script);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    // Page views are sent by the effect below, not by the initial config.
    window.gtag('config', gaId, { send_page_view: false });
  }, [gaId]);

  useEffect(() => {
    if (!gaId || typeof window.gtag !== 'function') return;
    window.gtag('event', 'page_view', {
      page_path: location.pathname + location.search,
      page_location: window.location.href,
    });
  }, [gaId, location.pathname, location.search]);

  // List of routes where Header and Footer should be hidden
  const hideLayoutRoutes = [
    '/admin-dashboard',
    '/project-manager',
    '/skills-manager',
    '/projects-manager',
    '/settings-manager',
    '/messages-manager',
    '/services-manager'
  ];

  const shouldHide = hideLayoutRoutes.some(route => location.pathname.startsWith(route));

  const siteTitle = formatPageTitle(pageName, profile, { name: t('site.defaultName'), role: t('site.defaultRole') });
  const siteDescription = pageDescription || seoSettings?.meta_description || siteSettings?.site_description || t('meta.fallbackDescription');
  const siteKeywords = publicKeywords(siteSettings?.site_keywords);
  const ogImage = absoluteHttpsUrl(pageMeta?.override?.image || seoSettings?.og_image);
  const pageUrl = canonicalUrl(location.pathname);
  const twitterHandle = seoSettings?.twitter_handle || '';
  const googleVerification = seoSettings?.google_site_verification || '';
  const noindex = Boolean(routeMeta.noindex);
  const alternates = noindex ? [] : alternateUrls(location.pathname);
  const isHome = stripLanguage(location.pathname) === '/';
  const structuredData = pageMeta?.override?.jsonLd
    || (isHome ? JSON.stringify(personJsonLd(profile, socialLinks)) : '');

  return (
    <>
      <Helmet>
        <title>{siteTitle}</title>
        <meta name="description" content={siteDescription} />
        {siteKeywords && <meta name="keywords" content={siteKeywords} />}
        <meta property="og:title" content={siteTitle} />
        <meta property="og:description" content={siteDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:locale" content={lang === 'ar' ? 'ar_EG' : 'en_US'} />
        {alternates.length > 0 && (
          <meta property="og:locale:alternate" content={lang === 'ar' ? 'en_US' : 'ar_EG'} />
        )}
        <meta property="og:image" content={ogImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={siteTitle} />
        <meta name="twitter:description" content={siteDescription} />
        <meta name="twitter:image" content={ogImage} />
        {twitterHandle && <meta name="twitter:creator" content={twitterHandle} />}
        {googleVerification && <meta name="google-site-verification" content={googleVerification} />}
        {noindex ? <meta name="robots" content="noindex, nofollow" /> : <link rel="canonical" href={pageUrl} />}
        {alternates.map((alt) => (
          <link key={alt.hrefLang} rel="alternate" hrefLang={alt.hrefLang} href={alt.href} />
        ))}
        {!noindex && structuredData && structuredData !== 'null' && (
          <script type="application/ld+json">{structuredData}</script>
        )}
      </Helmet>

      {!shouldHide && (
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:start-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-surface focus:text-text-primary focus:shadow-lg focus:ring-2 focus:ring-accent"
        >
          {t('layout.skip')}
        </a>
      )}

      {!shouldHide && <Header />}
      {!shouldHide && settingsError && (
        <div className="max-w-3xl mx-auto px-4 pt-24">
          <LoadError
            title={t('layout.settingsError')}
            message={settingsError}
            onRetry={loadSettings}
          />
        </div>
      )}
      {shouldHide ? children : (
        <main id="main-content" tabIndex={-1} className="outline-none">
          {children}
        </main>
      )}
      {!shouldHide && <Footer />}
    </>
  );
};

export default Layout;
