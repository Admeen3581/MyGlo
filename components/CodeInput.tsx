import React, { useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface CodeInputProps {
  code: string;
  onChangeCode: (code: string) => void;
  isDarkMode?: boolean;
  hasError?: boolean;
  autoFocus?: boolean;
  onSubmitEditing?: () => void;
}

// Reusable 6-digit verification code input component with hidden TextInput
export const CodeInput: React.FC<CodeInputProps> = ({
  code,
  onChangeCode,
  isDarkMode: customDarkMode,
  hasError = false,
  autoFocus = false,
  onSubmitEditing,
}) => {
  const { isDarkMode, activeColors } = useTheme(customDarkMode);
  const { width } = useWindowDimensions();
  const isMobile = Platform.OS !== 'web' || width < 640;
  const inputRef = useRef<TextInput>(null);

  const digits = code.split('');

  const handleTextChange = (text: string) => {
    // Only accept numeric input up to 6 digits
    const cleaned = text.replace(/[^0-9]/g, '').slice(0, 6);
    onChangeCode(cleaned);
  };

  return (
    <View className="w-full items-center">
      {/* 6-digit visual slot indicators */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => inputRef.current?.focus()}
        className={
          isMobile
            ? 'flex-row items-center justify-center gap-3 mb-6'
            : 'flex-row items-center justify-center gap-4 mb-4'
        }
      >
        {[0, 1, 2, 3, 4, 5].map((index) => {
          const isFilled = index < digits.length;
          const isCurrentFocus =
            index === digits.length || (index === 5 && digits.length === 6);

          return (
            <View
              key={index}
              style={[
                styles.digitBox,
                {
                  backgroundColor: isDarkMode
                    ? 'rgba(22, 34, 42, 0.9)'
                    : '#FFFFFF',
                  borderColor: hasError
                    ? activeColors.destructive
                    : isCurrentFocus
                    ? activeColors.primary
                    : isFilled
                    ? activeColors.secondary
                    : activeColors.border,
                  borderWidth: isCurrentFocus || hasError ? 2 : 1,
                },
              ]}
              className={
                isMobile
                  ? 'w-11 h-14 rounded-xl items-center justify-center shadow-sm'
                  : 'w-12 h-15 rounded-xl items-center justify-center shadow-sm'
              }
            >
              <Text
                style={{ color: activeColors.foreground }}
                className={
                  isMobile ? 'text-4xl font-fraunces-bold' : 'text-5xl font-fraunces-bold'
                }
              >
                {digits[index] || ''}
              </Text>
            </View>
          );
        })}
      </TouchableOpacity>

      {/* Hidden TextInput for native keyboard integration */}
      <TextInput
        ref={inputRef}
        value={code}
        onChangeText={handleTextChange}
        keyboardType="number-pad"
        maxLength={6}
        style={styles.hiddenInput}
        caretHidden
        autoFocus={autoFocus}
        textContentType="oneTimeCode"
        onSubmitEditing={onSubmitEditing}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  digitBox: {
    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
    elevation: 1,
  },
  hiddenInput: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0.01,
  },
});

export default CodeInput;
