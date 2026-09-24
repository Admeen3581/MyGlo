import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
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
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const formattedPrice = typeof item.price === 'number'
    ? `$${item.price.toFixed(2)}`
    : '$0.00';

  const imageSource = item.externalImageUrl
    ? { uri: item.externalImageUrl }
    : images.emptyState;

  // Desktop layout (vertical card preserved exactly as liked)
  if (isDesktop) {
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
          className="w-full aspect-4/3 rounded-xl overflow-hidden mb-1.5 items-center justify-center relative"
        >
          <Image
            source={imageSource}
            style={styles.image}
            contentFit="cover"
            transition={200}
          />

          {item.priority && (
            <View className="absolute top-1.5 right-1.5 shadow-sm">
              <Badge
                label="Priority"
                variant="warning-solid"
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
            className="text-lg font-fraunces-bold mb-0.5 leading-tight"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.title}
          </Text>

          {/* Price */}
          <Text
            style={{ color: activeColors.primary }}
            className="text-lg font-nunito-bold mb-0.5"
          >
            {formattedPrice}
          </Text>

          {/* Brief Description - Locked to 1 line */}
          <Text
            style={{ color: activeColors.mutedForeground }}
            className="text-xs font-nunito leading-tight"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.notes || 'No description provided'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  // Mobile layout (single column row with left-aligned image, right-aligned details, and top-right priority badge)
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
      className="p-3 mb-2 border border-solid rounded-2xl flex-row items-center relative"
    >
      {/* Top Right Priority Badge for Mobile */}
      {item.priority && (
        <View className="absolute top-3 right-3 z-10 shadow-sm">
          <Badge
            label="Priority"
            variant="warning-solid"
            size="sm"
            isDarkMode={isDarkMode}
          />
        </View>
      )}

      {/* Left-Aligned Image */}
      <View
        style={{ backgroundColor: activeColors.muted }}
        className="w-20 h-20 rounded-xl overflow-hidden mr-3.5 items-center justify-center"
      >
        <Image
          source={imageSource}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
      </View>

      {/* Right-Side Text & Details */}
      <View className="flex-1 justify-center pr-2">
        {/* Title */}
        <Text
          style={{ color: activeColors.cardForeground }}
          className={`text-lg font-fraunces-bold mb-0.5 leading-tight ${item.priority ? 'pr-16' : ''}`}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item.title}
        </Text>

        {/* Price */}
        <Text
          style={{ color: activeColors.primary }}
          className="text-lg font-nunito-bold mb-1"
        >
          {formattedPrice}
        </Text>

        {/* Brief Description - Locked to 1 line */}
        <Text
          style={{ color: activeColors.mutedForeground }}
          className="text-xs font-nunito"
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
