import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from "components/ui/Header";
import Footer from "components/Footer";
import LoadError from 'components/ui/LoadError';
import { usePageMetaOverride } from 'components/PageMeta';
import { usePortfolioSettings } from 'context/PortfolioSettingsContext';
import {
  absoluteHttpsUrl,
  canonicalUrl,
  formatPageTitle,
  publicKeywords,
  resolveRouteMeta,
} from 'lib/pageMeta';

const Layout = ({ children }) => {
  const location = useLocation();
  const { siteSettings, seoSettings, profile, error: settingsError, loadSettings } = usePortfolioSettings();
  const pageMeta = usePageMetaOverride();
  const routeMeta = resolveRouteMeta(location.pathname);
  const pageName = pageMeta?.override?.page || routeMeta.page;
  const pageDescription = pageMeta?.override?.description || routeMeta.description;

  // Google Analytics
  useEffect(() => {
    const gaId = seoSettings?.google_analytics_id;
    if (!gaId) return;

    // Load GA script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', gaId);

    // Track page views on route changes
    gtag('config', gaId, { page_path: location.pathname + location.search });
  }, [seoSettings?.google_analytics_id, location.pathname]);
  
  // List of routes where Header and Footer should be hidden
  const hideLayoutRoutes = [
    '/admin-dashboard',
    '/project-manager',
    '/skills-manager',
    '/projects-manager',
    '/settings-manager'
  ];

  const shouldHide = hideLayoutRoutes.some(route => location.pathname.startsWith(route));

  const siteTitle = formatPageTitle(pageName, profile);
  const siteDescription = pageDescription || seoSettings?.meta_description || siteSettings?.site_description || 'Full-Stack .NET developer portfolio.';
  const siteKeywords = publicKeywords(siteSettings?.site_keywords);
  const ogImage = absoluteHttpsUrl(pageMeta?.override?.image || seoSettings?.og_image);
  const pageUrl = canonicalUrl(location.pathname);
  const twitterHandle = seoSettings?.twitter_handle || '';
  const googleVerification = seoSettings?.google_site_verification || '';

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
        <meta property="og:image" content={ogImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={siteTitle} />
        <meta name="twitter:description" content={siteDescription} />
        <meta name="twitter:image" content={ogImage} />
        {twitterHandle && <meta name="twitter:creator" content={twitterHandle} />}
        {googleVerification && <meta name="google-site-verification" content={googleVerification} />}
        <link rel="canonical" href={pageUrl} />
      </Helmet>

      {!shouldHide && <Header />}
      {!shouldHide && settingsError && (
        <div className="max-w-3xl mx-auto px-4 pt-24">
          <LoadError
            title="Site content could not be loaded"
            message={settingsError}
            onRetry={loadSettings}
          />
        </div>
      )}
      {children}
      {!shouldHide && <Footer />}
    </>
  );
};

export default Layout;
