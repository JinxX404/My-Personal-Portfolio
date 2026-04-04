import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from "components/ui/Header";
import Footer from "components/Footer";
import { usePortfolioSettings } from 'context/PortfolioSettingsContext';

const Layout = ({ children }) => {
  const location = useLocation();
  const { siteSettings, seoSettings, profile } = usePortfolioSettings();

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
    '/blog-editor',
    '/project-manager',
    '/skills-manager',
    '/projects-manager',
    '/blogs-manager',
    '/settings-manager'
  ];

  const shouldHide = hideLayoutRoutes.some(route => location.pathname.startsWith(route));

  const siteTitle = seoSettings?.meta_title || siteSettings?.site_title || `${profile?.full_name || 'Moataz'} — Portfolio`;
  const siteDescription = seoSettings?.meta_description || siteSettings?.site_description || 'Full Stack Developer Portfolio';
  const siteKeywords = siteSettings?.site_keywords || '';
  const ogImage = seoSettings?.og_image || '';
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
        {ogImage && <meta property="og:image" content={ogImage} />}
        <meta name="twitter:card" content="summary_large_image" />
        {twitterHandle && <meta name="twitter:creator" content={twitterHandle} />}
        {googleVerification && <meta name="google-site-verification" content={googleVerification} />}
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      {!shouldHide && <Header />}
      {children}
      {!shouldHide && <Footer />}
    </>
  );
};

export default Layout;
