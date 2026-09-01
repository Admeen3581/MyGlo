import React from 'react';
import { View, TextInput as RNTextInput, TextInputProps, Text } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  containerClassName = '',
  style,
  ...props
}) => {
  return (
    <View className={`w-full ${containerClassName}`}>
      {label && (
        <Text className="text-sm font-nunito-semibold text-foreground mb-2 ml-2">
          {label}
        </Text>
      )}
      <View className="flex-row items-center bg-white/80 border border-border rounded-full h-12 px-5">
        {leftIcon && <View className="mr-3">{leftIcon}</View>}
        <RNTextInput
          style={[
            {
              flex: 1,
              fontFamily: 'Nunito-Regular',
              fontSize: 14,
              color: '#222D35',
            },
            style,
          ]}
          placeholderTextColor="#5C6B71"
          {...props}
        />
        {rightIcon && <View className="ml-3">{rightIcon}</View>}
      </View>
      {error && (
        <Text className="text-xs font-nunito text-destructive mt-1 ml-3">
          {error}
        </Text>
      )}
    </View>
  );
};

export default Input;
