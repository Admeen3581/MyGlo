import React from 'react';
import { View, Text } from 'react-native';
import { LightColors, DarkColors } from '@/constants/colors';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'destructive' | 'muted';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  isDarkMode?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'primary',
  size = 'md',
  icon,
  isDarkMode = false,
}) => {
  const activeColors = isDarkMode ? DarkColors : LightColors;

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          container: {
            backgroundColor: isDarkMode ? 'rgba(32, 164, 181, 0.15)' : 'rgba(0, 95, 115, 0.10)',
            borderColor: isDarkMode ? 'rgba(32, 164, 181, 0.30)' : 'rgba(0, 95, 115, 0.20)',
            borderWidth: 1,
          },
          text: {
            color: activeColors.primary,
          },
        };
      case 'secondary':
        return {
          container: {
            backgroundColor: isDarkMode ? 'rgba(39, 74, 75, 0.40)' : 'rgba(132, 210, 189, 0.20)',
            borderColor: isDarkMode ? 'rgba(163, 231, 213, 0.30)' : 'rgba(132, 210, 189, 0.40)',
            borderWidth: 1,
          },
          text: {
            color: activeColors.secondaryForeground,
          },
        };
      case 'success':
        return {
          container: {
            backgroundColor: isDarkMode ? 'rgba(65, 196, 122, 0.15)' : 'rgba(56, 178, 108, 0.15)',
            borderColor: isDarkMode ? 'rgba(65, 196, 122, 0.30)' : 'rgba(56, 178, 108, 0.30)',
            borderWidth: 1,
          },
          text: {
            color: activeColors.success,
          },
        };
      case 'warning':
        return {
          container: {
            backgroundColor: isDarkMode ? 'rgba(240, 154, 36, 0.15)' : 'rgba(232, 139, 26, 0.15)',
            borderColor: isDarkMode ? 'rgba(240, 154, 36, 0.30)' : 'rgba(232, 139, 26, 0.30)',
            borderWidth: 1,
          },
          text: {
            color: activeColors.warning,
          },
        };
      case 'destructive':
        return {
          container: {
            backgroundColor: isDarkMode ? 'rgba(224, 83, 67, 0.15)' : 'rgba(196, 61, 47, 0.15)',
            borderColor: isDarkMode ? 'rgba(224, 83, 67, 0.30)' : 'rgba(196, 61, 47, 0.30)',
            borderWidth: 1,
          },
          text: {
            color: activeColors.destructive,
          },
        };
      case 'muted':
      default:
        return {
          container: {
            backgroundColor: activeColors.muted,
            borderColor: activeColors.border,
            borderWidth: 1,
          },
          text: {
            color: activeColors.mutedForeground,
          },
        };
    }
  };

  const variantStyles = getVariantStyles();

  const sizeStyles = {
    sm: { container: 'px-3 py-1', text: 'text-xs font-nunito-semibold' },
    md: { container: 'px-4 py-1.5', text: 'text-sm font-nunito-bold' },
  };

  return (
    <View
      style={[variantStyles.container]}
      className={`rounded-full flex-row items-center justify-center self-start ${sizeStyles[size].container}`}
    >
      {icon && <View className="mr-1.5">{icon}</View>}
      <Text
        style={[variantStyles.text]}
        className={`${sizeStyles[size].text}`}
      >
        {label}
      </Text>
    </View>
  );
};

export default Badge;
