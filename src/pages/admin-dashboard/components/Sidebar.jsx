// src/pages/admin-dashboard/components/Sidebar.jsx
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from 'components/AppIcon';
import ThemeToggle from 'components/ui/ThemeToggle';
import { countNewMessages, MESSAGES_CHANGED_EVENT } from 'services/messagesService';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [newMessages, setNewMessages] = useState(0);

  useEffect(() => {
    let active = true;
    const refresh = () => {
      countNewMessages().then((count) => {
        if (active) setNewMessages(count);
      });
    };
    refresh();
    window.addEventListener(MESSAGES_CHANGED_EVENT, refresh);
    return () => {
      active = false;
      window.removeEventListener(MESSAGES_CHANGED_EVENT, refresh);
    };
  }, []);

  const navigationItems = [
    {
      name: 'Dashboard',
      path: '/admin-dashboard',
      icon: 'LayoutDashboard',
      description: 'Overview & metrics'
    },
    {
      name: 'Projects Manager',
      path: '/projects-manager',
      icon: 'Briefcase',
      description: 'Manage projects'
    },
    {
      name: 'Messages',
      path: '/messages-manager',
      icon: 'Inbox',
      description: 'Contact form inbox',
      badge: newMessages
    },
    {
      name: 'Skills Manager',
      path: '/skills-manager',
      icon: 'Code2',
      description: 'Manage skills & tech'
    },
    {
      name: 'New Project',
      path: '/project-manager',
      icon: 'Plus',
      description: 'Create new project'
    },
    {
      name: 'Settings',
      path: '/settings-manager',
      icon: 'Settings',
      description: 'Site configuration'
    }
  ];

  const isActivePath = (path) => {
    return location.pathname === path;
  };
  return (
    <>
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-surface shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-primary-100 dark:border-border">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-accent to-cta rounded-lg flex items-center justify-center">
              <Icon name="Code2" size={16} color="white" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-primary-800 dark:text-text-primary">Admin Panel</h2>
              <p className="text-xs text-secondary-600 font-mono dark:text-text-secondary">Control Center</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar navigation"
            className="lg:hidden p-2 rounded-lg text-primary-600 hover:bg-primary-50 transition-colors duration-200 dark:text-text-secondary dark:hover:bg-surface-elevated"
          >
            <Icon name="X" size={20} strokeWidth={2} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navigationItems?.map((item) => (
            <Link
              key={item?.path}
              to={item?.path}
              onClick={onClose}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActivePath(item?.path)
                  ? 'bg-accent text-white shadow-md'
                  : 'text-primary-700 hover:bg-primary-50 hover:text-accent dark:text-text-secondary dark:hover:bg-surface-elevated dark:hover:text-accent-text'
              }`}
            >
              <Icon 
                name={item?.icon} 
                size={18} 
                strokeWidth={2}
                color={isActivePath(item?.path) ? 'white' : 'currentColor'}
              />
              <div className="flex-1">
                <div className="font-medium">{item?.name}</div>
                <div className={`text-xs mt-0.5 ${
                  isActivePath(item?.path) ? 'text-white/90' : 'text-secondary-500 dark:text-muted'
                }`}>
                  {item?.description}
                </div>
              </div>
              {item?.badge > 0 && (
                <span
                  className={`min-w-[1.5rem] h-6 px-2 rounded-full text-xs font-bold flex items-center justify-center ${
                    isActivePath(item?.path) ? 'bg-white text-accent' : 'bg-accent text-white dark:bg-accent-fill'
                  }`}
                  aria-label={`${item.badge} new`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Theme + Back to Site */}
        <div className="p-4 mt-4 border-t border-primary-100 dark:border-border space-y-3">
          <ThemeToggle variant="row" />
          <Link
            to="/"
            className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-primary-800 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 dark:bg-accent-fill dark:hover:bg-accent-fill-hover"
          >
            <Icon name="ExternalLink" size={16} strokeWidth={2} />
            <span className="text-sm font-medium">Back to Site</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Sidebar;