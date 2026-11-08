import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * The URL is the single source of truth for the listing state, e.g.
 *   /?q=phone&category=smartphones&min=100&max=900&brands=Apple|Samsung&sort=price-asc&page=2
 *
 * Why the URL instead of useState / Redux?
 * - Filters survive Back navigation and page refresh automatically
 * - A filtered view can be shared as a link
 * - No duplicate state to keep in sync
 */
export function useProductFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(() => {
    const brands = searchParams.get('brands');
    return {
      q: searchParams.get('q') ?? '',
      category: searchParams.get('category') ?? '',
      min: searchParams.get('min') ?? '',
      max: searchParams.get('max') ?? '',
      brands: brands ? brands.split('|') : [],
      sort: searchParams.get('sort') ?? '', // '' = Featured (API order)
      page: Math.max(1, Number(searchParams.get('page')) || 1),
    };
  }, [searchParams]);

  /**
   * Update one or more values, e.g. updateFilters({ category: 'laptops', brands: [] }).
   * - Empty values (and page 1) are removed, so the URL stays short.
   * - Any change except the page itself resets pagination to page 1.
   * - `replace: true`: typing in a filter shouldn't add dozens of browser history entries.
   */
  const updateFilters = useCallback(
    (changes) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);

          Object.entries(changes).forEach(([key, value]) => {
            const urlValue = Array.isArray(value) ? value.join('|') : String(value ?? '');
            const isDefault = urlValue === '' || (key === 'page' && urlValue === '1');

            if (isDefault) next.delete(key);
            else next.set(key, urlValue);
          });

          if (!('page' in changes)) next.delete('page');
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  // "Clear all" in the sidebar: removes category, price and brands, but keeps search and sort
  const clearFilters = useCallback(() => {
    updateFilters({ category: '', min: '', max: '', brands: [] });
  }, [updateFilters]);

  // Empty state button: removes search too
  const resetAll = useCallback(() => {
    updateFilters({ q: '', category: '', min: '', max: '', brands: [] });
  }, [updateFilters]);

  return { filters, updateFilters, clearFilters, resetAll };
}
