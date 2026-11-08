import { useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, RotateCcw, ShieldCheck, Truck } from 'lucide-react';
import { API } from '@/api/productsApi';
import { useFetch } from '@/hooks/useFetch';
import { formatPrice, getCategoryName, getDiscount, getOriginalPrice, plural } from '@/utils/format';
import ProductGallery from '@/components/ProductGallery/ProductGallery';
import ReviewList from '@/components/ReviewList/ReviewList';
import StarRating from '@/components/common/StarRating/StarRating';
import StatusMessage from '@/components/common/StatusMessage/StatusMessage';
import BrandLoader from '@/components/common/BrandLoader/BrandLoader';
import Button from '@/components/common/Button/Button';
import { Skeleton } from '@/components/common/Skeleton/Skeleton';
import styles from './ProductDetailPage.module.css';

/** "In Stock" -> green, "Low Stock" -> amber, "Out of Stock" -> red */
function getStockTone(status) {
  if (/out/i.test(status)) return 'danger';
  if (/low/i.test(status)) return 'warn';
  return 'success';
}

function ProductDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const reviewsRef = useRef(null);

  const { data: product, loading, error, retry } = useFetch(API.productById(id));
  const { data: categories } = useFetch(API.categories()); // cached, used for the category name

  // Came from the listing? Go back in history, so filters, page and scroll position are restored.
  // Opened directly (shared link / refresh)? There's no listing to go back to, so open it fresh.
  const handleBack = () => {
    if (location.state?.fromListing) navigate(-1);
    else navigate('/');
  };

  const scrollToReviews = () => reviewsRef.current?.scrollIntoView({ behavior: 'smooth' });

  const backButton = (
    <div>
      <Button onClick={handleBack}>
        <ArrowLeft size={16} strokeWidth={2.2} aria-hidden="true" />
        Back to products
      </Button>
    </div>
  );

  if (loading) {
    return (
      <div className={`container ${styles.page}`}>
        {backButton}
        <BrandLoader title="Unpacking product details" subtitle="Images, pricing and reviews are on their way…" />
        <DetailSkeleton />
      </div>
    );
  }

  if (error) {
    const notFound = error.status === 404;
    return (
      <div className={`container ${styles.page}`}>
        {backButton}
        <StatusMessage
          type="error"
          title={notFound ? 'Product not found' : "We couldn't load this product."}
          message={notFound ? 'This product does not exist or was removed.' : error.message}
          // Retrying a product that doesn't exist won't help, so no button for 404
          actionLabel={notFound ? undefined : 'Try again'}
          onAction={notFound ? undefined : retry}
        />
      </div>
    );
  }

  const discount = getDiscount(product.discountPercentage);
  const reviews = product.reviews ?? [];
  const images = product.images?.length ? product.images : [product.thumbnail];
  const stockStatus = product.availabilityStatus || (product.stock > 0 ? 'In Stock' : 'Out of Stock');

  return (
    <div className={`container ${styles.page}`}>
      <title>{`${product.title} | ShopEase`}</title>
      {backButton}

      <article className={styles.article}>
        {/* key: if the product changes, the gallery starts again from the first image */}
        <ProductGallery key={product.id} images={images} title={product.title} />

        <div className={styles.info}>
          <div className={styles.titleBlock}>
            <h1 className={styles.title}>{product.title}</h1>
            <div className={styles.ratingRow}>
              <StarRating rating={product.rating} size="lg" />
              <span className={styles.divider} aria-hidden="true" />
              <button type="button" className={styles.reviewLink} onClick={scrollToReviews}>
                {plural(reviews.length, 'review')}
              </button>
            </div>
          </div>

          <div className={styles.priceBlock}>
            <div className={styles.priceRow}>
              <span className={`${styles.price} tabular`}>{formatPrice(product.price)}</span>
              {discount > 0 && (
                <>
                  <span className={`${styles.originalPrice} tabular`}>
                    <span className="visually-hidden">Original price:</span>
                    {formatPrice(getOriginalPrice(product.price, product.discountPercentage))}
                  </span>
                  <span className={`${styles.discount} tabular`}>-{discount}%</span>
                </>
              )}
            </div>

            <p className={`${styles.stock} ${styles[getStockTone(stockStatus)]}`}>
              <span className={styles.stockDot} aria-hidden="true" />
              {stockStatus}
              {product.stock > 0 && product.stock <= 10 && (
                <span className={styles.stockNote}>Only {product.stock} left</span>
              )}
            </p>
          </div>

          <dl className={styles.specs}>
            <dt>Brand</dt>
            <dd className={styles.brand}>{product.brand || '—'}</dd>
            <dt>Category</dt>
            <dd className={styles.brand}>{getCategoryName(categories, product.category)}</dd>
          </dl>

          <div className={styles.descriptionBlock}>
            <h2 className={styles.subheading}>Description</h2>
            <p className={styles.description}>{product.description}</p>
          </div>

          <ul className={styles.services}>
            <li>
              <Truck size={20} strokeWidth={1.8} aria-hidden="true" />
              {product.shippingInformation || 'Shipping details unavailable'}
            </li>
            <li>
              <ShieldCheck size={20} strokeWidth={1.8} aria-hidden="true" />
              {product.warrantyInformation || 'No warranty information'}
            </li>
            <li>
              <RotateCcw size={20} strokeWidth={1.8} aria-hidden="true" />
              {product.returnPolicy || 'Return policy unavailable'}
            </li>
          </ul>
        </div>
      </article>

      <ReviewList ref={reviewsRef} reviews={reviews} />
    </div>
  );
}

/** Placeholder with the same layout as the real page */
function DetailSkeleton() {
  return (
    <div className={styles.article} aria-hidden="true">
      <Skeleton height="auto" className={styles.skeletonImage} />
      <div className={`${styles.info} ${styles.skeletonInfo}`}>
        <Skeleton width="80%" height={34} />
        <Skeleton width="40%" height={14} />
        <Skeleton width="30%" height={30} />
        <Skeleton height={120} />
      </div>
    </div>
  );
}

export default ProductDetailPage;
