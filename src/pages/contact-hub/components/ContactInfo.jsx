import React from 'react';
import { motion } from 'framer-motion';
import Icon from 'components/AppIcon';
import { usePortfolioSettings } from 'context/PortfolioSettingsContext';

const ContactInfo = () => {
  const { profile } = usePortfolioSettings();

  const contactMethods = [
    profile?.email && {
      icon: 'Mail',
      title: 'Email',
      value: profile.email,
      description: 'Best for detailed inquiries',
      action: `mailto:${profile.email}`,
      color: 'accent'
    },
    profile?.phone && {
      icon: 'Phone',
      title: 'Phone',
      value: profile.phone,
      description: 'Available Mon-Fri, 9AM-6PM EST',
      action: `tel:${profile.phone.replace(/[^0-9]/g, '')}`,
      color: 'success'
    },
    profile?.location && {
      icon: 'MapPin',
      title: 'Location',
      value: profile.location,
      description: 'Let\'s meet or work remotely',
      action: '#',
      color: 'warning'
    }
  ].filter(Boolean);

  const responseTime = {
    email: '< 24 hours',
    phone: 'Same day',
    urgent: '< 4 hours'
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-2xl shadow-lg p-8"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-primary-800 mb-2">Get in Touch</h2>
        <p className="text-secondary-600">
          Choose the method that works best for you. I'm here to help bring your ideas to life.
        </p>
      </div>

      <div className="space-y-6">
        {contactMethods.map((method, index) => (
          <motion.a
            key={method.title}
            href={method.action}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-start space-x-4 p-4 rounded-lg hover:bg-primary-50 transition-colors duration-200 group"
          >
            <div className={`w-12 h-12 bg-${method.color}/10 rounded-lg flex items-center justify-center group-hover:bg-${method.color}/20 transition-colors duration-200`}>
              <Icon 
                name={method.icon} 
                size={20} 
                className={`text-${method.color}`}
                strokeWidth={2} 
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-primary-800 mb-1">{method.title}</h3>
              <p className="text-primary-700 font-medium mb-1">{method.value}</p>
              <p className="text-sm text-secondary-600">{method.description}</p>
            </div>
            <Icon 
              name="ExternalLink" 
              size={16} 
              className="text-secondary-400 group-hover:text-secondary-600 transition-colors duration-200" 
              strokeWidth={2}
            />
          </motion.a>
        ))}
      </div>

      {/* Response Time Information */}
      <div className="mt-8 pt-6 border-t border-primary-200">
        <h3 className="font-semibold text-primary-800 mb-4">Response Times</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Icon name="Mail" size={14} className="text-accent" strokeWidth={2} />
              <span className="text-secondary-600">Email inquiries</span>
            </div>
            <span className="font-medium text-primary-700">{responseTime.email}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Icon name="Phone" size={14} className="text-success" strokeWidth={2} />
              <span className="text-secondary-600">Phone calls</span>
            </div>
            <span className="font-medium text-primary-700">{responseTime.phone}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Icon name="Zap" size={14} className="text-warning" strokeWidth={2} />
              <span className="text-secondary-600">Urgent matters</span>
            </div>
            <span className="font-medium text-primary-700">{responseTime.urgent}</span>
          </div>
        </div>
      </div>

      {/* Availability Status */}
      {profile?.availability && (
        <div className={`mt-6 p-4 rounded-lg border ${
          profile.availability === 'available' ? 'bg-success-50 border-success-200' :
          profile.availability === 'busy' ? 'bg-warning-50 border-warning-200' :
          'bg-secondary-50 border-secondary-200'
        }`}>
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${
              profile.availability === 'available' ? 'bg-success animate-pulse' :
              profile.availability === 'busy' ? 'bg-warning' :
              'bg-secondary-400'
            }`}></div>
            <div>
              <p className={`text-sm font-medium ${
                profile.availability === 'available' ? 'text-success-800' :
                profile.availability === 'busy' ? 'text-warning-800' :
                'text-secondary-800'
              }`}>
                {profile.availability === 'available' ? 'Currently Available' :
                 profile.availability === 'busy' ? 'Limited Availability' :
                 'Currently Unavailable'}
              </p>
              <p className={`text-xs ${
                profile.availability === 'available' ? 'text-success-600' :
                profile.availability === 'busy' ? 'text-warning-600' :
                'text-secondary-600'
              }`}>
                {profile.availability === 'available' ? 'Accepting new projects' :
                 profile.availability === 'busy' ? 'Selected projects only' :
                 'Not taking new projects at this time'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Calendar Integration */}
      <div className="mt-6">
        <button className="w-full bg-gradient-to-r from-accent to-cta text-white font-semibold py-3 px-4 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2">
          <Icon name="Calendar" size={18} strokeWidth={2} />
          <span>Schedule a Free Consultation</span>
        </button>
        <p className="text-xs text-secondary-500 text-center mt-2">
          30-minute discovery call to discuss your project
        </p>
      </div>
    </motion.div>
  );
};

export default ContactInfo;