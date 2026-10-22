import { Text, View } from '@/components/ui';

/** Port of `components/product/DiscountProduct.jsx`. */
export function DiscountBadge({ discount }: { discount: number }) {
  if (discount === 0) {
    return null;
  }

  return (
    <View className="rounded-full bg-red-600 px-2 py-0.5">
      <Text className="text-xs font-semibold text-white">
        -
        {discount}
        %
      </Text>
    </View>
  );
}

/** Port of `components/product/Depot.jsx` and `OutOfStock.jsx`. */
export function StockBadge({ inStock }: { inStock: number }) {
  if (inStock === 0) {
    return (
      <Text className="text-xs text-neutral-400" tx="shop.out_of_stock" />
    );
  }

  if (inStock <= 5) {
    return (
      <Text className="text-xs text-amber-600 dark:text-amber-400">
        {`${inStock} left`}
      </Text>
    );
  }

  return <Text className="text-xs text-green-600 dark:text-green-400" tx="shop.in_stock" />;
}

export function RatingBadge({ rating, numReviews }: { rating: number; numReviews: number }) {
  return (
    <View className="flex-row items-center gap-1">
      <Text className="text-xs text-amber-500">★</Text>
      <Text className="text-xs text-neutral-500">
        {rating.toFixed(1)}
        {numReviews > 0 ? ` (${numReviews})` : ''}
      </Text>
    </View>
  );
}
