import { useState, useEffect } from 'react';
import { usePortfolioSettings } from 'context/PortfolioSettingsContext';

export const useReducedMotion = () => {
  const { siteSettings } = usePortfolioSettings();

  const [prefersReduced, setPrefersReduced] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e) => setPrefersReduced(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReduced || siteSettings?.enable_animations === false;
};
