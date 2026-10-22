import type { CartItem } from './use-cart-store';

import { discountAmount, discountedPrice } from '@/lib/format';
import { useCartStore } from './use-cart-store';

export type CartTotals = {
  /** Number of units across all lines. */
  totalItems: number;
  /** List price of everything in the cart, before discounts. */
  subtotal: number;
  /** How much the discounts take off. */
  totalDiscount: number;
  /** What the customer pays. */
  payable: number;
};

/** Port of `utils/getTotal.js`, computed in one pass instead of three. */
export function getCartTotals(items: CartItem[]): CartTotals {
  return items.reduce<CartTotals>(
    (totals, item) => {
      totals.totalItems += item.quantity;
      totals.subtotal += item.quantity * item.price;
      totals.totalDiscount += item.quantity * discountAmount(item.price, item.discount);
      totals.payable += item.quantity * discountedPrice(item.price, item.discount);
      return totals;
    },
    { totalItems: 0, subtotal: 0, totalDiscount: 0, payable: 0 },
  );
}

export function useCartTotals(): CartTotals {
  const items = useCartStore(state => state.items);
  return getCartTotals(items);
}

export function useCartCount() {
  const items = useCartStore(state => state.items);
  return items.reduce((count, item) => count + item.quantity, 0);
}
