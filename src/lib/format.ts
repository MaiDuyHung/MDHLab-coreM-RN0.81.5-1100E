/**
 * Formatting helpers shared by commerce features.
 * Ported from the c-shopping-rn reference (`utils/formatNumber`, `utils/truncate`)
 * and typed for our own domain.
 */

// Keep every money label in one place: switching the storefront to VND
// is a one-line change here, not a sweep through the screens.
export const CURRENCY = 'USD';
export const LOCALE = 'en-US';

export function formatCurrency(value: number, currency: string = CURRENCY) {
  return new Intl.NumberFormat(LOCALE, {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat(LOCALE).format(value);
}

export function truncate(value: string, length: number) {
  return value.length > length ? `${value.slice(0, length)}...` : value;
}

/** Price a customer actually pays, after the product's discount percentage. */
export function discountedPrice(price: number, discount: number) {
  return price - (price * discount) / 100;
}

/** Amount saved on a single unit. */
export function discountAmount(price: number, discount: number) {
  return (price * discount) / 100;
}
