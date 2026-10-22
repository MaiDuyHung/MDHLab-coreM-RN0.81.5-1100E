import type { CartItem } from './use-cart-store';

import * as React from 'react';
import { Button, EmptyList, FocusAwareStatusBar, List, Text, View } from '@/components/ui';
import { formatCurrency } from '@/lib/format';
import { CartLine } from './components/cart-line';
import { useCartTotals } from './totals';
import { useCartStore } from './use-cart-store';

export function CartScreen() {
  const items = useCartStore.use.items();
  const clear = useCartStore.use.clear();
  const totals = useCartTotals();

  const renderItem = React.useCallback(
    ({ item }: { item: CartItem }) => <CartLine item={item} />,
    [],
  );

  if (items.length === 0) {
    return (
      <View className="flex-1 items-center justify-center">
        <FocusAwareStatusBar />
        <EmptyList isLoading={false} />
        <Text className="pt-2" tx="cart.empty" />
      </View>
    );
  }

  return (
    <View className="flex-1">
      <FocusAwareStatusBar />

      <List
        data={items}
        renderItem={renderItem}
        keyExtractor={item => item.itemId}
      />

      <View className="gap-2 border-t border-neutral-200 p-4 dark:border-neutral-700">
        <SummaryRow txLabel="cart.subtotal" value={formatCurrency(totals.subtotal)} />
        <SummaryRow
          txLabel="cart.discount"
          value={`- ${formatCurrency(totals.totalDiscount)}`}
        />
        <View className="flex-row justify-between border-t border-neutral-100 pt-2 dark:border-neutral-800">
          <Text className="font-semibold" tx="cart.payable" />
          <Text className="font-semibold">{formatCurrency(totals.payable)}</Text>
        </View>

        <Button label="Checkout" testID="checkout" />
        <Button label="Clear cart" variant="ghost" onPress={clear} />
      </View>
    </View>
  );
}

function SummaryRow({ txLabel, value }: { txLabel: 'cart.subtotal' | 'cart.discount'; value: string }) {
  return (
    <View className="flex-row justify-between">
      <Text className="text-neutral-500" tx={txLabel} />
      <Text className="text-neutral-500">{value}</Text>
    </View>
  );
}
