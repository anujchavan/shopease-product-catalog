import StarRating from '@/components/common/StarRating/StarRating';
import { formatDate, getInitials, plural } from '@/utils/format';
import styles from './ReviewList.module.css';

/** "Customer reviews" panel. `ref` lets the detail page scroll here (React 19: ref is a normal prop). */
function ReviewList({ reviews, ref }) {
  const average = reviews.length
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <section ref={ref} className={styles.panel} aria-labelledby="reviews-title">
      <div className={styles.header}>
        <h2 id="reviews-title" className={styles.title}>
          Customer reviews
        </h2>
        {average && (
          <span className={`${styles.summary} tabular`}>
            Average {average} from {plural(reviews.length, 'review')}
          </span>
        )}
      </div>

      {reviews.length === 0 ? (
        <p className={styles.summary}>No reviews yet.</p>
      ) : (
        <ul className={styles.grid}>
          {reviews.map((review, index) => (
            // Reviews have no id in the API, so name + date + index makes a unique key
            <li key={`${review.reviewerName}-${review.date}-${index}`} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.reviewer}>
                  <span className={styles.avatar} aria-hidden="true">
                    {getInitials(review.reviewerName)}
                  </span>
                  <span className={styles.name}>{review.reviewerName}</span>
                </div>
                <StarRating rating={review.rating} showValue={false} />
              </div>
              <p className={styles.comment}>{review.comment}</p>
              <time className={styles.date} dateTime={review.date}>
                {formatDate(review.date)}
              </time>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default ReviewList;
