import { memo } from 'react';
import { Link } from 'react-router-dom';
import StarRating from '@/components/common/StarRating/StarRating';
import { formatPrice, getDiscount, getOriginalPrice } from '@/utils/format';
import styles from './ProductCard.module.css';

/**
 * Wrapped in React.memo: when the list re-renders (filter change, filters panel toggle),
 * cards whose props didn't change skip re-rendering.
 * This works because product objects come from the cached API response,
 * so the same product keeps the same object reference.
 *
 * `subtitle` = brand, or the category name for products without a brand.
 */
function ProductCard({ product, subtitle }) {
  const discount = getDiscount(product.discountPercentage);

  return (
    <Link
      to={`/product/${product.id}`}
      // Lets the detail page know the user came from the listing (used by the Back button)
      state={{ fromListing: true }}
      className={styles.card}
    >
      <div className={styles.imageWell}>
        <img
          src={product.thumbnail}
          alt={product.title}
          width="300"
          height="300"
          loading="lazy"
          decoding="async"
          className={styles.image}
        />
        {discount > 0 && <span className={`${styles.badge} tabular`}>-{discount}%</span>}
      </div>

      <div className={styles.body}>
        <span className={styles.subtitle}>{subtitle}</span>
        <h3 className={styles.title}>{product.title}</h3>
        <StarRating rating={product.rating} size="sm" />
        <div className={styles.priceRow}>
          <span className={`${styles.price} tabular`}>{formatPrice(product.price)}</span>
          {discount > 0 && (
            <span className={`${styles.originalPrice} tabular`}>
              <span className="visually-hidden">Original price:</span>
              {formatPrice(getOriginalPrice(product.price, product.discountPercentage))}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default memo(ProductCard);
