import styles from './Skeleton.module.css';

/** Grey placeholder block with a moving shimmer, shown while data is loading. */
export function Skeleton({ width = '100%', height = 12, className = '' }) {
  return (
    <span className={`${styles.skeleton} ${className}`} style={{ width, height }} aria-hidden="true" />
  );
}

/** Same shape as ProductCard, so the layout doesn't jump when real data arrives. */
export function ProductCardSkeleton() {
  return (
    <div className={styles.card} aria-hidden="true">
      <Skeleton className={styles.image} height="auto" />
      <Skeleton width="80%" className={styles.bar} />
      <Skeleton width="40%" className={styles.bar} />
    </div>
  );
}
