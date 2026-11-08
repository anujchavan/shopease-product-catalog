# ShopEase: Product Listing & Detail App

An Amazon-style product catalog built with **React 19**, **React Router** and plain **CSS Modules**, using the [DummyJSON Products API](https://dummyjson.com/docs/products).

🔗 **Live demo:** [shopease-product-catalog.netlify.app](https://shopease-product-catalog.netlify.app)

---

## Features

**Product Listing (`/`)**
- Product grid with image, title, brand, price, discount and star rating
- **Filters that work together:** category, price range (min/max) and brand (multi-select with product counts)
- **Search** from the header, combined with all filters
- **Sort** by price (low→high, high→low) and customer rating
- **Active filter chips:** click a chip to remove that filter
- **Pagination** (12 per page) that resets to page 1 whenever a filter changes
- Filters, search, sort and page are saved in the **URL**, so they survive Back, refresh and shared links

**Product Detail (`/product/:id`)**
- Image gallery with thumbnails
- Title, price with original price and discount, rating, stock status
- Brand, category, description, shipping / warranty / return info
- Customer reviews with average rating
- **Back button** returns to the listing with the same filters, page and scroll position

**Every screen handles loading, errors and empty results**
- Animated loader + skeleton cards while data loads
- Clear error messages with a **Try again** button (network errors, server errors, product not found)
- Friendly "no results" message with a one-click reset

**Responsive and accessible**
- Responsive layout from small phones to large desktop screens. On mobile, filters collapse behind a "Filters" button.
- Keyboard friendly, with visible focus outlines and a "Skip to main content" link
- Real radio buttons and checkboxes under the custom styling, labelled inputs, and screen-reader announcements for result counts

---

## Tech Stack

| Tool | Why |
|---|---|
| **React 19** (functional components + hooks) | As required by the brief |
| **React Router 7** | Routing, URL search params, scroll restoration, lazy-loaded routes |
| **Vite** | Fast dev server and build (Create React App is deprecated) |
| **CSS Modules + CSS variables** | Plain CSS with styles scoped to each component, and design tokens in one place |
| **lucide-react** | Small icon library (only the icons used are bundled) |
| **oxlint** | Fast linter with React rules (e.g. rules of hooks) |

No UI component library is used. Every component is built from scratch, as the brief asks.

---

## Setup Instructions

**Requirements:** Node.js **20.19+** (or 22.12+) and npm.

```bash
# 1. Clone the repository
git clone <repository-url>
cd ecommerce-app

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open **http://localhost:5173** in your browser.

| Command | What it does |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Check the code with oxlint |

**Deployment:** hosted on Netlify. `public/_redirects` sends every route to `index.html`, so refreshing a page like `/product/5` works instead of returning a 404.

---

## Project Structure

```
src/
├── api/
│   └── productsApi.js        # All API URLs, fetch + error handling, response cache
├── hooks/
│   ├── useFetch.js           # Loading / error / data, cancels outdated requests
│   ├── useProductFilters.js  # Reads and writes filters in the URL
│   ├── useDebouncedInput.js  # Waits until the user stops typing
│   └── useMediaQuery.js      # Reacts to screen size (used by pagination)
├── utils/
│   ├── productFilters.js     # Pure functions: filter, sort, brands, paginate
│   └── format.js             # Price, date, category name, initials
├── components/
│   ├── common/               # Button, StarRating, Skeleton, BrandLoader, StatusMessage, PageLoader
│   ├── Header/               # Logo + SearchBar
│   ├── Filters/              # FilterSidebar, CategoryFilter, PriceFilter, BrandFilter
│   ├── ActiveFilters/        # Removable filter chips
│   ├── ProductGrid/  ProductCard/  Pagination/
│   ├── ProductGallery/  ReviewList/
│   └── Layout/               # Page shell with header
├── pages/
│   ├── ProductListPage/
│   ├── ProductDetailPage/
│   └── ErrorPage.jsx         # Shown if a component crashes
└── App.jsx                   # Routes
```

The code is organised in **layers**, and each layer has one job:
**API** (talks to the server) → **hooks** (manage state) → **utils** (pure logic) → **components** (show UI) → **pages** (combine everything).

---

## Architectural Decisions

### 1. The URL is the single source of truth for filters
```
/?q=phone&category=smartphones&min=200&max=1000&brands=Apple|Samsung&sort=price-asc&page=2
```
All listing state lives in the URL, read and written through one custom hook (`useProductFilters`).

**Why:** the brief requires filters to stay applied after navigating back. Storing them in the URL gives that automatically, plus refresh support and shareable links, with no extra state to keep in sync. That's why no Redux or Context is needed: the state is small, belongs to one page, and the URL already holds it.

### 2. Fetch the matching products once, then filter, sort and paginate in the browser
- No search or category → `GET /products?limit=0`
- Category selected → `GET /products/category/{slug}?limit=0`
- Search active → `GET /products/search?q=...&limit=0`, then narrowed to the selected category in the browser

**Why not paginate with the API's `limit`/`skip`?** The price and brand filters can only run in the browser, because the API doesn't support them. If the API returned 12 products and the brand filter removed 10 of them, page 1 would show 2 products and the page count would be wrong. Filtering the full set first, then paginating, keeps results and page numbers correct. The whole catalog is only ~194 products, so this is fast.

### 3. Logic is separated from UI
- **Pure functions** (`utils/productFilters.js`) do the filtering, sorting and pagination. They don't depend on React, so they're easy to read and test.
- **Custom hooks** hold the reusable stateful logic (fetching, URL state, debouncing).
- **Components** stay focused on displaying data.

### 4. Reliable data fetching (`useFetch`)
- **Cancels outdated requests** with `AbortController`. If a user switches categories quickly, a slow old response can never overwrite the new one.
- **Remembers which URL each result belongs to**, so the previous category's products never flash on screen for the new category.
- **Retry** support for every error state.

### 5. Reusable components
Small components like `Button`, `StarRating`, `StatusMessage` (one component for both error and empty states), `Skeleton` and `FilterSection` are reused across both pages, which keeps the look consistent and avoids duplicated code.

### 6. Performance optimisations

| Technique | Where | Benefit |
|---|---|---|
| `select` query param | Listing API calls | Downloads only the fields the grid needs: **~306 KB → ~40 KB** |
| In-memory response cache | API layer | Going back from a product shows the list instantly, without refetching |
| `useMemo` | Brand list, filtered + sorted list | Recalculated only when products or filters change, not on every render |
| `React.memo` | `ProductCard` | Cards that didn't change skip re-rendering |
| Debounced inputs | Search (350 ms), price (400 ms) | Filters run once the user stops typing, not on every keystroke |
| `React.lazy` + `Suspense` | Detail page | The detail page code only downloads when a product is opened |
| `loading="lazy"` + fixed image sizes | Product images | Images load as you scroll, and the layout doesn't jump |

---

## Assumptions

1. **Category is single-select.** The API's `/products/category/{slug}` endpoint accepts one category at a time.
2. **Brand is multi-select.** A product matches if its brand is any of the selected brands.
3. **Brands come from the currently loaded products** (the selected category or the search results). Products without a brand (e.g. groceries) appear in the grid but not in the brand list.
4. **Changing the category or search clears selected brands**, because the available brands change with them.
5. **The price filter uses the current (discounted) price** shown on the card. Min and max are inclusive. If min > max, a warning is shown and the result is empty.
6. **"Update immediately"** is interpreted as updating ~0.4 s after the user stops typing in the price inputs, to avoid filtering on every keystroke. Category and brand clicks update instantly.
7. **"Clear all" in the sidebar** clears category, price and brands, but keeps the search and sort order. The "Reset search and filters" button on the empty state clears everything.
8. **Search uses the API's search endpoint**, which also matches product descriptions, so results can include products whose title doesn't contain the search word.
9. **Prices are in USD**, as provided by the API.
10. **Unknown URLs redirect to the listing page.**
11. **The Back button** returns to the previous listing page (with its filters) when the user came from the listing. If the detail page was opened directly (shared link or refresh), it goes to the listing home page instead.

---

## Improvements With More Time

- **Shopping cart with Redux Toolkit:** "Add to cart" on the detail page, a cart count in the header, a cart page with quantity +/- and total price, saved in `localStorage` so it survives a refresh
- **Wishlist:** a heart icon on each product card to save favourites, with a wishlist page, also saved in `localStorage`
- **More filters:** minimum rating (e.g. 4★ & up), discount (e.g. 10% off or more) and "in stock only", all added to the same URL-based filter system
- **Dark mode:** a theme toggle; the colours are already CSS variables, so only their values need to change
