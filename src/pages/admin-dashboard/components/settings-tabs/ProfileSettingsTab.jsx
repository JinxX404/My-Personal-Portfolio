import React from 'react';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import { supabase } from '../../../../lib/supabase';

const ProfileSettingsTab = ({ settings, onChange }) => {
  const handleImageUpload = async (file, field) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${field}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio-assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('portfolio-assets')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
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

          {/* Resume/CV URLs */}
          <div className="md:col-span-2 bg-gradient-to-br from-accent-50 to-cta-50 border-2 border-dashed border-accent-300 rounded-xl p-6">
            <h3 className="text-lg font-bold text-primary-800 mb-4 flex items-center space-x-2">
              <Icon name="FileText" size={20} className="text-accent" />
              <span>Documents & Files</span>
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-primary-700 mb-2">
                  Resume URL
                </label>
                <input
                  type="url"
                  value={settings.resume_url}
                  onChange={(e) => onChange({ ...settings, resume_url: e.target.value })}
                  placeholder="https://example.com/resume.pdf"
                  className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-primary-700 mb-2">
                  CV URL
                </label>
                <input
                  type="url"
                  value={settings.cv_url}
                  onChange={(e) => onChange({ ...settings, cv_url: e.target.value })}
                  placeholder="https://example.com/cv.pdf"
                  className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-white"
                />
              </div>
            </div>
            <p className="text-xs text-secondary-600 mt-3 flex items-center space-x-1">
              <Icon name="Info" size={14} />
              <span>Upload your documents to cloud storage and paste the public URLs here</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingsTab;
