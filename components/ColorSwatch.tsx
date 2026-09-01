import React from 'react';
import { View, Text } from 'react-native';

interface ColorSwatchProps {
  name: string;
  hex: string;
  textColor?: string;
}

export const ColorSwatch: React.FC<ColorSwatchProps> = ({
  name,
  hex,
  textColor = '#FFFFFF',
}) => {
  return (
    <View className="w-[48%] mb-3 p-3 rounded-2xl border border-border/40 bg-white flex-row items-center space-x-3">
      <View
        style={{ backgroundColor: hex }}
        className="w-10 h-10 rounded-xl border border-black/10 shadow-sm"
      />
      <View className="flex-1 ml-2">
        <Text className="text-sm font-nunito-bold text-foreground capitalize">
          {name}
        </Text>
        <Text className="text-xs font-nunito text-muted-foreground uppercase">
          {hex}
        </Text>
      </View>
    </View>
  );
};

export default ColorSwatch;
