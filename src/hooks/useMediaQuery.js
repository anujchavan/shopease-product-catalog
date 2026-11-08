import { useSyncExternalStore } from 'react';

/**
 * Returns true while a CSS media query matches, and re-renders when it changes.
 * Example: const isMobile = useMediaQuery('(max-width: 859px)');
 *
 * useSyncExternalStore is React's built-in way to read values from outside React
 * (here: the browser window size) without bugs.
 */
export function useMediaQuery(query) {
  return useSyncExternalStore(
    (onChange) => {
      const mediaQuery = window.matchMedia(query);
      mediaQuery.addEventListener('change', onChange);
      return () => mediaQuery.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches
  );
}

/** Same breakpoint as the CSS: below 860px the filters collapse behind a button */
export const MOBILE_QUERY = '(max-width: 859px)';
