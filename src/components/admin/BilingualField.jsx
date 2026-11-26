import React, { useId } from 'react';
import Icon from 'components/AppIcon';

const hasText = (value) => typeof value === 'string' && value.trim().length > 0;

const INPUT =
  'w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors bg-white dark:bg-surface-elevated dark:border-border dark:text-text-primary';

/** Small "Arabic missing" flag shown when the English text exists but the Arabic does not. */
export const ArabicMissingBadge = ({ className = '' }) => (
  <span
    className={`inline-flex items-center gap-1 rounded-full bg-warning-50 px-2 py-0.5 text-[11px] font-semibold text-warning-800 dark:bg-warning-900/30 dark:text-warning ${className}`}
    title="The Arabic site shows the English text here until you add the Arabic."
  >
    <Icon name="Languages" size={12} />
    Arabic missing
  </span>
);

// The inputs have a fixed direction (EN ltr, AR rtl), so the tag and the room
// kept for it use physical sides: each tag sits where its text ends.
const LangTag = ({ children, side }) => (
  <span className={`pointer-events-none absolute top-2 ${side} rounded bg-secondary-100 px-1.5 text-[10px] font-bold tracking-wide text-secondary-600 dark:bg-surface dark:text-muted`}>
    {children}
  </span>
);

/**
 * English and Arabic inputs for one content field, side by side on wide
 * screens and stacked on narrow ones. English keeps the existing rules;
 * Arabic is optional and flagged when missing.
 */
const BilingualField = ({
  label,
  hint,
  required = false,
  value,
  valueAr,
  onChange,
  onChangeAr,
  multiline = false,
  rows = 3,
  placeholder = '',
  placeholderAr = '',
  maxLength,
  error,
  className = '',
  inputClassName = '',
  flagMissing = true,
}) => {
  const id = useId();
  const missing = flagMissing && hasText(value) && !hasText(valueAr);
  const Field = multiline ? 'textarea' : 'input';
  const common = {
    className: `${INPUT} ${multiline ? 'resize-y' : ''} ${inputClassName}`,
    ...(multiline ? { rows } : { type: 'text' }),
    ...(maxLength ? { maxLength } : {}),
  };

  return (
    <div className={className} data-bilingual-field>
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <label htmlFor={`${id}-en`} className="text-sm font-semibold text-text-secondary dark:text-text-secondary">
          {label}
          {required && ' *'}
          {hint && <span className="ms-1 font-normal text-secondary-600 dark:text-muted">{hint}</span>}
        </label>
        {missing && <ArabicMissingBadge />}
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="relative">
          <Field
            id={`${id}-en`}
            dir="ltr"
            lang="en"
            value={value || ''}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            aria-invalid={error ? 'true' : undefined}
            {...common}
            className={`${common.className} pr-10`}
          />
          <LangTag side="right-2">EN</LangTag>
          {maxLength ? (
            <span className="mt-1 block text-end text-[11px] text-secondary-500 dark:text-muted">
              {(value || '').length}/{maxLength}
            </span>
          ) : null}
        </div>
        <div className="relative">
          <Field
            id={`${id}-ar`}
            dir="rtl"
            lang="ar"
            value={valueAr || ''}
            onChange={(event) => onChangeAr(event.target.value)}
            placeholder={placeholderAr || 'بالعربية (اختياري)'}
            aria-label={`${label} (Arabic)`}
            {...common}
            className={`${common.className} pl-10`}
          />
          <LangTag side="left-2">AR</LangTag>
          {maxLength ? (
            <span className="mt-1 block text-end text-[11px] text-secondary-500 dark:text-muted">
              {(valueAr || '').length}/{maxLength}
            </span>
          ) : null}
        </div>
      </div>
      {error && <p className="mt-1 text-sm text-error-600 dark:text-error">{error}</p>}
    </div>
  );
};

export default BilingualField;
