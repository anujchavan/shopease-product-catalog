import Button from '@/components/common/Button/Button';
import CategoryFilter from './CategoryFilter';
import PriceFilter from './PriceFilter';
import BrandFilter from './BrandFilter';
import styles from './Filters.module.css';

/**
 * Desktop: always-visible sidebar on the left.
 * Mobile (< 860px): hidden until the "Filters" button is pressed, then shown full width.
 */
function FilterSidebar({
  filters,
  categoriesState,
  brandOptions,
  productsLoading,
  activeFilterCount,
  resultCount,
  isOpen,
  onClose,
  onFilterChange,
  onClearAll,
}) {
  return (
    <aside
      id="filter-sidebar"
      className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}
      aria-label="Product filters"
    >
      <div className={styles.sidebarHeader}>
        <h2 className={styles.sidebarTitle}>Filters</h2>
        {activeFilterCount > 0 && (
          <Button variant="link" onClick={onClearAll}>
            Clear all
          </Button>
        )}
      </div>

      <CategoryFilter
        categories={categoriesState.data}
        loading={categoriesState.loading}
        error={categoriesState.error}
        onRetry={categoriesState.retry}
        selected={filters.category}
        // Brands depend on the category, so old brand selections are cleared
        onChange={(category) => onFilterChange({ category, brands: [] })}
      />

      <PriceFilter min={filters.min} max={filters.max} onChange={onFilterChange} />

      <BrandFilter
        brandOptions={brandOptions}
        selected={filters.brands}
        loading={productsLoading}
        onChange={(brands) => onFilterChange({ brands })}
      />

      {/* Mobile only: close the panel and see the results */}
      <Button variant="primary" className={styles.showResults} onClick={onClose}>
        {productsLoading ? 'Show results' : `Show ${resultCount} result${resultCount === 1 ? '' : 's'}`}
      </Button>
    </aside>
  );
}

export default FilterSidebar;
