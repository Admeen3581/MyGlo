import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { router, usePathname } from 'expo-router';

export type NavTab = 'my-wishlists' | 'shared-lists' | 'friends' | 'profile';

export interface BottomNavBarProps {
    initTab?: NavTab;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ initTab }) => {
    const insets = useSafeAreaInsets();
    const pathname = usePathname();
    const { width } = useWindowDimensions();
    const { isDarkMode, activeColors } = useTheme();

    const isDesktop = width >= 768;

    const getCurrentTab = (): NavTab | null => {
        if (pathname?.includes('shared-lists')) return 'shared-lists';
        if (pathname?.includes('friends')) return 'friends';
        if (pathname?.includes('profile')) return 'profile';
        if (pathname?.includes('my-wishlists')) return 'my-wishlists';
        return initTab || null;
    };

    const activeTab = getCurrentTab();

    // Do not render bottom nav bar on desktop or non-tab routes
    if (!activeTab || isDesktop) {
        return null;
    }

    const navItems: { id: NavTab; label: string; activeIcon: keyof typeof Ionicons.glyphMap; inactiveIcon: keyof typeof Ionicons.glyphMap }[] = [
        {
            id: 'my-wishlists',
            label: 'My Wishlists',
            activeIcon: 'heart',
            inactiveIcon: 'heart-outline',
        },
        {
            id: 'shared-lists',
            label: 'Shared with Me',
            activeIcon: 'gift',
            inactiveIcon: 'gift-outline',
        },
        {
            id: 'friends',
            label: 'Friends',
            activeIcon: 'people',
            inactiveIcon: 'people-outline',
        },
        {
            id: 'profile',
            label: 'Profile',
            activeIcon: 'person',
            inactiveIcon: 'person-outline',
        },
    ];

    const handleTabPress = (tab: NavTab) => {
        if (activeTab === tab) return;
        router.replace(`/${tab}` as any);
    };

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: isDarkMode ? '#0E151A' : '#F7F7F6',
                    borderTopColor: activeColors.border,
                    paddingBottom: Math.max(insets.bottom, 8),
                    boxShadow: isDarkMode
                        ? '0px -4px 16px rgba(2, 8, 17, 0.4)'
                        : '0px -4px 16px rgba(1, 55, 125, 0.08)',
                },
            ]}
            className="w-full border-t border-solid px-6 pt-3"
        >
            <View className="flex-row items-center justify-around w-full max-w-md mx-auto">
                {navItems.map((item) => {
                    const isActive = activeTab === item.id;
                    const iconColor = isActive ? activeColors.primary : activeColors.mutedForeground;
                    const textColor = isActive ? activeColors.primary : activeColors.mutedForeground;

                    return (
                        <TouchableOpacity
                            key={item.id}
                            onPress={() => handleTabPress(item.id)}
                            activeOpacity={0.7}
                            className="items-center justify-center py-1 px-4 min-w-18"
                        >
                            <View className="relative items-center justify-center">
                                <Ionicons
                                    name={isActive ? item.activeIcon : item.inactiveIcon}
                                    size={24}
                                    color={iconColor}
                                />
                            </View>
                            <Text
                                style={{ color: textColor }}
                                className={`text-xs mt-1 ${isActive ? 'font-nunito-bold' : 'font-nunito-semibold'}`}
                            >
                                {item.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: Platform.OS === 'web' ? ('fixed' as any) : 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        elevation: 10,
    },
});

export default BottomNavBar;
