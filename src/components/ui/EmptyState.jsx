import React from 'react';
import Icon from 'components/AppIcon';

const EmptyState = ({ icon, title, description, actionLabel, onAction }) => (
  <div className="text-center py-12">
    <div className="w-16 h-16 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center mx-auto mb-4">
      <Icon name={icon} size={32} className="text-secondary-400" />
    </div>
    <h3 className="text-xl font-bold text-primary-800 dark:text-primary-200 mb-2">{title}</h3>
    {description && (
      <p className="text-secondary-600 dark:text-secondary-400 mb-6 max-w-md mx-auto">{description}</p>
    )}
    {actionLabel && onAction && (
      <button onClick={onAction} className="btn-primary inline-flex items-center gap-2">
        <Icon name="Plus" size={18} />
        {actionLabel}
      </button>
    )}
  </div>
);

export default EmptyState;
