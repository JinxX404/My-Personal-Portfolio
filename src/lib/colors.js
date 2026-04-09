export const COLORS = {
  light: {
    background: { base: '248 250 252', name: 'Slate 50' },
    surface: { base: '255 255 255', name: 'White' },
    overlay: { base: '15 23 42', name: 'Slate 900' },
    border: { base: '226 232 240', name: 'Slate 200' },
    borderStrong: { base: '203 213 225', name: 'Slate 300' },

    textPrimary: { base: '30 41 59', name: 'Slate 800' },
    textSecondary: { base: '71 85 105', name: 'Slate 600' },
    muted: { base: '100 116 139', name: 'Slate 500' },

    primary: { base: '71 85 105', name: 'Slate 600', palette: {
      50: '248 250 252', 100: '241 245 249', 200: '226 232 240',
      500: '100 116 139', 600: '71 85 105', 700: '51 65 85',
      800: '30 41 59', 900: '15 23 42'
    }},

    secondary: { base: '148 163 184', name: 'Slate 400', palette: {
      50: '249 250 251', 100: '243 244 246', 200: '229 231 235',
      300: '209 213 219', 400: '156 163 175', 500: '107 114 128',
      600: '75 85 99', 800: '31 41 55'
    }},

    accent: { base: '99 102 241', name: 'Indigo 500', palette: {
      50: '238 242 255', 100: '224 231 255', 200: '199 210 254',
      300: '165 180 252', 400: '129 140 248', 500: '99 102 241',
      600: '79 70 229', 700: '67 56 202', 800: '55 48 163', 900: '49 46 129'
    }},

    success: { base: '56 161 105', name: 'Emerald 500', palette: {
      50: '240 255 244', 100: '198 246 213', 200: '154 230 180',
      500: '72 187 120', 700: '47 133 90', 800: '39 103 73'
    }},

    warning: { base: '214 158 46', name: 'Amber 500', palette: {
      50: '255 251 235', 100: '254 243 199', 200: '253 230 138',
      500: '245 158 11', 700: '180 83 9', 800: '146 64 14'
    }},

    error: { base: '229 62 62', name: 'Red 500', palette: {
      50: '254 242 242', 100: '254 226 226', 200: '254 202 202',
      500: '239 68 68', 700: '185 28 28', 800: '153 27 27'
    }},

    cta: { base: '99 102 241', name: 'Indigo 500', palette: {
      50: '238 242 255', 100: '224 231 255', 200: '199 210 254',
      400: '165 180 252', 600: '79 70 229', 700: '67 56 202', 800: '55 48 163'
    }}
  },

  dark: {
    background: { base: '10 15 30', name: 'Custom Dark Blue' },
    surface: { base: '18 25 42', name: 'Custom Dark Surface' },
    overlay: { base: '5 10 20', name: 'Custom Dark Overlay' },
    border: { base: '40 55 80', name: 'Custom Dark Border' },
    borderStrong: { base: '60 80 110', name: 'Custom Dark Border Strong' },

    textPrimary: { base: '235 240 250', name: 'Light Blue White' },
    textSecondary: { base: '170 185 210', name: 'Muted Light Blue' },
    muted: { base: '120 135 160', name: 'Dark Mode Muted' },

    primary: { base: '130 150 180', name: 'Light Slate', palette: {
      50: '18 25 42', 100: '28 38 58', 200: '40 55 80',
      500: '100 120 155', 600: '130 150 180', 700: '170 185 210',
      800: '210 220 235', 900: '235 240 250'
    }},

    secondary: { base: '160 175 200', name: 'Light Secondary', palette: {
      50: '18 25 42', 100: '28 38 58', 200: '40 55 80',
      300: '60 80 110', 400: '110 130 160', 500: '160 175 200',
      600: '190 200 220', 800: '225 230 242'
    }},

    accent: { base: '130 140 250', name: 'Light Indigo', palette: {
      50: '25 30 60', 100: '35 42 80', 200: '50 58 110',
      300: '75 85 160', 400: '110 120 220', 500: '130 140 250',
      600: '155 165 255', 700: '180 190 255', 800: '200 210 255', 900: '220 225 255'
    }},

    success: { base: '52 211 153', name: 'Emerald 400', palette: {
      50: '10 40 35', 100: '15 65 55', 200: '20 90 75',
      500: '52 211 153', 700: '80 230 180', 800: '120 240 200'
    }},

    warning: { base: '251 191 36', name: 'Amber 400', palette: {
      50: '45 30 5', 100: '65 45 8', 200: '90 60 10',
      500: '251 191 36', 700: '252 210 80', 800: '253 225 130'
    }},

    error: { base: '248 113 113', name: 'Red 400', palette: {
      50: '50 10 10', 100: '75 15 15', 200: '100 20 20',
      500: '248 113 113', 700: '250 140 140', 800: '252 170 170'
    }},

    cta: { base: '130 140 250', name: 'Light CTA', palette: {
      50: '25 30 60', 100: '35 42 80', 200: '50 58 110',
      400: '110 120 220', 600: '155 165 255', 700: '180 190 255', 800: '200 210 255'
    }}
  },

  chart: {
    primary: '#6366f1',
    secondary: '#10b981',
    tertiary: '#f59e0b',
    quaternary: '#ef4444',
    fifth: '#8b5cf6',
    sixth: '#06b6d4',
    gridLight: '#e2e8f0',
    gridDark: '#475569',
    textLight: '#64748b',
    textDark: '#94a3b8'
  },

  social: {
    github: '#181717',
    linkedin: '#0A66C2',
    twitter: '#1DA1F2',
    dribbble: '#EA4C89',
    behance: '#1769FF',
    instagram: '#E4405F',
    facebook: '#1877F2',
    youtube: '#FF0000',
    snapchat: '#FFFC00',
    tiktok: '#000000',
    discord: '#5865F2',
    reddit: '#FF4500',
    stackoverflow: '#F58025',
    gitlab: '#000000'
  },

  common: {
    white: '255 255 255',
    black: '0 0 0',
    transparent: '0 0 0 0'
  }
};

export const SEMANTIC_COLORS = {
  text: {
    primary: 'var(--color-text-primary)',
    secondary: 'var(--color-text-secondary)',
    muted: 'var(--color-muted)',
    inverse: 'var(--color-background)',
    accent: 'var(--color-accent-600)'
  },
  background: {
    primary: 'var(--color-background)',
    secondary: 'var(--color-surface)',
    overlay: 'var(--color-overlay)',
    muted: 'var(--color-primary-100)'
  },
  border: {
    default: 'var(--color-border)',
    strong: 'var(--color-border-strong)',
    accent: 'var(--color-accent-300)'
  },
  interactive: {
    primary: 'var(--color-accent)',
    primaryHover: 'var(--color-accent-hover)',
    secondary: 'var(--color-secondary)',
    success: 'var(--color-success)',
    warning: 'var(--color-warning)',
    error: 'var(--color-error)'
  }
};

export const SHADOW_COLORS = {
  light: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    default: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    md: '0 4px 12px rgba(26, 54, 93, 0.08)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    elevation: '0 20px 40px rgba(26, 54, 93, 0.15)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    none: 'none'
  },
  dark: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.2)',
    default: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
    md: '0 4px 12px rgba(0, 0, 0, 0.2)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.3)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    elevation: '0 20px 40px rgba(0, 0, 0, 0.4)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.2)',
    none: 'none'
  }
};

export const getColorRGB = (colorPath) => {
  const parts = colorPath.split('.');
  let result = COLORS.light;
  for (const part of parts) {
    if (result && result[part]) {
      result = result[part];
    } else {
      return null;
    }
  }
  return result?.base || null;
};

export const getColorHex = (colorPath) => {
  const rgb = getColorRGB(colorPath);
  if (!rgb) return null;
  const [r, g, b] = rgb.split(' ').map(Number);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};
