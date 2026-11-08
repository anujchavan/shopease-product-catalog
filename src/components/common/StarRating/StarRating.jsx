import styles from './StarRating.module.css';

/**
 * Shows partial stars (e.g. 2.6 -> 52% filled) by stacking two rows of 5 stars:
 * grey stars underneath, gold stars on top, cut to `rating / 5` width.
 */
function StarRating({ rating, size = 'md', showValue = true }) {
  const percentage = Math.min(100, Math.max(0, (rating / 5) * 100));

  return (
    <span className={`${styles.rating} ${styles[size]}`}>
      <span className={styles.stars} role="img" aria-label={`Rated ${rating.toFixed(1)} out of 5`}>
        <span aria-hidden="true">★★★★★</span>
        <span className={styles.filled} style={{ width: `${percentage}%` }} aria-hidden="true">
          ★★★★★
        </span>
      </span>
      {showValue && (
        <span className={`${styles.value} tabular`} aria-hidden="true">
          {rating.toFixed(1)}
        </span>
      )}
    </span>
  );
}

export default StarRating;
