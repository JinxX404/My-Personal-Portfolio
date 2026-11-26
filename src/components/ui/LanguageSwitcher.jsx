import React from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';
import { rememberLanguage, useI18n } from 'i18n/I18nContext';

// Each language's name is written in that language, so it is findable by
// someone who cannot read the current page.
const TARGET = {
  en: { lang: 'ar', label: 'العربية' },
  ar: { lang: 'en', label: 'English' },
};

/** Link to the same page in the other language. Remembers the choice. */
const LanguageSwitcher = ({ variant = 'compact', className = '', onNavigate }) => {
  const { lang, t, switchPath } = useI18n();
  const target = TARGET[lang] || TARGET.en;
  const to = switchPath(target.lang);

  const handleClick = () => {
    rememberLanguage(target.lang);
    onNavigate?.();
  };

  if (variant === 'row') {
    return (
      <Link
        to={to}
        onClick={handleClick}
        hrefLang={target.lang}
        className={`flex items-center justify-between w-full px-4 py-3 rounded-lg border border-border dark:border-border-strong/60 text-text-primary hover:bg-surface/70 dark:hover:bg-background/60 transition-theme ${className}`}
      >
        <span className="flex items-center gap-3">
          <Icon name="Globe" size={18} strokeWidth={2} />
          <span className="text-sm text-text-secondary">{t('language.label')}</span>
        </span>
        <span lang={target.lang} className="font-semibold">{target.label}</span>
      </Link>
    );
  }

  return (
    <Link
      to={to}
      onClick={handleClick}
      hrefLang={target.lang}
      aria-label={t('language.switchTo', { language: target.label })}
      title={t('language.switchTo', { language: target.label })}
      className={`inline-flex items-center gap-1.5 h-10 px-3 rounded-full border border-border bg-surface/80 text-sm font-semibold text-text-primary shadow-sm transition-theme hover:border-accent-500 hover:text-accent-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-200 dark:border-border-strong dark:bg-surface-elevated/90 dark:hover:border-accent-fill dark:hover:text-accent-text ${className}`}
    >
      <Icon name="Globe" size={16} strokeWidth={2} />
      <span lang={target.lang}>{target.label}</span>
    </Link>
  );
};

export default LanguageSwitcher;
