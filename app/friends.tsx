import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
    StyleSheet,
    useWindowDimensions,
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
import { Ionicons } from '@expo/vector-icons';
import { FloatingActionButton } from "@/components/core/FloatingActionButton";
import { FriendCard } from '@/components/friends/FriendCard';
import { IncomingFriendRequestsModal } from '@/components/friends/IncomingFriendRequestsModal';
import { AddFriendModal } from '@/components/friends/AddFriendModal';
import { FriendOptionsMenuModal, FriendUser } from '@/components/friends/FriendOptionsMenuModal';

export default function FriendsScreen() {
    const { isLoaded, isSignedIn } = useAuth();
    const { user } = useUser();
    const { isDarkMode, activeColors } = useTheme();
    const { width } = useWindowDimensions();

    const isDesktop = width >= 768;

    // Navigation, search, and fold-out sidebar states
    const [searchQuery, setSearchQuery] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Modal visibility states
    const [isAddFriendModalOpen, setIsAddFriendModalOpen] = useState(false);
    const [isIncomingModalOpen, setIsIncomingModalOpen] = useState(false);
    const [selectedFriendForMenu, setSelectedFriendForMenu] = useState<FriendUser | null>(null);

    // Sync current logged-in Clerk user with Convex database
    const createUserMutation = useMutation(api.users.createUser);

    const userFirstName = user?.firstName;
    const userLastName = user?.lastName;
    const userFullName = user?.fullName;
    const userEmail = user?.primaryEmailAddress?.emailAddress;
    const userImageUrl = user?.imageUrl;

    useEffect(() => {
        if (user?.id) {
            createUserMutation({
                clerkId: user.id,
                firstName: userFirstName ?? undefined,
                lastName: userLastName ?? undefined,
                name: userFullName ?? undefined,
                email: userEmail ?? undefined,
                avatarUrl: userImageUrl ?? undefined,
            }).catch((err) => console.error('[FriendsScreen] User sync error:', err));
        }
    }, [user?.id, userFirstName, userLastName, userFullName, userEmail, userImageUrl, createUserMutation]);

    // Convex queries for friends and pending requests
    const friends = useQuery(
        api.friends.getFriends,
        user?.id ? { clerkId: user.id } : 'skip'
    );

    const pendingRequests = useQuery(
        api.friends.getPendingFriendRequests,
        user?.id ? { clerkId: user.id } : 'skip'
    );

    const pendingCount = pendingRequests?.length ?? 0;

    const handleAddFriendPress = () => {
        setIsAddFriendModalOpen(true);
    };

    const handleIncomingFriendPress = () => {
        setIsIncomingModalOpen(true);
    }

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

    // Filter friends list by top search bar query
    const filteredFriends = friends?.filter((f) => {
        const q = searchQuery.toLowerCase().trim();
        if (!q) return true;
        const nameMatch =
            f.name?.toLowerCase().includes(q) ||
            f.firstName?.toLowerCase().includes(q) ||
            f.lastName?.toLowerCase().includes(q);
        const emailMatch = f.email?.toLowerCase().includes(q);
        return nameMatch || emailMatch;
    });

    return (
        <SafeAreaView
            style={[
                styles.safeArea,
                { backgroundColor: activeColors.background },
            ]}
        >
            <ScreenWrapper variant="default" className="flex-1">
                {/* Top Navigation Bar with Search & Incoming Friend Requests / Add Friend Icon */}
                <TopNavBar
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    searchPlaceholder="Search friends..."
                    rightAction={pendingCount > 0 ? "incoming-cloud" : "add-friend"}
                    incomingCount={pendingCount}
                    onIncomingPress={() => setIsIncomingModalOpen(true)}
                    onAddFriendPress={handleIncomingFriendPress}
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
                        <View className="px-5 pt-3 pb-2 flex-row items-center justify-between">
                            <View>
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
                        </View>

                        {/* Content ScrollView */}
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={[
                                styles.scrollContent,
                                isDesktop && styles.desktopScrollContent,
                            ]}
                        >
                            <View className="px-5 pt-2">
                                {friends === undefined ? (
                                    <View className="py-16 items-center justify-center">
                                        <ActivityIndicator size="large" color={activeColors.primary} />
                                    </View>
                                ) : friends.length === 0 ? (
                                    /* Empty State: No Friends Added Yet */
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
                                            className="text-center text-sm font-nunito max-w-70 mb-6"
                                        >
                                            Add family and friends to view their wishlists and coordinate gifts!
                                        </Text>
                                        <TouchableOpacity
                                            onPress={handleAddFriendPress}
                                            activeOpacity={0.8}
                                            style={{ backgroundColor: activeColors.primary }}
                                            className="flex-row items-center px-5 py-2.5 rounded-full shadow-sm"
                                        >
                                            <Ionicons name="person-add" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                                            <Text className="text-sm font-nunito-bold text-white">
                                                Add Your First Friend
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                ) : filteredFriends && filteredFriends.length === 0 ? (
                                    /* Empty State: Search Results Filtered to 0 */
                                    <View className="py-16 items-center justify-center px-4">
                                        <Ionicons
                                            name="search-outline"
                                            size={36}
                                            color={activeColors.mutedForeground}
                                        />
                                        <Text
                                            style={{ color: activeColors.foreground }}
                                            className="text-base font-fraunces-bold mt-3 text-center"
                                        >
                                            No Friends Found
                                        </Text>
                                        <Text
                                            style={{ color: activeColors.mutedForeground }}
                                            className="text-sm font-nunito mt-1 text-center"
                                        >
                                            No friends matching &quot;{searchQuery}&quot;
                                        </Text>
                                    </View>
                                ) : (
                                    /* Friend Tiles List */
                                    filteredFriends?.map((friend) => (
                                        <FriendCard
                                            key={friend._id}
                                            friend={friend}
                                            isDarkMode={isDarkMode}
                                            onPressControls={() => setSelectedFriendForMenu(friend)}
                                        />
                                    ))
                                )}
                            </View>
                        </ScrollView>

                        {/* Floating Plus Button at bottom right for inviting friends */}
                        <FloatingActionButton
                            onPress={handleAddFriendPress}
                            isDarkMode={isDarkMode}
                        />
                    </View>
                </View>

                {/* Modals */}
                <AddFriendModal
                    isVisible={isAddFriendModalOpen}
                    onClose={() => setIsAddFriendModalOpen(false)}
                    isDarkMode={isDarkMode}
                />

                <IncomingFriendRequestsModal
                    isVisible={isIncomingModalOpen}
                    onClose={() => setIsIncomingModalOpen(false)}
                    pendingRequests={pendingRequests}
                    isDarkMode={isDarkMode}
                />

                <FriendOptionsMenuModal
                    isVisible={selectedFriendForMenu !== null}
                    onClose={() => setSelectedFriendForMenu(null)}
                    friend={selectedFriendForMenu}
                    isDarkMode={isDarkMode}
                />
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
