// Pure functions: same input -> same output, no React, easy to reason about.

export const SORT_OPTIONS = [
  { value: '', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Avg. Customer Rating' },
];

/**
 * The search endpoint ignores category, so when both are active
 * we narrow the search results to the selected category here.
 */
export function getBaseProducts(products, { q, category }) {
  if (q && category) return products.filter((product) => product.category === category);
  return products;
}

/** Price and brand filters, combined with AND (brands are OR among themselves). */
export function filterProducts(products, { min, max, brands }) {
  const minPrice = min === '' ? 0 : Number(min);
  const maxPrice = max === '' ? Infinity : Number(max);

  return products.filter(
    (product) =>
      product.price >= minPrice &&
      product.price <= maxPrice &&
      (brands.length === 0 || brands.includes(product.brand))
  );
}

/** Returns a new sorted array (never mutates the original). */
export function sortProducts(products, sort) {
  switch (sort) {
    case 'price-asc':
      return [...products].sort((a, b) => a.price - b.price);
    case 'price-desc':
      return [...products].sort((a, b) => b.price - a.price);
    case 'rating':
      return [...products].sort((a, b) => b.rating - a.rating);
    default:
      return products; // "Featured" = original API order
  }
}

/**
 * Unique brands with product counts, sorted A–Z: [{ name: 'Apple', count: 5 }, ...]
 * Selected brands always stay in the list (with count 0 if nothing matches),
 * so the user can still untick them.
 */
export function getBrandOptions(products, selectedBrands) {
  const counts = {};
  products.forEach((product) => {
    if (product.brand) counts[product.brand] = (counts[product.brand] ?? 0) + 1;
  });
  selectedBrands.forEach((brand) => {
    if (!(brand in counts)) counts[brand] = 0;
  });

  return Object.keys(counts)
    .sort((a, b) => a.localeCompare(b))
    .map((name) => ({ name, count: counts[name] }));
}

/** Returns the items for one page. */
export function paginate(items, page, pageSize) {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

/**
 * Page buttons to show: first, last, and the current page ± `span`, with '...' for gaps.
 * e.g. page 6 of 17, span 1 -> [1, '...', 5, 6, 7, '...', 17]
 */
export function getPageNumbers(currentPage, totalPages, span = 1) {
  const pages = new Set([1, totalPages]);
  for (let page = currentPage - span; page <= currentPage + span; page++) {
    if (page >= 1 && page <= totalPages) pages.add(page);
  }

  const sorted = [...pages].sort((a, b) => a - b);
  const result = [];
  sorted.forEach((page, index) => {
    if (index > 0 && page - sorted[index - 1] > 1) result.push('...');
    result.push(page);
  });
  return result;
}
