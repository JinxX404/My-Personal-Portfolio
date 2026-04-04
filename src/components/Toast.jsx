// src/components/Toast.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from 'components/AppIcon';
import { useToast } from 'context/ToastContext';

const Toast = () => {
  const { toasts, removeToast, pauseToast, resumeToast } = useToast();
  const [pausedIds, setPausedIds] = useState(new Set());

  const iconMap = {
    success: 'CheckCircle',
    error: 'AlertCircle',
    warning: 'AlertTriangle',
    info: 'Info',
  };

  const colorMap = {
    success: 'bg-success-500',
    error: 'bg-error-500',
    warning: 'bg-warning-500',
    info: 'bg-accent-500',
  };

  const visibleToasts = toasts.slice(-5);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {visibleToasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className={`${colorMap[toast.type] || colorMap.info} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[280px] max-w-[400px] pointer-events-auto`}
            onMouseEnter={() => {
              setPausedIds(prev => new Set(prev).add(toast.id));
              pauseToast(toast.id);
            }}
            onMouseLeave={() => {
              setPausedIds(prev => {
                const next = new Set(prev);
                next.delete(toast.id);
                return next;
              });
              resumeToast(toast.id);
            }}
          >
            <Icon 
              name={iconMap[toast.type] || iconMap.info} 
              size={20} 
              className="flex-shrink-0"
            />
            <p className="flex-1 text-sm font-medium">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 hover:bg-white/20 p-1 rounded transition-colors"
              aria-label="Dismiss notification"
              title="Dismiss"
            >
              <Icon name="X" size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Toast;
