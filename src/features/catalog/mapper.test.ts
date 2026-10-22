import type { RawProduct } from './mapper';

import { toProduct, toSortParams } from './mapper';

const raw: RawProduct = {
  id: 42,
  title: 'Apple MacBook Pro 14 inch',
  description: 'A powerful laptop.',
  category: 'laptops',
  price: 1999,
  discountPercentage: 11.83,
  rating: 4.57,
  stock: 83,
  tags: ['laptops'],
  brand: 'Apple',
  sku: 'LAP-APP-001',
  weight: 2,
  dimensions: { width: 30, height: 2, depth: 21 },
  warrantyInformation: '1 year warranty',
  reviews: [{}, {}],
  images: ['https://example.test/a.webp', 'https://example.test/b.webp'],
  thumbnail: 'https://example.test/thumb.webp',
};

describe('toProduct', () => {
  it('maps the wire format onto the domain model', () => {
    const product = toProduct(raw);

    expect(product.id).toBe('42');
    expect(product.brand).toBe('Apple');
    expect(product.discount).toBe(12);
    expect(product.inStock).toBe(83);
    expect(product.numReviews).toBe(2);
    expect(product.images).toHaveLength(2);
  });

  it('falls back to the thumbnail when no gallery is sent', () => {
    const product = toProduct({ ...raw, images: [] });

    expect(product.images).toEqual([{ url: 'https://example.test/thumb.webp' }]);
  });

  it('treats a missing discount as full price', () => {
    const product = toProduct({ ...raw, discountPercentage: 0 });

    expect(product.discount).toBe(0);
  });

  it('builds the specification rows from the detail fields', () => {
    const labels = toProduct(raw).specification.map(spec => spec.label);

    expect(labels).toContain('Brand');
    expect(labels).toContain('Dimensions');
    expect(labels).toContain('Warranty');
  });
});

describe('toSortParams', () => {
  it('maps each sort option to the backend parameters', () => {
    expect(toSortParams('cheapest')).toEqual({ sortBy: 'price', order: 'asc' });
    expect(toSortParams('expensive')).toEqual({ sortBy: 'price', order: 'desc' });
    expect(toSortParams('top-rated')).toEqual({ sortBy: 'rating', order: 'desc' });
    expect(toSortParams(undefined)).toEqual({ sortBy: 'id', order: 'desc' });
  });
});
