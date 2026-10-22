import type { Category } from '../types';

import { ScrollView, View } from '@/components/ui';
import { Chip } from './chip';

type Props = {
  categories: Category[];
  selected?: string;
  onSelect: (slug: string | undefined) => void;
};

/** Port of the reference's category rail, flattened to a single row of chips. */
export function CategoryChips({ categories, selected, onSelect }: Props) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View className="flex-row gap-2 px-2 py-1">
        <Chip label="All" active={!selected} onPress={() => onSelect(undefined)} />
        {categories.map(category => (
          <Chip
            key={category.slug}
            label={category.name}
            active={selected === category.slug}
            onPress={() => onSelect(category.slug)}
          />
        ))}
      </View>
    </ScrollView>
  );
}
