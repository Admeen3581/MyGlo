import React from 'react';
import { View, TextInput, TouchableOpacity, Image, StyleSheet, Text, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MyGloLogo } from '@/components/MyGloLogo';
import { useTheme } from '@/hooks/useTheme';

export interface TopNavBarProps {
    searchQuery?: string;
    onSearchChange?: (text: string) => void;
    avatarUrl?: string | null;
    onAvatarPress?: () => void;
    isDarkMode?: boolean;
    showMenuButton?: boolean;
    isSidebarOpen?: boolean;
    onMenuPress?: () => void;
    rightAction?: 'avatar' | 'incoming-cloud' | 'add-friend';
    incomingCount?: number;
    onIncomingPress?: () => void;
    onAddFriendPress?: () => void;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
                                                        searchQuery = '',
                                                        onSearchChange,
                                                        avatarUrl,
                                                        onAvatarPress,
                                                        isDarkMode: customDarkMode,
                                                        showMenuButton = false,
                                                        isSidebarOpen = false,
                                                        onMenuPress,
                                                        rightAction = 'avatar',
                                                        incomingCount = 0,
                                                        onIncomingPress,
                                                        onAddFriendPress,
                                                    }) => {
    const { activeColors } = useTheme(customDarkMode);
    const { width } = useWindowDimensions();
    const isDesktop = width >= 768;

    const renderRightAction = () => {
        if (rightAction === 'add-friend') {
            return (
                <TouchableOpacity
                    onPress={onAddFriendPress}
                    activeOpacity={0.8}
                    className="relative"
                    accessibilityLabel="Add friend"
                >
                    <View
                        style={{
                            borderColor: activeColors.primary,
                            backgroundColor: activeColors.muted,
                        }}
                        className="w-12 h-12 rounded-full border border-solid items-center justify-center shadow-sm"
                    >
                        <Ionicons
                            name="person-add-outline"
                            size={22}
                            color={activeColors.primary}
                        />
                    </View>
                </TouchableOpacity>
            );
        }

        if (rightAction === 'incoming-cloud') {
            return (
                <TouchableOpacity
                    onPress={onIncomingPress}
                    activeOpacity={0.8}
                    className="relative"
                    accessibilityLabel="Incoming invitations"
                >
                    <View
                        style={{
                            borderColor: activeColors.primary,
                            backgroundColor: activeColors.muted,
                        }}
                        className="w-14 h-14 md:w-12 md:h-12 rounded-full border border-solid items-center justify-center shadow-sm"
                    >
                        <Ionicons
                            name="cloud-download-outline"
                            size={isDesktop ? 22 : 28}
                            color={activeColors.primary}
                        />
                    </View>
                    {Boolean(incomingCount && incomingCount > 0) && (
                        <View
                            style={{
                                backgroundColor: activeColors.destructive,
                                borderColor: activeColors.background,
                            }}
                            className="absolute -top-1 -right-1 min-w-5 h-5 rounded-full px-1 items-center justify-center border-2"
                        >
                            <Text
                                style={{ color: activeColors.destructiveForeground }}
                                className="text-[10px] font-nunito-bold text-center"
                            >
                                {incomingCount}
                            </Text>
                        </View>
                    )}
                </TouchableOpacity>
            );
        } else {
            return (
                <TouchableOpacity
                    onPress={onAvatarPress}
                    activeOpacity={0.8}
                    className="relative"
                    accessibilityLabel="User profile"
                >
                    <View
                        style={{
                            borderColor: activeColors.primary,
                            backgroundColor: activeColors.muted,
                        }}
                        className="w-12 h-12 rounded-full border-2 items-center justify-center overflow-hidden shadow-sm"
                    >
                        {avatarUrl ? (
                            <Image
                                source={{ uri: avatarUrl }}
                                style={styles.avatarImage}
                                resizeMode="cover"
                            />
                        ) : (
                            <Ionicons
                                name="person"
                                size={22}
                                color={activeColors.mutedForeground}
                            />
                        )}
                    </View>
                </TouchableOpacity>
            );
        }
    };

    return (
        <View className="flex-row items-center justify-between px-4 py-3 w-full">
            {/* Left: MyGlo Logo Icon OR Hamburger Menu Toggle on Desktop */}
            <View className="flex-row items-center mr-3">
                {showMenuButton ? (
                    <TouchableOpacity
                        onPress={onMenuPress}
                        activeOpacity={0.7}
                        accessibilityLabel="Toggle navigation sidebar"
                    >
                        <View
                            style={{ backgroundColor: activeColors.primary }}
                            className="w-12 h-12 rounded-full items-center justify-center shadow-sm"
                        >
                            <Ionicons
                                name={isSidebarOpen ? "close" : "menu"}
                                size={22}
                                color={activeColors.primaryForeground}
                            />
                        </View>
                    </TouchableOpacity>
                ) : (
                    <View
                        className="pl-2 w-12 h-12 rounded-full items-center justify-center"
                    >
                        <MyGloLogo type="icon" color={customDarkMode ? 'dark' : 'light'} size="md" align="center" />
                    </View>
                )}
            </View>

            {/* Center: Search Bar */}
            <View
                style={{
                    backgroundColor: activeColors.muted,
                    borderColor: activeColors.border,
                }}
                className="flex-1 flex-row items-center rounded-full h-12 px-3.5 border border-solid mr-3"
            >
                <Ionicons
                    name="search-outline"
                    size={18}
                    color={activeColors.mutedForeground}
                    style={{ marginRight: 8 }}
                />
                <TextInput
                    value={searchQuery}
                    onChangeText={onSearchChange}
                    placeholder="Search wishlists..."
                    placeholderTextColor={activeColors.mutedForeground}
                    style={[
                        styles.searchInput,
                        { color: activeColors.foreground },
                    ]}
                />
                {Boolean(searchQuery) && (
                    <TouchableOpacity onPress={() => onSearchChange?.('')} activeOpacity={0.7}>
                        <Ionicons
                            name="close-circle"
                            size={20}
                            color={activeColors.mutedForeground}
                        />
                    </TouchableOpacity>
                )}
            </View>

            {/* Right Action: Friend+ Icon, Incoming Cloud Icon, OR User Avatar */}
            {renderRightAction()}
        </View>
    );
};

const styles = StyleSheet.create({
    searchInput: {
        flex: 1,
        fontFamily: 'Nunito-Regular',
        fontSize: 14,
        paddingVertical: 0,
        outlineStyle: 'none',
        outlineWidth: 0,
    } as any,
    avatarImage: {
        width: '100%',
        height: '100%',
        borderRadius: 9999,
    },
});

export default TopNavBar;
