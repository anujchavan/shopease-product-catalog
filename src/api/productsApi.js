const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://dummyjson.com';

// The listing only needs these fields. Asking for fewer fields with `select`
// shrinks the "all products" response from ~300 KB to ~40 KB.
const LISTING_FIELDS = 'title,price,rating,brand,category,thumbnail,discountPercentage';

// One place that knows every API URL. Components never build URLs themselves.
export const API = {
  allProducts: () => `${BASE_URL}/products?limit=0&select=${LISTING_FIELDS}`,
  productsByCategory: (slug) =>
    `${BASE_URL}/products/category/${encodeURIComponent(slug)}?limit=0&select=${LISTING_FIELDS}`,
  searchProducts: (query) =>
    `${BASE_URL}/products/search?q=${encodeURIComponent(query)}&limit=0&select=${LISTING_FIELDS}`,
  categories: () => `${BASE_URL}/products/categories`,
  productById: (id) => `${BASE_URL}/products/${encodeURIComponent(id)}`,
};

/**
 * Which URL the listing should load:
 * - search active   -> search endpoint (category is then filtered on the client)
 * - category only   -> category endpoint
 * - neither         -> all products
 */
export function getListingUrl({ q, category }) {
  if (q) return API.searchProducts(q);
  if (category) return API.productsByCategory(category);
  return API.allProducts();
}

// Simple in-memory cache: URL -> response data.
// Going back from the detail page shows the list instantly, without refetching.
const cache = new Map();

export function getCached(url) {
  return cache.get(url);
}

export async function fetchJson(url, signal) {
  if (cache.has(url)) return cache.get(url);

  let response;
  try {
    response = await fetch(url, { signal });
  } catch (error) {
    // Request was cancelled on purpose (component unmounted / URL changed)
    if (error.name === 'AbortError') throw error;
    throw new Error('Check your connection and try again.');
  }

  if (!response.ok) {
    const error = new Error(`Server responded with ${response.status}.`);
    error.status = response.status; // lets the detail page show "Product not found" for 404
    throw error;
  }

  const data = await response.json();
  cache.set(url, data); // only successful responses are cached
  return data;
}
