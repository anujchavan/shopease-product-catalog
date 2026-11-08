import FilterSection from './FilterSection';
import styles from './Filters.module.css';

/**
 * Multi-select brand list with product counts.
 * `brandOptions` = [{ name, count }], extracted from the loaded products.
 */
function BrandFilter({ brandOptions, selected, onChange, loading }) {
  const toggleBrand = (brand) => {
    const isSelected = selected.includes(brand);
    onChange(isSelected ? selected.filter((item) => item !== brand) : [...selected, brand]);
  };

  return (
    <FilterSection title="Brand" hint="Select any">
      {!loading && brandOptions.length === 0 && <p className={styles.muted}>No brands in this selection.</p>}

      <div className={styles.list}>
        {brandOptions.map(({ name, count }) => {
          const isSelected = selected.includes(name);
          return (
            <label key={name} className={styles.row}>
              <input
                type="checkbox"
                className="visually-hidden"
                checked={isSelected}
                onChange={() => toggleBrand(name)}
              />
              {/* Custom-drawn checkbox; the real one above is hidden but still accessible */}
              <span className={`${styles.checkbox} ${isSelected ? styles.checkboxOn : ''}`} aria-hidden="true">
                {isSelected && '✓'}
              </span>
              <span className={styles.brandName}>{name}</span>
              <span className={`${styles.count} tabular`}>{count}</span>
            </label>
          );
        })}
      </div>
    </FilterSection>
  );
}

export default BrandFilter;
