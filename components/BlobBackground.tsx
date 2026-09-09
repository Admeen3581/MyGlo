import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { blobShapes } from '@/constants/theme';

interface BlobBackgroundProps {
  color?: string;
  size?: number;
  variant?: 'blob1' | 'blob2' | 'blob3';
  style?: ViewStyle;
  opacity?: number;
}

export const BlobBackground: React.FC<BlobBackgroundProps> = ({
  color = '#84D2BD',
  size = 200,
  variant = 'blob1',
  style,
  opacity = 0.35,
}) => {
  const blobShapeStyle = blobShapes[variant];

  return (
    <View
      style={[
        styles.blob,
        blobShapeStyle,
        {
          width: size,
          height: size,
          backgroundColor: color,
          opacity: opacity,
        },
        style,
      ]}
      pointerEvents="none"
    />
  );
};

const styles = StyleSheet.create({
  blob: {
    position: 'absolute',
    transform: [{ scale: 1.1 }],
  },
});

export default BlobBackground;
