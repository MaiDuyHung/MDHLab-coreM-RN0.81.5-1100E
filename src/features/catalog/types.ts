/**
 * Catalog domain model.
 *
 * These types are what the screens and the cart speak. They are deliberately
 * independent of whatever backend is plugged in: the shape coming off the wire
 * is described in `mapper.ts` and translated into this model there.
 */

export type ProductImage = {
  url: string;
};

export type ProductSpec = {
  label: string;
  value: string;
};

export type Product = {
  id: string;
  title: string;
  brand: string | null;
  category: string;
  description: string;
  /** List price, before any discount. */
  price: number;
  /** Discount in percent, 0 when the product is sold at list price. */
  discount: number;
  /** Units available; 0 means out of stock. */
  inStock: number;
  rating: number;
  numReviews: number;
  images: ProductImage[];
  thumbnail: string;
  specification: ProductSpec[];
  tags: string[];
};

export type Category = {
  slug: string;
  name: string;
};

export type Paginated<T> = {
  items: T[];
  total: number;
  limit: number;
  skip: number;
};

export type ProductSort = 'newest' | 'cheapest' | 'expensive' | 'top-rated';

/** Filters the backend resolves for us. */
export type ProductQuery = {
  search?: string;
  category?: string;
  sort?: ProductSort;
};

/**
 * Filters refined on the device.
 *
 * Ported from the reference's `filters.slice.js`. The reference applied these
 * server-side; our current backend cannot, so they are applied to the loaded
 * pages (see `apply-local-filters.ts`). Move each one into `ProductQuery` as
 * the backend grows support for it.
 */
export type ProductFilters = {
  inStockOnly: boolean;
  discountOnly: boolean;
  minPrice: number | null;
  maxPrice: number | null;
};
