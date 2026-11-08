// Created once and reused: creating an Intl formatter is relatively expensive
const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

/** 1099.5 -> "$1,099.50" */
export function formatPrice(price) {
  return priceFormatter.format(price);
}

/** Price before discount: price / (1 - discount%) */
export function getOriginalPrice(price, discountPercentage) {
  return price / (1 - discountPercentage / 100);
}

/** Rounded discount, e.g. 13.67 -> 14. Only shown when > 0. */
export function getDiscount(discountPercentage = 0) {
  return Math.round(discountPercentage);
}

/** "home-decoration" -> "Home Decoration" */
export function titleCase(slug = '') {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/** Display name from the categories API, falling back to a title-cased slug */
export function getCategoryName(categories, slug) {
  return categories?.find((category) => category.slug === slug)?.name ?? titleCase(slug);
}

/** "2025-01-05T..." -> "Jan 5, 2025" */
export function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/** "Eleanor Collins" -> "EC" */
export function getInitials(name = '?') {
  return name
    .split(' ')
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

/** "s" for plurals: 1 review, 2 reviews */
export function plural(count, word) {
  return `${count} ${word}${count === 1 ? '' : 's'}`;
}
