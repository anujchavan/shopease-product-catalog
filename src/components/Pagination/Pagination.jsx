import { useMediaQuery, MOBILE_QUERY } from '@/hooks/useMediaQuery';
import { getPageNumbers } from '@/utils/productFilters';
import styles from './Pagination.module.css';

/**
 * Desktop: ← Prev  1 … 5 [6] 7 … 17  Next →
 * Mobile:  ←  1 … [6] … 17  →   (fewer buttons so it fits on a phone)
 */
function Pagination({ currentPage, totalPages, onPageChange }) {
  const isMobile = useMediaQuery(MOBILE_QUERY);

  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages, isMobile ? 0 : 1);

  return (
    <nav className={styles.pagination} aria-label="Pagination">
      <button
        type="button"
        className={styles.button}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        ←{!isMobile && <span>&nbsp;Prev</span>}
      </button>

      {pages.map((page, index) =>
        page === '...' ? (
          <span key={`gap-${index}`} className={styles.gap} aria-hidden="true">
            …
          </span>
        ) : (
          <button
            key={page}
            type="button"
            className={`${styles.button} ${styles.number} tabular ${page === currentPage ? styles.current : ''}`}
            onClick={() => onPageChange(page)}
            aria-current={page === currentPage ? 'page' : undefined}
            aria-label={`Page ${page}`}
          >
            {page}
          </button>
        )
      )}

      <button
        type="button"
        className={styles.button}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        {!isMobile && <span>Next&nbsp;</span>}→
      </button>
    </nav>
  );
}

export default Pagination;
