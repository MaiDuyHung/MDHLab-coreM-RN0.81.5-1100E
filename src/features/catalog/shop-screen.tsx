import type { Product, ProductFilters, ProductSort } from './types';

import * as React from 'react';
import {
  ActivityIndicator,
  EmptyList,
  FocusAwareStatusBar,
  List,
  Text,
  View,
} from '@/components/ui';
import { useDebounce } from '@/lib/hooks';
import { useCategories, useProducts } from './api';
import { EMPTY_FILTERS, selectProducts } from './apply-local-filters';
import { ProductCard } from './components/product-card';
import { ShopToolbar } from './components/shop-toolbar';

export function ShopScreen() {
  const [search, setSearch] = React.useState('');
  const [category, setCategory] = React.useState<string | undefined>();
  const [sort, setSort] = React.useState<ProductSort>('newest');
  const [filters, setFilters] = React.useState<ProductFilters>(EMPTY_FILTERS);

  const debouncedSearch = useDebounce(search);

  const { data: categories } = useCategories();
  const {
    data,
    isPending,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useProducts({
    variables: { search: debouncedSearch, category, sort },
  });

  const products = React.useMemo(
    () => selectProducts(data?.pages, filters),
    [data?.pages, filters],
  );

  const renderItem = React.useCallback(
    ({ item }: { item: Product }) => <ProductCard product={item} />,
    [],
  );

  const onEndReached = React.useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <FocusAwareStatusBar />
        <Text className="text-center" tx="shop.load_error" />
        <Text className="pt-2 text-center text-xs text-neutral-400">{error.message}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <FocusAwareStatusBar />

      <ShopToolbar
        search={search}
        onSearchChange={setSearch}
        categories={categories ?? []}
        category={category}
        onCategoryChange={setCategory}
        sort={sort}
        onSortChange={setSort}
        filters={filters}
        onFiltersChange={setFilters}
      />

      <List
        data={products}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.6}
        ListEmptyComponent={<EmptyList isLoading={isPending} />}
        ListFooterComponent={
          isFetchingNextPage
            ? (
                <View className="py-4">
                  <ActivityIndicator />
                </View>
              )
            : null
        }
      />
    </View>
  );
}
