import ProductCard from '@/components/ProductCard/ProductCard';
import { ProductCardSkeleton } from '@/components/common/Skeleton/Skeleton';
import styles from './ProductGrid.module.css';

const SKELETON_COUNT = 8;

/** Responsive grid of product cards. `getSubtitle(product)` gives the small text above the title. */
function ProductGrid({ products, getSubtitle }) {
  return (
    <ul className={styles.grid}>
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} subtitle={getSubtitle(product)} />
        </li>
      ))}
    </ul>
  );
}

/** Same grid, filled with placeholder cards while loading */
export function ProductGridSkeleton() {
  return (
    <div className={styles.grid} aria-hidden="true">
      {Array.from({ length: SKELETON_COUNT }, (_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}

export default ProductGrid;
