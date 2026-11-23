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

    accent: { base: '79 70 229', name: 'Accent fill #4F46E5', palette: {
      50: '238 242 255', 100: '224 231 255', 200: '199 210 254',
      300: '165 180 252', 400: '129 140 248', 500: '79 70 229',
      600: '67 56 202', 700: '55 48 163', 800: '49 46 129', 900: '49 46 129'
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

    cta: { base: '79 70 229', name: 'CTA fill #4F46E5', palette: {
      50: '238 242 255', 100: '224 231 255', 200: '199 210 254',
      400: '165 180 252', 600: '67 56 202', 700: '55 48 163', 800: '49 46 129'
    }}
  },

  dark: {
    background: { base: '11 16 32', name: 'Background #0B1020' },
    surface: { base: '21 27 43', name: 'Surface #151B2B' },
    surfaceElevated: { base: '28 36 56', name: 'Surface elevated #1C2438' },
    overlay: { base: '5 8 16', name: 'Overlay' },
    border: { base: '42 53 80', name: 'Border #2A3550' },
    borderStrong: { base: '61 77 107', name: 'Border strong #3D4D6B' },

    textPrimary: { base: '241 245 249', name: 'Text primary #F1F5F9' },
    textSecondary: { base: '203 213 225', name: 'Text secondary #CBD5E1' },
    muted: { base: '148 163 184', name: 'Muted #94A3B8' },

    // 50 = lightest, 900 = darkest (not inverted)
    primary: { base: '203 213 225', name: 'Slate 300', palette: {
      50: '241 245 249', 100: '226 232 240', 200: '203 213 225',
      300: '148 163 184', 400: '100 116 139', 500: '71 85 105',
      600: '51 65 85', 700: '30 41 59', 800: '15 23 42', 900: '2 6 23'
    }},

    secondary: { base: '203 213 225', name: 'Slate 300', palette: {
      50: '248 250 252', 100: '241 245 249', 200: '226 232 240',
      300: '203 213 225', 400: '148 163 184', 500: '100 116 139',
      600: '71 85 105', 800: '30 41 59'
    }},

    accent: { base: '79 70 229', name: 'Accent fill #4F46E5', palette: {
      50: '238 242 255', 100: '224 231 255', 200: '199 210 254',
      300: '165 180 252', 400: '129 140 248', 500: '79 70 229',
      600: '67 56 202', 700: '55 48 163', 800: '49 46 129', 900: '30 27 75'
    }},

    accentFill: { base: '79 70 229', name: 'Accent fill #4F46E5' },
    accentFillHover: { base: '67 56 202', name: 'Accent fill hover #4338CA' },
    accentText: { base: '165 180 252', name: 'Accent text #A5B4FC' },
    accentSubtle: { base: '30 27 75', name: 'Accent subtle #1E1B4B' },
    bannerFrom: { base: '30 41 59', name: 'Banner from #1E293B' },
    bannerTo: { base: '49 46 129', name: 'Banner to #312E81' },

    success: { base: '52 211 153', name: 'Success text #34D399', palette: {
      50: '236 253 245', 100: '209 250 229', 200: '167 243 208',
      500: '16 185 129', 600: '5 150 105', 700: '4 120 87', 800: '6 95 70', 900: '6 78 59'
    }},
    successFill: { base: '5 150 105', name: 'Success fill #059669' },
    successText: { base: '52 211 153', name: 'Success text #34D399' },

    warning: { base: '251 191 36', name: 'Amber 400', palette: {
      50: '255 251 235', 100: '254 243 199', 200: '253 230 138',
      500: '245 158 11', 700: '180 83 9', 800: '146 64 14', 900: '69 26 3'
    }},

    error: { base: '248 113 113', name: 'Red 400', palette: {
      50: '254 242 242', 100: '254 226 226', 200: '254 202 202',
      500: '239 68 68', 700: '185 28 28', 800: '153 27 27', 900: '69 10 10'
    }},

    cta: { base: '79 70 229', name: 'CTA fill #4F46E5', palette: {
      50: '238 242 255', 100: '224 231 255', 200: '199 210 254',
      400: '129 140 248', 600: '67 56 202', 700: '55 48 163', 800: '49 46 129'
    }}
  },

  chart: {
    primary: '#4F46E5',
    secondary: '#10b981',
    tertiary: '#f59e0b',
    quaternary: '#ef4444',
    fifth: '#8b5cf6',
    sixth: '#06b6d4',
    gridLight: '#e2e8f0',
    gridDark: '#2A3550',
    textLight: '#64748b',
    textDark: '#94A3B8'
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
    accent: 'var(--color-accent-text)'
  },
  background: {
    primary: 'var(--color-background)',
    secondary: 'var(--color-surface)',
    elevated: 'var(--color-surface-elevated)',
    overlay: 'var(--color-overlay)',
    muted: 'var(--color-primary-100)',
    accentSubtle: 'var(--color-accent-subtle)',
    bannerFrom: 'var(--color-banner-from)',
    bannerTo: 'var(--color-banner-to)'
  },
  border: {
    default: 'var(--color-border)',
    strong: 'var(--color-border-strong)',
    accent: 'var(--color-accent-300)'
  },
  interactive: {
    primary: 'var(--color-accent-fill)',
    primaryHover: 'var(--color-accent-fill-hover)',
    secondary: 'var(--color-secondary)',
    success: 'var(--color-success-fill)',
    successText: 'var(--color-success-text)',
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
