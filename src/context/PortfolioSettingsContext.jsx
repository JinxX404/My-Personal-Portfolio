import React, { createContext, useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabase';

const PortfolioSettingsContext = createContext();

export const usePortfolioSettings = () => {
  const context = useContext(PortfolioSettingsContext);
  if (!context) {
    throw new Error('usePortfolioSettings must be used within PortfolioSettingsProvider');
  }
  return context;
};

// Default settings - used when database has no data
const defaultSettings = {
  profile: {
    full_name: '',
    title: '',
    tagline: '',
    bio: '',
    avatar: '',
    resume_url: '',
    cv_url: '',
    email: '',
    phone: '',
    location: '',
    availability: 'available'
  },
  social_links: {
    github: '',
    linkedin: '',
    twitter: '',
    dribbble: '',
    behance: '',
    instagram: '',
    facebook: '',
    youtube: '',
    medium: '',
    dev_to: '',
    stackoverflow: '',
    codepen: ''
  },
  site_settings: {
    site_title: 'Portfolio',
    site_description: 'Professional portfolio showcasing my work and expertise',
    site_keywords: 'web developer, designer, react, nodejs',
    logo_url: '',
    favicon_url: '',
    primary_color: '#3B82F6',
    accent_color: '#8B5CF6',
    show_theme_toggle: true,
    enable_animations: true,
    enable_blog_comments: false,
    enable_contact_form: true
  },
  seo_settings: {
    meta_title: 'Professional Portfolio',
    meta_description: 'Showcasing innovative projects and technical expertise',
    og_image: '',
    twitter_handle: '',
    google_analytics_id: '',
    google_site_verification: ''
  },
  career_data: {
    timeline: [],
    values: [],
    interests: []
  }
};

export const PortfolioSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error: fetchError } = await supabase
        .from('portfolio_settings')
        .select('*')
        .limit(1);

      if (fetchError) {
        setError(fetchError.message);
        setIsLoading(false);
        return;
      }

      if (data && data.length > 0) {
        setSettings({
          profile: data[0].profile || defaultSettings.profile,
          social_links: data[0].social_links || defaultSettings.social_links,
          site_settings: data[0].site_settings || defaultSettings.site_settings,
          seo_settings: data[0].seo_settings || defaultSettings.seo_settings,
          career_data: data[0].career_data || defaultSettings.career_data
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const updateSettings = async (newSettings) => {
    try {
      // Get the existing record
      const { data: existing, error: fetchError } = await supabase
        .from('portfolio_settings')
        .select('id')
        .limit(1);

      if (fetchError) {
        return { success: false, error: fetchError.message };
      }

      const settingsData = {
        profile: newSettings.profile,
        social_links: newSettings.social_links,
        site_settings: newSettings.site_settings,
        seo_settings: newSettings.seo_settings,
        career_data: newSettings.career_data,
        updated_at: new Date().toISOString()
      };

      let result;
      
      if (existing && existing.length > 0) {
        result = await supabase
          .from('portfolio_settings')
          .update(settingsData)
          .eq('id', existing[0].id)
          .select();
      } else {
        result = await supabase
          .from('portfolio_settings')
          .insert(settingsData)
          .select();
      }

      if (result.error) {
        return { success: false, error: result.error.message };
      }

      setSettings(newSettings);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const value = useMemo(() => ({
    settings,
    isLoading,
    error,
    loadSettings,
    updateSettings,
    profile: settings.profile,
    socialLinks: settings.social_links,
    siteSettings: settings.site_settings,
    seoSettings: settings.seo_settings,
    careerData: settings.career_data
  }), [settings, isLoading, error, loadSettings, updateSettings]);

  return (
    <PortfolioSettingsContext.Provider value={value}>
      {children}
    </PortfolioSettingsContext.Provider>
  );
};

export default PortfolioSettingsContext;
