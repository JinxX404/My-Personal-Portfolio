// src/pages/admin-dashboard/components/MetricCard.jsx
import React from 'react';
import Icon from 'components/AppIcon';

const MetricCard = ({ 
  title, 
  value, 
  change, 
  changeType, 
  icon, 
  description,
  onClick 
}) => {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return 'text-success-600 bg-success-50 dark:text-success-text dark:bg-success-900/30';
      case 'negative':
        return 'text-error-600 bg-error-50 dark:text-error dark:bg-error-900/40';
      default:
        return 'text-secondary-600 bg-secondary-50 dark:text-muted dark:bg-surface-elevated';
    }
  };

  const getChangeIcon = () => {
    switch (changeType) {
      case 'positive':
        return 'TrendingUp';
      case 'negative':
        return 'TrendingDown';
      default:
        return 'Minus';
    }
  };

  return (
    <div
      className={`card hover:shadow-lg transition-all duration-300 ${
        onClick ? 'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent' : ''
      }`}
      onClick={onClick}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } } : undefined}
      role={onClick ? 'link' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-accent-50 dark:bg-accent-900/30 rounded-lg flex items-center justify-center">
              <Icon 
                name={icon} 
                size={24} 
                strokeWidth={2} 
                className="text-accent dark:text-accent-text"
              />
            </div>
            <div>
              <h3 className="text-sm font-medium text-secondary-600 dark:text-text-secondary">{title}</h3>
              <p className="text-2xl font-bold text-primary-800 mt-1 dark:text-text-primary">{value}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <p className="text-xs text-secondary-500 dark:text-muted">{description}</p>
          {change && (
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
              getChangeColor()
            }`}>
              <Icon 
                name={getChangeIcon()} 
                size={12} 
                strokeWidth={2}
              />
              <span>{change}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MetricCard;