// src/context/ToastContext.jsx
import React, { createContext, useContext, useState, useCallback, useEffect, useRef, useMemo } from 'react';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Toast types with their colors
const TOAST_TYPES = {
  success: { bg: 'bg-success-500', icon: 'CheckCircle' },
  error: { bg: 'bg-error-500', icon: 'AlertCircle' },
  warning: { bg: 'bg-warning-500', icon: 'AlertTriangle' },
  info: { bg: 'bg-accent-500', icon: 'Info' },
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const timeoutIds = useRef(new Map());

  // Cleanup ALL pending timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutIds.current.forEach((timeoutId) => clearTimeout(timeoutId));
      timeoutIds.current.clear();
    };
  }, []);

  const addToast = useCallback((message, type = 'info', duration = 5000) => {
    const id = Date.now() + Math.random();
    const toast = { id, message, type, ...TOAST_TYPES[type] || TOAST_TYPES.info };
    
    setToasts(prev => [...prev, toast]);
    
    // Auto-remove after duration with tracked timeout
    if (duration > 0) {
      const timeoutId = setTimeout(() => {
        removeToast(id);
      }, duration);
      timeoutIds.current.set(id, timeoutId);
    }
    
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    // Clear the tracked timeout before removing
    const timeoutId = timeoutIds.current.get(id);
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutIds.current.delete(id);
    }
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const pauseToast = useCallback((id) => {
    const timeoutId = timeoutIds.current.get(id);
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutIds.current.delete(id);
    }
  }, []);

  const resumeToast = useCallback((id, duration = 5000) => {
    const toast = toasts.find(t => t.id === id);
    if (!toast) return;
    const timeoutId = setTimeout(() => {
      removeToast(id);
    }, duration);
    timeoutIds.current.set(id, timeoutId);
  }, [toasts, removeToast]);

  // Convenience methods
  const success = useCallback((message, duration = 5000) => addToast(message, 'success', duration), [addToast]);
  const error = useCallback((message, duration = 7000) => addToast(message, 'error', duration), [addToast]);
  const warning = useCallback((message, duration = 6000) => addToast(message, 'warning', duration), [addToast]);
  const info = useCallback((message, duration = 5000) => addToast(message, 'info', duration), [addToast]);

  const value = useMemo(() => ({
    toasts,
    addToast,
    removeToast,
    pauseToast,
    resumeToast,
    success,
    error,
    warning,
    info,
  }), [toasts, addToast, removeToast, pauseToast, resumeToast, success, error, warning, info]);

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
};
