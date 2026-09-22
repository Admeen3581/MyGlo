import React from 'react';
import { View, Text, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'destructive' | 'muted';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  isDarkMode?: boolean;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'primary',
  size = 'md',
  icon,
  isDarkMode: customDarkMode,
  className = '',
  style,
}) => {
  const { activeColors } = useTheme(customDarkMode);

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          container: {
            backgroundColor: activeColors.badgePrimaryBg,
            borderColor: activeColors.badgePrimaryBorder,
            borderWidth: 1,
          },
          text: {
            color: activeColors.primary,
          },
        };
      case 'secondary':
        return {
          container: {
            backgroundColor: activeColors.badgeSecondaryBg,
            borderColor: activeColors.badgeSecondaryBorder,
            borderWidth: 1,
          },
          text: {
            color: activeColors.secondaryForeground,
          },
        };
      case 'success':
        return {
          container: {
            backgroundColor: activeColors.badgeSuccessBg,
            borderColor: activeColors.badgeSuccessBorder,
            borderWidth: 1,
          },
          text: {
            color: activeColors.success,
          },
        };
      case 'warning':
        return {
          container: {
            backgroundColor: activeColors.badgeWarningBg,
            borderColor: activeColors.badgeWarningBorder,
            borderWidth: 1,
          },
          text: {
            color: activeColors.warning,
          },
        };
      case 'destructive':
        return {
          container: {
            backgroundColor: activeColors.badgeDestructiveBg,
            borderColor: activeColors.badgeDestructiveBorder,
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
    md: { container: 'px-3 py-1.25', text: 'text-xs font-nunito-semibold' },
    lg: { container: 'px-4 py-1.5', text: 'text-sm font-nunito-bold' },
  };

  return (
    <View
      style={[variantStyles.container, style]}
      className={`rounded-full flex-row items-center justify-center ${sizeStyles[size].container} ${className}`}
    >
      {icon && <View className="mr-1 flex-row items-center justify-center">{icon}</View>}
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
