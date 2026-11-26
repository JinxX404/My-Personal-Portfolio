// src/pages/admin-dashboard/components/RecentActivity.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';

const RecentActivity = ({ activities }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'comment':
        return 'MessageSquare';
      case 'project':
        return 'Briefcase';
      case 'form':
        return 'Mail';
      case 'system':
        return 'Settings';
      default:
        return 'Bell';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'comment':
        return 'bg-accent-100 dark:bg-accent-900/30 text-accent-600 dark:text-accent-text';
      case 'project':
        return 'bg-cta-100 dark:bg-cta-900/30 text-cta-600';
      case 'form':
        return 'bg-success-100 dark:bg-success-900/30 text-success-600 dark:text-success-text';
      case 'system':
        return 'bg-secondary-100 dark:bg-secondary-900/30 text-secondary-600';
      default:
        return 'bg-primary-100 dark:bg-primary-900/30 text-primary-600';
    }
  };

  return (
    <div className="card h-full">
      <div className="mb-4">
        <div className="flex items-center space-x-2">
          <Icon name="Activity" size={20} strokeWidth={2} className="text-accent dark:text-accent-text" />
          <h2 className="text-lg font-semibold text-primary-800 dark:text-text-primary">Recent Activity</h2>
        </div>
        <p className="text-sm text-secondary-600 dark:text-text-secondary mt-1">Latest project edits and messages</p>
      </div>
      
      <div>
        <div className="space-y-4">
          {(activities || []).map((activity) => {
            const body = (
              <>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  getActivityColor(activity.type)
                }`}>
                  <Icon
                    name={getActivityIcon(activity.type)}
                    size={16}
                    strokeWidth={2}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p dir="auto" className="text-sm font-medium text-primary-800 dark:text-text-primary truncate">
                    {activity.title || activity.message}
                  </p>
                  <p dir="ltr" className="text-xs text-secondary-500 mt-1 dark:text-muted">
                    {activity.detail && <bdi>{activity.detail}</bdi>}
                    {activity.detail && activity.time && ' · '}
                    {activity.time}
                  </p>
                </div>
              </>
            );
            const className = 'flex items-start space-x-3 p-3 rounded-lg border border-primary-100 dark:border-border bg-primary-50 dark:bg-background/40';
            return activity.to ? (
              <Link key={activity.id} to={activity.to} className={`${className} hover:border-accent transition-colors`}>
                {body}
              </Link>
            ) : (
              <div key={activity.id} className={className}>{body}</div>
            );
          })}
        </div>
        
        {(!activities || activities.length === 0) && (
          <div className="text-center py-8">
            <Icon name="Inbox" size={48} className="text-secondary-300 dark:text-secondary-600 mx-auto mb-4" strokeWidth={1} />
            <p className="text-secondary-500 text-sm dark:text-muted">No recent activity</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
