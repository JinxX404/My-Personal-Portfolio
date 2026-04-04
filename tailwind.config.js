const withOpacity = (variable) => ({ opacityValue, opacityVariable }) => {
  if (opacityValue !== undefined) {
    return `rgba(var(${variable}) / ${opacityValue})`;
  }

  if (opacityVariable !== undefined) {
    return `rgba(var(${variable}) / var(${opacityVariable}))`;
  }

  return `rgb(var(${variable}) / 1)`;
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        background: withOpacity('--color-background'),
        surface: withOpacity('--color-surface'),
        overlay: withOpacity('--color-overlay'),
        border: withOpacity('--color-border'),
        'border-strong': withOpacity('--color-border-strong'),

        primary: withOpacity('--color-primary'),
        'primary-50': withOpacity('--color-primary-50'),
        'primary-100': withOpacity('--color-primary-100'),
        'primary-200': withOpacity('--color-primary-200'),
        'primary-500': withOpacity('--color-primary-500'),
        'primary-600': withOpacity('--color-primary-600'),
        'primary-700': withOpacity('--color-primary-700'),
        'primary-800': withOpacity('--color-primary-800'),
        'primary-900': withOpacity('--color-primary-900'),

        secondary: withOpacity('--color-secondary'),
        'secondary-50': withOpacity('--color-secondary-50'),
        'secondary-100': withOpacity('--color-secondary-100'),
        'secondary-200': withOpacity('--color-secondary-200'),
        'secondary-300': withOpacity('--color-secondary-300'),
        'secondary-400': withOpacity('--color-secondary-400'),
        'secondary-500': withOpacity('--color-secondary-500'),
        'secondary-600': withOpacity('--color-secondary-600'),
        'secondary-800': withOpacity('--color-secondary-800'),

        'text-primary': withOpacity('--color-text-primary'),
        'text-secondary': withOpacity('--color-text-secondary'),
        muted: withOpacity('--color-muted'),

        accent: withOpacity('--color-accent'),
        'accent-50': withOpacity('--color-accent-50'),
        'accent-100': withOpacity('--color-accent-100'),
        'accent-200': withOpacity('--color-accent-200'),
        'accent-300': withOpacity('--color-accent-300'),
        'accent-400': withOpacity('--color-accent-400'),
        'accent-500': withOpacity('--color-accent-500'),
        'accent-600': withOpacity('--color-accent-600'),
        'accent-700': withOpacity('--color-accent-700'),
        'accent-800': withOpacity('--color-accent-800'),
        'accent-900': withOpacity('--color-accent-900'),
        'accent-hover': withOpacity('--color-accent-hover'),

        success: withOpacity('--color-success'),
        'success-50': withOpacity('--color-success-50'),
        'success-100': withOpacity('--color-success-100'),
        'success-200': withOpacity('--color-success-200'),
        'success-500': withOpacity('--color-success-500'),
        'success-700': withOpacity('--color-success-700'),
        'success-800': withOpacity('--color-success-800'),

        warning: withOpacity('--color-warning'),
        'warning-50': withOpacity('--color-warning-50'),
        'warning-100': withOpacity('--color-warning-100'),
        'warning-200': withOpacity('--color-warning-200'),
        'warning-500': withOpacity('--color-warning-500'),
        'warning-700': withOpacity('--color-warning-700'),
        'warning-800': withOpacity('--color-warning-800'),

        error: withOpacity('--color-error'),
        'error-50': withOpacity('--color-error-50'),
        'error-100': withOpacity('--color-error-100'),
        'error-200': withOpacity('--color-error-200'),
        'error-500': withOpacity('--color-error-500'),
        'error-700': withOpacity('--color-error-700'),
        'error-800': withOpacity('--color-error-800'),

        cta: withOpacity('--color-cta'),
        'cta-50': withOpacity('--color-cta-50'),
        'cta-100': withOpacity('--color-cta-100'),
        'cta-200': withOpacity('--color-cta-200'),
        'cta-400': withOpacity('--color-cta-400'),
        'cta-600': withOpacity('--color-cta-600'),
        'cta-700': withOpacity('--color-cta-700'),
        'cta-800': withOpacity('--color-cta-800'),
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.6rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'DEFAULT': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'md': '0 4px 12px rgba(26, 54, 93, 0.08)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'elevation': '0 20px 40px rgba(26, 54, 93, 0.15)',
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'none': 'none',
      },
      borderRadius: {
        'none': '0',
        'sm': '0.125rem',
        'DEFAULT': '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        'full': '9999px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-soft': 'pulseSoft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-soft': 'bounceSoft 1s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
        'out-quart': 'cubic-bezier(0.25, 1, 0.5, 1)',
        'in-out-back': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
        '3xl': '40px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
  safelist: [
    // Custom color system — background utilities
    'bg-accent-50', 'bg-accent-100', 'bg-accent-200', 'bg-accent-500',
    'bg-success-50', 'bg-success-100', 'bg-success-200', 'bg-success-500',
    'bg-cta-50', 'bg-cta-100', 'bg-cta-200', 'bg-cta-500',
    'bg-primary-50', 'bg-primary-100', 'bg-primary-200', 'bg-primary-500',
    'bg-warning-50', 'bg-warning-100', 'bg-warning-200', 'bg-warning-500',
    'bg-error-50', 'bg-error-100', 'bg-error-200', 'bg-error-500',
    'bg-secondary-50', 'bg-secondary-100', 'bg-secondary-200', 'bg-secondary-500',

    // Custom color system — text utilities
    'text-accent-600', 'text-accent-800',
    'text-success-600', 'text-success-800',
    'text-cta-600', 'text-cta-800',
    'text-primary-600', 'text-primary-800',
    'text-warning-600', 'text-warning-800',
    'text-error-600', 'text-error-800',
    'text-secondary-600', 'text-secondary-800',

    // Custom color system — border utilities
    'border-accent', 'border-accent-200', 'border-accent-300', 'border-accent-500', 'border-accent-600',
    'border-success', 'border-success-200', 'border-success-300', 'border-success-500', 'border-success-600',
    'border-cta', 'border-cta-200', 'border-cta-300', 'border-cta-500', 'border-cta-600',
    'border-primary', 'border-primary-200', 'border-primary-300', 'border-primary-500', 'border-primary-600',
    'border-warning', 'border-warning-200', 'border-warning-300', 'border-warning-500', 'border-warning-600',
    'border-error', 'border-error-200', 'border-error-300', 'border-error-500', 'border-error-600',
    'border-secondary', 'border-secondary-200', 'border-secondary-300', 'border-secondary-500', 'border-secondary-600',

    // Custom color system — opacity utilities (bg-{color}/5, /10, /20)
    'bg-accent/5', 'bg-accent/10', 'bg-accent/20',
    'bg-success/5', 'bg-success/10', 'bg-success/20',
    'bg-cta/5', 'bg-cta/10', 'bg-cta/20',
    'bg-primary/5', 'bg-primary/10', 'bg-primary/20',
    'bg-warning/5', 'bg-warning/10', 'bg-warning/20',
    'bg-error/5', 'bg-error/10', 'bg-error/20',
    'bg-secondary/5', 'bg-secondary/10', 'bg-secondary/20',

    // Custom color system — solid bg (for selected states)
    'bg-accent', 'bg-success', 'bg-cta', 'bg-primary', 'bg-warning', 'bg-secondary',

    // Standard Tailwind colors — used in platform detection & skill color picker
    // Blue
    'bg-blue-50', 'bg-blue-100', 'bg-blue-200', 'bg-blue-400', 'bg-blue-500', 'bg-blue-600', 'bg-blue-700',
    'text-blue-400', 'text-blue-500', 'text-blue-600', 'text-blue-700',
    'border-blue-400', 'border-blue-500', 'border-blue-600', 'border-blue-700',
    'bg-blue-400/10', 'bg-blue-400/20', 'bg-blue-500/10', 'bg-blue-500/20', 'bg-blue-600/10', 'bg-blue-600/20', 'bg-blue-700/10', 'bg-blue-700/20',
    // Gray
    'bg-gray-50', 'bg-gray-100', 'bg-gray-200', 'bg-gray-700', 'bg-gray-800', 'bg-gray-900',
    'text-gray-400', 'text-gray-600', 'text-gray-700', 'text-gray-800', 'text-gray-900',
    'border-gray-700', 'border-gray-800', 'border-gray-900',
    'bg-gray-700/10', 'bg-gray-700/20', 'bg-gray-800/10', 'bg-gray-800/20', 'bg-gray-900/10', 'bg-gray-900/20',
    // Pink
    'bg-pink-50', 'bg-pink-100', 'bg-pink-500', 'bg-pink-600',
    'text-pink-500', 'text-pink-600',
    'border-pink-500', 'border-pink-600',
    'bg-pink-500/10', 'bg-pink-500/20', 'bg-pink-600/10', 'bg-pink-600/20',
    // Red
    'bg-red-50', 'bg-red-100', 'bg-red-600',
    'text-red-600',
    'border-red-600',
    'bg-red-600/10', 'bg-red-600/20',
    // Orange
    'bg-orange-50', 'bg-orange-100', 'bg-orange-500', 'bg-orange-600',
    'text-orange-500', 'text-orange-600',
    'border-orange-500', 'border-orange-600',
    'bg-orange-500/10', 'bg-orange-500/20', 'bg-orange-600/10', 'bg-orange-600/20',
    // Green
    'bg-green-50', 'bg-green-100', 'bg-green-500', 'bg-green-600',
    'text-green-500', 'text-green-600',
    'border-green-500', 'border-green-600',
    'bg-green-500/10', 'bg-green-500/20', 'bg-green-600/10', 'bg-green-600/20',
    // Purple
    'bg-purple-50', 'bg-purple-100', 'bg-purple-500', 'bg-purple-600',
    'text-purple-500', 'text-purple-600',
    'border-purple-500', 'border-purple-600',
    'bg-purple-500/10', 'bg-purple-500/20', 'bg-purple-600/10', 'bg-purple-600/20',
    // Indigo
    'bg-indigo-50', 'bg-indigo-100', 'bg-indigo-500', 'bg-indigo-600',
    'text-indigo-500', 'text-indigo-600',
    'border-indigo-500', 'border-indigo-600',
    'bg-indigo-500/10', 'bg-indigo-500/20', 'bg-indigo-600/10', 'bg-indigo-600/20',
    // Yellow
    'bg-yellow-50', 'bg-yellow-100', 'bg-yellow-400',
    'text-yellow-400',
    'border-yellow-400',
    'bg-yellow-400/10', 'bg-yellow-400/20',
    // Violet
    'bg-violet-50', 'bg-violet-100', 'bg-violet-600',
    'text-violet-600', 'border-violet-600', 'bg-violet-600/10', 'bg-violet-600/20',
    // Teal
    'bg-teal-50', 'bg-teal-100', 'bg-teal-600',
    'text-teal-600', 'border-teal-600', 'bg-teal-600/10', 'bg-teal-600/20',
    // Emerald
    'bg-emerald-50', 'bg-emerald-100', 'bg-emerald-600',
    'text-emerald-600', 'border-emerald-600', 'bg-emerald-600/10', 'bg-emerald-600/20',
    // Lime
    'bg-lime-50', 'bg-lime-100', 'bg-lime-600',
    'text-lime-600', 'border-lime-600', 'bg-lime-600/10', 'bg-lime-600/20',
    // Amber
    'bg-amber-50', 'bg-amber-100', 'bg-amber-600',
    'text-amber-600', 'border-amber-600', 'bg-amber-600/10', 'bg-amber-600/20',
    // Rose
    'bg-rose-50', 'bg-rose-100', 'bg-rose-600',
    'text-rose-600', 'border-rose-600', 'bg-rose-600/10', 'bg-rose-600/20',
    // Fuchsia
    'bg-fuchsia-50', 'bg-fuchsia-100', 'bg-fuchsia-600',
    'text-fuchsia-600', 'border-fuchsia-600', 'bg-fuchsia-600/10', 'bg-fuchsia-600/20',
    // Cyan
    'bg-cyan-50', 'bg-cyan-100', 'bg-cyan-600',
    'text-cyan-600', 'border-cyan-600', 'bg-cyan-600/10', 'bg-cyan-600/20',
  ],
}