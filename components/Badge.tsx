import React from 'react';
import { View, Text } from 'react-native';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'destructive' | 'muted';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'primary',
  size = 'md',
  icon,
}) => {
  const variantStyles = {
    primary: { container: 'bg-primary/10 border border-primary/20', text: 'text-primary' },
    secondary: { container: 'bg-secondary/20 border border-secondary/40', text: 'text-secondary-foreground' },
    success: { container: 'bg-success/15 border border-success/30', text: 'text-success' },
    warning: { container: 'bg-warning/15 border border-warning/30', text: 'text-warning' },
    destructive: { container: 'bg-destructive/15 border border-destructive/30', text: 'text-destructive' },
    muted: { container: 'bg-muted border border-border', text: 'text-muted-foreground' },
  };

  const sizeStyles = {
    sm: { container: 'px-3 py-1', text: 'text-xs font-nunito-semibold' },
    md: { container: 'px-4 py-1.5', text: 'text-sm font-nunito-bold' },
  };

  return (
    <View
      className={`rounded-full flex-row items-center justify-center self-start ${variantStyles[variant].container} ${sizeStyles[size].container}`}
    >
      {icon && <View className="mr-1.5">{icon}</View>}
      <Text className={`${variantStyles[variant].text} ${sizeStyles[size].text}`}>
        {label}
      </Text>
    </View>
  );
};

export default Badge;
