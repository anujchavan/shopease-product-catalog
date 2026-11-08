import { useState } from 'react';
import styles from './ProductGallery.module.css';

/** Large image + clickable thumbnails. */
function ProductGallery({ images, title }) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className={styles.gallery}>
      <div className={styles.mainImage}>
        <img
          src={images[activeIndex]}
          alt={title}
          width="600"
          height="600"
          // The main image is the most important thing on this page, so load it first
          fetchPriority="high"
        />
      </div>

      {images.length > 1 && (
        <ul className={styles.thumbnails} aria-label="Product images">
          {images.map((image, index) => (
            // index is a safe key here: the image list never changes order
            <li key={index}>
              <button
                type="button"
                className={`${styles.thumbnail} ${index === activeIndex ? styles.activeThumbnail : ''}`}
                onClick={() => setActiveIndex(index)}
                aria-label={`Show image ${index + 1} of ${images.length}`}
                aria-pressed={index === activeIndex}
              >
                <img src={image} alt="" width="72" height="72" loading="lazy" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ProductGallery;
