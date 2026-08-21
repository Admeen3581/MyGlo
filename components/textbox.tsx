import React, { useState, forwardRef } from 'react';
import {
    View,
    TextInput,
    Text,
    StyleSheet,
    TextInputProps,
    TouchableOpacity,
    useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts } from "@/constants/theme";
import {ThemedView} from "@/components/themed-view";
import {ThemedText} from "@/components/themed-text";

export interface TextboxInputProps extends TextInputProps {
    label?: string;
    error?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    isPassword?: boolean;
    showClearButton?: boolean;
    autoCapitalize?: TextInputProps['autoCapitalize'];
    autoCorrect?: boolean;
    autoComplete?: TextInputProps['autoComplete'];
    keyboardType?: TextInputProps['keyboardType'];
    value?: string;
    onChangeText?: (text: string) => void;
}

const TextboxInput = forwardRef<TextInput, TextboxInputProps>(
    (
        {
            label,
            error,
            leftIcon,
            rightIcon,
            isPassword = false,
            showClearButton = false,
            autoCapitalize = 'none',
            autoCorrect = false,
            autoComplete = 'off',
            keyboardType = 'default',
            value,
            onChangeText,
            style,
            ...props
        },
        ref
    ) => {
        // Theme & State Setup
        const colorScheme = useColorScheme();
        const theme = Colors[colorScheme ?? 'light'];

        const [isFocused, setIsFocused] = useState(false);
        const [isPasswordHidden, setIsPasswordHidden] = useState(isPassword);

        // Handlers
        const handleClear = () => {
            onChangeText?.('');
        };

        return (
            <ThemedView>
                {/* Label */}
                {label ? (
                    <ThemedText style={[styles.label, { color: theme.text, fontFamily: Fonts.sans }]}>
                        {label}
                    </ThemedText>
                ) : null}

                {/* Input Container */}
                <ThemedView>
                    {/* Left Icon Slot */}
                    {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}

                    {/* Core TextInput */}
                    <TextboxInput
                        ref={ref}
                        value={value}
                        onChangeText={onChangeText}
                        secureTextEntry={isPassword ? isPasswordHidden : false}
                        autoCapitalize={autoCapitalize}
                        autoCorrect={autoCorrect}
                        autoComplete={autoComplete}
                        keyboardType={keyboardType}
                        placeholderTextColor={theme.icon}
                        onFocus={(e) => {
                            setIsFocused(true);
                            props.onFocus?.(e);
                        }}
                        onBlur={(e) => {
                            setIsFocused(false);
                            props.onBlur?.(e);
                        }}
                        style={[styles.input, { color: theme.text, fontFamily: Fonts.sans }, style]}
                        {...props}
                    />

                    {/* Right-Side Adornments */}
                    <ThemedView>

                        {/* Custom Clear Button */}
                        {showClearButton && value && value.length > 0 && !isPassword ? (
                            <TouchableOpacity onPress={handleClear} style={styles.iconButton} hitSlop={8}>
                                <Ionicons name="close-circle" size={20} color={theme.icon} />
                            </TouchableOpacity>
                        ) : null}

                        {/* Password Toggle Button */}
                        {isPassword ? (
                            <TouchableOpacity
                                onPress={() => setIsPasswordHidden(!isPasswordHidden)}
                                style={styles.iconButton}
                                hitSlop={8}
                            >
                                <Ionicons
                                    name={isPasswordHidden ? 'eye-off' : 'eye'}
                                    size={20}
                                    color={theme.icon}
                                />
                            </TouchableOpacity>
                        ) : null}

                        {/* General Right Icon Slot */}
                        {rightIcon && <ThemedView>{rightIcon}</ThemedView>}
                    </ThemedView>
                </ThemedView>

                {/* Error Text */}
                {error ? (
                    <ThemedText type='default' style={{fontFamily: Fonts.sans}}>
                        {error}
                    </ThemedText>
                ) : null}
            </ThemedView>
        );
    }
);

TextboxInput.displayName = 'TextboxInput';
export default TextboxInput;

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
        width: '100%',
    },
    label: {
        marginBottom: 6,
        fontSize: 14,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 8,
        minHeight: 48,
        overflow: 'hidden',
    },
    inputFocused: {
        borderColor: '#0A7EA4', // Expo's default active tab blue
    },
    leftIconContainer: {
        paddingLeft: 12,
    },
    input: {
        flex: 1,
        paddingHorizontal: 12,
        paddingVertical: 12,
        fontSize: 16,
    },
    rightAdornmentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 12,
    },
    iconButton: {
        marginLeft: 8,
    },
    rightIconContainer: {
        marginLeft: 8,
    },
    errorText: {
        marginTop: 4,
        fontSize: 12,
    },
});