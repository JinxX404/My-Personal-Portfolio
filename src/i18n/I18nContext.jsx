import React, { createContext, useCallback, useContext, useLayoutEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { messages } from './messages.mjs';
import {
  LANGUAGE_STORAGE_KEY,
  alternatePath,
  directionFor,
  languageFromPath,
  localizePath,
} from './paths.mjs';

const I18nContext = createContext(null);

// Latin digits on both sites (decision in MORNING.md). `nu-latn` keeps Arabic
// month names but 0-9 digits.
const LOCALES = { en: 'en-US', ar: 'ar-EG-u-nu-latn' };

const pluralRules = {};
function pluralSuffix(lang, count) {
  if (!pluralRules[lang]) pluralRules[lang] = new Intl.PluralRules(LOCALES[lang]);
  return pluralRules[lang].select(count);
}

function interpolate(text, vars) {
  if (!vars) return text;
  return text.replace(/\{(\w+)\}/g, (match, name) => (vars[name] !== undefined && vars[name] !== null ? String(vars[name]) : match));
}

export function translate(lang, key, vars) {
  const table = messages[lang] || messages.en;
  let text;
  if (vars && typeof vars.count === 'number') {
    const form = vars.count === 0 && table[`${key}_zero`] ? 'zero' : pluralSuffix(lang, vars.count);
    text = table[`${key}_${form}`] ?? table[`${key}_other`];
  }
  text = text ?? table[key] ?? messages.en[key] ?? messages.en[`${key}_other`];
  if (text === undefined) {
    if (import.meta.env?.DEV) console.warn(`[i18n] missing key: ${key}`);
    return key;
  }
  return interpolate(text, vars);
}

export function rememberLanguage(lang) {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  } catch {
    // Private mode: the choice just isn't remembered.
  }
}

export function I18nProvider({ children }) {
  const { pathname } = useLocation();
  const lang = languageFromPath(pathname);
  const dir = directionFor(lang);

  // Before paint, so a language switch never shows a frame in the old direction.
  // (public/theme-init.js sets the same attributes before the first render.)
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = dir;
  }, [lang, dir]);

  const t = useCallback((key, vars) => translate(lang, key, vars), [lang]);
  const lp = useCallback((path) => localizePath(path, lang), [lang]);

  const value = useMemo(() => {
    const locale = LOCALES[lang];
    return {
      lang,
      dir,
      isRTL: dir === 'rtl',
      locale,
      t,
      lp,
      /** Same page in the other language, or that language's home page. */
      switchPath: (target) => alternatePath(pathname, target) || localizePath('/', target),
      formatNumber: (n, options) => new Intl.NumberFormat(locale, options).format(n),
      formatDate: (date, options = { year: 'numeric', month: 'short', day: 'numeric' }) => {
        const d = date instanceof Date ? date : new Date(date);
        return Number.isNaN(d.getTime()) ? '' : new Intl.DateTimeFormat(locale, options).format(d);
      },
    };
  }, [lang, dir, t, lp, pathname]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

const FALLBACK = {
  lang: 'en',
  dir: 'ltr',
  isRTL: false,
  locale: LOCALES.en,
  t: (key, vars) => translate('en', key, vars),
  lp: (path) => path,
  switchPath: (target) => localizePath('/', target),
  formatNumber: (n, options) => new Intl.NumberFormat(LOCALES.en, options).format(n),
  formatDate: (date, options = { year: 'numeric', month: 'short', day: 'numeric' }) => {
    const d = date instanceof Date ? date : new Date(date);
    return Number.isNaN(d.getTime()) ? '' : new Intl.DateTimeFormat(LOCALES.en, options).format(d);
  },
};

/** Works outside the provider too (English), e.g. in the error boundary. */
export function useI18n() {
  return useContext(I18nContext) || FALLBACK;
}
