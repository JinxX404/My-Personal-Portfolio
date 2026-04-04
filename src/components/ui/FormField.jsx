import React from 'react';
import Icon from 'components/AppIcon';

const FormField = ({
  label,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  icon,
  multiline = false,
  rows = 3,
  maxLength,
  required = false,
  helpText,
  className = '',
  ...rest
}) => {
  const inputClasses = `
    w-full px-4 py-3 border rounded-lg
    focus:ring-2 focus:ring-accent focus:border-transparent
    transition-colors
    ${error ? 'border-error-500' : 'border-primary-200'}
    ${icon ? 'pl-10' : ''}
    ${className}
  `;

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-semibold text-primary-700 dark:text-primary-300 mb-2">
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {icon && (
          <Icon name={icon} size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" />
        )}
        {multiline ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            maxLength={maxLength}
            className={`${inputClasses} resize-vertical`}
            {...rest}
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            maxLength={maxLength}
            className={inputClasses}
            {...rest}
          />
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-error-500 flex items-center gap-1">
          <Icon name="AlertCircle" size={14} />
          {error}
        </p>
      )}

      {helpText && !error && (
        <p className="mt-1 text-xs text-secondary-500">{helpText}</p>
      )}
    </div>
  );
};

export default FormField;
