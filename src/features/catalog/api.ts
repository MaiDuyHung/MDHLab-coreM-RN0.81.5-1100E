import type { AxiosError } from 'axios';
import type { RawCategory, RawProduct, RawProductList } from './mapper';
import type { Category, Paginated, Product, ProductQuery } from './types';

import { createInfiniteQuery, createQuery } from 'react-query-kit';
import { client } from '@/lib/api';
import { toCategory, toProduct, toProductPage, toSortParams } from './mapper';

export const PRODUCTS_PAGE_SIZE = 12;

/**
 * Paged product list.
 *
 * Search, category and sort are resolved by the backend; the remaining filters
 * are applied on the loaded pages (see `apply-local-filters.ts`).
 */
export const useProducts = createInfiniteQuery<
  Paginated<Product>,
  ProductQuery,
  AxiosError,
  number
>({
  queryKey: ['products'],
  fetcher: (variables, { pageParam }) => {
    const { search, category, sort } = variables;
    const params = {
      limit: PRODUCTS_PAGE_SIZE,
      skip: pageParam,
      ...toSortParams(sort),
    };

    if (search) {
      return client
        .get<RawProductList>('products/search', { params: { ...params, q: search } })
        .then(response => toProductPage(response.data));
    }

    if (category) {
      return client
        .get<RawProductList>(`products/category/${category}`, { params })
        .then(response => toProductPage(response.data));
    }

    return client
      .get<RawProductList>('products', { params })
      .then(response => toProductPage(response.data));
  },
  initialPageParam: 0,
  getNextPageParam: (lastPage) => {
    const nextSkip = lastPage.skip + lastPage.limit;
    return nextSkip < lastPage.total ? nextSkip : undefined;
  },
});

export const useProduct = createQuery<Product, { id: string }, AxiosError>({
  queryKey: ['product'],
  fetcher: variables =>
    client
      .get<RawProduct>(`products/${variables.id}`)
      .then(response => toProduct(response.data)),
});

export const useCategories = createQuery<Category[], void, AxiosError>({
  queryKey: ['categories'],
  fetcher: () =>
    client
      .get<RawCategory[]>('products/categories')
      .then(response => response.data.map(toCategory)),
  staleTime: 1000 * 60 * 60,
});
