import type { Paginated, Product, ProductFilters } from './types';

export const EMPTY_FILTERS: ProductFilters = {
  inStockOnly: false,
  discountOnly: false,
  minPrice: null,
  maxPrice: null,
};

export function hasActiveFilters(filters: ProductFilters) {
  return (
    filters.inStockOnly
    || filters.discountOnly
    || filters.minPrice !== null
    || filters.maxPrice !== null
  );
}

/**
 * Flattens the infinite-query pages and applies the device-side filters.
 *
 * Note this narrows pages we already hold rather than asking the backend for a
 * narrower set, so a heavily filtered list can look short until more pages are
 * loaded. Once the backend supports these filters, pass them through
 * `ProductQuery` instead and delete this module.
 */
export function selectProducts(
  pages: Paginated<Product>[] | undefined,
  filters: ProductFilters,
): Product[] {
  const products = pages?.flatMap(page => page.items) ?? [];

  if (!hasActiveFilters(filters)) {
    return products;
  }

  return products.filter((product) => {
    if (filters.inStockOnly && product.inStock === 0) {
      return false;
    }
    if (filters.discountOnly && product.discount === 0) {
      return false;
    }
    if (filters.minPrice !== null && product.price < filters.minPrice) {
      return false;
    }
    if (filters.maxPrice !== null && product.price > filters.maxPrice) {
      return false;
    }
    return true;
  });
}
