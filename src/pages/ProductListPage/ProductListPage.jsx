import { useMemo, useState } from 'react';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';
import { API, getListingUrl } from '@/api/productsApi';
import { useFetch } from '@/hooks/useFetch';
import { useProductFilters } from '@/hooks/useProductFilters';
import {
  filterProducts,
  getBaseProducts,
  getBrandOptions,
  paginate,
  sortProducts,
  SORT_OPTIONS,
} from '@/utils/productFilters';
import { getCategoryName } from '@/utils/format';
import FilterSidebar from '@/components/Filters/FilterSidebar';
import ActiveFilters from '@/components/ActiveFilters/ActiveFilters';
import ProductGrid, { ProductGridSkeleton } from '@/components/ProductGrid/ProductGrid';
import Pagination from '@/components/Pagination/Pagination';
import BrandLoader from '@/components/common/BrandLoader/BrandLoader';
import StatusMessage from '@/components/common/StatusMessage/StatusMessage';
import styles from './ProductListPage.module.css';

const PAGE_SIZE = 12; // divides evenly into 2, 3 and 4 columns
const NO_PRODUCTS = []; // stable empty array, so the useMemos below don't re-run for nothing

/**
 * Data flow:
 *   URL -> fetch products (search / category / all) from the API
 *       -> narrow by category (when searching) -> filter by price & brand
 *       -> sort -> paginate        (all on the client)
 *
 * Why paginate on the client instead of with the API's limit/skip?
 * Price and brand filters run in the browser. If the API sent only 12 products
 * and the brand filter removed 10 of them, the page would show 2 products
 * and the page count would be wrong. Filtering first, then paginating, keeps it correct.
 */
function ProductListPage() {
  const { filters, updateFilters, clearFilters, resetAll } = useProductFilters();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const categoriesState = useFetch(API.categories());
  const { data, loading, error, retry } = useFetch(getListingUrl(filters));
  const products = data?.products ?? NO_PRODUCTS;

  // --- Derived data (memoized: only recalculated when its inputs change) ---
  const baseProducts = useMemo(
    () => getBaseProducts(products, filters),
    [products, filters]
  );

  // Brands come from the loaded products, before price/brand filters are applied
  const brandOptions = useMemo(
    () => getBrandOptions(baseProducts, filters.brands),
    [baseProducts, filters.brands]
  );

  const filteredProducts = useMemo(
    () => sortProducts(filterProducts(baseProducts, filters), filters.sort),
    [baseProducts, filters]
  );

  // --- Pagination ---
  const total = filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(filters.page, totalPages); // guards against e.g. ?page=99 in the URL
  const visibleProducts = paginate(filteredProducts, currentPage, PAGE_SIZE);
  const firstItem = (currentPage - 1) * PAGE_SIZE + 1;
  const lastItem = Math.min(currentPage * PAGE_SIZE, total);

  // --- Text ---
  const categoryName = getCategoryName(categoriesState.data, filters.category);
  const heading = filters.q ? `Results for “${filters.q}”` : filters.category ? categoryName : 'All products';
  const activeFilterCount =
    (filters.category ? 1 : 0) + (filters.min !== '' || filters.max !== '' ? 1 : 0) + filters.brands.length;

  let summary = 'Loading products…';
  if (error) summary = '';
  else if (!loading) summary = total > 0 ? `Showing ${firstItem}–${lastItem} of ${total} products` : '0 products';

  let toggleLabel = 'Filters';
  if (isFilterOpen) toggleLabel = 'Hide filters';
  else if (activeFilterCount > 0) toggleLabel = `Filters (${activeFilterCount})`;

  const handlePageChange = (page) => {
    updateFilters({ page });
    window.scrollTo({ top: 0 });
  };

  const getSubtitle = (product) => product.brand || getCategoryName(categoriesState.data, product.category);

  const renderResults = () => {
    if (error) {
      return (
        <StatusMessage
          type="error"
          title="We couldn't load products."
          message={error.message}
          actionLabel="Try again"
          onAction={retry}
        />
      );
    }

    if (loading) {
      return (
        <>
          <BrandLoader
            title={filters.q ? `Searching for “${filters.q}”` : 'Stocking the shelves'}
            subtitle={
              filters.category
                ? `Fetching ${categoryName} from the catalog…`
                : 'Fetching products from the catalog…'
            }
          />
          <ProductGridSkeleton />
        </>
      );
    }

    if (total === 0) {
      return (
        <StatusMessage
          title="No products match your search."
          message="Try a different keyword, widen the price range or remove a brand."
          actionLabel="Reset search and filters"
          onAction={resetAll}
        />
      );
    }

    return (
      <>
        <ProductGrid products={visibleProducts} getSubtitle={getSubtitle} />
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </>
    );
  };

  return (
    <div className={`container ${styles.page}`}>
      <title>{`${heading} | ShopEase`}</title>

      {/* Mobile only: shows / hides the filters panel */}
      <button
        type="button"
        className={styles.filterToggle}
        onClick={() => setIsFilterOpen((open) => !open)}
        aria-expanded={isFilterOpen}
        aria-controls="filter-sidebar"
      >
        <SlidersHorizontal size={16} strokeWidth={2} aria-hidden="true" />
        {toggleLabel}
      </button>

      <FilterSidebar
        filters={filters}
        categoriesState={categoriesState}
        brandOptions={brandOptions}
        productsLoading={loading}
        activeFilterCount={activeFilterCount}
        resultCount={total}
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onFilterChange={updateFilters}
        onClearAll={clearFilters}
      />

      <section className={styles.results} aria-labelledby="page-title">
        <div className={styles.toolbar}>
          <div className={styles.headingGroup}>
            <h1 id="page-title" className={styles.title}>
              {heading}
            </h1>
            {/* aria-live: screen readers announce the new count when filters change */}
            <span className={`${styles.summary} tabular`} aria-live="polite">
              {summary}
            </span>
          </div>

          <label className={styles.sort}>
            Sort by
            <span className={styles.selectWrapper}>
              <select value={filters.sort} onChange={(event) => updateFilters({ sort: event.target.value })}>
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} strokeWidth={2.4} className={styles.chevron} aria-hidden="true" />
            </span>
          </label>
        </div>

        <ActiveFilters filters={filters} categoryName={categoryName} onFilterChange={updateFilters} />

        {renderResults()}
      </section>
    </div>
  );
}

export default ProductListPage;
