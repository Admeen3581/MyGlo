import React from 'react';
import { View, Text, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

export type BadgeVariant =
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'destructive'
    | 'primary-solid'
    | 'secondary-solid'
    | 'success-solid'
    | 'warning-solid'
    | 'destructive-solid'

export interface BadgeProps {
    label: string;
    variant?: BadgeVariant;
    size?: 'sm' | 'md' | 'lg';
    isOpaque?: boolean;
    icon?: React.ReactNode;
    isDarkMode?: boolean;
    className?: string;
    style?: StyleProp<ViewStyle>;
}

export const Badge: React.FC<BadgeProps> = ({
                                                label,
                                                variant = 'primary',
                                                size = 'md',
                                                isOpaque = false,
                                                icon,
                                                isDarkMode: customDarkMode,
                                                className = '',
                                                style,
                                            }) => {
    const { activeColors } = useTheme(customDarkMode);

    const getVariantStyles = () => {
        // Map base variant + isOpaque flag to effective variant
        const effectiveVariant: BadgeVariant =
            isOpaque && !variant.endsWith('-solid')
                ? (`${variant}-solid` as BadgeVariant)
                : variant;

        switch (effectiveVariant) {
            // Opaque / Solid Variants
            case 'primary-solid':
                return {
                    container: {
                        backgroundColor: activeColors.badgePrimarySolidBg,
                        borderColor: activeColors.badgePrimarySolidBg,
                        borderWidth: 1,
                    },
                    text: {
                        color: activeColors.badgePrimarySolidFg,
                    },
                };
            case 'secondary-solid':
                return {
                    container: {
                        backgroundColor: activeColors.badgeSecondarySolidBg,
                        borderColor: activeColors.badgeSecondarySolidBg,
                        borderWidth: 1,
                    },
                    text: {
                        color: activeColors.badgeSecondarySolidFg,
                    },
                };
            case 'success-solid':
                return {
                    container: {
                        backgroundColor: activeColors.badgeSuccessSolidBg,
                        borderColor: activeColors.badgeSuccessSolidBg,
                        borderWidth: 1,
                    },
                    text: {
                        color: activeColors.badgeSuccessSolidFg,
                    },
                };
            case 'warning-solid':
                return {
                    container: {
                        backgroundColor: activeColors.badgeWarningSolidBg,
                        borderColor: activeColors.badgeWarningSolidBg,
                        borderWidth: 1,
                    },
                    text: {
                        color: activeColors.badgeWarningSolidFg,
                    },
                };
            case 'destructive-solid':
                return {
                    container: {
                        backgroundColor: activeColors.badgeDestructiveSolidBg,
                        borderColor: activeColors.badgeDestructiveSolidBg,
                        borderWidth: 1,
                    },
                    text: {
                        color: activeColors.badgeDestructiveSolidFg,
                    },
                };

            // Subtle / Translucent Variants (Original)
            case 'primary':
                return {
                    container: {
                        backgroundColor: activeColors.badgePrimaryBg,
                        borderColor: activeColors.badgePrimaryBorder,
                        borderWidth: 1,
                    },
                    text: {
                        color: activeColors.primary,
                    },
                };
            case 'secondary':
                return {
                    container: {
                        backgroundColor: activeColors.badgeSecondaryBg,
                        borderColor: activeColors.badgeSecondaryBorder,
                        borderWidth: 1,
                    },
                    text: {
                        color: activeColors.secondaryForeground,
                    },
                };
            case 'success':
                return {
                    container: {
                        backgroundColor: activeColors.badgeSuccessBg,
                        borderColor: activeColors.badgeSuccessBorder,
                        borderWidth: 1,
                    },
                    text: {
                        color: activeColors.success,
                    },
                };
            case 'warning':
                return {
                    container: {
                        backgroundColor: activeColors.badgeWarningBg,
                        borderColor: activeColors.badgeWarningBorder,
                        borderWidth: 1,
                    },
                    text: {
                        color: activeColors.warning,
                    },
                };
            case 'destructive':
                return {
                    container: {
                        backgroundColor: activeColors.badgeDestructiveBg,
                        borderColor: activeColors.badgeDestructiveBorder,
                        borderWidth: 1,
                    },
                    text: {
                        color: activeColors.destructive,
                    },
                };
        }
    };

    const variantStyles = getVariantStyles();

    const sizeStyles = {
        sm: { container: 'px-3 py-1', text: 'text-[13px] font-nunito-semibold' },
        md: { container: 'px-3 py-1.25', text: 'text-xs font-nunito-semibold' },
        lg: { container: 'px-4 py-1.5', text: 'text-sm font-nunito-bold' },
    };

    return (
        <View
            style={[variantStyles.container, style]}
            className={`rounded-full flex-row items-center justify-center ${sizeStyles[size].container} ${className}`}
        >
            {icon && <View className="mr-1 flex-row items-center justify-center">{icon}</View>}
            <Text
                style={[variantStyles.text]}
                className={`${sizeStyles[size].text}`}
            >
                {label}
            </Text>
        </View>
    );
};

export default Badge;
