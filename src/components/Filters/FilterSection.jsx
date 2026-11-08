import styles from './Filters.module.css';

/**
 * Wrapper for one group of filters, with an optional helper text on the right.
 * <fieldset> + <legend> tells screen readers which group a radio/checkbox belongs to.
 */
function FilterSection({ title, hint, children }) {
  return (
    <fieldset className={styles.section}>
      <legend className={styles.legend}>{title}</legend>
      {hint && <span className={styles.hint}>{hint}</span>}
      {children}
    </fieldset>
  );
}

export default FilterSection;
