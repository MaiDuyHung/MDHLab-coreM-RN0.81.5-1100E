import { Pressable, Text } from '@/components/ui';

type Props = {
  label: string;
  active: boolean;
  onPress: () => void;
};

export function Chip({ label, active, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      className={
        active
          ? 'rounded-full bg-neutral-900 px-3 py-1.5 dark:bg-white'
          : 'rounded-full border border-neutral-300 px-3 py-1.5 dark:border-neutral-700'
      }
    >
      <Text className={active ? 'text-xs text-white dark:text-black' : 'text-xs'}>
        {label}
      </Text>
    </Pressable>
  );
}
