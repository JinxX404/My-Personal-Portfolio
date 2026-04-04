import React from 'react';
import Icon from 'components/AppIcon';

const SEOSettingsTab = ({ settings, onChange }) => {
  const metaTitle = settings.meta_title || '';
  const metaDescription = settings.meta_description || '';
  const ogImage = settings.og_image || '';
  const twitterHandle = settings.twitter_handle || '';
  const googleAnalyticsId = settings.google_analytics_id || '';
  const googleSiteVerification = settings.google_site_verification || '';

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-primary-800 dark:text-primary-200 mb-2 flex items-center space-x-3">
          <Icon name="TrendingUp" size={24} className="text-accent" />
          <span>SEO & Analytics</span>
        </h2>
        <p className="text-secondary-600 dark:text-secondary-400 mb-6">
          Optimize your portfolio for search engines and track visitor analytics
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Meta Title */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-primary-700 dark:text-primary-300 mb-2">
              Meta Title
            </label>
            <input
              type="text"
              value={metaTitle}
              onChange={(e) => onChange({ ...settings, meta_title: e.target.value })}
              placeholder="Your Portfolio - Full Stack Developer"
              maxLength="60"
              className="w-full px-4 py-3 border border-primary-200 dark:border-primary-700 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent dark:bg-background dark:text-primary-200"
            />
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-secondary-500">{metaTitle.length}/60 characters</p>
              {metaTitle.length > 60 && (
                <p className="text-xs text-error-500 flex items-center space-x-1">
                  <Icon name="AlertCircle" size={12} />
                  <span>Title too long for optimal SEO</span>
                </p>
              )}
            </div>
          </div>

          {/* Meta Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-primary-700 dark:text-primary-300 mb-2">
              Meta Description
            </label>
            <textarea
              value={metaDescription}
              onChange={(e) => onChange({ ...settings, meta_description: e.target.value })}
              placeholder="Professional web developer specializing in React, Node.js, and modern web technologies..."
              maxLength="160"
              rows="3"
              className="w-full px-4 py-3 border border-primary-200 dark:border-primary-700 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent dark:bg-background dark:text-primary-200"
            />
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-secondary-500">{metaDescription.length}/160 characters</p>
              {metaDescription.length > 160 && (
                <p className="text-xs text-error-500 flex items-center space-x-1">
                  <Icon name="AlertCircle" size={12} />
                  <span>Description too long for optimal SEO</span>
                </p>
              )}
            </div>
          </div>

          {/* Open Graph Image */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-primary-700 dark:text-primary-300 mb-2">
              Open Graph Image (Social Share Image)
            </label>
            <input
              type="url"
              value={ogImage}
              onChange={(e) => onChange({ ...settings, og_image: e.target.value })}
              placeholder="https://example.com/og-image.jpg"
              className="w-full px-4 py-3 border border-primary-200 dark:border-primary-700 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent dark:bg-background dark:text-primary-200"
            />
            <p className="text-xs text-secondary-500 mt-1 flex items-center space-x-1">
              <Icon name="Info" size={12} />
              <span>Recommended size: 1200x630px. Used when sharing on social media.</span>
            </p>
          </div>

          {/* Twitter Handle */}
          <div>
            <label className="block text-sm font-semibold text-primary-700 dark:text-primary-300 mb-2">
              Twitter/X Handle
            </label>
            <div className="relative">
              <input
                type="text"
                value={twitterHandle}
                onChange={(e) => onChange({ ...settings, twitter_handle: e.target.value })}
                placeholder="@username"
                className="w-full pl-10 pr-4 py-3 border border-primary-200 dark:border-primary-700 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent dark:bg-background dark:text-primary-200"
              />
              <Icon name="X" size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400" />
            </div>
          </div>

          {/* Analytics Section */}
          <div className="md:col-span-2 mt-4">
            <div className="bg-gradient-to-br from-accent-50 to-cta-50 dark:from-accent-900/20 dark:to-cta-900/20 border-2 border-dashed border-accent-300 dark:border-accent-700 rounded-xl p-6">
              <h3 className="text-lg font-bold text-primary-800 dark:text-primary-200 mb-4 flex items-center space-x-2">
                <Icon name="BarChart" size={20} className="text-accent" />
                <span>Analytics & Tracking</span>
              </h3>
              
              <div className="space-y-4">
                {/* Google Analytics */}
                <div>
                  <label className="block text-sm font-semibold text-primary-700 dark:text-primary-300 mb-2">
                    Google Analytics ID (GA4)
                  </label>
                  <input
                    type="text"
                    value={googleAnalyticsId}
                    onChange={(e) => onChange({ ...settings, google_analytics_id: e.target.value })}
                    placeholder="G-XXXXXXXXXX"
                    className="w-full px-4 py-3 border border-primary-200 dark:border-primary-700 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-white dark:bg-background dark:text-primary-200"
                  />
                  <p className="text-xs text-secondary-500 mt-1">
                    Find this in your Google Analytics property settings
                  </p>
                </div>

                {/* Google Site Verification */}
                <div>
                  <label className="block text-sm font-semibold text-primary-700 dark:text-primary-300 mb-2">
                    Google Site Verification Code
                  </label>
                  <input
                    type="text"
                    value={googleSiteVerification}
                    onChange={(e) => onChange({ ...settings, google_site_verification: e.target.value })}
                    placeholder="abcdefghijklmnopqrstuvwxyz"
                    className="w-full px-4 py-3 border border-primary-200 dark:border-primary-700 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-white dark:bg-background dark:text-primary-200"
                  />
                  <p className="text-xs text-secondary-500 mt-1">
                    Required for Google Search Console verification
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* SEO Tips */}
          <div className="md:col-span-2 mt-4">
            <div className="bg-white dark:bg-surface border-2 border-primary-200 dark:border-primary-700 rounded-xl p-6">
              <h3 className="text-lg font-bold text-primary-800 dark:text-primary-200 mb-4 flex items-center space-x-2">
                <Icon name="Lightbulb" size={20} className="text-accent" />
                <span>SEO Best Practices</span>
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-primary-700 flex items-center space-x-2">
                    <Icon name="CheckCircle" size={16} className="text-success" />
                    <span>Do's</span>
                  </h4>
                  <ul className="space-y-2 text-sm text-secondary-700">
                    <li className="flex items-start space-x-2">
                      <span className="text-success mt-0.5">•</span>
                      <span>Use descriptive, keyword-rich titles</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-success mt-0.5">•</span>
                      <span>Write unique meta descriptions for each page</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-success mt-0.5">•</span>
                      <span>Include your main keywords naturally</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-success mt-0.5">•</span>
                      <span>Keep titles under 60 characters</span>
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-primary-700 flex items-center space-x-2">
                    <Icon name="XCircle" size={16} className="text-error" />
                    <span>Don'ts</span>
                  </h4>
                  <ul className="space-y-2 text-sm text-secondary-700">
                    <li className="flex items-start space-x-2">
                      <span className="text-error mt-0.5">•</span>
                      <span>Don't keyword stuff or spam</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-error mt-0.5">•</span>
                      <span>Avoid duplicate content across pages</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-error mt-0.5">•</span>
                      <span>Don't use generic descriptions like "My Portfolio"</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-error mt-0.5">•</span>
                      <span>Avoid very long meta descriptions</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SEOSettingsTab;
