# Commerce modules

The first MDHLab commerce modules (`catalog` and `cart`) were ported from the
[c-shopping-rn](https://github.com/huanghanzhilian/c-shopping-rn) reference app
(MIT) onto this starter's conventions. The reference itself is kept out of this
repo, at `../_references/c-shopping-rn`, as reading material only.

## Where things live

```
src/features/catalog/
  types.ts                 domain model the whole app speaks
  mapper.ts                wire format -> domain model (the backend seam)
  api.ts                   react-query-kit hooks: useProducts / useProduct / useCategories
  apply-local-filters.ts   filters the backend cannot do yet
  shop-screen.tsx          product list: search, category, sort, infinite scroll
  product-detail-screen.tsx
  components/              product-card, product-price, badges, chips, toolbar

src/features/cart/
  use-cart-store.tsx       zustand store + persistence through lib/storage
  totals.ts                derived totals (subtotal / discount / payable)
  cart-screen.tsx
  components/cart-line.tsx

src/lib/format.ts          currency, number, truncate, discount math
src/lib/hooks/use-debounce.ts
```

Routes: `src/app/(app)/index.tsx` (shop tab), `src/app/(app)/cart.tsx` (cart tab),
`src/app/products/[id].tsx` (product detail).

## What was changed on the way over

The reference uses Redux Toolkit + RTK Query; this starter uses TanStack Query
via `react-query-kit` plus zustand. The port follows the starter, not the
reference:

| Reference | Here |
| --- | --- |
| `services/*.service.js` (RTK Query `injectEndpoints`) | `features/catalog/api.ts` (`createQuery` / `createInfiniteQuery`) |
| `store/slices/cart.slice.js` | `features/cart/use-cart-store.tsx` (zustand) |
| totals recomputed inside every reducer | `features/cart/totals.ts`, derived from the lines |
| `store/slices/filters.slice.js` | `features/catalog/apply-local-filters.ts` + screen state |
| `utils/getTotal.js`, `formatNumber.js`, `truncate.js` | `src/lib/format.ts` |
| `hooks/useDebounce.js` | `src/lib/hooks/use-debounce.ts` |

Two behaviours were deliberately fixed rather than copied: cart quantities are
clamped to known stock, and `decrease` stops at 1 instead of walking into zero
and negative quantities.

## Swapping the backend

`EXPO_PUBLIC_API_URL` currently points at `https://dummyjson.com/`, which serves
real product data (laptops, smartphones, tablets, accessories) so the flow can
be exercised before our own API exists.

To move to the MDHLab backend, change these and nothing else:

1. `EXPO_PUBLIC_API_URL` in `.env`.
2. `src/features/catalog/mapper.ts` — the `Raw*` types and the `to*` functions.
3. `src/features/catalog/api.ts` — the endpoint paths and query parameters.

Screens, cart and tests keep working, because they only ever see the types in
`src/features/catalog/types.ts`.

Once the backend can filter by stock, discount and price range, move those into
`ProductQuery`, pass them as request parameters, and delete
`apply-local-filters.ts`: it narrows pages already loaded on the device, so a
heavily filtered list looks short until more pages arrive.

## Known gaps

- `Checkout` on the cart screen is a button with no flow behind it yet.
- Product variants (`CartVariant`) are modelled in the cart but no product
  source fills them in; the matching logic is in place for when one does.
- Prices are formatted as USD (`CURRENCY` in `src/lib/format.ts`).
