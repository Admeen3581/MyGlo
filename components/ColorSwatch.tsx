import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import { LightColors, DarkColors } from '@/constants/colors';
import { ThemeContext } from '@/context/ThemeContext';

interface ColorSwatchProps {
  name: string;
  hex: string;
  textColor?: string;
  isDarkMode?: boolean;
}

export const ColorSwatch: React.FC<ColorSwatchProps> = ({
  name,
  hex,
  isDarkMode: customDarkMode,
}) => {
  const context = useContext(ThemeContext);
  const isDarkMode = customDarkMode !== undefined ? customDarkMode : (context?.isDarkMode ?? false);
  const activeColors = isDarkMode ? DarkColors : LightColors;

  return (
    <View
      style={{
        backgroundColor: isDarkMode ? activeColors.muted : '#FFFFFF',
        borderColor: activeColors.border,
      }}
      className="w-[48%] mb-3 p-3 rounded-2xl border flex-row items-center space-x-3"
    >
      <View
        style={{
          backgroundColor: hex,
          borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.10)',
        }}
        className="w-10 h-10 rounded-xl border shadow-sm"
      />
      <View className="flex-1 ml-2">
        <Text
          style={{ color: activeColors.foreground }}
          className="text-sm font-nunito-bold capitalize"
        >
          {name}
        </Text>
        <Text
          style={{ color: activeColors.mutedForeground }}
          className="text-xs font-nunito uppercase"
        >
          {hex}
        </Text>
      </View>
    </View>
  );
};

export default ColorSwatch;
