import React from 'react';
import Icon from 'components/AppIcon';

const LoadError = ({
  title = 'Could not load this content',
  message = 'Something went wrong while reading from the database.',
  onRetry,
}) => (
  <div
    role="alert"
    className="rounded-xl border border-error/40 bg-error/5 px-6 py-8 text-center"
  >
    <Icon name="AlertCircle" size={28} className="mx-auto text-error mb-3" />
    <p className="text-lg font-semibold text-text-primary mb-2">{title}</p>
    {message && <p className="text-sm text-text-secondary mb-4">{message}</p>}
    {onRetry && (
      <button type="button" onClick={onRetry} className="btn-primary inline-flex items-center">
        Try again
      </button>
    )}
  </div>
);

export default LoadError;
