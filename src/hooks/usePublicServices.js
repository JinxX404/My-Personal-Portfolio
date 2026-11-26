// Published services and FAQ for the public site. Loaded once per visit and
// shared (header link, Services page, sitemap-free). The last known "has
// services" answer is remembered so the header link does not pop in late.
import { useEffect, useState } from 'react';
import { fetchPublishedFaqs, fetchPublishedServices } from 'services/servicesService';

const HAS_SERVICES_KEY = 'portfolio-has-services';
let cache = null;
let pending = null;

const readRemembered = () => {
  try {
    return localStorage.getItem(HAS_SERVICES_KEY) === '1';
  } catch {
    return false;
  }
};

function load() {
  if (cache) return Promise.resolve(cache);
  if (!pending) {
    pending = Promise.all([fetchPublishedServices(), fetchPublishedFaqs()])
      .then(([services, faqs]) => {
        cache = {
          services: services.success ? services.data : [],
          faqs: faqs.success ? faqs.data : [],
          error: !services.success || !faqs.success,
        };
        try {
          localStorage.setItem(HAS_SERVICES_KEY, cache.services.length ? '1' : '0');
        } catch {
          /* ignore */
        }
        return cache;
      })
      .finally(() => {
        pending = null;
      });
  }
  return pending;
}

export function usePublicServices() {
  const [state, setState] = useState(() =>
    cache ? { ...cache, loaded: true } : { services: [], faqs: [], error: false, loaded: false }
  );
  useEffect(() => {
    if (cache) return undefined;
    let active = true;
    load().then((value) => {
      if (active) setState({ ...value, loaded: true });
    });
    return () => {
      active = false;
    };
  }, []);
  return state;
}

/** For the header: true once services are known to exist (or remembered from the last visit). */
export function useHasServices() {
  const { services, loaded } = usePublicServices();
  return loaded ? services.length > 0 : readRemembered();
}

/** Admin saves call this so the public views reload fresh data. */
export function invalidatePublicServices() {
  cache = null;
}
