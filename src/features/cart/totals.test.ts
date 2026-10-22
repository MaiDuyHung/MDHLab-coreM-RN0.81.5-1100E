import type { CartItem } from './use-cart-store';

import { getCartTotals } from './totals';

function line(overrides: Partial<CartItem> = {}): CartItem {
  return {
    itemId: 'line-1',
    productId: '1',
    title: 'RTX 4070 Ti',
    thumbnail: 'https://example.test/gpu.webp',
    price: 100,
    discount: 0,
    inStock: 10,
    quantity: 1,
    variant: null,
    ...overrides,
  };
}

describe('getCartTotals', () => {
  it('returns zeros for an empty cart', () => {
    expect(getCartTotals([])).toEqual({
      totalItems: 0,
      subtotal: 0,
      totalDiscount: 0,
      payable: 0,
    });
  });

  it('sums quantities and list prices', () => {
    const totals = getCartTotals([
      line({ itemId: 'a', price: 100, quantity: 2 }),
      line({ itemId: 'b', price: 50, quantity: 1 }),
    ]);

    expect(totals.totalItems).toBe(3);
    expect(totals.subtotal).toBe(250);
    expect(totals.totalDiscount).toBe(0);
    expect(totals.payable).toBe(250);
  });

  it('applies the per-line discount percentage', () => {
    const totals = getCartTotals([line({ price: 200, discount: 25, quantity: 2 })]);

    expect(totals.subtotal).toBe(400);
    expect(totals.totalDiscount).toBe(100);
    expect(totals.payable).toBe(300);
  });

  it('keeps payable equal to subtotal minus discount', () => {
    const totals = getCartTotals([
      line({ itemId: 'a', price: 1299, discount: 12, quantity: 1 }),
      line({ itemId: 'b', price: 89, discount: 5, quantity: 3 }),
    ]);

    expect(totals.payable).toBeCloseTo(totals.subtotal - totals.totalDiscount, 6);
  });
});
