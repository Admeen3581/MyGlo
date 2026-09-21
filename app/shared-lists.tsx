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
import { useRouter, Redirect } from 'expo-router';
import { useAuth, useUser } from '@clerk/expo';
import { useQuery } from 'convex/react';
import { api } from '@/database/_generated/api';
import { useTheme } from '@/hooks/useTheme';
import { ScreenWrapper } from '@/components/wrapper/ScreenWrapper';
import { TopNavBar } from '@/components/navigation/TopNavBar';
import { Sidebar } from '@/components/navigation/Sidebar';
import { WishlistCard } from '@/components/wishlist/WishlistCard';
import { Ionicons } from '@expo/vector-icons';
import FloatingActionButton from "@/components/core/FloatingActionButton";

export default function SharedListsScreen() {
    const router = useRouter();
    const { isLoaded, isSignedIn } = useAuth();
    const { user } = useUser();
    const { isDarkMode, activeColors } = useTheme();
    const { width } = useWindowDimensions();

    const isDesktop = width >= 768;

    // Navigation, search, and fold-out sidebar states
    const [searchQuery, setSearchQuery] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(isDesktop);

    // Fetch wishlists shared with logged-in user (from users.sharedLists)
    const sharedWishlistsRaw = useQuery(
        api.wishlists.getSharedWishlists,
        user?.id ? { clerkId: user.id } : 'skip'
    );

    // Filter shared wishlists based on search query
    const wishlists = sharedWishlistsRaw?.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase().trim())
    );

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

    const avatarUrl = user?.imageUrl || (user?.unsafeMetadata?.avatar_url as string) || null;

    const handleAvatarPress = () => {
        router.push('/profile' as any);
    };

    const handleFabPress = () => {
        //TODO: Action for creating items/lists (screens not implemented yet)
        console.log('[MyWishlists] Create list/item FAB pressed');
    };

    return (
        <SafeAreaView
            style={[
                styles.safeArea,
                { backgroundColor: activeColors.background },
            ]}
        >
            <ScreenWrapper variant="default" className="flex-1">
                {/* Top Navigation Bar */}
                <TopNavBar
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    avatarUrl={avatarUrl}
                    onAvatarPress={handleAvatarPress}
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
                            activeTab="shared-lists"
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
                                WISHLISTS SHARED WITH YOU
                            </Text>
                            <Text
                                style={{ color: activeColors.foreground }}
                                className="text-3xl font-fraunces-bold"
                            >
                                Shared with Me
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
                            {sharedWishlistsRaw === undefined ? (
                                /* Loading State */
                                <View className="flex-1 items-center justify-center py-20">
                                    <ActivityIndicator size="large" color={activeColors.primary} />
                                    <Text
                                        style={{ color: activeColors.mutedForeground }}
                                        className="mt-3 text-sm font-nunito-semibold"
                                    >
                                        Loading shared wishlists...
                                    </Text>
                                </View>
                            ) : wishlists && wishlists.length > 0 ? (
                                /* Shared Wishlists Cards List */
                                <View className="px-5 pt-2">
                                    {wishlists.map((item) => (
                                        <WishlistCard
                                            key={item._id}
                                            wishlist={item}
                                            isDarkMode={isDarkMode}
                                            onPress={() => {
                                                // Navigate to wishlist detail when implemented
                                            }}
                                        />
                                    ))}
                                </View>
                            ) : (
                                /* Empty State */
                                <View className="flex-1 items-center justify-center py-16 px-6">
                                    <View
                                        style={{ backgroundColor: activeColors.muted }}
                                        className="w-16 h-16 rounded-full items-center justify-center mb-4"
                                    >
                                        <Ionicons
                                            name="gift-outline"
                                            size={32}
                                            color={activeColors.primary}
                                        />
                                    </View>
                                    <Text
                                        style={{ color: activeColors.foreground }}
                                        className="text-lg font-fraunces-bold text-center mb-1"
                                    >
                                        {searchQuery ? 'No matching wishlists' : 'No Shared Wishlists Yet'}
                                    </Text>
                                    <Text
                                        style={{ color: activeColors.mutedForeground }}
                                        className="text-center text-sm font-nunito max-w-70"
                                    >
                                        {searchQuery
                                            ? `No shared wishlist found matching "${searchQuery}".`
                                            : 'When family and friends share their wishlists with you, they will appear here!'}
                                    </Text>
                                </View>
                            )}
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
        paddingBottom: 5,
    },
});
