// src/pages/admin-dashboard/components/QuickActions.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';

const QuickActions = () => {
  const navigate = useNavigate();

  const handleActionClick = (path, e) => {
    console.log('Action clicked:', path);
    if (path.startsWith('#')) {
      e.preventDefault();
      console.log('Hash link - no navigation');
    } else {
      navigate(path);
    }
  };

  const actions = [
    {
      name: 'New Blog Post',
      description: 'Create a new blog article',
      icon: 'Plus',
      path: '/blog-editor',
      color: 'bg-accent-500 hover:bg-accent-600',
      textColor: 'text-white'
    },
    {
      name: 'Add Project',
      description: 'Add new portfolio project',
      icon: 'FolderPlus',
      path: '#add-project',
      color: 'bg-cta-500 hover:bg-cta-600',
      textColor: 'text-white'
    },
    {
      name: 'Review Comments',
      description: 'Moderate pending comments',
      icon: 'MessageSquare',
      path: '#comments',
      color: 'bg-warning-500 hover:bg-warning-600',
      textColor: 'text-white'
    },
    {
      name: 'Site Analytics',
      description: 'View detailed analytics',
      icon: 'BarChart3',
      path: '#analytics',
      color: 'bg-success-500 hover:bg-success-600',
      textColor: 'text-white'
    },
    {
      name: 'Backup Site',
      description: 'Create site backup',
      icon: 'Download',
      path: '#backup',
      color: 'bg-secondary-500 hover:bg-secondary-600',
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
          <Icon name="Zap" size={20} strokeWidth={2} color="#3182ce" />
          <h2 className="text-lg font-semibold text-primary-800">Quick Actions</h2>
        </div>
        <p className="text-sm text-secondary-600 mt-1">Common tasks and shortcuts</p>
      </div>
      
      <div className="card-content">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {actions?.map((action, index) => (
            <Link
              key={index}
              to={action?.path}
              onClick={(e) => handleActionClick(action?.path, e)}
              className={`group flex items-center space-x-3 p-4 rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md cursor-pointer ${
                action?.color
              } ${action?.textColor}`}
              style={{ pointerEvents: 'auto', position: 'relative', zIndex: 1 }}
            >
              <div className="flex-shrink-0">
                <Icon 
                  name={action?.icon} 
                  size={20} 
                  strokeWidth={2}
                  color="currentColor"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold truncate">
                  {action?.name}
                </h3>
                <p className="text-xs opacity-90 truncate">
                  {action?.description}
                </p>
              </div>
              <div className="flex-shrink-0 opacity-75 group-hover:opacity-100 transition-opacity duration-200">
                <Icon 
                  name="ArrowRight" 
                  size={16} 
                  strokeWidth={2}
                  color="currentColor"
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