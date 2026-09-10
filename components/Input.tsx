import React, { useContext } from 'react';
import { View, TextInput as RNTextInput, TextInputProps, Text } from 'react-native';
import { LightColors, DarkColors } from '@/constants/colors';
import { ThemeContext } from '@/context/ThemeContext';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
  isDarkMode?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  containerClassName = '',
  style,
  isDarkMode: customDarkMode,
  placeholderTextColor,
  ...props
}) => {
  const context = useContext(ThemeContext);
  const isDarkMode = customDarkMode !== undefined ? customDarkMode : (context?.isDarkMode ?? false);
  const activeColors = isDarkMode ? DarkColors : LightColors;

  return (
    <View className={`w-full mb-5 px-1 ${containerClassName}`}>
      {label && (
        <Text
          style={{ color: activeColors.foreground }}
          className="text-sm font-nunito-semibold mb-1 ml-2"
        >
          {label}
        </Text>
      )}
      <View
        style={{
          backgroundColor: isDarkMode ? 'rgba(22, 34, 42, 0.85)' : 'rgba(255, 255, 255, 0.80)',
          borderColor: activeColors.border,
        }}
        className="flex-row items-center border rounded-full h-12 px-5"
      >
        {leftIcon && <View className="mr-3">{leftIcon}</View>}
        <RNTextInput
          style={[
            {
              flex: 1,
              fontFamily: 'Nunito-Regular',
              fontSize: 14,
              color: activeColors.foreground,
              outlineStyle: 'none',
              outlineWidth: 0,
            } as any,
            style,
          ]}
          placeholderTextColor={placeholderTextColor || activeColors.mutedForeground}
          {...props}
        />
        {rightIcon && <View className="ml-3">{rightIcon}</View>}
      </View>
      {error && (
        <Text
          style={{ color: activeColors.destructive }}
          className="text-xs font-nunito mt-1 ml-3"
        >
          {error}
        </Text>
      )}
    </View>
  );
};

export default Input;
