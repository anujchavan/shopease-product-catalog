import Button from '@/components/common/Button/Button';
import { Skeleton } from '@/components/common/Skeleton/Skeleton';
import FilterSection from './FilterSection';
import styles from './Filters.module.css';

/**
 * Single-select category list (the API filters by one category at a time).
 * Each row is a real radio button (hidden visually), so it works with keyboard
 * arrow keys and screen readers, but looks like a list row.
 */
function CategoryFilter({ categories, loading, error, onRetry, selected, onChange }) {
  const options = [{ slug: '', name: 'All categories' }, ...(categories ?? [])];

  return (
    <FilterSection title="Category">
      {error && (
        <p className={styles.error} role="alert">
          Couldn&apos;t load categories.{' '}
          <Button variant="link" onClick={onRetry}>
            Retry
          </Button>
        </p>
      )}

      {loading ? (
        <div className={styles.loadingList}>
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} width={`${55 + ((index * 17) % 35)}%`} height={14} />
          ))}
        </div>
      ) : (
        <div className={styles.list}>
          {options.map((category) => {
            const isSelected = selected === category.slug;
            return (
              <label
                key={category.slug || 'all'}
                className={`${styles.row} ${isSelected ? styles.rowSelected : ''}`}
              >
                <input
                  type="radio"
                  name="category"
                  className="visually-hidden"
                  checked={isSelected}
                  onChange={() => onChange(category.slug)}
                />
                {category.name}
              </label>
            );
          })}
        </div>
      )}
    </FilterSection>
  );
}

export default CategoryFilter;
