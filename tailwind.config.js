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
      boxShadow: (theme) => ({
        sm: 'var(--shadow-sm)',
        DEFAULT: 'var(--shadow-md)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
        '2xl': 'var(--shadow-2xl)',
        elevation: 'var(--shadow-elevation)',
        inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        none: 'none',
      }),
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
        'primary-300': withOpacity('--color-primary-300'),
        'primary-400': withOpacity('--color-primary-400'),
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
        'secondary-700': withOpacity('--color-secondary-700'),
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
        'success-600': withOpacity('--color-success-600'),
        'success-700': withOpacity('--color-success-700'),
        'success-800': withOpacity('--color-success-800'),

        warning: withOpacity('--color-warning'),
        'warning-50': withOpacity('--color-warning-50'),
        'warning-100': withOpacity('--color-warning-100'),
        'warning-200': withOpacity('--color-warning-200'),
        'warning-500': withOpacity('--color-warning-500'),
        'warning-600': withOpacity('--color-warning-600'),
        'warning-700': withOpacity('--color-warning-700'),
        'warning-800': withOpacity('--color-warning-800'),

        error: withOpacity('--color-error'),
        'error-50': withOpacity('--color-error-50'),
        'error-100': withOpacity('--color-error-100'),
        'error-200': withOpacity('--color-error-200'),
        'error-500': withOpacity('--color-error-500'),
        'error-600': withOpacity('--color-error-600'),
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
    // Custom color system — full background utilities
    'bg-accent-50', 'bg-accent-100', 'bg-accent-200', 'bg-accent-300', 'bg-accent-400', 'bg-accent-500', 'bg-accent-600', 'bg-accent-700', 'bg-accent-800', 'bg-accent-900',
    'bg-success-50', 'bg-success-100', 'bg-success-200', 'bg-success-500', 'bg-success-600', 'bg-success-700', 'bg-success-800',
    'bg-cta-50', 'bg-cta-100', 'bg-cta-200', 'bg-cta-400', 'bg-cta-500', 'bg-cta-600', 'bg-cta-700', 'bg-cta-800',
    'bg-primary-50', 'bg-primary-100', 'bg-primary-200', 'bg-primary-300', 'bg-primary-400', 'bg-primary-500', 'bg-primary-600', 'bg-primary-700', 'bg-primary-800', 'bg-primary-900',
    'bg-warning-50', 'bg-warning-100', 'bg-warning-200', 'bg-warning-500', 'bg-warning-600', 'bg-warning-700', 'bg-warning-800',
    'bg-error-50', 'bg-error-100', 'bg-error-200', 'bg-error-500', 'bg-error-600', 'bg-error-700', 'bg-error-800',
    'bg-secondary-50', 'bg-secondary-100', 'bg-secondary-200', 'bg-secondary-300', 'bg-secondary-400', 'bg-secondary-500', 'bg-secondary-600', 'bg-secondary-700', 'bg-secondary-800',
    'bg-text-primary', 'bg-text-secondary', 'bg-surface', 'bg-background', 'bg-muted',

    // Custom color system — text utilities
    'text-accent-50', 'text-accent-100', 'text-accent-200', 'text-accent-300', 'text-accent-400', 'text-accent-500', 'text-accent-600', 'text-accent-700', 'text-accent-800', 'text-accent-900',
    'text-success-50', 'text-success-100', 'text-success-200', 'text-success-500', 'text-success-600', 'text-success-700', 'text-success-800',
    'text-cta-50', 'text-cta-100', 'text-cta-200', 'text-cta-400', 'text-cta-500', 'text-cta-600', 'text-cta-700', 'text-cta-800',
    'text-primary-50', 'text-primary-100', 'text-primary-200', 'text-primary-300', 'text-primary-400', 'text-primary-500', 'text-primary-600', 'text-primary-700', 'text-primary-800', 'text-primary-900',
    'text-warning-50', 'text-warning-100', 'text-warning-200', 'text-warning-500', 'text-warning-600', 'text-warning-700', 'text-warning-800',
    'text-error-50', 'text-error-100', 'text-error-200', 'text-error-500', 'text-error-600', 'text-error-700', 'text-error-800',
    'text-secondary-50', 'text-secondary-100', 'text-secondary-200', 'text-secondary-300', 'text-secondary-400', 'text-secondary-500', 'text-secondary-600', 'text-secondary-700', 'text-secondary-800',
    'text-text-primary', 'text-text-secondary', 'text-surface', 'text-background', 'text-muted',

    // Custom color system — border utilities
    'border-accent', 'border-accent-50', 'border-accent-100', 'border-accent-200', 'border-accent-300', 'border-accent-400', 'border-accent-500', 'border-accent-600', 'border-accent-700', 'border-accent-800', 'border-accent-900',
    'border-success', 'border-success-50', 'border-success-100', 'border-success-200', 'border-success-500', 'border-success-600', 'border-success-700', 'border-success-800',
    'border-cta', 'border-cta-50', 'border-cta-100', 'border-cta-200', 'border-cta-400', 'border-cta-500', 'border-cta-600', 'border-cta-700', 'border-cta-800',
    'border-primary', 'border-primary-50', 'border-primary-100', 'border-primary-200', 'border-primary-300', 'border-primary-400', 'border-primary-500', 'border-primary-600', 'border-primary-700', 'border-primary-800', 'border-primary-900',
    'border-warning', 'border-warning-50', 'border-warning-100', 'border-warning-200', 'border-warning-500', 'border-warning-600', 'border-warning-700', 'border-warning-800',
    'border-error', 'border-error-50', 'border-error-100', 'border-error-200', 'border-error-500', 'border-error-600', 'border-error-700', 'border-error-800',
    'border-secondary', 'border-secondary-50', 'border-secondary-100', 'border-secondary-200', 'border-secondary-300', 'border-secondary-400', 'border-secondary-500', 'border-secondary-600', 'border-secondary-700', 'border-secondary-800',
    'border-text-primary', 'border-text-secondary', 'border-surface', 'border-background', 'border-muted', 'border-border', 'border-border-strong',

    // Custom color system — solid bg (for selected states)
    'bg-accent', 'bg-success', 'bg-cta', 'bg-primary', 'bg-warning', 'bg-secondary', 'bg-surface', 'bg-background', 'bg-muted',

    // Custom color system — opacity utilities
    'bg-accent/5', 'bg-accent/10', 'bg-accent/15', 'bg-accent/20', 'bg-accent/30', 'bg-accent/50',
    'bg-success/5', 'bg-success/10', 'bg-success/15', 'bg-success/20', 'bg-success/30', 'bg-success/50',
    'bg-cta/5', 'bg-cta/10', 'bg-cta/15', 'bg-cta/20', 'bg-cta/30', 'bg-cta/50',
    'bg-primary/5', 'bg-primary/10', 'bg-primary/15', 'bg-primary/20', 'bg-primary/30', 'bg-primary/50',
    'bg-warning/5', 'bg-warning/10', 'bg-warning/15', 'bg-warning/20', 'bg-warning/30', 'bg-warning/50',
    'bg-error/5', 'bg-error/10', 'bg-error/15', 'bg-error/20', 'bg-error/30', 'bg-error/50',
    'bg-secondary/5', 'bg-secondary/10', 'bg-secondary/15', 'bg-secondary/20', 'bg-secondary/30', 'bg-secondary/50',
    'bg-surface/5', 'bg-surface/10', 'bg-surface/15', 'bg-surface/20', 'bg-surface/30', 'bg-surface/50', 'bg-surface/60', 'bg-surface/70', 'bg-surface/80', 'bg-surface/90', 'bg-surface/95',
    'bg-background/5', 'bg-background/10', 'bg-background/15', 'bg-background/20', 'bg-background/30', 'bg-background/50', 'bg-background/60', 'bg-background/70', 'bg-background/80', 'bg-background/90',
    'bg-muted/5', 'bg-muted/10', 'bg-muted/15', 'bg-muted/20', 'bg-muted/30', 'bg-muted/50',

    // Standard Tailwind colors — used in platform detection & skill color picker
    'bg-blue-50', 'bg-blue-100', 'bg-blue-200', 'bg-blue-400', 'bg-blue-500', 'bg-blue-600', 'bg-blue-700',
    'text-blue-400', 'text-blue-500', 'text-blue-600', 'text-blue-700',
    'border-blue-400', 'border-blue-500', 'border-blue-600', 'border-blue-700',
    'bg-gray-50', 'bg-gray-100', 'bg-gray-200', 'bg-gray-700', 'bg-gray-800', 'bg-gray-900',
    'text-gray-400', 'text-gray-600', 'text-gray-700', 'text-gray-800', 'text-gray-900',
    'border-gray-700', 'border-gray-800', 'border-gray-900',
    'bg-pink-50', 'bg-pink-100', 'bg-pink-500', 'bg-pink-600',
    'text-pink-500', 'text-pink-600',
    'border-pink-500', 'border-pink-600',
    'bg-red-50', 'bg-red-100', 'bg-red-600',
    'text-red-600',
    'border-red-600',
    'bg-orange-50', 'bg-orange-100', 'bg-orange-500', 'bg-orange-600',
    'text-orange-500', 'text-orange-600',
    'border-orange-500', 'border-orange-600',
    'bg-green-50', 'bg-green-100', 'bg-green-500', 'bg-green-600',
    'text-green-500', 'text-green-600',
    'border-green-500', 'border-green-600',
    'bg-purple-50', 'bg-purple-100', 'bg-purple-500', 'bg-purple-600',
    'text-purple-500', 'text-purple-600',
    'border-purple-500', 'border-purple-600',
    'bg-indigo-50', 'bg-indigo-100', 'bg-indigo-500', 'bg-indigo-600',
    'text-indigo-500', 'text-indigo-600',
    'border-indigo-500', 'border-indigo-600',
    'bg-yellow-50', 'bg-yellow-100', 'bg-yellow-400',
    'text-yellow-400',
    'border-yellow-400',
    'bg-white', 'text-white', 'text-black',
  ],
}