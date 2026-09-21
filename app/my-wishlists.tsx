import React, {useState} from 'react';
import {ActivityIndicator, ScrollView, StyleSheet, Text, useWindowDimensions, View,} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Redirect, useRouter} from 'expo-router';
import {useAuth, useUser} from '@clerk/expo';
import {useQuery} from 'convex/react';
import {api} from '@/database/_generated/api';
import {useTheme} from '@/hooks/useTheme';
import {ScreenWrapper} from '@/components/wrapper/ScreenWrapper';
import {TopNavBar} from '@/components/navigation/TopNavBar';
import {Sidebar} from '@/components/navigation/Sidebar';
import {WishlistCard} from '@/components/wishlist/WishlistCard';
import {FloatingActionButton} from '@/components/core/FloatingActionButton';
import {Ionicons} from '@expo/vector-icons';

export default function MyWishlistsScreen() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const { isDarkMode, activeColors } = useTheme();
  const { width } = useWindowDimensions();

  const isDesktop = width >= 768;

  // Navigation, search, and fold-out sidebar states
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(isDesktop);

  // Fetch only wishlists owned/created by the logged-in user via Convex
    const rawWishlists = useQuery(
      api.wishlists.getMyWishlists,
      user?.id ? {clerkId: user.id} : 'skip'
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
        {/* Top Navigation Bar: Left logo/hamburger, center search bar, right avatar */}
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
              activeTab="my-wishlists"
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
                /* Wishlist Cards List */
                <View className="px-5 pt-2">
                  {wishlists.map((item) => (
                    <WishlistCard
                      key={item._id}
                      wishlist={item}
                      isDarkMode={isDarkMode}
                      onPress={() => {
                        //TODO: Navigate to wishlist detail when implemented
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
    paddingBottom: 110, // Ensure content isn't covered by bottom nav bar on mobile
  },
  desktopScrollContent: {
    paddingBottom: 5, // Reduced bottom padding when bottom nav bar is hidden
  },
});
