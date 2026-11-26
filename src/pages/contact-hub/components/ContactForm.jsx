import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import Icon from 'components/AppIcon';
import TurnstileField, { turnstileSiteKey } from 'components/TurnstileField';
import { useToast } from 'context/ToastContext';
import { submitContactForm } from 'services/contactService';
import { useI18n } from 'i18n/I18nContext';
import { budgetOptions as rangesFor, CURRENCIES, currencyOfBudget, defaultCurrency } from 'lib/budget.mjs';

const INQUIRY_OPTIONS = [
  { id: 'project', label: 'contact.form.typeProject', icon: 'Briefcase' },
  { id: 'general', label: 'contact.form.typeGeneral', icon: 'MessageCircle' },
];

const ContactForm = ({ selectedInquiryType, onInquiryTypeChange, initialSubject = '' }) => {
  const { error: showError } = useToast();
  const { t, lang } = useI18n();
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
  
  // Budget ranges in Egyptian pounds or US dollars (EGP first on /ar).
  const [currency, setCurrency] = useState(() => defaultCurrency(lang));
  const subjectTouched = useRef(false);

  // Coming from a service card (?service=...): the subject names the service.
  useEffect(() => {
    if (!initialSubject || subjectTouched.current) return;
    setFormData((prev) => (prev.subject ? prev : { ...prev, subject: initialSubject }));
  }, [initialSubject]);

  const changeCurrency = (next) => {
    setCurrency(next);
    setFormData((prev) => {
      const owner = currencyOfBudget(prev.budget);
      return owner && owner !== next ? { ...prev, budget: '' } : prev;
    });
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [turnstileToken, setTurnstileToken] = useState('');
  const captchaEnabled = Boolean(turnstileSiteKey());

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Errors hold i18n keys; they are translated when shown, so switching
    // language mid-form translates them too.
    if (!formData.name.trim()) newErrors.name = 'contact.form.errName';
    if (!formData.email.trim()) newErrors.email = 'contact.form.errEmail';
    else if (!isValidEmail(formData.email)) newErrors.email = 'contact.form.errEmailInvalid';
    if (!formData.subject.trim()) newErrors.subject = 'contact.form.errSubject';
    if (!formData.message.trim()) newErrors.message = 'contact.form.errMessage';
    
    if (selectedInquiryType === 'project') {
      if (!formData.budget) newErrors.budget = 'contact.form.errBudget';
      if (!formData.timeline) newErrors.timeline = 'contact.form.errTimeline';
    }
    if (captchaEnabled && !turnstileToken) newErrors.captcha = 'contact.form.errCaptcha';
    
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
        turnstileToken,
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
        // Server messages are English and technical; Arabic visitors get the plain version.
        showError(lang === 'en' && result.error ? result.error : t('contact.form.sendFailed'));
      }
    } catch (error) {
      setIsSubmitting(false);
      showError(t('contact.form.unexpected'));
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
    if (name === 'subject') subjectTouched.current = true;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const getFormTitle = () => {
    const titles = {
      project: t('contact.form.titleProject'),
      collaboration: t('contact.form.titleCollab'),
      speaking: t('contact.form.titleSpeaking'),
      general: t('contact.form.titleGeneral')
    };
    return titles[selectedInquiryType] || t('contact.form.title');
  };

  const budgetOptions = [
    { value: '', label: t('contact.form.budgetSelect') },
    ...rangesFor(currency, lang),
  ];

  const timelineOptions = [
    { value: '', label: t('contact.form.timelineSelect') },
    { value: 'asap', label: t('contact.form.timelineAsap') },
    { value: '1-month', label: t('contact.form.timeline1m') },
    { value: '2-3-months', label: t('contact.form.timeline2to3') },
    { value: '3-6-months', label: t('contact.form.timeline3to6') },
    { value: 'flexible', label: t('contact.form.timelineFlexible') }
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
        <h3 className="text-2xl font-bold text-text-primary mb-4">{t('contact.form.sentTitle')}</h3>
        <p className="text-text-secondary mb-6">
          {t('contact.form.sentBody')}
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-surface dark:bg-surface rounded-2xl shadow-lg p-8 border border-border dark:border-border-strong"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-text-primary mb-2">{getFormTitle()}</h2>
        <p className="text-text-secondary">
          {t('contact.form.intro')}
        </p>
      </div>

      {onInquiryTypeChange && (
        <fieldset className="mb-8">
          <legend className="block text-sm font-medium text-text-primary mb-2">{t('contact.form.about')}</legend>
          <div className="inline-flex flex-wrap gap-2 p-1 rounded-xl bg-background border border-border dark:border-border-strong">
            {INQUIRY_OPTIONS.map((option) => {
              const active = selectedInquiryType === option.id;
              return (
                <label
                  key={option.id}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors focus-within:ring-2 focus-within:ring-accent ${
                    active
                      ? 'bg-accent text-white dark:bg-accent-fill'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <input
                    type="radio"
                    name="inquiryType"
                    value={option.id}
                    checked={active}
                    onChange={() => onInquiryTypeChange(option.id)}
                    className="sr-only"
                  />
                  <Icon name={option.icon} size={16} strokeWidth={2} />
                  {t(option.label)}
                </label>
              );
            })}
          </div>
        </fieldset>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-2">
              {t('contact.form.name')} *
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
              placeholder={t('contact.form.namePlaceholder')}
              dir="auto"
              required
              aria-required="true"
              aria-invalid={errors.name ? 'true' : 'false'}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-error flex items-center">
                <Icon name="AlertCircle" size={14} className="me-1" strokeWidth={2} />
                {t(errors.name)}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
              {t('contact.form.email')} *
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
              dir="ltr"
              required
              aria-required="true"
              aria-invalid={errors.email ? 'true' : 'false'}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-error flex items-center">
                <Icon name="AlertCircle" size={14} className="me-1" strokeWidth={2} />
                {t(errors.email)}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-text-primary mb-2">
              {t('contact.form.company')}
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-border dark:border-border-strong rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors bg-background dark:bg-background"
              placeholder={t('contact.form.companyPlaceholder')}
              dir="auto"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-text-primary mb-2">
              {t('contact.form.phone')}
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-border dark:border-border-strong rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors bg-background dark:bg-background"
              placeholder="+20 10 0000 0000"
              dir="ltr"
            />
          </div>
        </div>

        {/* Project-specific fields */}
        {selectedInquiryType === 'project' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between gap-3 mb-2">
                <label htmlFor="budget" className="block text-sm font-medium text-text-primary">
                  {t('contact.form.budget')} *
                </label>
                <div role="radiogroup" aria-label={t('contact.form.currency')} className="inline-flex rounded-lg border border-border dark:border-border-strong p-0.5 text-xs font-semibold" data-budget-currency>
                  {CURRENCIES.map((code) => (
                    <button
                      key={code}
                      type="button"
                      role="radio"
                      aria-checked={currency === code}
                      onClick={() => changeCurrency(code)}
                      className={`px-2.5 py-1 rounded-md transition-colors ${
                        currency === code ? 'bg-accent text-white dark:bg-accent-fill' : 'text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      {t(code === 'EGP' ? 'contact.form.currencyEgp' : 'contact.form.currencyUsd')}
                    </button>
                  ))}
                </div>
              </div>
              <select
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors bg-background dark:bg-background ${
                  errors.budget ? 'border-error' : 'border-border dark:border-border-strong'
                }`}
                required
                aria-required="true"
                aria-invalid={errors.budget ? 'true' : 'false'}
              >
                {budgetOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.budget && (
                <p className="mt-1 text-sm text-error flex items-center">
                  <Icon name="AlertCircle" size={14} className="me-1" strokeWidth={2} />
                  {t(errors.budget)}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="timeline" className="block text-sm font-medium text-text-primary mb-2">
                {t('contact.form.timeline')} *
              </label>
              <select
                id="timeline"
                name="timeline"
                value={formData.timeline}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors bg-background dark:bg-background ${
                  errors.timeline ? 'border-error' : 'border-border dark:border-border-strong'
                }`}
                required
                aria-required="true"
                aria-invalid={errors.timeline ? 'true' : 'false'}
              >
                {timelineOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.timeline && (
                <p className="mt-1 text-sm text-error flex items-center">
                  <Icon name="AlertCircle" size={14} className="me-1" strokeWidth={2} />
                  {t(errors.timeline)}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Subject and Message */}
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-text-primary mb-2">
            {t('contact.form.subject')} *
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
            placeholder={t('contact.form.subjectPlaceholder')}
            dir="auto"
            required
            aria-required="true"
            aria-invalid={errors.subject ? 'true' : 'false'}
          />
          {errors.subject && (
            <p className="mt-1 text-sm text-error flex items-center">
              <Icon name="AlertCircle" size={14} className="me-1" strokeWidth={2} />
              {t(errors.subject)}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-text-primary mb-2">
            {t('contact.form.message')} *
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
            placeholder={t('contact.form.messagePlaceholder')}
            dir="auto"
            required
            aria-required="true"
            aria-invalid={errors.message ? 'true' : 'false'}
          />
          {errors.message && (
            <p className="mt-1 text-sm text-error flex items-center">
              <Icon name="AlertCircle" size={14} className="me-1" strokeWidth={2} />
              {t(errors.message)}
            </p>
          )}
          <p className="mt-2 text-sm text-muted">
            {t('contact.form.chars', { n: formData.message.length, max: 1000 })}
          </p>
        </div>

        {captchaEnabled && (
          <div>
            <TurnstileField onToken={setTurnstileToken} />
            {errors.captcha && (
              <p className="mt-1 text-sm text-error flex items-center">
                <Icon name="AlertCircle" size={14} className="me-1" strokeWidth={2} />
                {t(errors.captcha)}
              </p>
            )}
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-accent hover:bg-accent-600 disabled:bg-secondary-400 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 rtl:space-x-reverse"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>{t('contact.form.sending')}</span>
              </>
            ) : (
              <>
                <Icon name="Send" size={18} strokeWidth={2} />
                <span>{t('contact.form.send')}</span>
              </>
            )}
          </button>
        </div>

        {/* Privacy Notice */}
        <div className="text-sm text-muted text-center">
          <p>
            {t('contact.form.privacy')}
          </p>
        </div>
      </form>
    </motion.div>
  );
};

ContactForm.propTypes = {
  selectedInquiryType: PropTypes.oneOf(['project', 'collaboration', 'speaking', 'general']).isRequired,
  onInquiryTypeChange: PropTypes.func,
  initialSubject: PropTypes.string,
};

export default ContactForm;