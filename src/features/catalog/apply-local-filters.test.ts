import type { Paginated, Product } from './types';

import { EMPTY_FILTERS, selectProducts } from './apply-local-filters';

function product(overrides: Partial<Product> = {}): Product {
  return {
    id: '1',
    title: 'Gaming PC',
    brand: 'MDH',
    category: 'laptops',
    description: '',
    price: 1000,
    discount: 0,
    inStock: 5,
    rating: 4,
    numReviews: 0,
    images: [],
    thumbnail: '',
    specification: [],
    tags: [],
    ...overrides,
  };
}

function page(items: Product[]): Paginated<Product> {
  return { items, total: items.length, limit: 12, skip: 0 };
}

describe('selectProducts', () => {
  it('flattens every loaded page', () => {
    const result = selectProducts(
      [page([product({ id: '1' })]), page([product({ id: '2' })])],
      EMPTY_FILTERS,
    );

    expect(result.map(item => item.id)).toEqual(['1', '2']);
  });

  it('returns an empty list before the first page arrives', () => {
    expect(selectProducts(undefined, EMPTY_FILTERS)).toEqual([]);
  });

  it('drops out-of-stock products when the filter is on', () => {
    const result = selectProducts(
      [page([product({ id: '1', inStock: 0 }), product({ id: '2', inStock: 3 })])],
      { ...EMPTY_FILTERS, inStockOnly: true },
    );

    expect(result.map(item => item.id)).toEqual(['2']);
  });

  it('keeps only discounted products when the filter is on', () => {
    const result = selectProducts(
      [page([product({ id: '1', discount: 0 }), product({ id: '2', discount: 15 })])],
      { ...EMPTY_FILTERS, discountOnly: true },
    );

    expect(result.map(item => item.id)).toEqual(['2']);
  });

  it('applies the price range on the list price', () => {
    const result = selectProducts(
      [
        page([
          product({ id: 'cheap', price: 100 }),
          product({ id: 'mid', price: 1000 }),
          product({ id: 'pricey', price: 5000 }),
        ]),
      ],
      { ...EMPTY_FILTERS, minPrice: 500, maxPrice: 2000 },
    );

    expect(result.map(item => item.id)).toEqual(['mid']);
  });
});
