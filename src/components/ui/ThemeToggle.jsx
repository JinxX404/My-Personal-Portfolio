import React from 'react';
import Icon from '../AppIcon';
import { useTheme } from 'context/ThemeContext';

const iconButtonClasses =
  'relative inline-flex items-center justify-center w-10 h-10 rounded-full border border-border bg-surface/80 text-text-primary shadow-sm backdrop-blur-sm transition-theme hover:border-accent-500 hover:text-accent-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-200 focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:border-border-strong dark:bg-surface-elevated/90 dark:hover:border-accent-fill dark:hover:text-accent-text';

const rowButtonClasses =
  'w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-lg border border-border bg-surface/80 text-text-primary transition-theme hover:text-accent-500 hover:border-accent-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-200 focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:border-border-strong/60 dark:bg-surface-elevated/80 dark:text-text-primary dark:hover:text-accent-text dark:hover:border-accent-fill';

const ThemeToggle = ({ variant = 'icon', className = '', onToggle }) => {
  const { isDark, toggleTheme } = useTheme();
  const nextMode = isDark ? 'light' : 'dark';
  const label = `Switch to ${nextMode} mode`;

  const handleClick = () => {
    toggleTheme();
    onToggle?.();
  };

  if (variant === 'row') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`${rowButtonClasses} ${className}`.trim()}
        aria-label={label}
        aria-pressed={isDark}
        title={label}
      >
        <Icon name={isDark ? 'Sun' : 'Moon'} size={18} strokeWidth={2.5} />
        <span>{isDark ? 'Switch to light mode' : 'Switch to dark mode'}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${iconButtonClasses} ${className}`.trim()}
      aria-label={label}
      aria-pressed={isDark}
      title={label}
    >
      <span
        className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
          isDark ? 'rotate-0 opacity-100' : 'rotate-90 opacity-0'
        }`}
        aria-hidden="true"
      >
        <Icon name="Sun" size={18} strokeWidth={2.5} />
      </span>
      <span
        className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
          isDark ? '-rotate-90 opacity-0' : 'rotate-0 opacity-100'
        }`}
        aria-hidden="true"
      >
        <Icon name="Moon" size={18} strokeWidth={2.5} />
      </span>
    </button>
  );
};

export default ThemeToggle;
