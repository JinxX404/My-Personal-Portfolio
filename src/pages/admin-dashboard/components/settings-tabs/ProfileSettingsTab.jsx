import React, { useState } from 'react';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import { uploadImage } from 'services/storageService';
import { supabase, isSupabaseConfigured } from 'lib/supabase';

const ProfileSettingsTab = ({ settings, onChange, freelanceProjects, onFreelanceProjectsChange }) => {
  const [uploadingCv, setUploadingCv] = useState(false);

  const handleImageUpload = async (file, field) => {
    const result = await uploadImage(file, 'profile', field);
    if (!result.success) {
      console.error('Error uploading image:', result.error);
    }
    return result.data;
  };

  const handleCvUpload = async (file) => {
    if (!file || !isSupabaseConfigured()) return;
    
    const allowedTypes = ['application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a PDF file');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }
    
    setUploadingCv(true);
    
    try {
      const fileName = `cv/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const { data, error } = await supabase.storage
        .from('portfolio-assets')
        .upload(fileName, file, {
          contentType: file.type,
          upsert: true
        });
      
      if (error) throw error;
      
      const { data: urlData } = supabase.storage
        .from('portfolio-assets')
        .getPublicUrl(fileName);
      
      onChange({ ...settings, cv_url: urlData.publicUrl });
    } catch (error) {
      console.error('Error uploading CV:', error);
      alert('Failed to upload CV. Please try again.');
    } finally {
      setUploadingCv(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-primary-800 mb-6 flex items-center space-x-3">
          <Icon name="User" size={24} className="text-accent" />
          <span>Profile Information</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Avatar Upload */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-primary-700 mb-2">
              Profile Avatar
            </label>
            <div className="flex items-center space-x-6">
              <div className="relative">
                <Image
                  src={settings.avatar || 'https://via.placeholder.com/150'}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full object-cover border-4 border-accent shadow-lg"
                />
                <label className="absolute bottom-0 right-0 bg-accent text-white p-2 rounded-full cursor-pointer hover:bg-accent-700 transition-colors">
                  <Icon name="Camera" size={16} />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const url = await handleImageUpload(file, 'avatars');
                        if (url) onChange({ ...settings, avatar: url });
                      }
                    }}
                  />
                </label>
              </div>
              <div className="flex-1">
                <p className="text-sm text-secondary-600 mb-2">
                  Upload a professional photo. Recommended size: 400x400px
                </p>
                <input
                  type="text"
                  value={settings.avatar}
                  onChange={(e) => onChange({ ...settings, avatar: e.target.value })}
                  placeholder="Or paste image URL"
                  className="w-full px-4 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-primary-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              value={settings.full_name}
              onChange={(e) => onChange({ ...settings, full_name: e.target.value })}
              placeholder="John Doe"
              className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-primary-700 mb-2">
              Professional Title *
            </label>
            <input
              type="text"
              value={settings.title}
              onChange={(e) => onChange({ ...settings, title: e.target.value })}
              placeholder="Full Stack Developer"
              className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>

          {/* Tagline */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-primary-700 mb-2">
              Tagline / Headline
            </label>
            <input
              type="text"
              value={settings.tagline}
              onChange={(e) => onChange({ ...settings, tagline: e.target.value })}
              placeholder="Crafting Digital Experiences That Matter"
              className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>

          {/* Bio */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-primary-700 mb-2">
              Bio / About
            </label>
            <textarea
              value={settings.bio}
              onChange={(e) => onChange({ ...settings, bio: e.target.value })}
              placeholder="Tell your story..."
              rows="6"
              className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-primary-700 mb-2">
              Email Address *
            </label>
            <div className="relative">
              <input
                type="email"
                value={settings.email}
                onChange={(e) => onChange({ ...settings, email: e.target.value })}
                placeholder="john@example.com"
                className="w-full pl-12 pr-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
              />
              <Icon name="Mail" size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary-400" />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-primary-700 mb-2">
              Phone Number
            </label>
            <div className="relative">
              <input
                type="tel"
                value={settings.phone}
                onChange={(e) => onChange({ ...settings, phone: e.target.value })}
                placeholder="+1 (555) 123-4567"
                className="w-full pl-12 pr-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
              />
              <Icon name="Phone" size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary-400" />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-primary-700 mb-2">
              Location
            </label>
            <div className="relative">
              <input
                type="text"
                value={settings.location}
                onChange={(e) => onChange({ ...settings, location: e.target.value })}
                placeholder="San Francisco, CA"
                className="w-full pl-12 pr-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
              />
              <Icon name="MapPin" size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary-400" />
            </div>
          </div>

          {/* Availability Status */}
          <div>
            <label className="block text-sm font-semibold text-primary-700 mb-2">
              Availability Status
            </label>
            <select
              value={settings.availability}
              onChange={(e) => onChange({ ...settings, availability: e.target.value })}
              className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
            >
              <option value="available">✅ Available for hire</option>
              <option value="busy">⚠️ Busy (Limited availability)</option>
              <option value="unavailable">❌ Not available</option>
            </select>
          </div>

          {/* Freelance Projects Count */}
          <div>
            <label className="block text-sm font-semibold text-primary-700 mb-2">
              Freelance Projects Count
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                value={freelanceProjects || 0}
                onChange={(e) => onFreelanceProjectsChange(parseInt(e.target.value) || 0)}
                placeholder="e.g., 10"
                className="w-full pl-12 pr-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
              />
              <Icon name="Briefcase" size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary-400" />
            </div>
            <p className="text-xs text-secondary-500 mt-1">Displayed in hero section stats</p>
          </div>

          {/* Resume/CV URLs */}
          <div className="md:col-span-2 bg-gradient-to-br from-accent-50 to-cta-50 dark:from-accent-900/20 dark:to-cta-900/20 border-2 border-dashed border-accent-300 dark:border-accent/30 rounded-xl p-6">
            <h3 className="text-lg font-bold text-primary-800 dark:text-white mb-4 flex items-center space-x-2">
              <Icon name="FileText" size={20} className="text-accent" />
              <span>CV / Resume</span>
            </h3>
            
            {/* CV Upload */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-primary-700 dark:text-white mb-2">
                Upload CV (PDF)
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex-1 cursor-pointer">
                  <div className={`flex items-center justify-center px-6 py-4 border-2 border-dashed border-accent-300 dark:border-accent/50 rounded-lg bg-white dark:bg-white/5 hover:bg-accent-50 dark:hover:bg-accent-900/20 transition-colors ${uploadingCv ? 'opacity-50' : ''}`}>
                    {uploadingCv ? (
                      <div className="flex items-center space-x-2">
                        <Icon name="Loader" size={20} className="animate-spin text-accent" />
                        <span className="text-sm text-secondary-600">Uploading...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Icon name="Upload" size={20} className="text-accent" />
                        <span className="text-sm text-secondary-600">
                          {settings.cv_url ? 'Replace CV' : 'Choose PDF file'}
                        </span>
                      </div>
                    )}
                    <input
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={(e) => handleCvUpload(e.target.files[0])}
                      disabled={uploadingCv}
                    />
                  </div>
                </label>
                {settings.cv_url && (
                  <a
                    href={settings.cv_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-12 h-12 bg-accent text-white rounded-lg hover:bg-accent-700 transition-colors shadow-md"
                    title="View current CV"
                  >
                    <Icon name="ExternalLink" size={20} />
                  </a>
                )}
              </div>
              {settings.cv_url && (
                <div className="mt-3 flex items-center space-x-2 p-3 bg-success-50 dark:bg-success-900/20 rounded-lg">
                  <Icon name="CheckCircle" size={16} className="text-success" />
                  <span className="text-sm text-success-700 dark:text-success-400">CV uploaded successfully</span>
                </div>
              )}
              <p className="text-xs text-secondary-600 mt-2">PDF only, max 10MB</p>
            </div>
            
            {/* Manual URL input as fallback */}
            <div className="border-t border-accent/20 pt-4 mt-4">
              <label className="block text-sm font-semibold text-primary-700 dark:text-white mb-2">
                Or paste CV URL manually
              </label>
              <input
                type="url"
                value={settings.cv_url}
                onChange={(e) => onChange({ ...settings, cv_url: e.target.value })}
                placeholder="https://example.com/cv.pdf"
                className="w-full px-4 py-3 border border-primary-200 dark:border-white/20 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-white dark:bg-white/5 text-text-primary dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingsTab;
