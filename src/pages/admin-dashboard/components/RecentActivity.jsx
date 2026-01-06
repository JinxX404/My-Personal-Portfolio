// src/pages/admin-dashboard/components/RecentActivity.jsx
import React from 'react';
import Icon from 'components/AppIcon';

const RecentActivity = ({ activities, setActivities }) => {
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
        return 'bg-accent-100 text-accent-600';
      case 'project':
        return 'bg-cta-100 text-cta-600';
      case 'form':
        return 'bg-success-100 text-success-600';
      case 'system':
        return 'bg-secondary-100 text-secondary-600';
      default:
        return 'bg-primary-100 text-primary-600';
    }
  };

  const markAsRead = (activityId) => {
    setActivities(prev => 
      prev?.map(activity => 
        activity?.id === activityId 
          ? { ...activity, status: 'read' }
          : activity
      )
    );
  };

  const markAllAsRead = () => {
    setActivities(prev => 
      prev?.map(activity => ({ ...activity, status: 'read' }))
    );
  };

  const unreadCount = activities?.filter(activity => activity?.status === 'unread')?.length || 0;

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="Activity" size={20} strokeWidth={2} color="#3182ce" />
            <h2 className="text-lg font-semibold text-primary-800">Recent Activity</h2>
            {unreadCount > 0 && (
              <span className="bg-error-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs text-accent-600 hover:text-accent-700 font-medium"
            >
              Mark all read
            </button>
          )}
        </div>
        <p className="text-sm text-secondary-600 mt-1">Latest notifications and updates</p>
      </div>
      
      <div className="card-content">
        <div className="space-y-4">
          {activities?.map((activity) => (
            <div
              key={activity?.id}
              className={`flex items-start space-x-3 p-3 rounded-lg border transition-all duration-200 ${
                activity?.status === 'unread' ?'bg-accent-50 border-accent-200 hover:bg-accent-100' :'bg-primary-50 border-primary-100 hover:bg-primary-100'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                getActivityColor(activity?.type)
              }`}>
                <Icon 
                  name={getActivityIcon(activity?.type)} 
                  size={16} 
                  strokeWidth={2}
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${
                  activity?.status === 'unread' ?'font-medium text-primary-800' :'text-secondary-700'
                }`}>
                  {activity?.message}
                </p>
                <p className="text-xs text-secondary-500 mt-1">{activity?.time}</p>
              </div>
              
              <div className="flex items-center space-x-2 flex-shrink-0">
                {activity?.status === 'unread' && (
                  <button
                    onClick={() => markAsRead(activity?.id)}
                    className="text-xs text-accent-600 hover:text-accent-700 font-medium"
                  >
                    Mark read
                  </button>
                )}
                <button className="text-secondary-400 hover:text-secondary-600 transition-colors duration-200">
                  <Icon name="MoreVertical" size={16} strokeWidth={2} />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {activities?.length === 0 && (
          <div className="text-center py-8">
            <Icon name="Inbox" size={48} color="#cbd5e1" strokeWidth={1} className="mx-auto mb-4" />
            <p className="text-secondary-500 text-sm">No recent activity</p>
          </div>
        )}
        
        {activities?.length > 0 && (
          <div className="mt-6 pt-4 border-t border-primary-100">
            <button className="w-full text-center text-sm text-accent-600 hover:text-accent-700 font-medium">
              View all activity
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;