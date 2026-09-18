import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

export interface WishlistCardItem {
  _id: string;
  title: string;
  description?: string;
  itemCount?: number;
}

export interface WishlistCardProps {
  wishlist: WishlistCardItem;
  onPress?: () => void;
  isDarkMode?: boolean;
}

export const WishlistCard: React.FC<WishlistCardProps> = ({
  wishlist,
  onPress,
  isDarkMode: customDarkMode,
}) => {
  const { isDarkMode, activeColors } = useTheme(customDarkMode);
  const count = wishlist.itemCount ?? 0;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[
        styles.card,
        {
          backgroundColor: isDarkMode ? '#16222A' : '#FFFFFF',
          borderColor: activeColors.border,
          boxShadow: isDarkMode
            ? '0px 8px 16px rgba(2, 8, 17, 0.35)'
            : '0px 8px 16px rgba(1, 55, 125, 0.08)',
        },
      ]}
      className="p-5 mb-4 border border-solid rounded-3xl"
    >
      {/* Top Row: Item Count Badge */}
      <View className="flex-row items-center justify-between mb-3">
        <View
          style={{
            backgroundColor: isDarkMode ? '#24343E' : '#EAEBE7',
          }}
          className="rounded-full px-3 py-1"
        >
          <Text
            style={{ color: activeColors.primary }}
            className="text-xs font-nunito-bold"
          >
            {count} {count === 1 ? 'Item' : 'Items'}
          </Text>
        </View>
      </View>

      {/* Main Title */}
      <Text
        style={{ color: activeColors.foreground }}
        className="text-xl font-fraunces-bold leading-snug"
      >
        {wishlist.title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    elevation: 3,
  },
});

export default WishlistCard;
