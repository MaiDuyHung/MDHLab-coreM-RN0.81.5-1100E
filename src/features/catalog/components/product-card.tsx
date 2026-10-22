import type { Product } from '../types';

import { Link } from 'expo-router';
import * as React from 'react';
import { Image, Pressable, Text, View } from '@/components/ui';
import { truncate } from '@/lib/format';
import { DiscountBadge, RatingBadge, StockBadge } from './badges';
import { ProductPrice } from './product-price';

type Props = {
  product: Product;
};

/** Port of the reference's `components/product/ProductCard.jsx`. */
export const ProductCard = React.memo(({ product }: Props) => {
  return (
    <Link href={`/products/${product.id}`} asChild>
      <Pressable>
        <View className="m-2 flex-row gap-3 rounded-xl border border-neutral-200 bg-white p-3 dark:border-neutral-700 dark:bg-neutral-900">
          <View>
            <Image
              className="size-24 rounded-lg bg-neutral-100 dark:bg-neutral-800"
              contentFit="contain"
              source={{ uri: product.thumbnail }}
            />
            <View className="absolute top-0 left-0">
              <DiscountBadge discount={product.discount} />
            </View>
          </View>

          <View className="flex-1 justify-between">
            <View className="gap-1">
              {product.brand
                ? (
                    <Text className="text-xs text-neutral-400 uppercase">{product.brand}</Text>
                  )
                : null}
              <Text className="text-sm/5">{truncate(product.title, 60)}</Text>
            </View>

            <View className="flex-row items-end justify-between">
              <View className="gap-1">
                <RatingBadge rating={product.rating} numReviews={product.numReviews} />
                <StockBadge inStock={product.inStock} />
              </View>
              <ProductPrice price={product.price} discount={product.discount} />
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
});
