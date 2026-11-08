import styles from './PageLoader.module.css';

/** Spinner shown while a lazy-loaded page is downloading. */
function PageLoader() {
  return (
    <div className={styles.wrapper} role="status">
      <span className={styles.spinner} aria-hidden="true" />
      <span className="visually-hidden">Loading…</span>
    </div>
  );
}

export default PageLoader;
