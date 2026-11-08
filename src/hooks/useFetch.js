import { useCallback, useEffect, useState } from 'react';
import { fetchJson, getCached } from '@/api/productsApi';

/**
 * Fetches JSON from a URL and returns { data, loading, error, retry }.
 *
 * - The result remembers which URL it belongs to. If the URL changes, the old
 *   result is ignored, so we never show category A's products for category B.
 * - Cached data is returned immediately, so Back navigation has no loading flash.
 * - The old request is cancelled when the URL changes (AbortController), so a slow
 *   old response can never overwrite a newer one (race condition).
 */
export function useFetch(url) {
  const [result, setResult] = useState({ url: null, data: null, error: null });
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    fetchJson(url, controller.signal)
      .then((data) => setResult({ url, data, error: null }))
      .catch((error) => {
        if (error.name === 'AbortError') return; // ignore cancelled requests
        setResult({ url, data: null, error });
      });

    // Cleanup runs when the URL changes and when the component unmounts
    return () => controller.abort();
  }, [url, retryCount]);

  const retry = useCallback(() => {
    setResult({ url: null, data: null, error: null }); // back to "loading"
    setRetryCount((count) => count + 1);
  }, []);

  // Derived during render (no extra state needed)
  const isCurrent = result.url === url;
  const cached = getCached(url);

  return {
    data: isCurrent ? result.data : (cached ?? null),
    loading: !isCurrent && !cached,
    error: isCurrent ? result.error : null,
    retry,
  };
}
