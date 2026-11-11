import React, { useEffect, useRef } from 'react';

export function turnstileSiteKey() {
  const key = import.meta.env.VITE_TURNSTILE_SITE_KEY;
  if (typeof key !== 'string') return '';
  const trimmed = key.trim();
  if (!trimmed || trimmed.includes('your_')) return '';
  return trimmed;
}

/**
 * Renders nothing when VITE_TURNSTILE_SITE_KEY is unset, so the contact form
 * keeps working in local and production environments that have not enabled Turnstile.
 */
const TurnstileField = ({ onToken }) => {
  const siteKey = turnstileSiteKey();
  const containerRef = useRef(null);
  const onTokenRef = useRef(onToken);
  onTokenRef.current = onToken;

  useEffect(() => {
    if (!siteKey || !containerRef.current) return undefined;

    let widgetId;
    let cancelled = false;

    const renderWidget = () => {
      if (cancelled || !window.turnstile || !containerRef.current) return;
      widgetId = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: (token) => onTokenRef.current(token || ''),
        'expired-callback': () => onTokenRef.current(''),
        'error-callback': () => onTokenRef.current(''),
      });
    };

    const existing = document.getElementById('cf-turnstile-script');
    if (!existing) {
      const script = document.createElement('script');
      script.id = 'cf-turnstile-script';
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    const timer = window.setInterval(() => {
      if (window.turnstile) {
        window.clearInterval(timer);
        renderWidget();
      }
    }, 200);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
      if (widgetId !== undefined && window.turnstile) {
        window.turnstile.remove(widgetId);
      }
    };
  }, [siteKey]);

  if (!siteKey) return null;

  return <div ref={containerRef} className="min-h-[65px]" />;
};

export default TurnstileField;
