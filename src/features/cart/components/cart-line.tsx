import type { CartItem } from '../use-cart-store';

import * as React from 'react';
import { Image, Pressable, Text, View } from '@/components/ui';
import { discountedPrice, formatCurrency, truncate } from '@/lib/format';
import { useCartStore } from '../use-cart-store';

type Props = {
  item: CartItem;
};

/** Port of the reference's cart row, with quantity controls. */
export const CartLine = React.memo(({ item }: Props) => {
  const increase = useCartStore.use.increase();
  const decrease = useCartStore.use.decrease();
  const removeItem = useCartStore.use.removeItem();

  const unitPrice = discountedPrice(item.price, item.discount);

  return (
    <View className="m-2 flex-row gap-3 rounded-xl border border-neutral-200 bg-white p-3 dark:border-neutral-700 dark:bg-neutral-900">
      <Image
        className="size-20 rounded-lg bg-neutral-100 dark:bg-neutral-800"
        contentFit="contain"
        source={{ uri: item.thumbnail }}
      />

      <View className="flex-1 justify-between">
        <Text className="text-sm/5">{truncate(item.title, 50)}</Text>
        {item.variant
          ? <Text className="text-xs text-neutral-400">{item.variant.label}</Text>
          : null}

        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <QuantityButton label="−" onPress={() => decrease(item.itemId)} />
            <Text className="text-sm">{item.quantity}</Text>
            <QuantityButton
              label="+"
              disabled={item.quantity >= item.inStock}
              onPress={() => increase(item.itemId)}
            />
          </View>

          <Text className="text-base font-semibold">
            {formatCurrency(unitPrice * item.quantity)}
          </Text>
        </View>

        <Pressable onPress={() => removeItem(item.itemId)}>
          <Text className="text-xs text-red-600 dark:text-red-400" tx="cart.remove" />
        </Pressable>
      </View>
    </View>
  );
});

function QuantityButton({
  label,
  onPress,
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={
        disabled
          ? 'size-7 items-center justify-center rounded-full border border-neutral-200 opacity-40 dark:border-neutral-800'
          : 'size-7 items-center justify-center rounded-full border border-neutral-300 dark:border-neutral-700'
      }
    >
      <Text className="text-sm">{label}</Text>
    </Pressable>
  );
}
