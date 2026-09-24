import React, { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Redirect, useRouter } from 'expo-router';
import { useAuth, useUser } from '@clerk/expo';
import { useQuery } from 'convex/react';
import { api } from '@/database/_generated/api';
import { useTheme } from '@/hooks/useTheme';
import { ScreenWrapper } from '@/components/wrapper/ScreenWrapper';
import { TopNavBar } from '@/components/navigation/TopNavBar';
import { Sidebar } from '@/components/navigation/Sidebar';
import { WishlistCard } from '@/components/wishlist/WishlistCard';
import { FloatingActionButton } from '@/components/core/FloatingActionButton';
import { FabHoldMenuModal } from '@/components/wishlist/FabHoldMenuModal';
import { CreateNewWishlist } from '@/components/wishlist/CreateNewWishlist';
import { Ionicons } from '@expo/vector-icons';

export default function MyWishlistsScreen() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const { isDarkMode, activeColors } = useTheme();
  const { width } = useWindowDimensions();

  const isDesktop = width >= 768;

  // Navigation, search, fold-out sidebar, FAB hold popup, and modal states
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(isDesktop);
  const [isFabHoldMenuOpen, setIsFabHoldMenuOpen] = useState(false);
  const [isCreateWishlistOpen, setIsCreateWishlistOpen] = useState(false);

  // Fetch only wishlists owned/created by the logged-in user via Convex
  const rawWishlists = useQuery(
    api.wishlists.getMyWishlists,
    user?.id ? { clerkId: user.id } : 'skip'
  );

  // Filter user's owned wishlists based on search query
  const wishlists = rawWishlists?.filter((item) =>
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
  const firstName = user?.firstName || 'Back';

  const handleAvatarPress = () => {
    router.push('/profile' as any);
  };

  const handleCreateNewList = () => {
    setIsCreateWishlistOpen(true);
  };

  const handleCreateNewItem = () => {
    // TODO: Navigate to create item screen or open create item modal when implemented
    console.log('[MyWishlists] Create New Item selected');
  };

  // Standalone clicking the "+" icon functions the same as 'New List'
  const handleFabPress = () => {
    handleCreateNewList();
  };

  // Pressing and holding the "+" icon opens the hold popup menu
  const handleFabLongPress = () => {
    setIsFabHoldMenuOpen(true);
  };

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: activeColors.background },
      ]}
    >
      <ScreenWrapper variant="default" className="flex-1">
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

        <View className="flex-1 flex-row relative overflow-hidden">
          {isDesktop && (
            <Sidebar
              activeTab="my-wishlists"
              isOpen={isSidebarOpen}
            />
          )}

          <View className="flex-1 h-full relative">
            <View className="px-5 pt-3 pb-2">
              <Text
                style={{ color: activeColors.mutedForeground }}
                className="text-xs font-quicksand-bold uppercase tracking-widest mb-1"
              >
                WELCOME BACK, {firstName.toUpperCase()}
              </Text>
              <Text
                style={{ color: activeColors.foreground }}
                className="text-3xl font-fraunces-bold"
              >
                My Wishlists
              </Text>
            </View>

            {/* Wishlist Cards ScrollView */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={[
                styles.scrollContent,
                isDesktop && styles.desktopScrollContent,
              ]}
            >
              {rawWishlists === undefined ? (
                /* Loading State */
                <View className="flex-1 items-center justify-center py-20">
                  <ActivityIndicator size="large" color={activeColors.primary} />
                  <Text
                    style={{ color: activeColors.mutedForeground }}
                    className="mt-3 text-sm font-nunito-semibold"
                  >
                    Loading wishlists...
                  </Text>
                </View>
              ) : wishlists && wishlists.length > 0 ? (
                /* Wishlist Cards Grid */
                <View className="px-5 pt-2 flex-row flex-wrap -mx-2">
                  {wishlists.map((item) => (
                    <View key={item._id} className="w-1/2 md:w-1/3 lg:w-1/4 px-2">
                      <WishlistCard
                        wishlist={item}
                        isDarkMode={isDarkMode}
                        onPress={() => {
                          router.push({
                            pathname: '/wishlist/my-gift-viewer' as any,
                            params: { id: item._id },
                          });
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
                    {searchQuery ? 'No matching wishlists' : 'No Wishlists Yet'}
                  </Text>
                  <Text
                    style={{ color: activeColors.mutedForeground }}
                    className="text-center text-sm font-nunito max-w-70"
                  >
                    {searchQuery
                      ? `No wishlist found matching "${searchQuery}".`
                      : 'Tap the "+" button below to create your first wishlist and add items!'}
                  </Text>
                </View>
              )}
            </ScrollView>

            {/* Floating Action Plus Button */}
            <FloatingActionButton
              onPress={handleFabPress}
              onLongPress={handleFabLongPress}
              isDarkMode={isDarkMode}
            />

            {/* Hold Popup Menu */}
            <FabHoldMenuModal
              isVisible={isFabHoldMenuOpen}
              onClose={() => setIsFabHoldMenuOpen(false)}
              onNewList={handleCreateNewList}
              onNewItem={handleCreateNewItem}
              isDarkMode={isDarkMode}
            />

            {/* Create New Wishlist Modal */}
            <CreateNewWishlist
              isVisible={isCreateWishlistOpen}
              onClose={() => setIsCreateWishlistOpen(false)}
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
    paddingBottom: 110, // Ensure content isn't covered by bottom nav bar on mobile
  },
  desktopScrollContent: {
    paddingBottom: 5, // Reduced bottom padding when bottom nav bar is hidden
  },
});
