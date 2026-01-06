// src/pages/admin-dashboard/components/ContentCalendar.jsx
import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const ContentCalendar = ({ scheduledContent, setScheduledContent }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showAddModal, setShowAddModal] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'bg-success-100 text-success-700 border-success-200';
      case 'draft':
        return 'bg-warning-100 text-warning-700 border-warning-200';
      case 'published':
        return 'bg-accent-100 text-accent-700 border-accent-200';
      default:
        return 'bg-secondary-100 text-secondary-700 border-secondary-200';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'blog':
        return 'FileText';
      case 'project':
        return 'Briefcase';
      default:
        return 'File';
    }
  };

  const handleDragStart = (e, contentId) => {
    e.dataTransfer.setData('text/plain', contentId.toString());
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, newDate) => {
    e.preventDefault();
    const contentId = parseInt(e.dataTransfer.getData('text/plain'));
    
    setScheduledContent(prev => 
      prev?.map(item => 
        item?.id === contentId 
          ? { ...item, date: newDate }
          : item
      )
    );
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      days.push({
        day,
        date: dateStr,
        content: scheduledContent?.filter(item => item?.date === dateStr) || []
      });
    }
    
    return days;
  };

  const currentDate = new Date();
  const days = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="Calendar" size={20} strokeWidth={2} color="#3182ce" />
            <h2 className="text-lg font-semibold text-primary-800">Content Calendar</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button className="btn-outline text-xs py-2 px-3">
              <Icon name="ChevronLeft" size={16} strokeWidth={2} />
            </button>
            <span className="text-sm font-medium text-primary-800">{monthName}</span>
            <button className="btn-outline text-xs py-2 px-3">
              <Icon name="ChevronRight" size={16} strokeWidth={2} />
            </button>
          </div>
        </div>
        <p className="text-sm text-secondary-600 mt-1">Drag and drop to reschedule content</p>
      </div>
      
      <div className="card-content">
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-center text-xs font-medium text-secondary-600 bg-primary-50 rounded">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {days?.map((dayInfo, index) => (
            <div
              key={index}
              className={`min-h-[80px] p-2 border border-primary-100 rounded-lg ${
                dayInfo ? 'bg-white hover:bg-primary-50' : 'bg-primary-25'
              }`}
              onDragOver={handleDragOver}
              onDrop={dayInfo ? (e) => handleDrop(e, dayInfo?.date) : undefined}
            >
              {dayInfo && (
                <>
                  <div className="text-xs font-medium text-primary-800 mb-1">
                    {dayInfo?.day}
                  </div>
                  <div className="space-y-1">
                    {dayInfo?.content?.map((item) => (
                      <div
                        key={item?.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, item?.id)}
                        className={`px-2 py-1 rounded text-xs font-medium border cursor-move hover:shadow-sm transition-all duration-200 ${
                          getStatusColor(item?.status)
                        }`}
                        title={`${item?.title} - ${item?.time}`}
                      >
                        <div className="flex items-center space-x-1">
                          <Icon 
                            name={getTypeIcon(item?.type)} 
                            size={10} 
                            strokeWidth={2}
                          />
                          <span className="truncate">{item?.title}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
        
        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 mt-6 pt-4 border-t border-primary-100">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success-200 rounded-full"></div>
            <span className="text-xs text-secondary-600">Scheduled</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-warning-200 rounded-full"></div>
            <span className="text-xs text-secondary-600">Draft</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-accent-200 rounded-full"></div>
            <span className="text-xs text-secondary-600">Published</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentCalendar;