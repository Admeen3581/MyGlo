import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    ActivityIndicator,
    StyleSheet,
    useWindowDimensions,
    Modal,
    Pressable,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Redirect } from 'expo-router';
import { useAuth, useUser } from '@clerk/expo';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/database/_generated/api';
import { useTheme } from '@/hooks/useTheme';
import { ScreenWrapper } from '@/components/wrapper/ScreenWrapper';
import { TopNavBar } from '@/components/navigation/TopNavBar';
import { Sidebar } from '@/components/navigation/Sidebar';
import { WishlistCard } from '@/components/wishlist/WishlistCard';
import { Ionicons } from '@expo/vector-icons';
import { FloatingActionButton } from "@/components/core/FloatingActionButton";

export default function SharedListsScreen() {
    const { isLoaded, isSignedIn } = useAuth();
    const { user } = useUser();
    const { isDarkMode, activeColors } = useTheme();
    const { width } = useWindowDimensions();

    const isDesktop = width >= 768;

    // Navigation, search, sidebar, and incoming invitations modal states
    const [searchQuery, setSearchQuery] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(isDesktop);
    const [isIncomingModalOpen, setIsIncomingModalOpen] = useState(false);

    // Fetch wishlists shared with logged-in user (from users.sharedLists)
    const sharedWishlistsRaw = useQuery(
        api.wishlists.getSharedWishlists,
        user?.id ? { clerkId: user.id } : 'skip'
    );

    // Fetch pending wishlist invitations for this user
    const pendingWishlistsRaw = useQuery(
        api.wishlists.getPendingSharedLists,
        user?.id ? { clerkId: user.id } : 'skip'
    );

    // Mutations to accept or ignore shared list invitations in Convex
    const acceptSharedListMutation = useMutation(api.users.acceptSharedList);
    const ignoreSharedListMutation = useMutation(api.users.ignoreSharedList);

    const pendingLists = pendingWishlistsRaw ?? [];

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
                {/* Top Navigation Bar with Incoming Cloud Icon */}
                <TopNavBar
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    rightAction="incoming-cloud"
                    incomingCount={pendingLists.length}
                    onIncomingPress={() => setIsIncomingModalOpen(true)}
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
                                /* Shared Wishlists Cards Grid */
                                <View className="px-5 pt-2 flex-row flex-wrap -mx-2">
                                    {wishlists.map((item) => (
                                        <View key={item._id} className="w-1/2 md:w-1/3 lg:w-1/4 px-2">
                                            <WishlistCard
                                                wishlist={item}
                                                isDarkMode={isDarkMode}
                                                isShared={true}
                                                onPress={() => {
                                                    //TODO: Navigate to wishlist detail when implemented
                                                }}
                                            />
                                        </View>
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

                {/* Incoming List Invitations Modal */}
                <Modal
                    visible={isIncomingModalOpen}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setIsIncomingModalOpen(false)}
                >
                    <Pressable
                        style={styles.modalOverlay}
                        onPress={() => setIsIncomingModalOpen(false)}
                    >
                        <Pressable
                            style={[
                                styles.modalContent,
                                {
                                    backgroundColor: isDarkMode ? '#16222A' : '#FFFFFF',
                                    borderColor: activeColors.border,
                                },
                            ]}
                            onPress={(e) => e.stopPropagation()}
                            className="w-80 md:w-96 rounded-3xl p-5 border shadow-xl max-h-[80%]"
                        >
                            {/* Modal Header */}
                            <View className="flex-row items-center justify-between pb-3 mb-3 border-b border-gray-200 dark:border-gray-700">
                                <View className="flex-row items-center">
                                    <Ionicons name="cloud-download-outline" size={22} color={activeColors.primary} />
                                    <Text style={{ color: activeColors.foreground }} className="text-lg font-fraunces-bold ml-2">
                                        Incoming Lists
                                    </Text>
                                </View>
                                <TouchableOpacity onPress={() => setIsIncomingModalOpen(false)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                                    <Ionicons name="close" size={20} color={activeColors.mutedForeground} />
                                </TouchableOpacity>
                            </View>

                            {/* Modal Content / Invites List */}
                            <ScrollView className="max-h-96" showsVerticalScrollIndicator={false}>
                                {pendingLists.length === 0 ? (
                                    <View className="items-center justify-center py-8 px-2">
                                        <Ionicons name="checkmark-circle-outline" size={36} color={activeColors.mutedForeground} />
                                        <Text style={{ color: activeColors.mutedForeground }} className="text-sm font-nunito mt-2 text-center">
                                            No new list invitations at this time.
                                        </Text>
                                    </View>
                                ) : (
                                    pendingLists.map((item) => (
                                        <View
                                            key={item._id}
                                            style={{ backgroundColor: isDarkMode ? '#24343E' : '#F7F7F6', borderColor: activeColors.border }}
                                            className="p-4 rounded-2xl mb-3 border"
                                        >
                                            <Text style={{ color: activeColors.foreground }} className="text-base font-fraunces-bold mb-1">
                                                {item.title}
                                            </Text>
                                            <Text style={{ color: activeColors.mutedForeground }} className="text-xs font-nunito mb-3">
                                                Shared by {item.ownerName} ({item.itemCount} {item.itemCount === 1 ? 'Item' : 'Items'})
                                            </Text>

                                            <View className="flex-row items-center justify-end gap-2">
                                                {/* Ignore Button: remove from pendingSharedLists in DB */}
                                                <TouchableOpacity
                                                    onPress={async () => {
                                                        if (!user?.id) return;
                                                        try {
                                                            await ignoreSharedListMutation({
                                                                clerkId: user.id,
                                                                wishlistId: item._id as any,
                                                            });
                                                        } catch (err) {
                                                            console.error('[SharedLists] Failed to ignore wishlist:', err);
                                                        }
                                                    }}
                                                    style={{ backgroundColor: isDarkMode ? '#334155' : '#E2E8F0' }}
                                                    className="px-3.5 py-1.5 rounded-full"
                                                >
                                                    <Text style={{ color: activeColors.mutedForeground }} className="text-xs font-nunito-bold">
                                                        Ignore
                                                    </Text>
                                                </TouchableOpacity>

                                                {/* Accept Button: move from pending to sharedLists in DB */}
                                                <TouchableOpacity
                                                    onPress={async () => {
                                                        if (!user?.id) return;
                                                        try {
                                                            await acceptSharedListMutation({
                                                                clerkId: user.id,
                                                                wishlistId: item._id as any,
                                                            });
                                                        } catch (err) {
                                                            console.error('[SharedLists] Failed to accept wishlist:', err);
                                                        }
                                                    }}
                                                    style={{ backgroundColor: activeColors.primary }}
                                                    className="px-4 py-1.5 rounded-full"
                                                >
                                                    <Text className="text-xs font-nunito-bold text-white">
                                                        Accept
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    ))
                                )}
                            </ScrollView>
                        </Pressable>
                    </Pressable>
                </Modal>
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
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        elevation: 10,
    },
});
