import React from 'react';
import { View, TextInput as RNTextInput, TextInputProps, Text } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

export type InputStatusType = 'success' | 'warning' | 'destructive' | null;

interface InputProps extends TextInputProps {
    label?: string;
    rightLabel?: React.ReactNode;
    error?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    containerClassName?: string;
    isDarkMode?: boolean;
    statusType?: InputStatusType;
    isDestructive?: boolean;
}

export const Input: React.FC<InputProps> = ({
                                                label,
                                                rightLabel,
                                                error,
                                                leftIcon,
                                                rightIcon,
                                                containerClassName = '',
                                                style,
                                                isDarkMode: customDarkMode,
                                                placeholderTextColor,
                                                statusType,
                                                isDestructive: customIsDestructive,
                                                ...props
                                            }) => {
    const { isDarkMode, activeColors } = useTheme(customDarkMode);

    const isDestructive = customIsDestructive || statusType === 'destructive' || Boolean(error);

    const getBorderColor = () => {
        if (isDestructive) {
            return activeColors.destructive;
        } else {
            return activeColors.border;
        }
    };

    const getBorderWidth = () => {
        if (isDestructive || statusType === 'warning') {
            return 1.5;
        }
        return 1;
    };

    return (
        <View className={`w-full mb-5 px-1 ${containerClassName}`}>
            {Boolean(label || rightLabel) && (
                <View className="flex-row items-center justify-between mb-1 px-2">
                    {label ? (
                        <Text
                            style={{ color: activeColors.foreground }}
                            className="text-sm font-nunito-semibold"
                        >
                            {label}
                        </Text>
                    ) : (
                        <View />
                    )}
                    {typeof rightLabel === 'string' ? (
                        <Text
                            style={{ color: activeColors.mutedForeground }}
                            className="text-xs font-nunito-semibold"
                        >
                            {rightLabel}
                        </Text>
                    ) : (
                        rightLabel
                    )}
                </View>
            )}
            <View
                style={{
                    backgroundColor: isDarkMode ? 'rgba(22, 34, 42, 0.85)' : 'rgba(255, 255, 255, 0.80)',
                    borderColor: getBorderColor(),
                    borderWidth: getBorderWidth(),
                }}
                className="flex-row items-center rounded-full h-12 px-5"
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
            {Boolean(error) && (
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
