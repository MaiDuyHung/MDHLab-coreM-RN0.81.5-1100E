import type { Product } from '@/features/catalog/types';

import { randomUUID } from 'expo-crypto';
import { create } from 'zustand';
import { getItem, setItem } from '@/lib/storage';
import { createSelectors } from '@/lib/utils';

/**
 * Cart state, ported from the reference's `store/slices/cart.slice.js`.
 *
 * Three deliberate changes from the reference:
 * - totals are derived (`getCartTotals`) instead of being recomputed into
 *   state on every reducer, so they can never drift from the line items;
 * - quantity is clamped to the stock we know about, and `decrease` stops at 1
 *   instead of walking into zero and negative quantities;
 * - persistence goes through the app's own `lib/storage` rather than
 *   `zustand/middleware`, whose devtools module uses `import.meta` and breaks
 *   the web bundle.
 */

const CART_STORAGE_KEY = 'mdhlab-cart';

export type CartVariant = {
  id: string;
  label: string;
};

export type CartItem = {
  /** Identifies this line; the same product in two variants is two lines. */
  itemId: string;
  productId: string;
  title: string;
  thumbnail: string;
  /** List price per unit at the time it was added. */
  price: number;
  /** Discount percentage at the time it was added. */
  discount: number;
  inStock: number;
  quantity: number;
  variant: CartVariant | null;
};

type AddItemInput = {
  product: Product;
  variant?: CartVariant | null;
  quantity?: number;
};

type CartState = {
  items: CartItem[];
  addItem: (input: AddItemInput) => void;
  removeItem: (itemId: string) => void;
  increase: (itemId: string) => void;
  decrease: (itemId: string) => void;
  clear: () => void;
};

/** Port of `utils/exsitItem.js`: a line matches on product *and* variant. */
function findLine(items: CartItem[], productId: string, variant: CartVariant | null) {
  return items.find(
    item => item.productId === productId && (item.variant?.id ?? null) === (variant?.id ?? null),
  );
}

function loadItems(): CartItem[] {
  try {
    return getItem<CartItem[]>(CART_STORAGE_KEY) ?? [];
  }
  catch {
    // A corrupted or unreadable cart should never stop the app from starting.
    return [];
  }
}

const _useCartStore = create<CartState>(set => ({
  items: loadItems(),

  addItem: ({ product, variant = null, quantity = 1 }) =>
    set((state) => {
      const line = findLine(state.items, product.id, variant);

      if (line) {
        return {
          items: state.items.map(item =>
            item.itemId === line.itemId
              ? { ...item, quantity: Math.min(item.quantity + quantity, item.inStock) }
              : item,
          ),
        };
      }

      const newLine: CartItem = {
        itemId: randomUUID(),
        productId: product.id,
        title: product.title,
        thumbnail: product.thumbnail,
        price: product.price,
        discount: product.discount,
        inStock: product.inStock,
        quantity: Math.min(quantity, product.inStock),
        variant,
      };

      return { items: [...state.items, newLine] };
    }),

  removeItem: itemId =>
    set(state => ({ items: state.items.filter(item => item.itemId !== itemId) })),

  increase: itemId =>
    set(state => ({
      items: state.items.map(item =>
        item.itemId === itemId
          ? { ...item, quantity: Math.min(item.quantity + 1, item.inStock) }
          : item,
      ),
    })),

  decrease: itemId =>
    set(state => ({
      items: state.items.map(item =>
        item.itemId === itemId
          ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
          : item,
      ),
    })),

  clear: () => set({ items: [] }),
}));

_useCartStore.subscribe((state, previous) => {
  if (state.items !== previous.items) {
    setItem(CART_STORAGE_KEY, state.items);
  }
});

export const useCartStore = createSelectors(_useCartStore);

export const addToCart = (input: AddItemInput) => _useCartStore.getState().addItem(input);
export const clearCart = () => _useCartStore.getState().clear();
