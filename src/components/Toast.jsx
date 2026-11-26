// src/components/Toast.jsx
import React from 'react';
import Icon from 'components/AppIcon';
import { useToast } from 'context/ToastContext';

const Toast = () => {
  const { toasts, removeToast, pauseToast, resumeToast } = useToast();

  const iconMap = {
    success: 'CheckCircle',
    error: 'AlertCircle',
    warning: 'AlertTriangle',
    info: 'Info',
  };

  const colorMap = {
    success: 'bg-success-500 dark:bg-success-700',
    error: 'bg-error-500',
    warning: 'bg-warning-700',
    info: 'bg-accent-500 dark:bg-accent-fill',
  };

  const visibleToasts = toasts.slice(-5);

  return (
    // Plain CSS entrance (see .toast-enter) so the global shell does not
    // pull framer-motion into the first page load.
    <div
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none"
      role="status"
      aria-live="polite"
    >
        {visibleToasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast-enter ${colorMap[toast.type] || colorMap.info} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[280px] max-w-[400px] pointer-events-auto`}
            onMouseEnter={() => pauseToast(toast.id)}
            onMouseLeave={() => resumeToast(toast.id)}
          >
            <Icon 
              name={iconMap[toast.type] || iconMap.info} 
              size={20} 
              className="flex-shrink-0"
            />
            <p className="flex-1 text-sm font-medium">{toast.message}</p>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 hover:bg-white/20 p-1 rounded transition-colors"
              aria-label="Dismiss notification"
              title="Dismiss"
            >
              <Icon name="X" size={16} />
            </button>
          </div>
        ))}
    </div>
  );
};

export default Toast;
