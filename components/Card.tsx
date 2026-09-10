import React, { useContext } from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { blobShapes } from '@/constants/theme';
import { LightColors, DarkColors } from '@/constants/colors';
import { ThemeContext } from '@/context/ThemeContext';

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
  const context = useContext(ThemeContext);
  const isDarkMode = customDarkMode !== undefined ? customDarkMode : (context?.isDarkMode ?? false);
  const activeColors = isDarkMode ? DarkColors : LightColors;

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
    backgroundColor: isDarkMode ? activeColors.muted : '#FFFFFF',
    borderColor: activeColors.border,
    shadowColor: activeColors.shadowTint,
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
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },
});

export default Card;
