import { Search } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useProductFilters } from '@/hooks/useProductFilters';
import { useDebouncedInput } from '@/hooks/useDebouncedInput';
import styles from './Header.module.css';

/**
 * - On the listing page: results update 350ms after you stop typing.
 * - Enter applies the search immediately.
 * - On the detail page: Enter takes you to the listing with the search applied.
 * A new search clears selected brands, because the brand list depends on the results.
 */
function SearchBar() {
  const { filters, updateFilters } = useProductFilters();
  const location = useLocation();
  const navigate = useNavigate();
  const isListingPage = location.pathname === '/';

  const applySearch = (value) => {
    const q = value.trim();
    if (isListingPage) {
      if (q !== filters.q) updateFilters({ q, brands: [] });
    } else if (q) {
      navigate(`/?q=${encodeURIComponent(q)}`);
    }
  };

  // Only search live while typing on the listing page
  const input = useDebouncedInput(
    filters.q,
    (value) => {
      if (isListingPage) applySearch(value);
    },
    350
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    input.cancelPending();
    applySearch(input.value);
  };

  const handleClear = () => {
    input.setValueNow('');
    applySearch('');
  };

  return (
    <form className={styles.search} role="search" onSubmit={handleSubmit}>
      <Search size={18} strokeWidth={2} className={styles.searchIcon} aria-hidden="true" />
      <input
        type="search"
        placeholder="Search products…"
        aria-label="Search products"
        autoComplete="off"
        value={input.value}
        onChange={(event) => input.handleChange(event.target.value)}
        className={styles.searchInput}
      />
      {input.value && (
        <button type="button" className={styles.clearButton} onClick={handleClear} aria-label="Clear search">
          ×
        </button>
      )}
    </form>
  );
}

export default SearchBar;
