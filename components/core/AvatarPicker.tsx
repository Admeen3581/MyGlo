import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';

interface AvatarPickerProps {
  avatarUri?: string | null;
  onPress?: () => void;
  size?: number;
  isDarkMode?: boolean;
}

/**
 * AvatarPicker Component
 * Renders a circular profile image container with an edit camera badge.
 * Provides a blank handler callback `onPress` for picking/uploading an avatar photo.
 */
export const AvatarPicker: React.FC<AvatarPickerProps> = ({
  avatarUri,
  onPress,
  size = 112,
  isDarkMode: customDarkMode,
}) => {
  const { isDarkMode, activeColors } = useTheme(customDarkMode);

  const cameraBadgeSize = Math.max(32, Math.round(size * 0.32));
  const iconSize = Math.round(size * 0.45);

  return (
    <View className="items-center justify-center my-3">
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Upload avatar photo"
        style={[
          styles.avatarContainer,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: isDarkMode ? '#14232C' : '#E8F2EF',
            borderColor: isDarkMode ? 'rgba(32, 164, 181, 0.4)' : 'rgba(132, 210, 189, 0.6)',
          },
        ]}
      >
        {avatarUri ? (
          <Image
            source={{ uri: avatarUri }}
            style={{ width: '100%', height: '100%', borderRadius: size / 2 }}
            contentFit="cover"
            transition={200}
          />
        ) : (
          <View className="items-center justify-center">
            <Ionicons
              name="person"
              size={iconSize}
              color={activeColors.primary}
            />
          </View>
        )}

        {/* Camera upload badge */}
        <View
          style={[
            styles.badge,
            {
              width: cameraBadgeSize,
              height: cameraBadgeSize,
              borderRadius: cameraBadgeSize / 2,
              backgroundColor: activeColors.primary,
              borderColor: isDarkMode ? '#0E151A' : '#FFFFFF',
            },
          ]}
          className="absolute bottom-0 right-0 border-2 items-center justify-center shadow-sm"
        >
          <Ionicons
            name="camera"
            size={Math.round(cameraBadgeSize * 0.52)}
            color={activeColors.primaryForeground}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    borderWidth: 2,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    elevation: 3,
  },
});

export default AvatarPicker;
