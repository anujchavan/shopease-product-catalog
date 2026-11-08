import styles from './ActiveFilters.module.css';

/** Turns the current filters into a list of chips; clicking a chip removes that filter. */
function getChips(filters, categoryName) {
  const chips = [];

  if (filters.q) {
    chips.push({ key: 'q', label: `“${filters.q}”`, change: { q: '', brands: [] } });
  }
  if (filters.category) {
    chips.push({ key: 'category', label: categoryName, change: { category: '', brands: [] } });
  }
  if (filters.min !== '' || filters.max !== '') {
    const from = filters.min !== '' ? `$${filters.min}` : '$0';
    const to = filters.max !== '' ? `$${filters.max}` : 'any';
    chips.push({ key: 'price', label: `${from} – ${to}`, change: { min: '', max: '' } });
  }
  filters.brands.forEach((brand) => {
    chips.push({
      key: `brand-${brand}`,
      label: brand,
      change: { brands: filters.brands.filter((item) => item !== brand) },
    });
  });

  return chips;
}

function ActiveFilters({ filters, categoryName, onFilterChange }) {
  const chips = getChips(filters, categoryName);
  if (chips.length === 0) return null;

  return (
    <ul className={styles.chips} aria-label="Active filters">
      {chips.map((chip) => (
        <li key={chip.key}>
          <button
            type="button"
            className={styles.chip}
            onClick={() => onFilterChange(chip.change)}
            aria-label={`Remove filter: ${chip.label}`}
          >
            {chip.label}
            <span className={styles.remove} aria-hidden="true">×</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

export default ActiveFilters;
