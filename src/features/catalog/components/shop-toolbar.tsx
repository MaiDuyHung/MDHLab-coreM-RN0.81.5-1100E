import type { Category, ProductFilters, ProductSort } from '../types';

import { Input, View } from '@/components/ui';
import { CategoryChips } from './category-chips';
import { Chip } from './chip';

const SORTS: { label: string; value: ProductSort }[] = [
  { label: 'Newest', value: 'newest' },
  { label: 'Cheapest', value: 'cheapest' },
  { label: 'Most expensive', value: 'expensive' },
  { label: 'Top rated', value: 'top-rated' },
];

type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  categories: Category[];
  category?: string;
  onCategoryChange: (slug: string | undefined) => void;
  sort: ProductSort;
  onSortChange: (sort: ProductSort) => void;
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
};

/** Search, category rail, sort and the device-side filter toggles. */
export function ShopToolbar({
  search,
  onSearchChange,
  categories,
  category,
  onCategoryChange,
  sort,
  onSortChange,
  filters,
  onFiltersChange,
}: Props) {
  return (
    <View>
      <View className="px-2 pt-2">
        <Input
          placeholder="Search laptops, GPUs, phones..."
          value={search}
          onChangeText={onSearchChange}
          testID="shop-search"
        />
      </View>

      <CategoryChips
        categories={categories}
        selected={category}
        onSelect={onCategoryChange}
      />

      <View className="flex-row flex-wrap gap-2 px-2 py-1">
        {SORTS.map(option => (
          <Chip
            key={option.value}
            label={option.label}
            active={sort === option.value}
            onPress={() => onSortChange(option.value)}
          />
        ))}
      </View>

      <View className="flex-row gap-2 px-2 pb-2">
        <Chip
          label="In stock"
          active={filters.inStockOnly}
          onPress={() => onFiltersChange({ ...filters, inStockOnly: !filters.inStockOnly })}
        />
        <Chip
          label="On sale"
          active={filters.discountOnly}
          onPress={() => onFiltersChange({ ...filters, discountOnly: !filters.discountOnly })}
        />
      </View>
    </View>
  );
}
