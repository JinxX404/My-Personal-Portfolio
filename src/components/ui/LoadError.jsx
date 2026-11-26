import React from 'react';
import Icon from 'components/AppIcon';
import { useI18n } from 'i18n/I18nContext';

const LoadError = ({ title, message, onRetry }) => {
  const { t } = useI18n();
  const heading = title ?? t('loadError.title');
  const body = message === undefined ? t('loadError.message') : message;
  return (
  <div
    role="alert"
    className="rounded-xl border border-error/40 bg-error/5 px-6 py-8 text-center"
  >
    <Icon name="AlertCircle" size={28} className="mx-auto text-error mb-3" />
    <p className="text-lg font-semibold text-text-primary mb-2">{heading}</p>
    {body && <p dir="auto" className="text-sm text-text-secondary mb-4">{body}</p>}
    {onRetry && (
      <button type="button" onClick={onRetry} className="btn-primary inline-flex items-center">
        {t('loadError.retry')}
      </button>
    )}
  </div>
  );
};

export default LoadError;
