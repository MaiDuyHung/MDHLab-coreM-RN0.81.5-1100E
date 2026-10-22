import { Stack, useLocalSearchParams } from 'expo-router';
import * as React from 'react';
import {
  ActivityIndicator,
  Button,
  FocusAwareStatusBar,
  Image,
  ScrollView,
  Text,
  View,
} from '@/components/ui';
import { addToCart } from '@/features/cart/use-cart-store';
import { formatCurrency, formatNumber } from '@/lib/format';
import { useProduct } from './api';
import { DiscountBadge, RatingBadge, StockBadge } from './components/badges';
import { ProductPrice } from './components/product-price';

export function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: product, isPending, isError } = useProduct({ variables: { id } });
  const [added, setAdded] = React.useState(false);

  const onAddToCart = React.useCallback(() => {
    if (!product) {
      return;
    }
    addToCart({ product });
    setAdded(true);
  }, [product]);

  if (isPending) {
    return (
      <View className="flex-1 items-center justify-center">
        <FocusAwareStatusBar />
        <ActivityIndicator />
      </View>
    );
  }

  if (isError || !product) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <FocusAwareStatusBar />
        <Text tx="shop.load_error" />
      </View>
    );
  }

  return (
    <View className="flex-1">
      <Stack.Screen options={{ title: product.title }} />
      <FocusAwareStatusBar />

      <ScrollView className="flex-1">
        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
          {product.images.map(image => (
            <Image
              key={image.url}
              className="h-72 w-80 bg-neutral-100 dark:bg-neutral-800"
              contentFit="contain"
              source={{ uri: image.url }}
            />
          ))}
        </ScrollView>

        <View className="gap-3 p-4">
          <View className="flex-row items-center gap-2">
            <DiscountBadge discount={product.discount} />
            <RatingBadge rating={product.rating} numReviews={product.numReviews} />
            <StockBadge inStock={product.inStock} />
          </View>

          {product.brand
            ? <Text className="text-xs text-neutral-400 uppercase">{product.brand}</Text>
            : null}

          <Text className="text-xl font-semibold">{product.title}</Text>

          <ProductPrice price={product.price} discount={product.discount} />

          <View className="gap-1 pt-2">
            <Text className="font-semibold" tx="shop.description" />
            <Text className="leading-6 text-neutral-600 dark:text-neutral-300">
              {product.description}
            </Text>
          </View>

          {product.specification.length > 0
            ? (
                <View className="gap-1 pt-2">
                  <Text className="font-semibold" tx="shop.specification" />
                  {product.specification.map(spec => (
                    <View
                      key={spec.label}
                      className="flex-row justify-between border-b border-neutral-100 py-1.5 dark:border-neutral-800"
                    >
                      <Text className="text-sm text-neutral-500">{spec.label}</Text>
                      <Text className="text-sm">{spec.value}</Text>
                    </View>
                  ))}
                </View>
              )
            : null}

          <Text className="pt-2 text-xs text-neutral-400">
            {`${formatNumber(product.inStock)} units · list price ${formatCurrency(product.price)}`}
          </Text>
        </View>
      </ScrollView>

      <View className="border-t border-neutral-200 p-4 dark:border-neutral-700">
        <Button
          label={added ? 'Added to cart' : 'Add to cart'}
          disabled={product.inStock === 0}
          onPress={onAddToCart}
          testID="add-to-cart"
        />
      </View>
    </View>
  );
}
