import React from 'react';
import { TouchableOpacity, Text, View, ActivityIndicator } from 'react-native';
import { LightColors, DarkColors } from '@/constants/colors';

interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  isDarkMode?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  isDarkMode = false,
}) => {
  const activeColors = isDarkMode ? DarkColors : LightColors;

  const sizeClasses = {
    sm: 'h-10 px-6',
    md: 'h-12 px-8',
    lg: 'h-14 px-10',
  };

  const textSizeClasses = {
    sm: 'text-sm font-nunito-bold',
    md: 'text-base font-nunito-bold',
    lg: 'text-lg font-nunito-bold',
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          container: {
            backgroundColor: activeColors.primary,
            borderWidth: 0,
          },
          text: {
            color: activeColors.primaryForeground,
          },
          indicator: activeColors.primaryForeground,
        };
      case 'secondary':
        return {
          container: {
            backgroundColor: activeColors.secondary,
            borderWidth: 0,
          },
          text: {
            color: activeColors.secondaryForeground,
          },
          indicator: activeColors.secondaryForeground,
        };
      case 'outline':
        return {
          container: {
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderColor: activeColors.secondary,
          },
          text: {
            color: isDarkMode ? activeColors.accentForeground : activeColors.accent,
          },
          indicator: isDarkMode ? activeColors.accentForeground : activeColors.accent,
        };
      case 'ghost':
        return {
          container: {
            backgroundColor: 'transparent',
            borderWidth: 0,
          },
          text: {
            color: activeColors.primary,
          },
          indicator: activeColors.primary,
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={[variantStyles.container]}
      className={`rounded-full flex-row items-center justify-center ${sizeClasses[size]} ${
        disabled ? 'opacity-50' : 'opacity-100'
      }`}
    >
      {loading ? (
        <ActivityIndicator color={variantStyles.indicator} />
      ) : (
        <View className="flex-row items-center justify-center">
          {icon && <View className="mr-2">{icon}</View>}
          <Text
            style={[variantStyles.text]}
            className={`${textSizeClasses[size]}`}
          >
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default Button;
