import React from 'react';
import { View, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MyGloLogo } from '@/components/MyGloLogo';
import { useTheme } from '@/hooks/useTheme';

export interface TopNavBarProps {
  searchQuery?: string;
  onSearchChange?: (text: string) => void;
  avatarUrl?: string | null;
  onAvatarPress?: () => void;
  isDarkMode?: boolean;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
  searchQuery = '',
  onSearchChange,
  avatarUrl,
  onAvatarPress,
  isDarkMode: customDarkMode,
}) => {
  const { isDarkMode, activeColors } = useTheme(customDarkMode);

  return (
    <View className="flex-row items-center justify-between px-4 py-2.5 w-full">
      {/* Left: MyGlo Logo Icon */}
      <View className="flex-row items-center mr-3">
        <View
          style={{ backgroundColor: activeColors.primary }}
          className="w-10 h-10 rounded-full items-center justify-center shadow-sm"
        >
          <MyGloLogo type="icon" color="white" size="sm" align="center" />
        </View>
      </View>

      {/* Center: Search Bar */}
      <View
        style={{
          backgroundColor: isDarkMode ? '#16222A' : '#EAEBE7',
          borderColor: activeColors.border,
        }}
        className="flex-1 flex-row items-center rounded-full h-10 px-3.5 border border-solid mr-3"
      >
        <Ionicons
          name="search-outline"
          size={18}
          color={activeColors.mutedForeground}
          style={{ marginRight: 8 }}
        />
        <TextInput
          value={searchQuery}
          onChangeText={onSearchChange}
          placeholder="Search wishlists..."
          placeholderTextColor={activeColors.mutedForeground}
          style={[
            styles.searchInput,
            { color: activeColors.foreground },
          ]}
        />
        {Boolean(searchQuery) && (
          <TouchableOpacity onPress={() => onSearchChange?.('')} activeOpacity={0.7}>
            <Ionicons
              name="close-circle"
              size={16}
              color={activeColors.mutedForeground}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Right: User Avatar */}
      <TouchableOpacity
        onPress={onAvatarPress}
        activeOpacity={0.8}
        className="relative"
      >
        <View
          style={{
            borderColor: activeColors.primary,
            backgroundColor: activeColors.muted,
          }}
          className="w-10 h-10 rounded-full border-2 items-center justify-center overflow-hidden shadow-sm"
        >
          {avatarUrl ? (
            <Image
              source={{ uri: avatarUrl }}
              style={styles.avatarImage}
              resizeMode="cover"
            />
          ) : (
            <Ionicons
              name="person"
              size={20}
              color={activeColors.mutedForeground}
            />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  searchInput: {
    flex: 1,
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    paddingVertical: 0,
    outlineStyle: 'none',
    outlineWidth: 0,
  } as any,
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 9999,
  },
});

export default TopNavBar;
