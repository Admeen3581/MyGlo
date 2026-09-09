import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { LightColors, DarkColors } from '@/constants/colors';
import { MyGloLogo } from '@/components/MyGloLogo';
import { ThemeContext } from '@/context/ThemeContext';

interface FloatingNavProps {
  title?: string;
  onActionPress?: () => void;
  actionText?: string;
  isDarkMode?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const FloatingNav: React.FC<FloatingNavProps> = ({
  title = 'MyGlo',
  onActionPress,
  actionText = 'Get Started',
  isDarkMode: customDarkMode,
  style,
}) => {
  const context = useContext(ThemeContext);
  const isDarkMode = customDarkMode !== undefined ? customDarkMode : (context?.isDarkMode ?? false);
  const activeColors = isDarkMode ? DarkColors : LightColors;

  return (
    <View
      style={[
        {
          backgroundColor: isDarkMode ? 'rgba(14, 21, 26, 0.85)' : 'rgba(255, 255, 255, 0.85)',
          borderColor: activeColors.border,
        },
        style,
      ]}
      className="flex-row items-center justify-between shadow-sm px-5 py-3 rounded-full border"
    >
      <View className="flex-row items-center gap-3">
        <View
          style={{ backgroundColor: activeColors.primary }}
          className="w-10 h-10 rounded-full items-center justify-center shadow-sm"
        >
          <MyGloLogo type="icon" color="white" size={45} align='center' />
        </View>
        <Text
          style={{ color: activeColors.foreground }}
          className="text-xl font-fraunces-bold"
        >
          {title}
        </Text>
      </View>

      <TouchableOpacity
        onPress={onActionPress}
        activeOpacity={0.8}
        style={{ backgroundColor: activeColors.primary }}
        className="px-5 py-2 rounded-full"
      >
        <Text
          style={{ color: activeColors.primaryForeground }}
          className="font-nunito-bold text-xs"
        >
          {actionText}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default FloatingNav;
