import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { blobShapes, shadows } from '@/constants/theme';

interface CardProps extends ViewProps {
  variant?: 'default' | 'tl-large' | 'tr-large' | 'br-large' | 'bl-large';
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  children,
  className = '',
  style,
  ...props
}) => {
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

  return (
    <View
      style={[styles.card, getRadiusStyle(), style]}
      className={`bg-white p-6 border border-border/60 ${className}`}
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    ...shadows.soft,
  },
});

export default Card;
