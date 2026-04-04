import { useState, useEffect, useCallback } from 'react';

/**
 * Generic hook for Supabase data fetching.
 * @param {Function} queryFn - Async function that returns { success, data, error }
 * @param {Object} options - { immediate: boolean (default true), deps: array }
 * @returns {Object} { data, loading, error, refetch }
 */
export const useSupabaseQuery = (queryFn, options = {}) => {
  const { immediate = true, deps = [] } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await queryFn();
      if (result.success) {
        setData(result.data);
        setError(null);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return { data, loading, error, refetch: execute };
};
