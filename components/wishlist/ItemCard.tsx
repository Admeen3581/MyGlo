import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { useTheme } from '@/hooks/useTheme';
import { Badge } from '@/components/core/Badge';
import { images } from '@/constants/images';

export interface WishlistItem {
  id: string;
  title: string;
  url?: string;
  price: number;
  notes?: string;
  priority?: boolean;
  imageStorageId?: string;
  externalImageUrl?: string;
  itemClaimedBy?: string;
}

export interface ItemCardProps {
  item: WishlistItem;
  onPress?: () => void;
  isDarkMode?: boolean;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  onPress,
  isDarkMode: customDarkMode,
}) => {
  const { isDarkMode, activeColors } = useTheme(customDarkMode);

  const formattedPrice = typeof item.price === 'number'
    ? `$${item.price.toFixed(2)}`
    : '$0.00';

  const imageSource = item.externalImageUrl
    ? { uri: item.externalImageUrl }
    : images.emptyState;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => {
        if (onPress) {
          onPress();
        } else {
          // TODO: Handle item click / open item detail modal when implemented
          console.log('[ItemCard] Item clicked:', item.title);
        }
      }}
      style={[
        styles.card,
        {
          backgroundColor: activeColors.card,
          borderColor: activeColors.border,
          boxShadow: isDarkMode
            ? '0px 3px 8px rgba(2, 8, 17, 0.28)'
            : '0px 3px 8px rgba(1, 55, 125, 0.05)',
        },
      ]}
      className="p-2 mb-2 border border-solid rounded-2xl flex-col justify-between"
    >
      {/* Top Image & Overlay Priority Badge */}
      <View
        style={{ backgroundColor: activeColors.muted }}
        className="w-full aspect-[4/3] rounded-xl overflow-hidden mb-1.5 items-center justify-center relative"
      >
        <Image
          source={imageSource}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />

        {item.priority && (
          <View className="absolute top-1.5 right-1.5">
            <Badge
              label="Priority"
              variant="warning"
              size="sm"
              isDarkMode={isDarkMode}
            />
          </View>
        )}
      </View>

      {/* Item Details */}
      <View className="w-full">
        {/* Title */}
        <Text
          style={{ color: activeColors.cardForeground }}
          className="text-xs font-fraunces-bold mb-0.5 leading-tight"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item.title}
        </Text>

        {/* Price */}
        <Text
          style={{ color: activeColors.primary }}
          className="text-xs font-nunito-bold mb-0.5"
        >
          {formattedPrice}
        </Text>

        {/* Brief Description - Locked to 1 line */}
        <Text
          style={{ color: activeColors.mutedForeground }}
          className="text-[10px] font-nunito leading-tight"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item.notes || 'No description provided'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    elevation: 2,
    width: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default ItemCard;
