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
}