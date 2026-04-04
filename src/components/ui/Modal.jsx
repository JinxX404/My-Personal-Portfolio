import React, { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from 'components/AppIcon';
import { useFocusTrap } from 'hooks/useFocusTrap';

const Modal = ({ isOpen, onClose, title, children, footer }) => {
  const modalRef = useRef(null);
  const focusTrapRef = useFocusTrap(isOpen);

  const combinedRef = useCallback((node) => {
    modalRef.current = node;
    if (typeof focusTrapRef === 'function') {
      focusTrapRef(node);
    } else if (focusTrapRef) {
      focusTrapRef.current = node;
    }
  }, [focusTrapRef]);

  // Close on Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-surface rounded-xl shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
          ref={combinedRef}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-primary-800 dark:text-primary-200">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-primary-100 dark:hover:bg-primary-800 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <Icon name="X" size={20} />
            </button>
          </div>

          {/* Body */}
          {children}

          {/* Footer */}
          {footer && (
            <div className="flex space-x-3 mt-6">
              {footer}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Modal;
