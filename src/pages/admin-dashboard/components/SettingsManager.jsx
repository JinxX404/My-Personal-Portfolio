import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from 'components/AppIcon';
import Breadcrumb from 'components/ui/Breadcrumb';
import Image from 'components/AppImage';
import { usePortfolioSettings } from '../../../context/PortfolioSettingsContext';
import ProfileSettingsTab from './settings-tabs/ProfileSettingsTab';
import SocialLinksTabDynamic from './settings-tabs/SocialLinksTabDynamic';
import SiteSettingsTab from './settings-tabs/SiteSettingsTab';
import SEOSettingsTab from './settings-tabs/SEOSettingsTab';
import CareerDataTab from './settings-tabs/CareerDataTab';
import { missingArabic, PROFILE_SPEC, SITE_SPEC, SEO_SPEC, CAREER_SPEC } from '../../../i18n/content.mjs';

const SettingsManager = () => {
  const { settings, updateSettings } = usePortfolioSettings();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.tab || 'profile');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);
  
  // All Settings State - initialized from context
  const [profileSettings, setProfileSettings] = useState(settings.profile);
  const [freelanceProjects, setFreelanceProjects] = useState(settings.freelance_projects || 0);
  const [socialLinks, setSocialLinks] = useState(settings.social_links);
  const [siteSettings, setSiteSettings] = useState(settings.site_settings);
  const [seoSettings, setSeoSettings] = useState(settings.seo_settings);
  const [careerData, setCareerData] = useState(settings.career_data || { timeline: [], values: [], interests: [] });

  const tabs = [
    { id: 'profile', label: 'Profile Info', icon: 'User' },
    { id: 'social', label: 'Social Links', icon: 'Share2' },
    { id: 'site', label: 'Site Settings', icon: 'Settings' },
    { id: 'seo', label: 'SEO & Analytics', icon: 'TrendingUp' },
    { id: 'career', label: 'Career Data', icon: 'Briefcase' }
  ];

  // English text without Arabic, per tab (Arabic is optional but flagged).
  const missingByTab = {
    profile: missingArabic(profileSettings, PROFILE_SPEC).length,
    site: missingArabic(siteSettings, SITE_SPEC).length,
    seo: missingArabic(seoSettings, SEO_SPEC).length,
    career: missingArabic(careerData, CAREER_SPEC).length,
  };
  const missingTotal = Object.values(missingByTab).reduce((sum, count) => sum + count, 0);

  // Sync local state with context when settings load
  useEffect(() => {
    setProfileSettings(settings.profile);
    setFreelanceProjects(settings.freelance_projects || 0);
    setSocialLinks(settings.social_links);
    setSiteSettings(settings.site_settings);
    setSeoSettings(settings.seo_settings);
    setCareerData(settings.career_data || { timeline: [], values: [], interests: [] });
  }, [settings]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);

    try {
      const settingsData = {
        profile: profileSettings,
        freelance_projects: freelanceProjects,
        social_links: socialLinks,
        site_settings: siteSettings,
        seo_settings: seoSettings,
        career_data: careerData
      };

      const result = await updateSettings(settingsData);

      if (result.success) {
        setSaveMessage({
          type: 'success',
          text: missingTotal > 0
            ? `Settings saved. Arabic is missing for ${missingTotal} field${missingTotal === 1 ? '' : 's'}; the Arabic site shows English there.`
            : 'Settings saved successfully!',
        });
        setTimeout(() => setSaveMessage(null), 3000);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setProfileSettings(settings.profile);
    setFreelanceProjects(settings.freelance_projects || 0);
    setSocialLinks(settings.social_links);
    setSiteSettings(settings.site_settings);
    setSeoSettings(settings.seo_settings);
    setCareerData(settings.career_data || { timeline: [], values: [], interests: [] });
    setSaveMessage({ type: 'success', text: 'Changes reset to last saved state' });
    setTimeout(() => setSaveMessage(null), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 p-6 dark:from-background dark:to-background">
      <div className="max-w-7xl mx-auto">
        <Breadcrumb items={[
          { href: '/admin-dashboard', label: 'Dashboard' },
          { label: 'Portfolio Settings' }
        ]} />
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary-800 mb-2 dark:text-text-primary">Portfolio Settings</h1>
          <p className="text-secondary-600 dark:text-text-secondary">Manage your portfolio information, social links, and site configuration</p>
        </div>

        {/* Save Message */}
        {saveMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-lg flex items-center space-x-3 ${
              saveMessage.type === 'success' 
                ? 'bg-success-50 text-success-800 border border-success-200 dark:bg-success-900/30 dark:text-success-text dark:border-success-800' 
                : 'bg-error-50 text-error-700 border border-error-200 dark:bg-error-900/40 dark:text-error dark:border-error-800'
            }`}
          >
            <Icon name={saveMessage.type === 'success' ? 'CheckCircle' : 'AlertCircle'} size={20} />
            <span className="font-medium">{saveMessage.text}</span>
          </motion.div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-6 p-2 dark:bg-surface">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center space-x-2 px-6 py-4 rounded-lg font-semibold transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-accent to-cta text-white shadow-lg'
                    : 'text-secondary-600 hover:bg-primary-50 dark:text-text-secondary dark:hover:bg-surface-elevated'
                }`}
              >
                <Icon name={tab.icon} size={20} />
                <span className="hidden sm:inline">{tab.label}</span>
                {missingByTab[tab.id] > 0 && (
                  <span
                    className="rounded-full bg-warning-100 px-2 py-0.5 text-[11px] font-semibold text-warning-800 dark:bg-warning-900/40 dark:text-warning"
                    title={`${missingByTab[tab.id]} field(s) without Arabic`}
                  >
                    AR {missingByTab[tab.id]}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 dark:bg-surface">
          {activeTab === 'profile' && (
            <ProfileSettingsTab 
              settings={profileSettings}
              freelanceProjects={freelanceProjects}
              onFreelanceProjectsChange={setFreelanceProjects}
              onChange={setProfileSettings}
            />
          )}
          
          {activeTab === 'social' && (
            <SocialLinksTabDynamic 
              settings={socialLinks} 
              onChange={setSocialLinks}
            />
          )}
          
          {activeTab === 'site' && (
            <SiteSettingsTab 
              settings={siteSettings} 
              onChange={setSiteSettings}
            />
          )}
          
          {activeTab === 'seo' && (
            <SEOSettingsTab 
              settings={seoSettings} 
              onChange={setSeoSettings}
            />
          )}
          
          {activeTab === 'career' && (
            <CareerDataTab
              careerData={careerData}
              onChange={setCareerData}
            />
          )}
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={handleReset}
            className="px-8 py-4 bg-secondary-100 text-secondary-700 rounded-lg font-semibold hover:bg-secondary-200 transition-colors duration-200 dark:bg-surface dark:text-text-secondary dark:hover:bg-surface-elevated"
          >
            Reset Changes
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-8 py-4 bg-gradient-to-r from-accent to-cta text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 flex items-center space-x-2"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Icon name="Save" size={20} />
                <span>Save All Settings</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsManager;
