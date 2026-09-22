import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    ActivityIndicator,
    StyleSheet,
    useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Redirect } from 'expo-router';
import { useAuth } from '@clerk/expo';
import { useTheme } from '@/hooks/useTheme';
import { ScreenWrapper } from '@/components/wrapper/ScreenWrapper';
import { TopNavBar } from '@/components/navigation/TopNavBar';
import { Sidebar } from '@/components/navigation/Sidebar';
import { Ionicons } from '@expo/vector-icons';
import FloatingActionButton from "@/components/core/FloatingActionButton";

export default function FriendsScreen() {
    const { isLoaded, isSignedIn } = useAuth();
    const { isDarkMode, activeColors } = useTheme();
    const { width } = useWindowDimensions();

    const isDesktop = width >= 768;

    // Navigation, search, and fold-out sidebar states
    const [searchQuery, setSearchQuery] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const handleFabPress = () => {
        //TODO: Action for creating items/lists (screens not implemented yet)
        console.log('[MyWishlists] Create list/item FAB pressed');
    };

    const handleAddFriendPress = () => {
        //TODO: Action for adding friends / opening add friend modal
        console.log('[Friends] Add friend pressed');
    };

    if (!isLoaded) {
        return (
            <View
                style={{ backgroundColor: activeColors.background }}
                className="flex-1 items-center justify-center"
            >
                <ActivityIndicator size="large" color={activeColors.primary} />
            </View>
        );
    }

    if (!isSignedIn) {
        return <Redirect href="/onboarding" />;
    }

    return (
        <SafeAreaView
            style={[
                styles.safeArea,
                { backgroundColor: activeColors.background },
            ]}
        >
            <ScreenWrapper variant="default" className="flex-1">
                {/* Top Navigation Bar with Friend+ Icon */}
                <TopNavBar
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    rightAction="add-friend"
                    onAddFriendPress={handleAddFriendPress}
                    isDarkMode={isDarkMode}
                    showMenuButton={isDesktop}
                    isSidebarOpen={isSidebarOpen}
                    onMenuPress={() => setIsSidebarOpen((prev) => !prev)}
                />

                {/* Main Content Layout Container */}
                <View className="flex-1 flex-row relative overflow-hidden">
                    {/* Desktop Fold-out Sidebar */}
                    {isDesktop && (
                        <Sidebar
                            activeTab="friends"
                            isOpen={isSidebarOpen}
                        />
                    )}

                    {/* Main Content Column */}
                    <View className="flex-1 h-full relative">
                        {/* Titling Text Area */}
                        <View className="px-5 pt-3 pb-2">
                            <Text
                                style={{ color: activeColors.mutedForeground }}
                                className="text-xs font-quicksand-bold uppercase tracking-widest mb-1"
                            >
                                CONNECT & SHARE GIFTS
                            </Text>
                            <Text
                                style={{ color: activeColors.foreground }}
                                className="text-3xl font-fraunces-bold"
                            >
                                Friends
                            </Text>
                        </View>

                        {/* Content ScrollView */}
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={[
                                styles.scrollContent,
                                isDesktop && styles.desktopScrollContent,
                            ]}
                        >
                            {/* Empty State / Placeholder */}
                            <View className="flex-1 items-center justify-center py-16 px-6">
                                <View
                                    style={{ backgroundColor: activeColors.muted }}
                                    className="w-16 h-16 rounded-full items-center justify-center mb-4"
                                >
                                    <Ionicons
                                        name="people-outline"
                                        size={32}
                                        color={activeColors.primary}
                                    />
                                </View>
                                <Text
                                    style={{ color: activeColors.foreground }}
                                    className="text-lg font-fraunces-bold text-center mb-1"
                                >
                                    No Friends Added Yet
                                </Text>
                                <Text
                                    style={{ color: activeColors.mutedForeground }}
                                    className="text-center text-sm font-nunito max-w-70"
                                >
                                    Add family and friends to view their wishlists and coordinate gifts!
                                </Text>
                            </View>
                        </ScrollView>

                        <FloatingActionButton
                            onPress={handleFabPress}
                            isDarkMode={isDarkMode}
                        />
                    </View>
                </View>
            </ScreenWrapper>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 110,
    },
    desktopScrollContent: {
        paddingBottom: 40,
    },
});
