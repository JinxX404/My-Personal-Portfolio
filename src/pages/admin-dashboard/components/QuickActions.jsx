// src/pages/admin-dashboard/components/QuickActions.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';

const QuickActions = () => {
  const actions = [
    {
      name: 'New Project',
      description: 'Add new portfolio project',
      icon: 'FolderPlus',
      path: '/project-manager',
      color: 'bg-accent-500 hover:bg-accent-600',
      textColor: 'text-white'
    },
    {
      name: 'Manage Skills',
      description: 'Update your skills and tech stack',
      icon: 'Code',
      path: '/skills-manager',
      color: 'bg-cta-500 hover:bg-cta-600',
      textColor: 'text-white'
    },
    {
      name: 'Manage Projects',
      description: 'View and edit all projects',
      icon: 'Briefcase',
      path: '/projects-manager',
      color: 'bg-success-500 hover:bg-success-600',
      textColor: 'text-white'
    },
    {
      name: 'Settings',
      description: 'Configure portfolio settings',
      icon: 'Settings',
      path: '/settings-manager',
      color: 'bg-primary-500 hover:bg-primary-600',
      textColor: 'text-white'
    }
  ];

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center space-x-2">
          <Icon name="Zap" size={20} strokeWidth={2} className="text-accent" />
          <h2 className="text-lg font-semibold text-primary-800 dark:text-primary-200">Quick Actions</h2>
        </div>
        <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-1">Common tasks and shortcuts</p>
      </div>
      
      <div className="card-content">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {actions.map((action) => (
            <Link
              key={action.path}
              to={action.path}
              className={`group flex items-center space-x-3 p-4 rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md cursor-pointer ${
                action.color
              } ${action.textColor}`}
            >
              <div className="flex-shrink-0">
                <Icon 
                  name={action.icon} 
                  size={20} 
                  strokeWidth={2}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold truncate">
                  {action.name}
                </h3>
                <p className="text-xs opacity-90 truncate">
                  {action.description}
                </p>
              </div>
              <div className="flex-shrink-0 opacity-75 group-hover:opacity-100 transition-opacity duration-200">
                <Icon 
                  name="ArrowRight" 
                  size={16} 
                  strokeWidth={2}
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
