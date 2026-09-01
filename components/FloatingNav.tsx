import React from 'react';
import { View, Text, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { images } from '@/constants/images';

interface FloatingNavProps {
  title?: string;
  onActionPress?: () => void;
  actionText?: string;
  isDarkMode?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const FloatingNav: React.FC<FloatingNavProps> = ({
  title = 'MyGlo',
  onActionPress,
  actionText = 'Get Started',
  isDarkMode = false,
  style,
}) => {
  return (
    <View
      style={style}
      className={`flex-row items-center justify-between shadow-sm px-5 py-3 rounded-full border ${
        isDarkMode
          ? 'bg-neutral-900/80 border-neutral-700'
          : 'bg-white/75 border-border/50'
      }`}
    >
      <View className="flex-row items-center gap-3">
        <View className="w-10 h-10 rounded-full bg-primary items-center justify-center shadow-sm">
          <Image
            source={images.logoIconWhite}
            style={{ width: 48, height: 48, borderRadius: 24 }}
            contentFit="cover"
          />
        </View>
        <Text
          className={`text-xl font-fraunces-bold ${
            isDarkMode ? 'text-white' : 'text-foreground'
          }`}
        >
          {title}
        </Text>
      </View>

      <TouchableOpacity
        onPress={onActionPress}
        activeOpacity={0.8}
        className="bg-primary px-5 py-2 rounded-full"
      >
        <Text className="text-primary-foreground font-nunito-bold text-xs">
          {actionText}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default FloatingNav;
