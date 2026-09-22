import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { blobShapes } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';

interface CardProps extends ViewProps {
  variant?: 'default' | 'tl-large' | 'tr-large' | 'br-large' | 'bl-large';
  children: React.ReactNode;
  className?: string;
  isDarkMode?: boolean;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  children,
  className = '',
  style,
  isDarkMode: customDarkMode,
  ...props
}) => {
  const { isDarkMode, activeColors } = useTheme(customDarkMode);

  const getRadiusStyle = () => {
    switch (variant) {
      case 'tl-large':
        return blobShapes.cardAsymmetric1;
      case 'tr-large':
        return blobShapes.cardAsymmetric2;
      case 'br-large':
        return blobShapes.cardAsymmetric3;
      case 'bl-large':
        return blobShapes.cardAsymmetric4;
      default:
        return { borderRadius: 32 };
    }
  };

  const dynamicCardStyle = {
    backgroundColor: activeColors.card,
    borderColor: activeColors.border,
    boxShadow: `0px 8px 16px ${isDarkMode ? 'rgba(2, 8, 17, 0.4)' : 'rgba(1, 55, 125, 0.12)'}`,
  };

  return (
    <View
      style={[styles.card, getRadiusStyle(), dynamicCardStyle, style]}
      className={`p-6 border ${className}`}
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    elevation: 4,
  },
});

export default Card;
