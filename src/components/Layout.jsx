import React from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from "components/ui/Header";
import Footer from "components/Footer";
import { usePortfolioSettings } from 'context/PortfolioSettingsContext';

const Layout = ({ children }) => {
  const location = useLocation();
  const { siteSettings, seoSettings, profile } = usePortfolioSettings();
  
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
