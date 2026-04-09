import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import Icon from 'components/AppIcon';
import { useToast } from 'context/ToastContext';
import { submitContactForm } from 'services/contactService';

const ContactForm = ({ selectedInquiryType }) => {
  const { error: showError } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    subject: '',
    message: '',
    budget: '',
    timeline: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!isValidEmail(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    
    if (selectedInquiryType === 'project') {
      if (!formData.budget) newErrors.budget = 'Budget range is required';
      if (!formData.timeline) newErrors.timeline = 'Timeline is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const timeoutRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const result = await submitContactForm({
        ...formData,
        inquiryType: selectedInquiryType,
      });
      
      if (result.success) {
        setIsSubmitting(false);
        setIsSubmitted(true);
        
        timeoutRef.current = setTimeout(() => {
          setIsSubmitted(false);
          setFormData({
            name: '',
            email: '',
            company: '',
            phone: '',
            subject: '',
            message: '',
            budget: '',
            timeline: ''
          });
        }, 3000);
      } else {
        setIsSubmitting(false);
        showError(result.error || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      setIsSubmitting(false);
      showError('An unexpected error occurred. Please try again.');
    }
  };

  // Cleanup timeout on component unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const getFormTitle = () => {
    const titles = {
      project: 'Project Details',
      collaboration: 'Collaboration Inquiry',
      speaking: 'Speaking Request',
      general: 'General Inquiry'
    };
    return titles[selectedInquiryType] || 'Contact Form';
  };

  const budgetOptions = [
    { value: '', label: 'Select budget range' },
    { value: 'under-5k', label: 'Under $5,000' },
    { value: '5k-15k', label: '$5,000 - $15,000' },
    { value: '15k-50k', label: '$15,000 - $50,000' },
    { value: 'over-50k', label: 'Over $50,000' },
    { value: 'discuss', label: 'Let\'s discuss' }
  ];

  const timelineOptions = [
    { value: '', label: 'Select timeline' },
    { value: 'asap', label: 'ASAP' },
    { value: '1-month', label: 'Within 1 month' },
    { value: '2-3-months', label: '2-3 months' },
    { value: '3-6-months', label: '3-6 months' },
    { value: 'flexible', label: 'Flexible' }
  ];

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-surface dark:bg-surface rounded-2xl shadow-lg p-8 text-center border border-border dark:border-border-strong"
      >
        <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon name="CheckCircle" size={32} color="white" strokeWidth={2} />
        </div>
        <h3 className="text-2xl font-bold text-text-primary mb-4">Message Sent!</h3>
        <p className="text-text-secondary mb-6">
          Thank you for reaching out. I'll get back to you within 24 hours.
        </p>
        <div className="flex items-center justify-center space-x-2 text-sm text-muted">
          <Icon name="Clock" size={16} strokeWidth={2} />
          <span>Expected response time: 24 hours</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-surface dark:bg-surface rounded-2xl shadow-lg p-8 border border-border dark:border-border-strong"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-text-primary mb-2">{getFormTitle()}</h2>
        <p className="text-text-secondary">
          Fill out the form below and I'll get back to you as soon as possible.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-2">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors bg-background dark:bg-background ${
                errors.name ? 'border-error' : 'border-border dark:border-border-strong'
              }`}
              placeholder="Your full name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-error flex items-center">
                <Icon name="AlertCircle" size={14} className="mr-1" strokeWidth={2} />
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors bg-background dark:bg-background ${
                errors.email ? 'border-error' : 'border-border dark:border-border-strong'
              }`}
              placeholder="your@email.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-error flex items-center">
                <Icon name="AlertCircle" size={14} className="mr-1" strokeWidth={2} />
                {errors.email}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-text-primary mb-2">
              Company/Organization
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-border dark:border-border-strong rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors bg-background dark:bg-background"
              placeholder="Your company name"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-text-primary mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-border dark:border-border-strong rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors bg-background dark:bg-background"
              placeholder="+1 (555) 123-4567"
            />
          </div>
        </div>

        {/* Project-specific fields */}
        {selectedInquiryType === 'project' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-text-primary mb-2">
                Budget Range *
              </label>
              <select
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors bg-background dark:bg-background ${
                  errors.budget ? 'border-error' : 'border-border dark:border-border-strong'
                }`}
              >
                {budgetOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.budget && (
                <p className="mt-1 text-sm text-error flex items-center">
                  <Icon name="AlertCircle" size={14} className="mr-1" strokeWidth={2} />
                  {errors.budget}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="timeline" className="block text-sm font-medium text-text-primary mb-2">
                Project Timeline *
              </label>
              <select
                id="timeline"
                name="timeline"
                value={formData.timeline}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors bg-background dark:bg-background ${
                  errors.timeline ? 'border-error' : 'border-border dark:border-border-strong'
                }`}
              >
                {timelineOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.timeline && (
                <p className="mt-1 text-sm text-error flex items-center">
                  <Icon name="AlertCircle" size={14} className="mr-1" strokeWidth={2} />
                  {errors.timeline}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Subject and Message */}
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-text-primary mb-2">
            Subject *
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors bg-background dark:bg-background ${
              errors.subject ? 'border-error' : 'border-border dark:border-border-strong'
            }`}
            placeholder="Brief subject line"
          />
          {errors.subject && (
            <p className="mt-1 text-sm text-error flex items-center">
              <Icon name="AlertCircle" size={14} className="mr-1" strokeWidth={2} />
              {errors.subject}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-text-primary mb-2">
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            rows={6}
            value={formData.message}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors resize-vertical bg-background dark:bg-background ${
              errors.message ? 'border-error' : 'border-border dark:border-border-strong'
            }`}
            placeholder="Tell me more about your project, goals, or questions..."
          />
          {errors.message && (
            <p className="mt-1 text-sm text-error flex items-center">
              <Icon name="AlertCircle" size={14} className="mr-1" strokeWidth={2} />
              {errors.message}
            </p>
          )}
          <p className="mt-2 text-sm text-muted">
            {formData.message.length}/1000 characters
          </p>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-accent hover:bg-accent-600 disabled:bg-secondary-400 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Icon name="Send" size={18} strokeWidth={2} />
                <span>Send Message</span>
              </>
            )}
          </button>
        </div>

        {/* Privacy Notice */}
        <div className="text-sm text-muted text-center">
          <p>
            By submitting this form, you agree to our{' '}
            <a href="#" className="text-accent hover:text-accent-600 underline">
              Privacy Policy
            </a>
            . Your information is secure and will never be shared.
          </p>
        </div>
      </form>
    </motion.div>
  );
};

ContactForm.propTypes = {
  selectedInquiryType: PropTypes.oneOf(['project', 'collaboration', 'speaking', 'general']).isRequired
};

export default ContactForm;