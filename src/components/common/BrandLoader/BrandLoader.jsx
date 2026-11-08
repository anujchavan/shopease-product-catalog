import styles from './BrandLoader.module.css';

/**
 * Friendly loading message with an animated shopping bag:
 * three small "items" drop into the bag while it gently bobs.
 * The items are drawn BEFORE the bag, so they disappear behind it.
 */
function BrandLoader({ title, subtitle }) {
  return (
    <div className={styles.loader} role="status" aria-live="polite">
      <svg className={styles.bag} width="52" height="52" viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <rect className={styles.item} x="15" y="14" width="7" height="7" rx="1.5" fill="#f59e0b" />
        <rect className={styles.item} x="24" y="12" width="6" height="9" rx="1.5" fill="#141414" style={{ animationDelay: '0.5s' }} />
        <rect className={styles.item} x="20" y="15" width="8" height="5" rx="1.5" fill="#c2410c" style={{ animationDelay: '1s' }} />
        <path
          d="M9 20h30l-2.4 20.2a2 2 0 0 1-2 1.8H13.4a2 2 0 0 1-2-1.8z"
          fill="#fff"
          stroke="#141414"
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
        <path d="M17 20v-3a7 7 0 0 1 14 0v3" stroke="#141414" strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="24" cy="30" r="2.2" fill="#f59e0b" />
      </svg>
      <div className={styles.text}>
        <strong className={styles.title}>{title}</strong>
        <span className={styles.subtitle}>{subtitle}</span>
      </div>
    </div>
  );
}

export default BrandLoader;
