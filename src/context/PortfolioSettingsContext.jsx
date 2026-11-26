import React, { createContext, useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { useI18n } from '../i18n/I18nContext';
import { localize, PROFILE_SPEC, SITE_SPEC, SEO_SPEC, CAREER_SPEC } from '../i18n/content.mjs';

const PortfolioSettingsContext = createContext();

/**
 * Settings for the current page language. On /ar the profile, site, SEO and
 * career texts hold the Arabic version where it is filled in and English
 * otherwise. `settings` always stays the raw row, which the admin edits.
 */
export const usePortfolioSettings = () => {
  const context = useContext(PortfolioSettingsContext);
  if (!context) {
    throw new Error('usePortfolioSettings must be used within PortfolioSettingsProvider');
  }
  const { lang } = useI18n();
  return useMemo(() => {
    if (lang !== 'ar') return context;
    return {
      ...context,
      profile: localize(context.profile, PROFILE_SPEC, lang),
      siteSettings: localize(context.siteSettings, SITE_SPEC, lang),
      seoSettings: localize(context.seoSettings, SEO_SPEC, lang),
      careerData: localize(context.careerData, CAREER_SPEC, lang),
    };
  }, [context, lang]);
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
  freelance_projects: 0,
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
    site_keywords: 'full-stack .NET developer, C#, ASP.NET, software engineer',
    enable_animations: true,
    enable_contact_form: true
  },
  seo_settings: {
    meta_title: 'Moataz Mohammed — Full-Stack .NET Developer',
    meta_description: 'Portfolio of Moataz Mohammed, a Full-Stack .NET developer.',
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

// The public settings row (name, bio, links...) is cached in the browser so a
// repeat visit paints the real profile at once instead of empty defaults first.
const CACHE_KEY = 'portfolio-cache:settings:v1';

const readCachedSettings = () => {
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed && typeof parsed === 'object' && parsed.profile ? parsed : null;
  } catch {
    return null;
  }
};

const writeCachedSettings = (value) => {
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(value));
  } catch {
    // Storage blocked or full: settings simply load from the network each time.
  }
};

export const PortfolioSettingsProvider = ({ children }) => {
  const [cached] = useState(readCachedSettings);
  const [settings, setSettings] = useState(() => cached || defaultSettings);
  // isLoading: a request is in flight. isReady: real settings (cached or fresh) are on screen.
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(Boolean(cached));
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
        const next = {
          profile: data[0].profile || defaultSettings.profile,
          freelance_projects: data[0].freelance_projects || defaultSettings.freelance_projects,
          social_links: data[0].social_links || defaultSettings.social_links,
          site_settings: data[0].site_settings || defaultSettings.site_settings,
          seo_settings: data[0].seo_settings || defaultSettings.seo_settings,
          career_data: data[0].career_data || defaultSettings.career_data
        };
        setSettings(next);
        writeCachedSettings(next);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      setIsReady(true);
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
        freelance_projects: newSettings.freelance_projects,
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
      writeCachedSettings(newSettings);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const value = useMemo(() => ({
    settings,
    isLoading,
    isReady,
    error,
    loadSettings,
    updateSettings,
    profile: settings.profile,
    freelanceProjects: settings.freelance_projects,
    socialLinks: settings.social_links,
    siteSettings: settings.site_settings,
    seoSettings: settings.seo_settings,
    careerData: settings.career_data
  }), [settings, isLoading, isReady, error, loadSettings, updateSettings]);

  return (
    <PortfolioSettingsContext.Provider value={value}>
      {children}
    </PortfolioSettingsContext.Provider>
  );
};

export default PortfolioSettingsContext;
