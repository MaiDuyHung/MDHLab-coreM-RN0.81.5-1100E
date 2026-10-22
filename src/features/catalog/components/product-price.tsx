import { Text, View } from '@/components/ui';
import { discountedPrice, formatCurrency } from '@/lib/format';

type Props = {
  price: number;
  discount: number;
};

/** Port of the reference's `components/product/ProductPrice.jsx`. */
export function ProductPrice({ price, discount }: Props) {
  if (discount === 0) {
    return <Text className="text-base font-semibold">{formatCurrency(price)}</Text>;
  }

  return (
    <View className="items-end">
      <Text className="text-xs text-neutral-400 line-through">
        {formatCurrency(price)}
      </Text>
      <Text className="text-base font-semibold text-red-600 dark:text-red-400">
        {formatCurrency(discountedPrice(price, discount))}
      </Text>
    </View>
  );
}
