import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    useWindowDimensions,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from 'convex/react';
import { api } from '@/database/_generated/api';
import { useTheme } from '@/hooks/useTheme';
import { ScreenWrapper } from '@/components/wrapper/ScreenWrapper';
import { Badge } from '@/components/core/Badge';
import { Button } from '@/components/core/Button';
import { ItemCard, WishlistItem } from '@/components/wishlist/ItemCard';
import { WishlistShareModal } from '@/components/wishlist/WishlistShareModal';
import { CreateNewItem } from '@/components/wishlist/CreateNewItem';

export default function MyGiftViewerScreen() {
    const router = useRouter();
    const { isDarkMode, activeColors } = useTheme();
    const { width } = useWindowDimensions();
    const isDesktop = width >= 768;

    // Route parameters (ID of the wishlist to display)
    const params = useLocalSearchParams<{ id?: string; wishlistId?: string }>();
    const wishlistId = (params.id || params.wishlistId) as any;

    // Local state for search query, share modal, and create item modal
    const [searchQuery, setSearchQuery] = useState('');
    const [isShareModalVisible, setIsShareModalVisible] = useState(false);
    const [isCreateItemVisible, setIsCreateItemVisible] = useState(false);

    // Fetch target wishlist from Convex
    const wishlist = useQuery(
        api.wishlists.getWishlist,
        wishlistId ? { wishlistId } : 'skip'
    );

    const isArchived = Boolean(wishlist?.isArchived);
    const rawItems: WishlistItem[] = (wishlist?.items as WishlistItem[]) || [];

    // Filter items according to search query
    const filteredItems = rawItems.filter((item) => {
        const q = searchQuery.toLowerCase().trim();
        if (!q) return true;
        const titleMatch = item.title?.toLowerCase().includes(q);
        const notesMatch = item.notes?.toLowerCase().includes(q);
        return titleMatch || notesMatch;
    });

    const itemCount = rawItems.length;

    const handleBack = () => {
        if (Platform.OS === 'web' && typeof window !== 'undefined') {
            window.history.back();
        } else if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/my-wishlists');
        }
    };

    const handleAddGiftPress = () => {
        if (isArchived) return;
        setIsCreateItemVisible(true);
    };

    return (
        <SafeAreaView
            style={[
                styles.safeArea,
                { backgroundColor: activeColors.background },
            ]}
        >
            <ScreenWrapper variant="default" className="flex-1">
                {/* Navigation Bar at Top -- DIFFERENT THAN COMPONENT*/}
                <View className="flex-row items-center justify-between px-5 py-3 w-full">
                    {/* Left: Back Arrow */}
                    <TouchableOpacity
                        onPress={handleBack}
                        activeOpacity={0.7}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        style={{
                            backgroundColor: activeColors.muted,
                            borderColor: activeColors.border,
                        }}
                        className="w-12 h-12 rounded-full border items-center justify-center shadow-sm"
                    >
                        <Ionicons
                            name="arrow-back"
                            size={24}
                            color={activeColors.foreground}
                        />
                    </TouchableOpacity>

                    {/* Center: Surprise Protection Active Banner / Badge */}
                    <View
                        style={{
                            backgroundColor: isDarkMode ? 'rgba(32, 164, 181, 0.15)' : 'rgba(0, 95, 115, 0.10)',
                            borderColor: isDarkMode ? 'rgba(32, 164, 181, 0.30)' : 'rgba(0, 95, 115, 0.20)',
                        }}
                        className="flex-row items-center px-4 py-3 rounded-full border"
                    >
                        <Ionicons
                            name="sparkles"
                            size={18}
                            color={activeColors.primary}
                            style={{ marginRight: 6 }}
                        />
                        <Text
                            style={{ color: activeColors.primary }}
                            className="text-sm font-nunito-bold"
                        >
                            Surprise Protection Active
                        </Text>
                    </View>

                    {/* Right: Share Icon */}
                    <TouchableOpacity
                        onPress={() => setIsShareModalVisible(true)}
                        activeOpacity={0.7}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        style={{
                            backgroundColor: activeColors.muted,
                            borderColor: activeColors.border,
                        }}
                        className="w-12 h-12 rounded-full border items-center justify-center shadow-sm"
                    >
                        <Ionicons
                            name="share-social-outline"
                            size={24}
                            color={activeColors.foreground}
                        />
                    </TouchableOpacity>
                </View>

                {/* Title, Sub-text, and Item Count */}
                <View className="px-5 pt-3 pb-2">
                    <View className="flex-row items-center justify-between mb-1">
                        <Text
                            style={{ color: activeColors.foreground }}
                            className="text-3xl font-fraunces-bold flex-1 mr-3"
                            numberOfLines={2}
                        >
                            {wishlist?.title || 'Wishlist Details'}
                        </Text>

                        <View className="flex-row items-center gap-1.5">
                            {isArchived && (
                                <Badge
                                    label="Archived"
                                    variant="warning"
                                    size="md"
                                    isDarkMode={isDarkMode}
                                />
                            )}
                            <Badge
                                label={`${itemCount} ${itemCount === 1 ? 'Item' : 'Items'}`}
                                variant="primary"
                                size="md"
                                isDarkMode={isDarkMode}
                            />
                        </View>
                    </View>

                    <Text
                        style={{ color: activeColors.mutedForeground }}
                        className="text-sm font-nunito"
                        numberOfLines={2}
                    >
                        {wishlist?.description || 'All the gifts and ideas saved for this wishlist.'}
                    </Text>
                </View>

                {/* Search Bar & Sort Button Row */}
                <View className="px-5 py-3 flex-row items-center">
                    {/* Search Bar */}
                    <View
                        style={{
                            backgroundColor: activeColors.muted,
                            borderColor: activeColors.border,
                        }}
                        className="flex-1 flex-row items-center rounded-full h-12 px-4 border border-solid mr-3"
                    >
                        <Ionicons
                            name="search-outline"
                            size={20}
                            color={activeColors.mutedForeground}
                            style={{ marginRight: 8 }}
                        />
                        <TextInput
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholder="Search gifts in this list..."
                            placeholderTextColor={activeColors.mutedForeground}
                            style={[
                                styles.searchInput,
                                { color: activeColors.foreground },
                            ]}
                            className="ml-2"
                        />
                        {Boolean(searchQuery) && (
                            <TouchableOpacity
                                onPress={() => setSearchQuery('')}
                                activeOpacity={0.7}
                                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                            >
                                <Ionicons
                                    name="close-circle"
                                    size={18}
                                    color={activeColors.mutedForeground}
                                />
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Sort Button (Not implemented yet - placeholder only) */}
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {
                            // TODO: Implement sort button modal / menu when sorting options are defined
                            console.log('[MyGiftViewer] Sort button clicked (TODO)');
                        }}
                        style={{
                            backgroundColor: activeColors.muted,
                            borderColor: activeColors.border,
                        }}
                        className="w-12 h-12 rounded-full border items-center justify-center shadow-sm"
                    >
                        <Ionicons
                            name="swap-vertical"
                            size={20}
                            color={activeColors.foreground}
                        />
                    </TouchableOpacity>
                </View>

                {/* Main Chunk: ScrollView containing ItemCard List */}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={[
                        styles.scrollContent,
                        isDesktop && styles.desktopScrollContent,
                    ]}
                >
                    {wishlist === undefined && wishlistId ? (
                        /* Loading State */
                        <View className="flex-1 items-center justify-center py-20">
                            <ActivityIndicator size="large" color={activeColors.primary} />
                            <Text
                                style={{ color: activeColors.mutedForeground }}
                                className="mt-3 text-sm font-nunito-semibold"
                            >
                                Loading gifts...
                            </Text>
                        </View>
                    ) : filteredItems.length > 0 ? (
                        /* Items List: 1 column rows on mobile, 4 items side-by-side on desktop */
                        <View className="px-4 flex-row flex-wrap -mx-1.5">
                            {filteredItems.map((item) => (
                                <View
                                    key={item.id}
                                    className="w-full md:w-1/4 p-1.5"
                                >
                                    <ItemCard
                                        item={item}
                                        isDarkMode={isDarkMode}
                                        onPress={() => {
                                            // TODO: Handle item click / open item details modal when implemented
                                            console.log('[MyGiftViewer] Item selected:', item.id, item.title);
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
                                {searchQuery ? 'No matching gifts found' : 'No Gifts in this List Yet'}
                            </Text>
                            <Text
                                style={{ color: activeColors.mutedForeground }}
                                className="text-center text-sm font-nunito max-w-70"
                            >
                                {searchQuery
                                    ? `No items match "${searchQuery}". Try another search term.`
                                    : 'Tap the "Add a Gift" button below to start adding gifts to this wishlist!'}
                            </Text>
                        </View>
                    )}
                </ScrollView>

                {/* Bottom Screen-Width Button / Archived Notice */}
                {!isArchived ? (
                    <View
                        style={{
                            backgroundColor: activeColors.background,
                            borderTopColor: activeColors.border,
                        }}
                        className="px-5 pt-3 pb-6 border-t"
                    >
                        <Button
                            title="Add a Gift"
                            icon={
                                <Ionicons
                                    name="add"
                                    size={22}
                                    color={activeColors.primaryForeground}
                                />
                            }
                            variant="primary"
                            size="lg"
                            isDarkMode={isDarkMode}
                            onPress={handleAddGiftPress}
                        />
                    </View>
                ) : (
                    <View
                        style={{
                            backgroundColor: activeColors.background,
                            borderTopColor: activeColors.border,
                        }}
                        className="px-5 py-4 border-t flex-row items-center justify-center"
                    >
                        <Ionicons
                            name="lock-closed-outline"
                            size={18}
                            color={activeColors.mutedForeground}
                            style={{ marginRight: 6 }}
                        />
                        <Text
                            style={{ color: activeColors.mutedForeground }}
                            className="text-sm font-nunito-semibold"
                        >
                            This wishlist is archived (read-only)
                        </Text>
                    </View>
                )}

                {/* Create New Item Modal */}
                {Boolean(wishlistId) && !isArchived && (
                    <CreateNewItem
                        isVisible={isCreateItemVisible}
                        onClose={() => setIsCreateItemVisible(false)}
                        wishlistId={wishlistId}
                        isDarkMode={isDarkMode}
                    />
                )}

                {/* Wishlist Share Modal */}
                {Boolean(wishlistId) && (
                    <WishlistShareModal
                        isVisible={isShareModalVisible}
                        onClose={() => setIsShareModalVisible(false)}
                        wishlistId={wishlistId}
                        isDarkMode={isDarkMode}
                    />
                )}
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
        paddingBottom: 24,
    },
    desktopScrollContent: {
        paddingBottom: 16,
    },
    searchInput: {
        flex: 1,
        fontFamily: 'Nunito-Regular',
        fontSize: 14,
        paddingVertical: 0,
        outlineStyle: 'none',
        outlineWidth: 0,
    } as any,
});
