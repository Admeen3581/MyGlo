import React, { useContext } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LightColors, DarkColors } from '@/constants/colors';
import { ThemeContext } from '@/context/ThemeContext';

interface SocialAuthButtonsProps {
  isDarkMode?: boolean;
}

export const SocialAuthButtons: React.FC<SocialAuthButtonsProps> = ({
  isDarkMode: customDarkMode,
}) => {
  const router = useRouter();
  const context = useContext(ThemeContext);
  const isDarkMode = customDarkMode !== undefined ? customDarkMode : (context?.isDarkMode ?? false);
  const activeColors = isDarkMode ? DarkColors : LightColors;

  const handleSocialPress = () => {
    router.push('/');
  };

  return (
    <View className="w-full space-y-3">
      {/* Divider */}
      <View className="flex-row items-center my-4">
        <View
          style={{ backgroundColor: activeColors.border }}
          className="flex-1 h-[1px]"
        />
        <Text
          style={{ color: activeColors.mutedForeground }}
          className="px-4 text-xs font-quicksand-bold uppercase tracking-wider"
        >
          Or continue with
        </Text>
        <View
          style={{ backgroundColor: activeColors.border }}
          className="flex-1 h-[1px]"
        />
      </View>

      {/* Google Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleSocialPress}
        style={{
          backgroundColor: isDarkMode ? 'rgba(22, 34, 42, 0.85)' : 'rgba(255, 255, 255, 0.9)',
          borderColor: activeColors.border,
        }}
        className="w-full h-12 rounded-full border flex-row items-center justify-center px-6"
      >
        <Ionicons
          name="logo-google"
          size={18}
          color={activeColors.foreground}
          style={{ marginRight: 10 }}
        />
        <Text
          style={{ color: activeColors.foreground }}
          className="text-base font-nunito-bold"
        >
          Continue with Google
        </Text>
      </TouchableOpacity>

      {/* Apple Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleSocialPress}
        style={{
          backgroundColor: isDarkMode ? 'rgba(22, 34, 42, 0.85)' : 'rgba(255, 255, 255, 0.9)',
          borderColor: activeColors.border,
        }}
        className="w-full h-12 rounded-full border flex-row items-center justify-center px-6"
      >
        <Ionicons
          name="logo-apple"
          size={20}
          color={activeColors.foreground}
          style={{ marginRight: 10 }}
        />
        <Text
          style={{ color: activeColors.foreground }}
          className="text-base font-nunito-bold"
        >
          Continue with Apple
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SocialAuthButtons;
