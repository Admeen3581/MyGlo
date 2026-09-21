import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Redirect } from 'expo-router';
import { useAuth, useUser } from '@clerk/expo';
import { useTheme } from '@/hooks/useTheme';
import { ScreenWrapper } from '@/components/wrapper/ScreenWrapper';
import { TopNavBar } from '@/components/navigation/TopNavBar';
import { BottomNavBar } from '@/components/navigation/BottomNavBar';
import { Sidebar } from '@/components/navigation/Sidebar';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const router = useRouter();
  const { isLoaded, isSignedIn, signOut } = useAuth();
  const { user } = useUser();
  const { isDarkMode, activeColors, toggleDarkMode } = useTheme();
  const { width } = useWindowDimensions();

  const isDesktop = width >= 768;

  // Navigation, search, and fold-out sidebar states
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
  const fullName = user?.fullName || user?.firstName || 'User';
  const primaryEmail = user?.primaryEmailAddress?.emailAddress || '';

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/onboarding' as any);
    } catch (err) {
      console.error('Error signing out:', err);
    }
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
          onAvatarPress={() => {}}
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
              activeTab="profile"
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
                YOUR ACCOUNT
              </Text>
              <Text
                style={{ color: activeColors.foreground }}
                className="text-3xl font-fraunces-bold"
              >
                Profile
              </Text>
            </View>

            {/* Profile Content ScrollView */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={[
                styles.scrollContent,
                isDesktop && styles.desktopScrollContent,
              ]}
            >
              <View className="px-5 py-4 max-w-lg">
                {/* User Card */}
                <View
                  style={{
                    backgroundColor: isDarkMode ? '#16222A' : '#FFFFFF',
                    borderColor: activeColors.border,
                  }}
                  className="rounded-2xl p-5 border border-solid shadow-sm mb-6 flex-row items-center gap-4"
                >
                  <View
                    style={{
                      borderColor: activeColors.primary,
                      backgroundColor: activeColors.muted,
                    }}
                    className="w-16 h-16 rounded-full border-2 items-center justify-center overflow-hidden"
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
                        size={32}
                        color={activeColors.mutedForeground}
                      />
                    )}
                  </View>
                  <View className="flex-1">
                    <Text
                      style={{ color: activeColors.foreground }}
                      className="text-xl font-fraunces-bold"
                    >
                      {fullName}
                    </Text>
                    {Boolean(primaryEmail) && (
                      <Text
                        style={{ color: activeColors.mutedForeground }}
                        className="text-sm font-nunito mt-0.5"
                      >
                        {primaryEmail}
                      </Text>
                    )}
                  </View>
                </View>

                {/* Settings Options */}
                <View
                  style={{
                    backgroundColor: isDarkMode ? '#16222A' : '#FFFFFF',
                    borderColor: activeColors.border,
                  }}
                  className="rounded-2xl border border-solid overflow-hidden mb-6"
                >
                  {/* Appearance Toggle */}
                  <TouchableOpacity
                    onPress={toggleDarkMode}
                    activeOpacity={0.7}
                    className="flex-row items-center justify-between px-5 py-4 border-b border-solid"
                    style={{ borderBottomColor: activeColors.border }}
                  >
                    <View className="flex-row items-center gap-3">
                      <Ionicons
                        name={isDarkMode ? 'moon' : 'sunny'}
                        size={22}
                        color={activeColors.primary}
                      />
                      <Text
                        style={{ color: activeColors.foreground }}
                        className="text-base font-nunito-semibold"
                      >
                        {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                      </Text>
                    </View>
                    <Ionicons
                      name="swap-horizontal"
                      size={20}
                      color={activeColors.mutedForeground}
                    />
                  </TouchableOpacity>

                  {/* Sign Out Action */}
                  <TouchableOpacity
                    onPress={handleSignOut}
                    activeOpacity={0.7}
                    className="flex-row items-center justify-between px-5 py-4"
                  >
                    <View className="flex-row items-center gap-3">
                      <Ionicons
                        name="log-out-outline"
                        size={22}
                        color="#EF4444"
                      />
                      <Text className="text-base font-nunito-semibold text-red-500">
                        Sign Out
                      </Text>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={18}
                      color={activeColors.mutedForeground}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>

        {/* Reusable Bottom Navigation Bar (Mobile only) */}
        {!isDesktop && (
          <BottomNavBar
            initTab={'profile'}
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
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 9999,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 110,
  },
  desktopScrollContent: {
    paddingBottom: 40,
  },
});
