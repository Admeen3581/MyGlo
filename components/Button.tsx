import React from 'react';
import { TouchableOpacity, Text, View, ActivityIndicator } from 'react-native';

interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
}) => {
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

  const variantContainerClasses = {
    primary: 'bg-primary border-0',
    secondary: 'bg-secondary border-0',
    outline: 'bg-transparent border-2 border-secondary',
    ghost: 'bg-transparent border-0',
  };

  const variantTextClasses = {
    primary: 'text-primary-foreground',
    secondary: 'text-secondary-foreground',
    outline: 'text-accent',
    ghost: 'text-primary',
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      className={`rounded-full flex-row items-center justify-center ${sizeClasses[size]} ${variantContainerClasses[variant]} ${
        disabled ? 'opacity-50' : 'opacity-100'
      }`}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? '#EDF2F4' : '#005F73'}
        />
      ) : (
        <View className="flex-row items-center justify-center">
          {icon && <View className="mr-2">{icon}</View>}
          <Text className={`${textSizeClasses[size]} ${variantTextClasses[variant]}`}>
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default Button;
