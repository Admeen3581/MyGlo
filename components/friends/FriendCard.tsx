import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';

export interface FriendCardProps {
  friend: {
    _id: string;
    clerkId?: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
    avatar?: string;
    email?: string;
  };
  onPressControls: () => void;
  onPressCard?: () => void;
  isDarkMode?: boolean;
}

export const FriendCard: React.FC<FriendCardProps> = ({
  friend,
  onPressControls,
  onPressCard,
  isDarkMode: customDarkMode,
}) => {
  const { isDarkMode, activeColors } = useTheme(customDarkMode);

  const fullName =
    friend.name ||
    [friend.firstName, friend.lastName].filter(Boolean).join(' ') ||
    'User';

  const avatarUri = friend.avatarUrl || friend.avatar;

  return (
    <TouchableOpacity
      activeOpacity={onPressCard ? 0.7 : 1}
      onPress={onPressCard}
      style={[
        styles.cardContainer,
        {
          backgroundColor: isDarkMode ? '#16222A' : '#FFFFFF',
          borderColor: activeColors.border,
        },
      ]}
      className="w-full flex-row items-center justify-between px-4 py-3 rounded-2xl border border-solid mb-2.5 shadow-sm"
    >
      {/* Left: Avatar + User Info */}
      <View className="flex-row items-center flex-1 mr-3">
        <View
          style={{
            borderColor: activeColors.primary,
            backgroundColor: activeColors.muted,
          }}
          className="w-12 h-12 rounded-full border border-solid items-center justify-center overflow-hidden mr-3.5 shadow-sm"
        >
          {avatarUri ? (
            <Image
              source={{ uri: avatarUri }}
              style={styles.avatarImage}
              contentFit="cover"
              transition={200}
            />
          ) : (
            <Ionicons
              name="person"
              size={22}
              color={activeColors.mutedForeground}
            />
          )}
        </View>

        <View className="flex-1 justify-center">
          <Text
            style={{ color: activeColors.foreground }}
            className="text-base font-fraunces-bold"
            numberOfLines={1}
          >
            {fullName}
          </Text>
          {Boolean(friend.email) && (
            <Text
              style={{ color: activeColors.mutedForeground }}
              className="text-xs font-nunito mt-0.5"
              numberOfLines={1}
            >
              {friend.email}
            </Text>
          )}
        </View>
      </View>

      {/* Far Right: Pagination Dots Controls Button */}
      <TouchableOpacity
        onPress={onPressControls}
        activeOpacity={0.6}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        className="p-1.5 rounded-full items-center justify-center"
      >
        <Ionicons
          name="ellipsis-horizontal"
          size={20}
          color={activeColors.mutedForeground}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    elevation: 1,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
});

export default FriendCard;
