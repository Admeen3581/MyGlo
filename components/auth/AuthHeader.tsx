import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { MyGloLogo } from '@/components/MyGloLogo';

export interface AuthHeaderProps {
  showBackButton?: boolean;
  onBackPress?: () => void;
  isDarkMode?: boolean;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({
  showBackButton = false,
  onBackPress,
  isDarkMode: customDarkMode,
}) => {
  const { isDarkMode, toggleDarkMode, activeColors } = useTheme(customDarkMode);

  return (
    <View className="flex-row items-center justify-between mb-6 pt-2">
      {showBackButton ? (
        <TouchableOpacity
          onPress={onBackPress}
          activeOpacity={0.7}
          style={{
            backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
            borderColor: activeColors.border,
          }}
          className="w-10 h-10 rounded-full border items-center justify-center"
        >
          <Ionicons name="arrow-back" size={20} color={activeColors.foreground} />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 40 }} />
      )}

      <MyGloLogo type="standard" isDarkMode={isDarkMode} size="sm" />

      <TouchableOpacity
        onPress={toggleDarkMode}
        activeOpacity={0.8}
        style={{
          backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
          borderColor: activeColors.border,
        }}
        className="px-3 py-1.5 rounded-full border flex-row items-center"
      >
        <Text
          style={{ color: activeColors.foreground }}
          className="text-xs font-nunito-bold"
        >
          {isDarkMode ? 'Light' : 'Dark'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default AuthHeader;
