(function () {
  try {
    var storageKey = 'portfolio-theme-preference';
    var stored = localStorage.getItem(storageKey);
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = stored === 'light' || stored === 'dark' ? stored : (prefersDark ? 'dark' : 'light');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (err) {
    console.warn('Theme initialisation failed', err);
  }
})();

// Language and direction before the first paint (React keeps them in sync
// afterwards). English lives at the plain URLs, Arabic under /ar. A visitor who
// picked Arabic before is sent to the Arabic copy of a public page, without a
// reload, before the app reads the URL. Keep the page list in step with
// src/i18n/paths.mjs.
(function () {
  try {
    var path = location.pathname;
    var isArabic = path === '/ar' || path.indexOf('/ar/') === 0;
    var localized = /^\/($|projects(\/[^/]+)?\/?$|about-story\/?$|contact-hub\/?$)/;
    if (!isArabic && localized.test(path) && localStorage.getItem('portfolio-language') === 'ar') {
      history.replaceState(history.state, '', (path === '/' ? '/ar' : '/ar' + path) + location.search + location.hash);
      isArabic = true;
    }
    document.documentElement.lang = isArabic ? 'ar' : 'en';
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
  } catch (err) {
    console.warn('Language initialisation failed', err);
  }
})();
