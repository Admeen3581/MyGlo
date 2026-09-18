import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Redirect } from 'expo-router';
import { useAuth, useUser } from '@clerk/expo';
import { useQuery } from 'convex/react';
import { api } from '@/database/_generated/api';
import { useTheme } from '@/hooks/useTheme';
import { ScreenWrapper } from '@/components/wrapper/ScreenWrapper';
import { TopNavBar } from '@/components/navigation/TopNavBar';
import { BottomNavBar, NavTab } from '@/components/navigation/BottomNavBar';
import { WishlistCard } from '@/components/wishlist/WishlistCard';
import { FloatingActionButton } from '@/components/common/FloatingActionButton';
import { Ionicons } from '@expo/vector-icons';

export default function MyWishlistsScreen() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const { isDarkMode, activeColors } = useTheme();

  // Navigation and search states
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch wishlists owned by logged-in user via Convex
  const userWishlists = useQuery(
    api.wishlists.getMyWishlists,
    user?.id ? { clerkId: user.id } : 'skip'
  );

  // Fallback feed wishlists if user has no specific owned lists yet
  const feedWishlists = useQuery(api.wishlists.getFeed);

  // Use user's owned wishlists if available; fallback to feed wishlists if owned list is empty
  const rawWishlists = userWishlists && userWishlists.length > 0
    ? userWishlists
    : feedWishlists;

  // Filter wishlists based on search query
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
    // Action for creating items/lists (screens not implemented yet)
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
        {/* Top Navigation Bar: Left logo, center search bar, right avatar */}
        <TopNavBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          avatarUrl={avatarUrl}
          onAvatarPress={handleAvatarPress}
          isDarkMode={isDarkMode}
        />

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
          contentContainerStyle={styles.scrollContent}
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
                {searchQuery ? 'No matching wishlists' : 'No Wishlists Yet'}
              </Text>
              <Text
                style={{ color: activeColors.mutedForeground }}
                className="text-center text-sm font-nunito text-center max-w-[280px]"
              >
                {searchQuery
                  ? `No wishlist found matching "${searchQuery}".`
                  : 'Tap the "+" button below to create your first wishlist and add items!'}
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Floating Action Button (+) */}
        <FloatingActionButton
          onPress={handleFabPress}
          isDarkMode={isDarkMode}
        />

        {/* Reusable Bottom Navigation Bar */}
        <BottomNavBar
            initTab={'my-wishlists'}
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
    paddingBottom: 110, // Ensure content isn't covered by bottom nav bar
  },
});
